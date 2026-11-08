'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DIAGNOSTIC_QUESTIONS,
  DiagnosticQuestion,
} from '@/data/diagnosticQuizData';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { recordConceptAttempt } from '@/lib/adaptive/recommender';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  FlaskConical,
  Award,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const DiagnosticQuizEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selected: number; isCorrect: boolean }>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Filtered question set
  const filteredQuestions =
    selectedCategory === 'ALL'
      ? DIAGNOSTIC_QUESTIONS
      : DIAGNOSTIC_QUESTIONS.filter((q) => q.category.toUpperCase() === selectedCategory.toUpperCase());

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleVerify = () => {
    if (selectedOption === null || isSubmitted || !currentQ) return;
    const isCorrect = currentQ.options[selectedOption].isCorrect;

    // Save answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selected: selectedOption,
        isCorrect,
      },
    }));

    setIsSubmitted(true);

    // Record into local-first adaptive engine
    recordConceptAttempt(
      currentQ.conceptId,
      isCorrect,
      isCorrect ? undefined : currentQ.misconceptionId
    );
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setIsCompleted(false);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setIsCompleted(false);
  };

  // Score statistics
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const scorePercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Categories list
  const categories = ['ALL', 'FOUNDATIONS', 'OPTIMIZATION', 'SUPERVISED', 'UNSUPERVISED', 'EVALUATION'];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Benchmark Chassis */}
      <div className="p-4 sm:p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#C83226]">
                DIAGNOSTIC ASSESSMENT BENCH // RIGOROUS GATE & UNDERGRAD ML
              </span>
            </div>
            <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              Interactive Mathematical Diagnostic Engine
            </h1>
            <p className="font-mono text-xs text-[#5C544B] max-w-2xl mt-1 leading-relaxed">
              Test your algorithmic reasoning against verified mathematical edge cases. Pinpoint failure modes, expose common misconceptions, and verify exact mathematical invariants without multiple-choice guesswork.
            </p>
          </div>

          {/* Mechanical Tape Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col">
              <span className="font-mono text-[9px] uppercase font-bold text-[#5C544B]">
                EXAM PROGRESS
              </span>
              <div className="flex items-center bg-[#1A1715] text-[#FAF7F0] px-3 py-1 border border-[#1A1715]">
                <span className="font-mono text-lg font-bold tracking-widest tnum">
                  {String(isCompleted ? filteredQuestions.length : currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs text-[#948B7D] mx-1">/</span>
                <span className="font-mono text-xs text-[#948B7D] tnum font-semibold">
                  {String(filteredQuestions.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col">
              <span className="font-mono text-[9px] uppercase font-bold text-[#5C544B]">
                CURRENT SCORE
              </span>
              <div className="flex items-center bg-[#1A1715] text-[#33634B] px-3 py-1 border border-[#1A1715]">
                <span className="font-mono text-lg font-bold tracking-widest text-[#FAF7F0] tnum">
                  {scorePercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="font-bold text-[#5C544B] uppercase mr-1">TOPIC DOMAIN:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-2.5 py-1 font-bold border transition-none uppercase ${
                selectedCategory.toUpperCase() === cat.toUpperCase()
                  ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                  : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!isCompleted && currentQ && (
        <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-5">
          {/* Question Eyebrow & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="ultramarine">{currentQ.category}</Badge>
              <span className="font-mono text-xs font-bold text-[#1A1715]">
                {currentQ.conceptTitle}
              </span>
            </div>
            <Link
              href={currentQ.conceptUrl}
              target="_blank"
              className="font-mono text-[11px] font-bold text-[#1848B8] hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>INSPECT CONCEPT DECK ↗</span>
            </Link>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="font-mono text-base sm:text-lg font-bold text-[#1A1715] leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.latexFormula && (
              <FormulaPlate
                latex={currentQ.latexFormula}
                label="GOVERNING MATHEMATICAL OBJECTIVE"
                className="my-3"
              />
            )}
          </div>

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5C544B]">
              SELECT CANDIDATE THEOREM:
            </div>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyles = 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]';

              if (isSelected && !isSubmitted) {
                optionStyles = 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]';
              } else if (isSubmitted) {
                if (opt.isCorrect) {
                  optionStyles = 'bg-[#33634B] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyles = 'bg-[#C83226] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]';
                } else {
                  optionStyles = 'bg-[#F4EFE4] text-[#948B7D] border-[#D8CFC0] opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 border-[1.5px] font-mono text-xs leading-relaxed transition-none flex items-start gap-3 ${optionStyles}`}
                >
                  <span
                    className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold border ${
                      isSelected || (isSubmitted && opt.isCorrect)
                        ? 'border-white text-white'
                        : 'border-[#1A1715] text-[#1A1715] bg-[#E8E1D3]'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="pt-0.5">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Submit / Next Action Bar */}
          <div className="pt-3 border-t border-[#D8CFC0] flex flex-wrap items-center justify-between gap-3">
            <div className="font-mono text-xs text-[#5C544B]">
              {!isSubmitted ? (
                selectedOption !== null ? (
                  <span className="text-[#1848B8] font-bold">● Candidate hypothesis selected. Press verify.</span>
                ) : (
                  <span>Select an answer above to verify correctness.</span>
                )
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <AnalogButton
                  variant="primary"
                  size="md"
                  onClick={handleVerify}
                  disabled={selectedOption === null}
                  className="flex items-center gap-1.5"
                >
                  <span>VERIFY HYPOTHESIS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnalogButton>
              ) : (
                <AnalogButton
                  variant="ultramarine"
                  size="md"
                  onClick={handleNext}
                  className="flex items-center gap-1.5"
                >
                  <span>{currentIndex + 1 < filteredQuestions.length ? 'NEXT QUESTION' : 'COMPLETE EXAM'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnalogButton>
              )}
            </div>
          </div>

          {/* Feedback & Misconception Breakdown Panel */}
          {isSubmitted && (
            <div
              className={`p-4 border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] space-y-3 font-mono text-xs ${
                currentQ.options[selectedOption!].isCorrect ? 'bg-[#33634B]/10' : 'bg-[#C83226]/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentQ.options[selectedOption!].isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#33634B]" />
                      <span className="font-bold text-[#33634B] uppercase tracking-wider">
                        CONVERGED // MATHEMATICAL PROOF VALIDATED
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-[#C83226]" />
                      <span className="font-bold text-[#C83226] uppercase tracking-wider">
                        FAILURE BREAKPOINT DETECTED // MISCONCEPTION IDENTIFIED
                      </span>
                    </>
                  )}
                </div>

                <Badge
                  variant={currentQ.options[selectedOption!].isCorrect ? 'sage' : 'vermilion'}
                >
                  {currentQ.options[selectedOption!].isCorrect ? '+12 MASTERY' : '-8 MASTERY'}
                </Badge>
              </div>

              {!currentQ.options[selectedOption!].isCorrect && (
                <div className="p-2.5 bg-[#FAF7F0] border border-[#C83226]/40 space-y-1">
                  <span className="text-[10px] font-bold text-[#C83226] uppercase block">
                    COMMON MISCONCEPTION TRAP:
                  </span>
                  <p className="text-[#1A1715] leading-snug">{currentQ.misconceptionMyth}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#1A1715] uppercase block">
                  RIGOROUS PEDAGOGICAL RATIONALE:
                </span>
                <p className="text-[#5C544B] leading-relaxed">{currentQ.detailedRationale}</p>
              </div>

              {currentQ.mathematicalProof && (
                <FormulaPlate
                  latex={currentQ.mathematicalProof}
                  label="ANALYTICAL DERIVATION"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Completion Screen / Diagnostic Report Card */}
      {isCompleted && (
        <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-6">
          <div className="border-b border-[#D8CFC0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Award className="w-4 h-4 text-[#1848B8]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1848B8]">
                  EXAM COMPLETE // LOCAL-FIRST VERIFICATION REPORT
                </span>
              </div>
              <h2 className="font-mono text-2xl font-black text-[#1A1715]">
                Diagnostic Knowledge Report
              </h2>
              <p className="font-mono text-xs text-[#5C544B] mt-1">
                Your performance has been evaluated and recorded into the browser&apos;s adaptive recommendation engine.
              </p>
            </div>

            <div className="p-3 bg-[#1A1715] text-[#FAF7F0] border border-[#1A1715] shadow-[2px_2px_0px_#C83226] text-center shrink-0">
              <span className="font-mono text-[10px] uppercase text-[#948B7D] block">
                COMPOSITE SCORE
              </span>
              <span className="font-mono text-3xl font-black tracking-wider text-[#FAF7F0] tnum">
                {scorePercent}%
              </span>
              <span className="font-mono text-[10px] text-[#948B7D] block">
                {correctCount} OF {answeredCount} VERIFIED
              </span>
            </div>
          </div>

          {/* Performance Evaluation Matrix */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#1A1715]">
              TOPIC DOMAIN MASTERY BREAKDOWN:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Foundations', 'Optimization', 'Supervised', 'Unsupervised', 'Evaluation'].map((domain) => {
                const domainQs = filteredQuestions.filter(
                  (q) => q.category.toLowerCase() === domain.toLowerCase()
                );
                if (domainQs.length === 0) return null;

                const domainCorrect = domainQs.filter((q) => userAnswers[q.id]?.isCorrect).length;
                const domainPct = Math.round((domainCorrect / domainQs.length) * 100);

                return (
                  <div key={domain} className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1715] uppercase">{domain}</span>
                      <span className="font-bold tnum text-[#1848B8]">
                        {domainCorrect}/{domainQs.length} ({domainPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#D8CFC0] border border-[#1A1715]">
                      <div
                        className={`h-full ${
                          domainPct >= 75 ? 'bg-[#33634B]' : domainPct >= 50 ? 'bg-[#E28C05]' : 'bg-[#C83226]'
                        }`}
                        style={{ width: `${domainPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Targeted Remediation Recommendations */}
          <div className="space-y-3 font-mono text-xs pt-2">
            <h3 className="font-bold uppercase tracking-wider text-[#1A1715]">
              ACTIONABLE REMEDIATION RECOMMENDATIONS:
            </h3>

            <div className="space-y-2">
              {filteredQuestions
                .filter((q) => userAnswers[q.id] && !userAnswers[q.id].isCorrect)
                .map((q) => (
                  <div
                    key={q.id}
                    className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#C83226] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-2 h-2 bg-[#C83226]" />
                        <span className="font-bold text-[#C83226] uppercase">{q.conceptTitle}</span>
                      </div>
                      <p className="text-[11px] text-[#5C544B]">{q.misconceptionMyth}</p>
                    </div>

                    <Link href={q.conceptUrl}>
                      <AnalogButton variant="secondary" size="sm" className="shrink-0 flex items-center gap-1">
                        <span>STUDY CONCEPT DECK</span>
                        <ChevronRight className="w-3 h-3" />
                      </AnalogButton>
                    </Link>
                  </div>
                ))}

              {correctCount === answeredCount && answeredCount > 0 && (
                <div className="p-4 bg-[#33634B]/10 border border-[#33634B] text-[#33634B] font-bold">
                  ★ Flawless performance! You demonstrated complete conceptual and mathematical mastery across all tested invariants.
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#D8CFC0] flex flex-wrap items-center justify-between gap-3">
            <AnalogButton variant="secondary" size="md" onClick={handleReset} className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETAKE DIAGNOSTIC EXAM</span>
            </AnalogButton>

            <Link href="/dashboard">
              <AnalogButton variant="primary" size="md" className="flex items-center gap-1.5">
                <span>VIEW ADAPTIVE DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AnalogButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
