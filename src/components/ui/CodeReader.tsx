'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

interface CodeReaderProps {
  codeLines: string[];
  activeLineNumber?: number; // 1-indexed
  language?: string;
  title?: string;
  className?: string;
}

export const CodeReader: React.FC<CodeReaderProps> = ({
  codeLines,
  activeLineNumber,
  language = 'python',
  title = 'EXECUTION KERNEL // PYTHON NUMPY',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] overflow-hidden',
        className
      )}
    >
      {/* Header Plate */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#1A1715]">
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 font-mono text-[10px] text-[#5C544B] hover:text-[#1A1715] px-1.5 py-0.5 border border-[#1A1715] bg-[#FAF7F0] active:translate-x-[1px] active:translate-y-[1px]"
          title="Copy Code"
        >
          {copied ? <Check className="w-3 h-3 text-[#33634B]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      {/* Code Rows */}
      <div className="py-2 overflow-x-auto font-mono text-[12px] leading-relaxed select-text bg-[#FAF7F0]">
        {codeLines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLineNumber;

          return (
            <div
              key={lineNum}
              className={cn(
                'flex items-center gap-3 px-3 py-0.5 font-mono text-xs border-l-[3px] transition-colors duration-100',
                isActive
                  ? 'bg-[#E28C05]/25 border-l-[#C83226] text-[#1A1715] font-semibold'
                  : 'border-l-transparent text-[#5C544B]'
              )}
            >
              <span className="w-6 text-right text-[#948B7D] select-none text-[11px] tnum">
                {lineNum}
              </span>
              <code className="whitespace-pre flex-1 text-[#1A1715]">{line || ' '}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
};
