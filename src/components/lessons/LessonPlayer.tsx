'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { CodeReader } from '@/components/ui/CodeReader';
import { Badge } from '@/components/ui/Badge';
import { LESSONS_REGISTRY } from '@/lib/curriculum/lessonsData';
import { recordConceptAttempt } from '@/lib/adaptive/recommender';
import { MISCONCEPTIONS_CATALOG } from '@/lib/adaptive/misconceptions';
import { isBookmarked, toggleBookmark } from '@/lib/adaptive/bookmarks';
import { LessonMiniSandbox } from './LessonMiniSandbox';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ArrowRight,
  Database,
  GitCompare,
  Sliders,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface LessonPlayerProps {
  lessonId?: string;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId = 'kmeans' }) => {
  const router = useRouter();
  const lesson = LESSONS_REGISTRY[lessonId] || LESSONS_REGISTRY.kmeans;
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Prediction State
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState<boolean>(false);

  // Assessment Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [flaggedMisconceptions, setFlaggedMisconceptions] = useState<string[]>([]);

  // Bookmark state
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setBookmarked(isBookmarked(lesson.id));
  }, [lesson.id]);

  const handleToggleBookmark = () => {
    const nextState = toggleBookmark(lesson.id);
    setBookmarked(nextState);
  };

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

  const handleQuizAnswer = (
    qId: string,
    optIdx: number,
    correctIdx: number,
    misconceptionMap: Record<number, string>
  ) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));

    const isCorrect = optIdx === correctIdx;
    const miscId = misconceptionMap[optIdx];
    if (miscId && !flaggedMisconceptions.includes(miscId)) {
      setFlaggedMisconceptions((prev) => [...prev, miscId]);
    }

    recordConceptAttempt(lesson.id, isCorrect, miscId);
  };

  const allLessons = Object.values(LESSONS_REGISTRY);

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
          <div className="flex items-center gap-3 font-mono text-xs text-[#948B7D]">
            <span>DURATION: {lesson.durationMinutes} MIN</span>
            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1 px-2 py-0.5 border text-xs font-mono transition-all ${
                bookmarked
                  ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715] font-bold shadow-[1px_1px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#5C544B] border-[#D8CFC0] hover:text-[#1A1715]'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#1A1715]' : ''}`} />
              <span>{bookmarked ? 'BOOKMARKED' : 'BOOKMARK'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-mono text-xl sm:text-2xl font-black text-[#1A1715] tracking-tight">
              {lesson.title}
            </h1>
            <p className="font-mono text-xs text-[#5C544B] mt-0.5">{lesson.subtitle}</p>
          </div>

          {/* Quick Switcher dropdown */}
          <div className="shrink-0">
            <select
              value={lesson.id}
              onChange={(e) => router.push(`/lessons/${e.target.value}`)}
              className="font-mono text-xs bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] px-2 py-1 shadow-[1.5px_1.5px_0px_#1A1715] cursor-pointer"
            >
              {allLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.algorithmId.toUpperCase()} (10 STEPS)
                </option>
              ))}
            </select>
          </div>
        </div>

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

          {/* Dynamic Mini-Sandbox: Render interactive widget on explore / under-the-hood / break-it */}
          {(currentStep.phase === 'explore' ||
            currentStep.phase === 'under-the-hood' ||
            currentStep.phase === 'break-it') && (
            <div className="my-4">
              <LessonMiniSandbox algorithmId={lesson.algorithmId} />
            </div>
          )}

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
                title={`PYTHON // ${lesson.algorithmId.toUpperCase()} NUMPY KERNEL`}
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

          {/* Phase: Step 10 Mastery & Synthesis (The Vertical Slice Hand-Off Funnel) */}
          {currentStep.phase === 'mastery' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#33634B]/10 border-[1.5px] border-[#33634B] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#33634B] text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>LESSON COMPLETE // CONCEPT SYNTHESIS VALIDATED</span>
                </div>
                <p className="text-[#1A1715] leading-relaxed">
                  You have mastered the inductive bias, mathematical equations, and failure modes of {lesson.title}.
                  Now complete the scientific cycle: run the model on real user data, benchmark it against competing algorithms, and log your findings.
                </p>
              </div>

              {/* End-to-End Vertical Loop Action Funnel */}
              <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
                <span className="font-bold text-[#C83226] block uppercase tracking-wider">
                  ADVANCE TO NEXT SCIENTIFIC STAGE // CHOOSE YOUR EXPERIMENT PATH
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1: Run on Real Data in My Data Lab */}
                  <Link
                    href={
                      lesson.algorithmId === 'kmeans'
                        ? '/datalab?preset=irisSubset&task=clustering&from=kmeans'
                        : '/datalab?preset=studentExam&task=regression&from=' + lesson.algorithmId
                    }
                    className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] hover:bg-[#F4EFE4] shadow-[2px_2px_0px_#1A1715] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[#1848B8] font-bold mb-1">
                        <Database className="w-4 h-4" />
                        <span>STAGE 02: MY DATA LAB</span>
                      </div>
                      <p className="text-[11px] text-[#5C544B] leading-relaxed">
                        {lesson.algorithmId === 'kmeans'
                          ? "Apply Lloyd's algorithm to the real Fisher Iris dataset with custom scaling."
                          : "Fit this model onto real tabular observations and inspect residual metrics."}
                      </p>
                    </div>
                    <span className="text-[#1848B8] font-bold text-[11px] mt-3 flex items-center gap-1">
                      RUN IN MY DATA LAB <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  {/* Step 2: Compare against competing models */}
                  <Link
                    href={
                      lesson.algorithmId === 'kmeans'
                        ? '/compare?geometry=concentric&from=kmeans'
                        : '/lab?algo=' + lesson.algorithmId
                    }
                    className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] hover:bg-[#F4EFE4] shadow-[2px_2px_0px_#1A1715] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[#E28C05] font-bold mb-1">
                        <GitCompare className="w-4 h-4" />
                        <span>STAGE 03: COMPARISON STUDIO</span>
                      </div>
                      <p className="text-[11px] text-[#5C544B] leading-relaxed">
                        {lesson.algorithmId === 'kmeans'
                          ? "Benchmark K-Means vs DBSCAN vs Agglomerative on pathological concentric rings."
                          : "Examine parameter sensitivity and frontier boundaries in the interactive lab."}
                      </p>
                    </div>
                    <span className="text-[#E28C05] font-bold text-[11px] mt-3 flex items-center gap-1">
                      OPEN BENCHMARK STUDIO <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>

                {/* Replay in Algorithm Cinema */}
                {lesson.algorithmId === 'kmeans' && (
                  <div className="pt-2 border-t border-[#D8CFC0] flex items-center justify-between">
                    <span className="text-[11px] text-[#5C544B]">
                      Prefer visual exploration? Watch step-by-step centroid kinematics:
                    </span>
                    <Link href="/cinema">
                      <AnalogButton variant="secondary" size="sm">
                        ALGORITHM CINEMA →
                      </AnalogButton>
                    </Link>
                  </div>
                )}
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
