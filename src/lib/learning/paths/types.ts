/**
 * ML in Motion — Structured Learning Path Types
 */

export type PathCategory = 'core' | 'specialized' | 'examination';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  /** Ordered list of concept IDs belonging to this module */
  conceptIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  category: PathCategory;
  estimatedHours: number;
  modules: LearningModule[];
  targetAudience: string;
  /** Flagship paths have complete interactive cinema workbenches attached */
  isPrimaryFlagship: boolean;
  bannerColor: string;
}

export interface PathProgressSummary {
  pathId: string;
  totalConcepts: number;
  masteredCount: number;
  inProgressCount: number;
  needsRevisionCount: number;
  notStartedCount: number;
  percentComplete: number;
  currentConceptId: string | null;
  nextRecommendedConceptId: string | null;
}
