'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroKMeansSimulation } from '@/components/landing/HeroKMeansSimulation';
import {
  LinearRegressionThumb,
  GradientDescentThumb,
  KMeansThumb,
  LogisticRegressionThumb,
  DecisionTreesThumb,
  PCAThumb,
} from '@/components/landing/AlgorithmThumbnails';
import {
  ArrowRight,
  Eye,
  Sliders,
  AlertTriangle,
  Code2,
  Database,
  Layers,
  Sparkles,
  GitCompare,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function LandingPage() {
  // State for the Algorithm Comparison interactive preview in Section F
  const [comparisonDataset, setComparisonDataset] = useState<'blobs' | 'concentric'>('concentric');

  return (
    <div className="w-full bg-[#F4EFE4] text-[#1A1715] flex flex-col">
      {/* =========================================================================
          B. HERO SECTION
          ========================================================================= */}
      <section className="border-b-[1.5px] border-[#1A1715] bg-[#F4EFE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (6 cols on desktop) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]">
                <span className="w-2 h-2 bg-[#C83226]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
                  INTERACTIVE MACHINE LEARNING LAB
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-mono text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#1A1715] leading-[1.12]">
                Stop memorizing algorithms. <br />
                <span className="text-[#1848B8]">Start seeing how they work.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="font-mono text-sm sm:text-base text-[#5C544B] leading-relaxed max-w-xl">
                Explore machine learning through interactive visualizations, real experiments, mathematical intuition and code. Change a variable. Watch the algorithm respond. Understand why.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/cinema"
                  className="px-5 py-2.5 bg-[#C83226] text-[#FAF7F0] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] hover:bg-[#b0291f] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all flex items-center gap-2"
                >
                  <span>Enter the Lab →</span>
                </Link>

                <Link
                  href="#paths"
                  className="px-4 py-2.5 bg-[#FAF7F0] text-[#1A1715] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Explore Learning Paths
                </Link>
              </div>

              {/* Small Supporting Text */}
              <div className="pt-2 text-xs font-mono text-[#948B7D] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#1848B8] rounded-full inline-block" />
                <span>Built for curious learners, from first principles to implementation.</span>
              </div>
            </div>

            {/* Right Column (6 cols): Signature Centerpiece Simulation */}
            <div className="lg:col-span-6 w-full max-w-lg lg:max-w-none mx-auto">
              <HeroKMeansSimulation />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          C. CONCEPT STRIP
          ========================================================================= */}
      <section className="border-b-[1.5px] border-[#1A1715] bg-[#FAF7F0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1A1715] font-mono">
            {[
              { num: '01', title: 'VISUALIZE', desc: 'See algorithms in motion.' },
              { num: '02', EXPERIMENT: true, title: 'EXPERIMENT', desc: 'Change parameters and explore outcomes.' },
              { num: '03', title: 'UNDERSTAND', desc: 'Inspect equations and intermediate states.' },
              { num: '04', title: 'IMPLEMENT', desc: 'Connect intuition with Python.' },
            ].map((item) => (
              <div key={item.num} className="p-4 sm:p-5 flex flex-col justify-between space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#C83226] tracking-widest">{item.num} —</span>
                  <span className="text-xs font-bold text-[#1A1715] uppercase tracking-wider">{item.title}</span>
                </div>
                <p className="text-xs text-[#5C544B] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          D. HOW LEARNING WORKS
          ========================================================================= */}
      <section id="how-it-works" className="border-b-[1.5px] border-[#1A1715] bg-[#F4EFE4] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              A DIFFERENT WAY TO LEARN
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              From intuition to implementation.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#5C544B] leading-relaxed">
              Every concept is an opportunity to explore, question and experiment.
            </p>
          </div>

          {/* 3-Step Editorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Step 01: SEE IT */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
                  <span className="text-xs font-bold text-[#1848B8]">01. SEE IT</span>
                  {/* Geometric mark */}
                  <div className="w-5 h-5 border border-[#1A1715] bg-[#FAF7F0] flex items-center justify-center">
                    <Eye className="w-3 h-3 text-[#1848B8]" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715] uppercase tracking-tight">
                  Visual Storytelling & Geometry
                </h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Understand the problem through visual storytelling, real-world intuition and diagrams before looking at code.
                </p>
              </div>

              {/* Technical Schematic Box */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#1848B8] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#1848B8]" />
                  <span>VORONOI PARTITIONING</span>
                </div>
                <span className="text-[#5C544B] text-[10px] block">
                  Watch spatial space split into convex polygonal cells based on distance.
                </span>
              </div>
            </div>

            {/* Step 02: PLAY WITH IT */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
                  <span className="text-xs font-bold text-[#E28C05]">02. PLAY WITH IT</span>
                  <div className="w-5 h-5 border border-[#1A1715] bg-[#FAF7F0] flex items-center justify-center">
                    <Sliders className="w-3 h-3 text-[#E28C05]" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715] uppercase tracking-tight">
                  Manipulate & Predict Execution
                </h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Change inputs, predict outcomes, step through algorithm execution and inspect intermediate calculations.
                </p>
              </div>

              {/* Technical Schematic Box */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#E28C05] font-bold">
                  <span className="w-2 h-2 bg-[#E28C05]" />
                  <span>STEPPING TAPE COUNTER</span>
                </div>
                <span className="text-[#5C544B] text-[10px] block">
                  Control the iteration clock. Replay scenes. Inspect parameter shifts.
                </span>
              </div>
            </div>

            {/* Step 03: BREAK IT. UNDERSTAND IT. */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2">
                  <span className="text-xs font-bold text-[#C83226]">03. BREAK IT. UNDERSTAND IT.</span>
                  <div className="w-5 h-5 border border-[#1A1715] bg-[#FAF7F0] flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-[#C83226]" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715] uppercase tracking-tight">
                  Pathologies & Code Bridging
                </h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Create failure cases, examine mathematical limitations and connect equations directly to production Python code.
                </p>
              </div>

              {/* Technical Schematic Box */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-[#C83226] font-bold">
                  <span className="w-2 h-2 bg-[#C83226]" />
                  <span>TOPOLOGICAL FAILURE MODES</span>
                </div>
                <span className="text-[#5C544B] text-[10px] block">
                  Discover where spherical assumptions break down on manifolds.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          E. ALGORITHM EXPLORER
          ========================================================================= */}
      <section id="explorer" className="border-b-[1.5px] border-[#1A1715] bg-[#FAF7F0] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
                THE ALGORITHM INDEX
              </span>
              <h2 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
                Explore what makes each algorithm tick.
              </h2>
            </div>
            <Link
              href="/concepts"
              className="font-mono text-xs font-bold uppercase text-[#1848B8] hover:underline underline-offset-4 flex items-center gap-1 shrink-0"
            >
              <span>View all Visual Concept Cards →</span>
            </Link>
          </div>

          {/* 7 Technical Concept Index Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
            {/* 1. Linear Regression */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#1848B8]">SUPERVISED</span>
                  <span>CARD 01</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">Linear Regression</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Fit a line. Understand residuals. Predict continuous values.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <LinearRegressionThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/linear-regression"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 2. Gradient Descent */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#C83226]">OPTIMIZATION</span>
                  <span>CARD 02</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">Gradient Descent</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Watch parameters move toward lower loss along the surface.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <GradientDescentThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/gradient-descent"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 3. K-means */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#1848B8]">CLUSTERING</span>
                  <span>CARD 03</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">K-means Clustering</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Assign points. Update centroids. Repeat until convergence.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <KMeansThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/kmeans"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 4. Logistic Regression */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#6E3867]">CLASSIFICATION</span>
                  <span>CARD 04</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">Logistic Regression</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Sigmoid link function, calibrated odds, and decision boundaries.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <LogisticRegressionThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/logistic-regression"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 5. Decision Trees */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#33634B]">NON-PARAMETRIC</span>
                  <span>CARD 05</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">Decision Trees</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Recursive orthogonal splits and Gini impurity reduction.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <DecisionTreesThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/decision-trees"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 6. PCA */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#948B7D]">
                  <span className="uppercase font-bold text-[#E28C05]">PROJECTION</span>
                  <span>CARD 06</span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1715]">Principal Component Analysis</h3>
                <p className="text-xs text-[#5C544B] leading-snug">Orthogonal covariance eigenvectors and maximum variance retention.</p>
              </div>

              {/* Thumbnail */}
              <div className="w-full h-24 border border-[#1A1715] overflow-hidden">
                <PCAThumb />
              </div>

              <div className="pt-2 border-t border-[#D8CFC0]">
                <Link
                  href="/concepts/pca"
                  className="text-[11px] font-bold text-[#1A1715] hover:text-[#C83226] uppercase flex items-center justify-between group"
                >
                  <span>Open Concept Deck</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 7. Ensemble Learning */}
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] flex flex-col justify-between space-y-3 sm:col-span-2 lg:col-span-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#948B7D]">
                    <span className="uppercase font-bold text-[#C83226]">META-LEARNING</span>
                    <span>CARD 07</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A1715]">Ensemble Learning: Forests, Boosting & Stacking</h3>
                  <p className="text-xs text-[#5C544B] leading-snug">
                    Combine diverse weak learners to reduce variance (Bagging) or bias (Boosting) via Condorcet majority consensus.
                  </p>
                </div>
                <Link
                  href="/concepts/ensemble-learning"
                  className="px-4 py-2 bg-[#C83226] text-[#FAF7F0] font-bold text-xs uppercase tracking-wider border border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#b0291f] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <span>Explore Ensemble Deck →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          F. SIGNATURE FEATURE — ALGORITHM COMPARISON
          ========================================================================= */}
      <section className="border-b-[1.5px] border-[#1A1715] bg-[#E8E1D3]/50 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-2 max-w-2xl font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C83226]">
              SAME DATA. DIFFERENT MODELS.
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              One dataset. <br />Different ways of seeing it.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C544B] leading-relaxed">
              Compare compatible algorithms on the same dataset. Explore their predictions, decision boundaries, metrics and limitations.
            </p>
          </div>

          {/* Interactive Multi-Model Demonstration Plate */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] p-5 sm:p-6 space-y-5 font-mono">
            {/* Top Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8CFC0] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold text-[#5C544B]">SELECT BENCHMARK GEOMETRY:</span>
                <button
                  onClick={() => setComparisonDataset('concentric')}
                  className={`text-xs font-bold px-3 py-1 border-[1.5px] border-[#1A1715] ${
                    comparisonDataset === 'concentric'
                      ? 'bg-[#1848B8] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                      : 'bg-[#FAF7F0] text-[#1A1715]'
                  }`}
                >
                  CONCENTRIC RINGS
                </button>
                <button
                  onClick={() => setComparisonDataset('blobs')}
                  className={`text-xs font-bold px-3 py-1 border-[1.5px] border-[#1A1715] ${
                    comparisonDataset === 'blobs'
                      ? 'bg-[#1848B8] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                      : 'bg-[#FAF7F0] text-[#1A1715]'
                  }`}
                >
                  SEPARATED BLOBS
                </button>
              </div>

              <div className="text-[11px] text-[#5C544B] italic">
                "Different assumptions lead to different results."
              </div>
            </div>

            {/* Side-by-Side Model Comparison Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model A: K-Means */}
              <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1715]">MODEL A: K-MEANS</span>
                  <span className="text-[10px] text-[#C83226] font-bold">
                    {comparisonDataset === 'concentric' ? 'FAILED PARTITION' : 'CONVERGED'}
                  </span>
                </div>

                {/* SVG Visual */}
                <div className="w-full aspect-[16/10] bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
                  <svg viewBox="0 0 320 200" className="w-full h-full">
                    {comparisonDataset === 'concentric' ? (
                      <>
                        {/* Outer and Inner Ring sliced in half by straight Voronoi line */}
                        <circle cx="160" cy="100" r="70" fill="none" stroke="#D8CFC0" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="160" cy="100" r="30" fill="none" stroke="#D8CFC0" strokeWidth="1" strokeDasharray="2 2" />
                        {/* Voronoi hyperplane cut */}
                        <line x1="160" y1="10" x2="160" y2="190" stroke="#1A1715" strokeWidth="1.5" />
                        {/* Points on left side = Ultramarine, right side = Vermilion */}
                        <circle cx="130" cy="100" r="4" fill="#1848B8" />
                        <circle cx="110" cy="80" r="4" fill="#1848B8" />
                        <circle cx="110" cy="120" r="4" fill="#1848B8" />
                        <circle cx="190" cy="100" r="4" fill="#C83226" />
                        <circle cx="210" cy="80" r="4" fill="#C83226" />
                        <circle cx="210" cy="120" r="4" fill="#C83226" />
                      </>
                    ) : (
                      <>
                        {/* Two clean spherical blobs */}
                        <circle cx="85" cy="100" r="6" fill="#1848B8" />
                        <circle cx="105" cy="80" r="6" fill="#1848B8" />
                        <circle cx="95" cy="120" r="6" fill="#1848B8" />
                        <circle cx="230" cy="90" r="6" fill="#C83226" />
                        <circle cx="250" cy="110" r="6" fill="#C83226" />
                        <circle cx="220" cy="120" r="6" fill="#C83226" />
                        <line x1="160" y1="10" x2="160" y2="190" stroke="#1A1715" strokeWidth="1" strokeDasharray="2 2" />
                      </>
                    )}
                  </svg>
                </div>
                <p className="text-[11px] text-[#5C544B] leading-tight">
                  {comparisonDataset === 'concentric'
                    ? 'Linear Voronoi hyperplanes split geometric rings down the center due to L2 Euclidean distance assumption.'
                    : 'Spherical convex clusters match K-Means assumptions cleanly.'}
                </p>
              </div>

              {/* Model B: DBSCAN */}
              <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1715]">MODEL B: DBSCAN</span>
                  <span className="text-[10px] text-[#33634B] font-bold">TOPOLOGICALLY CORRECT</span>
                </div>

                {/* SVG Visual */}
                <div className="w-full aspect-[16/10] bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
                  <svg viewBox="0 0 320 200" className="w-full h-full">
                    {comparisonDataset === 'concentric' ? (
                      <>
                        {/* Inner Ring all Ultramarine */}
                        <circle cx="140" cy="100" r="4" fill="#1848B8" />
                        <circle cx="180" cy="100" r="4" fill="#1848B8" />
                        <circle cx="160" cy="80" r="4" fill="#1848B8" />
                        <circle cx="160" cy="120" r="4" fill="#1848B8" />
                        {/* Outer Ring all Vermilion */}
                        <circle cx="90" cy="100" r="4" fill="#C83226" />
                        <circle cx="230" cy="100" r="4" fill="#C83226" />
                        <circle cx="160" cy="30" r="4" fill="#C83226" />
                        <circle cx="160" cy="170" r="4" fill="#C83226" />
                      </>
                    ) : (
                      <>
                        <circle cx="85" cy="100" r="6" fill="#1848B8" />
                        <circle cx="105" cy="80" r="6" fill="#1848B8" />
                        <circle cx="95" cy="120" r="6" fill="#1848B8" />
                        <circle cx="230" cy="90" r="6" fill="#C83226" />
                        <circle cx="250" cy="110" r="6" fill="#C83226" />
                        <circle cx="220" cy="120" r="6" fill="#C83226" />
                      </>
                    )}
                  </svg>
                </div>
                <p className="text-[11px] text-[#5C544B] leading-tight">
                  {comparisonDataset === 'concentric'
                    ? 'Density-connected components follow continuous topological paths regardless of non-convex shape.'
                    : 'Discovers density-reachable clusters without forcing centroid placement.'}
                </p>
              </div>
            </div>

            {/* Bottom CTA Strip */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D8CFC0]">
              <span className="text-xs text-[#5C544B]">
                Subject models to identical evaluation splits and observe where geometric assumptions fail.
              </span>
              <Link
                href="/compare"
                className="px-4 py-2 bg-[#1A1715] text-[#FAF7F0] font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#C83226] hover:bg-[#333] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Explore Model Comparison →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          G. PERSONAL DATA LAB
          ========================================================================= */}
      <section className="border-b-[1.5px] border-[#1A1715] bg-[#FAF7F0] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-2 max-w-2xl font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C83226]">
              YOUR DATA. YOUR EXPERIMENTS.
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              Bring your own data into the lab.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C544B] leading-relaxed">
              Move beyond toy examples. Upload a supported dataset, configure an experiment and discover how different algorithms interpret your data.
            </p>
          </div>

          {/* Interface Preview Plate */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] p-5 sm:p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2 text-xs">
              <span className="font-bold text-[#1A1715]">MY DATA LAB // WORKBENCH PREVIEW</span>
              <span className="text-[10px] text-[#1848B8] font-bold">CSV UPLOADER & PIPELINE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              {/* Box 1: Dataset Preview */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#5C544B] block">1. DATASET PREVIEW</span>
                <p className="text-[11px] text-[#1A1715]">Ingest custom CSV or select curated benchmarks.</p>
                <div className="mt-2 text-[9px] bg-[#FAF7F0] p-1 border border-[#D8CFC0]">
                  Rows: 150 | Cols: 4
                </div>
              </div>

              {/* Box 2: Quality Assistant */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#C83226] block">2. DATA QUALITY</span>
                <p className="text-[11px] text-[#1A1715]">Automated audit for missing values and 1.5×IQR outliers.</p>
                <div className="mt-2 text-[9px] bg-[#FAF7F0] p-1 border border-[#D8CFC0] text-[#33634B] font-bold">
                  ✓ 0 Empty Cells
                </div>
              </div>

              {/* Box 3: Preprocessor */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#1848B8] block">3. PREPROCESSING</span>
                <p className="text-[11px] text-[#1A1715]">StandardScaler, MinMax scaling, train/test split.</p>
                <div className="mt-2 text-[9px] bg-[#FAF7F0] p-1 border border-[#D8CFC0]">
                  StandardScaler: Active
                </div>
              </div>

              {/* Box 4: Execution */}
              <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#E28C05] block">4. ALGORITHM RUNNER</span>
                <p className="text-[11px] text-[#1A1715]">Train models without arbitrary server-side execution.</p>
                <div className="mt-2 text-[9px] bg-[#FAF7F0] p-1 border border-[#D8CFC0] font-bold">
                  K-Means / OLS Ready
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#D8CFC0]">
              <span className="text-[11px] text-[#5C544B] italic">
                Inspect data quality, preprocessing, evaluation and model limitations.
              </span>
              <Link
                href="/datalab"
                className="px-4 py-2 bg-[#E28C05] text-[#1A1715] font-mono text-xs font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#c97c03] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Explore My Data Lab →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          H. LEARNING PATHS
          ========================================================================= */}
      <section id="paths" className="border-b-[1.5px] border-[#1A1715] bg-[#F4EFE4] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-2 max-w-2xl font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C83226]">
              FIND YOUR STARTING POINT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              A path for every stage of curiosity.
            </h2>
          </div>

          {/* 3 Learning Path Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Path 01 */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2 text-xs">
                  <span className="font-bold text-[#1848B8]">01 — ML FOUNDATIONS</span>
                  <span className="text-[10px] text-[#948B7D]">PATHWAY A</span>
                </div>
                <h3 className="text-base font-bold text-[#1A1715]">Intuition & Geometry</h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Build intuition around datasets, features, evaluation, overfitting and underfitting.
                </p>
                <div className="text-[10px] text-[#948B7D] pt-1">
                  <span className="font-bold text-[#1A1715]">AUDIENCE: </span>
                  Beginners & Data Science starters.
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC0]">
                <Link
                  href="/lessons"
                  className="w-full py-1.5 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#F0EAE0] font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore path →</span>
                </Link>
              </div>
            </div>

            {/* Path 02 */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2 text-xs">
                  <span className="font-bold text-[#C83226]">02 — CORE ML ALGORITHMS</span>
                  <span className="text-[10px] text-[#948B7D]">PATHWAY B</span>
                </div>
                <h3 className="text-base font-bold text-[#1A1715]">Algorithmic Mechanics</h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Explore regression, classification, clustering, dimensionality reduction and optimization.
                </p>
                <div className="text-[10px] text-[#948B7D] pt-1">
                  <span className="font-bold text-[#1A1715]">AUDIENCE: </span>
                  Undergrad CS & Practitioners.
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC0]">
                <Link
                  href="/lessons"
                  className="w-full py-1.5 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#F0EAE0] font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore path →</span>
                </Link>
              </div>
            </div>

            {/* Path 03 */}
            <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-2 text-xs">
                  <span className="font-bold text-[#33634B]">03 — GATE DA VISUAL REVISION</span>
                  <span className="text-[10px] text-[#948B7D]">PATHWAY C</span>
                </div>
                <h3 className="text-base font-bold text-[#1A1715]">Mathematical Foundations</h3>
                <p className="text-xs text-[#5C544B] leading-relaxed">
                  Revisit mathematical foundations, formulas, algorithmic reasoning, numerical problems and practice.
                </p>
                <div className="text-[10px] text-[#948B7D] pt-1">
                  <span className="font-bold text-[#1A1715]">AUDIENCE: </span>
                  GATE DA Aspirants & Interview prep.
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC0]">
                <Link
                  href="/lessons"
                  className="w-full py-1.5 px-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#F0EAE0] font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore path →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          I. FINAL CTA
          ========================================================================= */}
      <section className="bg-[#FAF7F0] py-16 lg:py-24 font-mono">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Subtle Converging Points Geometric Accent */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1848B8]" />
            <span className="w-2.5 h-2.5 bg-[#C83226] rotate-45" />
            <span className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[9px] border-b-[#E28C05]" />
            <span className="w-2.5 h-2.5 bg-[#33634B]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#1A1715] tracking-tight leading-tight">
            The best way to understand an algorithm <br className="hidden sm:inline" />
            is to see what it does.
          </h2>

          <p className="text-xs sm:text-sm text-[#5C544B] max-w-lg mx-auto leading-relaxed">
            Make your next ML concept something you explore, not just something you memorize.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cinema"
              className="px-6 py-3 bg-[#C83226] text-[#FAF7F0] font-mono text-sm font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] hover:bg-[#b0291f] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all flex items-center gap-2"
            >
              <span>Start Exploring →</span>
            </Link>

            <Link
              href="#explorer"
              className="px-5 py-3 bg-[#FAF7F0] text-[#1A1715] font-mono text-sm font-bold uppercase tracking-wider border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Browse Algorithms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
