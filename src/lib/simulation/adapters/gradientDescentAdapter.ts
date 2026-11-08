/**
 * ML in Motion — Shared Algorithm Simulation Framework
 * Gradient Descent Algorithm Adapter (Phase 04)
 *
 * Adapts GradientDescentSimulationEngine to the ISimulationEngine contract
 * supporting Vanilla GD, Polyak Momentum, Adam, and non-convex landscapes.
 */

import type { SimulationExplanation, SavedExperimentRecord } from '../types.ts';
import type {
  ISimulationEngine,
  SimulationLifecycleStatus,
  AlgorithmFamily,
  BaseSimulationSnapshot,
  BaseSimulationState,
} from '../framework/types.ts';
import {
  GradientDescentSimulationEngine,
  createGradientDescentSimulation,
  stepGradientDescent,
  stepBackGradientDescent,
  runGradientDescent,
  getGradientDescentMetrics,
  getGradientDescentExplanation,
  type GradientDescentConfig,
  type GradientDescentSimulationState,
  type GradientDescentSnapshot,
  type GradientDescentMetrics,
} from '../gradientDescentEngine.ts';

export interface AdaptedGradientDescentSnapshot extends GradientDescentSnapshot, BaseSimulationSnapshot {
  status: SimulationLifecycleStatus;
}

export interface AdaptedGradientDescentState
  extends Omit<GradientDescentSimulationState, 'historyStack'>,
    BaseSimulationState<GradientDescentConfig, AdaptedGradientDescentSnapshot> {
  status: SimulationLifecycleStatus;
  historyStack: AdaptedGradientDescentSnapshot[];
}

export function deriveGradientDescentLifecycleStatus(
  snapshot: GradientDescentSnapshot
): SimulationLifecycleStatus {
  if (snapshot.isDiverged) return 'diverged';
  if (snapshot.isConverged) return 'converged';
  if (snapshot.isLimitCycle) return 'limit_cycle';
  if (snapshot.isStationary) return 'stationary';
  if (snapshot.isMaxIterationsReached) return 'max_iterations_reached';
  if (snapshot.stepNumber === 0) return 'ready';
  return 'iterating';
}

export class GradientDescentSimulationAdapter
  implements
    ISimulationEngine<
      GradientDescentConfig,
      AdaptedGradientDescentState,
      AdaptedGradientDescentSnapshot,
      GradientDescentMetrics,
      void
    > {
  readonly algorithmId = 'gradient-descent';
  readonly algorithmName = 'Gradient Descent Optimization';
  readonly algorithmFamily: AlgorithmFamily = 'optimization';

  private readonly innerEngine: GradientDescentSimulationEngine;

  constructor(innerEngine?: GradientDescentSimulationEngine) {
    this.innerEngine = innerEngine ?? new GradientDescentSimulationEngine();
  }

  initialize(config: GradientDescentConfig): AdaptedGradientDescentState {
    const baseState = createGradientDescentSimulation(config);
    const status = deriveGradientDescentLifecycleStatus(baseState);

    const adaptedSnapshot: AdaptedGradientDescentSnapshot = {
      ...baseState.historyStack[0],
      status,
    };

    return {
      ...baseState,
      status,
      historyStack: [adaptedSnapshot],
    };
  }

  step(state: AdaptedGradientDescentState): AdaptedGradientDescentState {
    const nextInnerState = stepGradientDescent(state);
    const latestSnap = nextInnerState.historyStack[nextInnerState.historyStack.length - 1];
    const status = deriveGradientDescentLifecycleStatus(latestSnap);

    const adaptedLatestSnap: AdaptedGradientDescentSnapshot = {
      ...latestSnap,
      status,
    };

    const nextHistoryStack: AdaptedGradientDescentSnapshot[] = [
      ...state.historyStack.slice(0, -1),
      state.historyStack[state.historyStack.length - 1],
      adaptedLatestSnap,
    ];

    return {
      ...nextInnerState,
      status,
      historyStack: nextHistoryStack,
    };
  }

  stepBack(state: AdaptedGradientDescentState): AdaptedGradientDescentState {
    if (state.historyStack.length <= 1) {
      return state;
    }

    const nextInnerState = stepBackGradientDescent(state);
    const nextHistoryStack = state.historyStack.slice(0, -1);
    const restoredSnap = nextHistoryStack[nextHistoryStack.length - 1];

    return {
      ...nextInnerState,
      status: restoredSnap.status,
      stopReason: restoredSnap.stopReason,
      historyStack: nextHistoryStack,
    };
  }

  run(state: AdaptedGradientDescentState, maxSteps: number = 50): AdaptedGradientDescentState {
    let current = state;
    let count = 0;
    while (!current.isConverged && !current.isDiverged && !current.isLimitCycle && count < maxSteps) {
      current = this.step(current);
      count++;
    }
    return current;
  }

  reset(state: AdaptedGradientDescentState, newConfig?: Partial<GradientDescentConfig>): AdaptedGradientDescentState {
    const finalConfig: GradientDescentConfig = {
      ...state.config,
      ...newConfig,
    };
    return this.initialize(finalConfig);
  }

  getMetrics(state: AdaptedGradientDescentState): GradientDescentMetrics {
    return getGradientDescentMetrics(state);
  }

  getExplanation(state: AdaptedGradientDescentState): SimulationExplanation {
    return getGradientDescentExplanation(state);
  }

  getStatus(state: AdaptedGradientDescentState): SimulationLifecycleStatus {
    return state.status;
  }

  exportExperiment(state: AdaptedGradientDescentState): SavedExperimentRecord {
    return this.innerEngine.exportExperiment(state);
  }
}
