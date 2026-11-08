import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, Cpu, Layers, ShieldCheck, Terminal, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About & Methodology — ML in Motion',
  description:
    'The philosophy, mathematical standards, and design system behind ML in Motion: an interactive visual laboratory and textbook for Machine Learning.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 font-mono">
      {/* 1. Header Plate */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-6 sm:p-8 shadow-[3px_3px_0px_#1A1715] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-[#1A1715] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#C83226] border border-[#1A1715]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1A1715]">
              DOCUMENTATION // SYSTEM SPECIFICATION
            </span>
          </div>
          <span className="px-2 py-0.5 bg-[#E8E1D3] border border-[#1A1715] text-[10px] font-bold text-[#1848B8]">
            ANALOG BAUHAUS COMPUTING INSTRUMENT
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-[#1A1715] tracking-tight">
            Stop Memorizing Algorithms. Start Seeing How They Work.
          </h1>
          <p className="text-sm sm:text-base text-[#5C544B] leading-relaxed max-w-3xl">
            Machine Learning in Motion is an open interactive textbook and mathematical workbench. We reject decorative animations, fabricated simulations, and opaque black-box APIs. Every curve, residual line, and decision boundary rendered on this platform is calculated from real deterministic linear algebra and calculus executed entirely in your browser.
          </p>
        </div>
      </div>

      {/* 2. Core Tenets Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1715]">
            THE FOUR CORE PEDAGOGICAL TENETS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tenet 1 */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-2 text-[#C83226]">
              <Cpu className="w-4 h-4" />
              <h3 className="font-black text-sm uppercase text-[#1A1715]">01 // True Mathematical Execution</h3>
            </div>
            <p className="text-xs text-[#5C544B] leading-relaxed">
              No canned GIF animations or hardcoded paths. When you drag a slope slider in Linear Regression, the vertical residuals (y - ŷ) and Mean Squared Error are recomputed instantly from coordinates. When you adjust the learning rate in Gradient Descent, parameters step along real partial derivative contraction curves.
            </p>
          </div>

          {/* Tenet 2 */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-2 text-[#1848B8]">
              <Layers className="w-4 h-4" />
              <h3 className="font-black text-sm uppercase text-[#1A1715]">02 // Analog Bauhaus Physicality</h3>
            </div>
            <p className="text-xs text-[#5C544B] leading-relaxed">
              Inspired by early 20th-century electromechanical laboratory instrumentation and Bauhaus clarity. We eschew floaty pastels, neon drop shadows, and ambiguous glassmorphism. Controls feel like bench switches, stepped potentiometers, and archival data plates with hard-edge offsets and restrained semantic palettes.
            </p>
          </div>

          {/* Tenet 3 */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-2 text-[#E28C05]">
              <BookOpen className="w-4 h-4" />
              <h3 className="font-black text-sm uppercase text-[#1A1715]">03 // The Golden Question Triad</h3>
            </div>
            <p className="text-xs text-[#5C544B] leading-relaxed">
              Every single concept in our curriculum answers three non-negotiable questions: <strong>1. What is it?</strong> (Definition & formulation), <strong>2. Why does it work?</strong> (Mathematical intuition & geometry), and <strong>3. When would I actually use it?</strong> (Real-world tabular and production contexts).
            </p>
          </div>

          {/* Tenet 4 */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[2px_2px_0px_#1A1715] space-y-2">
            <div className="flex items-center gap-2 text-[#33634B]">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-black text-sm uppercase text-[#1A1715]">04 // Zero Server Footprint & Privacy</h3>
            </div>
            <p className="text-xs text-[#5C544B] leading-relaxed">
              Your data never leaves your device. All algorithms, CSV parsers, PCA eigendecompositions, and cross-validation routines run locally in your browser's WebAssembly and JavaScript threads. No user accounts required, no tracking cookies, and zero server-side model inference costs.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Platform Architecture & Stack */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-6 shadow-[3px_3px_0px_#1A1715] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#D8CFC0] pb-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <h2 className="text-xs font-black uppercase tracking-widest text-[#1A1715]">
            TECHNICAL ARCHITECTURE & OPEN LICENSING
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#1A1715] block uppercase">Frontend Framework</span>
            <p className="text-[#5C544B]">
              Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide icons, and KaTeX for LaTeX mathematical formulas.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#1A1715] block uppercase">Mathematical Engines</span>
            <p className="text-[#5C544B]">
              Custom numerical engines for Ordinary Least Squares, Lloyd's K-Means clustering, QR covariance decomposition, and soft-thresholding.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-[#1A1715] block uppercase">Licensing Contract</span>
            <p className="text-[#5C544B]">
              Free and open-source under the permissive <strong>MIT License</strong>. Contains zero AGPL dependencies or proprietary locked models.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Curriculum Coverage Table */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-6 shadow-[3px_3px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1715]">
            CURRICULUM TOPOLOGY (14 INTERACTIVE UNITS)
          </span>
          <Link
            href="/concepts"
            className="text-[10px] font-bold text-[#1848B8] hover:underline flex items-center gap-1"
          >
            VIEW CONCEPT CARDS <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#1848B8] block">01. Linear Regression</span>
            <span className="text-[#5C544B] text-[10px]">OLS, residuals, normal equations</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#C83226] block">02. Gradient Descent</span>
            <span className="text-[#5C544B] text-[10px]">Convex bowls, Lipschitz learning rate</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#E28C05] block">03. K-Means Clustering</span>
            <span className="text-[#5C544B] text-[10px]">Lloyd coordinate descent, Voronoi</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#33634B] block">04. Logistic Regression</span>
            <span className="text-[#5C544B] text-[10px]">Sigmoid probabilities, Log Loss, cutoffs</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#1848B8] block">05. Decision Trees</span>
            <span className="text-[#5C544B] text-[10px]">Gini impurity vs Shannon entropy</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#6E3867] block">06. PCA Reduction</span>
            <span className="text-[#5C544B] text-[10px]">Covariance spectral eigenvectors</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#C83226] block">07. Ensemble Learning</span>
            <span className="text-[#5C544B] text-[10px]">Bagging, Boosting, error correlation</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#1848B8] block">08. Features & Labels</span>
            <span className="text-[#5C544B] text-[10px]">Design matrix X, One-Hot, Z-scores</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#E28C05] block">09. Train/Test Splits</span>
            <span className="text-[#5C544B] text-[10px]">Stratification, avoiding data leakage</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#C83226] block">10. Loss Functions</span>
            <span className="text-[#5C544B] text-[10px]">MSE, MAE, Huber, Binary Cross-Entropy</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#6E3867] block">11. Bias-Variance</span>
            <span className="text-[#5C544B] text-[10px]">Capacity d=1 to d=9, Runge oscillation</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#33634B] block">12. Evaluation Metrics</span>
            <span className="text-[#5C544B] text-[10px]">Confusion Matrix, Precision, Recall, F1</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#E28C05] block">13. K-Nearest Neighbors</span>
            <span className="text-[#5C544B] text-[10px]">Spatial proximity, majority ballot</span>
          </div>
          <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
            <span className="font-bold text-[#1848B8] block">14. Regularization</span>
            <span className="text-[#5C544B] text-[10px]">L1 Lasso diamond corners vs L2 Ridge</span>
          </div>
        </div>
      </div>

      {/* 5. Quick Nav CTA */}
      <div className="p-6 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-sm font-black text-[#1A1715] block">Ready to explore the visual workbench?</span>
          <span className="text-xs text-[#5C544B]">Start with foundational concept cards or enter the Interactive Algorithm Lab.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/concepts"
            className="px-4 py-2 bg-[#1848B8] text-[#FAF7F0] font-black text-xs border border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#143c9c]"
          >
            EXPLORE CONCEPTS
          </Link>
          <Link
            href="/lab"
            className="px-4 py-2 bg-[#FAF7F0] text-[#1A1715] font-black text-xs border border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#E8E1D3]"
          >
            ENTER LAB
          </Link>
        </div>
      </div>
    </div>
  );
}
