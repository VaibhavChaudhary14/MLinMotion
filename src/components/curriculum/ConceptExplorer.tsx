'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { Badge } from '@/components/ui/Badge';
import { CONCEPT_GRAPH, ConceptNode } from '@/lib/adaptive/conceptGraph';
import { getLearnerConceptStates } from '@/lib/adaptive/recommender';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const ConceptExplorer: React.FC = () => {
  const [conceptStates, setConceptStates] = useState<any>({});

  useEffect(() => {
    setConceptStates(getLearnerConceptStates());
  }, []);

  const concepts = Object.values(CONCEPT_GRAPH);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-[#C83226]" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
            CURRICULUM PREREQUISITE DIRECTED GRAPH
          </span>
        </div>
        <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
          Concept Explorer & Prerequisite Graph
        </h1>
        <p className="font-mono text-xs text-[#5C544B] mt-0.5">
          Explicit prerequisite relationships ensure you master geometric and mathematical foundations before tackling high-order algorithms.
        </p>
      </div>

      {/* Grid of Concept Cards */}
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

                {/* Enter Lesson Button */}
                <div className="pt-2">
                  <Link href={`/lessons/${node.lessonId || 'kmeans'}`}>
                    <button
                      disabled={!prereqsMet && !isMastered}
                      className="w-full py-1.5 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>ENTER LESSON</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnalogCard>
          );
        })}
      </div>
    </div>
  );
};
