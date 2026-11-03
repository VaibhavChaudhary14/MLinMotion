'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { TapeCounter } from '@/components/ui/TapeCounter';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { CodeReader } from '@/components/ui/CodeReader';
import { GlyphPoint } from '@/components/ui/GlyphPoint';
import { Badge } from '@/components/ui/Badge';
import { AnalogButton } from '@/components/ui/AnalogButton';
import {
  generateBlobs,
  generateConcentricRings,
  generateElongated,
} from '@/lib/datasets/benchmarks';
import {
  initializeCentroidsKMeansPlusPlus,
  initializeCentroidsRandom,
  runFullKMeansTrace,
  KMeansStepResult,
  CENTROID_COLORS,
} from '@/lib/math/kmeans';
import { saveExperimentRecord } from '@/lib/adaptive/recommender';
import { Sparkles, Eye, Code, Bookmark, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const PYTHON_KMEANS_CODE = [
  'import numpy as np',
  'from scipy.spatial.distance import cdist',
  '',
  'def kmeans_step(X, centroids):',
  '    # Step 1: Compute pairwise squared Euclidean distances',
  '    dists = cdist(X, centroids, metric="sqeuclidean")',
  '    ',
  '    # Step 2: Assign point to nearest centroid index',
  '    labels = np.argmin(dists, axis=1)',
  '    ',
  '    # Step 3: Recompute centroid means for each partition',
  '    new_centroids = np.array([',
  '        X[labels == k].mean(axis=0) if np.sum(labels == k) > 0 else centroids[k]',
  '        for k in range(len(centroids))',
  '    ])',
  '    return labels, new_centroids',
];

export const AlgorithmCinema: React.FC = () => {
  // Preset selector
  const [datasetPreset, setDatasetPreset] = useState<'blobs' | 'concentric' | 'elongated'>('blobs');
  const [initMethod, setInitMethod] = useState<'kmeans++' | 'random'>('kmeans++');
  const [kValue, setKValue] = useState<number>(3);
  const [viewMode, setViewMode] = useState<'both' | 'canvas' | 'code'>('both');

  // Simulation steps and playhead state
  const [traceSteps, setTraceSteps] = useState<KMeansStepResult[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Initialize data and trace
  const resetSimulation = (preset = datasetPreset, k = kValue, init = initMethod) => {
    setIsPlaying(false);
    let pts = generateBlobs(k, 25, 42);
    if (preset === 'concentric') pts = generateConcentricRings(80, 77);
    if (preset === 'elongated') pts = generateElongated(99);

    const initialCentroids =
      init === 'kmeans++'
        ? initializeCentroidsKMeansPlusPlus(pts, k, 42)
        : initializeCentroidsRandom(pts, k, 13);

    const fullTrace = runFullKMeansTrace(pts, initialCentroids, 16);
    setTraceSteps(fullTrace);
    setCurrentStepIdx(0);
  };

  useEffect(() => {
    resetSimulation(datasetPreset, kValue, initMethod);
  }, [datasetPreset, kValue, initMethod]);

  // Playhead timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= traceSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, traceSteps.length, speedMs]);

  const currentStep = traceSteps[currentStepIdx] || traceSteps[0];
  if (!currentStep) return null;

  const { points, centroids, trace, inertia, stage } = currentStep;

  const handleSaveToNotebook = () => {
    saveExperimentRecord({
      name: `K-Means Cinema (${datasetPreset.toUpperCase()} K=${kValue})`,
      datasetName: `${datasetPreset.toUpperCase()} Benchmark`,
      datasetFingerprint: `preset-${datasetPreset}-k${kValue}`,
      algorithm: 'K-Means (Lloyd)',
      taskType: 'clustering',
      hyperparameters: { k: kValue, init: initMethod, iterations: currentStep.iteration },
      metrics: {
        Inertia: inertia,
        'Final Iteration': currentStep.iteration,
        Stage: stage,
      },
      runtimeMs: 14.2,
      warnings:
        datasetPreset === 'concentric'
          ? ['K-means assumes spherical convex clusters; concentric ring geometry fails mathematically.']
          : [],
      notes: `Inspected in Algorithm Cinema. ${trace.description}`,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Plate */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              ALGORITHM CINEMA // SCENE PLAYHEAD
            </span>
          </div>
          <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
            K-Means Clustering: Iteration Mechanics
          </h1>
          <p className="font-mono text-xs text-[#5C544B] mt-0.5">
            Every frame is computed deterministically from real coordinate geometry and vector distances.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <AnalogButton
            variant="secondary"
            size="sm"
            onClick={handleSaveToNotebook}
            className="flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B]" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>LOG TO NOTEBOOK</span>
              </>
            )}
          </AnalogButton>
        </div>
      </div>

      {/* Preset & Hyperparameter Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[inset_1.5px_1.5px_0px_rgba(26,23,21,0.15)]">
        {/* Preset Selector */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C544B]">
            DATASET GEOMETRY
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'blobs', label: 'GAUSSIAN BLOBS' },
              { id: 'concentric', label: 'CONCENTRIC RINGS' },
              { id: 'elongated', label: 'ANISOTROPIC' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDatasetPreset(p.id as any)}
                className={`font-mono text-xs font-bold px-2.5 py-1 border-[1.5px] border-[#1A1715] ${
                  datasetPreset === p.id
                    ? 'bg-[#1848B8] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* K Selector */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C544B]">
            NUMBER OF CENTROIDS (K)
          </span>
          <div className="flex items-center gap-1">
            {[2, 3, 4, 5].map((k) => (
              <button
                key={k}
                onClick={() => setKValue(k)}
                className={`w-8 h-7 font-mono text-xs font-bold border-[1.5px] border-[#1A1715] ${
                  kValue === k
                    ? 'bg-[#C83226] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Initialization Method */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C544B]">
            INITIALIZATION HEURISTIC
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'kmeans++', label: 'K-MEANS++ (D² SEEDING)' },
              { id: 'random', label: 'UNIFORM RANDOM' },
            ].map((init) => (
              <button
                key={init.id}
                onClick={() => setInitMethod(init.id as any)}
                className={`font-mono text-xs font-bold px-2 py-1 border-[1.5px] border-[#1A1715] ${
                  initMethod === init.id
                    ? 'bg-[#33634B] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                {init.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Cinema Screen: Canvas + Synchronized Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: The Analog Lab Simulation Canvas (8 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <AnalogCard
            variant="card"
            headerEyebrow={trace.stageName}
            headerTitle={`INSPECTION VIEW // ITERATION ${currentStep.iteration}`}
            headerAction={
              <div className="flex items-center gap-2">
                <Badge variant={stage === 'converged' ? 'sage' : 'amber'}>
                  {stage === 'converged' ? 'CONVERGED' : 'COMPUTING'}
                </Badge>
              </div>
            }
          >
            {/* 2D Coordinate Grid Canvas */}
            <div className="relative w-full aspect-[4/3] bg-[#FAF7F0] border-[1.5px] border-[#1A1715] overflow-hidden select-none">
              <svg viewBox="0 0 600 450" className="w-full h-full">
                {/* 40px Coordinate Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="600" height="450" fill="url(#grid)" />

                {/* Major Axis Lines with Triangular Arrowheads */}
                <line x1="20" y1="430" x2="580" y2="430" stroke="#1A1715" strokeWidth="1.5" />
                <polygon points="585,430 575,426 575,434" fill="#1A1715" />
                <line x1="20" y1="430" x2="20" y2="20" stroke="#1A1715" strokeWidth="1.5" />
                <polygon points="20,15 16,25 24,25" fill="#1A1715" />

                {/* Grid Tick Labels */}
                {[100, 200, 300, 400, 500].map((tick) => (
                  <g key={`x-${tick}`}>
                    <line x1={tick} y1={426} x2={tick} y2={434} stroke="#1A1715" strokeWidth="1" />
                    <text
                      x={tick}
                      y={445}
                      textAnchor="middle"
                      className="font-mono text-[9px] fill-[#948B7D]"
                    >
                      {tick}
                    </text>
                  </g>
                ))}

                {/* Historical Centroid Pen Trajectory (1.5px dashed pen line with sequence dots) */}
                {centroids.map((c) => (
                  <g key={`traj-${c.id}`}>
                    {c.history.length > 1 && (
                      <polyline
                        points={c.history.map((h) => `${h.x},${h.y}`).join(' ')}
                        fill="none"
                        stroke={c.color}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                      />
                    )}
                    {c.history.map((h, hIdx) => (
                      <circle
                        key={`h-${c.id}-${hIdx}`}
                        cx={h.x}
                        cy={h.y}
                        r={2.5}
                        fill="#FAF7F0"
                        stroke={c.color}
                        strokeWidth={1.5}
                      />
                    ))}
                  </g>
                ))}

                {/* Data Points paired with distinct Bauhaus primaries + geometric glyphs */}
                {points.map((p) => (
                  <GlyphPoint
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    cluster={p.cluster}
                    isOutlier={p.isOutlier}
                  />
                ))}

                {/* Target Disc Centroids (Concentric target disc dia 18px) */}
                {centroids.map((c) => (
                  <GlyphPoint
                    key={`centroid-${c.id}`}
                    x={c.x}
                    y={c.y}
                    cluster={c.id}
                    isCentroid={true}
                    label={c.id + 1}
                  />
                ))}
              </svg>

              {/* In-Canvas HUD Plate */}
              <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border-[1.5px] border-[#1A1715] p-2 shadow-[2px_2px_0px_#1A1715] font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between gap-3 text-[#5C544B]">
                  <span>INERTIA J(c, μ):</span>
                  <span className="font-bold text-[#1A1715] tnum">
                    {inertia > 0 ? inertia : 'UNASSIGNED'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[#5C544B]">
                  <span>ACTIVE POINTS:</span>
                  <span className="font-bold text-[#1A1715] tnum">{points.length}</span>
                </div>
              </div>
            </div>

            {/* Tape Counter Stepper Controls */}
            <div className="mt-3 flex items-center justify-between">
              <TapeCounter
                currentStep={currentStepIdx}
                totalSteps={traceSteps.length - 1}
                isPlaying={isPlaying}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
                onStepForward={() => setCurrentStepIdx((prev) => Math.min(traceSteps.length - 1, prev + 1))}
                onStepBack={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                onReset={() => {
                  setIsPlaying(false);
                  setCurrentStepIdx(0);
                }}
                speedMs={speedMs}
                onSpeedChange={(spd) => setSpeedMs(spd)}
              />

              {/* Glyph Legend Badge Bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1848B8] border border-[#1A1715]" />
                  <span>K₁</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715] rotate-45" />
                  <span>K₂</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-[#E28C05]" />
                  <span>K₃</span>
                </div>
              </div>
            </div>
          </AnalogCard>
        </div>

        {/* Right: Under-The-Hood Background Execution & Synchronized Code (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Active Mathematical Notation Plate */}
          <AnalogCard
            variant="card"
            headerEyebrow="MATHEMATICAL FORMULATION"
            headerTitle="OBJECTIVE & UPDATE EQUATION"
          >
            <FormulaPlate
              latex={trace.equationLatex}
              label={trace.stageName}
              displayMode={true}
            />
            <p className="font-mono text-xs text-[#1A1715] mt-2.5 leading-relaxed bg-[#F4EFE4] p-2 border-[1px] border-[#D8CFC0]">
              {trace.description}
            </p>
          </AnalogCard>

          {/* Synchronized Code-to-Visual Bridge */}
          <CodeReader
            codeLines={PYTHON_KMEANS_CODE}
            activeLineNumber={trace.codeLine}
            title="SYNCHRONIZED NUMPY IMPLEMENTATION"
          />

          {/* Scientific Metric Instrumentation Box */}
          <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715]">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5 mb-2">
              <span className="font-mono text-[10px] font-bold uppercase text-[#5C544B]">
                INTERNAL STATE VARIABLES
              </span>
              <span className="font-mono text-[10px] text-[#C83226] font-bold">
                TRACE EMITTER
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {Object.entries(trace.metrics).map(([k, v]) => (
                <div key={k} className="p-1.5 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                  <span className="text-[10px] text-[#5C544B] block">{k}</span>
                  <span className="font-bold text-[#1A1715] tnum">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pathological Warning if Concentric or Non-Spherical */}
          {datasetPreset === 'concentric' && (
            <div className="flex items-start gap-2 p-3 bg-[#C83226]/10 border-[1.5px] border-[#C83226]">
              <AlertTriangle className="w-4 h-4 text-[#C83226] shrink-0 mt-0.5" />
              <div className="font-mono text-xs">
                <span className="font-bold text-[#C83226] block">ALGORITHM LIMITATION FLAGGED</span>
                <p className="text-[#1A1715] text-[11px] mt-0.5">
                  Notice how Voronoi lines slice directly through the concentric circle. Because K-means computes linear hyperplanes via L2 norm, it cannot unwrap manifold topologies.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
