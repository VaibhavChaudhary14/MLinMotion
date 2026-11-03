import React from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface TapeCounterProps {
  currentStep: number;
  totalSteps: number;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  onStepForward?: () => void;
  onStepBack?: () => void;
  onReset?: () => void;
  speedMs?: number;
  onSpeedChange?: (speed: number) => void;
  className?: string;
  label?: string;
}

export const TapeCounter: React.FC<TapeCounterProps> = ({
  currentStep,
  totalSteps,
  isPlaying = false,
  onPlayToggle,
  onStepForward,
  onStepBack,
  onReset,
  speedMs = 700,
  onSpeedChange,
  className,
  label = 'TAPE COUNTER',
}) => {
  // Format step as 3-digit padded number like an electro-mechanical odometer: "001"
  const formattedCurrent = String(Math.max(0, currentStep)).padStart(3, '0');
  const formattedTotal = String(Math.max(0, totalSteps)).padStart(3, '0');

  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-3 p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] select-none',
        className
      )}
    >
      {/* Label and Chassis */}
      <div className="flex flex-col">
        <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-[#5C544B] px-0.5">
          {label}
        </span>
        {/* Mechanical Black Readout Module */}
        <div className="flex items-center bg-[#1A1715] text-[#FAF7F0] px-3 py-1 border-[1px] border-[#1A1715] shadow-[inset_1.5px_1.5px_0px_rgba(0,0,0,0.6)]">
          <span className="font-mono text-lg font-bold tracking-widest text-[#FAF7F0] tnum">
            {formattedCurrent}
          </span>
          <span className="font-mono text-xs text-[#948B7D] mx-1.5">/</span>
          <span className="font-mono text-xs text-[#948B7D] tnum font-semibold">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* 36x36px Square Mechanical Toggle Push-Buttons */}
      <div className="flex items-center gap-1.5 pt-3">
        {onReset && (
          <button
            onClick={onReset}
            title="Reset to Iteration 0"
            className="w-9 h-9 flex items-center justify-center bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#F0EAE0]"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}

        {onStepBack && (
          <button
            onClick={onStepBack}
            disabled={currentStep <= 0}
            title="Step Backward"
            className="w-9 h-9 flex items-center justify-center bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#F0EAE0] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}

        {onPlayToggle && (
          <button
            onClick={onPlayToggle}
            title={isPlaying ? 'Pause Simulation' : 'Run Simulation'}
            className={cn(
              'w-9 h-9 flex items-center justify-center border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-colors',
              isPlaying
                ? 'bg-[#E28C05] text-[#1A1715] hover:bg-[#c97c03]'
                : 'bg-[#C83226] text-[#FAF7F0] hover:bg-[#b0291f]'
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 stroke-[2.4] fill-current" />
            ) : (
              <Play className="w-4 h-4 stroke-[2.4] fill-current ml-0.5" />
            )}
          </button>
        )}

        {onStepForward && (
          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps}
            title="Step Forward"
            className="w-9 h-9 flex items-center justify-center bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#F0EAE0] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* Speed Dial Switch */}
      {onSpeedChange && (
        <div className="flex flex-col pt-0.5 pl-1">
          <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-[#5C544B]">
            STEP SPEED
          </span>
          <div className="flex items-center gap-1 mt-1">
            {[
              { label: '0.5x', ms: 1200 },
              { label: '1x', ms: 700 },
              { label: '2x', ms: 300 },
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => onSpeedChange(spd.ms)}
                className={cn(
                  'font-mono text-[10px] px-1.5 py-0.5 border-[1px] border-[#1A1715]',
                  speedMs === spd.ms
                    ? 'bg-[#1848B8] text-[#FAF7F0] font-bold shadow-[1px_1px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                )}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
