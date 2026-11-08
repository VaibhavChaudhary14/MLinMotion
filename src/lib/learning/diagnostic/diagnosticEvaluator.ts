/**
 * ML in Motion — Diagnostic Assessment Evaluator
 * Pure, deterministic evaluation of diagnostic submissions.
 */

import type {
  DiagnosticQuestion,
  DiagnosticSubmission,
  DiagnosticQuestionEvaluation,
  DiagnosticAssessmentResult,
} from './types.ts';
import { DIAGNOSTIC_QUESTION_BANK } from './diagnosticBank.ts';
import { detectConceptGaps } from './gapDetector.ts';

/**
 * Evaluates a single diagnostic question submission against its criteria.
 */
export function evaluateDiagnosticQuestion(
  question: DiagnosticQuestion,
  userAnswer: string | number
): DiagnosticQuestionEvaluation {
  let isCorrect = false;

  if (question.type === 'numerical') {
    const numAnswer = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer).trim());
    const target = typeof question.correctAnswer === 'number' ? question.correctAnswer : parseFloat(String(question.correctAnswer));
    const tolerance = question.numericalTolerance ?? 0.05;

    if (!isNaN(numAnswer) && !isNaN(target)) {
      isCorrect = Math.abs(numAnswer - target) <= tolerance + 1e-9;
    }
  } else {
    // MCQ, equation, graph, scenario
    const cleanUser = String(userAnswer).trim().toLowerCase();
    const cleanTarget = String(question.correctAnswer).trim().toLowerCase();
    isCorrect = cleanUser === cleanTarget;
  }

  const score = isCorrect ? 100 : 0;

  return {
    questionId: question.id,
    conceptId: question.conceptId,
    subject: question.subject,
    isCorrect,
    score,
    selectedAnswer: userAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    misconceptionTriggered: isCorrect ? undefined : question.misconception,
    remediation: question.remediationReference,
  };
}

/**
 * Evaluates a full diagnostic assessment submission set.
 */
export function evaluateDiagnosticAssessment(
  submissions: DiagnosticSubmission[],
  questionBank: DiagnosticQuestion[] = DIAGNOSTIC_QUESTION_BANK,
  now: number = Date.now()
): DiagnosticAssessmentResult {
  const evaluations: DiagnosticQuestionEvaluation[] = [];
  const subjectScores: Record<string, { total: number; correct: number; percentage: number }> = {};
  const conceptScores: Record<string, { total: number; correct: number; percentage: number }> = {};

  let totalCorrect = 0;

  for (const sub of submissions) {
    const q = questionBank.find((item) => item.id === sub.questionId);
    if (!q) continue;

    const evalRes = evaluateDiagnosticQuestion(q, sub.answer);
    evaluations.push(evalRes);

    if (evalRes.isCorrect) {
      totalCorrect++;
    }

    // Accumulate subject scores
    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = { total: 0, correct: 0, percentage: 0 };
    }
    subjectScores[q.subject].total++;
    if (evalRes.isCorrect) subjectScores[q.subject].correct++;

    // Accumulate concept scores
    if (!conceptScores[q.conceptId]) {
      conceptScores[q.conceptId] = { total: 0, correct: 0, percentage: 0 };
    }
    conceptScores[q.conceptId].total++;
    if (evalRes.isCorrect) conceptScores[q.conceptId].correct++;
  }

  // Calculate percentages
  for (const subKey of Object.keys(subjectScores)) {
    const s = subjectScores[subKey];
    s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }
  for (const cKey of Object.keys(conceptScores)) {
    const c = conceptScores[cKey];
    c.percentage = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
  }

  const totalQuestions = evaluations.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Run Gap Detector on evaluations
  const detectedGaps = detectConceptGaps({
    evaluations,
    conceptScores,
  });

  return {
    id: `diag-result-${now}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now,
    totalQuestions,
    correctCount: totalCorrect,
    scorePercentage,
    subjectScores,
    conceptScores,
    detectedGaps,
    questionEvaluations: evaluations,
  };
}
