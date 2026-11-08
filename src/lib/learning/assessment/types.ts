/**
 * ML in Motion — Practice & Assessment Layer Types
 */

export type QuestionFormat = 'multiple_choice' | 'numerical' | 'code_interpretation';

export interface PracticeQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface PracticeQuestion {
  id: string;
  conceptId: string;
  title: string;
  format: QuestionFormat;
  prompt: string;
  options?: PracticeQuestionOption[];
  numericalTarget?: {
    answer: number;
    tolerance: number;
    unit?: string;
    targetLabel?: string;
  };
  codeSnippet?: {
    language: 'python';
    code: string;
  };
  explanation: {
    summary: string;
    mathDerivation?: string;
    pitfall?: string;
  };
  hints?: string[];
  syllabusTag?: 'GATE DA' | 'Foundational' | 'Advanced Practice';
}

export interface PracticeEvaluationResult {
  isCorrect: boolean;
  score: number; // 0 to 1
  userAnswerSummary: string;
  actualAnswerSummary: string;
  explanation: string;
  mathDerivation?: string;
}
