'use client';

import React from 'react';
import { ConceptHowItWorksCard } from '@/types/conceptCards';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { Activity, ArrowRight, CornerDownRight } from 'lucide-react';

interface CardHowItWorksProps {
  data: ConceptHowItWorksCard;
}

export const CardHowItWorks: React.FC<CardHowItWorksProps> = ({ data }) => {
  return (
    <article
      id="card-how-it-works"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 02 // HOW DOES IT WORK?
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#5C544B] bg-[#FAF7F0] px-1.5 py-0.5 border border-[#1A1715]">
          EXECUTION PIPELINE
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Headline */}
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1848B8] block mb-1">
            MECHANICAL ARCHITECTURE
          </span>
          <h3 className="font-mono text-base sm:text-lg font-black text-[#1A1715] tracking-tight">
            {data.headline}
          </h3>
        </div>

        {/* Step-by-Step Mechanical Flow */}
        <div className="space-y-4">
          {data.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-2.5"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#1A1715] text-[#FAF7F0] font-mono text-[10px] font-black flex items-center justify-center">
                    0{step.stepNumber}
                  </span>
                  <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-tight text-[#1A1715]">
                    {step.title}
                  </h4>
                </div>
                {step.diagramNote && (
                  <span className="hidden sm:inline-block font-mono text-[9px] text-[#5C544B] bg-[#E8E1D3] px-1.5 py-0.5 border border-[#1A1715]">
                    {step.diagramNote}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-mono text-xs text-[#5C544B] leading-relaxed">
                {step.description}
              </p>

              {/* Optional Math Step Details */}
              {step.mathDetail && (
                <div className="pt-1">
                  <FormulaPlate
                    latex={step.mathDetail}
                    displayMode={false}
                    className="py-1 px-2.5 text-xs bg-[#FAF7F0] border border-[#1A1715]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Core Loop Summary Plate */}
        <div className="p-3.5 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] flex items-start gap-3">
          <Activity className="w-4 h-4 text-[#1848B8] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase font-black tracking-wider text-[#1A1715] block">
              ALGORITHMIC INVARIANT / CORE CONVERGENCE LOOP
            </span>
            <p className="font-mono text-xs text-[#5C544B] leading-relaxed">
              {data.coreLoopSummary}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
