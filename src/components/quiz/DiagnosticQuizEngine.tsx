'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DIAGNOSTIC_QUESTION_BANK,
  DiagnosticQuestion,
  DiagnosticQuestionType,
  evaluateDiagnosticQuestion,
  evaluateDiagnosticAssessment,
  recordDiagnosticResult,
  DiagnosticAssessmentResult,
  DiagnosticSubmission,
  ConceptGap,
} from '@/lib/learning';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
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
  Activity,
  Zap,
} from 'lucide-react';

export const DiagnosticQuizEngine: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Record<string, DiagnosticSubmission>>({});
  const [assessmentResult, setAssessmentResult] = useState<DiagnosticAssessmentResult | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Filtered question set
  const filteredQuestions =
    selectedCategory === 'ALL'
      ? DIAGNOSTIC_QUESTION_BANK
      : DIAGNOSTIC_QUESTION_BANK.filter(
          (q) => q.subject.toUpperCase() === selectedCategory.toUpperCase()
        );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optId);
  };

  const handleVerify = () => {
    if (isSubmitted || !currentQ) return;
    const answer = currentQ.type === 'numerical' ? numericalInput.trim() : selectedOption;
    if (!answer && answer !== '0') return;

    const newSub: DiagnosticSubmission = {
      questionId: currentQ.id,
      answer,
      timestamp: Date.now(),
    };

    const nextSubs = { ...submissions, [currentQ.id]: newSub };
    setSubmissions(nextSubs);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setNumericalInput('');
      setIsSubmitted(false);
    } else {
      // Complete diagnostic assessment
      const allSubmissions = Object.values(submissions);
      const result = evaluateDiagnosticAssessment(allSubmissions);
      recordDiagnosticResult(result);
      setAssessmentResult(result);
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption('');
    setNumericalInput('');
    setIsSubmitted(false);
    setSubmissions({});
    setAssessmentResult(null);
    setIsCompleted(false);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption('');
    setNumericalInput('');
    setIsSubmitted(false);
    setSubmissions({});
    setAssessmentResult(null);
    setIsCompleted(false);
  };

  const categories = ['ALL', 'MATHEMATICS', 'OPTIMIZATION', 'CLUSTERING'];

  const answeredCount = Object.keys(submissions).length;
  const currentSubmission = currentQ ? submissions[currentQ.id] : undefined;
  const currentEvaluation =
    currentQ && currentSubmission
      ? evaluateDiagnosticQuestion(currentQ, currentSubmission.answer)
      : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715] inline-block" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C83226]">
                DIAGNOSTIC INTELLIGENCE & REMEDIATION ENGINE
              </span>
            </div>
            <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#1A1715] tracking-tight">
              Machine Learning Concept Diagnostic Assessment
            </h1>
            <p className="font-mono text-xs text-[#5C544B] mt-1 max-w-3xl">
              Identify prerequisite knowledge gaps across differential calculus, optimization dynamics, and unsupervised clustering before launching learning pathways. 100% deterministic, local-first evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#F4EFE4] border border-[#1A1715] font-mono text-center min-w-[120px]">
              <span className="text-[10px] text-[#5C544B] uppercase block">DIAGNOSTIC STEP</span>
              <span className="text-lg font-bold text-[#1848B8]">
                {filteredQuestions.length > 0 ? currentIndex + 1 : 0} / {filteredQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="font-bold text-[#5C544B] uppercase mr-1">SUBJECT DOMAIN:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 font-bold border transition-none uppercase ${
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

      {/* Active Question View */}
      {!isCompleted && currentQ && (
        <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-5">
          {/* Question Eyebrow & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={currentQ.subject === 'optimization' ? 'vermilion' : currentQ.subject === 'clustering' ? 'ultramarine' : 'amber'}>
                {currentQ.subject.toUpperCase()}
              </Badge>
              <Badge variant="neutral">
                {currentQ.type.toUpperCase()}
              </Badge>
              {currentQ.isGatePyq ? (
                <Badge variant="ultramarine">
                  ★ VERIFIED {currentQ.gateYear || 'OFFICIAL GATE PYQ'}
                </Badge>
              ) : (
                <Badge variant="neutral">
                  PLATFORM DIAGNOSTIC
                </Badge>
              )}
            </div>
            <Link
              href={`/concepts/${currentQ.conceptId}`}
              target="_blank"
              className="font-mono text-[11px] font-bold text-[#1848B8] hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CONCEPT CARD ↗</span>
            </Link>
          </div>

          {/* Context Scenario (if applicable) */}
          {currentQ.contextScenario && (
            <div className="p-3 bg-[#E8E1D3] border border-[#1A1715]/30 font-mono text-xs text-[#1A1715]">
              <span className="font-bold text-[#5C544B] uppercase block text-[10px] mb-1">ENGINEERING SCENARIO:</span>
              {currentQ.contextScenario}
            </div>
          )}

          {/* Question Header & Body */}
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

            {/* Graph Data Representation */}
            {currentQ.graphData && (
              <div className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#1A1715]/20 pb-1.5">
                  <span className="font-bold text-[10px] text-[#5C544B] uppercase tracking-wider">
                    DIAGNOSTIC GRAPH REPRESENTATION // {currentQ.graphData.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[#1A1715] text-[11px]">{currentQ.graphData.description}</p>
                {currentQ.graphData.axisLabels && (
                  <div className="flex gap-4 text-[10px] text-[#5C544B]">
                    <span>Horizontal Axis: {currentQ.graphData.axisLabels.x}</span>
                    <span>Vertical Axis: {currentQ.graphData.axisLabels.y}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answer Input Section */}
          <div className="space-y-3 pt-2">
            {currentQ.type === 'numerical' ? (
              <div className="space-y-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#5C544B] block">
                  ENTER NUMERICAL ANSWER (TOLERANCE ±{currentQ.numericalTolerance ?? 0.05}):
                </label>
                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="number"
                    step="any"
                    value={numericalInput}
                    onChange={(e) => setNumericalInput(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="e.g. 1.70"
                    className="w-full p-2.5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] font-mono text-sm font-bold text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1848B8]"
                  />
                  <span className="font-mono text-xs text-[#5C544B]">float</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5C544B]">
                  SELECT CANDIDATE THEOREM / OPTION:
                </div>
                {currentQ.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt.id;
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
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 border-[1.5px] font-mono text-xs leading-relaxed transition-none flex items-start gap-3 ${optionStyles}`}
                    >
                      <span
                        className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold border text-[11px] ${
                          isSelected || (isSubmitted && opt.isCorrect)
                            ? 'border-white text-white'
                            : 'border-[#1A1715] text-[#1A1715] bg-[#E8E1D3]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feedback & Mathematical Proof */}
          {isSubmitted && currentEvaluation && (
            <div
              className={`p-4 border-[1.5px] border-[#1A1715] font-mono text-xs space-y-3 ${
                currentEvaluation.isCorrect
                  ? 'bg-[#33634B]/10 border-[#33634B]'
                  : 'bg-[#C83226]/10 border-[#C83226]'
              }`}
            >
              <div className="flex items-center gap-2">
                {currentEvaluation.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#33634B]" />
                    <span className="font-bold text-[#33634B] uppercase tracking-wide">
                      VERIFIED CORRECT!
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-[#C83226]" />
                    <span className="font-bold text-[#C83226] uppercase tracking-wide">
                      MISCONCEPTION IDENTIFIED:
                    </span>
                  </>
                )}
              </div>

              {!currentEvaluation.isCorrect && currentEvaluation.misconceptionTriggered && (
                <div className="p-3 bg-[#FAF7F0] border border-[#C83226] text-[#C83226]">
                  <span className="font-bold uppercase text-[10px] block mb-0.5">COMMON PITFALL:</span>
                  {currentEvaluation.misconceptionTriggered}
                </div>
              )}

              <div className="space-y-1.5 text-[#1A1715]">
                <span className="font-bold uppercase text-[10px] text-[#5C544B] block">
                  ANALYTICAL RATIONALE:
                </span>
                <p className="leading-relaxed">{currentEvaluation.explanation}</p>
              </div>

              <div className="p-3 bg-[#FAF7F0] border border-[#1A1715]/20 space-y-1">
                <span className="font-bold uppercase text-[10px] text-[#5C544B] block">
                  MATHEMATICAL DERIVATION:
                </span>
                <FormulaPlate latex={currentQ.mathematicalDerivation} />
              </div>

              {/* Remediation Callout */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1A1715]/20">
                <span className="text-[11px] font-bold text-[#1848B8]">
                  RECOMMENDED NEXT ACTION:
                </span>
                <Link
                  href={currentEvaluation.remediation.targetUrl}
                  className="px-2.5 py-1 bg-[#1848B8] text-white border border-[#1A1715] font-bold text-[10px] uppercase hover:bg-[#143B96] transition-none"
                >
                  {currentEvaluation.remediation.description} ↗
                </Link>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#D8CFC0]">
            <AnalogButton
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART DIAGNOSTIC</span>
            </AnalogButton>

            {!isSubmitted ? (
              <AnalogButton
                variant="ultramarine"
                size="md"
                onClick={handleVerify}
                disabled={
                  currentQ.type === 'numerical'
                    ? !numericalInput.trim()
                    : !selectedOption
                }
              >
                SUBMIT FOR VERIFICATION
              </AnalogButton>
            ) : (
              <AnalogButton
                variant="primary"
                size="md"
                onClick={handleNext}
                className="flex items-center gap-1.5"
              >
                <span>
                  {currentIndex + 1 < filteredQuestions.length
                    ? 'NEXT QUESTION'
                    : 'FINALIZE ASSESSMENT & VIEW REPORT'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </AnalogButton>
            )}
          </div>
        </div>
      )}

      {/* Completion Dashboard */}
      {isCompleted && assessmentResult && (
        <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-6">
          <div className="border-b border-[#D8CFC0] pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#33634B] border border-[#1A1715] inline-block" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#33634B]">
                DIAGNOSTIC AUDIT COMPLETE // 100% LOCAL LEDGER PERSISTED
              </span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-[#1A1715]">
              Diagnostic Readiness & Knowledge Gap Profile
            </h2>
          </div>

          {/* Score Meters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
            <div className="p-4 bg-[#F4EFE4] border border-[#1A1715] text-center">
              <span className="text-[10px] text-[#5C544B] uppercase block">OVERALL READINESS</span>
              <span className="text-3xl font-bold text-[#1848B8]">
                {assessmentResult.scorePercentage}%
              </span>
              <span className="text-[10px] text-[#5C544B] block mt-1">
                {assessmentResult.correctCount} / {assessmentResult.totalQuestions} Questions
              </span>
            </div>

            {Object.entries(assessmentResult.subjectScores).map(([sub, scoreData]) => (
              <div key={sub} className="p-4 bg-[#F4EFE4] border border-[#1A1715] text-center">
                <span className="text-[10px] text-[#5C544B] uppercase block">{sub}</span>
                <span
                  className={`text-2xl font-bold ${
                    scoreData.percentage >= 70
                      ? 'text-[#33634B]'
                      : scoreData.percentage >= 40
                      ? 'text-[#E28C05]'
                      : 'text-[#C83226]'
                  }`}
                >
                  {scoreData.percentage}%
                </span>
                <span className="text-[10px] text-[#5C544B] block mt-1">
                  {scoreData.correct} / {scoreData.total}
                </span>
              </div>
            ))}
          </div>

          {/* Gaps and Remediation Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2">
              <h3 className="font-mono text-sm font-bold uppercase text-[#1A1715] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C83226]" />
                <span>IDENTIFIED CONCEPT GAPS & TARGETED REMEDIATIONS</span>
              </h3>
              <Badge variant={assessmentResult.detectedGaps.length > 0 ? 'vermilion' : 'sage'}>
                {assessmentResult.detectedGaps.length} GAPS DETECTED
              </Badge>
            </div>

            {assessmentResult.detectedGaps.length === 0 ? (
              <div className="p-4 bg-[#33634B]/10 border border-[#33634B] font-mono text-xs text-[#33634B] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Exceptional Mastery Demonstrated!</span>
                  <span>No prerequisite gaps detected. You are primed to advance directly to any flagship pathway.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono">
                {assessmentResult.detectedGaps.map((gap, idx) => (
                  <div
                    key={gap.conceptId}
                    className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1715]/20 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#C83226]">GAP #{idx + 1}</span>
                        <span className="font-bold text-[#1A1715]">{gap.conceptName}</span>
                        <Badge variant={gap.confidence === 'critical' ? 'vermilion' : gap.confidence === 'confirmed' ? 'amber' : 'neutral'}>
                          {gap.confidence.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-[#5C544B]">
                        Diagnostic Score: {gap.score}%
                      </span>
                    </div>

                    <p className="text-[#1A1715] leading-relaxed">
                      {gap.explainableRecommendation}
                    </p>

                    {/* Remediation Action Links */}
                    <div className="pt-2 border-t border-[#1A1715]/10 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-[#5C544B] uppercase mr-1">
                        REMEDIATION ACTIONS:
                      </span>
                      {gap.remediationActions.map((act) => (
                        <Link
                          key={act.id}
                          href={act.url}
                          className="px-2.5 py-1 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3] font-bold text-[10px] uppercase text-[#1848B8] flex items-center gap-1 transition-none"
                        >
                          <span>{act.title}</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D8CFC0]">
            <AnalogButton
              variant="secondary"
              size="md"
              onClick={handleReset}
              className="flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETAKE DIAGNOSTIC</span>
            </AnalogButton>

            <Link href="/dashboard">
              <AnalogButton variant="ultramarine" size="md" className="flex items-center gap-2">
                <span>PROCEED TO LEARNING DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </AnalogButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
