/**
 * ML in Motion — Shared Algorithm Simulation Framework
 * K-Means Algorithm Adapter (Phase 04)
 *
 * Adapts KMeansSimulationEngine to the ISimulationEngine contract while preserving
 * 100% of Lloyd's mathematical assignments, scale-invariance, and determinism.
 */

import type { Point2D } from '../../../types/index.ts';
import type { SimulationExplanation, SavedExperimentRecord } from '../types.ts';
import type {
  ISimulationEngine,
  SimulationLifecycleStatus,
  AlgorithmFamily,
  BaseSimulationSnapshot,
  BaseSimulationState,
} from '../framework/types.ts';
import {
  KMeansSimulationEngine,
  type KMeansConfig,
  type KMeansSimulationState,
  type KMeansSnapshot,
  type KMeansMetrics,
} from '../kmeansEngine.ts';

export interface KMeansInitArgs {
  dataset: Point2D[];
  seed?: number;
}

export interface AdaptedKMeansSnapshot extends KMeansSnapshot, BaseSimulationSnapshot {
  status: SimulationLifecycleStatus;
  isDiverged: boolean;
}

export interface AdaptedKMeansState
  extends Omit<KMeansSimulationState, 'historyStack'>,
    BaseSimulationState<KMeansConfig, AdaptedKMeansSnapshot> {
  status: SimulationLifecycleStatus;
  isDiverged: boolean;
  historyStack: AdaptedKMeansSnapshot[];
  /** Preserved reference to initial dataset for clean resets */
  initialDataset: Point2D[];
}

export function deriveKMeansLifecycleStatus(
  phase: string,
  isConverged: boolean,
  iteration: number,
  maxIterations: number
): SimulationLifecycleStatus {
  if (isConverged) {
    if (iteration >= maxIterations) {
      return 'max_iterations_reached';
    }
    return 'converged';
  }
  if (phase === 'init') {
    return 'ready';
  }
  return 'iterating';
}

export class KMeansSimulationAdapter
  implements
    ISimulationEngine<
      KMeansConfig,
      AdaptedKMeansState,
      AdaptedKMeansSnapshot,
      KMeansMetrics,
      KMeansInitArgs
    > {
  readonly algorithmId = 'kmeans';
  readonly algorithmName = "K-Means (Lloyd's Algorithm)";
  readonly algorithmFamily: AlgorithmFamily = 'clustering';

  private readonly innerEngine: KMeansSimulationEngine;

  constructor(innerEngine?: KMeansSimulationEngine) {
    this.innerEngine = innerEngine ?? new KMeansSimulationEngine();
  }

  initialize(config: KMeansConfig, initArgs?: KMeansInitArgs): AdaptedKMeansState {
    const dataset = initArgs?.dataset ?? [];
    if (!dataset || dataset.length === 0) {
      throw new Error('KMeansSimulationAdapter: initialization requires a non-empty Point2D dataset in initArgs.');
    }
    const seed = initArgs?.seed ?? config.seed ?? 42;
    const baseState = this.innerEngine.initialize(config, dataset, seed);

    const maxIter = config.maxIterations ?? 25;
    const status = deriveKMeansLifecycleStatus(baseState.phase, baseState.isConverged, baseState.iteration, maxIter);

    const adaptedSnapshot: AdaptedKMeansSnapshot = {
      ...baseState.historyStack[0],
      status,
      isDiverged: false,
    };

    return {
      ...baseState,
      status,
      isDiverged: false,
      historyStack: [adaptedSnapshot],
      initialDataset: dataset.map((p) => ({ ...p })),
    };
  }

  step(state: AdaptedKMeansState): AdaptedKMeansState {
    const nextInnerState = this.innerEngine.step(state);
    const maxIter = state.config.maxIterations ?? 25;
    const status = deriveKMeansLifecycleStatus(
      nextInnerState.phase,
      nextInnerState.isConverged,
      nextInnerState.iteration,
      maxIter
    );

    const latestSnap = nextInnerState.historyStack[nextInnerState.historyStack.length - 1];
    const adaptedLatestSnap: AdaptedKMeansSnapshot = {
      ...latestSnap,
      status,
      isDiverged: false,
      stopReason: nextInnerState.convergenceReason,
    };

    const nextHistoryStack: AdaptedKMeansSnapshot[] = [
      ...state.historyStack.slice(0, -1),
      state.historyStack[state.historyStack.length - 1],
      adaptedLatestSnap,
    ];

    return {
      ...nextInnerState,
      status,
      isDiverged: false,
      stopReason: nextInnerState.convergenceReason,
      historyStack: nextHistoryStack,
      initialDataset: state.initialDataset,
    };
  }

  stepBack(state: AdaptedKMeansState): AdaptedKMeansState {
    if (state.historyStack.length <= 1) {
      return state;
    }

    const nextInnerState = this.innerEngine.stepBack(state);
    const nextHistoryStack = state.historyStack.slice(0, -1);
    const restoredSnap = nextHistoryStack[nextHistoryStack.length - 1];

    return {
      ...nextInnerState,
      status: restoredSnap.status,
      isDiverged: restoredSnap.isDiverged,
      stopReason: restoredSnap.stopReason,
      historyStack: nextHistoryStack,
      initialDataset: state.initialDataset,
    };
  }

  run(state: AdaptedKMeansState, maxSteps: number = 50): AdaptedKMeansState {
    let current = state;
    let count = 0;
    while (!current.isConverged && count < maxSteps) {
      current = this.step(current);
      count++;
    }
    return current;
  }

  reset(state: AdaptedKMeansState, newConfig?: Partial<KMeansConfig>): AdaptedKMeansState {
    const finalConfig: KMeansConfig = {
      ...state.config,
      ...newConfig,
    };
    return this.initialize(finalConfig, {
      dataset: state.initialDataset,
      seed: finalConfig.seed,
    });
  }

  getMetrics(state: AdaptedKMeansState): KMeansMetrics {
    return this.innerEngine.getMetrics(state);
  }

  getExplanation(state: AdaptedKMeansState): SimulationExplanation {
    return this.innerEngine.getExplanation(state);
  }

  getStatus(state: AdaptedKMeansState): SimulationLifecycleStatus {
    return state.status;
  }

  exportExperiment(state: AdaptedKMeansState): SavedExperimentRecord {
    return this.innerEngine.exportExperiment(state);
  }
}
