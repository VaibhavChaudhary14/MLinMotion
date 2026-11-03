import { LearnerConceptState, ExperimentRecord } from '@/types';
import { CONCEPT_GRAPH } from './conceptGraph';
import { MISCONCEPTIONS_CATALOG } from './misconceptions';

export interface Recommendation {
  id: string;
  type: 'lesson' | 'review' | 'break-it' | 'lab';
  conceptId: string;
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

export function getLearnerConceptStates(): Record<string, LearnerConceptState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONCEPT_STATES);
    if (!raw) {
      // Default initial bootstrap states
      const defaults: Record<string, LearnerConceptState> = {
        'distance-metrics': {
          conceptId: 'distance-metrics',
          title: 'Distance Metrics & Norms',
          attempts: 5,
          correctAnswers: 5,
          masteryScore: 92,
          lastPracticed: new Date(Date.now() - 86400000 * 3).toISOString(),
          misconceptionsObserved: [],
        },
        'kmeans-clustering': {
          conceptId: 'kmeans-clustering',
          title: 'K-Means Clustering',
          attempts: 7,
          correctAnswers: 5,
          masteryScore: 68,
          lastPracticed: new Date(Date.now() - 86400000).toISOString(),
          misconceptionsObserved: ['kmeans-global-optimum'],
        },
      };
      localStorage.setItem(STORAGE_KEYS.CONCEPT_STATES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
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
  const states = getLearnerConceptStates();
  const current = states[conceptId] || {
    conceptId,
    title: CONCEPT_GRAPH[conceptId]?.title || conceptId,
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

  states[conceptId] = current;
  try {
    localStorage.setItem(STORAGE_KEYS.CONCEPT_STATES, JSON.stringify(states));
  } catch (e) {
    console.error('Failed to save concept attempt', e);
  }
}

// Generate deterministic, transparent recommendations
export function getAdaptiveRecommendations(): Recommendation[] {
  const states = getLearnerConceptStates();
  const recommendations: Recommendation[] = [];

  // Check 1: Weak concepts with flagged misconceptions
  for (const [conceptId, state] of Object.entries(states)) {
    if (state.misconceptionsObserved.length > 0) {
      const miscId = state.misconceptionsObserved[0];
      const miscInfo = MISCONCEPTIONS_CATALOG[miscId];
      recommendations.push({
        id: `rec-misc-${conceptId}`,
        type: 'break-it',
        conceptId,
        title: `Remediate: ${state.title}`,
        eyebrow: 'MISCONCEPTION REMEDIATION',
        reason: miscInfo
          ? `Recommended because you observed the diagnostic misconception: "${miscInfo.name}". ${miscInfo.suggestedAction}`
          : `Recommended to strengthen intuition on ${state.title}.`,
        targetUrl: `/lessons/${conceptId}`,
        priority: 'high',
      });
    }
  }

  // Check 2: Next unlocked concept in graph based on prerequisites
  for (const [conceptId, node] of Object.entries(CONCEPT_GRAPH)) {
    const isMastered = (states[conceptId]?.masteryScore || 0) >= 80;
    if (!isMastered) {
      // Check if all prerequisites are satisfied (score >= 60)
      const prereqsMet = node.prerequisites.every((prereqId) => (states[prereqId]?.masteryScore || 0) >= 60);
      if (prereqsMet) {
        recommendations.push({
          id: `rec-next-${conceptId}`,
          type: 'lesson',
          conceptId,
          title: `Next Up: ${node.title}`,
          eyebrow: 'UNLOCKED PREREQUISITE PATH',
          reason: `All prerequisites (${node.prerequisites.join(', ') || 'None'}) are satisfied. Ready to advance into ${node.title}.`,
          targetUrl: `/lessons/${conceptId}`,
          priority: 'medium',
        });
        break; // Only suggest one next step at a time
      }
    }
  }

  // Fallback if none found
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-default',
      type: 'lesson',
      conceptId: 'kmeans-clustering',
      title: 'Algorithm Cinema: K-Means',
      eyebrow: 'CURATED BENCHMARK',
      reason: 'Recommended core foundation: Explore centroid dynamics and Voronoi partitioning.',
      targetUrl: '/cinema/kmeans',
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
