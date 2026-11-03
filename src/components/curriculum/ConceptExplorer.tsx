'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { Badge } from '@/components/ui/Badge';
import { CONCEPT_GRAPH, ConceptNode } from '@/lib/adaptive/conceptGraph';
import { getLearnerConceptStates } from '@/lib/adaptive/recommender';
import { LESSONS_REGISTRY } from '@/lib/curriculum/lessonsData';
import { getBookmarks, toggleBookmark } from '@/lib/adaptive/bookmarks';
import { BookOpen, CheckCircle2, Lock, ArrowRight, Bookmark, Sparkles, Layers } from 'lucide-react';

export const ConceptExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'prereqGraph'>('tracks');
  const [conceptStates, setConceptStates] = useState<any>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setConceptStates(getLearnerConceptStates());
    setBookmarks(getBookmarks());

    const handleUpdate = () => {
      setBookmarks(getBookmarks());
    };
    window.addEventListener('bookmarks-updated', handleUpdate);
    return () => window.removeEventListener('bookmarks-updated', handleUpdate);
  }, []);

  const handleToggleBookmark = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(lessonId);
    setBookmarks(getBookmarks());
  };

  const concepts = Object.values(CONCEPT_GRAPH);
  const lessons = Object.values(LESSONS_REGISTRY);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C83226]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              STRUCTURED CURRICULUM // 6 CORE ALGORITHMS
            </span>
          </div>
          <div className="font-mono text-xs text-[#5C544B]">
            60 STEPS · 30 DIAGNOSTIC QUESTIONS · 6 CODE BRIDGES
          </div>
        </div>

        <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
          Curriculum Master Tracks & Prerequisite Directed Graph
        </h1>
        <p className="font-mono text-xs text-[#5C544B] mt-0.5">
          Step into interactive visual textbooks for all 6 foundational algorithms. Every lesson pairs conceptual intuition with mathematical formulas, live code kernels, and diagnostic assessments.
        </p>

        {/* View Switcher Strip */}
        <div className="mt-4 pt-3 border-t border-[#D8CFC0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`font-mono text-xs font-bold px-3 py-1.5 border-[1.5px] border-[#1A1715] transition-all flex items-center gap-1.5 ${
                activeTab === 'tracks'
                  ? 'bg-[#1848B8] text-white shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CORE LESSON TRACKS (6 ALGORITHMS)</span>
            </button>
            <button
              onClick={() => setActiveTab('prereqGraph')}
              className={`font-mono text-xs font-bold px-3 py-1.5 border-[1.5px] border-[#1A1715] transition-all flex items-center gap-1.5 ${
                activeTab === 'prereqGraph'
                  ? 'bg-[#1848B8] text-white shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>PREREQUISITE DIRECTED GRAPH</span>
            </button>
          </div>

          <Link
            href="/concepts"
            className="font-mono text-xs font-bold px-3 py-1.5 bg-[#C83226] text-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#b0291f] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5"
          >
            <span>VISUAL CONCEPT CARDS HUB →</span>
          </Link>
        </div>
      </div>

      {/* Tab 1: Core Lesson Tracks */}
      {activeTab === 'tracks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((les) => {
            const isBookmarked = bookmarks.includes(les.id);
            const state = conceptStates[les.id];
            const mastery = state?.masteryScore || 0;

            return (
              <AnalogCard
                key={les.id}
                variant="card"
                headerEyebrow={`TRACK // ${les.algorithmId.toUpperCase()}`}
                headerTitle={les.title.split(':')[0].toUpperCase()}
                headerAction={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleBookmark(les.id, e)}
                      className={`p-1 border text-xs transition-all ${
                        isBookmarked
                          ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715]'
                          : 'bg-[#FAF7F0] text-[#948B7D] border-[#D8CFC0] hover:text-[#1A1715]'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#1A1715]' : ''}`} />
                    </button>
                    {mastery > 0 ? (
                      <Badge variant={mastery >= 80 ? 'sage' : 'amber'}>
                        {mastery}% MASTERY
                      </Badge>
                    ) : (
                      <Badge variant="dark">10 STEPS</Badge>
                    )}
                  </div>
                }
              >
                <div className="space-y-3 font-mono text-xs flex flex-col justify-between h-full">
                  <div>
                    <p className="text-[#1A1715] font-semibold mb-1">{les.subtitle}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#5C544B] mb-2">
                      <span>DURATION: {les.durationMinutes} MIN</span>
                      <span>·</span>
                      <span>5 DIAGNOSTIC QUESTIONS</span>
                    </div>

                    {/* Learning Objectives */}
                    <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0] space-y-1">
                      <span className="text-[10px] text-[#5C544B] uppercase font-bold block">
                        KEY OBJECTIVES:
                      </span>
                      {les.learningObjectives.slice(0, 2).map((obj, i) => (
                        <div key={i} className="text-[11px] text-[#1A1715] flex items-start gap-1.5">
                          <span className="text-[#C83226] font-bold">›</span>
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Launch Lesson & Concept Deck Buttons */}
                  <div className="pt-3 border-t border-[#D8CFC0] grid grid-cols-2 gap-2">
                    <Link href={`/concepts/${les.algorithmId}`}>
                      <button className="w-full py-1.5 px-2 bg-[#E8E1D3] border border-[#1A1715] hover:bg-[#DDD5C5] active:translate-x-[1px] active:translate-y-[1px] font-bold uppercase text-[10px] flex items-center justify-center gap-1 text-[#1A1715]">
                        <span>CONCEPT DECK</span>
                      </button>
                    </Link>
                    <Link href={`/lessons/${les.id}`}>
                      <button className="w-full py-1.5 px-2 bg-[#1848B8] text-[#FAF7F0] border border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#133aa0] active:translate-x-[1px] active:translate-y-[1px] font-bold uppercase text-[10px] flex items-center justify-center gap-1">
                        <span>START LESSON</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </AnalogCard>
            );
          })}
        </div>
      )}

      {/* Tab 2: Prerequisite Directed Graph */}
      {activeTab === 'prereqGraph' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((node) => {
            const state = conceptStates[node.id];
            const mastery = state?.masteryScore || 0;
            const isMastered = mastery >= 80;
            const prereqsMet = node.prerequisites.every(
              (prId) => (conceptStates[prId]?.masteryScore || 0) >= 60
            );

            return (
              <AnalogCard
                key={node.id}
                variant="card"
                headerEyebrow={node.eyebrow}
                headerTitle={node.title.toUpperCase()}
                headerAction={
                  isMastered ? (
                    <Badge variant="sage">MASTERED {mastery}%</Badge>
                  ) : !prereqsMet ? (
                    <Badge variant="neutral">LOCKED</Badge>
                  ) : (
                    <Badge variant="amber">UNLOCKED {mastery}%</Badge>
                  )
                }
              >
                <div className="space-y-3 font-mono text-xs flex flex-col justify-between h-full">
                  <p className="text-[#5C544B] leading-relaxed">{node.description}</p>

                  {/* Prerequisites Strip */}
                  <div className="pt-2 border-t border-[#D8CFC0]">
                    <span className="text-[10px] text-[#948B7D] block uppercase font-bold mb-1">
                      PREREQUISITES:
                    </span>
                    {node.prerequisites.length === 0 ? (
                      <span className="text-[10px] text-[#33634B] font-bold">None (Root Concept)</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {node.prerequisites.map((prId) => (
                          <span
                            key={prId}
                            className="text-[9px] px-1.5 py-0.5 bg-[#E8E1D3] border border-[#1A1715]"
                          >
                            {CONCEPT_GRAPH[prId]?.title || prId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enter Lesson & Concept Deck Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link href={`/concepts/${node.lessonId || 'kmeans'}`}>
                      <button className="w-full py-1.5 px-2 bg-[#E8E1D3] border border-[#1A1715] hover:bg-[#DDD5C5] active:translate-x-[1px] active:translate-y-[1px] font-bold uppercase text-[10px] flex items-center justify-center gap-1 text-[#1A1715]">
                        <span>CARDS DECK</span>
                      </button>
                    </Link>
                    <Link href={`/lessons/${node.lessonId || 'kmeans'}`}>
                      <button
                        disabled={!prereqsMet && !isMastered}
                        className="w-full py-1.5 px-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none font-bold uppercase text-[10px] flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span>LESSON</span>
                        <ArrowRight className="w-3 h-3 text-[#C83226]" />
                      </button>
                    </Link>
                  </div>
                </div>
              </AnalogCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
