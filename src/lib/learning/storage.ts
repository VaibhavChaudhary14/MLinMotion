/**
 * ML in Motion — Client-Side Local Learning Analytics Storage
 *
 * Privacy Architecture & Delineation:
 * - All personal learning progress, predictions, bypass counts, and challenge
 *   evaluations are stored strictly client-side in the browser's localStorage.
 * - Zero user learning data or experiment parameters are ever transmitted to any remote server.
 * - Anonymous platform telemetry (page views, core web vitals) is managed separately via Vercel Analytics.
 * - Fully exportable (JSON) and clearable by the user at any time.
 */

import type {
  LocalLearningProfile,
  PredictionAttemptRecord,
  ChallengeRecord,
  PredictionEvaluationStatus,
  PracticeAttemptRecord,
  ConceptMasteryRecord,
  ConceptMasteryState,
  RevisionScheduleRecord,
} from './types.ts';
import type { PathProgressSummary } from './paths/types.ts';
import { STRUCTURED_LEARNING_PATHS, getPathConceptIds } from './paths/learningPaths.ts';
import { CONCEPT_GRAPH } from './concepts/conceptGraph.ts';
import { evaluateConceptMastery } from './mastery/masteryEvaluator.ts';

const STORAGE_KEY = 'ml_in_motion_learning_profile_v1';

export function getInitialProfile(): LocalLearningProfile {
  return {
    version: 1,
    lastActive: Date.now(),
    activePathId: 'path-optimization',
    predictions: [],
    challenges: {},
    practiceAttempts: [],
    conceptMastery: {},
    revisionSchedule: {},
    bypassesCount: 0,
  };
}

export function loadLearningProfile(): LocalLearningProfile {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialProfile();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProfile();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return getInitialProfile();
    return {
      version: parsed.version || 1,
      lastActive: parsed.lastActive || Date.now(),
      activePathId: parsed.activePathId || 'path-optimization',
      predictions: Array.isArray(parsed.predictions) ? parsed.predictions : [],
      challenges: typeof parsed.challenges === 'object' && parsed.challenges !== null ? parsed.challenges : {},
      practiceAttempts: Array.isArray(parsed.practiceAttempts) ? parsed.practiceAttempts : [],
      conceptMastery: typeof parsed.conceptMastery === 'object' && parsed.conceptMastery !== null ? parsed.conceptMastery : {},
      revisionSchedule: typeof parsed.revisionSchedule === 'object' && parsed.revisionSchedule !== null ? parsed.revisionSchedule : {},
      bypassesCount: typeof parsed.bypassesCount === 'number' ? parsed.bypassesCount : 0,
    };
  } catch (err) {
    console.warn('[LearningStorage] Failed to read profile from localStorage:', err);
    return getInitialProfile();
  }
}

export function saveLearningProfile(profile: LocalLearningProfile): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    profile.lastActive = Date.now();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.warn('[LearningStorage] Failed to save profile to localStorage:', err);
    return false;
  }
}

export function recordPredictionAttempt(
  questionId: string,
  algorithmId: 'gradient-descent' | 'kmeans',
  category: PredictionAttemptRecord['category'],
  userGuess: any,
  status: PredictionEvaluationStatus,
  score: number
): LocalLearningProfile {
  const profile = loadLearningProfile();
  const attempt: PredictionAttemptRecord = {
    id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    questionId,
    algorithmId,
    category,
    userGuess,
    status,
    score,
    timestamp: Date.now(),
  };
  profile.predictions.push(attempt);
  saveLearningProfile(profile);
  return profile;
}

/**
 * Records when a learner intentionally skips or bypasses a prediction lock.
 * Crucially, bypasses DO NOT affect prediction attempt counts, score tallies, or accuracy calculations.
 */
export function recordPredictionBypass(
  _questionId?: string,
  _algorithmId?: 'gradient-descent' | 'kmeans'
): LocalLearningProfile {
  const profile = loadLearningProfile();
  profile.bypassesCount = (profile.bypassesCount || 0) + 1;
  saveLearningProfile(profile);
  return profile;
}

