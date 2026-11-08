'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Search, Bookmark, FileText } from 'lucide-react';
import { CommandPalette } from '@/components/search/CommandPalette';
import { NotesDrawer, getSavedNotes } from '@/components/notes/NotesDrawer';
import { getBookmarks } from '@/lib/adaptive/bookmarks';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    // Initial counts
    setNoteCount(getSavedNotes().length);
    setBookmarkCount(getBookmarks().length);

    // Listeners for updates
    const handleNotesUpdate = () => setNoteCount(getSavedNotes().length);
    const handleBookmarksUpdate = () => setBookmarkCount(getBookmarks().length);

    window.addEventListener('notes-updated', handleNotesUpdate);
    window.addEventListener('bookmarks-updated', handleBookmarksUpdate);

    // Global Cmd+K / Ctrl+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('notes-updated', handleNotesUpdate);
      window.removeEventListener('bookmarks-updated', handleBookmarksUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/lessons', label: 'Curriculum' },
    { href: '/concepts', label: 'Concept Cards' },
    { href: '/cinema', label: 'Cinema' },
    { href: '/lab', label: 'Lab' },
    { href: '/compare', label: 'Comparison' },
    { href: '/datalab', label: 'Data Lab' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/about', label: 'About' },
  ];

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b-[1.5px] border-[#1A1715] shadow-[0px_2px_0px_#1A1715]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Typographic Wordmark with Geometric Dial Mark */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-6 h-6 bg-[#1A1715] flex items-center justify-center border border-[#1A1715] shadow-[1px_1px_0px_#C83226]">
              <div className="relative w-3.5 h-3.5">
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#FAF7F0]" />
                <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#FAF7F0]" />
                <span className="absolute top-0 right-0 w-1 h-1 bg-[#C83226]" />
              </div>
            </div>
            <span className="font-mono text-sm sm:text-base font-black tracking-tight text-[#1A1715] group-hover:text-[#C83226] transition-colors">
              ML IN MOTION
            </span>
          </Link>

          {/* Desktop Navigation Tabs: Ordered Sequence with Tactile Bauhaus States */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-mono text-[11px] xl:text-xs">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2 xl:px-2.5 py-1 font-bold uppercase tracking-tight transition-all border-[1.5px] ${
                    active
                      ? 'bg-[#1A1715] text-[#FAF7F0] border-[#1A1715] shadow-[1.5px_1.5px_0px_#C83226]'
                      : 'bg-transparent text-[#5C544B] border-transparent hover:text-[#1A1715] hover:bg-[#E8E1D3] hover:border-[#1A1715]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Search, Notes Drawer */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Cmd+K Search trigger pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] text-[#5C544B] hover:text-[#1A1715] hover:bg-[#E8E1D3] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs transition-all"
              title="Search curriculum & tools (Cmd+K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#C83226]" />
              <span className="hidden sm:inline text-[11px]">Search...</span>
              <kbd className="hidden sm:inline px-1 py-0.2 bg-[#E8E1D3] border border-[#1A1715] text-[9px] font-bold text-[#1A1715]">
                ⌘K
              </kbd>
            </button>

            {/* Notes & Bookmarks Drawer Trigger */}
            <button
              onClick={() => setNotesOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] text-[#1A1715] hover:bg-[#E8E1D3] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs transition-all"
              title="Open Notes & Bookmarks Drawer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#1848B8]" />
              <span className="hidden md:inline text-[11px] font-bold">NOTES</span>
              {(noteCount > 0 || bookmarkCount > 0) && (
                <span className="px-1 py-0.2 bg-[#E28C05] text-[#1A1715] border border-[#1A1715] text-[9px] font-bold">
                  {noteCount + bookmarkCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center border-[1.5px] border-[#1A1715] bg-[#FAF7F0] text-[#1A1715]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-[1.5px] border-[#1A1715] bg-[#FAF7F0] px-4 py-4 space-y-3 font-mono text-xs">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 font-bold uppercase transition-all flex items-center justify-between border-[1.5px] ${
                      active
                        ? 'bg-[#1A1715] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#C83226]'
                        : 'bg-transparent text-[#5C544B] border-transparent hover:border-[#1A1715] hover:bg-[#E8E1D3] hover:text-[#1A1715]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 bg-[#C83226]" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex-1 py-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] font-bold text-center hover:bg-[#E8E1D3] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                SEARCH (⌘K)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNotesOpen(true);
                }}
                className="flex-1 py-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] font-bold text-center hover:bg-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                NOTES & BOOKMARKS
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotesDrawer isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
    </>
  );
};
