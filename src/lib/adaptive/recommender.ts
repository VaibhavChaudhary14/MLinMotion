import { LearnerConceptState, ExperimentRecord } from '@/types';
import {
  CURRICULUM_STAGES,
  CONCEPT_GRAPH,
  getAllStagesList,
  getEssentialStages,
  calculateEssentialCoreProgress,
} from './conceptGraph';
import { MISCONCEPTIONS_CATALOG } from './misconceptions';

export interface Recommendation {
  id: string;
  type: 'lesson' | 'review' | 'break-it' | 'lab';
  conceptId: string;
  stageCode?: string;
  stageNumber?: number;
  title: string;
  eyebrow: string;
  reason: string;
  targetUrl: string;
  priority: 'high' | 'medium';
}

const STORAGE_KEYS = {
  CONCEPT_STATES: 'ml_in_motion_concepts_v1',
  EXPERIMENTS: 'ml_in_motion_experiments_v1',
  ONBOARDING: 'ml_in_motion_onboarding_v1',
  NOTES: 'ml_in_motion_notes_v1',
};

// Map legacy / alternative concept IDs to canonical 12-stage IDs
const ALIAS_MAP: Record<string, string> = {
  'distance-metrics': 'math-for-ml',
  'kmeans-clustering': 'kmeans',
  'loss-functions': 'learning-problem',
  'cluster-evaluation': 'model-evaluation',
  'clustering-failure-cases': 'model-comparison',
  'pca-reduction': 'pca',
};

export function getLearnerConceptStates(): Record<string, LearnerConceptState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONCEPT_STATES);
    if (!raw) {
      // Default bootstrap states aligned with 12-stage curriculum
      const defaults: Record<string, LearnerConceptState> = {
        'ml-foundations': {
          conceptId: 'ml-foundations',
          title: 'Machine Learning Foundations',
          attempts: 6,
          correctAnswers: 6,
          masteryScore: 90,
          lastPracticed: new Date(Date.now() - 86400000 * 3).toISOString(),
          misconceptionsObserved: [],
        },
        'data-literacy': {
          conceptId: 'data-literacy',
          title: 'Data Literacy & Feature Engineering',
          attempts: 5,
          correctAnswers: 4,
          masteryScore: 80,
          lastPracticed: new Date(Date.now() - 86400000 * 2).toISOString(),
          misconceptionsObserved: [],
        },
        'math-for-ml': {
          conceptId: 'math-for-ml',
          title: 'Mathematics for Machine Learning',
          attempts: 5,
          correctAnswers: 5,
          masteryScore: 85,
          lastPracticed: new Date(Date.now() - 86400000 * 2).toISOString(),
          misconceptionsObserved: [],
        },
        'learning-problem': {
          conceptId: 'learning-problem',
          title: 'The Learning Problem & Generalization',
          attempts: 3,
          correctAnswers: 2,
          masteryScore: 65,
          lastPracticed: new Date(Date.now() - 86400000).toISOString(),
          misconceptionsObserved: [],
        },
        'linear-regression': {
          conceptId: 'linear-regression',
          title: 'Linear Regression & Ordinary Least Squares',
          attempts: 4,
          correctAnswers: 3,
          masteryScore: 70,
          lastPracticed: new Date(Date.now() - 3600000 * 6).toISOString(),
          misconceptionsObserved: [],
        },
      };
      localStorage.setItem(STORAGE_KEYS.CONCEPT_STATES, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.error('Failed to load concept states from localStorage', e);
    return {};
  }
}

export function recordConceptAttempt(
  conceptId: string,
  isCorrect: boolean,
  misconceptionId?: string
): void {
  if (typeof window === 'undefined') return;
  const canonicalId = ALIAS_MAP[conceptId] || conceptId;
  const states = getLearnerConceptStates();
  const current = states[canonicalId] || {
    conceptId: canonicalId,
    title: CURRICULUM_STAGES[canonicalId]?.title || CONCEPT_GRAPH[canonicalId]?.title || canonicalId,
    attempts: 0,
    correctAnswers: 0,
    masteryScore: 0,
    misconceptionsObserved: [],
  };

  current.attempts += 1;
  if (isCorrect) {
    current.correctAnswers += 1;
    current.masteryScore = Math.min(100, current.masteryScore + 12);
  } else {
    current.masteryScore = Math.max(10, current.masteryScore - 8);
    if (misconceptionId && !current.misconceptionsObserved.includes(misconceptionId)) {
      current.misconceptionsObserved.push(misconceptionId);
    }
  }

  current.lastPracticed = new Date().toISOString();
  // Spaced repetition schedule based on score
  const daysToAdd = current.masteryScore > 80 ? 7 : current.masteryScore > 50 ? 3 : 1;
  current.nextReviewDate = new Date(Date.now() + 86400000 * daysToAdd).toISOString();

  states[canonicalId] = current;
  try {
    localStorage.setItem(STORAGE_KEYS.CONCEPT_STATES, JSON.stringify(states));
    window.dispatchEvent(new CustomEvent('concept-states-updated'));
  } catch (e) {
    console.error('Failed to save concept attempt', e);
  }
}

