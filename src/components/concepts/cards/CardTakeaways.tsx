'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ConceptTakeawaysCard } from '@/types/conceptCards';
import {
  Award,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FlaskConical,
  Film,
  CheckCheck,
} from 'lucide-react';

interface CardTakeawaysProps {
  data: ConceptTakeawaysCard;
  conceptId: string;
  conceptTitle: string;
  labAlgorithmId?: string;
  cinemaStepId?: string;
  isMastered: boolean;
  onToggleMastered: () => void;
}

export const CardTakeaways: React.FC<CardTakeawaysProps> = ({
  data,
  conceptId,
  conceptTitle,
  labAlgorithmId,
  cinemaStepId,
  isMastered,
  onToggleMastered,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [showChallengeSolution, setShowChallengeSolution] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasAnswered(true);
  };

  const isCorrect = selectedOption === data.recallQuestion.correctIndex;

  return (
    <article
      id="card-takeaways"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#33634B] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 07 // KEY TAKEAWAYS, MISCONCEPTIONS & RECALL
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#33634B] font-bold">
          <Award className="w-3 h-3" />
          <span>SYNTHESIS PLATE</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Core Takeaways Bullets */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1848B8] block">
            ESSENTIAL PRINCIPLES:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            {data.takeaways.map((point, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] flex items-start gap-2 shadow-[1.5px_1.5px_0px_#1A1715]"
              >
                <span className="w-4 h-4 rounded-full bg-[#1A1715] text-[#FAF7F0] font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[#1A1715] leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Misconception Callout */}
        {data.misconception && (
          <div className="p-4 bg-[#E8E1D3]/70 border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
            <div className="flex items-center gap-2 text-[#C83226]">
              <AlertCircle className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                COMMON LEARNER MISCONCEPTION (MYTH VS REALITY)
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] text-[#C83226] space-y-0.5">
                <span className="font-bold text-[9px] uppercase tracking-wider block">
                  THE COMMON MYTH:
                </span>
                <p className="line-through opacity-85 leading-relaxed">
                  "{data.misconception.myth}"
                </p>
              </div>

              <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] text-[#33634B] space-y-0.5">
                <span className="font-bold text-[9px] uppercase tracking-wider block">
                  THE MATHEMATICAL REALITY:
                </span>
                <p className="font-bold leading-relaxed">
                  {data.misconception.reality}
                </p>
              </div>

              <p className="text-[10px] text-[#5C544B] pt-0.5 px-1 italic">
                * {data.misconception.whyLearnersConfuseIt}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Recall Question */}
        <div className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
            <div className="flex items-center gap-2 text-[#1848B8]">
              <HelpCircle className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                ACTIVE RECALL KNOWLEDGE CHECK
              </span>
            </div>
            {hasAnswered && (
              <span
                className={`font-mono text-[9px] font-bold px-2 py-0.5 border ${
                  isCorrect
                    ? 'bg-[#33634B]/15 text-[#33634B] border-[#33634B]'
                    : 'bg-[#C83226]/15 text-[#C83226] border-[#C83226]'
                }`}
              >
                {isCorrect ? 'VERIFIED CORRECT ✔' : 'INCORRECT RE-EVALUATE ✗'}
              </span>
            )}
          </div>

          <p className="font-mono text-xs sm:text-sm font-bold text-[#1A1715] leading-relaxed">
            {data.recallQuestion.question}
          </p>

          {/* Multiple Choice Options */}
          <div className="space-y-2 pt-1">
            {data.recallQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isOptionCorrect = idx === data.recallQuestion.correctIndex;

              let optionStyle = 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]';
              if (hasAnswered) {
                if (isOptionCorrect) {
                  optionStyle = 'bg-[#33634B]/15 border-[#33634B] text-[#1A1715] font-bold';
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle = 'bg-[#C83226]/15 border-[#C83226] text-[#C83226]';
                } else {
                  optionStyle = 'bg-[#FAF7F0] border-[#D8CFC0] opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-2.5 border-[1.5px] font-mono text-xs flex items-start gap-2.5 transition-all ${optionStyle}`}
                >
                  <span className="w-5 h-5 border border-[#1A1715] bg-[#FAF7F0] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {hasAnswered && (
            <div className="p-3 bg-[#FAF7F0] border border-[#1A1715] space-y-1 font-mono text-xs">
              <span className="font-bold text-[9px] uppercase tracking-wider text-[#1848B8] block">
                EXPLANATION & ANALYSIS:
              </span>
              <p className="text-[#5C544B] leading-relaxed">
                {data.recallQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Practical Hands-On Challenge Plate */}
        {data.challenge && (
          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
              <div className="flex items-center gap-2 text-[#C83226]">
                <FlaskConical className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                  PRACTICAL IMPLEMENTATION CHALLENGE: {data.challenge.title}
                </span>
              </div>
              <span className="font-mono text-[9px] bg-[#E8E1D3] px-2 py-0.5 border border-[#1A1715] font-bold">
                HANDS-ON LAB TASK
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-[#F4EFE4] border border-[#1A1715] space-y-1">
                <span className="font-bold text-[9px] uppercase tracking-wider text-[#1848B8] block">
                  TASK INSTRUCTION:
                </span>
                <p className="text-[#1A1715] leading-relaxed">
                  {data.challenge.taskInstruction}
                </p>
                <p className="text-[10px] text-[#5C544B] pt-1 italic">
                  💡 Hint: {data.challenge.hint}
                </p>
              </div>

              {/* Reveal Solution Button */}
              <div className="pt-1">
                <button
                  onClick={() => setShowChallengeSolution(!showChallengeSolution)}
                  className="px-2.5 py-1 bg-[#E8E1D3] text-[#1A1715] text-[10px] font-bold uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
                >
                  {showChallengeSolution ? 'Hide Solution Analysis' : 'Verify & Reveal Scientific Analysis →'}
                </button>

                {showChallengeSolution && (
                  <div className="mt-2 p-3 bg-[#FAF7F0] border-l-2 border-[#33634B] space-y-1 text-[#5C544B] leading-relaxed">
                    <span className="font-bold text-[9px] uppercase tracking-wider text-[#33634B] block">
                      SCIENTIFIC EXPLANATION:
                    </span>
                    <p>{data.challenge.solutionExplanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Triggers: Mastered Toggle, Interactive Lab, Cinema, Next Concept */}
        <div className="pt-2 border-t border-[#D8CFC0] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Mark as Mastered button */}
            <button
              onClick={onToggleMastered}
              className={`px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex items-center gap-1.5 transition-all ${
                isMastered
                  ? 'bg-[#33634B] text-[#FAF7F0]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>{isMastered ? 'Concept Mastered ✔' : 'Mark as Mastered'}</span>
            </button>

            {/* Launch Lab / Cinema buttons */}
            <div className="flex items-center gap-2">
              {labAlgorithmId && (
                <Link
                  href={`/lab?algo=${labAlgorithmId}`}
                  className="px-3 py-2 bg-[#FAF7F0] text-[#1A1715] font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] flex items-center gap-1.5"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-[#1848B8]" />
                  <span>Launch in Lab</span>
                </Link>
              )}
              <Link
                href="/cinema"
                className="px-3 py-2 bg-[#FAF7F0] text-[#1A1715] font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5 text-[#C83226]" />
                <span>Explore in Cinema</span>
              </Link>
            </div>
          </div>

          {/* Next Recommended Concept Banner */}
          {data.nextConcept && (
            <Link
              href={`/concepts/${data.nextConcept.id}`}
              className="block p-4 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] hover:bg-[#DDD5C5] transition-all group"
            >
              <div className="flex items-center justify-between gap-4 font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#C83226]" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#C83226]">
                      CONTINUE TO NEXT CONCEPT
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#1A1715] group-hover:text-[#1848B8] transition-colors">
                    {data.nextConcept.title} →
                  </h4>
                  <p className="text-xs text-[#5C544B] leading-snug">
                    {data.nextConcept.whyNext}
                  </p>
                </div>
                <div className="hidden sm:flex w-8 h-8 border border-[#1A1715] bg-[#FAF7F0] items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4 text-[#1A1715]" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
