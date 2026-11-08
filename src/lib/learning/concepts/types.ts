/**
 * ML in Motion — Concept Knowledge Graph Types
 * Strongly typed concept dependency and curriculum metadata.
 */

export type ConceptDifficulty = 'foundational' | 'intermediate' | 'advanced';

export type ConceptSubject =
  | 'mathematics'
  | 'optimization'
  | 'clustering'
  | 'foundations'
  | 'data-engineering';

export interface ConceptCompletionCriteria {
  /** Minimum number of valid prediction checkpoints submitted */
  minPredictions: number;
  /** Minimum prediction accuracy rate (0 to 100) */
  minAccuracy: number;
  /** Specific failure challenge IDs that must be verified */
  requiredChallengeIds: string[];
  /** Minimum number of practice questions correctly answered */
  minPracticePassed: number;
}

export interface ConceptNode {
  id: string;
  name: string;
  subject: ConceptSubject;
  difficulty: ConceptDifficulty;
  summary: string;
  /** Direct prerequisite concept IDs that must be understood first */
  prerequisites: string[];
  /** Concrete learning outcomes */
  learningObjectives: string[];
  /** Target interactive simulation URL (if implemented) */
  relatedSimulationUrl?: string;
  /** Related failure challenges in the cinema workbench */
  relatedChallenges: string[];
  /** Associated practice assessment question IDs */
  relatedPracticeQuestionIds: string[];
  /** Completion and mastery standards */
  completionCriteria: ConceptCompletionCriteria;
  /** Whether complete interactive lessons and simulations currently exist */
  isImplemented: boolean;
}