export function recordChallengeAttempt(
  challengeId: string,
  algorithmId: 'gradient-descent' | 'kmeans',
  passed: boolean,
  diagnosticSnapshot?: Record<string, any>
): { profile: LocalLearningProfile; record: ChallengeRecord } {
  const profile = loadLearningProfile();
  const existing = profile.challenges[challengeId] || {
    challengeId,
    algorithmId,
    completed: false,
    attemptsCount: 0,
    lastAttemptAt: Date.now(),
  };

  existing.attemptsCount += 1;
  existing.lastAttemptAt = Date.now();
  if (diagnosticSnapshot) {
    existing.diagnosticSnapshot = diagnosticSnapshot;
  }
  if (passed) {
    existing.completed = true;
    if (!existing.firstCompletedAt) {
      existing.firstCompletedAt = Date.now();
    }
  }

  profile.challenges[challengeId] = existing;
  saveLearningProfile(profile);
  return { profile, record: existing };
}

export function clearLearningProfile(): LocalLearningProfile {
  const fresh = getInitialProfile();
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore storage errors
    }
  }
  return fresh;
}

export function exportLearningProfileJson(): string {
  const profile = loadLearningProfile();
  return JSON.stringify(profile, null, 2);
}

export function calculateProfileStats(profile: LocalLearningProfile) {
  const totalPredictions = profile.predictions.length;
  const correctPredictions = profile.predictions.filter((p) => p.status === 'correct').length;
  const partialPredictions = profile.predictions.filter((p) => p.status === 'partially_correct').length;
  const accuracyRate = totalPredictions > 0
    ? Math.round(((correctPredictions + 0.5 * partialPredictions) / totalPredictions) * 100)
    : 0;

  const challengeKeys = Object.keys(profile.challenges);
  const completedChallenges = challengeKeys.filter((k) => profile.challenges[k].completed).length;

  return {
    totalPredictions,
    correctPredictions,
    partialPredictions,
    accuracyRate,
    totalChallengesAttempted: challengeKeys.length,
    completedChallenges,
    bypassesCount: profile.bypassesCount || 0,
  };
}

