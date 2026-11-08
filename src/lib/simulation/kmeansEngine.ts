import type { Point2D, Centroid } from '../../types/index.ts';
import type {
  SimulationEngine,
  SimulationExplanation,
  SavedExperimentRecord,
} from './types.ts';
import {
  euclideanDistSq,
  calculateInertia,
  CENTROID_COLORS,
  initializeCentroidsRandom,
  initializeCentroidsKMeansPlusPlus,
} from '../math/kmeans.ts';

export interface KMeansConfig {
  k: number;
  initMethod: 'kmeans++' | 'random' | 'manual';
  manualCentroids?: Array<{ x: number; y: number }>;
  seed: number;
  convergenceEpsilon?: number;
  maxIterations?: number;
}

export type KMeansPhase = 'init' | 'assign' | 'update' | 'converged';

export interface KMeansPoint extends Point2D {
  cluster?: number;
  distToCentroid?: number;
  distsToAllCentroids?: number[];
  previousCluster?: number;
}

export interface KMeansSnapshot {
  stepNumber: number;
  iteration: number;
  phase: KMeansPhase;
  points: KMeansPoint[];
  centroids: Centroid[];
  prevCentroids: Array<{ x: number; y: number }>;
  maxCentroidShift: number;
  reassignments: number;
  inertia: number;
  inertiaHistory: number[];
  shiftHistory: number[];
  isConverged: boolean;
  convergenceReason?: string;
  emptyClusterIndices: number[];
}

export interface KMeansSimulationState extends KMeansSnapshot {
  config: KMeansConfig;
  selectedPointId: string | null;
  historyStack: KMeansSnapshot[];
}

export interface KMeansMetrics {
  k: number;
  iteration: number;
  stepNumber: number;
  phase: KMeansPhase;
  wcss: number;
  reassignments: number;
  maxShift: number;
  converged: boolean;
  clusterSizes: number[];
  emptyClusters: number[];
}

// Glyph definitions matching Analog Bauhaus Design System
export const CLUSTER_GLYPHS = ['circle', 'diamond', 'triangle', 'square', 'crosshair'] as const;

