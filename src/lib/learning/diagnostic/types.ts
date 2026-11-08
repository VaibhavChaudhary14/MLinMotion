/**
 * ML in Motion — Diagnostic Assessment & Intelligence Types
 * Defines the schema for diagnostic questions, gap detection, and explainable remediations.
 */

import type { ConceptDifficulty, ConceptSubject } from '../concepts/types.ts';

export type DiagnosticQuestionType =
  | 'mcq'
  | 'numerical'
  | 'equation'
  | 'graph'
  | 'scenario';

export interface DiagnosticOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface RemediationReference {
  conceptId: string;
  actionType: 'read_card' | 'simulation' | 'practice' | 'review_prereq';
  targetUrl: string;
  description: string;
}

export interface GraphDataSpec {
  type: 'contour_valley' | 'step_trajectory' | 'voronoi_split' | 'eigen_ellipsoid' | 'saddle_surface';
  description: string;
  axisLabels?: { x: string; y: string };
  points?: Array<{ x: number; y: number; label?: string; color?: string }>;
  contourLines?: Array<{ level: number; label: string }>;
}

export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  secondaryConceptIds?: string[];
  subject: ConceptSubject;
  difficulty: ConceptDifficulty;
  type: DiagnosticQuestionType;
  /** True strictly if this is a verified official GATE examination question */
  isGatePyq: boolean;
  /** Examination identity e.g. "GATE DA 2024" or "GATE CS 2023" */
  gateYear?: string;
  title: string;
  question: string;
  contextScenario?: string;
  latexFormula?: string;
  graphData?: GraphDataSpec;
  options?: DiagnosticOption[];
  correctAnswer: string | number;
  numericalTolerance?: number;
  explanation: string;
  misconception: string;
  mathematicalDerivation: string;
  remediationReference: RemediationReference;
}

export interface DiagnosticSubmission {
  questionId: string;
  answer: string | number;
  timestamp?: number;
}

export interface DiagnosticQuestionEvaluation {
  questionId: string;
  conceptId: string;
  subject: ConceptSubject;
  isCorrect: boolean;
  score: number;
  selectedAnswer: string | number;
  correctAnswer: string | number;
  explanation: string;
  misconceptionTriggered?: string;
  remediation: RemediationReference;
}

export interface RemediationAction {
  id: string;
  type: 'read_card' | 'simulation' | 'practice' | 'review_prereq';
  title: string;
  description: string;
  url: string;
  conceptId: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ConceptGap {
  conceptId: string;
  conceptName: string;
  subject: ConceptSubject;
  confidence: 'preliminary' | 'confirmed' | 'critical';
  severity: 'low' | 'medium' | 'high';
  score: number;
  mistakeCount: number;
  rootCausePrerequisiteId?: string;
  explainableRecommendation: string;
  remediationActions: RemediationAction[];
}

export interface DiagnosticAssessmentResult {
  id: string;
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  subjectScores: Record<string, { total: number; correct: number; percentage: number }>;
  conceptScores: Record<string, { total: number; correct: number; percentage: number }>;
  detectedGaps: ConceptGap[];
  questionEvaluations: DiagnosticQuestionEvaluation[];
}