export function recordPracticeAttempt(
  questionId: string,
  conceptId: string,
  userAnswer: unknown,
  isCorrect: boolean,
  score: number
): { profile: LocalLearningProfile; attempt: PracticeAttemptRecord } {
  const profile = loadLearningProfile();
  const attempt: PracticeAttemptRecord = {
    id: `prac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    questionId,
    conceptId,
    userAnswer,
    isCorrect,
    score,
    timestamp: Date.now(),
  };

  profile.practiceAttempts.push(attempt);
  saveLearningProfile(profile);

  // Automatically refresh mastery evaluations with latest attempt
  recalculateAllConceptMastery(profile);

  return { profile, attempt };
}

export function updateActiveLearningPath(pathId: string): LocalLearningProfile {
  const profile = loadLearningProfile();
  if (STRUCTURED_LEARNING_PATHS[pathId]) {
    profile.activePathId = pathId;
    saveLearningProfile(profile);
  }
  return profile;
}

export function recordRevisionSchedule(
  schedule: RevisionScheduleRecord
): LocalLearningProfile {
  const profile = loadLearningProfile();
  profile.revisionSchedule[schedule.conceptId] = schedule;
  saveLearningProfile(profile);
  return profile;
}

export function recalculateAllConceptMastery(
  existingProfile?: LocalLearningProfile
): LocalLearningProfile {
  const profile = existingProfile || loadLearningProfile();
  const statesMap: Record<string, ConceptMasteryState> = {};

  for (const [cId, m] of Object.entries(profile.conceptMastery || {})) {
    statesMap[cId] = m.state;
  }

  for (const cId of Object.keys(CONCEPT_GRAPH)) {
    const res = evaluateConceptMastery({
      conceptId: cId,
      predictions: profile.predictions,
      challenges: profile.challenges,
      practiceAttempts: profile.practiceAttempts,
      prerequisiteMasteryStates: statesMap,
    });

    statesMap[cId] = res.state;
    profile.conceptMastery[cId] = {
      conceptId: cId,
      state: res.state,
      score: res.score,
      evaluatedAt: Date.now(),
      evidence: {
        predictionCount: res.stats.predictionCount,
        predictionAccuracy: res.stats.predictionAccuracy,
        completedChallenges: res.stats.completedChallenges,
        practiceCount: res.stats.practiceCount,
        practiceAccuracy: res.stats.practiceAccuracy,
        prerequisitesMet: res.unmetPrerequisites.length === 0,
      },
    };
  }

  saveLearningProfile(profile);
  return profile;
}

export function getPathProgressSummary(
  pathId: string,
  existingProfile?: LocalLearningProfile
): PathProgressSummary {
  const profile = existingProfile || loadLearningProfile();
  const path = STRUCTURED_LEARNING_PATHS[pathId] || STRUCTURED_LEARNING_PATHS['path-optimization'];
  const conceptIds = getPathConceptIds(path);

  let masteredCount = 0;
  let inProgressCount = 0;
  let needsRevisionCount = 0;
  let notStartedCount = 0;

  for (const cId of conceptIds) {
    const m = profile.conceptMastery?.[cId];
    const state = m?.state || 'NOT_STARTED';
    if (state === 'MASTERED') masteredCount++;
    else if (state === 'NEEDS_REVISION') needsRevisionCount++;
    else if (state === 'IN_PROGRESS' || state === 'DEVELOPING') inProgressCount++;
    else notStartedCount++;
  }

  const total = conceptIds.length;
  const percent = total > 0 ? Math.round((masteredCount / total) * 100) : 0;
  const nextRec = getRecommendedNextConcept(path.id, profile);

  return {
    pathId: path.id,
    totalConcepts: total,
    masteredCount,
    inProgressCount,
    needsRevisionCount,
    notStartedCount,
    percentComplete: percent,
    currentConceptId: nextRec,
    nextRecommendedConceptId: nextRec,
  };
}

export function getRecommendedNextConcept(
  pathId: string,
  existingProfile?: LocalLearningProfile
): string | null {
  const profile = existingProfile || loadLearningProfile();
  const path = STRUCTURED_LEARNING_PATHS[pathId] || STRUCTURED_LEARNING_PATHS['path-optimization'];
  const conceptIds = getPathConceptIds(path);

  // 1. Highest priority: any concept in NEEDS_REVISION
  for (const cId of conceptIds) {
    if (profile.conceptMastery?.[cId]?.state === 'NEEDS_REVISION') {
      return cId;
    }
  }

  // 2. Second priority: any concept currently DEVELOPING or IN_PROGRESS whose prerequisites are satisfied
  for (const cId of conceptIds) {
    const state = profile.conceptMastery?.[cId]?.state;
    if (state === 'IN_PROGRESS' || state === 'DEVELOPING') {
      const node = CONCEPT_GRAPH[cId];
      const prereqsMet = (node?.prerequisites || []).every(
        (pId) => profile.conceptMastery?.[pId]?.state === 'MASTERED' || profile.conceptMastery?.[pId]?.state === 'DEVELOPING'
      );
      if (prereqsMet) return cId;
    }
  }

  // 3. Third priority: first NOT_STARTED concept whose prerequisites are satisfied
  for (const cId of conceptIds) {
    const state = profile.conceptMastery?.[cId]?.state || 'NOT_STARTED';
    if (state === 'NOT_STARTED') {
      const node = CONCEPT_GRAPH[cId];
      const prereqsMet = (node?.prerequisites || []).every(
        (pId) => profile.conceptMastery?.[pId]?.state === 'MASTERED'
      );
      if (prereqsMet) return cId;
    }
  }

  return conceptIds[0] || null;
}
