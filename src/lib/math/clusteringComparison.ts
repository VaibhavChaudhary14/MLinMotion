import { Point2D } from '@/types';
import { euclideanDistSq } from './kmeans';

export interface ClusteringModelResult {
  algorithm: string;
  labels: number[];
  numClusters: number;
  noiseCount: number;
  runtimeMs: number;
  silhouetteScore: number;
  inertia?: number;
  summaryExplanation: string;
}

// Compute Silhouette Score for 2D points
export function calculateSilhouetteScore(points: Point2D[], labels: number[]): number {
  const n = points.length;
  if (n < 3) return 0;

  const uniqueClusters = Array.from(new Set(labels)).filter((l) => l >= 0);
  if (uniqueClusters.length < 2) return 0;

  const clusterMap = new Map<number, number[]>();
  uniqueClusters.forEach((c) => clusterMap.set(c, []));
  labels.forEach((l, idx) => {
    if (l >= 0 && clusterMap.has(l)) {
      clusterMap.get(l)!.push(idx);
    }
  });

  let totalSilhouette = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const myCluster = labels[i];
    if (myCluster < 0) continue; // Skip noise

    const myClusterIndices = clusterMap.get(myCluster)!;
    if (myClusterIndices.length <= 1) {
      continue;
    }

    // a(i): average distance to points in same cluster
    let aSum = 0;
    for (const j of myClusterIndices) {
      if (i !== j) {
        aSum += Math.sqrt(euclideanDistSq(points[i], points[j]));
      }
    }
    const a = aSum / (myClusterIndices.length - 1);

    // b(i): minimum average distance to other clusters
    let minB = Infinity;
    for (const otherCluster of uniqueClusters) {
      if (otherCluster === myCluster) continue;
      const otherIndices = clusterMap.get(otherCluster)!;
      if (otherIndices.length === 0) continue;

      let bSum = 0;
      for (const j of otherIndices) {
        bSum += Math.sqrt(euclideanDistSq(points[i], points[j]));
      }
      const bAvg = bSum / otherIndices.length;
      if (bAvg < minB) minB = bAvg;
    }

    const s = (minB - a) / Math.max(a, minB);
    totalSilhouette += s;
    count++;
  }

  return count > 0 ? Number((totalSilhouette / count).toFixed(3)) : 0;
}

// Client-side DBSCAN implementation
export function runDBSCAN(points: Point2D[], eps: number = 30, minPts: number = 4): ClusteringModelResult {
  const startTime = performance.now();
  const n = points.length;
  const labels = new Array(n).fill(-1); // -1 = noise or unvisited
  const visited = new Array(n).fill(false);
  let clusterId = 0;

  const epsSq = eps * eps;

  const regionQuery = (ptIdx: number): number[] => {
    const neighbors: number[] = [];
    for (let j = 0; j < n; j++) {
      if (euclideanDistSq(points[ptIdx], points[j]) <= epsSq) {
        neighbors.push(j);
      }
    }
    return neighbors;
  };

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;

    const neighbors = regionQuery(i);
    if (neighbors.length < minPts) {
      labels[i] = -1; // Mark as noise for now
    } else {
      labels[i] = clusterId;
      const queue = [...neighbors];

      let qIdx = 0;
      while (qIdx < queue.length) {
        const currentPt = queue[qIdx++];
        if (!visited[currentPt]) {
          visited[currentPt] = true;
          const currentNeighbors = regionQuery(currentPt);
          if (currentNeighbors.length >= minPts) {
            queue.push(...currentNeighbors);
          }
        }
        if (labels[currentPt] < 0) {
          labels[currentPt] = clusterId;
        }
      }
      clusterId++;
    }
  }

  const runtimeMs = Number((performance.now() - startTime).toFixed(2));
  const noiseCount = labels.filter((l) => l === -1).length;
  const numClusters = clusterId;
  const silhouette = calculateSilhouetteScore(points, labels);

  return {
    algorithm: 'DBSCAN',
    labels,
    numClusters,
    noiseCount,
    runtimeMs,
    silhouetteScore: silhouette,
    summaryExplanation: `Found ${numClusters} density-connected clusters with ${noiseCount} noise points (outliers). Does not force spherical geometry.`,
  };
}

// Client-side Agglomerative Hierarchical Clustering
export function runAgglomerative(points: Point2D[], k: number = 3): ClusteringModelResult {
  const startTime = performance.now();
  const n = points.length;
  if (n <= k) {
    const labels = points.map((_, i) => i);
    return {
      algorithm: 'Agglomerative Clustering',
      labels,
      numClusters: n,
      noiseCount: 0,
      runtimeMs: 0.1,
      silhouetteScore: 0,
      summaryExplanation: 'Clusters equal data points.',
    };
  }

  // Each point starts as its own cluster
  let clusters: number[][] = points.map((_, i) => [i]);

  while (clusters.length > k) {
    let bestDist = Infinity;
    let mergeI = 0;
    let mergeJ = 1;

    // Average linkage distance between cluster i and cluster j
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        let sumDist = 0;
        for (const idx1 of clusters[i]) {
          for (const idx2 of clusters[j]) {
            sumDist += Math.sqrt(euclideanDistSq(points[idx1], points[idx2]));
          }
        }
        const avgDist = sumDist / (clusters[i].length * clusters[j].length);
        if (avgDist < bestDist) {
          bestDist = avgDist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }

    // Merge clusters mergeI and mergeJ
    clusters[mergeI] = [...clusters[mergeI], ...clusters[mergeJ]];
    clusters.splice(mergeJ, 1);
  }

  const labels = new Array(n).fill(0);
  clusters.forEach((clusterIndices, clusterIdx) => {
    clusterIndices.forEach((ptIdx) => {
      labels[ptIdx] = clusterIdx;
    });
  });

  const runtimeMs = Number((performance.now() - startTime).toFixed(2));
  const silhouette = calculateSilhouetteScore(points, labels);

  return {
    algorithm: 'Agglomerative (Hierarchical)',
    labels,
    numClusters: k,
    noiseCount: 0,
    runtimeMs,
    silhouetteScore: silhouette,
    summaryExplanation: `Constructed bottom-up hierarchical dendrogram and cut at K = ${k}. Average linkage merges compact clusters.`,
  };
}
