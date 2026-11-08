/**
 * ML in Motion — Shared Algorithm Simulation Framework (Phase 04)
 * Public API Entry Point
 */

export * from './types.ts';
export * from './history.ts';
export { KMeansSimulationAdapter, type AdaptedKMeansState, type AdaptedKMeansSnapshot, type KMeansInitArgs } from '../adapters/kmeansAdapter.ts';
export { GradientDescentSimulationAdapter, type AdaptedGradientDescentState, type AdaptedGradientDescentSnapshot } from '../adapters/gradientDescentAdapter.ts';
