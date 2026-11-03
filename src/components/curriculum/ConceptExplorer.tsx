'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { Badge } from '@/components/ui/Badge';
import {
  getAllStagesList,
  getEssentialStages,
  getEvaluationStages,
  PLANNED_EXTENSIONS,
  isStageUnlocked,
  calculateEssentialCoreProgress,
  ConceptNode,
} from '@/lib/adaptive/conceptGraph';
import {
  getLearnerConceptStates,
  getAdaptiveRecommendations,
  Recommendation,
} from '@/lib/adaptive/recommender';
import { getBookmarks, toggleBookmark } from '@/lib/adaptive/bookmarks';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bookmark,
  Sparkles,
  Layers,
  Search,
  Clock,
  HelpCircle,
  GitFork,
  Compass,
} from 'lucide-react';

export const ConceptExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'prereqGraph' | 'planned'>('roadmap');
  const [layerFilter, setLayerFilter] = useState<'all' | 'essential' | 'evaluation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [conceptStates, setConceptStates] = useState<any>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const states = getLearnerConceptStates();
    setConceptStates(states);
    setBookmarks(getBookmarks());
    setRecommendations(getAdaptiveRecommendations());

    const handleUpdate = () => {
      const updatedStates = getLearnerConceptStates();
      setConceptStates(updatedStates);
      setBookmarks(getBookmarks());
      setRecommendations(getAdaptiveRecommendations());
    };

    window.addEventListener('bookmarks-updated', handleUpdate);
    window.addEventListener('concept-states-updated', handleUpdate);

    return () => {
      window.removeEventListener('bookmarks-updated', handleUpdate);
      window.removeEventListener('concept-states-updated', handleUpdate);
    };
  }, []);

  const handleToggleBookmark = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(lessonId);
    setBookmarks(getBookmarks());
  };

  const allStages = getAllStagesList();
  const essentialProgress = calculateEssentialCoreProgress(conceptStates);
  const topRec = recommendations[0];

  // Filtering stages
  const filteredStages = allStages.filter((stage) => {
    // Layer filter
    if (layerFilter === 'essential' && stage.layer !== 'essential') return false;
    if (layerFilter === 'evaluation' && stage.layer !== 'evaluation') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      stage.title.toLowerCase().includes(q) ||
      stage.stageCode.includes(q) ||
      stage.category.toLowerCase().includes(q) ||
      stage.description.toLowerCase().includes(q) ||
      stage.topicsCovered.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Calculate total real study minutes across 12 stages
  const totalCurriculumMinutes = allStages.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* 1. Master Curriculum Header & Essential 20% Progress Banner */}
      <div className="p-5 sm:p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8CFC0] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C83226] border border-[#1A1715]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              THE ESSENTIAL 20% ML CURRICULUM // GUIDED MASTER PATH
            </span>
          </div>
          <div className="font-mono text-xs text-[#5C544B] flex items-center gap-3">
            <span>12 ORDERED STAGES</span>
            <span>·</span>
            <span>120 PEDAGOGICAL STEPS</span>
            <span>·</span>
            <span>{totalCurriculumMinutes} TOTAL MIN</span>
          </div>
        </div>

        <div>
          <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
            The Guided Machine Learning Curriculum
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] mt-1 max-w-4xl leading-relaxed">
            From absolute foundations to intermediate algorithmic mastery: Understand the data → understand the learning problem → understand the mathematics → learn core algorithms → evaluate rigorously → experiment scientifically.
          </p>
        </div>

        {/* Essential Core Progress Strip */}
        <div className="pt-3 border-t border-[#D8CFC0] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs">
            <span className="font-bold text-[#1A1715]">
              LAYER 1: ESSENTIAL CORE COMPLETION (STAGES 01–10)
            </span>
            <span className="text-[#5C544B]">
              <strong className="text-[#1848B8]">{essentialProgress.completedCount}</strong> of {essentialProgress.totalCount} Stages Mastered ({essentialProgress.percent}%)
            </span>
          </div>

          {/* Hard-edge Bauhaus Progress Bar */}
          <div className="w-full h-3.5 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] relative overflow-hidden">
            <div
              className="h-full bg-[#1848B8] transition-all duration-500 border-r border-[#1A1715]"
              style={{ width: `${essentialProgress.percent}%` }}
            />
          </div>
        </div>

        {/* Recommended Next Step Callout */}
        {topRec && (
          <div className="p-3.5 bg-[#1848B8]/10 border-[1.5px] border-[#1848B8] shadow-[2px_2px_0px_#1848B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#1848B8] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{topRec.eyebrow}</span>
              </div>
              <h4 className="font-bold text-sm text-[#1A1715]">{topRec.title}</h4>
              <p className="text-[11px] text-[#5C544B] leading-relaxed max-w-2xl">{topRec.reason}</p>
            </div>

            <Link href={topRec.targetUrl} className="shrink-0">
              <button className="py-2 px-4 bg-[#1848B8] text-white font-bold uppercase text-xs border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#133aa0] flex items-center gap-1.5">
                <span>LAUNCH STAGE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        )}

        {/* View Mode Tabs & Search Filter Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#D8CFC0]">
          {/* Main 3 Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 border-[1.5px] border-[#1A1715] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-[#1848B8] text-white shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>ORDERED ROADMAP (12 STAGES)</span>
            </button>
            <button
              onClick={() => setActiveTab('prereqGraph')}
              className={`px-3 py-1.5 border-[1.5px] border-[#1A1715] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'prereqGraph'
                  ? 'bg-[#1848B8] text-white shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>PREREQUISITE DEPENDENCY GRAPH</span>
            </button>
            <button
              onClick={() => setActiveTab('planned')}
              className={`px-3 py-1.5 border-[1.5px] border-[#1A1715] font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'planned'
                  ? 'bg-[#1848B8] text-white shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LAYER 3: PLANNED EXTENSIONS</span>
            </button>
          </div>

          {/* Quick Search */}
          {activeTab === 'roadmap' && (
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#948B7D] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by concept or stage..."
                className="w-full pl-8 pr-3 py-1 font-mono text-xs bg-[#FAF7F0] border border-[#1A1715] outline-none"
              />
            </div>
          )}
        </div>

        {/* Sub-filters for Layer (when Roadmap tab is active) */}
        {activeTab === 'roadmap' && (
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-[10px] uppercase font-bold text-[#5C544B]">FILTER LAYER:</span>
            {[
              { id: 'all', label: 'ALL 12 STAGES' },
              { id: 'essential', label: 'LAYER 1: ESSENTIAL CORE (01–10)' },
              { id: 'evaluation', label: 'LAYER 2: EVALUATION & RIGOR (11–12)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLayerFilter(f.id as any)}
                className={`px-2.5 py-0.5 border text-[11px] font-bold transition-all ${
                  layerFilter === f.id
                    ? 'bg-[#1A1715] text-[#FAF7F0] border-[#1A1715]'
                    : 'bg-[#FAF7F0] text-[#5C544B] border-[#D8CFC0] hover:text-[#1A1715]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. TAB 1: ORDERED ROADMAP (12 STAGES) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStages.map((stage) => {
              const isBookmarked = bookmarks.includes(stage.id);
              const state = conceptStates[stage.id];
              const mastery = state?.masteryScore || 0;
              const isMastered = mastery >= 80;
              const inProgress = (state?.attempts || 0) > 0 && !isMastered;
              const unlocked = isStageUnlocked(stage.id, conceptStates);

              return (
                <AnalogCard
                  key={stage.id}
                  variant="card"
                  headerEyebrow={`STAGE ${stage.stageCode} // ${stage.category.toUpperCase()}`}
                  headerTitle={stage.title.replace(/^Stage \d+:\s*/, '').toUpperCase()}
                  headerAction={
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleToggleBookmark(stage.id, e)}
                        className={`p-1 border text-xs transition-all ${
                          isBookmarked
                            ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715]'
                            : 'bg-[#FAF7F0] text-[#948B7D] border-[#D8CFC0] hover:text-[#1A1715]'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#1A1715]' : ''}`} />
                      </button>

                      {isMastered ? (
                        <Badge variant="sage">MASTERED {mastery}%</Badge>
                      ) : inProgress ? (
                        <Badge variant="amber">IN PROGRESS {mastery}%</Badge>
                      ) : unlocked ? (
                        <Badge variant="ultramarine">AVAILABLE</Badge>
                      ) : (
                        <Badge variant="neutral">LOCKED</Badge>
                      )}
                    </div>
                  }
                >
                  <div className="space-y-3 font-mono text-xs flex flex-col justify-between h-full">
                    <div>
                      {/* Subtitle & Metadata */}
                      <p className="text-[#1A1715] font-semibold mb-2">{stage.description}</p>

                      <div className="flex items-center gap-2 text-[10px] text-[#5C544B] pb-2 border-b border-[#D8CFC0]">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3 text-[#1848B8]" />
                          {stage.durationMinutes} MIN
                        </span>
                        <span>·</span>
                        <span className="uppercase text-[#1848B8] font-bold">
                          {stage.layer === 'essential' ? 'Layer 1: Essential Core' : 'Layer 2: Evaluation'}
                        </span>
                      </div>

                      {/* Topics Covered */}
                      <div className="my-2.5 space-y-1">
                        <span className="text-[10px] text-[#948B7D] uppercase font-bold block">
                          TOPICS INCLUDED:
                        </span>
                        {stage.topicsCovered.slice(0, 3).map((topic, tIdx) => (
                          <div key={tIdx} className="text-[11px] text-[#1A1715] flex items-start gap-1.5 leading-snug">
                            <span className="text-[#C83226] font-bold">›</span>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>

                      {/* Prerequisites */}
                      <div className="pt-2 border-t border-[#D8CFC0]">
                        <span className="text-[10px] text-[#948B7D] block uppercase font-bold mb-1">
                          PREREQUISITES:
                        </span>
                        {stage.prerequisites.length === 0 ? (
                          <span className="text-[10px] text-[#33634B] font-bold">
                            None (Foundational Entry Point)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {stage.prerequisites.map((prId) => {
                              const prStage = allStages.find((s) => s.id === prId);
                              const prMet = (conceptStates[prId]?.masteryScore || 0) >= 60;
                              return (
                                <span
                                  key={prId}
                                  className={`text-[9px] px-1.5 py-0.5 border ${
                                    prMet
                                      ? 'bg-[#33634B]/15 border-[#33634B] text-[#33634B] font-bold'
                                      : 'bg-[#E8E1D3] border-[#1A1715] text-[#5C544B]'
                                  }`}
                                >
                                  {prStage ? `Stage ${prStage.stageCode}` : prId}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Launch Button */}
                    <div className="pt-3 border-t border-[#D8CFC0]">
                      <Link href={`/lessons/${stage.lessonId}`}>
                        <button
                          disabled={!unlocked && !isMastered && !inProgress}
                          className="w-full py-2 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1.5px] active:translate-y-[1.5px] font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 transition-all text-[#1A1715] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isMastered ? (
                            <>
                              <span>REVIEW STAGE {stage.stageCode}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B]" />
                            </>
                          ) : inProgress ? (
                            <>
                              <span>CONTINUE STAGE {stage.stageCode}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#E28C05]" />
                            </>
                          ) : unlocked ? (
                            <>
                              <span>START STAGE {stage.stageCode}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#1848B8]" />
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-[#948B7D]" />
                              <span>LOCKED (PREREQUISITES PENDING)</span>
                            </>
                          )}
                        </button>
                      </Link>
                    </div>
                  </div>
                </AnalogCard>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB 2: PREREQUISITE DIRECTED GRAPH */}
      {activeTab === 'prereqGraph' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] font-mono text-xs space-y-1">
            <span className="font-bold text-[#C83226] block uppercase">
              PREREQUISITE DEPENDENCY GRAPH ARCHITECTURE
            </span>
            <p className="text-[#5C544B]">
              Every edge in this graph represents a real mathematical or data dependency: vectors before K-means, loss surfaces before gradient descent, and cross-validation before comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStages.map((stage) => {
              const state = conceptStates[stage.id];
              const mastery = state?.masteryScore || 0;
              const isMastered = mastery >= 80;
              const unlocked = isStageUnlocked(stage.id, conceptStates);

              return (
                <div
                  key={stage.id}
                  className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] space-y-3 font-mono text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5 mb-1.5">
                      <span className="font-bold text-[#1848B8]">STAGE {stage.stageCode}</span>
                      <Badge variant={isMastered ? 'sage' : unlocked ? 'ultramarine' : 'neutral'}>
                        {isMastered ? 'MASTERED' : unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-[#1A1715] mb-1">{stage.title}</h4>
                    <p className="text-[11px] text-[#5C544B] leading-relaxed mb-3">{stage.description}</p>

                    {/* Inbound Prerequisites */}
                    <div className="space-y-1 mb-2">
                      <span className="text-[10px] text-[#948B7D] uppercase font-bold block">
                        INBOUND PREREQUISITES:
                      </span>
                      {stage.prerequisites.length === 0 ? (
                        <span className="text-[10px] text-[#33634B] font-bold">None (Root Node)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {stage.prerequisites.map((pId) => (
                            <span key={pId} className="px-1.5 py-0.5 bg-[#E8E1D3] border border-[#1A1715] text-[10px]">
                              ← {allStages.find((s) => s.id === pId)?.title.replace(/^Stage \d+:\s*/, '') || pId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Outbound Unlocks */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#948B7D] uppercase font-bold block">
                        OUTBOUND UNLOCKS:
                      </span>
                      {stage.recommendedNext.length === 0 ? (
                        <span className="text-[10px] text-[#5C544B]">Terminal Synthesis Node</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {stage.recommendedNext.map((nId) => (
                            <span key={nId} className="px-1.5 py-0.5 bg-[#FAF7F0] border border-[#1848B8] text-[#1848B8] text-[10px] font-bold">
                              → {allStages.find((s) => s.id === nId)?.title.replace(/^Stage \d+:\s*/, '') || nId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link href={`/lessons/${stage.lessonId}`} className="pt-2">
                    <button className="w-full py-1.5 px-3 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3] font-bold uppercase text-[10px] flex items-center justify-center gap-1">
                      <span>OPEN STAGE {stage.stageCode}</span>
                      <ArrowRight className="w-3 h-3 text-[#1848B8]" />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 3: LAYER 3: PLANNED EXTENSIONS */}
      {activeTab === 'planned' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#E28C05]/15 border-[1.5px] border-[#E28C05] shadow-[2.5px_2.5px_0px_#E28C05] font-mono text-xs space-y-1">
            <span className="font-bold text-[#1A1715] block uppercase">
              LAYER 3: ADVANCED EXTENSIONS (DISCOVERABLE / PLANNED)
            </span>
            <p className="text-[#5C544B]">
              These high-order topics expand upon the Essential 20% foundation. They are transparently labeled as future curriculum items, showing the exact prerequisite gates required before entry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANNED_EXTENSIONS.map((ext) => (
              <div
                key={ext.id}
                className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] space-y-3 font-mono text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5 mb-1.5">
                    <Badge variant="amber">{ext.status}</Badge>
                    <span className="text-[10px] text-[#5C544B] font-bold uppercase">{ext.category}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1A1715] mb-1">{ext.title}</h4>
                  <p className="text-[11px] text-[#5C544B] leading-relaxed mb-3">{ext.description}</p>

                  <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0] space-y-1">
                    <span className="text-[10px] text-[#948B7D] uppercase font-bold block">
                      PREREQUISITE GATES:
                    </span>
                    {ext.prerequisiteStages.map((gate, gIdx) => (
                      <div key={gIdx} className="text-[10px] text-[#1A1715] flex items-center gap-1.5 font-bold">
                        <span className="text-[#C83226]">›</span>
                        <span>Requires: {gate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-[#948B7D] font-bold uppercase border-t border-[#D8CFC0]">
                  Unlocks in Future Module Expansion
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
