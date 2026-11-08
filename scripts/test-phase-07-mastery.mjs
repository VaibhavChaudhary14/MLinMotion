/**
 * ML in Motion — Phase 07: Structured Learning Paths & Concept Mastery Test Suite
 *
 * Automated verification of:
 * - Concept Knowledge Graph DAG properties & cycle detection
 * - Topological sort ordering & prerequisite enforcement
 * - Structured Learning Path integrity & coverage
 * - Practice assessment scoring & numerical tolerances
 * - Deterministic, explainable concept mastery evaluation
 * - Bypass exclusion invariant in mastery scoring
 * - Spaced revision ladder scheduling and queue prioritization
 * - Deterministic next-concept recommendations
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONCEPT_GRAPH,
  detectCircularDependencies,
  getTopologicalOrder,
  validatePrerequisites,
  getTransitivePrerequisites,
  getDirectDependents,
} from '../src/lib/learning/concepts/index.ts';

import {
  STRUCTURED_LEARNING_PATHS,
  getPathConceptIds,
} from '../src/lib/learning/paths/index.ts';

import {
  PRACTICE_QUESTIONS,
  evaluatePracticeQuestion,
} from '../src/lib/learning/assessment/index.ts';

import {
  evaluateConceptMastery,
} from '../src/lib/learning/mastery/index.ts';

import {
  computeNextRevisionSchedule,
  getActiveRevisionQueue,
} from '../src/lib/learning/revision/index.ts';

import {
  getInitialProfile,
  calculateProfileStats,
  recordPracticeAttempt,
  recalculateAllConceptMastery,
  getPathProgressSummary,
  getRecommendedNextConcept,
} from '../src/lib/learning/storage.ts';

// =============================================================================
// SUITE 1: CONCEPT KNOWLEDGE GRAPH (DAG & PREREQUISITES)
// =============================================================================

test('TC-P7-01: Concept Knowledge Graph — Forms a valid DAG with 0 circular dependencies', () => {
  const cycles = detectCircularDependencies(CONCEPT_GRAPH);
  assert.equal(cycles.length, 0, `Concept graph must have 0 cycles, found: ${JSON.stringify(cycles)}`);
  assert.ok(Object.keys(CONCEPT_GRAPH).length >= 15, 'Concept graph must contain at least 15 core concepts');
});

test('TC-P7-02: Topological Sorting — Prerequisites strictly precede descendant concepts', () => {
  const order = getTopologicalOrder(CONCEPT_GRAPH);
  assert.equal(order.length, Object.keys(CONCEPT_GRAPH).length);

  // Check critical prerequisite sequences
  const idxFunctions = order.indexOf('math-functions');
  const idxDerivatives = order.indexOf('math-derivatives');
  const idxPartial = order.indexOf('math-partial-derivatives');
  const idxGradients = order.indexOf('math-gradients');
  const idxHessians = order.indexOf('math-hessians');
  const idxGD = order.indexOf('opt-gradient-descent');
  const idxLR = order.indexOf('opt-learning-rate');
  const idxAniso = order.indexOf('opt-anisotropic-valleys');

  assert.ok(idxFunctions < idxDerivatives, 'Functions must precede Derivatives');
  assert.ok(idxDerivatives < idxPartial, 'Derivatives must precede Partial Derivatives');
  assert.ok(idxPartial < idxGradients, 'Partial Derivatives must precede Gradients');
  assert.ok(idxGradients < idxGD, 'Gradients must precede Gradient Descent');
  assert.ok(idxGD < idxLR, 'Gradient Descent must precede Learning Rate');
  assert.ok(idxHessians < idxAniso, 'Hessians must precede Anisotropic Valleys');
});

test('TC-P7-03: Circular Prerequisite Detection — Flags intentional cycle introduction', () => {
  const mutatedGraph = {
    nodeA: {
      id: 'nodeA',
      name: 'Node A',
      subject: 'mathematics',
      difficulty: 'foundational',
      summary: '',
      prerequisites: ['nodeB'],
      learningObjectives: [],
      relatedChallenges: [],
      relatedPracticeQuestionIds: [],
      completionCriteria: { minPredictions: 0, minAccuracy: 0, requiredChallengeIds: [], minPracticePassed: 0 },
      isImplemented: true,
    },
    nodeB: {
      id: 'nodeB',
      name: 'Node B',
      subject: 'mathematics',
      difficulty: 'foundational',
      summary: '',
      prerequisites: ['nodeA'],
      learningObjectives: [],
      relatedChallenges: [],
      relatedPracticeQuestionIds: [],
      completionCriteria: { minPredictions: 0, minAccuracy: 0, requiredChallengeIds: [], minPracticePassed: 0 },
      isImplemented: true,
    },
  };

  const cycles = detectCircularDependencies(mutatedGraph);
  assert.ok(cycles.length > 0, 'Must detect circular dependency between nodeA and nodeB');
});

test('TC-P7-04: Prerequisite Enforcement — Correctly validates missing prerequisites', () => {
  const mastered = new Set(['math-functions', 'math-derivatives']);
  // math-partial-derivatives requires math-derivatives -> satisfied!
  const checkPartial = validatePrerequisites('math-partial-derivatives', mastered, CONCEPT_GRAPH);
  assert.equal(checkPartial.satisfied, true);
  assert.equal(checkPartial.missingPrerequisites.length, 0);

  // math-gradients requires math-partial-derivatives -> unsatisfied!
  const checkGrad = validatePrerequisites('math-gradients', mastered, CONCEPT_GRAPH);
  assert.equal(checkGrad.satisfied, false);
  assert.deepEqual(checkGrad.missingPrerequisites, ['math-partial-derivatives']);
});

test('TC-P7-05: Transitive Prerequisite Resolution — Traces full ancestor tree', () => {
  const ancestors = getTransitivePrerequisites('opt-anisotropic-valleys', CONCEPT_GRAPH);
  assert.ok(ancestors.includes('opt-convergence-regimes'));
  assert.ok(ancestors.includes('opt-learning-rate'));
  assert.ok(ancestors.includes('opt-gradient-descent'));
  assert.ok(ancestors.includes('math-hessians'));
  assert.ok(ancestors.includes('math-gradients'));
  assert.ok(ancestors.includes('math-functions'));
});

// =============================================================================
// SUITE 2: STRUCTURED LEARNING PATHS
// =============================================================================

test('TC-P7-06: Structured Learning Paths — All 5 paths define valid concepts', () => {
  const paths = Object.values(STRUCTURED_LEARNING_PATHS);
  assert.equal(paths.length, 5, 'Must define 5 distinct learning paths');

  for (const p of paths) {
    assert.ok(p.title.length > 5);
    assert.ok(p.modules.length >= 2, `Path ${p.id} must contain at least 2 modules`);

    const cIds = getPathConceptIds(p);
    assert.ok(cIds.length >= 4, `Path ${p.id} must contain at least 4 concepts`);

    // Verify all referenced concept IDs actually exist in CONCEPT_GRAPH
    for (const cId of cIds) {
      assert.ok(CONCEPT_GRAPH[cId], `Concept ID ${cId} in path ${p.id} must exist in CONCEPT_GRAPH`);
    }
  }
});

test('TC-P7-07: Flagship Paths — Map to complete interactive workbenches and challenges', () => {
  const optPath = STRUCTURED_LEARNING_PATHS['path-optimization'];
  assert.ok(optPath.isPrimaryFlagship);
  const optConceptIds = getPathConceptIds(optPath);
  assert.ok(optConceptIds.includes('opt-gradient-descent'));
  assert.ok(optConceptIds.includes('opt-learning-rate'));
  assert.ok(optConceptIds.includes('opt-saddle-points'));

  const clustPath = STRUCTURED_LEARNING_PATHS['path-clustering'];
  assert.ok(clustPath.isPrimaryFlagship);
  const clustConceptIds = getPathConceptIds(clustPath);
  assert.ok(clustConceptIds.includes('clust-kmeans-lloyd'));
  assert.ok(clustConceptIds.includes('clust-kmeans-plus-plus'));
  assert.ok(clustConceptIds.includes('clust-model-complexity'));
});

// =============================================================================
// SUITE 3: PRACTICE ASSESSMENT LAYER
// =============================================================================

test('TC-P7-08: Practice Bank — Multiple-choice questions evaluate correctly', () => {
  const qMc = PRACTICE_QUESTIONS.find((q) => q.id === 'prac-math-grad-01');
  assert.ok(qMc);
  assert.equal(qMc.format, 'multiple_choice');

  const evalCorrect = evaluatePracticeQuestion(qMc, 'opt_a');
  assert.equal(evalCorrect.isCorrect, true);
  assert.equal(evalCorrect.score, 1.0);

  const evalWrong = evaluatePracticeQuestion(qMc, 'opt_b');
  assert.equal(evalWrong.isCorrect, false);
  assert.equal(evalWrong.score, 0.0);
});

test('TC-P7-09: Practice Bank — Numerical questions evaluate within tolerance', () => {
  const qNum = PRACTICE_QUESTIONS.find((q) => q.id === 'prac-opt-gd-01');
  assert.ok(qNum);
  assert.equal(qNum.format, 'numerical');

  // Exact target: 1.70, tolerance: 0.02
  const evalExact = evaluatePracticeQuestion(qNum, 1.70);
  assert.equal(evalExact.isCorrect, true);

  const evalTolerant = evaluatePracticeQuestion(qNum, 1.71);
  assert.equal(evalTolerant.isCorrect, true);

  const evalOff = evaluatePracticeQuestion(qNum, 1.85);
  assert.equal(evalOff.isCorrect, false);
});

// =============================================================================
// SUITE 4: CONCEPT MASTERY ENGINE
// =============================================================================

test('TC-P7-10: Mastery Evaluator — Returns NOT_STARTED when zero evidence exists', () => {
  const result = evaluateConceptMastery({
    conceptId: 'opt-learning-rate',
    predictions: [],
    challenges: {},
    practiceAttempts: [],
    prerequisiteMasteryStates: {},
  });

  assert.equal(result.state, 'NOT_STARTED');
  assert.equal(result.score, 0);
});

test('TC-P7-11: Mastery Evaluator — Transitions to MASTERED when all criteria & prereqs are met', () => {
  const result = evaluateConceptMastery({
    conceptId: 'opt-learning-rate',
    predictions: [
      {
        id: 'pred1',
        questionId: 'gd-pred-stability-regime',
        algorithmId: 'gradient-descent',
        category: 'spectral_stability',
        userGuess: 'limit_cycle',
        status: 'correct',
        score: 1.0,
        timestamp: Date.now(),
      },
      {
        id: 'pred2',
        questionId: 'gd-pred-1d-step',
        algorithmId: 'gradient-descent',
        category: 'parameter_update',
        userGuess: 1.70,
        status: 'correct',
        score: 1.0,
        timestamp: Date.now(),
      },
    ],
    challenges: {
      'GD-01': {
        challengeId: 'GD-01',
        algorithmId: 'gradient-descent',
        completed: true,
        attemptsCount: 1,
        lastAttemptAt: Date.now(),
      },
    },
    practiceAttempts: [
      {
        id: 'prac1',
        questionId: 'prac-opt-lr-01',
        conceptId: 'opt-learning-rate',
        userAnswer: 0.20,
        isCorrect: true,
        score: 1.0,
        timestamp: Date.now(),
      },
      {
        id: 'prac2',
        questionId: 'prac-opt-regimes-01',
        conceptId: 'opt-learning-rate',
        userAnswer: 'opt_b',
        isCorrect: true,
        score: 1.0,
        timestamp: Date.now(),
      },
    ],
    prerequisiteMasteryStates: {
      'opt-gradient-descent': 'MASTERED',
    },
  });

  assert.equal(result.state, 'MASTERED');
  assert.ok(result.score >= 80, `Mastery score must be >= 80, got ${result.score}`);
  assert.equal(result.unmetPrerequisites.length, 0);
  assert.ok(result.reasons.some((r) => r.includes('All completion criteria')));
});

test('TC-P7-12: Mastery Evaluator — Cannot be MASTERED if direct prerequisites are NOT_STARTED', () => {
  const result = evaluateConceptMastery({
    conceptId: 'opt-learning-rate',
    predictions: [
      { id: '1', questionId: 'q', algorithmId: 'gradient-descent', category: 'spectral_stability', userGuess: 'a', status: 'correct', score: 1.0, timestamp: 1 },
      { id: '2', questionId: 'q', algorithmId: 'gradient-descent', category: 'spectral_stability', userGuess: 'a', status: 'correct', score: 1.0, timestamp: 2 },
    ],
    challenges: { 'GD-01': { challengeId: 'GD-01', algorithmId: 'gradient-descent', completed: true, attemptsCount: 1, lastAttemptAt: 1 } },
    practiceAttempts: [
      { id: '1', questionId: 'q', conceptId: 'opt-learning-rate', userAnswer: 'a', isCorrect: true, score: 1, timestamp: 1 },
      { id: '2', questionId: 'q', conceptId: 'opt-learning-rate', userAnswer: 'a', isCorrect: true, score: 1, timestamp: 2 },
    ],
    // opt-gradient-descent is NOT_STARTED
    prerequisiteMasteryStates: {
      'opt-gradient-descent': 'NOT_STARTED',
    },
  });

  assert.notEqual(result.state, 'MASTERED', 'Cannot achieve MASTERED state if direct prerequisite is NOT_STARTED');
  assert.ok(result.unmetPrerequisites.includes('opt-gradient-descent'));
});

test('TC-P7-13: Bypass Exclusion — Bypasses are excluded from predictions and do not count toward mastery', () => {
  const result = evaluateConceptMastery({
    conceptId: 'opt-learning-rate',
    // 0 predictions in array (user bypassed all locks)
    predictions: [],
    challenges: { 'GD-01': { challengeId: 'GD-01', algorithmId: 'gradient-descent', completed: true, attemptsCount: 1, lastAttemptAt: 1 } },
    practiceAttempts: [],
    prerequisiteMasteryStates: { 'opt-gradient-descent': 'MASTERED' },
  });

  assert.notEqual(result.state, 'MASTERED', 'Bypassed locks cannot substitute for valid prediction evidence');
  assert.equal(result.stats.predictionCount, 0);
});

test('TC-P7-14: Needs Revision Detection — Recent diagnostic failure triggers NEEDS_REVISION', () => {
  const result = evaluateConceptMastery({
    conceptId: 'opt-saddle-points',
    predictions: [
      { id: '1', questionId: 'q', algorithmId: 'gradient-descent', category: 'saddle_escape', userGuess: 'a', status: 'incorrect', score: 0, timestamp: 1 },
    ],
    challenges: {},
    practiceAttempts: [
      { id: 'p1', questionId: 'prac-opt-saddle-01', conceptId: 'opt-saddle-points', userAnswer: 'opt_a', isCorrect: false, score: 0, timestamp: 2 },
    ],
    prerequisiteMasteryStates: { 'opt-gradient-descent': 'MASTERED', 'math-hessians': 'MASTERED' },
  });

  assert.equal(result.state, 'NEEDS_REVISION');
  assert.ok(result.reasons.some((r) => r.includes('misconception') || r.includes('incorrect')));
});

// =============================================================================
// SUITE 5: SPACED REVISION PLANNER
// =============================================================================

test('TC-P7-15: Revision Scheduler — Expands intervals on success, resets to 1 day on failure', () => {
  const t0 = 1000000;
  // Attempt 1: Correct -> interval 1 day
  const sched1 = computeNextRevisionSchedule('opt-gradient-descent', true, undefined, t0);
  assert.equal(sched1.intervalDays, 1);
  assert.equal(sched1.repetitionCount, 1);

  // Attempt 2: Correct -> interval 2 days
  const sched2 = computeNextRevisionSchedule('opt-gradient-descent', true, sched1, t0 + 86400000);
  assert.equal(sched2.intervalDays, 2);
  assert.equal(sched2.repetitionCount, 2);

  // Attempt 3: Failed -> resets to 1 day
  const sched3 = computeNextRevisionSchedule('opt-gradient-descent', false, sched2, t0 + 2 * 86400000);
  assert.equal(sched3.intervalDays, 1);
  assert.equal(sched3.repetitionCount, 0);
  assert.ok(sched3.reason.includes('Reset to 1-day interval'));
});

test('TC-P7-16: Active Revision Queue — Prioritizes NEEDS_REVISION concepts first', () => {
  const now = Date.now();
  const schedules = {
    'opt-learning-rate': {
      conceptId: 'opt-learning-rate',
      nextRevisionDate: now + 50000,
      intervalDays: 2,
      repetitionCount: 1,
      lastReviewedAt: now - 1000,
      reason: 'Regular review',
    },
  };
  const masteryRecords = {
    'opt-saddle-points': {
      conceptId: 'opt-saddle-points',
      state: 'NEEDS_REVISION',
      score: 30,
      evaluatedAt: now,
      evidence: { predictionCount: 1, predictionAccuracy: 0, completedChallenges: [], practiceCount: 1, practiceAccuracy: 0, prerequisitesMet: true },
    },
  };

  const queue = getActiveRevisionQueue(schedules, masteryRecords, now);
  assert.ok(queue.length >= 1);
  assert.equal(queue[0].conceptId, 'opt-saddle-points', 'NEEDS_REVISION concept must be prioritized at top of queue');
  assert.equal(queue[0].urgency, 'overdue');
});

// =============================================================================
// SUITE 6: DETERMINISTIC RECOMMENDATIONS & STORAGE
// =============================================================================

test('TC-P7-17: Path Progression & Next Concept Recommendation — Deterministic traversal', () => {
  const profile = getInitialProfile();
  assert.equal(profile.activePathId, 'path-optimization');

  // Initially, first concept recommended is math-functions (prerequisites: none)
  const firstRec = getRecommendedNextConcept('path-optimization', profile);
  assert.equal(firstRec, 'math-functions');

  // Master math-functions
  profile.conceptMastery['math-functions'] = {
    conceptId: 'math-functions',
    state: 'MASTERED',
    score: 90,
    evaluatedAt: Date.now(),
    evidence: { predictionCount: 0, predictionAccuracy: 0, completedChallenges: [], practiceCount: 1, practiceAccuracy: 100, prerequisitesMet: true },
  };

  // Next recommended should be math-derivatives!
  const secondRec = getRecommendedNextConcept('path-optimization', profile);
  assert.equal(secondRec, 'math-derivatives');

  // Progress summary check
  const summary = getPathProgressSummary('path-optimization', profile);
  assert.equal(summary.masteredCount, 1);
  assert.ok(summary.percentComplete > 0);
  assert.equal(summary.nextRecommendedConceptId, 'math-derivatives');
});
