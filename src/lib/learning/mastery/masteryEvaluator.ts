/**
 * ML in Motion — Deterministic Concept Mastery Evaluator
 *
 * Rules:
 * - Real engine evidence only: prediction checkpoints, challenge verifications, practice questions.
 * - ZERO reliance on time spent, page visits, animation playback, or synthetic random scores.
 * - Bypasses are strictly excluded from prediction performance.
 * - Prerequisite enforcement: A concept cannot be MASTERED if its direct prerequisites are NOT_STARTED.
 */

import type {
  MasteryEvaluationInput,
  MasteryEvaluationResult,
} from './types.ts';
import type { ConceptMasteryState } from '../types.ts';
import { CONCEPT_GRAPH } from '../concepts/conceptGraph.ts';

export function evaluateConceptMastery(
  input: MasteryEvaluationInput
): MasteryEvaluationResult {
  const {
    conceptId,
    predictions,
    challenges,
    practiceAttempts,
    prerequisiteMasteryStates = {},
  } = input;

  const concept = CONCEPT_GRAPH[conceptId];
  if (!concept) {
    return {
      conceptId,
      state: 'NOT_STARTED',
      score: 0,
      reasons: [`Concept ${conceptId} not found in concept graph`],
      unmetPrerequisites: [],
      stats: {
        predictionCount: 0,
        predictionAccuracy: 0,
        completedChallenges: [],
        practiceCount: 0,
        practiceAccuracy: 0,
      },
    };
  }

  // 1. Gather relevant evidence
  // Match predictions that correlate with this concept
  // A prediction relates if its category/id matches concept or related challenges
  const relatedPreds = predictions.filter((p) => {
    if (concept.subject === 'optimization' && p.algorithmId === 'gradient-descent') return true;
    if (concept.subject === 'clustering' && p.algorithmId === 'kmeans') return true;
    return false;
  });

  const predCount = relatedPreds.length;
  const predCorrect = relatedPreds.filter((p) => p.status === 'correct').length;
  const predPartial = relatedPreds.filter((p) => p.status === 'partially_correct').length;
  const predAccuracy = predCount > 0 ? Math.round(((predCorrect + 0.5 * predPartial) / predCount) * 100) : 0;

  // Challenges completed for this concept
  const completedChallenges = concept.relatedChallenges.filter(
    (chId) => challenges[chId]?.completed
  );

  // Practice attempts for this concept
  const relatedPractice = practiceAttempts.filter((pa) => pa.conceptId === conceptId);
  const practiceCount = relatedPractice.length;
  const practiceCorrect = relatedPractice.filter((pa) => pa.isCorrect).length;
  const practiceAccuracy = practiceCount > 0 ? Math.round((practiceCorrect / practiceCount) * 100) : 0;

  // 2. Check Prerequisites
  const unmetPrerequisites: string[] = [];
  for (const prereqId of concept.prerequisites) {
    const pState = prerequisiteMasteryStates[prereqId] || 'NOT_STARTED';
    if (pState === 'NOT_STARTED') {
      unmetPrerequisites.push(prereqId);
    }
  }

  const reasons: string[] = [];
  const criteria = concept.completionCriteria;

  // 3. Determine State
  const hasAnyActivity = predCount > 0 || completedChallenges.length > 0 || practiceCount > 0;

  if (!hasAnyActivity) {
    return {
      conceptId,
      state: 'NOT_STARTED',
      score: 0,
      reasons: ['No predictions, challenges, or practice questions attempted yet.'],
      unmetPrerequisites,
      stats: {
        predictionCount: 0,
        predictionAccuracy: 0,
        completedChallenges: [],
        practiceCount: 0,
        practiceAccuracy: 0,
      },
    };
  }

  // Check if criteria for MASTERED are fulfilled
  const meetsChallenges = criteria.requiredChallengeIds.every(
    (chId) => challenges[chId]?.completed
  );
  const meetsPredictions =
    criteria.minPredictions === 0 ||
    (predCount >= criteria.minPredictions && predAccuracy >= criteria.minAccuracy);
  const meetsPractice =
    criteria.minPracticePassed === 0 || practiceCorrect >= criteria.minPracticePassed;
  const meetsPrerequisites = unmetPrerequisites.length === 0;

  // Compute composite score (0 to 100)
  let challengeScore = 100;
  if (criteria.requiredChallengeIds.length > 0) {
    challengeScore = Math.round(
      (completedChallenges.length / criteria.requiredChallengeIds.length) * 100
    );
  }

  const predWeight = criteria.minPredictions > 0 ? 0.35 : 0;
  const challWeight = criteria.requiredChallengeIds.length > 0 ? 0.40 : 0;
  const pracWeight = criteria.minPracticePassed > 0 ? 0.25 : 0;
  const totalWeight = predWeight + challWeight + pracWeight || 1.0;

  const rawScore =
    (predAccuracy * predWeight + challengeScore * challWeight + practiceAccuracy * pracWeight) /
    totalWeight;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Mastered rule:
  if (meetsChallenges && meetsPredictions && meetsPractice && meetsPrerequisites && score >= 80) {
    reasons.push('All completion criteria, challenges, and practice targets achieved.');
    if (criteria.requiredChallengeIds.length > 0) {
      reasons.push(`Verified ${completedChallenges.length}/${criteria.requiredChallengeIds.length} required failure challenges.`);
    }
    if (practiceCorrect > 0) {
      reasons.push(`Demonstrated ${practiceCorrect} verified practice questions.`);
    }
    return {
      conceptId,
      state: 'MASTERED',
      score,
      reasons,
      unmetPrerequisites: [],
      stats: {
        predictionCount: predCount,
        predictionAccuracy: predAccuracy,
        completedChallenges,
        practiceCount,
        practiceAccuracy,
      },
    };
  }

  // Check recent failure for NEEDS_REVISION
  const lastPractice = relatedPractice[relatedPractice.length - 1];
  const lastPred = relatedPreds[relatedPreds.length - 1];
  const failedRecentPractice = lastPractice && !lastPractice.isCorrect;
  const failedRecentPred = lastPred && lastPred.status === 'incorrect';

  if ((failedRecentPractice || failedRecentPred) && score < 70) {
    reasons.push('Recent assessment attempt resulted in misconception or incorrect answer.');
    if (failedRecentPractice) reasons.push('Incorrect answer on recent practice problem.');
    if (failedRecentPred) reasons.push('Prediction discrepancy recorded in simulation.');
    return {
      conceptId,
      state: 'NEEDS_REVISION',
      score,
      reasons,
      unmetPrerequisites,
      stats: {
        predictionCount: predCount,
        predictionAccuracy: predAccuracy,
        completedChallenges,
        practiceCount,
        practiceAccuracy,
      },
    };
  }

  // Developing vs In Progress
  if (score >= 40 || completedChallenges.length > 0 || practiceCorrect > 0) {
    if (unmetPrerequisites.length > 0) {
      reasons.push(`Unmet prerequisites pending: ${unmetPrerequisites.join(', ')}.`);
    }
    if (!meetsChallenges && criteria.requiredChallengeIds.length > 0) {
      const remaining = criteria.requiredChallengeIds.filter((c) => !completedChallenges.includes(c));
      reasons.push(`Challenges remaining to solve: ${remaining.join(', ')}.`);
    }
    if (!meetsPractice && criteria.minPracticePassed > practiceCorrect) {
      reasons.push(`Need ${criteria.minPracticePassed - practiceCorrect} more correct practice answers.`);
    }
    return {
      conceptId,
      state: 'DEVELOPING',
      score,
      reasons,
      unmetPrerequisites,
      stats: {
        predictionCount: predCount,
        predictionAccuracy: predAccuracy,
        completedChallenges,
        practiceCount,
        practiceAccuracy,
      },
    };
  }

  return {
    conceptId,
    state: 'IN_PROGRESS',
    score,
    reasons: ['Initial learning activity started, building foundational accuracy.'],
    unmetPrerequisites,
    stats: {
      predictionCount: predCount,
      predictionAccuracy: predAccuracy,
      completedChallenges,
      practiceCount,
      practiceAccuracy,
    },
  };
}
