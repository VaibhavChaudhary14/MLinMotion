'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#explorer', label: 'Explore' },
    { href: '/#paths', label: 'Learning Paths' },
    { href: '/lab', label: 'Algorithm Lab' },
    { href: '/#how-it-works', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b-[1.5px] border-[#1A1715] shadow-[0px_2px_0px_#1A1715]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Typographic Wordmark with Geometric Dial Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Small geometric dial mark inspired by coordinate axes */}
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

        {/* Center/Right Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-semibold text-[#5C544B]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#1A1715] hover:underline underline-offset-4 decoration-[#C83226] decoration-[1.5px] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Primary CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/cinema"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1848B8] text-[#FAF7F0] font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#133aa0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span>START EXPLORING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center border-[1.5px] border-[#1A1715] bg-[#FAF7F0] text-[#1A1715]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-[1.5px] border-[#1A1715] bg-[#FAF7F0] px-4 py-4 space-y-3 font-mono text-xs">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#5C544B] hover:text-[#1A1715] font-semibold border-b border-[#D8CFC0]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#5C544B] hover:text-[#1A1715] font-semibold border-b border-[#D8CFC0]"
            >
              Dashboard Studio
            </Link>
          </div>

          <Link
            href="/cinema"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#1848B8] text-[#FAF7F0] font-bold uppercase text-xs border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]"
          >
            <span>START EXPLORING →</span>
          </Link>
        </div>
      )}
    </header>
  );
};
