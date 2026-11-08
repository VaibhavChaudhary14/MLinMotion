'use client';

import React, { useState } from 'react';
import type { PracticeQuestion, PracticeEvaluationResult } from '@/lib/learning/assessment/types';
import { PRACTICE_QUESTIONS, evaluatePracticeQuestion } from '@/lib/learning/assessment/practiceBank';
import {
  recordPracticeAttempt,
  recordRevisionSchedule,
  loadLearningProfile,
} from '@/lib/learning/storage';
import { computeNextRevisionSchedule } from '@/lib/learning/revision/revisionPlanner';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface PracticeModalProps {
  conceptId: string | null;
  conceptName: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  conceptId,
  conceptName,
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<PracticeEvaluationResult | null>(null);

  if (!isOpen || !conceptId) return null;

  // Find matching question
  const matchingQuestions = PRACTICE_QUESTIONS.filter((q) => q.conceptId === conceptId);
  const question = matchingQuestions[0] || PRACTICE_QUESTIONS[0];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question) return;

    let answer: unknown = selectedOption;
    if (question.format === 'numerical') {
      const parsed = parseFloat(numericalInput);
      if (isNaN(parsed)) return;
      answer = parsed;
    } else {
      if (!selectedOption) return;
    }

    const result = evaluatePracticeQuestion(question, answer);
    setEvaluation(result);

    // Persist attempt in local profile
    recordPracticeAttempt(question.id, conceptId, answer, result.isCorrect, result.score);

    // Update spaced revision schedule
    const profile = loadLearningProfile();
    const currentSched = profile.revisionSchedule?.[conceptId];
    const newSched = computeNextRevisionSchedule(conceptId, result.isCorrect, currentSched);
    recordRevisionSchedule(newSched);

    onCompleted();
  };

  const handleReset = () => {
    setEvaluation(null);
    setSelectedOption(null);
    setNumericalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1715]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FAF7F0] border-[2px] border-[#1A1715] shadow-[6px_6px_0px_#1A1715] max-w-xl w-full p-6 space-y-4 font-mono text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1715]/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#1848B8]">
                CONCEPT MASTERY CHECKPOINT
              </span>
              {question.syllabusTag && (
                <Badge variant={question.syllabusTag === 'GATE DA' ? 'vermilion' : 'ultramarine'}>
                  {question.syllabusTag}
                </Badge>
              )}
            </div>
            <h3 className="text-base font-bold text-[#1A1715]">{conceptName}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E8E1D3] border border-transparent hover:border-[#1A1715] transition-all"
          >
            <X className="w-4 h-4 text-[#1A1715]" />
          </button>
        </div>

        {/* Question Title & Prompt */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#1A1715] uppercase tracking-wide">
            {question.title}
          </h4>
          <p className="text-xs text-[#1A1715] leading-relaxed font-medium bg-[#F4EFE4] p-3 border border-[#1A1715]/20">
            {question.prompt}
          </p>
        </div>

        {/* Input Controls (When Unsubmitted) */}
        {!evaluation && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {question.format === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-3 border-[1.5px] transition-all flex items-start gap-2.5 ${
                      selectedOption === opt.id
                        ? 'bg-[#1848B8]/10 border-[#1848B8] shadow-[2px_2px_0px_#1848B8]'
                        : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F4EFE4]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-none border border-[#1A1715] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                        selectedOption === opt.id ? 'bg-[#1848B8] text-white' : 'bg-white'
                      }`}
                    >
                      {selectedOption === opt.id ? '✓' : ''}
                    </span>
                    <span className="text-xs text-[#1A1715] leading-snug">{opt.text}</span>
                  </button>
                ))}
              </div>
            )}

            {question.format === 'numerical' && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#1A1715] block">
                  {question.numericalTarget?.targetLabel || 'Enter Calculated Value'}:
                </label>
                <input
                  type="number"
                  step="any"
                  value={numericalInput}
                  onChange={(e) => setNumericalInput(e.target.value)}
                  placeholder="e.g. 1.70"
                  className="w-full p-2.5 bg-white border-[1.5px] border-[#1A1715] font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1848B8]"
                  autoFocus
                />
                <span className="text-[10px] text-[#1A1715]/60 block">
                  Tolerance accepted: ±{question.numericalTarget?.tolerance}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1A1715]/10">
              <AnalogButton variant="ghost" size="sm" onClick={onClose} type="button">
                Cancel
              </AnalogButton>
              <AnalogButton
                variant="primary"
                size="sm"
                type="submit"
                disabled={
                  question.format === 'multiple_choice' ? !selectedOption : numericalInput.trim() === ''
                }
              >
                SUBMIT ANSWER
              </AnalogButton>
            </div>
          </form>
        )}

        {/* Evaluation Reveal (When Submitted) */}
        {evaluation && (
          <div
            className={`p-4 border-[1.5px] space-y-3 ${
              evaluation.isCorrect
                ? 'bg-[#33634B]/5 border-[#33634B] shadow-[3px_3px_0px_#33634B]'
                : 'bg-[#C83226]/5 border-[#C83226] shadow-[3px_3px_0px_#C83226]'
            }`}
          >
            <div className="flex items-center gap-2">
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#33634B]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#C83226]" />
              )}
              <span
                className={`font-black text-xs uppercase tracking-wide ${
                  evaluation.isCorrect ? 'text-[#33634B]' : 'text-[#C83226]'
                }`}
              >
                {evaluation.isCorrect ? 'VERIFIED CORRECT! MASTERY PROGRESS REGISTERED' : 'MATHEMATICAL MISCONCEPTION DETECTED'}
              </span>
            </div>

            <p className="text-xs text-[#1A1715] leading-relaxed">{evaluation.explanation}</p>

            {evaluation.mathDerivation && (
              <div className="p-2.5 bg-white border border-[#1A1715]/30">
                <span className="text-[10px] font-bold text-[#1848B8] uppercase block mb-1">
                  MATHEMATICAL DERIVATION:
                </span>
                <code className="text-xs text-[#1A1715]">{evaluation.mathDerivation}</code>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <AnalogButton variant="secondary" size="sm" onClick={handleReset}>
                Try Another Problem
              </AnalogButton>
              <AnalogButton variant="primary" size="sm" onClick={onClose}>
                DONE & RETURN TO DASHBOARD
              </AnalogButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
