'use client';

import React, { useState, useEffect } from 'react';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { X, Sparkles, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [level, setLevel] = useState<string>('undergrad');
  const [goal, setGoal] = useState<string>('intuition');
  const [time, setTime] = useState<string>('30min');

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('ml_in_motion_onboarded_v1');
    if (hasOnboarded && isOpen) {
      // already onboarded
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    localStorage.setItem(
      'ml_in_motion_onboarded_v1',
      JSON.stringify({ level, goal, time, timestamp: new Date().toISOString() })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1715]/60 p-4 backdrop-blur-none">
      <div className="w-full max-w-lg bg-[#FAF7F0] border-[2px] border-[#1A1715] shadow-[6px_6px_0px_#1A1715] p-5 space-y-4">
        <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1715] pb-2">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#C83226] tracking-widest">
              INITIAL CALIBRATION
            </span>
            <h2 className="font-mono text-xl font-black text-[#1A1715]">
              Personalize Your Lab Instrument
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-[#1A1715] bg-[#E8E1D3] hover:bg-[#F0EAE0]"
          >
            <X className="w-4 h-4 text-[#1A1715]" />
          </button>
        </div>

        {/* Level */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold text-[#1A1715] block uppercase">
            1. WHAT IS YOUR CURRENT ML LEVEL?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'beginner', label: 'Complete Beginner' },
              { id: 'undergrad', label: 'Undergrad / CS' },
              { id: 'gate', label: 'GATE DA Aspirant' },
              { id: 'interview', label: 'Interview Prep' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLevel(opt.id)}
                className={`p-2 text-left border-[1.5px] font-mono text-xs ${
                  level === opt.id
                    ? 'bg-[#1848B8] text-white border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold text-[#1A1715] block uppercase">
            2. PRIMARY LEARNING GOAL:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'intuition', label: 'Visual Intuition' },
              { id: 'math', label: 'Mathematical Rigor' },
              { id: 'code', label: 'Code & Execution' },
              { id: 'failure', label: 'Failure Diagnostics' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGoal(opt.id)}
                className={`p-2 text-left border-[1.5px] font-mono text-xs ${
                  goal === opt.id
                    ? 'bg-[#C83226] text-white border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Session Time */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold text-[#1A1715] block uppercase">
            3. TARGET TIME PER SESSION:
          </label>
          <div className="flex gap-2">
            {['15min', '30min', '60min'].map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`flex-1 p-2 border-[1.5px] font-mono text-xs font-bold uppercase ${
                  time === t
                    ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t-[1.5px] border-[#1A1715] flex items-center justify-between">
          <button
            onClick={onClose}
            className="font-mono text-xs text-[#5C544B] hover:text-[#1A1715] underline"
          >
            SKIP CALIBRATION
          </button>
          <AnalogButton variant="primary" size="md" onClick={handleFinish}>
            CALIBRATE & ENTER
          </AnalogButton>
        </div>
      </div>
    </div>
  );
};
