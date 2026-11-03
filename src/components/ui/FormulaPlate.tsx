'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';

interface FormulaPlateProps {
  latex: string;
  label?: string;
  displayMode?: boolean;
  className?: string;
}

export const FormulaPlate: React.FC<FormulaPlateProps> = ({
  latex,
  label,
  displayMode = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
        });
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerText = latex;
        }
      }
    }
  }, [latex, displayMode]);

  return (
    <div
      className={cn(
        'relative p-3 bg-[#E8E1D3]/60 border-y-[1.5px] border-[#1A1715] select-text',
        className
      )}
    >
      {label && (
        <span className="absolute top-1 left-2 font-mono text-[9px] uppercase tracking-widest font-bold text-[#C83226]">
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        className={cn(
          'overflow-x-auto overflow-y-hidden text-[#1A1715]',
          label ? 'pt-3' : 'pt-0'
        )}
      />
    </div>
  );
};
