'use client';

import React, { useState } from 'react';
import type {
  PredictionQuestion,
  PredictionEvaluationResult,
} from '@/lib/learning/types';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Unlock,
  Code2,
  BookOpen,
  Layers,
} from 'lucide-react';

interface PredictionCheckpointPanelProps {
  question: PredictionQuestion<any, any> | null;
  isLocked: boolean;
  onCommitPrediction: (guess: any) => PredictionEvaluationResult;
  onUnlockBypass?: () => void;
  onAdvanceStep: () => void;
  onRetry: () => void;
}

export const PredictionCheckpointPanel: React.FC<PredictionCheckpointPanelProps> = ({
  question,
  isLocked,
  onCommitPrediction,
  onUnlockBypass,
  onAdvanceStep,
  onRetry,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<PredictionEvaluationResult | null>(null);

  if (!question) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let guess: any = null;
    if (question.type === 'numerical') {
      const parsed = parseFloat(numericalInput);
      if (isNaN(parsed)) return;
      guess = parsed;
    } else {
      if (!selectedOption) return;
      guess = selectedOption;
    }
    const result = onCommitPrediction(guess);
    setEvaluation(result);
  };

  const handleResetForRetry = () => {
    setEvaluation(null);
    setSelectedOption(null);
    setNumericalInput('');
    onRetry();
  };

  return (
    <div
      className={`border-[1.5px] border-[#1A1715] p-4 transition-all duration-200 ${
        evaluation
          ? evaluation.status === 'correct'
            ? 'bg-[#33634B]/5 border-[#33634B] shadow-[3px_3px_0px_#33634B]'
            : evaluation.status === 'partially_correct'
            ? 'bg-[#E28C05]/5 border-[#E28C05] shadow-[3px_3px_0px_#E28C05]'
            : 'bg-[#C83226]/5 border-[#C83226] shadow-[3px_3px_0px_#C83226]'
          : 'bg-[#FAF7F0] shadow-[3px_3px_0px_#1848B8]'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1A1715]/20">
        <div className="flex items-center gap-2">
          {evaluation ? (
            evaluation.status === 'correct' ? (
              <CheckCircle2 className="w-4 h-4 text-[#33634B]" />
            ) : evaluation.status === 'partially_correct' ? (
              <AlertTriangle className="w-4 h-4 text-[#E28C05]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#C83226]" />
            )
          ) : (
            <Lock className="w-4 h-4 text-[#1848B8]" />
          )}
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1715]">
            {evaluation ? 'EVALUATION REVEAL' : 'PREDICTION CHECKPOINT // COMMIT TO ADVANCE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLocked && !evaluation && (
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#C83226] text-[#FAF7F0] font-bold">
              LOCKED
            </span>
          )}
          {onUnlockBypass && !evaluation && (
            <button
              onClick={onUnlockBypass}
              className="text-[10px] font-mono text-[#1A1715]/60 hover:text-[#1A1715] underline flex items-center gap-1"
              title="Skip this prediction and step freely"
            >
              <Unlock className="w-3 h-3" /> Skip Lock
            </button>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-[#1848B8]">
          {question.title}
        </h4>
        <p className="text-xs text-[#1A1715] leading-relaxed font-medium">
          {question.prompt}
        </p>
      </div>

      {/* Uncommitted State: Interactive Input Controls */}
      {!evaluation && (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Numerical Input Question */}
          {question.type === 'numerical' && (
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[#1A1715]/80 block font-semibold">
                {question.numericalTolerance?.targetLabel || 'Enter Expected Value'}:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  required
                  value={numericalInput}
                  onChange={(e) => setNumericalInput(e.target.value)}
                  placeholder="e.g. 1.70"
                  className="flex-1 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] px-3 py-1.5 text-xs font-mono text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1848B8]"
                  autoFocus
                />
                <AnalogButton
                  type="submit"
                  variant="ultramarine"
                  size="sm"
                  disabled={!numericalInput.trim()}
                >
                  Commit Prediction
                </AnalogButton>
              </div>
              {question.numericalTolerance && (
                <span className="text-[10px] font-mono text-[#1A1715]/60 block">
                  Tolerance: ±{question.numericalTolerance.absolute} (Continuous evaluation)
                </span>
              )}
            </div>
          )}

          {/* Multiple Choice Question */}
          {(question.type === 'multiple_choice' || question.type === 'directional') && (
            <div className="space-y-1.5">
              {question.options?.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full text-left p-2.5 border-[1.5px] text-xs font-mono leading-snug flex items-start gap-2.5 transition-colors ${
                    selectedOption === opt.id
                      ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]'
                      : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715]/30 hover:border-[#1A1715] hover:bg-[#E8E1D3]'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-none flex items-center justify-center text-[10px] font-bold border border-current shrink-0 ${
                      selectedOption === opt.id ? 'bg-[#FAF7F0] text-[#1848B8]' : 'bg-transparent'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="flex-1 text-[11px]">{opt.text}</span>
                </button>
              ))}

              <div className="pt-2 flex justify-end">
                <AnalogButton
                  type="submit"
                  variant="ultramarine"
                  size="sm"
                  disabled={!selectedOption}
                >
                  Commit Prediction & Lock
                </AnalogButton>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Committed & Evaluated State: Multi-Representation Explanation */}
      {evaluation && (
        <div className="space-y-3.5 pt-1">
          {/* Verdict Banner */}
          <div
            className={`p-3 border-[1.5px] border-[#1A1715] text-xs font-mono space-y-1 ${
              evaluation.status === 'correct'
                ? 'bg-[#33634B]/15 text-[#33634B]'
                : evaluation.status === 'partially_correct'
                ? 'bg-[#E28C05]/15 text-[#E28C05]'
                : 'bg-[#C83226]/15 text-[#C83226]'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {evaluation.status === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {evaluation.explanation.headline}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#FAF7F0] text-[#1A1715] border border-[#1A1715]">
                SCORE: {Math.round(evaluation.score * 100)}%
              </span>
            </div>
            <div className="text-[11px] text-[#1A1715] font-normal pt-1 flex flex-col gap-0.5">
              <span>Your Prediction: <strong>{evaluation.userAnswerSummary}</strong></span>
              <span>Engine Ground Truth: <strong>{evaluation.actualAnswerSummary}</strong></span>
            </div>
          </div>

          {/* 5 Synchronized Representations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {/* Math Formula Representation */}
            <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715]/40 space-y-1">
              <div className="text-[10px] font-bold text-[#1848B8] flex items-center gap-1 uppercase">
                <BookOpen className="w-3 h-3" /> Equation
              </div>
              <p className="text-[11px] font-sans text-[#1A1715] italic">
                {evaluation.explanation.mathEquation}
              </p>
            </div>

            {/* Numerical Evidence */}
            <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715]/40 space-y-1">
              <div className="text-[10px] font-bold text-[#E28C05] flex items-center gap-1 uppercase">
                <Layers className="w-3 h-3" /> Numerical Output
              </div>
              <p className="text-[11px] text-[#1A1715]">
                {evaluation.explanation.numericalEvidence}
              </p>
            </div>

            {/* Pseudocode Line */}
            <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715]/40 space-y-1">
              <div className="text-[10px] font-bold text-[#33634B] flex items-center gap-1 uppercase">
                <Code2 className="w-3 h-3" /> Pseudocode (Line {evaluation.explanation.pseudocodeLine})
              </div>
              <code className="text-[10px] text-[#1A1715] block bg-[#F4EFE4] p-1 border border-[#1A1715]/20">
                {evaluation.explanation.pseudocodeSnippet}
              </code>
            </div>

            {/* Python Snippet */}
            <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715]/40 space-y-1">
              <div className="text-[10px] font-bold text-[#6E3867] flex items-center gap-1 uppercase">
                <Code2 className="w-3 h-3" /> Python Engine Code
              </div>
              <code className="text-[10px] text-[#1A1715] block bg-[#F4EFE4] p-1 border border-[#1A1715]/20">
                {evaluation.explanation.pythonSnippet}
              </code>
            </div>
          </div>

          {/* Graphical Clue */}
          <div className="p-2 bg-[#F4EFE4] border-l-2 border-[#1848B8] text-[11px] text-[#1A1715]/80">
            <strong>Visual representation clue:</strong> {evaluation.explanation.graphicalClue}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <AnalogButton
              onClick={handleResetForRetry}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Try Another Guess
            </AnalogButton>

            <AnalogButton
              onClick={onAdvanceStep}
              variant="ultramarine"
              size="sm"
              className="flex items-center gap-1"
            >
              Advance Simulation <ArrowRight className="w-3.5 h-3.5" />
            </AnalogButton>
          </div>
        </div>
      )}
    </div>
  );
};
