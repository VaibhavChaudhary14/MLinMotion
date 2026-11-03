'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ALL_CONCEPT_CARDS } from '@/lib/curriculum/conceptCardsData';
import { ConceptCategory, ConceptDifficulty } from '@/types/conceptCards';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  BookOpen,
  Filter,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  FlaskConical,
} from 'lucide-react';

export const ConceptLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bms: string[] = [];
      const msd: string[] = [];
      ALL_CONCEPT_CARDS.forEach((c) => {
        if (localStorage.getItem(`concept_bm_${c.id}`) === 'true') bms.push(c.id);
        if (localStorage.getItem(`concept_ms_${c.id}`) === 'true') msd.push(c.id);
      });
      setBookmarkedIds(bms);
      setMasteredIds(msd);
    }
  }, []);

  const categories = [
    'All',
    'Supervised Learning',
    'Optimization',
    'Unsupervised Learning',
    'Ensemble Learning',
    'Dimensionality Reduction',
  ];

  const filteredConcepts = useMemo(() => {
    return ALL_CONCEPT_CARDS.filter((c) => {
      // Category match
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }
      // Difficulty match
      if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty) {
        return false;
      }
      // Bookmarks only
      if (onlyBookmarked && !bookmarkedIds.includes(c.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesSub = c.subtitle.toLowerCase().includes(q);
        const matchesTags = c.tags.some((t) => t.toLowerCase().includes(q));
        const matchesEyebrow = c.eyebrow.toLowerCase().includes(q);
        return matchesTitle || matchesSub || matchesTags || matchesEyebrow;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, onlyBookmarked, bookmarkedIds]);

  // Mini SVG Schematic for each concept card preview
  const renderCardThumbnail = (conceptId: string) => {
    switch (conceptId) {
      case 'linear-regression':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <line x1="15" y1="60" x2="105" y2="15" stroke="#1A1715" strokeWidth="2" />
            <circle cx="25" cy="50" r="3" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <circle cx="45" cy="38" r="3" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <circle cx="65" cy="42" r="3" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <circle cx="85" cy="22" r="3" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="65" y1="42" x2="65" y2="33" stroke="#C83226" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        );
      case 'gradient-descent':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <path d="M 15 15 Q 60 65 105 15" fill="none" stroke="#1A1715" strokeWidth="2" />
            <circle cx="32" cy="38" r="3" fill="#FAF7F0" stroke="#1A1715" />
            <circle cx="45" cy="52" r="3" fill="#FAF7F0" stroke="#1A1715" />
            <circle cx="60" cy="58" r="4" fill="#C83226" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="25" y1="32" x2="40" y2="46" stroke="#E28C05" strokeWidth="1.5" />
          </svg>
        );
      case 'kmeans':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <circle cx="30" cy="35" r="14" fill="#1848B8" fillOpacity="0.1" stroke="#1848B8" strokeDasharray="2,2" />
            <circle cx="90" cy="35" r="14" fill="#E28C05" fillOpacity="0.1" stroke="#E28C05" strokeDasharray="2,2" />
            <circle cx="30" cy="35" r="4" fill="#1848B8" />
            <circle cx="90" cy="35" r="4" fill="#E28C05" />
            <circle cx="25" cy="40" r="2.5" fill="#1848B8" />
            <circle cx="35" cy="30" r="2.5" fill="#1848B8" />
            <circle cx="85" cy="32" r="2.5" fill="#E28C05" />
            <circle cx="95" cy="38" r="2.5" fill="#E28C05" />
          </svg>
        );
      case 'logistic-regression':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <line x1="10" y1="60" x2="110" y2="60" stroke="#1A1715" strokeWidth="1" />
            <path d="M 15 58 C 50 58 55 12 105 12" fill="none" stroke="#1A1715" strokeWidth="2" />
            <line x1="60" y1="10" x2="60" y2="60" stroke="#C83226" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="60" cy="35" r="3.5" fill="#6E3867" />
          </svg>
        );
      case 'decision-trees':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <rect x="50" y="10" width="20" height="12" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="60" y1="22" x2="30" y2="40" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="60" y1="22" x2="90" y2="40" stroke="#1A1715" strokeWidth="1.5" />
            <rect x="20" y="40" width="20" height="12" fill="#33634B" fillOpacity="0.2" stroke="#1A1715" strokeWidth="1.5" />
            <rect x="80" y="40" width="20" height="12" fill="#C83226" fillOpacity="0.2" stroke="#1A1715" strokeWidth="1.5" />
          </svg>
        );
      case 'pca':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <line x1="15" y1="55" x2="105" y2="15" stroke="#1A1715" strokeWidth="2" />
            <circle cx="40" cy="45" r="2.5" fill="#FAF7F0" stroke="#1A1715" />
            <circle cx="60" cy="35" r="2.5" fill="#FAF7F0" stroke="#1A1715" />
            <circle cx="80" cy="25" r="2.5" fill="#FAF7F0" stroke="#1A1715" />
            <line x1="40" y1="45" x2="48" y2="41" stroke="#C83226" strokeDasharray="1.5,1.5" />
            <line x1="80" y1="25" x2="72" y2="29" stroke="#C83226" strokeDasharray="1.5,1.5" />
          </svg>
        );
      case 'ensemble-learning':
        return (
          <svg viewBox="0 0 120 70" className="w-full h-full bg-[#E8E1D3]/50">
            <rect x="15" y="15" width="22" height="14" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <rect x="15" y="38" width="22" height="14" fill="#FAF7F0" stroke="#1A1715" strokeWidth="1.5" />
            <rect x="80" y="24" width="26" height="22" fill="#33634B" fillOpacity="0.15" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="37" y1="22" x2="80" y2="35" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="37" y1="45" x2="80" y2="35" stroke="#1A1715" strokeWidth="1.5" />
            <circle cx="93" cy="35" r="4" fill="#33634B" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Plate */}
      <div className="p-5 sm:p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8CFC0] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C83226] border border-[#1A1715]" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#C83226]">
              ML ARCHIVAL REPOSITORY // VISUAL CONCEPT CARDS
            </span>
          </div>

          {/* Quick Mastery & Progress Tracker */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4EFE4] border border-[#1A1715]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B]" />
              <span>
                Mastered: <strong>{masteredIds.length}</strong> / {ALL_CONCEPT_CARDS.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F4EFE4] border border-[#1A1715]">
              <Bookmark className="w-3.5 h-3.5 text-[#E28C05] fill-current" />
              <span>
                Saved: <strong>{bookmarkedIds.length}</strong>
              </span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
            Visual Concept Cards Library
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] max-w-3xl mt-1 leading-relaxed">
            Every core machine learning concept deconstructed into small, connected cards: formal definition, mechanical pipeline, interactive worked examples, variants, Python implementations, and diagnostic failure modes.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar Plate */}
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] space-y-3">
        {/* Search Input & Bookmarks Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5C544B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts by title, keywords, or tags (e.g. OLS, Voronoi, Bagging, Sigmoid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F4EFE4] border-[1.5px] border-[#1A1715] text-xs font-mono text-[#1A1715] placeholder-[#948B7D] focus:outline-none focus:ring-1 focus:ring-[#1848B8]"
            />
          </div>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-2 border-[1.5px] border-[#1A1715] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              onlyBookmarked
                ? 'bg-[#E28C05] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                : 'bg-[#F4EFE4] text-[#5C544B] hover:text-[#1A1715]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Bookmarked Only ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Category Tabs Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-[#D8CFC0]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border border-[#1A1715] transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#C83226]'
                  : 'bg-[#FAF7F0] text-[#5C544B] hover:text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => {
          const isMastered = masteredIds.includes(concept.id);
          const isBookmarked = bookmarkedIds.includes(concept.id);

          return (
            <article
              key={concept.id}
              className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] hover:shadow-[5px_5px_0px_#1A1715] hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header Plate */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
                <span className="font-mono text-[10px] uppercase font-bold text-[#C83226]">
                  {concept.eyebrow}
                </span>
                <div className="flex items-center gap-1.5">
                  {isMastered && (
                    <Badge variant="sage" size="sm">
                      MASTERED ✔
                    </Badge>
                  )}
                  {isBookmarked && (
                    <Bookmark className="w-3.5 h-3.5 text-[#E28C05] fill-current" />
                  )}
                </div>
              </div>

              {/* Card Thumbnail Schematic */}
              <div className="h-28 border-b border-[#1A1715] overflow-hidden">
                {renderCardThumbnail(concept.id)}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-mono text-base font-black text-[#1A1715] tracking-tight">
                      {concept.title}
                    </h3>
                    <Badge variant="neutral" size="sm">
                      {concept.difficulty}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-[#5C544B] leading-relaxed line-clamp-2">
                    {concept.subtitle}
                  </p>
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {concept.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] px-1.5 py-0.2 bg-[#F4EFE4] border border-[#1A1715] text-[#5C544B]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="font-mono text-[9px] text-[#948B7D] self-center ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {concept.estimatedMinutes} min
                  </span>
                </div>

                {/* Card Action Link */}
                <div className="pt-2 border-t border-[#D8CFC0]">
                  <Link
                    href={`/concepts/${concept.id}`}
                    className="w-full py-2 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#1848B8] hover:text-[#FAF7F0] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors group"
                  >
                    <span>OPEN CONCEPT DECK</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredConcepts.length === 0 && (
        <div className="p-8 text-center bg-[#FAF7F0] border-[1.5px] border-[#1A1715] font-mono space-y-2">
          <p className="text-sm font-bold text-[#1A1715]">No concepts found matching your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setOnlyBookmarked(false);
            }}
            className="px-3 py-1.5 bg-[#1848B8] text-[#FAF7F0] text-xs font-bold uppercase border border-[#1A1715]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
