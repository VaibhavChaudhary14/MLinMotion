/**
 * ML in Motion — Phase 05: Interactive Learning Systems
 * Core TypeScript Contracts for Prediction Checkpoints & Break-the-Algorithm Challenges
 *
 * Grounded in the principle that learners retain mathematical intuition best when they:
 * 1. Observe current algorithm state
 * 2. Commit to a prediction before execution (simulation locked)
 * 3. Execute and reveal the engine's real mathematical computation
 * 4. Compare prediction with reality across multiple representations
 * 5. Intentionally tamper with parameters to induce and explain failure modes
 */

export type PredictionCategory =
  | 'parameter_update'
  | 'spectral_stability'
  | 'saddle_escape'
  | 'optimizer_dynamics'
  | 'point_assignment'
  | 'centroid_update'
  | 'wcss_monotonicity'
  | 'convergence_detection';

export type PredictionType =
  | 'multiple_choice'
  | 'directional'
  | 'numerical'
  | 'coordinate';

export type PredictionEvaluationStatus =
  | 'unattempted'
  | 'correct'
  | 'partially_correct'
  | 'incorrect';

export interface PredictionOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface PredictionMultiRepresentation {
  headline: string;
  mathEquation: string;
  numericalEvidence: string;
  pseudocodeLine: number;
  pseudocodeSnippet: string;
  pythonSnippet: string;
  graphicalClue: string;
}

export interface PredictionEvaluationResult {
  status: PredictionEvaluationStatus;
  userAnswerSummary: string;
  actualAnswerSummary: string;
  toleranceApplied?: number;
  isWithinTolerance?: boolean;
  score: number; // 0 (incorrect) | 0.5 (partial) | 1.0 (correct)
  explanation: PredictionMultiRepresentation;
}

export interface PredictionQuestion<TState = unknown, TNextState = unknown> {
  id: string;
  algorithmId: 'gradient-descent' | 'kmeans';
  title: string;
  category: PredictionCategory;
  prompt: string;
  type: PredictionType;
  options?: PredictionOption[];
  numericalTolerance?: {
    absolute: number;
    relative?: number;
    targetLabel?: string;
  };
  /**
   * Pure evaluation function computing ground truth from active state and predicted next state.
   * NEVER invents fake math; uses real engine state transitions.
   */
  evaluate: (
    userGuess: unknown,
    currentState: TState,
    nextState: TNextState
  ) => PredictionEvaluationResult;
}

// -----------------------------------------------------------------------------
// BREAK THE ALGORITHM (CHALLENGE SYSTEM)
// -----------------------------------------------------------------------------

export type ChallengeDifficulty = 'foundational' | 'intermediate' | 'advanced' | 'pathological';

export interface ChallengeParameterConstraint {
  key: string;
  label: string;
  type: 'slider' | 'select' | 'radio' | 'seed';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: any; label: string; description?: string }>;
  helperText?: string;
}

export interface ChallengeVerificationResult {
  passed: boolean;
  message: string;
  diagnosticEvidence: string;
  metricsObserved?: Record<string, any>;
}

export interface ChallengeDefinition<TConfig = any, TState = any, TMetrics = any> {
  id: string;
  algorithmId: 'gradient-descent' | 'kmeans';
  title: string;
  subtitle: string;
  difficulty: ChallengeDifficulty;
  conceptTrap: string;
  objective: string;
  instruction: string;
  defaultConfig: Partial<TConfig>;
  parameterConstraints: ChallengeParameterConstraint[];
  /**
   * Evaluates if learner has successfully reproduced or escaped the specific failure mode
   */
  verifyCondition: (
    state: TState,
    metrics: TMetrics,
    stepHistory: any[]
  ) => ChallengeVerificationResult;
  explanation: {
    phenomenon: string;
    mathematicalProof: string;
    practicalLesson: string;
  };
}

// -----------------------------------------------------------------------------
// LOCAL LEARNING ANALYTICS (100% Client-Side, Zero Telemetry)
// -----------------------------------------------------------------------------

export interface PredictionAttemptRecord {
  id: string;
  questionId: string;
  algorithmId: 'gradient-descent' | 'kmeans';
  category: PredictionCategory;
  userGuess: any;
  status: PredictionEvaluationStatus;
  score: number;
  timestamp: number;
}

export interface ChallengeRecord {
  challengeId: string;
  algorithmId: 'gradient-descent' | 'kmeans';
  completed: boolean;
  attemptsCount: number;
  firstCompletedAt?: number;
  lastAttemptAt: number;
  diagnosticSnapshot?: Record<string, any>;
}

export interface LocalLearningProfile {
  version: number;
  lastActive: number;
  predictions: PredictionAttemptRecord[];
  challenges: Record<string, ChallengeRecord>;
}
