'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConceptCardUnit } from '@/types/conceptCards';
import { CardNutshell } from './cards/CardNutshell';
import { CardHowItWorks } from './cards/CardHowItWorks';
import { CardVisualExample } from './cards/CardVisualExample';
import { CardVariants } from './cards/CardVariants';
import { CardImplementation } from './cards/CardImplementation';
import { CardTradeoffs } from './cards/CardTradeoffs';
import { CardTakeaways } from './cards/CardTakeaways';
import { ConceptNotesDrawer } from './ConceptNotesDrawer';
import {
  ArrowLeft,
  Bookmark,
  Edit3,
  CheckCheck,
  FlaskConical,
  Film,
  Compass,
} from 'lucide-react';

interface ConceptDeckViewProps {
  concept: ConceptCardUnit;
}

export const ConceptDeckView: React.FC<ConceptDeckViewProps> = ({ concept }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isMastered, setIsMastered] = useState<boolean>(false);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('card-nutshell');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bm = localStorage.getItem(`concept_bm_${concept.id}`) === 'true';
      const ms = localStorage.getItem(`concept_ms_${concept.id}`) === 'true';
      setIsBookmarked(bm);
      setIsMastered(ms);
    }
  }, [concept.id]);

  const toggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`concept_bm_${concept.id}`, String(next));
    }
  };

  const toggleMastered = () => {
    const next = !isMastered;
    setIsMastered(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`concept_ms_${concept.id}`, String(next));
    }
  };

  const navPills = [
    { id: 'card-nutshell', label: '01. Nutshell' },
    { id: 'card-how-it-works', label: '02. Mechanics' },
    { id: 'card-visual-example', label: '03. Simulation' },
    { id: 'card-variants', label: '04. Variants' },
    { id: 'card-implementation', label: '05. Python' },
    { id: 'card-tradeoffs', label: '06. Trade-offs' },
    { id: 'card-takeaways', label: '07. Recall' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Sticky Deck Control Bar */}
      <div className="sticky top-14 z-30 bg-[#FAF7F0]/95 backdrop-blur-sm border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back Link & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/concepts"
              className="p-1.5 bg-[#FAF7F0] border border-[#1A1715] shadow-[1px_1px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1px] active:translate-y-[1px]"
              title="Return to Concept Library"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A1715]" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#C83226]">
                  {concept.eyebrow}
                </span>
                <span className="font-mono text-[9px] text-[#948B7D]">/</span>
                <span className="font-mono text-[9px] text-[#5C544B] uppercase font-bold">
                  {concept.category}
                </span>
              </div>
              <h1 className="font-mono text-sm sm:text-base font-black text-[#1A1715] tracking-tight">
                {concept.title}
              </h1>
            </div>
          </div>

          {/* Right Action Tools: Bookmark, Notes, Mastered, Lab */}
          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              className={`p-1.5 border border-[#1A1715] font-mono text-[10px] font-bold flex items-center gap-1 transition-all ${
                isBookmarked
                  ? 'bg-[#E28C05] text-[#FAF7F0]'
                  : 'bg-[#FAF7F0] text-[#5C544B] hover:text-[#1A1715]'
              }`}
              title="Bookmark Concept"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Bookmark</span>
            </button>

            {/* Notes button */}
            <button
              onClick={() => setNotesOpen(true)}
              className="p-1.5 border border-[#1A1715] bg-[#FAF7F0] text-[#5C544B] hover:text-[#1A1715] font-mono text-[10px] font-bold flex items-center gap-1"
              title="Open Personal Study Notes"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1848B8]" />
              <span className="hidden sm:inline">Notes</span>
            </button>

            {/* Mastered toggle */}
            <button
              onClick={toggleMastered}
              className={`p-1.5 border border-[#1A1715] font-mono text-[10px] font-bold flex items-center gap-1 transition-all ${
                isMastered
                  ? 'bg-[#33634B] text-[#FAF7F0]'
                  : 'bg-[#FAF7F0] text-[#5C544B] hover:text-[#1A1715]'
              }`}
              title="Toggle Mastery Status"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isMastered ? 'Mastered' : 'Mark Done'}</span>
            </button>

            {/* Lab link */}
            {concept.labAlgorithmId && (
              <Link
                href={`/lab?algo=${concept.labAlgorithmId}`}
                className="hidden md:inline-flex p-1.5 border border-[#1A1715] bg-[#1848B8] text-[#FAF7F0] font-mono text-[10px] font-bold items-center gap-1"
                title="Launch in Algorithm Lab"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Lab</span>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Jump Pills Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 border-t border-[#D8CFC0] pt-1.5 no-scrollbar">
          {navPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => scrollTo(pill.id)}
              className={`px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border border-[#1A1715] transition-all ${
                activeSection === pill.id
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[1px_1px_0px_#C83226]'
                  : 'bg-[#FAF7F0] text-[#5C544B] hover:text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* The 7 Sequential Explanatory Concept Cards */}
      <div className="space-y-8">
        <CardNutshell
          data={concept.nutshell}
          conceptTitle={concept.title}
          eyebrow={concept.eyebrow}
          colorAccent={concept.colorAccent}
        />

        <CardHowItWorks data={concept.howItWorks} />

        <CardVisualExample data={concept.visualExample} />

        <CardVariants data={concept.variants} />

        <CardImplementation
          data={concept.implementation}
          conceptTitle={concept.title}
        />

        <CardTradeoffs data={concept.tradeoffs} />

        <CardTakeaways
          data={concept.takeaways}
          conceptId={concept.id}
          conceptTitle={concept.title}
          labAlgorithmId={concept.labAlgorithmId}
          cinemaStepId={concept.cinemaStepId}
          isMastered={isMastered}
          onToggleMastered={toggleMastered}
        />
      </div>

      {/* Personal Notes Modal */}
      <ConceptNotesDrawer
        conceptId={concept.id}
        conceptTitle={concept.title}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
};
