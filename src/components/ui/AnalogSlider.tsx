import React from 'react';
import { cn } from '@/lib/utils';

interface AnalogSliderProps {
  label: string;
  symbol?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  className?: string;
  helpText?: string;
}

export const AnalogSlider: React.FC<AnalogSliderProps> = ({
  label,
  symbol,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  className,
  helpText,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-1.5 p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {symbol && (
            <span className="font-mono text-xs font-bold text-[#C83226] bg-[#E8E1D3] px-1 py-0.5 border border-[#1A1715]">
              {symbol}
            </span>
          )}
          <label className="font-mono text-xs font-bold text-[#1A1715] tracking-tight uppercase">
            {label}
          </label>
        </div>
        {/* Physical Readout Badge */}
        <div className="bg-[#1A1715] text-[#FAF7F0] px-2 py-0.5 font-mono text-xs font-bold tnum border border-[#1A1715]">
          {value}
          {unit && <span className="text-[#948B7D] ml-0.5 text-[10px]">{unit}</span>}
        </div>
      </div>

      {/* Grooved Potentiometer Slot */}
      <div className="relative flex items-center h-8 cursor-pointer select-none">
        {/* Recessed Track */}
        <div className="w-full h-2.5 bg-[#D8CFC0] border-[1.5px] border-[#1A1715] shadow-[inset_1.5px_1.5px_0px_rgba(26,23,21,0.25)] relative">
          {/* Active Fill */}
          <div
            className="h-full bg-[#1848B8]"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>

        {/* Hidden Native Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Rectangular 16x24px Mechanical Thumb with 3 debossed grip ribs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 w-4 h-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] flex flex-col justify-center items-center gap-0.5 -ml-2"
          style={{ left: `${Math.min(100, Math.max(0, percentage))}%` }}
        >
          <span className="w-2 h-[1.5px] bg-[#1A1715]" />
          <span className="w-2 h-[1.5px] bg-[#1A1715]" />
          <span className="w-2 h-[1.5px] bg-[#1A1715]" />
        </div>
      </div>

      {helpText && (
        <span className="font-mono text-[10px] text-[#5C544B] leading-tight">
          {helpText}
        </span>
      )}
    </div>
  );
};
