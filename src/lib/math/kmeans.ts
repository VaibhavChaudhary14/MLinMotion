import { Point2D, Centroid, TraceEvent } from '@/types';

export interface KMeansStepResult {
  points: Point2D[];
  centroids: Centroid[];
  iteration: number;
  stage: 'init' | 'assign' | 'update' | 'converged';
  inertia: number;
  trace: TraceEvent;
  hasChanged: boolean;
}

export function euclideanDistSq(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

export function calculateInertia(points: Point2D[], centroids: Centroid[]): number {
  let sum = 0;
  for (const pt of points) {
    if (pt.cluster !== undefined && centroids[pt.cluster]) {
      sum += euclideanDistSq(pt, centroids[pt.cluster]);
    }
  }
  return Number(sum.toFixed(3));
}

// Bauhaus Palette for Centroids and Clusters
export const CENTROID_COLORS = [
  '#1848B8', // Ultramarine (K1)
  '#C83226', // Vermilion (K2)
  '#E28C05', // Cadmium Amber (K3)
  '#33634B', // Sage Green (K4)
  '#6E3867', // Plum (K5)
];

export function initializeCentroidsRandom(points: Point2D[], k: number, seed: number = 42): Centroid[] {
  // Simple deterministic pseudorandom selection based on seed
  const centroids: Centroid[] = [];
  const chosenIndices = new Set<number>();
  let currentSeed = seed;

  const pseudoRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  while (centroids.length < k && centroids.length < points.length) {
    const idx = Math.floor(pseudoRandom() * points.length);
    if (!chosenIndices.has(idx)) {
      chosenIndices.add(idx);
      const pt = points[idx];
      centroids.push({
        id: centroids.length,
        x: Number(pt.x.toFixed(2)),
        y: Number(pt.y.toFixed(2)),
        color: CENTROID_COLORS[centroids.length % CENTROID_COLORS.length],
        history: [{ x: Number(pt.x.toFixed(2)), y: Number(pt.y.toFixed(2)), step: 0 }],
      });
    }
  }

  return centroids;
}

export function initializeCentroidsKMeansPlusPlus(points: Point2D[], k: number, seed: number = 42): Centroid[] {
  if (points.length === 0 || k <= 0) return [];
  const centroids: Centroid[] = [];
  let currentSeed = seed;
  const pseudoRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  // 1. Pick first centroid uniformly at random
  const firstIdx = Math.floor(pseudoRandom() * points.length);
  centroids.push({
    id: 0,
    x: points[firstIdx].x,
    y: points[firstIdx].y,
    color: CENTROID_COLORS[0],
    history: [{ x: points[firstIdx].x, y: points[firstIdx].y, step: 0 }],
  });

  // 2. Choose remaining centroids with probability proportional to D(x)^2
  while (centroids.length < k) {
    const distSqList = points.map((p) => {
      let minDistSq = Infinity;
      for (const c of centroids) {
        const d = euclideanDistSq(p, c);
        if (d < minDistSq) minDistSq = d;
      }
      return minDistSq;
    });

    const sumDistSq = distSqList.reduce((acc, v) => acc + v, 0);
    const target = pseudoRandom() * sumDistSq;
    let cumulative = 0;
    let chosenIdx = 0;

    for (let i = 0; i < points.length; i++) {
      cumulative += distSqList[i];
      if (cumulative >= target) {
        chosenIdx = i;
        break;
      }
    }

    const nextId = centroids.length;
    centroids.push({
      id: nextId,
      x: points[chosenIdx].x,
      y: points[chosenIdx].y,
      color: CENTROID_COLORS[nextId % CENTROID_COLORS.length],
      history: [{ x: points[chosenIdx].x, y: points[chosenIdx].y, step: 0 }],
    });
  }

  return centroids;
}

// Assignment Step: Assign each point to the nearest centroid
export function assignClusters(points: Point2D[], centroids: Centroid[]): { updatedPoints: Point2D[]; changes: number } {
  let changes = 0;
  const updatedPoints = points.map((p) => {
    let bestCluster = 0;
    let minDistSq = Infinity;

    centroids.forEach((c, cIdx) => {
      const d = euclideanDistSq(p, c);
      if (d < minDistSq) {
        minDistSq = d;
        bestCluster = cIdx;
      }
    });

    if (p.cluster !== bestCluster) {
      changes++;
    }

    return {
      ...p,
      cluster: bestCluster,
      distToCentroid: Math.sqrt(minDistSq),
    };
  });

  return { updatedPoints, changes };
}

// Update Step: Compute mean coordinates for each cluster
export function updateCentroids(
  points: Point2D[],
  centroids: Centroid[],
  step: number
): { updatedCentroids: Centroid[]; maxShift: number } {
  let maxShift = 0;

  const updatedCentroids = centroids.map((c, cIdx) => {
    const clusterPoints = points.filter((p) => p.cluster === cIdx);
    if (clusterPoints.length === 0) {
      return {
        ...c,
        history: [...c.history, { x: c.x, y: c.y, step }],
      };
    }

    const sumX = clusterPoints.reduce((acc, p) => acc + p.x, 0);
    const sumY = clusterPoints.reduce((acc, p) => acc + p.y, 0);
    const newX = Number((sumX / clusterPoints.length).toFixed(3));
    const newY = Number((sumY / clusterPoints.length).toFixed(3));

    const shift = Math.sqrt(euclideanDistSq(c, { x: newX, y: newY }));
    if (shift > maxShift) maxShift = shift;

    return {
      ...c,
      x: newX,
      y: newY,
      history: [...c.history, { x: newX, y: newY, step }],
    };
  });

  return { updatedCentroids, maxShift };
}

// Full simulation runner that generates all steps for Algorithm Cinema
export function runFullKMeansTrace(
  initialPoints: Point2D[],
  initialCentroids: Centroid[],
  maxIterations: number = 20
): KMeansStepResult[] {
  const steps: KMeansStepResult[] = [];
  let currentPoints: Point2D[] = initialPoints.map((p) => ({ ...p, cluster: undefined }));
  let currentCentroids: Centroid[] = initialCentroids.map((c) => ({ ...c, history: [{ x: c.x, y: c.y, step: 0 }] }));
  let iteration = 0;

  // Scene 0: Initial State
  steps.push({
    points: currentPoints,
    centroids: currentCentroids,
    iteration: 0,
    stage: 'init',
    inertia: 0,
    trace: {
      step: 0,
      stageName: 'STAGE 01 // CENTROID INITIALIZATION',
      description: `Initialized ${currentCentroids.length} centroids on raw coordinate grid. Points remain unassigned.`,
      equationLatex: '\\boldsymbol{\\mu}_k^{(0)} \\sim \\mathcal{D}(\\mathbf{X}) \\quad \\text{for } k \\in \\{1, \\dots, K\\}',
      codeLine: 2,
      codeSnippet: 'centroids = initialize_centroids(X, k=k, method="kmeans++")',
      metrics: { K: currentCentroids.length, Iteration: 0, Inertia: '—' },
      internalState: { centroids: currentCentroids.map((c) => ({ id: c.id, x: c.x, y: c.y })) },
    },
    hasChanged: true,
  });

  for (iteration = 1; iteration <= maxIterations; iteration++) {
    // 1. Assignment Phase
    const { updatedPoints, changes } = assignClusters(currentPoints, currentCentroids);
    currentPoints = updatedPoints;
    const inertiaAfterAssign = calculateInertia(currentPoints, currentCentroids);

    steps.push({
      points: currentPoints,
      centroids: currentCentroids,
      iteration,
      stage: 'assign',
      inertia: inertiaAfterAssign,
      trace: {
        step: steps.length,
        stageName: `ITER ${iteration} // VORONOI ASSIGNMENT`,
        description: `Evaluated squared Euclidean distances for all ${currentPoints.length} points. Assigned to nearest centroid disc. Changes: ${changes}.`,
        equationLatex: 'c^{(i)} = \\arg\\min_{k} \\|\\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_k\\|^2',
        codeLine: 6,
        codeSnippet: 'labels = np.argmin(cdist(X, centroids, metric="sqeuclidean"), axis=1)',
        metrics: { Iteration: iteration, Changes: changes, Inertia: inertiaAfterAssign },
        internalState: { reassignments: changes },
      },
      hasChanged: changes > 0,
    });

    // 2. Centroid Update Phase
    const { updatedCentroids, maxShift } = updateCentroids(currentPoints, currentCentroids, iteration);
    currentCentroids = updatedCentroids;
    const inertiaAfterUpdate = calculateInertia(currentPoints, currentCentroids);

    const isConverged = maxShift < 0.005 || changes === 0;

    steps.push({
      points: currentPoints,
      centroids: currentCentroids,
      iteration,
      stage: isConverged ? 'converged' : 'update',
      inertia: inertiaAfterUpdate,
      trace: {
        step: steps.length,
        stageName: isConverged ? 'STATUS // CONVERGENCE ACHIEVED' : `ITER ${iteration} // CENTROID RECOMPUTATION`,
        description: isConverged
          ? `Centroid movement settled below threshold (Δ = ${maxShift.toFixed(4)}px). Partition is mathematically stable.`
          : `Shifted centroids to the geometric mean of their member clusters. Max displacement: ${maxShift.toFixed(3)}px.`,
        equationLatex: isConverged
          ? '\\|\\boldsymbol{\\mu}_k^{(t+1)} - \\boldsymbol{\\mu}_k^{(t)}\\| < \\epsilon \\implies \\text{Convergence}'
          : '\\boldsymbol{\\mu}_k^{(t+1)} = \\frac{1}{|S_k|} \\sum_{i \\in S_k} \\mathbf{x}^{(i)}',
        codeLine: 10,
        codeSnippet: 'centroids = np.array([X[labels == k].mean(axis=0) for k in range(k)])',
        metrics: { Iteration: iteration, 'Max Shift': Number(maxShift.toFixed(3)), Inertia: inertiaAfterUpdate },
        internalState: { maxShift, isConverged },
      },
      hasChanged: maxShift > 0.005,
    });

    if (isConverged) break;
  }

  return steps;
}
