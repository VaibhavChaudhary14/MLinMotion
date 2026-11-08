import type { Point2D, Centroid } from '../../types/index.ts';

export interface SimulationMetrics {
  iteration: number;
  converged: boolean;
  [key: string]: any;
}

export interface SimulationExplanation {
  headline: string;
  description: string;
  equationLatex: string;
  pseudocodeLine: number;
  pythonSnippetLine: number;
  misconceptionTrap?: string;
  predictionPrompt?: {
    question: string;
    options: Array<{
      id: string;
      label: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation: string;
  };
}

export interface SavedExperimentRecord {
  id: string;
  algorithmId: string;
  algorithmName: string;
  timestamp: string;
  seed: number;
  config: Record<string, any>;
  initialPointsCount: number;
  finalMetrics: Record<string, any>;
  summary: string;
}

export interface SimulationEngine<TConfig, TState, TMetrics extends SimulationMetrics> {
  algorithmId: string;
  algorithmName: string;
  initialize(config: TConfig, dataset: Point2D[], seed?: number): TState;
  step(state: TState): TState;
  stepBack(state: TState): TState;
  run(state: TState, maxSteps?: number): TState;
  reset(config: TConfig, dataset: Point2D[], seed?: number): TState;
  getMetrics(state: TState): TMetrics;
  getExplanation(state: TState): SimulationExplanation;
  exportExperiment(state: TState): SavedExperimentRecord;
}
