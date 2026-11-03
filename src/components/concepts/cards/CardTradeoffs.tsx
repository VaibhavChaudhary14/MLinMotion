'use client';

import React from 'react';
import { ConceptTradeoffsCard } from '@/types/conceptCards';
import { PlusCircle, MinusCircle, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';

interface CardTradeoffsProps {
  data: ConceptTradeoffsCard;
}

export const CardTradeoffs: React.FC<CardTradeoffsProps> = ({ data }) => {
  return (
    <article
      id="card-tradeoffs"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 06 // ADVANTAGES, LIMITATIONS & FAILURE MODES
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#C83226] font-bold">
          <AlertTriangle className="w-3 h-3" />
          <span>DIAGNOSTIC AUDIT</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Strengths & Limitations Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D8CFC0] pb-2 text-[#33634B]">
              <PlusCircle className="w-4 h-4" />
              <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-tight text-[#1A1715]">
                STRENGTHS & CAPABILITIES
              </h4>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#5C544B]">
              {data.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#33634B] font-bold shrink-0 mt-0.5">[+]</span>
                  <span className="leading-snug">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="p-4 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D8CFC0] pb-2 text-[#C83226]">
              <MinusCircle className="w-4 h-4" />
              <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-tight text-[#1A1715]">
                BOTTLENECKS & LIMITATIONS
              </h4>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#5C544B]">
              {data.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C83226] font-bold shrink-0 mt-0.5">[-]</span>
                  <span className="leading-snug">{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fundamental Assumptions */}
        <div className="p-4 bg-[#E8E1D3]/50 border-[1.5px] border-[#1A1715] space-y-2.5">
          <div className="flex items-center gap-1.5 text-[#1848B8]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase font-black tracking-wider">
              FUNDAMENTAL MATHEMATICAL ASSUMPTIONS:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.fundamentalAssumptions.map((assump, idx) => (
              <div key={idx} className="flex items-start gap-1.5 font-mono text-[11px] text-[#1A1715]">
                <span className="w-1.5 h-1.5 bg-[#1848B8] mt-1.5 shrink-0" />
                <span className="leading-snug">{assump}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pathology Failure Modes */}
        {data.failureModes && data.failureModes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[#C83226]">
              <Wrench className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                COMMON PATHOLOGICAL FAILURE MODES & FIXES:
              </span>
            </div>

            <div className="space-y-3">
              {data.failureModes.map((fm, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] space-y-2 font-mono text-xs"
                >
                  <div className="flex items-start gap-2 text-[#C83226] font-bold">
                    <span className="px-1 py-0.2 bg-[#C83226]/10 border border-[#C83226] text-[9px] uppercase shrink-0">
                      SYMPTOM 0{idx + 1}
                    </span>
                    <span>{fm.symptom}</span>
                  </div>

                  <div className="pl-2 border-l-2 border-[#D8CFC0] space-y-1 text-[#5C544B] text-[11px]">
                    <div>
                      <strong className="text-[#1A1715] uppercase text-[9px] block">
                        UNDERLYING REASON:
                      </strong>
                      <span>{fm.underlyingReason}</span>
                    </div>
                    <div className="text-[#33634B]">
                      <strong className="text-[#33634B] uppercase text-[9px] block">
                        DIAGNOSTIC REMEDY:
                      </strong>
                      <span>{fm.fix}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
