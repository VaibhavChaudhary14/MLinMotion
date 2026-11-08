import type { Point2D } from '../../types/index.ts';
import { seededRandom, generateGaussian } from './benchmarks.ts';

export type KMeansFailureScenarioId = 'separated' | 'concentric' | 'outliers' | 'poor_init';

export interface KMeansFailureScenario {
  id: KMeansFailureScenarioId;
  title: string;
  subtitle: string;
  eyebrow: string;
  recommendedK: number;
  description: string;
  whyKMeansFailsOrSucceeds: string;
  misconceptionAddressed: string;
  generate: () => { points: Point2D[]; suggestedManualCentroids?: Array<{ x: number; y: number }> };
}

export const KMEANS_FAILURE_SCENARIOS: Record<KMeansFailureScenarioId, KMeansFailureScenario> = {
  separated: {
    id: 'separated',
    title: 'Separated Spherical Blobs',
    subtitle: 'Optimal operating regime for Euclidean distance partitioning.',
    eyebrow: 'SCENARIO 01 // THE IDEAL BASELINE',
    recommendedK: 3,
    description:
      'Three isotropic Gaussian clusters with equal variance and clear spatial separation. Demonstrates standard Lloyd convergence in 3–5 iterations.',
    whyKMeansFailsOrSucceeds:
      'Succeeds reliably because cluster boundaries are linearly separable and cluster densities are uniform and spherical.',
    misconceptionAddressed:
      'Establishes the baseline expectation that K-Means operates on center-of-mass spherical geometry.',
    generate: () => {
      const rand = seededRandom(42);
      const points: Point2D[] = [];
      const centers = [
        { x: 130, y: 130 },
        { x: 420, y: 140 },
        { x: 280, y: 340 },
      ];
      centers.forEach((c, cIdx) => {
        for (let i = 0; i < 24; i++) {
          const x = generateGaussian(rand, c.x, 24);
          const y = generateGaussian(rand, c.y, 24);
          points.push({
            id: `sep-${cIdx}-${i}`,
            x: Math.max(30, Math.min(570, Number(x.toFixed(1)))),
            y: Math.max(30, Math.min(420, Number(y.toFixed(1)))),
            initialCluster: cIdx,
          });
        }
      });
      return { points };
    },
  },

  concentric: {
    id: 'concentric',
    title: 'Nested Concentric Rings',
    subtitle: 'Failure of linear Voronoi hyperplanes on non-convex manifolds.',
    eyebrow: 'SCENARIO 02 // NON-CONVEX MANIFOLD BREAKPOINT',
    recommendedK: 2,
    description:
      'An inner dense circle enveloped by an outer concentric ring. K-Means attempts to draw straight bisector lines through the center, cutting both rings in half.',
    whyKMeansFailsOrSucceeds:
      'Fails fundamentally because K-Means assignment boundaries are convex polyhedra (Voronoi cells). No combination of convex cells can isolate an outer shell from an inner core without slicing both.',
    misconceptionAddressed:
      'Debunks the myth that "K-Means can cluster any arbitrary geometric shape if given enough iterations".',
    generate: () => {
      const rand = seededRandom(77);
      const points: Point2D[] = [];
      const cx = 300;
      const cy = 230;

      // Inner dense core (r = 45)
      for (let i = 0; i < 28; i++) {
        const angle = rand() * 2 * Math.PI;
        const r = 45 + generateGaussian(rand, 0, 7);
        points.push({
          id: `inner-${i}`,
          x: Number((cx + r * Math.cos(angle)).toFixed(1)),
          y: Number((cy + r * Math.sin(angle)).toFixed(1)),
          initialCluster: 0,
        });
      }

      // Outer ring (r = 140)
      for (let i = 0; i < 56; i++) {
        const angle = rand() * 2 * Math.PI;
        const r = 140 + generateGaussian(rand, 0, 9);
        points.push({
          id: `outer-${i}`,
          x: Math.max(25, Math.min(575, Number((cx + r * Math.cos(angle)).toFixed(1)))),
          y: Math.max(25, Math.min(425, Number((cy + r * Math.sin(angle)).toFixed(1)))),
          initialCluster: 1,
        });
      }

      return { points };
    },
  },

  outliers: {
    id: 'outliers',
    title: 'Extreme Outlier Leverage',
    subtitle: 'Sensitivity of arithmetic mean center-of-mass updates to anomalous noise.',
    eyebrow: 'SCENARIO 03 // ARITHMETIC MEAN LEVERAGE',
    recommendedK: 2,
    description:
      'Two compact, dense natural clusters plus two extreme outlier points placed in the far corners. The arithmetic mean formula drags centroids toward the outliers.',
    whyKMeansFailsOrSucceeds:
      'Fails because the centroid update formula μ_k = (1/|S_k|) ∑ x_i squares distances in its objective, giving remote outliers unbounded leverage over the mean.',
    misconceptionAddressed:
      'Demonstrates why data cleaning and outlier trimming (or medoid clustering via K-Medoids / PAM) are required before applying K-Means.',
    generate: () => {
      const rand = seededRandom(101);
      const points: Point2D[] = [];
      const centers = [
        { x: 180, y: 220 },
        { x: 380, y: 240 },
      ];

      centers.forEach((c, cIdx) => {
        for (let i = 0; i < 30; i++) {
          const x = generateGaussian(rand, c.x, 22);
          const y = generateGaussian(rand, c.y, 22);
          points.push({
            id: `dense-${cIdx}-${i}`,
            x: Math.max(30, Math.min(570, Number(x.toFixed(1)))),
            y: Math.max(30, Math.min(420, Number(y.toFixed(1)))),
            initialCluster: cIdx,
          });
        }
      });

      // Extreme leverage outliers
      points.push(
        { id: 'outlier-topright', x: 550, y: 50, isOutlier: true, label: 99 },
        { id: 'outlier-bottomleft', x: 50, y: 400, isOutlier: true, label: 99 }
      );

      return { points };
    },
  },

  poor_init: {
    id: 'poor_init',
    title: 'Adversarial Initial Traps',
    subtitle: 'Local minima stagnation due to coordinate-wise greedy updates.',
    eyebrow: 'SCENARIO 04 // LOCAL MINIMA SENSITIVITY',
    recommendedK: 3,
    description:
      'Three well-separated clusters, but initial centroids μ₁ and μ₂ are intentionally placed side-by-side inside Cluster 1, while Cluster 3 has no nearby centroid.',
    whyKMeansFailsOrSucceeds:
      'Stagnates in a sub-optimal local minimum: the two competing centroids split Cluster 1 in half, while a single centroid is forced to span both Cluster 2 and Cluster 3, severely inflating WCSS.',
    misconceptionAddressed:
      'Illustrates why random initialization is vulnerable to initial seeds and why K-Means++ (D² distance weighting) was invented.',
    generate: () => {
      const rand = seededRandom(88);
      const points: Point2D[] = [];
      const centers = [
        { x: 140, y: 240 }, // Cluster 1
        { x: 320, y: 240 }, // Cluster 2
        { x: 500, y: 240 }, // Cluster 3
      ];

      centers.forEach((c, cIdx) => {
        for (let i = 0; i < 25; i++) {
          const x = generateGaussian(rand, c.x, 20);
          const y = generateGaussian(rand, c.y, 20);
          points.push({
            id: `trap-${cIdx}-${i}`,
            x: Math.max(30, Math.min(570, Number(x.toFixed(1)))),
            y: Math.max(30, Math.min(420, Number(y.toFixed(1)))),
            initialCluster: cIdx,
          });
        }
      });

      // Adversarial starting centroids: μ1 and μ2 both crowded in cluster 1
      const suggestedManualCentroids = [
        { x: 120, y: 220 }, // μ1 in cluster 1
        { x: 160, y: 260 }, // μ2 also in cluster 1
        { x: 340, y: 240 }, // μ3 in cluster 2 (cluster 3 completely stranded!)
      ];

      return { points, suggestedManualCentroids };
    },
  },
};
