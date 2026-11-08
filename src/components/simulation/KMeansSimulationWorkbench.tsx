'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  kmeansEngine,
  KMeansSimulationState,
  KMeansConfig,
  KMeansPoint,
} from '@/lib/simulation/kmeansEngine';
import {
  KMEANS_FAILURE_SCENARIOS,
  KMeansFailureScenarioId,
} from '@/lib/datasets/failureScenarios';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { saveExperimentRecord } from '@/lib/adaptive/recommender';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Save,
  Download,
  Crosshair,
  Layers,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const KMeansSimulationWorkbench: React.FC = () => {
  // Scenario & Configuration State
  const [scenarioId, setScenarioId] = useState<KMeansFailureScenarioId>('separated');
  const [kValue, setKValue] = useState<number>(3);
  const [initMethod, setInitMethod] = useState<'kmeans++' | 'random' | 'manual'>('kmeans++');
  const [seed, setSeed] = useState<number>(42);
  const [manualPlacementPoints, setManualPlacementPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isManualPlacingActive, setIsManualPlacingActive] = useState<boolean>(false);

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(750);
  const [predictionMode, setPredictionMode] = useState<boolean>(true);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Engine State
  const activeScenario = KMEANS_FAILURE_SCENARIOS[scenarioId];
  const [simState, setSimState] = useState<KMeansSimulationState>(() => {
    const dataset = activeScenario.generate().points;
    return kmeansEngine.initialize(
      { k: activeScenario.recommendedK, initMethod: 'kmeans++', seed: 42 },
      dataset,
      42
    );
  });

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Synchronize on Scenario Change
  const handleScenarioChange = (newScenarioId: KMeansFailureScenarioId) => {
    setIsPlaying(false);
    setScenarioId(newScenarioId);
    const scen = KMEANS_FAILURE_SCENARIOS[newScenarioId];
    const { points, suggestedManualCentroids } = scen.generate();
    const newK = scen.recommendedK;
    setKValue(newK);
    setManualPlacementPoints(suggestedManualCentroids || []);

    const method = suggestedManualCentroids && suggestedManualCentroids.length >= newK ? 'manual' : initMethod;
    const newState = kmeansEngine.initialize(
      {
        k: newK,
        initMethod: method,
        manualCentroids: suggestedManualCentroids,
        seed,
      },
      points,
      seed
    );

    setSimState(newState);
    setSelectedPointId(newState.points[0]?.id || null);
    setSelectedPrediction(null);
    setPredictionFeedback(null);
  };

  // Reset Simulation
  const handleReset = () => {
    setIsPlaying(false);
    const { points, suggestedManualCentroids } = activeScenario.generate();
    const newState = kmeansEngine.initialize(
      {
        k: kValue,
        initMethod,
        manualCentroids: manualPlacementPoints.length >= kValue ? manualPlacementPoints : suggestedManualCentroids,
        seed,
      },
      points,
      seed
    );
    setSimState(newState);
    setSelectedPointId(newState.points[0]?.id || null);
    setSelectedPrediction(null);
    setPredictionFeedback(null);
  };

  // Re-initialize when K, Init Method, or Seed changes
  useEffect(() => {
    const { points } = activeScenario.generate();
    const newState = kmeansEngine.initialize(
      {
        k: kValue,
        initMethod,
        manualCentroids: manualPlacementPoints.length >= kValue ? manualPlacementPoints : undefined,
        seed,
      },
      points,
      seed
    );
    setSimState(newState);
    setSelectedPointId(newState.points[0]?.id || null);
    setSelectedPrediction(null);
    setPredictionFeedback(null);
  }, [kValue, initMethod, seed]);

  // Stepping Forward
  const handleStepForward = () => {
    if (simState.isConverged) return;

    // Check prediction if prediction mode is on and question exists
    const currentExp = kmeansEngine.getExplanation(simState);
    if (predictionMode && currentExp.predictionPrompt && selectedPrediction) {
      const chosenOpt = currentExp.predictionPrompt.options.find((o) => o.id === selectedPrediction);
      if (chosenOpt) {
        setPredictionFeedback({
          isCorrect: chosenOpt.isCorrect,
          text: currentExp.predictionPrompt.explanation,
        });
      }
    } else {
      setPredictionFeedback(null);
    }

    const nextState = kmeansEngine.step(simState);
    setSimState(nextState);
    setSelectedPrediction(null);
  };

  // Stepping Backward
  const handleStepBack = () => {
    setIsPlaying(false);
    const prevState = kmeansEngine.stepBack(simState);
    setSimState(prevState);
    setPredictionFeedback(null);
    setSelectedPrediction(null);
  };

  // Playhead Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && !simState.isConverged) {
      timer = setInterval(() => {
        setSimState((prev) => {
          if (prev.isConverged) {
            setIsPlaying(false);
            return prev;
          }
          return kmeansEngine.step(prev);
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speedMs, simState.isConverged]);

  // Manual Canvas Click Placement
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isManualPlacingActive) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = Number((((e.clientX - svgRect.left) / svgRect.width) * 600).toFixed(1));
    const clickY = Number((((e.clientY - svgRect.top) / svgRect.height) * 450).toFixed(1));

    const updatedManual = [...manualPlacementPoints, { x: clickX, y: clickY }].slice(0, kValue);
    setManualPlacementPoints(updatedManual);

    if (updatedManual.length === kValue) {
      setIsManualPlacingActive(false);
      setInitMethod('manual');
      const { points } = activeScenario.generate();
      const newState = kmeansEngine.initialize(
        { k: kValue, initMethod: 'manual', manualCentroids: updatedManual, seed },
        points,
        seed
      );
      setSimState(newState);
    }
  };

  // Save Experiment
  const handleSaveExperiment = () => {
    const record = kmeansEngine.exportExperiment(simState);
    saveExperimentRecord({
      algorithm: record.algorithmName,
      name: `K-Means // ${activeScenario.title} (K=${simState.config.k})`,
      datasetName: activeScenario.title,
      datasetFingerprint: `bench-kmeans-${scenarioId}`,
      taskType: 'clustering',
      hyperparameters: {
        K: simState.config.k,
        initMethod: simState.config.initMethod,
        seed: simState.config.seed,
      },
      metrics: {
        WCSS: simState.inertia,
        Iterations: simState.iteration,
        Converged: simState.isConverged ? 'Yes' : 'No',
      },
      runtimeMs: 16,
      warnings: simState.emptyClusterIndices.length > 0 ? [`Empty clusters: ${simState.emptyClusterIndices.join(', ')}`] : [],
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2400);
  };

  // Derived values for multi-representation
  const metrics = useMemo(() => kmeansEngine.getMetrics(simState), [simState]);
  const explanation = useMemo(() => kmeansEngine.getExplanation(simState), [simState]);

  // Selected Point for Distance Table
  const selectedPoint =
    simState.points.find((p) => p.id === selectedPointId) || simState.points[0];

  return (
    <div className="space-y-6 select-none font-mono">
      {/* 1. TOP MASTER CHASSIS PLATE */}
      <div className="p-4 sm:p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1848B8]">
                DETERMINISTIC SIMULATION ENGINE // REFERENCE BENCHMARK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
              K-Means Coordinate Laboratory
            </h1>
            <p className="text-xs text-[#5C544B] max-w-2xl mt-1 leading-relaxed">
              Experience the exact, synchronized mathematical state across the scatterplot, calculation matrix, governing equations, pseudocode, and vectorized Python implementation.
            </p>
          </div>

          {/* Mechanical Tape Counter & Metrics Display */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Iteration Counter */}
            <div className="p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#5C544B]">
                ITERATION
              </span>
              <div className="flex items-center bg-[#1A1715] text-[#FAF7F0] px-3 py-1 border border-[#1A1715]">
                <span className="text-lg font-bold tracking-widest tnum">
                  {String(simState.iteration).padStart(2, '0')}
                </span>
                <span className="text-xs text-[#948B7D] mx-1.5">/</span>
                <span className="text-xs text-[#948B7D] tnum font-semibold">20</span>
              </div>
            </div>

            {/* Current Objective (WCSS / Inertia) */}
            <div className="p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#5C544B]">
                WCSS (INERTIA)
              </span>
              <div className="flex items-center bg-[#1A1715] text-[#C83226] px-3 py-1 border border-[#1A1715]">
                <span className="text-lg font-bold tracking-widest tnum text-[#FAF7F0]">
                  {simState.inertia > 0 ? Math.round(simState.inertia).toLocaleString() : '—'}
                </span>
              </div>
            </div>

            {/* Convergence Status */}
            <div className="p-2 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[#5C544B]">
                STATUS
              </span>
              <div
                className={`flex items-center px-2.5 py-1.5 border border-[#1A1715] text-[11px] font-bold uppercase tracking-wider ${
                  simState.isConverged
                    ? 'bg-[#33634B] text-[#FAF7F0]'
                    : simState.phase === 'assign'
                    ? 'bg-[#1848B8] text-[#FAF7F0]'
                    : simState.phase === 'update'
                    ? 'bg-[#E28C05] text-[#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715]'
                }`}
              >
                {simState.isConverged ? 'CONVERGED' : simState.phase.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* 2. FAILURE LABORATORY BENCHMARK STRIP */}
        <div className="mt-4 pt-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="font-bold text-[#5C544B] uppercase mr-1">FAILURE LABORATORY:</span>
            {(Object.keys(KMEANS_FAILURE_SCENARIOS) as KMeansFailureScenarioId[]).map((id) => {
              const sc = KMEANS_FAILURE_SCENARIOS[id];
              return (
                <button
                  key={id}
                  onClick={() => handleScenarioChange(id)}
                  className={`px-2.5 py-1 font-bold border transition-none uppercase ${
                    scenarioId === id
                      ? 'bg-[#C83226] text-[#FAF7F0] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715]'
                      : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
                  }`}
                >
                  {sc.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <button
              onClick={() => setPredictionMode(!predictionMode)}
              className={`px-2 py-1 border border-[#1A1715] font-bold ${
                predictionMode ? 'bg-[#1848B8] text-[#FAF7F0]' : 'bg-[#E8E1D3] text-[#5C544B]'
              }`}
            >
              PREDICTION MODE: {predictionMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Active Scenario Banner Note */}
        <div className="mt-3 p-3 bg-[#E8E1D3]/50 border border-[#1A1715] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#C83226] font-bold uppercase">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeScenario.eyebrow}</span>
            </div>
            <p className="text-[#5C544B] text-[11px] mt-0.5">{activeScenario.whyKMeansFailsOrSucceeds}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="neutral">K = {kValue}</Badge>
            <Link
              href={`/compare?geometry=${
                scenarioId === 'concentric'
                  ? 'concentric'
                  : scenarioId === 'outliers' || scenarioId === 'poor_init'
                  ? 'elongated'
                  : 'blobs'
              }`}
            >
              <button className="px-2.5 py-1 text-[10px] font-bold uppercase bg-[#FAF7F0] text-[#1848B8] border border-[#1A1715] shadow-[1px_1px_0px_#1A1715] hover:bg-[#E8E1D3] flex items-center gap-1">
                <span>COMPARE IN STUDIO</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY SIMULATION INTERFACE (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: THE VISUAL SCATTERPLOT & CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Convergence Callout Banner */}
          {simState.isConverged && (
            <div className="p-3 bg-[#33634B]/15 border-[1.5px] border-[#33634B] shadow-[2px_2px_0px_#1A1715] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#33634B] shrink-0" />
                <div>
                  <span className="font-bold text-[#33634B] uppercase block">
                    CONVERGENCE ACHIEVED AT ITERATION {simState.iteration} (WCSS: {Math.round(simState.inertia).toLocaleString()})
                  </span>
                  <span className="text-[11px] text-[#5C544B]">
                    Centroid shifts fell below threshold. Compare this partition with DBSCAN and Agglomerative clustering.
                  </span>
                </div>
              </div>
              <Link
                href={`/compare?geometry=${
                  scenarioId === 'concentric'
                    ? 'concentric'
                    : scenarioId === 'outliers' || scenarioId === 'poor_init'
                    ? 'elongated'
                    : 'blobs'
                }`}
                className="shrink-0"
              >
                <button className="px-3 py-1.5 bg-[#1848B8] text-[#FAF7F0] font-bold text-xs uppercase border border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#153a96] flex items-center gap-1.5">
                  <span>BENCHMARK IN STUDIO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          )}

          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-3">
            {/* Canvas Header & Centroid Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1A1715] uppercase tracking-wider text-[11px]">
                  COORDINATE GRID (600 × 450)
                </span>
                <span className="text-[10px] text-[#948B7D]">N = {simState.points.length} POINTS</span>
              </div>

              {/* Centroid Coordinates Legend */}
              <div className="flex items-center gap-2">
                {simState.centroids.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1 px-1.5 py-0.5 border border-[#1A1715] text-[10px] font-bold bg-[#FAF7F0]"
                  >
                    <span className="w-2.5 h-2.5 border border-[#1A1715]" style={{ backgroundColor: c.color }} />
                    <span className="tnum">
                      μ_{c.id + 1}: ({c.x}, {c.y})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative border border-[#1A1715] bg-[#FAF7F0] overflow-hidden shadow-[inset_1.5px_1.5px_0px_rgba(0,0,0,0.1)]">
              {/* Manual Placement Guidance Overlay */}
              {isManualPlacingActive && (
                <div className="absolute top-2 left-2 right-2 bg-[#1A1715] text-[#FAF7F0] px-3 py-1.5 text-xs font-bold flex items-center justify-between z-20 border border-[#FAF7F0]">
                  <span>
                    CLICK ON CANVAS TO PLACE CENTROID μ_{manualPlacementPoints.length + 1} OF {kValue}
                  </span>
                  <button
                    onClick={() => setIsManualPlacingActive(false)}
                    className="text-[10px] text-[#E28C05] hover:underline"
                  >
                    CANCEL
                  </button>
                </div>
              )}

              <svg
                viewBox="0 0 600 450"
                className="w-full h-auto cursor-crosshair block"
                onClick={handleCanvasClick}
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="600" height="450" fill="url(#gridPattern)" />

                {/* Voronoi / Decision Bisector Lines between Centroids */}
                {simState.centroids.length >= 2 &&
                  simState.centroids.map((c1, i) =>
                    simState.centroids.slice(i + 1).map((c2, j) => {
                      const midX = (c1.x + c2.x) / 2;
                      const midY = (c1.y + c2.y) / 2;
                      const dx = c2.x - c1.x;
                      const dy = c2.y - c1.y;
                      // Perpendicular bisector slope
                      const perpX = -dy;
                      const perpY = dx;
                      const scale = 300;
                      return (
                        <line
                          key={`bisect-${c1.id}-${c2.id}`}
                          x1={midX - (perpX / (Math.hypot(perpX, perpY) || 1)) * scale}
                          y1={midY - (perpY / (Math.hypot(perpX, perpY) || 1)) * scale}
                          x2={midX + (perpX / (Math.hypot(perpX, perpY) || 1)) * scale}
                          y2={midY + (perpY / (Math.hypot(perpX, perpY) || 1)) * scale}
                          stroke="#1A1715"
                          strokeWidth="1.2"
                          strokeDasharray="4 4"
                          opacity="0.35"
                        />
                      );
                    })
                  )}

                {/* Centroid Pen Trajectory Trails */}
                {simState.centroids.map((c) => {
                  if (c.history.length <= 1) return null;
                  const pathData = c.history.map((h, i) => `${i === 0 ? 'M' : 'L'} ${h.x} ${h.y}`).join(' ');
                  return (
                    <g key={`trail-g-${c.id}`}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={c.color}
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        opacity="0.8"
                      />
                      {c.history.map((h, hIdx) => (
                        <circle
                          key={`trail-node-${c.id}-${hIdx}`}
                          cx={h.x}
                          cy={h.y}
                          r="2.5"
                          fill={c.color}
                          stroke="#1A1715"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  );
                })}

                {/* Distance Connector Line for Selected Point */}
                {selectedPoint &&
                  simState.centroids.map((c) => {
                    const isAssigned = selectedPoint.cluster === c.id;
                    return (
                      <line
                        key={`line-to-c-${c.id}`}
                        x1={selectedPoint.x}
                        y1={selectedPoint.y}
                        x2={c.x}
                        y2={c.y}
                        stroke={c.color}
                        strokeWidth={isAssigned ? '2' : '1'}
                        strokeDasharray={isAssigned ? 'none' : '3 3'}
                        opacity={isAssigned ? 0.9 : 0.4}
                      />
                    );
                  })}

                {/* Data Points */}
                {simState.points.map((p) => {
                  const isSelected = p.id === selectedPointId;
                  const clusterColor =
                    p.cluster !== undefined && simState.centroids[p.cluster]
                      ? simState.centroids[p.cluster].color
                      : '#948B7D';

                  return (
                    <g
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPointId(p.id);
                      }}
                      className="cursor-pointer"
                    >
                      {/* Selection highlight ring */}
                      {isSelected && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="9"
                          fill="none"
                          stroke="#1A1715"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Point Glyph */}
                      {p.isOutlier ? (
                        <polygon
                          points={`${p.x},${p.y - 6} ${p.x + 6},${p.y + 6} ${p.x - 6},${p.y + 6}`}
                          fill="#C83226"
                          stroke="#1A1715"
                          strokeWidth="1.5"
                        />
                      ) : p.cluster === 0 ? (
                        <circle cx={p.x} cy={p.y} r="4" fill={clusterColor} stroke="#1A1715" strokeWidth="1.2" />
                      ) : p.cluster === 1 ? (
                        <rect
                          x={p.x - 3.5}
                          y={p.y - 3.5}
                          width="7"
                          height="7"
                          transform={`rotate(45 ${p.x} ${p.y})`}
                          fill={clusterColor}
                          stroke="#1A1715"
                          strokeWidth="1.2"
                        />
                      ) : p.cluster === 2 ? (
                        <polygon
                          points={`${p.x},${p.y - 4.5} ${p.x + 4},${p.y + 3.5} ${p.x - 4},${p.y + 3.5}`}
                          fill={clusterColor}
                          stroke="#1A1715"
                          strokeWidth="1.2"
                        />
                      ) : (
                        <rect
                          x={p.x - 3.5}
                          y={p.y - 3.5}
                          width="7"
                          height="7"
                          fill={clusterColor}
                          stroke="#1A1715"
                          strokeWidth="1.2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Centroids: Ø18px Concentric Target Discs */}
                {simState.centroids.map((c) => (
                  <g key={`centroid-${c.id}`} className="pointer-events-none">
                    {/* Outer Target Disc */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r="10"
                      fill="#FAF7F0"
                      stroke={c.color}
                      strokeWidth="3"
                      className="shadow-sm"
                    />
                    {/* Inner Center Dot */}
                    <circle cx={c.x} cy={c.y} r="3.5" fill={c.color} />
                    {/* Label Badge */}
                    <rect
                      x={c.x - 14}
                      y={c.y - 24}
                      width="28"
                      height="12"
                      fill="#1A1715"
                      stroke="#FAF7F0"
                      strokeWidth="1"
                    />
                    <text
                      x={c.x}
                      y={c.y - 15}
                      textAnchor="middle"
                      fill="#FAF7F0"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      μ_{c.id + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Mechanical Playback Control Strip */}
            <div className="p-3 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] flex flex-wrap items-center justify-between gap-3">
              {/* Primary Mechanical Push-Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Reset */}
                <button
                  onClick={handleReset}
                  title="Reset to Iteration 0"
                  className="w-9 h-9 flex items-center justify-center bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RotateCcw className="w-4 h-4 text-[#1A1715]" />
                </button>

                {/* Step Back */}
                <button
                  onClick={handleStepBack}
                  disabled={simState.stepNumber === 0}
                  title="Step Backward"
                  className={`w-9 h-9 flex items-center justify-center border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] ${
                    simState.stepNumber === 0
                      ? 'bg-[#E8E1D3] text-[#948B7D] opacity-60 cursor-not-allowed'
                      : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                  }`}
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play / Pause Toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={simState.isConverged}
                  title={isPlaying ? 'Pause Simulation' : 'Run Continuously'}
                  className={`px-3 h-9 flex items-center gap-2 border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] font-bold text-xs uppercase active:translate-x-[1px] active:translate-y-[1px] ${
                    isPlaying
                      ? 'bg-[#C83226] text-[#FAF7F0]'
                      : simState.isConverged
                      ? 'bg-[#E8E1D3] text-[#948B7D] cursor-not-allowed'
                      : 'bg-[#1848B8] text-[#FAF7F0] hover:bg-[#153a96]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{simState.isConverged ? 'CONVERGED' : 'RUN'}</span>
                    </>
                  )}
                </button>

                {/* Step Forward */}
                <button
                  onClick={handleStepForward}
                  disabled={simState.isConverged}
                  title="Execute Next Step (Lloyd)"
                  className={`px-3 h-9 flex items-center gap-1.5 border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] font-bold text-xs uppercase active:translate-x-[1px] active:translate-y-[1px] ${
                    simState.isConverged
                      ? 'bg-[#E8E1D3] text-[#948B7D] cursor-not-allowed'
                      : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
                  }`}
                >
                  <span>STEP</span>
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Potentiometer */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#5C544B]">SPEED:</span>
                <select
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="px-2 py-1 bg-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  <option value={1400}>0.5x (SLOW)</option>
                  <option value={750}>1.0x (NORMAL)</option>
                  <option value={350}>2.0x (FAST)</option>
                </select>
              </div>

              {/* Action Buttons: Save & Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveExperiment}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase bg-[#FAF7F0] border border-[#1A1715] shadow-[1px_1px_0px_#1A1715] hover:bg-[#F0EAE0] flex items-center gap-1"
                >
                  <Save className="w-3 h-3 text-[#1848B8]" />
                  <span>{savedSuccess ? 'SAVED!' : 'SAVE RUN'}</span>
                </button>
              </div>
            </div>

            {/* Hyperparameter Lever Strip: K and Initialization Method */}
            <div className="p-3 bg-[#F4EFE4] border border-[#1A1715] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* K Value Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#5C544B]">CLUSTERS (K):</span>
                {[2, 3, 4, 5].map((k) => (
                  <button
                    key={k}
                    onClick={() => setKValue(k)}
                    className={`w-6 h-6 flex items-center justify-center font-bold border ${
                      kValue === k
                        ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715]'
                        : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Seeding & Manual Placement */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#5C544B]">INIT METHOD:</span>
                {(['kmeans++', 'random', 'manual'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      if (method === 'manual') {
                        setIsManualPlacingActive(true);
                        setManualPlacementPoints([]);
                      } else {
                        setIsManualPlacingActive(false);
                      }
                      setInitMethod(method);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-bold border uppercase ${
                      initMethod === method
                        ? 'bg-[#1A1715] text-[#FAF7F0] border-[#1A1715]'
                        : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Seed Stepper */}
              <div className="flex items-center gap-1 text-[10px]">
                <span className="font-bold text-[#5C544B]">SEED:</span>
                <button
                  onClick={() => setSeed((s) => (s + 13) % 100)}
                  className="px-1.5 py-0.5 bg-[#FAF7F0] border border-[#1A1715] font-bold tnum hover:bg-[#E8E1D3]"
                >
                  #{seed} ↻
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 SYNCHRONIZED REPRESENTATIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {/* REPRESENTATION 2: INSPECTABLE DISTANCE / CALCULATION TABLE */}
          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1715]">
                DISTANCE CALCULATION MATRIX // POINT {selectedPoint?.id?.toUpperCase()}
              </span>
              <span className="text-[10px] text-[#5C544B]">CLICK ANY POINT TO INSPECT</span>
            </div>

            {selectedPoint && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] bg-[#E8E1D3] p-1.5 border border-[#1A1715]">
                  <span>
                    COORDINATE: <strong className="tnum">({selectedPoint.x}, {selectedPoint.y})</strong>
                  </span>
                  <span>
                    CURRENT CLUSTER:{' '}
                    <strong className="text-[#1848B8]">
                      {selectedPoint.cluster !== undefined ? `CLUSTER ${selectedPoint.cluster + 1}` : 'UNASSIGNED'}
                    </strong>
                  </span>
                </div>

                {/* Euclidean Distances to each centroid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {simState.centroids.map((c) => {
                    const dSq = Math.round(
                      (selectedPoint.x - c.x) ** 2 + (selectedPoint.y - c.y) ** 2
                    );
                    const d = Math.sqrt(dSq);
                    const isMin = selectedPoint.cluster === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`p-2 border border-[#1A1715] text-[10px] flex flex-col justify-between ${
                          isMin ? 'bg-[#33634B]/15 border-[#33634B] shadow-[1px_1px_0px_#1A1715]' : 'bg-[#FAF7F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold" style={{ color: c.color }}>
                            μ_{c.id + 1}
                          </span>
                          {isMin && <span className="text-[9px] font-bold text-[#33634B]">MIN DIST ★</span>}
                        </div>
                        <div className="mt-1">
                          <span className="text-[#5C544B] block text-[9px]">d(x, μ)²</span>
                          <span className="font-bold text-xs tnum">{dSq.toLocaleString()}</span>
                        </div>
                        <span className="text-[9px] text-[#948B7D] mt-0.5 tnum">d = {d.toFixed(2)}px</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* REPRESENTATION 3: ACTIVE MATHEMATICAL INVARIANT */}
          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-2">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1715]">
                ACTIVE MATHEMATICAL INVARIANT
              </span>
              <Badge variant="amber">PHASE: {simState.phase.toUpperCase()}</Badge>
            </div>

            <FormulaPlate
              latex={explanation.equationLatex}
              label={explanation.headline}
            />

            <p className="text-[11px] text-[#5C544B] leading-relaxed pt-1">
              {explanation.description}
            </p>
          </div>

          {/* REPRESENTATION 4 & 5: CODE READERS (PSEUDOCODE & PYTHON) */}
          <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] space-y-2">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1715]">
                SYNCHRONIZED IMPLEMENTATION
              </span>
              <span className="text-[10px] text-[#1848B8] font-bold">PYTHON (NUMPY / CDIST)</span>
            </div>

            {/* Code Plate with active line highlighting */}
            <div className="bg-[#1A1715] p-3 border border-[#1A1715] text-[10px] text-[#FAF7F0] space-y-1 overflow-x-auto">
              {[
                { line: 1, text: '# Step 0: Initialize centroids' },
                { line: 2, text: 'centroids = initialize_kmeans_plus_plus(X, k=k)' },
                { line: 3, text: '' },
                { line: 4, text: '# Step 1: Assign points to nearest centroid (Voronoi)' },
                { line: 5, text: 'dists = cdist(X, centroids, metric="sqeuclidean")' },
                { line: 6, text: 'labels = np.argmin(dists, axis=1)  # <— ARGMIN' },
                { line: 7, text: '' },
                { line: 8, text: '# Step 2: Recompute centroid coordinates (Arithmetic Mean)' },
                { line: 9, text: 'centroids = np.array([X[labels == k].mean(axis=0) for k in range(k)])' },
                { line: 10, text: '' },
                { line: 11, text: '# Step 3: Check convergence threshold' },
                { line: 12, text: 'if np.max(np.linalg.norm(centroids - prev_centroids, axis=1)) < eps: break' },
              ].map((cLine) => {
                const isActive =
                  (simState.phase === 'init' && [1, 2].includes(cLine.line)) ||
                  (simState.phase === 'assign' && [4, 5, 6].includes(cLine.line)) ||
                  (simState.phase === 'update' && [8, 9].includes(cLine.line)) ||
                  (simState.phase === 'converged' && [11, 12].includes(cLine.line));

                return (
                  <div
                    key={cLine.line}
                    className={`flex items-center gap-2 py-0.5 px-1 ${
                      isActive ? 'bg-[#1848B8] text-white font-bold' : 'text-[#948B7D]'
                    }`}
                  >
                    <span className="w-5 text-right opacity-50 tnum">{cLine.line}</span>
                    <span className="font-mono">{cLine.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEARNING CHECKPOINT (PREDICT-BEFORE-REVEAL) */}
          {predictionMode && explanation.predictionPrompt && (
            <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1848B8] shadow-[3px_3px_0px_#1848B8] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1848B8]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1848B8]">
                  PREDICTION CHECKPOINT // TEST YOUR REASONING
                </span>
              </div>

              <p className="text-xs font-bold text-[#1A1715] leading-snug">
                {explanation.predictionPrompt.question}
              </p>

              <div className="space-y-1.5">
                {explanation.predictionPrompt.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPrediction(opt.id)}
                    className={`w-full text-left p-2 border text-[11px] leading-snug flex items-start gap-2 ${
                      selectedPrediction === opt.id
                        ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715]'
                        : 'bg-[#F4EFE4] text-[#1A1715] border-[#D8CFC0] hover:bg-[#E8E1D3]'
                    }`}
                  >
                    <span className="font-bold">{opt.label}.</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>

              {predictionFeedback && (
                <div
                  className={`p-2.5 border text-xs leading-relaxed space-y-1 ${
                    predictionFeedback.isCorrect
                      ? 'bg-[#33634B]/10 border-[#33634B] text-[#33634B]'
                      : 'bg-[#C83226]/10 border-[#C83226] text-[#C83226]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {predictionFeedback.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{predictionFeedback.isCorrect ? 'PREDICTION VERIFIED' : 'MISCONCEPTION CAUGHT'}</span>
                  </div>
                  <p className="text-[11px] text-[#1A1715]">{predictionFeedback.text}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
