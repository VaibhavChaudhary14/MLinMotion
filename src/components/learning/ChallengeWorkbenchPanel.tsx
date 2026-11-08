'use client';

import React, { useState } from 'react';
import type {
  ChallengeDefinition,
  ChallengeVerificationResult,
} from '@/lib/learning/types';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ChallengeWorkbenchPanelProps {
  challenges: ChallengeDefinition<any, any, any>[];
  activeChallengeId: string;
  onSelectChallenge: (challengeId: string) => void;
  onVerifyChallenge: (challenge: ChallengeDefinition<any, any, any>) => ChallengeVerificationResult;
  completedChallenges: Record<string, boolean>;
  onResetSimulation: () => void;
}

export const ChallengeWorkbenchPanel: React.FC<ChallengeWorkbenchPanelProps> = ({
  challenges,
  activeChallengeId,
  onSelectChallenge,
  onVerifyChallenge,
  completedChallenges,
  onResetSimulation,
}) => {
  const [verificationResult, setVerificationResult] =
    useState<ChallengeVerificationResult | null>(null);

  const activeChallenge =
    challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  const handleSelect = (id: string) => {
    setVerificationResult(null);
    onSelectChallenge(id);
  };

  const handleVerify = () => {
    if (!activeChallenge) return;
    const result = onVerifyChallenge(activeChallenge);
    setVerificationResult(result);
  };

  const getDifficultyBadge = (diff: ChallengeDefinition['difficulty']) => {
    switch (diff) {
      case 'foundational':
        return <Badge variant="neutral">FOUNDATIONAL</Badge>;
      case 'intermediate':
        return <Badge variant="ultramarine">INTERMEDIATE</Badge>;
      case 'advanced':
        return <Badge variant="amber">ADVANCED</Badge>;
      case 'pathological':
        return <Badge variant="vermilion">PATHOLOGICAL</Badge>;
      default:
        return null;
    }
  };

  if (!activeChallenge) return null;

  return (
    <div className="space-y-4">
      {/* Challenge Selector Strip */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#1A1715]/20">
        {challenges.map((c) => {
          const isSelected = c.id === activeChallenge.id;
          const isDone = !!completedChallenges[c.id];

          return (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold border-[1.5px] border-[#1A1715] flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[2.5px_2.5px_0px_#1848B8]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#E8E1D3] shadow-[2px_2px_0px_#1A1715]'
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B]" />}
              <span>{c.id}</span>
              <span className="text-[10px] opacity-70">
                ({c.difficulty.slice(0, 4).toUpperCase()})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Card */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#C83226] text-[#FAF7F0] font-bold">
                BREAK THE ALGORITHM // {activeChallenge.id}
              </span>
              {getDifficultyBadge(activeChallenge.difficulty)}
              {completedChallenges[activeChallenge.id] && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#33634B] text-[#FAF7F0] font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" /> SOLVED
                </span>
              )}
            </div>
            <h3 className="text-sm font-black text-[#1A1715] uppercase tracking-wide">
              {activeChallenge.title}
            </h3>
            <p className="text-xs text-[#1A1715]/70 font-mono">
              {activeChallenge.subtitle}
            </p>
          </div>
        </div>

        {/* Concept Trap Warning */}
        <div className="p-2.5 bg-[#E28C05]/10 border-l-[3px] border-[#E28C05] text-xs font-mono space-y-1">
          <div className="font-bold text-[#1A1715] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#E28C05]" />
            <span>COMMON MISCONCEPTION TRAP:</span>
          </div>
          <p className="text-[#1A1715]/90 text-[11px] leading-relaxed">
            {activeChallenge.conceptTrap}
          </p>
        </div>

        {/* Objective & Instructions */}
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-[#F4EFE4] border border-[#1A1715]/20 space-y-1.5">
            <div className="font-bold text-[#1848B8] uppercase text-[10px]">
              YOUR OBJECTIVE:
            </div>
            <p className="text-[#1A1715] leading-relaxed text-[11px]">
              {activeChallenge.objective}
            </p>
            <div className="pt-1 text-[11px] text-[#1A1715]/80 font-sans italic border-t border-[#1A1715]/10">
              <strong>Instructions:</strong> {activeChallenge.instruction}
            </div>
          </div>
        </div>

        {/* Challenge Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1A1715]/20">
          <AnalogButton
            onClick={onResetSimulation}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Target State
          </AnalogButton>

          <AnalogButton
            onClick={handleVerify}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verify Failure Condition
          </AnalogButton>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div
            className={`p-3 border-[1.5px] border-[#1A1715] text-xs font-mono space-y-2 ${
              verificationResult.passed
                ? 'bg-[#33634B]/15 text-[#33634B]'
                : 'bg-[#C83226]/15 text-[#C83226]'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {verificationResult.passed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{verificationResult.message}</span>
            </div>
            <div className="text-[11px] text-[#1A1715] font-normal pl-5">
              <strong>Diagnostic Evidence:</strong> {verificationResult.diagnosticEvidence}
            </div>

            {verificationResult.passed && (
              <div className="mt-3 p-2.5 bg-[#FAF7F0] border border-[#33634B]/40 text-[#1A1715] space-y-2">
                <div className="text-[10px] font-bold uppercase text-[#33634B] flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Mathematical Explanation & Practical Lesson
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Proof:</strong> {activeChallenge.explanation.mathematicalProof}
                </p>
                <p className="text-[11px] text-[#1848B8] leading-relaxed">
                  <strong>Engineering Takeaway:</strong> {activeChallenge.explanation.practicalLesson}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
