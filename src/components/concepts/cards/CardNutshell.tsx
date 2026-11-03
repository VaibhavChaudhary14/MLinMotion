'use client';

import React from 'react';
import { ConceptNutshellCard, ColorAccent } from '@/types/conceptCards';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { Bookmark, Sparkles, HelpCircle, CheckCircle } from 'lucide-react';

interface CardNutshellProps {
  data: ConceptNutshellCard;
  conceptTitle: string;
  eyebrow: string;
  colorAccent?: ColorAccent;
}

export const CardNutshell: React.FC<CardNutshellProps> = ({
  data,
  conceptTitle,
  eyebrow,
}) => {
  return (
    <article
      id="card-nutshell"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 01 // CONCEPT IN A NUTSHELL
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#5C544B] bg-[#FAF7F0] px-1.5 py-0.5 border border-[#1A1715]">
          SPEC-PLATE 01
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Simple Definition */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#C83226] block">
            DEFINITIVE SPECIFICATION
          </span>
          <p className="font-mono text-sm sm:text-base font-bold text-[#1A1715] leading-relaxed">
            {data.definition}
          </p>
        </div>

        {/* Why Exists & Problem Solved (Two Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Why Does This Concept Exist? */}
          <div className="p-3.5 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-1.5 text-[#1848B8]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                WHY DOES THIS CONCEPT EXIST?
              </span>
            </div>
            <p className="font-mono text-xs text-[#5C544B] leading-relaxed">
              {data.whyExists}
            </p>
          </div>

          {/* What Problem Does It Solve? */}
          <div className="p-3.5 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-1.5 text-[#33634B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                WHAT PROBLEM DOES IT SOLVE?
              </span>
            </div>
            <p className="font-mono text-xs text-[#5C544B] leading-relaxed">
              {data.problemSolved}
            </p>
          </div>
        </div>

        {/* Primary Mathematical Hypothesis / Formulation */}
        {data.primaryFormula && (
          <div className="space-y-1.5 pt-1">
            <FormulaPlate
              latex={data.primaryFormula.latex}
              label={data.primaryFormula.label}
              displayMode={true}
              className="border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]"
            />
            {data.primaryFormula.explanation && (
              <p className="font-mono text-[10px] text-[#5C544B] px-1 italic">
                * {data.primaryFormula.explanation}
              </p>
            )}
          </div>
        )}

        {/* Key Characteristics Checklist */}
        <div className="pt-2 border-t border-[#D8CFC0] space-y-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1A1715] block">
            CORE INDUCTIVE CHARACTERISTICS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.keyCharacteristics.map((trait, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#E8E1D3]/40 border border-[#1A1715] flex items-start gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#33634B] shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] text-[#1A1715] leading-snug">
                  {trait}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
