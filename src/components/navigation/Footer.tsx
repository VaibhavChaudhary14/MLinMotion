import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t-[1.5px] border-[#1A1715] bg-[#FAF7F0] text-[#1A1715] select-none">
      {/* Main Footer Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 font-mono text-xs">
        {/* Left Column (5 cols): Wordmark & Description */}
        <div className="md:col-span-5 space-y-3">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Small geometric dial mark */}
            <div className="w-6 h-6 bg-[#1A1715] flex items-center justify-center border border-[#1A1715]">
              <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-[#FAF7F0] -rotate-45" />
            </div>
            <span className="font-mono text-sm font-black tracking-tight text-[#1A1715]">
              ML IN MOTION
            </span>
          </Link>
          <p className="text-[#5C544B] leading-relaxed max-w-sm text-xs">
            An interactive visual laboratory for understanding machine learning.
          </p>
          <div className="text-[11px] text-[#948B7D]">
            Analog Bauhaus Functional Computing Instrument.
          </div>
        </div>

        {/* Middle Column (3 cols): LEARN links */}
        <div className="md:col-span-3 space-y-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#C83226] block">
            LEARN
          </span>
          <ul className="space-y-1.5 text-xs text-[#5C544B]">
            <li>
              <Link href="/lessons" className="hover:text-[#1A1715] transition-colors">
                12-Stage Curriculum
              </Link>
            </li>
            <li>
              <Link href="/concepts" className="hover:text-[#1A1715] transition-colors">
                Concept Cards (14 Units)
              </Link>
            </li>
            <li>
              <Link href="/cinema" className="hover:text-[#1A1715] transition-colors">
                Algorithm Cinema
              </Link>
            </li>
            <li>
              <Link href="/lab" className="hover:text-[#1A1715] transition-colors">
                Algorithm Lab
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column (4 cols): PLATFORM links */}
        <div className="md:col-span-4 space-y-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1848B8] block">
            TOOLS & PLATFORM
          </span>
          <ul className="space-y-1.5 text-xs text-[#5C544B]">
            <li>
              <Link href="/compare" className="hover:text-[#1A1715] transition-colors">
                Comparison Studio
              </Link>
            </li>
            <li>
              <Link href="/datalab" className="hover:text-[#1A1715] transition-colors">
                My Data Lab
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="hover:text-[#1A1715] transition-colors">
                Diagnostic Quiz
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#1A1715] transition-colors">
                Learning Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#1A1715] transition-colors">
                About & Methodology
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#1A1715] transition-colors">
                Privacy & Data Ethics
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-Strip */}
      <div className="border-t-[1px] border-[#D8CFC0] bg-[#F4EFE4]/60 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-[#5C544B]">
          <div className="flex items-center gap-2">
            <span>© ML in Motion.</span>
            <span className="text-[#948B7D]">|</span>
            <span className="italic">Built for the curious.</span>
          </div>

          {/* Subtle Geometric Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1848B8]" />
              <span className="w-2 h-2 bg-[#C83226] rotate-45" />
              <span className="w-0 h-0 border-x-[4px] border-x-transparent border-b-[7px] border-b-[#E28C05]" />
              <span className="w-2 h-2 bg-[#33634B]" />
            </div>
            <span className="text-[10px] text-[#948B7D]">FIRST PRINCIPLES • ZERO FABRICATION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
