'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { CodeReader } from '@/components/ui/CodeReader';
import { Badge } from '@/components/ui/Badge';
import { LESSONS_REGISTRY } from '@/lib/curriculum/lessonsData';
import { recordConceptAttempt } from '@/lib/adaptive/recommender';
import { MISCONCEPTIONS_CATALOG } from '@/lib/adaptive/misconceptions';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface LessonPlayerProps {
  lessonId?: string;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId = 'kmeans' }) => {
  const lesson = LESSONS_REGISTRY[lessonId] || LESSONS_REGISTRY.kmeans;
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Prediction State
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState<boolean>(false);

  // Assessment Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [flaggedMisconceptions, setFlaggedMisconceptions] = useState<string[]>([]);

  const currentStep = lesson.steps[currentStepIdx] || lesson.steps[0];
  const totalSteps = lesson.steps.length;

  const handleNext = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number, correctIdx: number, misconceptionMap: Record<number, string>) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));

    const isCorrect = optIdx === correctIdx;
    const miscId = misconceptionMap[optIdx];
    if (miscId && !flaggedMisconceptions.includes(miscId)) {
      setFlaggedMisconceptions((prev) => [...prev, miscId]);
    }

    recordConceptAttempt('kmeans-clustering', isCorrect, miscId);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Lesson Header Plate */}
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C83226]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#5C544B]">
              LESSON TRACK // {lesson.algorithmId.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#948B7D]">
            <span>DURATION: {lesson.durationMinutes} MIN</span>
          </div>
        </div>

        <h1 className="font-mono text-xl sm:text-2xl font-black text-[#1A1715] tracking-tight">
          {lesson.title}
        </h1>
        <p className="font-mono text-xs text-[#5C544B] mt-0.5">{lesson.subtitle}</p>

        {/* 10-Step Progress Strip */}
        <div className="mt-4 pt-3 border-t border-[#D8CFC0] flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {lesson.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 min-w-[28px] h-2 border border-[#1A1715] transition-all ${
                idx === currentStepIdx
                  ? 'bg-[#C83226] shadow-[1px_1px_0px_#1A1715]'
                  : idx < currentStepIdx
                  ? 'bg-[#1848B8]'
                  : 'bg-[#FAF7F0]'
              }`}
              title={`${idx + 1}. ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Active Step Content Card */}
      <AnalogCard
        variant="card"
        headerEyebrow={currentStep.eyebrow}
        headerTitle={`${currentStepIdx + 1}. ${currentStep.title.toUpperCase()}`}
        headerAction={
          <Badge variant="dark">
            STEP {currentStepIdx + 1} OF {totalSteps}
          </Badge>
        }
      >
        <div className="space-y-4">
          {/* Main Explanatory Prose */}
          <div className="font-mono text-sm leading-relaxed text-[#1A1715] space-y-3">
            <p>{currentStep.contentMarkdown}</p>
          </div>

          {/* Optional Equation Plate */}
          {currentStep.equation && (
            <div className="my-3">
              <FormulaPlate latex={currentStep.equation} label="GOVERNING EQUATION" />
            </div>
          )}

          {/* Phase: Predict Interactive Question */}
          {currentStep.phase === 'predict' && currentStep.predictionOptions && (
            <div className="p-4 bg-[#E8E1D3]/50 border-[1.5px] border-[#1A1715] space-y-3">
              <span className="font-mono text-xs font-bold uppercase text-[#C83226] block">
                INTERACTIVE PREDICTION // TEST YOUR INTUITION
              </span>
              <p className="font-mono text-sm font-bold text-[#1A1715]">
                {currentStep.predictionOptions.question}
              </p>

              <div className="space-y-2">
                {currentStep.predictionOptions.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => {
                      setSelectedPrediction(oIdx);
                      setPredictionSubmitted(true);
                    }}
                    className={`w-full text-left p-2.5 font-mono text-xs border-[1.5px] transition-all flex items-start gap-2 ${
                      predictionSubmitted && oIdx === currentStep.predictionOptions?.correctIndex
                        ? 'bg-[#33634B]/20 border-[#33634B] text-[#1A1715] font-bold'
                        : selectedPrediction === oIdx
                        ? 'bg-[#C83226]/10 border-[#C83226] text-[#1A1715]'
                        : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center border border-[#1A1715] bg-[#E8E1D3] text-[10px] font-bold shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {predictionSubmitted && (
                <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] font-mono text-xs mt-2 text-[#1A1715] leading-relaxed">
                  <span className="font-bold text-[#33634B] block mb-1">SCIENTIFIC REVEAL:</span>
                  {currentStep.predictionOptions.explanation}
                </div>
              )}
            </div>
          )}

          {/* Phase: Code It Visualizer */}
          {currentStep.phase === 'code-it' && currentStep.codeSnippet && (
            <div className="space-y-3">
              <CodeReader
                codeLines={currentStep.codeSnippet.python.split('\n')}
                activeLineNumber={4}
                title="PYTHON // LLOYD STEP KERNEL"
              />
              <div className="p-3 bg-[#E8E1D3]/60 border border-[#1A1715] font-mono text-xs text-[#5C544B]">
                <span className="font-bold text-[#1A1715] block mb-0.5">SCIKIT-LEARN CONNECTION:</span>
                {currentStep.codeSnippet.explanation}
              </div>
            </div>
          )}

          {/* Phase: Assessment Diagnostic Questions */}
          {currentStep.phase === 'assessment' && currentStep.questions && (
            <div className="space-y-4">
              {currentStep.questions.map((q) => {
                const isAnswered = quizSubmitted[q.id];
                const selectedOpt = quizAnswers[q.id];

                return (
                  <div key={q.id} className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5 font-mono text-xs">
                      <span className="font-bold text-[#1A1715]">DIAGNOSTIC QUESTION</span>
                      <Badge variant="amber">{q.difficulty.toUpperCase()}</Badge>
                    </div>

                    <p className="font-mono text-xs font-semibold text-[#1A1715] leading-relaxed">
                      {q.prompt}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizAnswer(q.id, optIdx, q.correctIndex, q.misconceptionMap)}
                          disabled={isAnswered}
                          className={`w-full text-left p-2 font-mono text-xs border-[1.5px] transition-all flex items-start gap-2 ${
                            isAnswered && optIdx === q.correctIndex
                              ? 'bg-[#33634B]/20 border-[#33634B] font-bold'
                              : isAnswered && selectedOpt === optIdx && optIdx !== q.correctIndex
                              ? 'bg-[#C83226]/15 border-[#C83226] text-[#C83226]'
                              : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                          }`}
                        >
                          <span className="w-4 h-4 flex items-center justify-center border border-[#1A1715] bg-[#E8E1D3] text-[9px] font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>

                    {isAnswered && (
                      <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715] font-mono text-xs text-[#1A1715] leading-relaxed">
                        <span className="font-bold text-[#1848B8] block mb-0.5">EXPLANATION:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Misconception Diagnostic Feedback */}
              {flaggedMisconceptions.length > 0 && (
                <div className="p-3 bg-[#C83226]/10 border-[1.5px] border-[#C83226] space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#C83226]">
                    <AlertCircle className="w-4 h-4" />
                    <span>DIAGNOSTIC MISCONCEPTION DETECTED</span>
                  </div>
                  {flaggedMisconceptions.map((mId) => {
                    const misc = MISCONCEPTIONS_CATALOG[mId];
                    if (!misc) return null;
                    return (
                      <div key={mId} className="font-mono text-xs text-[#1A1715] space-y-1">
                        <span className="font-bold">{misc.name}</span>
                        <p className="text-[11px] text-[#5C544B]">{misc.targetedExplanation}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Phase: Mastery & Next Step */}
          {currentStep.phase === 'mastery' && (
            <div className="p-4 bg-[#33634B]/10 border-[1.5px] border-[#33634B] space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-[#33634B] text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>LESSON COMPLETE // CONCEPT VALIDATED</span>
              </div>
              <p className="text-[#1A1715] leading-relaxed">
                You have synthesized the coordinate descent mechanism, the objective function, and identified the failure boundaries of K-Means.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link href="/cinema">
                  <AnalogButton variant="primary" size="sm">
                    REPLAY IN CINEMA
                  </AnalogButton>
                </Link>
                <Link href="/compare">
                  <AnalogButton variant="secondary" size="sm">
                    COMPARE WITH DBSCAN
                  </AnalogButton>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Footer Controls */}
        <div className="mt-6 pt-4 border-t-[1.5px] border-[#1A1715] flex items-center justify-between">
          <AnalogButton
            variant="secondary"
            size="sm"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREVIOUS</span>
          </AnalogButton>

          <span className="font-mono text-xs font-bold text-[#5C544B]">
            {currentStepIdx + 1} / {totalSteps}
          </span>

          <AnalogButton
            variant="primary"
            size="sm"
            onClick={handleNext}
            disabled={currentStepIdx === totalSteps - 1}
            className="flex items-center gap-1"
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-4 h-4" />
          </AnalogButton>
        </div>
      </AnalogCard>
    </div>
  );
};
