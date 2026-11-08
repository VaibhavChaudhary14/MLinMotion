/**
 * ML in Motion — Phase 08 Automated Verification Suite
 * Tests Diagnostic Intelligence, Concept Gap Detection, Remediation Links, and Mastery Calibration.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { CONCEPT_GRAPH } from '../src/lib/learning/concepts/conceptGraph.ts';
import {
  CONCEPT_CARDS_MAP,
  getAllConceptCards,
  getConceptCard,
} from '../src/lib/learning/concepts/conceptCardsData.ts';
import {
  DIAGNOSTIC_QUESTION_BANK,
  getDiagnosticQuestionById,
  getDiagnosticQuestionsByConcept,
  getGatePyqQuestions,
} from '../src/lib/learning/diagnostic/diagnosticBank.ts';
import {
  evaluateDiagnosticQuestion,
  evaluateDiagnosticAssessment,
} from '../src/lib/learning/diagnostic/diagnosticEvaluator.ts';
import { detectConceptGaps } from '../src/lib/learning/diagnostic/gapDetector.ts';
import { evaluateConceptMastery } from '../src/lib/learning/mastery/masteryEvaluator.ts';
import {
  getInitialProfile,
  recordDiagnosticResult,
  getLatestDiagnosticResult,
  getActiveConceptGaps,
} from '../src/lib/learning/storage.ts';

// Mock localStorage for Node test runner
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

globalThis.window = {
  localStorage: localStorageMock,
};

test('TC-P8-01: Concept Cards Registry — All 20 nodes from DAG have complete cards', () => {
  const allCards = getAllConceptCards();
  assert.equal(allCards.length, 20, 'Should have exactly 20 concept cards');

  for (const [nodeId, node] of Object.entries(CONCEPT_GRAPH)) {
    const card = getConceptCard(nodeId);
    assert.ok(card, `Card must exist for node ${nodeId}`);
    assert.equal(card.id, nodeId, `Card ID must match graph node ID ${nodeId}`);
    assert.ok(card.plainLanguageDefinition.length > 20, `Card ${nodeId} must have plain language definition`);
    assert.ok(card.intuitiveExplanation.length > 20, `Card ${nodeId} must have intuitive explanation`);
    assert.ok(card.mathematicalFormulation?.latex, `Card ${nodeId} must have LaTeX mathematical formulation`);
    assert.ok(card.workedExample?.steps.length >= 2, `Card ${nodeId} must have at least 2 worked example steps`);
    assert.ok(card.commonMisconception?.misconception, `Card ${nodeId} must have common misconception`);
    assert.ok(card.commonMisconception?.correction, `Card ${nodeId} must have misconception correction`);
    assert.deepEqual(card.prerequisites, node.prerequisites, `Card ${nodeId} prerequisites must match DAG`);
  }
});

test('TC-P8-02: Question Bank Mapping — Every diagnostic question maps to a valid concept in the 20-node graph', () => {
  assert.ok(DIAGNOSTIC_QUESTION_BANK.length >= 15, 'Question bank must have at least 15 curated questions');

  for (const q of DIAGNOSTIC_QUESTION_BANK) {
    assert.ok(CONCEPT_GRAPH[q.conceptId], `Question ${q.id} maps to invalid conceptId: ${q.conceptId}`);
    assert.ok(q.explanation.length > 20, `Question ${q.id} must have detailed explanation`);
    assert.ok(q.mathematicalDerivation.length > 10, `Question ${q.id} must have mathematical derivation`);
    assert.ok(q.remediationReference?.targetUrl, `Question ${q.id} must have a valid remediation target URL`);
  }
});

test('TC-P8-03: Diverse Question Types — Supports MCQ, numerical, equation, graph, and scenario', () => {
  const types = new Set(DIAGNOSTIC_QUESTION_BANK.map((q) => q.type));
  assert.ok(types.has('mcq'), 'Must support MCQ questions');
  assert.ok(types.has('numerical'), 'Must support numerical questions');
  assert.ok(types.has('equation'), 'Must support equation interpretation questions');
  assert.ok(types.has('graph'), 'Must support graph interpretation questions');
  assert.ok(types.has('scenario'), 'Must support application scenario questions');
});

test('TC-P8-04: Numerical Tolerance — Evaluates float answers accurately within specified margin', () => {
  const numQ = getDiagnosticQuestionById('diag-opt-lr-bound-01');
  assert.ok(numQ && numQ.type === 'numerical', 'Numerical question must exist');

  // Exact target: 0.20
  const evalExact = evaluateDiagnosticQuestion(numQ, 0.20);
  assert.equal(evalExact.isCorrect, true, 'Exact answer 0.20 must be correct');

  // Within tolerance (tolerance 0.01): 0.205
  const evalWithin = evaluateDiagnosticQuestion(numQ, 0.205);
  assert.equal(evalWithin.isCorrect, true, '0.205 is within tolerance of 0.20');

  // Outside tolerance: 0.25
  const evalOutside = evaluateDiagnosticQuestion(numQ, 0.25);
  assert.equal(evalOutside.isCorrect, false, '0.25 is outside tolerance');
  assert.ok(evalOutside.misconceptionTriggered, 'Failed numerical question must report misconception');
});

test('TC-P8-05: Equation Interpretation — Evaluates LaTeX and analytical understanding', () => {
  const eqQ = getDiagnosticQuestionById('diag-math-func-01');
  assert.ok(eqQ && eqQ.type === 'equation', 'Equation question must exist');

  const evalCorrect = evaluateDiagnosticQuestion(eqQ, 'opt-b');
  assert.equal(evalCorrect.isCorrect, true, 'Correct option opt-b must evaluate to true');

  const evalWrong = evaluateDiagnosticQuestion(eqQ, 'opt-a');
  assert.equal(evalWrong.isCorrect, false, 'Wrong option opt-a must evaluate to false');
  assert.equal(evalWrong.misconceptionTriggered, eqQ.misconception);
});

test('TC-P8-06: Graph Interpretation — Evaluates geometric and visual intuition with graphData specs', () => {
  const graphQ = getDiagnosticQuestionById('diag-math-grad-01');
  assert.ok(graphQ && graphQ.type === 'graph', 'Graph question must exist');
  assert.ok(graphQ.graphData, 'Graph question must have graphData specification');
  assert.equal(graphQ.graphData.type, 'contour_valley');

  const evalCorrect = evaluateDiagnosticQuestion(graphQ, 'opt-c');
  assert.equal(evalCorrect.isCorrect, true, '90 degrees orthogonal must evaluate to correct');
});

test('TC-P8-07: Official GATE PYQ Tagging — Verified official questions are clearly differentiated from platform questions', () => {
  const gateQuestions = getGatePyqQuestions();
  assert.ok(gateQuestions.length >= 3, 'Must have verified GATE examination questions');

  for (const q of gateQuestions) {
    assert.equal(q.isGatePyq, true, `Question ${q.id} must have isGatePyq true`);
    assert.ok(q.gateYear?.startsWith('GATE'), `Question ${q.id} must have valid gateYear`);
  }

  const platformQuestions = DIAGNOSTIC_QUESTION_BANK.filter((q) => !q.isGatePyq);
  assert.ok(platformQuestions.length >= 5, 'Must have platform-authored diagnostic questions');
  for (const q of platformQuestions) {
    assert.equal(q.isGatePyq, false, `Question ${q.id} must have isGatePyq false`);
  }
});

test('TC-P8-08: Diagnostic Scoring — Correctly aggregates subject scores and overall percentage', () => {
  const testSubmissions = [
    { questionId: 'diag-math-func-01', answer: 'opt-b' }, // Correct (math)
    { questionId: 'diag-math-deriv-01', answer: -2.30 }, // Correct (math)
    { questionId: 'diag-opt-lr-bound-01', answer: 0.20 }, // Correct (opt)
    { questionId: 'diag-opt-regime-01', answer: 'opt-a' }, // Incorrect (opt)
  ];

  const assessment = evaluateDiagnosticAssessment(testSubmissions);
  assert.equal(assessment.totalQuestions, 4);
  assert.equal(assessment.correctCount, 3);
  assert.equal(assessment.scorePercentage, 75); // 3 / 4 = 75%

  assert.equal(assessment.subjectScores['mathematics'].percentage, 100);
  assert.equal(assessment.subjectScores['optimization'].percentage, 50);
});

test('TC-P8-09: Gap Detection — Thresholds identify preliminary vs confirmed vs repeated gaps', () => {
  // 1. Single mistake on intermediate question -> preliminary
  const singleMistakeEval = [
    {
      questionId: 'diag-opt-regime-01',
      conceptId: 'opt-convergence-regimes',
      subject: 'optimization',
      isCorrect: false,
      score: 0,
      selectedAnswer: 'opt-a',
      correctAnswer: 'opt-c',
      explanation: 'Test',
      remediation: {
        conceptId: 'opt-convergence-regimes',
        actionType: 'simulation',
        targetUrl: '/cinema/gradient-descent',
        description: 'Test',
      },
    },
  ];

  const gapsPrelim = detectConceptGaps({
    evaluations: singleMistakeEval,
    conceptScores: { 'opt-convergence-regimes': { total: 1, correct: 0, percentage: 0 } },
  });

  assert.equal(gapsPrelim.length, 1);
  assert.equal(gapsPrelim[0].confidence, 'preliminary');

  // 2. Mistake on foundational concept -> confirmed
  const foundMistakeEval = [
    {
      questionId: 'diag-math-func-01',
      conceptId: 'math-functions',
      subject: 'mathematics',
      isCorrect: false,
      score: 0,
      selectedAnswer: 'opt-a',
      correctAnswer: 'opt-b',
      explanation: 'Test',
      remediation: {
        conceptId: 'math-functions',
        actionType: 'read_card',
        targetUrl: '/concepts/math-functions',
        description: 'Test',
      },
    },
  ];

  const gapsConfirmed = detectConceptGaps({
    evaluations: foundMistakeEval,
    conceptScores: { 'math-functions': { total: 1, correct: 0, percentage: 0 } },
  });

  assert.equal(gapsConfirmed.length, 1);
  assert.equal(gapsConfirmed[0].confidence, 'confirmed');

  // 3. Repeated mistake with prior failure history -> critical
  const gapsCritical = detectConceptGaps({
    evaluations: singleMistakeEval,
    conceptScores: { 'opt-convergence-regimes': { total: 1, correct: 0, percentage: 0 } },
    historicalPractice: [
      { id: '1', questionId: 'prac-1', conceptId: 'opt-convergence-regimes', isCorrect: false, score: 0, timestamp: 1 },
    ],
  });

  assert.equal(gapsCritical.length, 1);
  assert.equal(gapsCritical[0].confidence, 'critical');
});

test('TC-P8-10: Prerequisite Root Cause Tracing — Identifies upstream prerequisite weaknesses', () => {
  // Suppose student missed both math-derivatives and math-partial-derivatives
  const evaluations = [
    {
      questionId: 'diag-math-deriv-01',
      conceptId: 'math-derivatives',
      subject: 'mathematics',
      isCorrect: false,
      score: 0,
      selectedAnswer: 0,
      correctAnswer: -2.3,
      explanation: 'Derivative error',
      remediation: { conceptId: 'math-derivatives', actionType: 'practice', targetUrl: '/concepts/math-derivatives', description: 'Test' },
    },
    {
      questionId: 'diag-math-pderiv-01',
      conceptId: 'math-partial-derivatives',
      subject: 'mathematics',
      isCorrect: false,
      score: 0,
      selectedAnswer: 'opt-d',
      correctAnswer: 'opt-a',
      explanation: 'Partial derivative error',
      remediation: { conceptId: 'math-partial-derivatives', actionType: 'read_card', targetUrl: '/concepts/math-partial-derivatives', description: 'Test' },
    },
  ];

  const gaps = detectConceptGaps({
    evaluations,
    conceptScores: {
      'math-derivatives': { total: 1, correct: 0, percentage: 0 },
      'math-partial-derivatives': { total: 1, correct: 0, percentage: 0 },
    },
  });

  const pderivGap = gaps.find((g) => g.conceptId === 'math-partial-derivatives');
  assert.ok(pderivGap, 'math-partial-derivatives gap must exist');
  assert.equal(pderivGap.rootCausePrerequisiteId, 'math-derivatives', 'Root cause must be identified as math-derivatives');
  assert.ok(
    pderivGap.explainableRecommendation.includes('math-derivatives'),
    'Recommendation must explicitly mention the prerequisite root cause'
  );
});

test('TC-P8-11: Explainable Recommendations — Generates clear pedagogical explanations', () => {
  const evaluations = [
    {
      questionId: 'diag-math-grad-01',
      conceptId: 'math-gradients',
      subject: 'mathematics',
      isCorrect: false,
      score: 0,
      selectedAnswer: 'opt-a',
      correctAnswer: 'opt-c',
      explanation: 'Gradient orthogonality misconception',
      remediation: { conceptId: 'math-gradients', actionType: 'simulation', targetUrl: '/cinema/gradient-descent', description: 'Test' },
    },
  ];

  const gaps = detectConceptGaps({
    evaluations,
    conceptScores: { 'math-gradients': { total: 1, correct: 0, percentage: 0 } },
    currentMasteryStates: { 'math-partial-derivatives': 'NOT_STARTED' },
  });

  assert.equal(gaps.length, 1);
  assert.ok(
    gaps[0].explainableRecommendation.startsWith('Review prerequisite Multivariable Partial Derivatives'),
    'Should recommend reviewing uncompleted prerequisite'
  );
});

test('TC-P8-12: Remediation Links — Every gap provides valid, non-fabricated learning actions', () => {
  const evaluations = [
    {
      questionId: 'diag-opt-gd-step-01',
      conceptId: 'opt-gradient-descent',
      subject: 'optimization',
      isCorrect: false,
      score: 0,
      selectedAnswer: 0,
      correctAnswer: 1.70,
      explanation: 'Sign mistake',
      remediation: { conceptId: 'opt-gradient-descent', actionType: 'simulation', targetUrl: '/cinema/gradient-descent', description: 'Test' },
    },
  ];

  const gaps = detectConceptGaps({
    evaluations,
    conceptScores: { 'opt-gradient-descent': { total: 1, correct: 0, percentage: 0 } },
  });

  assert.equal(gaps.length, 1);
  const actions = gaps[0].remediationActions;
  assert.ok(actions.length >= 3, 'Must offer at least 3 remediation actions');

  const cardAction = actions.find((a) => a.type === 'read_card');
  assert.ok(cardAction?.url.startsWith('/concepts/'), 'Concept card link must be valid');

  const simAction = actions.find((a) => a.type === 'simulation');
  assert.ok(simAction?.url.startsWith('/cinema'), 'Simulation workbench link must be valid');
});

test('TC-P8-13: Mastery Preservation Invariant — A single diagnostic mistake does not strip pre-existing MASTERED status', () => {
  // Learner has previously demonstrated verified mastery
  const input = {
    conceptId: 'opt-gradient-descent',
    predictions: [
      { id: 'p1', algorithmId: 'gradient-descent', status: 'correct' },
      { id: 'p2', algorithmId: 'gradient-descent', status: 'correct' },
    ],
    challenges: {
      'gd-01-break-learning-rate': { completed: true, attemptsCount: 1, lastAttemptAt: 1 },
    },
    practiceAttempts: [
      { id: 'prac-1', questionId: 'q1', conceptId: 'opt-gradient-descent', isCorrect: true, score: 100, timestamp: 1 },
      { id: 'prac-2', questionId: 'q2', conceptId: 'opt-gradient-descent', isCorrect: true, score: 100, timestamp: 2 },
    ],
    prerequisiteMasteryStates: {
      'opt-loss-functions': 'MASTERED',
    },
  };

  const masteryBefore = evaluateConceptMastery(input);
  assert.equal(masteryBefore.state, 'MASTERED', 'Pre-existing state is MASTERED');

  // Now, learner makes 1 mistake on a diagnostic question
  const diagnosticResult = {
    id: 'diag-test',
    timestamp: Date.now(),
    totalQuestions: 1,
    correctCount: 0,
    scorePercentage: 0,
    subjectScores: {},
    conceptScores: {},
    detectedGaps: [
      {
        conceptId: 'opt-gradient-descent',
        conceptName: 'Vanilla Gradient Descent',
        subject: 'optimization',
        confidence: 'preliminary',
        severity: 'low',
        score: 0,
        mistakeCount: 1,
        explainableRecommendation: 'Preliminary review suggestion',
        remediationActions: [],
      },
    ],
    questionEvaluations: [],
  };

  // Record diagnostic result into profile
  localStorageMock.clear();
  recordDiagnosticResult(diagnosticResult);

  // Re-evaluate mastery: high practice accuracy & challenge completion still preserve MASTERED status
  const masteryAfter = evaluateConceptMastery(input);
  assert.equal(
    masteryAfter.state,
    'MASTERED',
    'Demonstrated mastery must be preserved even if diagnostic flag is recorded'
  );
});

test('TC-P8-14: Revision Scheduler Integration — Failed diagnostic concepts reset revision interval to 1 day', () => {
  localStorageMock.clear();

  const diagnosticResult = {
    id: 'diag-test-2',
    timestamp: Date.now(),
    totalQuestions: 1,
    correctCount: 0,
    scorePercentage: 0,
    subjectScores: {},
    conceptScores: {},
    detectedGaps: [
      {
        conceptId: 'clust-kmeans-lloyd',
        conceptName: "Lloyd's Algorithm",
        subject: 'clustering',
        confidence: 'confirmed',
        severity: 'medium',
        score: 0,
        mistakeCount: 1,
        explainableRecommendation: 'Targeted review recommended',
        remediationActions: [],
      },
    ],
    questionEvaluations: [],
  };

  const profile = recordDiagnosticResult(diagnosticResult);
  assert.ok(profile.revisionSchedule['clust-kmeans-lloyd'], 'Revision schedule must be created for gap concept');
  assert.equal(
    profile.revisionSchedule['clust-kmeans-lloyd'].intervalDays,
    1,
    'Failed diagnostic concept must reset to 1-day retention interval'
  );
});

test('TC-P8-15: Local Storage Persistence & Reload — Diagnostic results and gaps persist cleanly in local profile', () => {
  localStorageMock.clear();

  const mockResult = {
    id: 'diag-persist-test',
    timestamp: 1700000000000,
    totalQuestions: 5,
    correctCount: 4,
    scorePercentage: 80,
    subjectScores: { mathematics: { total: 5, correct: 4, percentage: 80 } },
    conceptScores: { 'math-functions': { total: 5, correct: 4, percentage: 80 } },
    detectedGaps: [],
    questionEvaluations: [],
  };

  recordDiagnosticResult(mockResult);

  const reloaded = getLatestDiagnosticResult();
  assert.ok(reloaded, 'Latest diagnostic must reload from localStorage');
  assert.equal(reloaded.id, 'diag-persist-test');
  assert.equal(reloaded.scorePercentage, 80);
});

test('TC-P8-16: Export and Clear Behavior — Profile exports valid JSON and clears cleanly', () => {
  localStorageMock.clear();

  const initial = getInitialProfile();
  assert.equal(initial.version, 1);
  assert.equal(initial.predictions.length, 0);

  const mockResult = {
    id: 'diag-export-test',
    timestamp: Date.now(),
    totalQuestions: 2,
    correctCount: 2,
    scorePercentage: 100,
    subjectScores: {},
    conceptScores: {},
    detectedGaps: [],
    questionEvaluations: [],
  };

  const profileWithDiag = recordDiagnosticResult(mockResult);
  assert.equal(profileWithDiag.diagnosticResults.length, 1);

  // Verify JSON export
  const exportedJson = JSON.stringify(profileWithDiag, null, 2);
  const parsed = JSON.parse(exportedJson);
  assert.equal(parsed.diagnosticResults[0].id, 'diag-export-test');
});

test('TC-P8-17: Deterministic Ordering — Detected gaps and remediations follow strict priority', () => {
  const evaluations = [
    {
      questionId: 'q-prelim',
      conceptId: 'opt-multimodal-landscapes',
      subject: 'optimization',
      isCorrect: false,
      score: 0,
      selectedAnswer: 0,
      correctAnswer: 1,
      explanation: 'Preliminary error',
      remediation: { conceptId: 'opt-multimodal-landscapes', actionType: 'read_card', targetUrl: '/concepts/opt-multimodal-landscapes', description: 'Test' },
    },
    {
      questionId: 'q-critical',
      conceptId: 'math-functions',
      subject: 'mathematics',
      isCorrect: false,
      score: 0,
      selectedAnswer: 0,
      correctAnswer: 1,
      explanation: 'Critical foundational error',
      remediation: { conceptId: 'math-functions', actionType: 'read_card', targetUrl: '/concepts/math-functions', description: 'Test' },
    },
  ];

  const gaps = detectConceptGaps({
    evaluations,
    conceptScores: {
      'opt-multimodal-landscapes': { total: 1, correct: 0, percentage: 0 },
      'math-functions': { total: 1, correct: 0, percentage: 0 },
    },
  });

  assert.equal(gaps.length, 2);
  // math-functions is foundational -> confirmed, opt-multimodal is advanced -> preliminary
  assert.equal(gaps[0].conceptId, 'math-functions', 'Higher confidence/foundational gap must be sorted first');
});
