'use client';

import React from 'react';
import { ConceptImplementationCard } from '@/types/conceptCards';
import { CodeReader } from '@/components/ui/CodeReader';
import { Terminal, Sliders, Cpu, CheckCircle } from 'lucide-react';

interface CardImplementationProps {
  data: ConceptImplementationCard;
  conceptTitle: string;
}

export const CardImplementation: React.FC<CardImplementationProps> = ({
  data,
  conceptTitle,
}) => {
  const codeLines = data.codeSnippet.split('\n');

  return (
    <article
      id="card-implementation"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 05 // REAL-LIFE IMPLEMENTATION & CODE
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#1848B8] font-bold">
          <Terminal className="w-3 h-3" />
          <span>PYTHON / SCIKIT-LEARN</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Scenario Overview */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1848B8]">
              INDUSTRY APPLICATION
            </span>
            <span className="text-[#948B7D] font-mono text-[10px]">/</span>
            <span className="font-mono text-[11px] font-bold text-[#1A1715]">
              {data.industryTitle}
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] leading-relaxed">
            {data.realWorldScenario}
          </p>
        </div>

        {/* Inputs & Outputs Specification Plate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#F4EFE4] border-[1.5px] border-[#1A1715]">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase font-black text-[#1848B8] block">
              INPUT SPECIFICATION (FEATURES X):
            </span>
            <p className="font-mono text-xs text-[#5C544B] leading-snug">
              {data.inputsSpecs}
            </p>
          </div>
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#D8CFC0] pt-2 md:pt-0 md:pl-3">
            <span className="font-mono text-[9px] uppercase font-black text-[#33634B] block">
              OUTPUT SPECIFICATION (TARGET Y / DERIVED):
            </span>
            <p className="font-mono text-xs text-[#5C544B] leading-snug">
              {data.outputsSpecs}
            </p>
          </div>
        </div>

        {/* Critical Hyperparameters Specification Table */}
        {data.keyHyperparameters && data.keyHyperparameters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[#1A1715]">
              <Sliders className="w-3.5 h-3.5 text-[#E28C05]" />
              <span className="font-mono text-[10px] uppercase font-black tracking-wider">
                CRITICAL TUNING HYPERPARAMETERS:
              </span>
            </div>

            <div className="border border-[#1A1715] overflow-x-auto bg-[#F4EFE4]">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="bg-[#E8E1D3] border-b border-[#1A1715] text-[#1A1715]">
                    <th className="p-2 font-bold">HYPERPARAMETER</th>
                    <th className="p-2 font-bold">TYPE</th>
                    <th className="p-2 font-bold">DEFAULT</th>
                    <th className="p-2 font-bold">ROLE & IMPACT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CFC0]">
                  {data.keyHyperparameters.map((param) => (
                    <tr key={param.name} className="hover:bg-[#FAF7F0]">
                      <td className="p-2 font-bold text-[#1848B8]">{param.name}</td>
                      <td className="p-2 text-[#5C544B]">{param.type}</td>
                      <td className="p-2 text-[#1A1715] font-semibold">{param.defaultVal}</td>
                      <td className="p-2 text-[#5C544B]">{param.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Python Code Reader */}
        <div className="space-y-2">
          <CodeReader
            codeLines={codeLines}
            language="python"
            title={`EXECUTION SCRIPT // ${conceptTitle.toUpperCase()}`}
          />
          <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715] text-[11px] font-mono text-[#5C544B] space-y-1">
            <span className="font-bold text-[#1A1715] uppercase text-[9px] block">
              ENGINEERING PERSPECTIVE:
            </span>
            <p className="leading-relaxed">{data.codeExplanation}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
