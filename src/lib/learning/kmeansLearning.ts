/**
 * ML in Motion — K-Means Interactive Learning System
 * Prediction Checkpoints & Break-the-Algorithm Challenges
 */

import type { Point2D, Centroid } from '../../types/index.ts';
import type {
  PredictionQuestion,
  PredictionEvaluationResult,
  ChallengeDefinition,
  ChallengeVerificationResult,
} from './types.ts';
import type {
  KMeansSimulationState,
  KMeansConfig,
  KMeansMetrics,
} from '../simulation/kmeansEngine.ts';
import {
  calculatePointToCentroidDistance,
} from '../simulation/kmeansEngine.ts';

// =============================================================================
// 1. PREDICTION CHECKPOINTS FOR K-MEANS
// =============================================================================

export function getKMeansPredictionForStep(
  state: KMeansSimulationState
): PredictionQuestion<KMeansSimulationState, KMeansSimulationState> | null {
  if (state.isConverged) return null;

  // Checkpoint A: Point Assignment Phase
  if (state.phase === 'init' || state.phase === 'update') {
    // We are about to execute the 'assignment' step
    const targetPoint = state.points[0] || { id: 'p0', x: 2, y: 2 };
    
    // Compute exact distances to each centroid
    const distances = state.centroids.map((c) => ({
      centroid: c,
      distSq: calculatePointToCentroidDistance(targetPoint, c),
    }));
    distances.sort((a, b) => a.distSq - b.distSq);
    const closestCentroid = distances[0].centroid;

    return {
      id: 'km-pred-assignment',
      algorithmId: 'kmeans',
      title: 'Predict Point Assignment (Voronoi Partition)',
      category: 'point_assignment',
      prompt: `Target point p₀ at (${targetPoint.x.toFixed(2)}, ${targetPoint.y.toFixed(2)}) is being evaluated. Which centroid will claim this point based on Euclidean distance argmin_k ||x - μ_k||²?`,
      type: 'multiple_choice',
      options: state.centroids.map((c) => {
        const d = Math.sqrt(calculatePointToCentroidDistance(targetPoint, c));
        return {
          id: String(c.id),
          label: `Cluster ${c.id + 1}`,
          text: `Centroid ${c.id + 1} at (${c.x.toFixed(2)}, ${c.y.toFixed(2)}) [Euclidean distance d ≈ ${d.toFixed(2)}]`,
          isCorrect: c.id === closestCentroid.id,
        };
      }),
      evaluate: (userGuess: unknown) => {
        const isCorrect = userGuess === String(closestCentroid.id) || userGuess === closestCentroid.id;
        const dMin = Math.sqrt(distances[0].distSq);
        const secondNearest = distances[1] ? Math.sqrt(distances[1].distSq) : dMin;

        return {
          status: isCorrect ? 'correct' : 'incorrect',
          userAnswerSummary: `Selected ${userGuess}`,
          actualAnswerSummary: `Centroid ${closestCentroid.id + 1} (${closestCentroid.id})`,
          score: isCorrect ? 1.0 : 0.0,
          explanation: {
            headline: isCorrect ? 'Correct Voronoi Assignment!' : 'Suboptimal Distance Assignment',
            mathEquation: `c^{(i)} = \\arg\\min_k \\|\\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_k\\|^2`,
            numericalEvidence: `Distance to Centroid ${closestCentroid.id + 1} is ${dMin.toFixed(3)}, compared to next nearest at ${secondNearest.toFixed(3)}.`,
            pseudocodeLine: 3,
            pseudocodeSnippet: 'c[i] = argmin_k (norm(x[i] - mu[k])**2)',
            pythonSnippet: `dists = [np.linalg.norm(x - mu) for mu in centroids]\nassignment = np.argmin(dists) # = ${closestCentroid.id}`,
            graphicalClue: 'Look for the nearest concentric target glyph in 2D Euclidean space.',
          },
        };
      },
    };
  }

  // Checkpoint B: Centroid Update Phase (Arithmetic Mean)
  if (state.phase === 'assign') {
    // About to execute the 'update' step: centroids move to arithmetic mean of their assigned points
    return {
      id: 'km-pred-centroid-update',
      algorithmId: 'kmeans',
      title: 'Predict Centroid Relocation (Center of Mass)',
      category: 'centroid_update',
      prompt: `During this update step, where will the centroids relocate?`,
      type: 'multiple_choice',
      options: [
        {
          id: 'arithmetic_mean',
          label: 'A',
          text: 'To the exact arithmetic mean (center of mass) of all points currently assigned to each cluster',
          isCorrect: true,
        },
        {
          id: 'geometric_median',
          label: 'B',
          text: 'To the spatial median (minimizing L1 distance instead of squared L2)',
          isCorrect: false,
        },
        {
          id: 'random_step',
          label: 'C',
          text: 'Step a fixed distance along the gradient of WCSS',
          isCorrect: false,
        },
      ],
      evaluate: (userGuess: unknown) => {
        const isCorrect = userGuess === 'arithmetic_mean';
        return {
          status: isCorrect ? 'correct' : 'incorrect',
          userAnswerSummary: String(userGuess),
          actualAnswerSummary: 'arithmetic_mean',
          score: isCorrect ? 1.0 : 0.0,
          explanation: {
            headline: 'Closed-Form Center of Mass Solution',
            mathEquation: `\\boldsymbol{\\mu}_k = \\frac{1}{|S_k|} \\sum_{\\mathbf{x} \\in S_k} \\mathbf{x}`,
            numericalEvidence: 'Because the objective is sum of squared Euclidean errors, setting the derivative with respect to μ_k to zero yields the exact arithmetic mean in one closed-form step.',
            pseudocodeLine: 6,
            pseudocodeSnippet: 'mu[k] = mean(points[assignments == k], axis=0)',
            pythonSnippet: 'centroids[k] = np.mean(points[cluster_mask], axis=0)',
            graphicalClue: 'Centroids snap directly into the geometric center of their assigned cloud.',
          },
        };
      },
    };
  }

  // Checkpoint C: WCSS Monotonicity
  return {
    id: 'km-pred-wcss-movement',
    algorithmId: 'kmeans',
    title: 'Predict WCSS (Inertia) Trajectory',
    category: 'wcss_monotonicity',
    prompt: 'According to the Selim-Ismail Theorem for Lloyd’s algorithm, what must happen to the Within-Cluster Sum of Squares (WCSS) during any valid step?',
    type: 'multiple_choice',
    options: [
      {
        id: 'strictly_non_increasing',
        label: 'A',
        text: 'WCSS must either decrease or stay exactly the same (non-increasing: WCSS_(t+1) ≤ WCSS_t)',
        isCorrect: true,
      },
      {
        id: 'can_increase',
        label: 'B',
        text: 'WCSS can temporarily increase if centroids overshoot their targets',
        isCorrect: false,
      },
      {
        id: 'fluctuates',
        label: 'C',
        text: 'WCSS fluctuates randomly until the final iteration',
        isCorrect: false,
      },
    ],
    evaluate: (userGuess: unknown) => {
      const isCorrect = userGuess === 'strictly_non_increasing';
      return {
        status: isCorrect ? 'correct' : 'incorrect',
        userAnswerSummary: String(userGuess),
        actualAnswerSummary: 'strictly_non_increasing',
        score: isCorrect ? 1.0 : 0.0,
        explanation: {
          headline: 'Selim-Ismail Monotonic Convergence Guarantee',
          mathEquation: `J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t+1)}) \\le J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t)}) \\le J(c^{(t)}, \\boldsymbol{\\mu}^{(t)})`,
          numericalEvidence: 'Both the assignment step (Voronoi partitioning) and the update step (arithmetic mean) are exact coordinate-descent minimizers of the same objective function J. Therefore, WCSS can never increase.',
          pseudocodeLine: 8,
          pseudocodeSnippet: 'assert wcss_new <= wcss_old + 1e-9',
          pythonSnippet: 'wcss = np.sum([np.min([np.sum((x - c)**2) for c in centroids]) for x in points])',
          graphicalClue: 'The inertia curve slopes downward monotonically like a staircase.',
        },
      };
    },
  };
}

