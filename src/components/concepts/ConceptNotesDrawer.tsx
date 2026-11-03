'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';

interface ConceptNotesDrawerProps {
  conceptId: string;
  conceptTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptNotesDrawer: React.FC<ConceptNotesDrawerProps> = ({
  conceptId,
  conceptTitle,
  isOpen,
  onClose,
}) => {
  const [note, setNote] = useState<string>('');
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`concept_note_${conceptId}`) || '';
      setNote(stored);
    }
  }, [conceptId]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`concept_note_${conceptId}`, note);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1715]/50 backdrop-blur-[1px] p-4">
      <div className="w-full max-w-lg bg-[#FAF7F0] border-[2px] border-[#1A1715] shadow-[6px_6px_0px_#1A1715] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#C83226]" />
            <span className="font-mono text-xs uppercase font-bold text-[#1A1715]">
              PERSONAL LABORATORY NOTES // {conceptTitle.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 border border-[#1A1715] bg-[#FAF7F0] flex items-center justify-center hover:bg-[#F0EAE0]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3 font-mono">
          <p className="text-[11px] text-[#5C544B] leading-relaxed">
            Record personal derivations, experiment observations, hyperparameters, and questions. Notes are automatically persisted in local device memory.
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your study notes, insights, derivations, or questions here..."
            rows={8}
            className="w-full p-3 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] text-xs font-mono text-[#1A1715] focus:outline-none focus:ring-1 focus:ring-[#1848B8] resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#948B7D]">
              {savedStatus ? 'Saved to local storage ✔' : `${note.length} characters`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-[#E8E1D3] text-[#1A1715] text-xs font-bold uppercase border border-[#1A1715]"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#1848B8] text-[#FAF7F0] text-xs font-bold uppercase border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#133aa0] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