export class KMeansSimulationEngine
  implements SimulationEngine<KMeansConfig, KMeansSimulationState, KMeansMetrics> {
  algorithmId = 'kmeans';
  algorithmName = "K-Means (Lloyd's Algorithm)";

  // 1. INITIALIZE SIMULATION
  initialize(
    config: KMeansConfig,
    dataset: Point2D[],
    seed: number = 42
  ): KMeansSimulationState {
    const k = Math.max(2, Math.min(5, Math.floor(config.k || 3)));
    const convergenceEpsilon = config.convergenceEpsilon ?? 0.005;

    // Validate dataset: strip non-finite points
    const validPoints: KMeansPoint[] = dataset
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
      .map((p, idx) => ({
        ...p,
        id: p.id || `pt-${idx}`,
        cluster: undefined,
        previousCluster: undefined,
        distToCentroid: undefined,
        distsToAllCentroids: [],
      }));

    if (validPoints.length === 0) {
      throw new Error('KMeansSimulationEngine: Dataset contains zero valid finite coordinates.');
    }

    // Determine Initial Centroids
    let initialCentroids: Centroid[] = [];

    if (config.initMethod === 'manual' && config.manualCentroids && config.manualCentroids.length >= k) {
      initialCentroids = config.manualCentroids.slice(0, k).map((pos, idx) => ({
        id: idx,
        x: Number(pos.x.toFixed(2)),
        y: Number(pos.y.toFixed(2)),
        color: CENTROID_COLORS[idx % CENTROID_COLORS.length],
        history: [{ x: Number(pos.x.toFixed(2)), y: Number(pos.y.toFixed(2)), step: 0 }],
      }));
    } else if (config.initMethod === 'random') {
      initialCentroids = initializeCentroidsRandom(validPoints, k, seed);
    } else {
      // Default: K-Means++
      initialCentroids = initializeCentroidsKMeansPlusPlus(validPoints, k, seed);
    }

    // Compute initial distances to all centroids
    const pointsWithDistances = validPoints.map((pt) => {
      const dists = initialCentroids.map((c) =>
        Number(Math.sqrt(euclideanDistSq(pt, c)).toFixed(3))
      );
      return {
        ...pt,
        distsToAllCentroids: dists,
      };
    });

    const initialSnapshot: KMeansSnapshot = {
      stepNumber: 0,
      iteration: 0,
      phase: 'init',
      points: pointsWithDistances,
      centroids: initialCentroids,
      prevCentroids: initialCentroids.map((c) => ({ x: c.x, y: c.y })),
      maxCentroidShift: 0,
      reassignments: 0,
      inertia: 0,
      inertiaHistory: [],
      shiftHistory: [],
      isConverged: false,
      emptyClusterIndices: [],
    };

    return {
      ...initialSnapshot,
      config: { ...config, k, seed, convergenceEpsilon },
      selectedPointId: pointsWithDistances[0]?.id || null,
      historyStack: [initialSnapshot],
    };
  }

  // 2. EXECUTE ONE STEP OF LLOYD'S STATE MACHINE
  step(state: KMeansSimulationState): KMeansSimulationState {
    if (state.isConverged) return state;

    const { centroids, points, iteration, phase, stepNumber, config } = state;
    const k = centroids.length;

    // A. TRANSITION: INIT -> ASSIGN (Iteration 1, Step 1)
    // or UPDATE -> ASSIGN (Iteration t+1, Step 1)
    if (phase === 'init' || phase === 'update') {
      const nextIteration = phase === 'init' ? 1 : iteration + 1;
      let reassignments = 0;

      // Lloyd Step 1: Assign each point x_i to nearest centroid mu_k
      const updatedPoints: KMeansPoint[] = points.map((p) => {
        let bestCluster = 0;
        let minDistSq = Infinity;
        const distsToAll: number[] = [];

        centroids.forEach((c, cIdx) => {
          const dSq = euclideanDistSq(p, c);
          distsToAll.push(Number(Math.sqrt(dSq).toFixed(2)));
          if (dSq < minDistSq) {
            minDistSq = dSq;
            bestCluster = cIdx;
          }
        });

        if (p.cluster !== bestCluster) {
          reassignments++;
        }

        return {
          ...p,
          previousCluster: p.cluster,
          cluster: bestCluster,
          distToCentroid: Number(Math.sqrt(minDistSq).toFixed(2)),
          distsToAllCentroids: distsToAll,
        };
      });

      // Recalculate WCSS (Inertia) after assignment
      const currentInertia = calculateInertia(updatedPoints, centroids);

      const nextSnapshot: KMeansSnapshot = {
        stepNumber: stepNumber + 1,
        iteration: nextIteration,
        phase: 'assign',
        points: updatedPoints,
        centroids,
        prevCentroids: state.prevCentroids,
        maxCentroidShift: state.maxCentroidShift,
        reassignments,
        inertia: currentInertia,
        inertiaHistory: [...state.inertiaHistory, currentInertia],
        shiftHistory: state.shiftHistory,
        isConverged: false,
        emptyClusterIndices: [],
      };

      return {
        ...state,
        ...nextSnapshot,
        historyStack: [...state.historyStack, nextSnapshot],
      };
    }

    // B. TRANSITION: ASSIGN -> UPDATE (Lloyd Step 2)
    let maxShift = 0;
    const emptyClusters: number[] = [];

    // Recompute centroids as arithmetic mean of assigned points
    const updatedCentroids: Centroid[] = centroids.map((c, cIdx) => {
      const assigned = points.filter((p) => p.cluster === cIdx);

      // Edge case: Empty Cluster Handling
      if (assigned.length === 0) {
        emptyClusters.push(cIdx);
        // Centroid remains in place with an empty cluster warning
        return {
          ...c,
          history: [...c.history, { x: c.x, y: c.y, step: stepNumber + 1 }],
        };
      }

      // Compute True Center of Mass (Arithmetic Mean)
      const sumX = assigned.reduce((acc, p) => acc + p.x, 0);
      const sumY = assigned.reduce((acc, p) => acc + p.y, 0);
      const newX = Number((sumX / assigned.length).toFixed(2));
      const newY = Number((sumY / assigned.length).toFixed(2));

      const shift = Math.sqrt(euclideanDistSq(c, { x: newX, y: newY }));
      if (shift > maxShift) maxShift = shift;

      return {
        ...c,
        x: newX,
        y: newY,
        history: [...c.history, { x: newX, y: newY, step: stepNumber + 1 }],
      };
    });

    // Re-evaluate point distances with newly moved centroids
    const pointsWithNewDistances: KMeansPoint[] = points.map((p) => {
      const distsToAll = updatedCentroids.map((c) =>
        Number(Math.sqrt(euclideanDistSq(p, c)).toFixed(2))
      );
      const assignedDist =
        p.cluster !== undefined && updatedCentroids[p.cluster]
          ? Number(Math.sqrt(euclideanDistSq(p, updatedCentroids[p.cluster])).toFixed(2))
          : undefined;

      return {
        ...p,
        distToCentroid: assignedDist,
        distsToAllCentroids: distsToAll,
      };
    });

    const updatedInertia = calculateInertia(pointsWithNewDistances, updatedCentroids);

    // Compute coordinate span for scale-invariant normalized convergence
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const coordSpan = Math.max(1, Math.hypot(maxX - minX, maxY - minY));
    const relativeShift = maxShift / coordSpan;

    const epsilon = config.convergenceEpsilon ?? 0.005;
    const maxIter = config.maxIterations ?? 25;

    // Scale-invariant convergence: absolute displacement < epsilon OR relative shift < 1e-4
    const isDisplacementConverged = maxShift < epsilon || relativeShift < 1e-4;
    const hasConverged =
      (isDisplacementConverged && state.reassignments === 0) || iteration >= maxIter;

    const nextPhase: KMeansPhase = hasConverged ? 'converged' : 'update';
    const convergenceReason = hasConverged
      ? iteration >= maxIter
        ? `Maximum iteration threshold (${maxIter}) reached.`
        : `Centroid displacement (Δ = ${maxShift.toFixed(4)}px, relative shift = ${(relativeShift * 100).toFixed(4)}%) settled below convergence tolerance.`
      : undefined;

    const nextSnapshot: KMeansSnapshot = {
      stepNumber: stepNumber + 1,
      iteration,
      phase: nextPhase,
      points: pointsWithNewDistances,
      centroids: updatedCentroids,
      prevCentroids: centroids.map((c) => ({ x: c.x, y: c.y })),
      maxCentroidShift: Number(maxShift.toFixed(3)),
      reassignments: state.reassignments,
      inertia: updatedInertia,
      inertiaHistory: state.inertiaHistory,
      shiftHistory: [...state.shiftHistory, Number(maxShift.toFixed(3))],
      isConverged: hasConverged,
      convergenceReason,
      emptyClusterIndices: emptyClusters,
    };

    return {
      ...state,
      ...nextSnapshot,
      historyStack: [...state.historyStack, nextSnapshot],
    };
  }

  // 3. STEP BACKWARD (LOSSLESS HISTORICAL ROLLBACK)
  stepBack(state: KMeansSimulationState): KMeansSimulationState {
    if (state.historyStack.length <= 1) return state;

    const newStack = state.historyStack.slice(0, -1);
    const prevSnapshot = newStack[newStack.length - 1];

    return {
      ...state,
      ...prevSnapshot,
      historyStack: newStack,
    };
  }

  // 4. RUN UNTIL CONVERGENCE
  run(state: KMeansSimulationState, maxSteps: number = 50): KMeansSimulationState {
    let current = state;
    let stepCount = 0;
    while (!current.isConverged && stepCount < maxSteps) {
      current = this.step(current);
      stepCount++;
    }
    return current;
  }

  // 5. RESET SIMULATION
  reset(config: KMeansConfig, dataset: Point2D[], seed?: number): KMeansSimulationState {
    return this.initialize(config, dataset, seed ?? config.seed);
  }

  // 6. GET CURRENT METRICS
  getMetrics(state: KMeansSimulationState): KMeansMetrics {
    const clusterSizes = state.centroids.map(
      (c, idx) => state.points.filter((p) => p.cluster === idx).length
    );

    return {
      k: state.centroids.length,
      iteration: state.iteration,
      stepNumber: state.stepNumber,
      phase: state.phase,
      wcss: state.inertia,
      reassignments: state.reassignments,
      maxShift: state.maxCentroidShift,
      converged: state.isConverged,
      clusterSizes,
      emptyClusters: state.emptyClusterIndices,
    };
  }

  // 7. GET SYNCHRONIZED MULTI-REPRESENTATION EXPLANATION
  getExplanation(state: KMeansSimulationState): SimulationExplanation {
    const { phase, iteration, reassignments, maxCentroidShift, emptyClusterIndices } = state;

    if (phase === 'init') {
      const initNotes =
        state.config.initMethod === 'kmeans++'
          ? 'K-Means++ seeding selected: points chosen with probability proportional to squared Euclidean distance D(x)², achieving an expected O(log K)-competitive bound over random seeding. Note: as a stochastic heuristic, it mitigates but does not strictly eliminate sub-optimal local minima.'
          : state.config.initMethod === 'manual'
          ? 'Manual placement active: custom starting centroids placed directly on the coordinate space.'
          : 'Random uniform seeding active: centroids placed via deterministic pseudorandom selection.';

      return {
        headline: 'STAGE 01 // SEEDED CENTROID PLACEMENT',
        description: `Seeded ${state.centroids.length} initial centroids on the coordinate space using ${state.config.initMethod}. Data points remain in an unassigned ground state. ${initNotes}`,
        equationLatex:
          '\\boldsymbol{\\mu}_k^{(0)} \\sim \\mathcal{D}(\\mathbf{X}) \\quad \\text{for } k \\in \\{1, \\dots, K\\}',
        pseudocodeLine: 1,
        pythonSnippetLine: 2,
        predictionPrompt: {
          question:
            'Before executing the first assignment: which centroid will capture point P₁ situated at the bottom-left of the coordinate plane?',
          options: [
            {
              id: 'opt-nearest',
              label: 'A',
              text: 'The centroid closest by squared Euclidean distance d(x₁, μₖ)²',
              isCorrect: true,
            },
            {
              id: 'opt-highest-var',
              label: 'B',
              text: 'The centroid with the highest initial variance parameter',
              isCorrect: false,
            },
            {
              id: 'opt-random',
              label: 'C',
              text: 'A randomly assigned cluster index based on a uniform distribution',
              isCorrect: false,
            },
          ],
          explanation:
            'Lloyd’s algorithm begins deterministically: every data point is strictly assigned to the centroid disc minimizing squared Euclidean distance.',
        },
      };
    }

    if (phase === 'assign') {
      return {
        headline: `ITERATION ${iteration} // VORONOI ASSIGNMENT STEP`,
        description: `Evaluated squared Euclidean distances for all ${state.points.length} points to each of the ${state.centroids.length} centroids. Assigned every point to its closest centroid disc. Points switching clusters this iteration: ${reassignments}.`,
        equationLatex:
          'c^{(i)} = \\arg\\min_{k \\in \\{1, \\dots, K\\}} \\|\\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_k\\|_2^2',
        pseudocodeLine: 3,
        pythonSnippetLine: 6,
        predictionPrompt: {
          question: `Now that points are assigned: in which direction will centroid μ₁ move in the upcoming update step?`,
          options: [
            {
              id: 'opt-com',
              label: 'A',
              text: 'Toward the center-of-mass (arithmetic mean) of its newly assigned member points',
              isCorrect: true,
            },
            {
              id: 'opt-away',
              label: 'B',
              text: 'Directly away from the other centroids to maximize spatial margin',
              isCorrect: false,
            },
            {
              id: 'opt-stay',
              label: 'C',
              text: 'It will remain fixed at its initial coordinates',
              isCorrect: false,
            },
          ],
          explanation:
            'In Step 2 of Lloyd’s algorithm, the objective function J is minimized with respect to μ by setting the gradient ∂J/∂μ = 0, which uniquely yields the arithmetic mean of assigned points.',
        },
      };
    }

    if (phase === 'update') {
      const emptyNote =
        emptyClusterIndices.length > 0
          ? ` WARNING: Cluster(s) ${emptyClusterIndices.join(', ')} have 0 assigned points!`
          : '';

      return {
        headline: `ITERATION ${iteration} // CENTROID RECOMPUTATION`,
        description: `Updated centroid coordinates to the exact geometric center-of-mass of their member clusters. Max displacement vector shift: ${maxCentroidShift.toFixed(3)}px.${emptyNote}`,
        equationLatex:
          '\\boldsymbol{\\mu}_k^{(t+1)} = \\frac{1}{|S_k|} \\sum_{i \\in S_k} \\mathbf{x}^{(i)}',
        pseudocodeLine: 4,
        pythonSnippetLine: 9,
        predictionPrompt: {
          question: `Centroids have shifted. Will the next assignment step produce any label changes?`,
          options: [
            {
              id: 'opt-check',
              label: 'A',
              text: 'Only boundary points whose distance to a neighboring shifting centroid has decreased below their current centroid distance',
              isCorrect: true,
            },
            {
              id: 'opt-all',
              label: 'B',
              text: 'All points in the dataset will reshuffle their labels',
              isCorrect: false,
            },
            {
              id: 'opt-none',
              label: 'C',
              text: 'No points can ever switch clusters after the first iteration',
              isCorrect: false,
            },
          ],
          explanation:
            'Point assignments only change along the Voronoi boundary lines where the shifting hyperplanes intersect intermediate observations.',
        },
      };
    }

    // Converged
    return {
      headline: 'STATUS // MATHEMATICAL CONVERGENCE ACHIEVED',
      description:
        state.convergenceReason ||
        `Centroid displacements settled below threshold (Δ = ${maxCentroidShift.toFixed(4)}px). Point assignments are mathematically invariant.`,
      equationLatex:
        '\\max_k \\|\\boldsymbol{\\mu}_k^{(t+1)} - \\boldsymbol{\\mu}_k^{(t)}\\|_2 < \\epsilon \\implies \\text{Local Optimum Reached}',
      pseudocodeLine: 5,
      pythonSnippetLine: 12,
      misconceptionTrap:
        'Notice: Convergence in K-Means guarantees a local minimum of WCSS, not necessarily the global optimum. Different initial centroid placements can yield different partition boundaries and final inertias.',
    };
  }

  // 8. EXPORT EXPERIMENT RECORD
  exportExperiment(state: KMeansSimulationState): SavedExperimentRecord {
    return {
      id: `exp-kmeans-${Date.now()}`,
      algorithmId: this.algorithmId,
      algorithmName: this.algorithmName,
      timestamp: new Date().toISOString(),
      seed: state.config.seed,
      config: {
        k: state.config.k,
        initMethod: state.config.initMethod,
        convergenceEpsilon: state.config.convergenceEpsilon,
        maxIterations: state.config.maxIterations,
      },
      initialPointsCount: state.points.length,
      finalMetrics: {
        totalSteps: state.stepNumber,
        iterations: state.iteration,
        finalInertia: state.inertia,
        finalShift: state.maxCentroidShift,
        converged: state.isConverged,
        clusterSizes: state.centroids.map(
          (c, idx) => state.points.filter((p) => p.cluster === idx).length
        ),
      },
      summary: `K-Means run with K=${state.config.k} on ${state.points.length} points (${state.config.initMethod}). Finished at iteration ${state.iteration} with WCSS=${state.inertia}.`,
    };
  }
}

// Global Singleton Engine Instance
export const kmeansEngine = new KMeansSimulationEngine();