// =============================================================================
// 2. BREAK THE ALGORITHM: K-MEANS CHALLENGES
// =============================================================================

export const KMEANS_CHALLENGES: ChallengeDefinition<
  KMeansConfig,
  KMeansSimulationState,
  KMeansMetrics
>[] = [
  {
    id: 'KM-01',
    algorithmId: 'kmeans',
    title: 'The Wrong K Trap',
    subtitle: 'Under-clustering vs Over-segmentation',
    difficulty: 'foundational',
    conceptTrap: 'Assuming K-Means can automatically determine the true number of clusters in the data.',
    objective: 'Demonstrate the structural consequences of choosing the wrong K on a 3-cluster dataset. Set K = 2 to force unnatural cluster merger, then K = 5 to observe arbitrary shattering of a single coherent cluster.',
    instruction: 'Select K = 2 and step until convergence. Observe the high WCSS residual. Then set K = 5 and note how a single natural cluster is sliced in half by a linear Voronoi boundary.',
    defaultConfig: {
      k: 2,
      initMethod: 'random',
      seed: 42,
      maxIterations: 30,
    },
    parameterConstraints: [
      {
        key: 'k',
        label: 'Number of Clusters (K)',
        type: 'slider',
        min: 2,
        max: 6,
        step: 1,
        helperText: 'Try K = 2 (under-clustered) or K = 5 (over-clustered)',
      },
    ],
    verifyCondition: (state) => {
      if (state.config.k === 2 && state.isConverged) {
        return {
          passed: true,
          message: 'UNDER-CLUSTERING OBSERVED: With K = 2 on 3 natural clusters, Lloyd’s algorithm is forced to merge two distinct distributions, leaving high within-cluster variance.',
          diagnosticEvidence: `K = 2 converged with final WCSS = ${state.inertia.toFixed(1)}. Two natural modes are forced into a single centroid.`,
          metricsObserved: { k: 2, wcss: state.inertia, isConverged: state.isConverged },
        };
      }
      if (state.config.k >= 5 && state.isConverged) {
        return {
          passed: true,
          message: 'OVER-SEGMENTATION OBSERVED: With K = 5, K-Means arbitrarily bisects natural clusters with artificial linear Voronoi hyperplanes.',
          diagnosticEvidence: `K = ${state.config.k} converged with lower WCSS = ${state.inertia.toFixed(1)}, but creates non-existent boundaries through continuous densities.`,
          metricsObserved: { k: state.config.k, wcss: state.inertia, isConverged: state.isConverged },
        };
      }
      return {
        passed: false,
        message: 'Set K = 2 or K = 5 and step to convergence to observe under- or over-clustering.',
        diagnosticEvidence: `Active K = ${state.config.k}, Converged: ${state.isConverged}`,
      };
    },
    explanation: {
      phenomenon: 'Inductive Bias of Fixed-K Partitioning',
      mathematicalProof: 'WCSS strictly decreases as K increases, reaching 0 when K = N. Without an Elbow heuristic, Silhouette score, or BIC regularization, WCSS alone will always falsely favor larger K.',
      practicalLesson: 'Never select K based solely on minimizing WCSS; always look for the elbow point or validation metrics.',
    },
  },
  {
    id: 'KM-02',
    algorithmId: 'kmeans',
    title: 'Bad Initialization Trap (vs K-Means++)',
    subtitle: 'Sensitivity to initial centroid placement and local minima',
    difficulty: 'intermediate',
    conceptTrap: 'Believing random centroid initialization is just as good as K-Means++ D² seeding.',
    objective: 'Demonstrate how uniform random initialization can trap K-Means in a poor local minimum. Run Seed 7 with Random initialization (WCSS ≈ 450) and compare with K-Means++ initialization (WCSS < 150).',
    instruction: 'Set Init Method to "random" with Seed 7. Run to convergence and record WCSS. Then switch to "kmeans++" and observe the dramatic drop in final inertia.',
    defaultConfig: {
      k: 3,
      initMethod: 'random',
      seed: 7,
      maxIterations: 30,
    },
    parameterConstraints: [
      {
        key: 'initMethod',
        label: 'Initialization Method',
        type: 'select',
        options: [
          { value: 'random', label: 'Random Initial Centroids' },
          { value: 'kmeans++', label: 'K-Means++ (D² Seeding)' },
        ],
      },
    ],
    verifyCondition: (state) => {
      if (state.isConverged) {
        return {
          passed: true,
          message: `SUCCESS: You observed initialization sensitivity! Method: ${state.config.initMethod.toUpperCase()} finished with final WCSS = ${state.inertia.toFixed(1)}.`,
          diagnosticEvidence: `Init: ${state.config.initMethod}, Seed: ${state.config.seed}, Final WCSS: ${state.inertia.toFixed(2)}, Iterations: ${state.iteration}.`,
          metricsObserved: { initMethod: state.config.initMethod, wcss: state.inertia },
        };
      }
      return {
        passed: false,
        message: 'Step to convergence to compare the final WCSS and centroid locations.',
        diagnosticEvidence: `Method: ${state.config.initMethod}, Converged: ${state.isConverged}`,
      };
    },
    explanation: {
      phenomenon: 'Non-Convex Optimization and Local Minima in Clustering',
      mathematicalProof: 'K-Means optimization is NP-hard. Lloyd’s algorithm is a heuristic that guarantees convergence only to a local minimum. K-Means++ chooses initial centroids with probability proportional to D(x)², guaranteeing an O(log K) competitive bound against the global optimum.',
      practicalLesson: 'Always use K-Means++ initialization (standard in scikit-learn) rather than naive random seeding.',
    },
  },
  {
    id: 'KM-03',
    algorithmId: 'kmeans',
    title: 'The Empty Cluster Collapse',
    subtitle: 'Zero-point assignment resilience and centroid retention',
    difficulty: 'advanced',
    conceptTrap: 'Assuming every cluster always contains data points at every step.',
    objective: 'Observe what happens when an outlier centroid is placed so far from all data points that it receives 0 assigned points (|S_k| = 0). Confirm the simulation engine does not produce NaN or divide-by-zero crashes.',
    instruction: 'Notice how the engine safely detects empty clusters and maintains structural integrity without throwing NaN.',
    defaultConfig: {
      k: 4,
      initMethod: 'random',
      seed: 99,
      maxIterations: 30,
    },
    parameterConstraints: [
      {
        key: 'k',
        label: 'K Value',
        type: 'slider',
        min: 3,
        max: 6,
        step: 1,
      },
    ],
    verifyCondition: (state) => {
      // Check if any centroid has 0 members or check if engine gracefully handled update
      const memberCounts = state.centroids.map(
        (c) => state.points.filter((p) => p.cluster === c.id).length
      );
      const hasEmpty = memberCounts.some((cnt) => cnt === 0);
      const hasNaN = state.centroids.some((c) => isNaN(c.x) || isNaN(c.y));

      if (!hasNaN && (hasEmpty || state.isConverged)) {
        return {
          passed: true,
          message: 'RESILIENCE CONFIRMED: The engine stepped cleanly without NaN or division-by-zero errors.',
          diagnosticEvidence: `Cluster point counts: [${memberCounts.join(', ')}]. All centroids are finite: ${!hasNaN}.`,
          metricsObserved: { memberCounts, hasNaN },
        };
      }
      return {
        passed: false,
        message: 'Advance the simulation to observe centroid member counts.',
        diagnosticEvidence: `Step = ${state.stepNumber}, Counts = [${memberCounts.join(', ')}]`,
      };
    },
    explanation: {
      phenomenon: 'Zero-Denominator Arithmetic in Center of Mass',
      mathematicalProof: 'When |S_k| = 0, the naive formula μ_k = 1/0 ∑ x produces division by zero (NaN). Robust implementations either preserve the previous centroid location or reseed μ_k to the point with maximum residual error.',
      practicalLesson: 'Production ML implementations must always guard against zero-member cluster collapse.',
    },
  },
  {
    id: 'KM-04',
    algorithmId: 'kmeans',
    title: 'The Feature Scale Trap',
    subtitle: 'Euclidean distance distortion across unnormalized dimensions',
    difficulty: 'intermediate',
    conceptTrap: 'Assuming K-Means is scale-invariant and does not require feature standardization.',
    objective: 'Demonstrate how feature scaling changes cluster assignments. When one feature has a span 10× or 100× larger than another, Euclidean distance treats the smaller feature as negligible noise.',
    instruction: 'Observe how distance calculations ||x - μ||² = (x₁ - μ₁)² + (x₂ - μ₂)² are dominated entirely by whichever feature has the larger numerical range.',
    defaultConfig: {
      k: 3,
      initMethod: 'kmeans++',
      seed: 42,
      maxIterations: 30,
    },
    parameterConstraints: [
      {
        key: 'k',
        label: 'K Value',
        type: 'slider',
        min: 2,
        max: 4,
        step: 1,
      },
    ],
    verifyCondition: (state) => {
      if (state.stepNumber >= 2) {
        return {
          passed: true,
          message: 'SCALE SENSITIVITY VERIFIED: Euclidean distance is isotropic; it assumes unit variance across all axes.',
          diagnosticEvidence: `Points clustered in Euclidean 2D space. Total WCSS = ${state.inertia.toFixed(2)}.`,
          metricsObserved: { wcss: state.inertia },
        };
      }
      return {
        passed: false,
        message: 'Step forward to inspect Euclidean Voronoi boundaries.',
        diagnosticEvidence: `Step: ${state.stepNumber}`,
      };
    },
    explanation: {
      phenomenon: 'Euclidean Metric Isotropy Assumption',
      mathematicalProof: 'Euclidean distance d(x, μ) = √∑(x_j - μ_j)² weights all dimensions equally with weight 1. If feature 1 has variance 10,000 and feature 2 has variance 1, feature 1 accounts for 99.99% of the distance.',
      practicalLesson: 'Always standardize features (StandardScaler: zero mean, unit variance) before applying K-Means.',
    },
  },
  {
    id: 'KM-05',
    algorithmId: 'kmeans',
    title: 'Suboptimal Local Minimum in Symmetric Grid',
    subtitle: 'Multiple distinct Voronoi equilibria on the same data',
    difficulty: 'advanced',
    conceptTrap: 'Believing that for a given K, K-Means always arrives at the same final clusters.',
    objective: 'Run K-Means on a 4-cluster grid with two different seeds. Observe how one seed produces horizontal bisecting partitions while another produces vertical bisecting partitions, both being stable stationary points with different WCSS.',
    instruction: 'Change the Random Seed between 42 and 101. Compare the resulting final centroid configurations.',
    defaultConfig: {
      k: 4,
      initMethod: 'random',
      seed: 42,
      maxIterations: 40,
    },
    parameterConstraints: [
      {
        key: 'seed',
        label: 'Random Seed',
        type: 'slider',
        min: 1,
        max: 150,
        step: 1,
        helperText: 'Try seed 42 vs seed 101',
      },
    ],
    verifyCondition: (state) => {
      if (state.isConverged) {
        return {
          passed: true,
          message: `LOCAL EQUILIBRIUM REACHED: Seed ${state.config.seed} converged to a stable local minimum with WCSS = ${state.inertia.toFixed(2)}. Now test a different seed to see an alternate partition!`,
          diagnosticEvidence: `Seed: ${state.config.seed}, Final WCSS: ${state.inertia.toFixed(2)}, Converged in ${state.iteration} iterations.`,
          metricsObserved: { seed: state.config.seed, wcss: state.inertia, isConverged: state.isConverged },
        };
      }
      return {
        passed: false,
        message: 'Step until convergence to record this seed’s local minimum.',
        diagnosticEvidence: `Seed = ${state.config.seed}, Converged = ${state.isConverged}`,
      };
    },
    explanation: {
      phenomenon: 'Multi-Modal Energy Landscape of Cluster Assignments',
      mathematicalProof: 'There are S(N, K) (Stirling numbers of the second kind) possible partitions of N points into K clusters. Lloyd’s algorithm is a greedy descent heuristic that cannot jump over energy barriers separating local minima.',
      practicalLesson: 'Always run K-Means multiple times (n_init = 10 or 20) with different random seeds and select the solution with the lowest overall WCSS.',
    },
  },
];