// Generate deterministic, transparent recommendations based on the 12-stage curriculum
export function getAdaptiveRecommendations(): Recommendation[] {
  const states = getLearnerConceptStates();
  const stages = getAllStagesList();
  const recommendations: Recommendation[] = [];

  // 1. High Priority: Flagged Misconceptions needing remediation
  for (const stage of stages) {
    const state = states[stage.id];
    if (state && state.misconceptionsObserved.length > 0) {
      const miscId = state.misconceptionsObserved[0];
      const miscInfo = MISCONCEPTIONS_CATALOG[miscId];
      recommendations.push({
        id: `rec-misc-${stage.id}`,
        type: 'break-it',
        conceptId: stage.id,
        stageCode: stage.stageCode,
        stageNumber: stage.stageNumber,
        title: `Remediate: Stage ${stage.stageCode} — ${stage.title}`,
        eyebrow: 'MISCONCEPTION REMEDIATION',
        reason: miscInfo
          ? `Recommended because you observed the diagnostic misconception: "${miscInfo.name}". ${miscInfo.suggestedAction}`
          : `Recommended to strengthen conceptual understanding in Stage ${stage.stageCode}.`,
        targetUrl: `/lessons/${stage.lessonId}`,
        priority: 'high',
      });
    }
  }

  // 2. Next Unlocked Stage in the 12-Stage Pedagogical Sequence
  for (const stage of stages) {
    const state = states[stage.id];
    const isMastered = (state?.masteryScore || 0) >= 80;

    if (!isMastered) {
      // Check if all prerequisites are satisfied (score >= 60 or attempts >= 1)
      const prereqsMet = stage.prerequisites.every((prereqId) => {
        const canonicalPrereq = ALIAS_MAP[prereqId] || prereqId;
        const prState = states[canonicalPrereq];
        return prState && (prState.masteryScore >= 60 || prState.attempts >= 1);
      });

      if (prereqsMet) {
        const prereqTitles = stage.prerequisites
          .map((p) => CURRICULUM_STAGES[ALIAS_MAP[p] || p]?.title || p)
          .join(', ');

        recommendations.push({
          id: `rec-next-${stage.id}`,
          type: 'lesson',
          conceptId: stage.id,
          stageCode: stage.stageCode,
          stageNumber: stage.stageNumber,
          title: `Stage ${stage.stageCode}: ${stage.title}`,
          eyebrow: `RECOMMENDED STAGE // ${stage.category.toUpperCase()}`,
          reason:
            stage.prerequisites.length === 0
              ? 'Foundational entry point. Master the core taxonomy and ML lifecycle.'
              : `All required prerequisites (${prereqTitles}) are satisfied. Ready to advance into Stage ${stage.stageCode}.`,
          targetUrl: `/lessons/${stage.lessonId}`,
          priority: 'medium',
        });
        break; // Only recommend the immediate next unlocked stage in sequence
      }
    }
  }

  // Fallback if learner has mastered everything
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-default',
      type: 'lesson',
      conceptId: 'model-comparison',
      stageCode: '12',
      stageNumber: 12,
      title: 'Stage 12: Model Comparison & Scientific Experimentation',
      eyebrow: 'CURRICULUM SYNTHESIS',
      reason: 'All essential stages mastered! Test competing inductive biases on pathological datasets in Comparison Studio.',
      targetUrl: '/compare',
      priority: 'high',
    });
  }

  return recommendations;
}

// Experiments Notebook Storage
export function getSavedExperiments(): ExperimentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS);
    if (!raw) {
      const defaultExp: ExperimentRecord[] = [
        {
          id: 'exp-init-1',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          name: 'K-Means Benchmark on Blobs',
          datasetName: 'Synthetic Gaussian Blobs (K=3)',
          datasetFingerprint: 'sha256-blobs-42',
          algorithm: 'K-Means (Lloyd)',
          taskType: 'clustering',
          hyperparameters: { k: 3, init: 'kmeans++', maxIter: 20 },
          metrics: { 'Final Inertia': 1420.5, 'Iterations to Converge': 4, 'Max Shift': '0.000px' },
          runtimeMs: 12.4,
          warnings: [],
          notes: 'Converged cleanly in 4 iterations with kmeans++ initialization.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(defaultExp));
      return defaultExp;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load experiments', e);
    return [];
  }
}

export function saveExperimentRecord(exp: Omit<ExperimentRecord, 'id' | 'timestamp'>): ExperimentRecord {
  const records = getSavedExperiments();
  const newRecord: ExperimentRecord = {
    ...exp,
    id: `exp-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  records.unshift(newRecord);
  try {
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save experiment', e);
  }
  return newRecord;
}
