'use client';

import React, { useState } from 'react';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleResetStorage = () => {
    if (confirm('Reset guest progress and clear stored experiments?')) {
      localStorage.clear();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1715]/60 p-4">
      <div className="w-full max-w-md bg-[#FAF7F0] border-[2px] border-[#1A1715] shadow-[5px_5px_0px_#1A1715] p-5 space-y-4">
        <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1715] pb-2">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#C83226]">
              HARDWARE SETTINGS
            </span>
            <h3 className="font-mono text-lg font-bold text-[#1A1715]">
              Instrument Calibration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-[#1A1715] bg-[#E8E1D3]"
          >
            <X className="w-4 h-4 text-[#1A1715]" />
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#1A1715]">
            <div>
              <span className="font-bold text-[#1A1715] block">REDUCED MOTION</span>
              <span className="text-[10px] text-[#5C544B]">Disable spring physics & sweeps</span>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-6 h-6 border-[1.5px] border-[#1A1715] flex items-center justify-center font-bold ${
                reducedMotion ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
              }`}
            >
              {reducedMotion ? <Check className="w-4 h-4" /> : null}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF7F0] border border-[#1A1715]">
            <div>
              <span className="font-bold text-[#1A1715] block">HIGH CONTRAST</span>
              <span className="text-[10px] text-[#5C544B]">Enforce pure black line-weights</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-6 h-6 border-[1.5px] border-[#1A1715] flex items-center justify-center font-bold ${
                highContrast ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
              }`}
            >
              {highContrast ? <Check className="w-4 h-4" /> : null}
            </button>
          </div>

          <div className="p-3 bg-[#C83226]/10 border border-[#C83226] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#C83226] block">FACTORY RESET PROGRESS</span>
              <span className="text-[10px] text-[#5C544B]">Clear local storage audit logs</span>
            </div>
            <button
              onClick={handleResetStorage}
              className="px-2 py-1 bg-[#FAF7F0] border border-[#C83226] text-[#C83226] font-bold uppercase text-[10px] hover:bg-[#C83226] hover:text-white"
            >
              {resetSuccess ? 'CLEARED' : 'RESET'}
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#D8CFC0] flex justify-end">
          <AnalogButton variant="secondary" size="sm" onClick={onClose}>
            CLOSE
          </AnalogButton>
        </div>
      </div>
    </div>
  );
};
