/**
 * ML in Motion — 100% Client-Side Local Learning Analytics Storage
 *
 * Privacy Guarantees:
 * - 0% external analytics, telemetry, or network calls.
 * - All attempts and challenge completions stay in the browser's localStorage.
 * - Fully exportable (JSON) and clearable by the user at any time.
 */

import type {
  LocalLearningProfile,
  PredictionAttemptRecord,
  ChallengeRecord,
  PredictionEvaluationStatus,
} from './types.ts';

const STORAGE_KEY = 'ml_in_motion_learning_profile_v1';

export function getInitialProfile(): LocalLearningProfile {
  return {
    version: 1,
    lastActive: Date.now(),
    predictions: [],
    challenges: {},
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
      predictions: Array.isArray(parsed.predictions) ? parsed.predictions : [],
      challenges: typeof parsed.challenges === 'object' && parsed.challenges !== null ? parsed.challenges : {},
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
  };
}
