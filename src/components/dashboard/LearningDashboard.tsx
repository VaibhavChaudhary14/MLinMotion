'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import {
  STRUCTURED_LEARNING_PATHS,
  LearningPath,
  PathProgressSummary,
} from '@/lib/learning/paths';
import { CONCEPT_GRAPH, ConceptNode } from '@/lib/learning/concepts';
import {
  loadLearningProfile,
  updateActiveLearningPath,
  getPathProgressSummary,
  recalculateAllConceptMastery,
  calculateProfileStats,
} from '@/lib/learning/storage';
import type { LocalLearningProfile } from '@/lib/learning/types';
import { getActiveRevisionQueue, RevisionItem } from '@/lib/learning/revision';
import { PracticeModal } from './PracticeModal';
import {
  Play,
  Film,
  FlaskConical,
  Database,
  GitCompare,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Award,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Layers,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const LearningDashboard: React.FC = () => {
  const [profile, setProfile] = useState<LocalLearningProfile | null>(null);
  const [activePathId, setActivePathId] = useState<string>('path-optimization');
  const [revisionQueue, setRevisionQueue] = useState<RevisionItem[]>([]);
  const [practiceModalConcept, setPracticeModalConcept] = useState<{ id: string; name: string } | null>(null);

  const refreshProfileData = () => {
    const loaded = loadLearningProfile();
    // Run mastery evaluation pass to ensure consistency
    const updated = recalculateAllConceptMastery(loaded);
    setProfile(updated);
    setActivePathId(updated.activePathId || 'path-optimization');
    setRevisionQueue(
      getActiveRevisionQueue(updated.revisionSchedule || {}, updated.conceptMastery || {})
    );
  };

  useEffect(() => {
    refreshProfileData();
  }, []);

  if (!profile) return null;

  const activePath = STRUCTURED_LEARNING_PATHS[activePathId] || STRUCTURED_LEARNING_PATHS['path-optimization'];
  const pathProgress = getPathProgressSummary(activePath.id, profile);
  const profileStats = calculateProfileStats(profile);

  const handleSelectPath = (pathId: string) => {
    setActivePathId(pathId);
    updateActiveLearningPath(pathId);
  };

  const nextConceptId = pathProgress.nextRecommendedConceptId;
  const nextConcept = nextConceptId ? CONCEPT_GRAPH[nextConceptId] : null;

  return (
    <div className="space-y-6">
      {/* Hero Studio Banner */}
      <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              STRUCTURED LEARNING PATHS & CONCEPT MASTERY
            </span>
          </div>
          <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
            Machine Learning Laboratory Dashboard
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] max-w-2xl mt-1 leading-relaxed">
            Connect mathematical prerequisites, interactive workbench simulations, prediction checkpoints, and spaced revision into a structured learning journey.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <Link href="/cinema/gradient-descent">
            <AnalogButton variant="primary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>OPTIMIZATION BENCH</span>
            </AnalogButton>
          </Link>
          <Link href="/cinema">
            <AnalogButton variant="secondary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Film className="w-4 h-4" />
              <span>K-MEANS BENCH</span>
            </AnalogButton>
          </Link>
        </div>
      </div>

      {/* Structured Path Selector Bar */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 shadow-[3px_3px_0px_#1A1715]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A1715]/20 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1848B8]" />
            <span className="font-bold uppercase tracking-wider text-[#1A1715]">
              ACTIVE LEARNING PATHWAY
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#33634B] bg-[#33634B]/10 px-2 py-0.5 border border-[#33634B]">
            <ShieldCheck className="w-3 h-3" />
            <span>100% LOCAL LEDGER // ZERO CLOUD PROFILE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.values(STRUCTURED_LEARNING_PATHS).map((path) => {
            const isSelected = path.id === activePathId;
            const progress = getPathProgressSummary(path.id, profile);
            return (
              <button
                key={path.id}
                onClick={() => handleSelectPath(path.id)}
                className={`p-2.5 text-left font-mono border-[1.5px] transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1848B8]/10 border-[#1848B8] shadow-[2px_2px_0px_#1848B8]'
                    : 'bg-[#F4EFE4] border-[#1A1715] hover:bg-[#E8E1D3]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase text-[#1A1715]/70">
                      {path.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#1848B8]">
                      {progress.percentComplete}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1715] leading-snug line-clamp-2">
                    {path.title}
                  </h4>
                </div>
                <div className="w-full bg-[#D8CFC0] h-1.5 border border-[#1A1715] mt-2">
                  <div
                    className="h-full bg-[#1848B8]"
                    style={{ width: `${progress.percentComplete}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Next Recommendation & Modules */}
        <div className="lg:col-span-8 space-y-6">
          {/* Priority Activity: Recommended Next Concept */}
          {nextConcept && (
            <AnalogCard
              variant="card"
              headerEyebrow="DETERMINISTIC KNOWLEDGE GRAPH RECOMMENDATION"
              headerTitle="NEXT LOGICAL CONCEPT TO MASTER"
              headerAction={<Badge variant="vermilion">PRIORITY STEP</Badge>}
            >
              <div className="p-4 bg-[#E8E1D3]/50 border-[1.5px] border-[#1A1715] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#1848B8] tracking-widest">
                      {nextConcept.subject.toUpperCase()} // {nextConcept.difficulty.toUpperCase()}
                    </span>
                    {nextConcept.prerequisites.length > 0 && (
                      <span className="text-[9px] text-[#33634B] bg-[#33634B]/10 px-1.5 py-0.5 border border-[#33634B]">
                        Prerequisites Satisfied ({nextConcept.prerequisites.length})
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#1A1715]">{nextConcept.name}</h3>
                  <p className="text-xs text-[#5C544B] leading-relaxed max-w-xl">
                    {nextConcept.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPracticeModalConcept({ id: nextConcept.id, name: nextConcept.name })}
                    className="font-mono text-xs font-bold uppercase px-3 py-2 border-[1.5px] border-[#1A1715] bg-[#FAF7F0] hover:bg-[#F4EFE4] shadow-[2px_2px_0px_#1A1715] flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Practice
                  </button>

                  <Link href={nextConcept.relatedSimulationUrl || '/cinema'}>
                    <AnalogButton variant="primary" size="md" className="flex items-center gap-1.5">
                      <span>LAUNCH BENCH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </AnalogButton>
                  </Link>
                </div>
              </div>
            </AnalogCard>
          )}

          {/* Active Path Modules & Concepts List */}
          <AnalogCard
            variant="card"
            headerEyebrow={activePath.category.toUpperCase()}
            headerTitle={`${activePath.title.toUpperCase()} // MODULE BREAKDOWN`}
          >
            <div className="space-y-5 font-mono">
              {activePath.modules.map((module, mIdx) => (
                <div key={module.id} className="border border-[#1A1715]/30 bg-[#FAF7F0] p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1A1715]/20 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#C83226] uppercase">
                        STAGE 0{mIdx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-[#1A1715]">{module.title}</h4>
                    </div>
                    <span className="text-[10px] text-[#5C544B]">
                      {module.conceptIds.length} Concepts
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5C544B] leading-relaxed">
                    {module.description}
                  </p>

                  <div className="space-y-2 pt-1">
                    {module.conceptIds.map((cId) => {
                      const concept = CONCEPT_GRAPH[cId];
                      if (!concept) return null;
                      const mastery = profile.conceptMastery?.[cId];
                      const state = mastery?.state || 'NOT_STARTED';

                      const badgeConfig = {
                        MASTERED: { bg: 'bg-[#33634B]/10 text-[#33634B] border-[#33634B]', label: 'MASTERED' },
                        DEVELOPING: { bg: 'bg-[#E28C05]/10 text-[#E28C05] border-[#E28C05]', label: 'DEVELOPING' },
                        NEEDS_REVISION: { bg: 'bg-[#C83226]/10 text-[#C83226] border-[#C83226]', label: 'NEEDS REVISION' },
                        IN_PROGRESS: { bg: 'bg-[#1848B8]/10 text-[#1848B8] border-[#1848B8]', label: 'IN PROGRESS' },
                        NOT_STARTED: { bg: 'bg-[#1A1715]/5 text-[#1A1715]/60 border-[#1A1715]/20', label: 'NOT STARTED' },
                      }[state];

                      return (
                        <div
                          key={cId}
                          className="p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${badgeConfig.bg}`}>
                                {badgeConfig.label}
                              </span>
                              <span className="text-xs font-bold text-[#1A1715]">
                                {concept.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#5C544B] block line-clamp-1">
                              {concept.summary}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setPracticeModalConcept({ id: concept.id, name: concept.name })}
                              className="text-[10px] font-bold px-2 py-1 border border-[#1A1715] bg-[#FAF7F0] hover:bg-[#E8E1D3]"
                            >
                              Practice
                            </button>
                            {concept.relatedSimulationUrl ? (
                              <Link
                                href={concept.relatedSimulationUrl}
                                className="text-[10px] font-bold px-2 py-1 border border-[#1A1715] bg-[#1848B8] text-white hover:bg-[#1848B8]/90"
                              >
                                Simulation →
                              </Link>
                            ) : (
                              <Link
                                href={`/concepts/${concept.id}`}
                                className="text-[10px] font-bold px-2 py-1 border border-[#1A1715] bg-[#FAF7F0] hover:bg-[#E8E1D3]"
                              >
                                Reading →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </AnalogCard>
        </div>

        {/* Right Column (4 cols): Mastery Gauges & Retention Scheduler */}
        <div className="lg:col-span-4 space-y-6 font-mono text-xs">
          {/* Concept Mastery Radar */}
          <AnalogCard
            variant="card"
            headerEyebrow="LOCAL LEDGER METRICS"
            headerTitle="ACTIVE PATH MASTERY GAUGE"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-[#F4EFE4] border border-[#1A1715]/20">
                <span className="text-[#5C544B] uppercase">Path Completion:</span>
                <span className="font-bold text-[#1848B8] text-sm">
                  {pathProgress.percentComplete}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#33634B]/10 border border-[#33634B]">
                  <span className="text-[10px] text-[#33634B] uppercase block">Mastered</span>
                  <span className="text-base font-bold text-[#33634B]">{pathProgress.masteredCount}</span>
                </div>
                <div className="p-2 bg-[#E28C05]/10 border border-[#E28C05]">
                  <span className="text-[10px] text-[#E28C05] uppercase block">Developing</span>
                  <span className="text-base font-bold text-[#E28C05]">{pathProgress.inProgressCount}</span>
                </div>
                <div className="p-2 bg-[#C83226]/10 border border-[#C83226]">
                  <span className="text-[10px] text-[#C83226] uppercase block">Needs Review</span>
                  <span className="text-base font-bold text-[#C83226]">{pathProgress.needsRevisionCount}</span>
                </div>
                <div className="p-2 bg-[#1A1715]/5 border border-[#1A1715]/20">
                  <span className="text-[10px] text-[#1A1715]/60 uppercase block">Not Started</span>
                  <span className="text-base font-bold text-[#1A1715]">{pathProgress.notStartedCount}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-[#5C544B] mb-1">
                  <span>PROGRESS ({pathProgress.masteredCount} / {pathProgress.totalConcepts} CONCEPTS)</span>
                  <span className="font-bold">{pathProgress.percentComplete}%</span>
                </div>
                <div className="w-full h-3 bg-[#D8CFC0] border border-[#1A1715] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.2)]">
                  <div
                    className="h-full bg-[#1848B8]"
                    style={{ width: `${pathProgress.percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#1A1715]/20 text-[10px] text-[#5C544B]">
                Predictions: {profileStats.totalPredictions} ({profileStats.accuracyRate}% acc) • Challenges: {profileStats.completedChallenges}
              </div>
            </div>
          </AnalogCard>

          {/* Spaced Repetition Queue */}
          <AnalogCard
            variant="card"
            headerEyebrow="SPACED REPETITION ENGINE"
            headerTitle="RETENTION REVIEW QUEUE"
            headerAction={
              <Badge variant={revisionQueue.length > 0 ? 'vermilion' : 'neutral'}>
                {revisionQueue.length} DUE
              </Badge>
            }
          >
            <div className="space-y-2.5">
              {revisionQueue.length === 0 ? (
                <div className="p-3 bg-[#33634B]/10 border border-[#33634B] text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-[#33634B] mx-auto" />
                  <span className="text-[11px] font-bold text-[#33634B] block">All concepts up to date!</span>
                  <span className="text-[10px] text-[#1A1715]/70 block">
                    No retention intervals have elapsed. Keep advancing on your path!
                  </span>
                </div>
              ) : (
                revisionQueue.map((item) => (
                  <div
                    key={item.conceptId}
                    className={`p-3 border-[1.5px] space-y-2 ${
                      item.urgency === 'overdue'
                        ? 'bg-[#C83226]/5 border-[#C83226] shadow-[2px_2px_0px_#C83226]'
                        : 'bg-[#E28C05]/5 border-[#E28C05] shadow-[2px_2px_0px_#E28C05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1715] text-xs">
                        {item.conceptName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                          item.urgency === 'overdue'
                            ? 'bg-[#C83226] text-white border-[#C83226]'
                            : 'bg-[#E28C05] text-white border-[#E28C05]'
                        }`}
                      >
                        {item.urgency.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#5C544B] leading-snug">
                      {item.reason}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setPracticeModalConcept({ id: item.conceptId, name: item.conceptName })}
                        className="text-[10px] font-bold text-[#1848B8] hover:underline flex items-center gap-1"
                      >
                        Practice Retrieval →
                      </button>

                      <Link href={item.recommendedAction.url}>
                        <span className="text-[10px] font-bold text-[#1A1715] underline">
                          Workbench
                        </span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AnalogCard>

          {/* Quick Laboratory Launchpad */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'DIAGNOSTIC QUIZ', href: '/quiz', icon: Award, color: '#C83226' },
              { title: 'K-MEANS CINEMA', href: '/cinema', icon: Film, color: '#1848B8' },
              { title: 'GD CINEMA', href: '/cinema/gradient-descent', icon: Play, color: '#C83226' },
              { title: 'DATA LAB', href: '/datalab', icon: Database, color: '#E28C05' },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="p-2.5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:shadow-[3px_3px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] transition-all flex flex-col items-center text-center gap-1.5 group"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center border border-[#1A1715]"
                    style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9px] font-bold text-[#1A1715] group-hover:text-[#C83226] uppercase">
                    {tool.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Practice Assessment Modal */}
      <PracticeModal
        conceptId={practiceModalConcept?.id || null}
        conceptName={practiceModalConcept?.name || ''}
        isOpen={practiceModalConcept !== null}
        onClose={() => setPracticeModalConcept(null)}
        onCompleted={refreshProfileData}
      />
    </div>
  );
};
