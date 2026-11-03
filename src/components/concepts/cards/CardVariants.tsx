'use client';

import React from 'react';
import { ConceptVariantsCard } from '@/types/conceptCards';
import { Badge } from '@/components/ui/Badge';
import { GitBranch, Check, AlertCircle } from 'lucide-react';

interface CardVariantsProps {
  data: ConceptVariantsCard;
}

export const CardVariants: React.FC<CardVariantsProps> = ({ data }) => {
  return (
    <article
      id="card-variants"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#33634B] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 04 // TYPES, METHODS & ALGORITHM VARIANTS
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#33634B] font-bold">
          <GitBranch className="w-3 h-3" />
          <span>TAXONOMY MAP</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Summary Description */}
        <p className="font-mono text-xs sm:text-sm text-[#5C544B] leading-relaxed">
          {data.summary}
        </p>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.variants.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col justify-between space-y-3"
            >
              {/* Variant Header */}
              <div className="space-y-1.5 border-b border-[#D8CFC0] pb-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-mono text-xs sm:text-sm font-bold text-[#1A1715] tracking-tight">
                    {v.name}
                  </h4>
                  <Badge variant={v.badgeVariant} size="sm">
                    {v.tag}
                  </Badge>
                </div>
              </div>

              {/* How it differs */}
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase font-black text-[#5C544B] block">
                  DISTINGUISHING MECHANISM:
                </span>
                <p className="font-mono text-xs text-[#1A1715] leading-relaxed">
                  {v.howItDiffers}
                </p>
              </div>

              {/* Ideal Use Case */}
              <div className="p-2 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-1">
                <div className="flex items-center gap-1 text-[#33634B]">
                  <Check className="w-3 h-3" />
                  <span className="font-mono text-[9px] uppercase font-black">
                    IDEAL USE CASE:
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#5C544B] leading-snug">
                  {v.idealUseCase}
                </p>
              </div>

              {/* Drawback */}
              {v.drawback && (
                <div className="flex items-start gap-1.5 text-[10px] font-mono text-[#C83226]">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  <span className="leading-snug">{v.drawback}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
