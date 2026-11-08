'use client';

import React, { useState, useEffect } from 'react';
import {
  loadLearningProfile,
  calculateProfileStats,
  exportLearningProfileJson,
  clearLearningProfile,
} from '@/lib/learning/storage';
import type { LocalLearningProfile } from '@/lib/learning/types';
import { AnalogButton } from '@/components/ui/AnalogButton';
import {
  Award,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface LearningAnalyticsCardProps {
  algorithmFilter?: 'gradient-descent' | 'kmeans';
  onProfileUpdated?: () => void;
}

export const LearningAnalyticsCard: React.FC<LearningAnalyticsCardProps> = ({
  algorithmFilter,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<LocalLearningProfile | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  useEffect(() => {
    setProfile(loadLearningProfile());
  }, []);

  const refreshProfile = () => {
    const updated = loadLearningProfile();
    setProfile(updated);
    if (onProfileUpdated) onProfileUpdated();
  };

  if (!profile) return null;

  const stats = calculateProfileStats(profile);

  const filteredPredictions = algorithmFilter
    ? profile.predictions.filter((p) => p.algorithmId === algorithmFilter)
    : profile.predictions;

  const filteredChallenges = algorithmFilter
    ? Object.values(profile.challenges).filter((c) => c.algorithmId === algorithmFilter)
    : Object.values(profile.challenges);

  const handleExportJson = () => {
    const json = exportLearningProfileJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mlinmotion-learning-records-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearLearningProfile();
    setConfirmClear(false);
    refreshProfile();
  };

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] p-4 space-y-4 font-mono text-xs">
      {/* Title & Privacy Assurance */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1A1715]/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#1848B8]" />
          <span className="font-bold uppercase tracking-wider text-[#1A1715]">
            LOCAL LEARNING LEDGER
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#33634B] bg-[#33634B]/10 px-2 py-0.5 border border-[#33634B]">
          <ShieldCheck className="w-3 h-3" />
          <span>100% LOCAL LEDGER // ZERO CLOUD PROFILE</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20">
          <span className="text-[10px] text-[#1A1715]/60 uppercase block">Predictions Made</span>
          <span className="text-base font-bold text-[#1A1715]">{filteredPredictions.length}</span>
        </div>

        <div className="p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20">
          <span className="text-[10px] text-[#1A1715]/60 uppercase block">Prediction Accuracy</span>
          <span className="text-base font-bold text-[#1848B8]">{stats.accuracyRate}%</span>
        </div>

        <div className="p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20">
          <span className="text-[10px] text-[#1A1715]/60 uppercase block">Verified Correct</span>
          <span className="text-base font-bold text-[#33634B]">
            {filteredPredictions.filter((p) => p.status === 'correct').length}
          </span>
        </div>

        <div className="p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20">
          <span className="text-[10px] text-[#1A1715]/60 uppercase block">Challenges Solved</span>
          <span className="text-base font-bold text-[#C83226]">
            {filteredChallenges.filter((c) => c.completed).length} / {filteredChallenges.length}
          </span>
        </div>
      </div>

      {/* Export & Clear Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1A1715]/20">
        <div className="text-[10px] text-[#1A1715]/60">
          Stored strictly in browser localStorage ({profile.predictions.length} attempts, {profile.bypassesCount || 0} bypasses). Platform telemetry handled separately via Vercel Analytics.
        </div>

        <div className="flex items-center gap-2">
          <AnalogButton
            onClick={handleExportJson}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 text-[11px]"
          >
            <Download className="w-3 h-3" /> Export JSON
          </AnalogButton>

          <AnalogButton
            onClick={handleClear}
            variant={confirmClear ? 'primary' : 'ghost'}
            size="sm"
            className="flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3" /> {confirmClear ? 'Confirm Reset?' : 'Clear History'}
          </AnalogButton>
        </div>
      </div>
    </div>
  );
};
