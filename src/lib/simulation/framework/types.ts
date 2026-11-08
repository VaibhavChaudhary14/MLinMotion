/**
 * ML in Motion — Shared Algorithm Simulation Framework
 * Core TypeScript Contracts & Lifecycle Types (Phase 04)
 *
 * Designed to provide a shared lifecycle, deterministic stepping, reversible state history,
 * and multi-representation explanations across disparate ML algorithm families (Clustering,
 * Optimization, Dimensionality Reduction, Decision Trees).
 */

import type { SimulationExplanation, SavedExperimentRecord } from '../types.ts';

// -----------------------------------------------------------------------------
// 1. LIFECYCLE STATUS & ALGORITHM TAXONOMY
// -----------------------------------------------------------------------------

export type SimulationLifecycleStatus =
  | 'uninitialized'
  | 'ready'
  | 'iterating'
  | 'converged'
  | 'diverged'
  | 'max_iterations_reached'
  | 'stationary'
  | 'limit_cycle'
  | 'error';

export type AlgorithmFamily =
  | 'clustering'
  | 'optimization'
  | 'dimensionality-reduction'
  | 'tree'
  | 'linear-model';

// -----------------------------------------------------------------------------
// 2. BASE SNAPSHOT & STATE CONTRACTS
// -----------------------------------------------------------------------------

/**
 * Common baseline properties that all algorithm snapshots must exhibit.
 * Ensures the simulation framework can inspect progress, termination, and error states uniformly.
 */
export interface BaseSimulationSnapshot {
  stepNumber: number;
  iteration: number;
  status: SimulationLifecycleStatus;
  isConverged: boolean;
  isDiverged: boolean;
  stopReason?: string;
}

/**
 * Baseline state container holding the active snapshot, immutable configuration,
 * and historical snapshot stack for bidirectional navigation.
 */
export interface BaseSimulationState<TConfig, TSnapshot extends BaseSimulationSnapshot> {
  config: TConfig;
  stepNumber: number;
  iteration: number;
  status: SimulationLifecycleStatus;
  isConverged: boolean;
  isDiverged: boolean;
  stopReason?: string;
  historyStack: TSnapshot[];
}

// -----------------------------------------------------------------------------
// 3. UNIFORM SIMULATION EVENT CONTRACT
// -----------------------------------------------------------------------------

export interface SimulationEvent<TPayload = unknown> {
  type: string;
  algorithmId: string;
  stepNumber: number;
  iteration: number;
  timestamp: number;
  payload?: TPayload;
}

// -----------------------------------------------------------------------------
// 4. SHARED SIMULATION ENGINE INTERFACE
// -----------------------------------------------------------------------------

/**
 * Standardized Simulation Engine Contract.
 * 
 * Strict Architectural Guarantees:
 * 1. Complete Decoupling: Zero dependencies on React, Next.js, window, or DOM.
 * 2. Determinism: Given identical initial configuration (and seed), stepping produces bit-for-bit identical state.
 * 3. Bidirectional Reversibility: stepBack restores full state (including hidden velocity/moments/assignments).
 * 4. Instance Isolation: Independent engine instances do not share mutable references.
 */
export interface ISimulationEngine<
  TConfig,
  TState extends BaseSimulationState<TConfig, TSnapshot>,
  TSnapshot extends BaseSimulationSnapshot,
  TMetrics = unknown,
  TInitArgs = unknown
> {
  readonly algorithmId: string;
  readonly algorithmName: string;
  readonly algorithmFamily: AlgorithmFamily;

  /**
   * Initializes a fresh, deterministic simulation state at step 0.
   */
  initialize(config: TConfig, initArgs?: TInitArgs): TState;

  /**
   * Executes a single forward discrete transition of the algorithm's state machine.
   */
  step(state: TState): TState;

  /**
   * Exact reversible historical rollback to the immediately preceding snapshot.
   */
  stepBack(state: TState): TState;

  /**
   * Executes continuous stepping until a termination criterion is met or maxSteps is reached.
   */
  run(state: TState, maxSteps?: number): TState;

  /**
   * Resets the simulation to its initial configured state.
   */
  reset(state: TState, newConfig?: Partial<TConfig>): TState;

  /**
   * Extracts scalar and structured telemetry for instruments and dashboards.
   */
  getMetrics(state: TState): TMetrics;

  /**
   * Generates synchronized pedagogical multi-representation explanations.
   */
  getExplanation(state: TState): SimulationExplanation;

  /**
   * Queries active lifecycle status.
   */
  getStatus(state: TState): SimulationLifecycleStatus;

  /**
   * Serializes active state into a persistent reproducible record.
   */
  exportExperiment(state: TState): SavedExperimentRecord;
}
