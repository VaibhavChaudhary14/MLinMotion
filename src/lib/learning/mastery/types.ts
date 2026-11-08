/**
 * ML in Motion — Concept Mastery Engine Types
 */

import type {
  PredictionAttemptRecord,
  ChallengeRecord,
  PracticeAttemptRecord,
  ConceptMasteryState,
} from '../types.ts';

export interface MasteryEvaluationInput {
  conceptId: string;
  predictions: PredictionAttemptRecord[];
  challenges: Record<string, ChallengeRecord>;
  practiceAttempts: PracticeAttemptRecord[];
  prerequisiteMasteryStates?: Record<string, ConceptMasteryState>;
}

export interface MasteryEvaluationResult {
  conceptId: string;
  state: ConceptMasteryState;
  score: number; // 0 to 100
  reasons: string[];
  unmetPrerequisites: string[];
  stats: {
    predictionCount: number;
    predictionAccuracy: number;
    completedChallenges: string[];
    practiceCount: number;
    practiceAccuracy: number;
  };
}
