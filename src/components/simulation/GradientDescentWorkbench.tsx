'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  createGradientDescentSimulation,
  stepGradientDescent,
  stepBackGradientDescent,
  runGradientDescent,
  getGradientDescentMetrics,
  getGradientDescentExplanation,
  GRADIENT_DESCENT_OBJECTIVES,
  GradientDescentObjectiveId,
  GradientDescentSimulationState,
  vectorNorm,
} from '@/lib/simulation/gradientDescentEngine';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
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
  Layers,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
  Compass,
  Gauge,
  Activity,
  Code2,
} from 'lucide-react';

export const GradientDescentWorkbench: React.FC = () => {
  // Configuration State
  const [objectiveId, setObjectiveId] =
    useState<GradientDescentObjectiveId>('quadratic1d');
  const [learningRate, setLearningRate] = useState<number>(0.4);
  const [initialTheta1D, setInitialTheta1D] = useState<number>(0.5);
  const [initialTheta2D, setInitialTheta2D] = useState<[number, number]>([0.5, 3.8]);
  const [maxIterations, setMaxIterations] = useState<number>(50);

  // Simulation State
  const [simState, setSimState] = useState<GradientDescentSimulationState>(() =>
    createGradientDescentSimulation({
      objectiveId: 'quadratic1d',
      learningRate: 0.4,
      initialTheta: [0.5],
      maxIterations: 50,
    })
  );

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prediction checkpoint state
  const [userPrediction, setUserPrediction] = useState<string | null>(null);
  const [hasRevealedPrediction, setHasRevealedPrediction] = useState<boolean>(false);

  // Canvas interaction
  const [isClickPlacing, setIsClickPlacing] = useState<boolean>(false);

  // Active Objective Definition
  const currentObjective = GRADIENT_DESCENT_OBJECTIVES[objectiveId];
  const alphaCrit = currentObjective.criticalLearningRate;
  const alphaRatio = simState.config.learningRate / alphaCrit;

  // Initialize or reconfigure simulation
  const reinitialize = (
    newObjId = objectiveId,
    newAlpha = learningRate,
    init1D = initialTheta1D,
    init2D = initialTheta2D
  ) => {
    setIsPlaying(false);
    setUserPrediction(null);
    setHasRevealedPrediction(false);

    const initTheta =
      GRADIENT_DESCENT_OBJECTIVES[newObjId].dimension === 1 ? [init1D] : [init2D[0], init2D[1]];

    const freshState = createGradientDescentSimulation({
      objectiveId: newObjId,
      learningRate: newAlpha,
      initialTheta: initTheta,
      maxIterations,
    });
    setSimState(freshState);
  };

  // Step Forward
  const handleStepForward = () => {
    if (simState.isConverged || simState.isDiverged) return;
    setSimState((prev) => stepGradientDescent(prev));
  };

  // Step Backward
  const handleStepBackward = () => {
    setSimState((prev) => stepBackGradientDescent(prev));
  };

  // Reset
  const handleReset = () => {
    reinitialize();
  };

  // Play / Pause timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSimState((prev) => {
          if (prev.isConverged || prev.isDiverged) {
            setIsPlaying(false);
            return prev;
          }
          return stepGradientDescent(prev);
        });
      }, speedMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs]);

  // Handle Objective Switch
  const handleObjectiveChange = (newId: GradientDescentObjectiveId) => {
    setObjectiveId(newId);
    let defaultAlpha = 0.4;
    if (newId === 'quadratic2d-anisotropic') defaultAlpha = 0.08;
    else if (newId === 'quadratic2d-isotropic') defaultAlpha = 0.3;
    setLearningRate(defaultAlpha);
    reinitialize(newId, defaultAlpha);
  };

  // Handle Regime Presets
  const applyPreset = (presetAlpha: number, name: string) => {
    setLearningRate(presetAlpha);
    reinitialize(objectiveId, presetAlpha);
  };

  const metrics = useMemo(() => getGradientDescentMetrics(simState), [simState]);
  const explanation = useMemo(() => getGradientDescentExplanation(simState), [simState]);

  // ---------------------------------------------------------------------------
  // 1D CANVAS RENDERING HELPERS
  // ---------------------------------------------------------------------------
  // Coordinate transformations: theta in [-1.5, 8.5] -> x in [40, 560]
  // Loss J in [0, 16] -> y in [340, 40]
  const svgWidth = 600;
  const svgHeight = 380;
  const paddingX = 50;
  const paddingY = 40;

  const minTheta1D = -1.5;
  const maxTheta1D = 8.5;
  const minLoss1D = 0;
  const maxLoss1D = 16;

  const toSvgX1D = (theta: number) =>
    paddingX + ((theta - minTheta1D) / (maxTheta1D - minTheta1D)) * (svgWidth - 2 * paddingX);
  const toSvgY1D = (loss: number) =>
    svgHeight - paddingY - (loss / maxLoss1D) * (svgHeight - 2 * paddingY);

  // Generate 1D Loss Curve Path
  const curvePath1D = useMemo(() => {
    const points: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = minTheta1D + (i / steps) * (maxTheta1D - minTheta1D);
      const loss = 0.5 * (t - 3.5) ** 2 + 1.0;
      const x = toSvgX1D(t);
      const y = toSvgY1D(loss);
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  // Tangent slope line at current point
  const currentTheta1D = simState.theta[0];
  const currentLoss1D = simState.loss;
  const tangentSlope = currentTheta1D - 3.5;
  const tangentX1 = toSvgX1D(currentTheta1D - 1.2);
  const tangentY1 = toSvgY1D(currentLoss1D - 1.2 * tangentSlope);
  const tangentX2 = toSvgX1D(currentTheta1D + 1.2);
  const tangentY2 = toSvgY1D(currentLoss1D + 1.2 * tangentSlope);

  // ---------------------------------------------------------------------------
  // 2D CANVAS RENDERING HELPERS
  // ---------------------------------------------------------------------------
  // Theta1 in [-1, 7] -> x in [50, 550]
  // Theta2 in [-1, 5] -> y in [370, 30]
  const minT1 = -1.0;
  const maxT1 = 7.0;
  const minT2 = -1.0;
  const maxT2 = 5.0;

  const toSvgX2D = (t1: number) =>
    50 + ((t1 - minT1) / (maxT1 - minT1)) * 500;
  const toSvgY2D = (t2: number) =>
    370 - ((t2 - minT2) / (maxT2 - minT2)) * 340;

  // Handle click on 2D canvas to place new starting coordinate
  const handleCanvas2DClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isClickPlacing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const t1 = minT1 + ((clickX - 50) / 500) * (maxT1 - minT1);
    const t2 = minT2 + ((370 - clickY) / 340) * (maxT2 - minT2);

    const clampedT1 = Number(Math.max(minT1, Math.min(maxT1, t1)).toFixed(2));
    const clampedT2 = Number(Math.max(minT2, Math.min(maxT2, t2)).toFixed(2));

    setInitialTheta2D([clampedT1, clampedT2]);
    setIsClickPlacing(false);
    reinitialize(objectiveId, learningRate, initialTheta1D, [clampedT1, clampedT2]);
  };

  // 2D Equipotential Contour Levels
  const contourLevels = [0.25, 0.75, 1.5, 3.0, 6.0, 10.0, 16.0];

  return (
    <div className="space-y-6 select-none font-mono">
      {/* 1. MASTER WORKBENCH CHASSIS HEADER */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[3px_3px_0px_#1A1715] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-[1.5px] border-[#1A1715] pb-3">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 bg-[#C83226] border border-[#1A1715] shadow-[1px_1px_0px_#1A1715]" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#5C544B]">
                CINEMA BENCHMARK // FLAGSHIP 02
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1715] tracking-tight">
                Gradient Descent Optimization Laboratory
              </h1>
            </div>
          </div>

          {/* Navigation Switcher between Flagship 1 and Flagship 2 */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/cinema"
              className="px-3 py-1.5 bg-[#E8E1D3] text-[#5C544B] border border-[#1A1715] shadow-[1px_1px_0px_#1A1715] hover:bg-[#FAF7F0] hover:text-[#1A1715] transition-colors"
            >
              FLAGSHIP 01: K-MEANS
            </Link>
            <span className="px-3 py-1.5 bg-[#1848B8] text-[#FAF7F0] font-black border border-[#1A1715] shadow-[2px_2px_0px_#1A1715]">
              FLAGSHIP 02: GRADIENT DESCENT
            </span>
          </div>
        </div>

        {/* Objective Selector & Preset Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          {/* Objective Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#5C544B] uppercase text-[11px]">OBJECTIVE:</span>
            <button
              onClick={() => handleObjectiveChange('quadratic1d')}
              className={`px-3 py-1 border border-[#1A1715] font-black transition-all ${
                objectiveId === 'quadratic1d'
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              1D QUADRATIC
            </button>
            <button
              onClick={() => handleObjectiveChange('quadratic2d-isotropic')}
              className={`px-3 py-1 border border-[#1A1715] font-black transition-all ${
                objectiveId === 'quadratic2d-isotropic'
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              2D ISOTROPIC BOWL (κ = 1)
            </button>
            <button
              onClick={() => handleObjectiveChange('quadratic2d-anisotropic')}
              className={`px-3 py-1 border border-[#1A1715] font-black transition-all ${
                objectiveId === 'quadratic2d-anisotropic'
                  ? 'bg-[#1A1715] text-[#FAF7F0] shadow-[2px_2px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              2D ANISOTROPIC VALLEY (κ = 10)
            </button>
          </div>

          {/* Quick Regime Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[#5C544B] uppercase text-[10px]">PRESET α:</span>
            {objectiveId === 'quadratic1d' ? (
              <>
                <button
                  onClick={() => applyPreset(0.4, 'Monotonic')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#33634B] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Monotonic (0.4)
                </button>
                <button
                  onClick={() => applyPreset(1.0, 'Deadbeat')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#1848B8] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Deadbeat (1.0)
                </button>
                <button
                  onClick={() => applyPreset(1.6, 'Oscillating')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#E28C05] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Oscillate (1.6)
                </button>
                <button
                  onClick={() => applyPreset(2.0, 'Limit Cycle')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#6E3867] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Limit Cycle (2.0)
                </button>
                <button
                  onClick={() => applyPreset(2.2, 'Divergent')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#C83226] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Divergent (2.2)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => applyPreset(objectiveId === 'quadratic2d-anisotropic' ? 0.05 : 0.25, 'Stable')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#33634B] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Stable ({objectiveId === 'quadratic2d-anisotropic' ? '0.05' : '0.25'})
                </button>
                <button
                  onClick={() => applyPreset(objectiveId === 'quadratic2d-anisotropic' ? 0.15 : 1.5, 'Oscillate')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#E28C05] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Oscillate ({objectiveId === 'quadratic2d-anisotropic' ? '0.15' : '1.50'})
                </button>
                <button
                  onClick={() => applyPreset(objectiveId === 'quadratic2d-anisotropic' ? 0.20 : 2.0, 'Critical')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#6E3867] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Critical ({objectiveId === 'quadratic2d-anisotropic' ? '0.20' : '2.00'})
                </button>
                <button
                  onClick={() => applyPreset(objectiveId === 'quadratic2d-anisotropic' ? 0.24 : 2.2, 'Divergent')}
                  className="px-2 py-0.5 bg-[#FAF7F0] hover:bg-[#C83226] hover:text-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold"
                >
                  Divergent ({objectiveId === 'quadratic2d-anisotropic' ? '0.24' : '2.20'})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. TWO-COLUMN WORKBENCH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SIMULATION CANVAS & INSTRUMENT CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* CANVAS HOUSING CARD */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1848B8]" />
                <span className="font-black uppercase text-[#1A1715]">
                  {currentObjective.dimension === 1
                    ? '1D PARAMETER TRAJECTORY & LOSS MANIFOLD'
                    : '2D TOPOGRAPHIC CONTOURS & GRADIENT FIELD'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentObjective.dimension === 2 && (
                  <button
                    onClick={() => setIsClickPlacing(!isClickPlacing)}
                    className={`px-2 py-0.5 text-[10px] font-bold border border-[#1A1715] transition-colors ${
                      isClickPlacing
                        ? 'bg-[#C83226] text-[#FAF7F0]'
                        : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F4EFE4]'
                    }`}
                  >
                    {isClickPlacing ? 'CLICK CANVAS TO PLACE' : 'PICK START (θ₀)'}
                  </button>
                )}
                <span className="text-[10px] font-bold text-[#5C544B]">
                  SCALE: {currentObjective.dimension === 1 ? 'θ ∈ [-1.5, 8.5]' : 'θ₁ ∈ [-1, 7], θ₂ ∈ [-1, 5]'}
                </span>
              </div>
            </div>

            {/* SVG CANVAS */}
            <div className="p-3 bg-[#FAF7F0] flex justify-center">
              {currentObjective.dimension === 1 ? (
                // 1D SVG CANVAS
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="border border-[#1A1715] bg-[#FAF7F0] overflow-visible"
                >
                  <defs>
                    <pattern id="grid1D" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                    </pattern>
                    <marker
                      id="arrowGrad"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#C83226" />
                    </marker>
                  </defs>
                  <rect width={svgWidth} height={svgHeight} fill="url(#grid1D)" />

                  {/* Axes */}
                  <line
                    x1={paddingX}
                    y1={toSvgY1D(0)}
                    x2={svgWidth - paddingX}
                    y2={toSvgY1D(0)}
                    stroke="#1A1715"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={toSvgX1D(0)}
                    y1={svgHeight - paddingY}
                    x2={toSvgX1D(0)}
                    y2={paddingY}
                    stroke="#1A1715"
                    strokeWidth="1.5"
                  />

                  {/* Axis Tick Marks & Labels */}
                  {[-1, 0, 1, 2, 3, 3.5, 4, 5, 6, 7, 8].map((t) => (
                    <g key={`tick-${t}`}>
                      <line
                        x1={toSvgX1D(t)}
                        y1={toSvgY1D(0) - 3}
                        x2={toSvgX1D(t)}
                        y2={toSvgY1D(0) + 3}
                        stroke="#1A1715"
                        strokeWidth="1"
                      />
                      <text
                        x={toSvgX1D(t)}
                        y={toSvgY1D(0) + 15}
                        fontSize="9"
                        textAnchor="middle"
                        fill={t === 3.5 ? '#1848B8' : '#5C544B'}
                        fontWeight={t === 3.5 ? 'bold' : 'normal'}
                      >
                        {t === 3.5 ? 'θ*=3.5' : t}
                      </text>
                    </g>
                  ))}

                  {/* Loss Curve J(θ) */}
                  <path d={curvePath1D} fill="none" stroke="#1A1715" strokeWidth="2.5" />

                  {/* Global Optimum Marker */}
                  <g transform={`translate(${toSvgX1D(3.5)}, ${toSvgY1D(1.0)})`}>
                    <circle r="8" fill="none" stroke="#1848B8" strokeWidth="1.5" strokeDasharray="2,2" />
                    <circle r="3" fill="#1848B8" />
                    <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#1848B8">
                      J* = 1.0 (θ* = 3.5)
                    </text>
                  </g>

                  {/* Tangent slope line at current point */}
                  {Number.isFinite(currentLoss1D) && currentLoss1D < 25 && (
                    <line
                      x1={tangentX1}
                      y1={tangentY1}
                      x2={tangentX2}
                      y2={tangentY2}
                      stroke="#C83226"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                  )}

                  {/* Historical Trajectory Path */}
                  {simState.pathHistory.length > 1 && (
                    <polyline
                      points={simState.pathHistory
                        .map((p, idx) => {
                          const loss = simState.lossHistory[idx] ?? 0;
                          return `${toSvgX1D(p[0])},${toSvgY1D(loss)}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#E28C05"
                      strokeWidth="1.5"
                      strokeDasharray="3,2"
                    />
                  )}

                  {/* Historical Dots */}
                  {simState.pathHistory.map((p, idx) => {
                    const loss = simState.lossHistory[idx] ?? 0;
                    if (!Number.isFinite(loss) || loss > 25) return null;
                    const cx = toSvgX1D(p[0]);
                    const cy = toSvgY1D(loss);
                    const isLatest = idx === simState.pathHistory.length - 1;
                    return (
                      <g key={`dot-${idx}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isLatest ? 6 : 3.5}
                          fill={isLatest ? '#C83226' : '#1A1715'}
                          stroke="#FAF7F0"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx}
                          y={cy - 9}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#1A1715"
                        >
                          t={idx}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient Step Displacement Vector on X-Axis */}
                  {simState.stepDisplacement[0] !== 0 && (
                    <g>
                      <line
                        x1={toSvgX1D(simState.prevTheta[0])}
                        y1={toSvgY1D(0)}
                        x2={toSvgX1D(simState.theta[0])}
                        y2={toSvgY1D(0)}
                        stroke="#C83226"
                        strokeWidth="2.5"
                        markerEnd="url(#arrowGrad)"
                      />
                      <text
                        x={(toSvgX1D(simState.prevTheta[0]) + toSvgX1D(simState.theta[0])) / 2}
                        y={toSvgY1D(0) - 8}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#C83226"
                      >
                        -α∇J = {simState.stepDisplacement[0].toFixed(2)}
                      </text>
                    </g>
                  )}
                </svg>
              ) : (
                // 2D SVG CANVAS
                <svg
                  width={svgWidth}
                  height={420}
                  onClick={handleCanvas2DClick}
                  className={`border border-[#1A1715] bg-[#FAF7F0] overflow-visible ${
                    isClickPlacing ? 'cursor-crosshair ring-2 ring-[#C83226]' : ''
                  }`}
                >
                  <defs>
                    <pattern id="grid2D" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                    </pattern>
                    <marker
                      id="arrowGrad2D"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#C83226" />
                    </marker>
                  </defs>
                  <rect width={svgWidth} height={420} fill="url(#grid2D)" />

                  {/* Contour Ellipses */}
                  {contourLevels.map((lvl) => {
                    // For J = lvl:
                    // Isotropic: 0.5(t1 - 3)^2 + 0.5(t2 - 2)^2 = lvl -> circle radius r = sqrt(2 * lvl)
                    // Anisotropic: 0.5(t1 - 3)^2 + 5(t2 - 2)^2 = lvl -> ellipse rx = sqrt(2*lvl), ry = sqrt(lvl/5)
                    const isAniso = objectiveId === 'quadratic2d-anisotropic';
                    const rxVal = Math.sqrt(2 * lvl);
                    const ryVal = isAniso ? Math.sqrt(lvl / 5.0) : Math.sqrt(2 * lvl);

                    // Compute pixel radii
                    const rxPx = (rxVal / (maxT1 - minT1)) * 500;
                    const ryPx = (ryVal / (maxT2 - minT2)) * 340;

                    return (
                      <g key={`contour-${lvl}`}>
                        <ellipse
                          cx={toSvgX2D(3.0)}
                          cy={toSvgY2D(2.0)}
                          rx={rxPx}
                          ry={ryPx}
                          fill="none"
                          stroke={isAniso ? '#C83226' : '#1848B8'}
                          strokeWidth="1"
                          strokeDasharray={lvl >= 10 ? '3,3' : undefined}
                          opacity={0.35}
                        />
                        <text
                          x={toSvgX2D(3.0) + rxPx + 4}
                          y={toSvgY2D(2.0)}
                          fontSize="8"
                          fill="#5C544B"
                          opacity={0.8}
                        >
                          J={lvl}
                        </text>
                      </g>
                    );
                  })}

                  {/* Optimum Marker */}
                  <g transform={`translate(${toSvgX2D(3.0)}, ${toSvgY2D(2.0)})`}>
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#1848B8" strokeWidth="2" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#1848B8" strokeWidth="2" />
                    <circle r="4" fill="none" stroke="#1848B8" strokeWidth="1.5" />
                    <text x="10" y="4" fontSize="10" fontWeight="bold" fill="#1848B8">
                      θ* = (3, 2)
                    </text>
                  </g>

                  {/* Optimization Trajectory Path */}
                  {simState.pathHistory.length > 1 && (
                    <polyline
                      points={simState.pathHistory
                        .map((p) => `${toSvgX2D(p[0])},${toSvgY2D(p[1])}`)
                        .join(' ')}
                      fill="none"
                      stroke="#E28C05"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Trajectory Points */}
                  {simState.pathHistory.map((p, idx) => {
                    const cx = toSvgX2D(p[0]);
                    const cy = toSvgY2D(p[1]);
                    const isLatest = idx === simState.pathHistory.length - 1;
                    return (
                      <g key={`point-${idx}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isLatest ? 6 : 3}
                          fill={isLatest ? '#C83226' : '#1A1715'}
                          stroke="#FAF7F0"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cx}
                          y={cy - 8}
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#1A1715"
                        >
                          {idx}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient Vector Needle at Current Position */}
                  {simState.gradientNorm > 0.05 && (
                    <g>
                      <line
                        x1={toSvgX2D(simState.theta[0])}
                        y1={toSvgY2D(simState.theta[1])}
                        x2={toSvgX2D(simState.theta[0] - simState.config.learningRate * simState.gradient[0])}
                        y2={toSvgY2D(simState.theta[1] - simState.config.learningRate * simState.gradient[1])}
                        stroke="#C83226"
                        strokeWidth="2.5"
                        markerEnd="url(#arrowGrad2D)"
                      />
                    </g>
                  )}
                </svg>
              )}
            </div>

            {/* Canvas Subtitle & Regime Banner */}
            <div className="p-3 bg-[#FAF7F0] border-t border-[#1A1715] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 border border-[#1A1715] ${
                    simState.isDiverged
                      ? 'bg-[#C83226]'
                      : simState.isLimitCycle
                      ? 'bg-[#6E3867]'
                      : simState.isConverged
                      ? 'bg-[#33634B]'
                      : simState.regime === 'oscillating'
                      ? 'bg-[#E28C05]'
                      : 'bg-[#1848B8]'
                  }`}
                />
                <span className="font-black text-[#1A1715]">
                  REGIME: {simState.regime.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] font-bold text-[#5C544B]">
                {simState.stopReason || `Step displacement norm: ${vectorNorm(simState.stepDisplacement).toFixed(4)}`}
              </div>
            </div>
          </div>

          {/* PLAYBACK CONTROLS PANEL */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
              <span className="font-black uppercase text-[#1A1715]">BENCH CONTROLS</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#5C544B]">STEP DELAY:</span>
                <input
                  type="range"
                  min="150"
                  max="1200"
                  step="50"
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="w-24 accent-[#1848B8]"
                />
                <span className="text-[10px] font-mono text-[#1A1715] w-12">{speedMs}ms</span>
              </div>
            </div>

            {/* Step & Play Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <AnalogButton
                onClick={() => setIsPlaying(!isPlaying)}
                variant={isPlaying ? 'amber' : 'primary'}
                className="flex items-center gap-2 text-xs px-4 py-2 font-black"
                disabled={simState.isConverged || simState.isDiverged}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'PAUSE' : 'RUN'}
              </AnalogButton>

              <AnalogButton
                onClick={handleStepForward}
                variant="secondary"
                className="flex items-center gap-1.5 text-xs px-3 py-2 font-bold"
                disabled={isPlaying || simState.isConverged || simState.isDiverged}
              >
                <SkipForward className="w-4 h-4" />
                STEP FORWARD
              </AnalogButton>

              <AnalogButton
                onClick={handleStepBackward}
                variant="secondary"
                className="flex items-center gap-1.5 text-xs px-3 py-2 font-bold"
                disabled={isPlaying || simState.historyStack.length <= 1}
              >
                <SkipBack className="w-4 h-4" />
                STEP BACK
              </AnalogButton>

              <AnalogButton
                onClick={handleReset}
                variant="secondary"
                className="flex items-center gap-1.5 text-xs px-3 py-2 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                RESET
              </AnalogButton>
            </div>

            {/* Stepped Potentiometers (Learning Rate & Starting Coordinates) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1A1715]/40 text-xs">
              {/* Learning Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#1A1715]">LEARNING RATE (α):</span>
                  <span className="font-black text-[#1848B8] bg-[#E8E1D3] px-1.5 py-0.5 border border-[#1A1715]">
                    {learningRate.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max={objectiveId === 'quadratic2d-anisotropic' ? '0.28' : '2.40'}
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLearningRate(val);
                    reinitialize(objectiveId, val);
                  }}
                  className="w-full accent-[#C83226]"
                />
                <div className="flex justify-between text-[9px] text-[#5C544B]">
                  <span>0.01</span>
                  <span className="font-bold text-[#C83226]">α_crit = {alphaCrit.toFixed(2)}</span>
                  <span>{objectiveId === 'quadratic2d-anisotropic' ? '0.28' : '2.40'}</span>
                </div>
              </div>

              {/* Initial Parameter Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#1A1715]">
                    {currentObjective.dimension === 1 ? 'INITIAL POSITION (θ₀):' : 'INITIAL θ₁:'}
                  </span>
                  <span className="font-black text-[#1A1715] bg-[#E8E1D3] px-1.5 py-0.5 border border-[#1A1715]">
                    {currentObjective.dimension === 1 ? initialTheta1D.toFixed(2) : initialTheta2D[0].toFixed(2)}
                  </span>
                </div>
                {currentObjective.dimension === 1 ? (
                  <input
                    type="range"
                    min="-1.0"
                    max="8.0"
                    step="0.1"
                    value={initialTheta1D}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInitialTheta1D(val);
                      reinitialize(objectiveId, learningRate, val);
                    }}
                    className="w-full accent-[#1848B8]"
                  />
                ) : (
                  <input
                    type="range"
                    min="-0.5"
                    max="6.5"
                    step="0.1"
                    value={initialTheta2D[0]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const newT2D: [number, number] = [val, initialTheta2D[1]];
                      setInitialTheta2D(newT2D);
                      reinitialize(objectiveId, learningRate, initialTheta1D, newT2D);
                    }}
                    className="w-full accent-[#1848B8]"
                  />
                )}
                <div className="flex justify-between text-[9px] text-[#5C544B]">
                  <span>Min</span>
                  <span>Optimum = {currentObjective.globalOptimum[0]}</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          </div>

          {/* PREDICT-BEFORE-REVEAL CHECKPOINT CARD */}
          {explanation.predictionPrompt && (
            <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
                <div className="flex items-center gap-2 text-[#C83226]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-black uppercase">PREDICTION CHECKPOINT</span>
                </div>
                <span className="text-[10px] font-bold text-[#5C544B]">STEP 0 GATEWAY</span>
              </div>

              <p className="text-xs text-[#1A1715] font-bold leading-relaxed">
                {explanation.predictionPrompt.question}
              </p>

              <div className="space-y-2">
                {explanation.predictionPrompt.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setUserPrediction(opt.id);
                      setHasRevealedPrediction(true);
                    }}
                    className={`w-full text-left p-2.5 text-xs border border-[#1A1715] flex items-center justify-between transition-colors ${
                      userPrediction === opt.id
                        ? opt.isCorrect
                          ? 'bg-[#33634B]/20 border-[#33634B] font-bold text-[#33634B]'
                          : 'bg-[#C83226]/20 border-[#C83226] font-bold text-[#C83226]'
                        : 'bg-[#FAF7F0] hover:bg-[#E8E1D3] text-[#1A1715]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-[#1A1715] flex items-center justify-center font-black text-[10px] bg-[#E8E1D3]">
                        {opt.label}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {hasRevealedPrediction && (
                <div className="p-3 bg-[#E8E1D3] border border-[#1A1715] text-xs text-[#1A1715] leading-relaxed">
                  <span className="font-black uppercase block text-[10px] text-[#33634B] mb-1">
                    EXPLANATION:
                  </span>
                  {explanation.predictionPrompt.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 5 SYNCHRONIZED REPRESENTATIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {/* REPRESENTATION 1: LIVE NUMERICAL TELEMETRY & TAPE COUNTER */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#1848B8]" />
                <span className="font-black uppercase text-[#1A1715]">
                  1. NUMERICAL VECTOR STATE
                </span>
              </div>
              {/* Mechanical Tape Counter */}
              <div className="flex items-center gap-1 bg-[#1A1715] px-2 py-0.5 border border-[#1A1715]">
                <span className="text-[9px] font-bold text-[#FAF7F0]/60 uppercase">STEP:</span>
                <span className="font-mono text-xs font-black text-[#FAF7F0]">
                  {String(simState.stepNumber).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Dark Bakelite Inset Instrument Plate */}
            <div className="bg-[#1A1715] text-[#FAF7F0] p-3.5 border border-[#1A1715] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5)] font-mono text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-[#FAF7F0]/15 pb-1">
                <span className="text-[#FAF7F0]/60">PARAMETER θ:</span>
                <span className="font-bold text-[#FAF7F0]">
                  [{simState.theta.map((v) => v.toFixed(3)).join(', ')}]
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#FAF7F0]/15 pb-1">
                <span className="text-[#FAF7F0]/60">OBJECTIVE LOSS J(θ):</span>
                <span className="font-bold text-[#E28C05]">
                  {Number.isFinite(simState.loss) ? simState.loss.toFixed(5) : '∞ (DIVERGED)'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#FAF7F0]/15 pb-1">
                <span className="text-[#FAF7F0]/60">ANALYTICAL ∇J(θ):</span>
                <span className="font-bold text-[#C83226]">
                  [{simState.gradient.map((v) => v.toFixed(3)).join(', ')}]
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#FAF7F0]/15 pb-1">
                <span className="text-[#FAF7F0]/60">GRADIENT NORM ||∇J||₂:</span>
                <span className="font-bold text-[#FAF7F0]">
                  {simState.gradientNorm.toFixed(5)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#FAF7F0]/60">STABILITY RATIO (α / α_crit):</span>
                <span
                  className={`font-black px-1.5 py-0.2 border ${
                    alphaRatio >= 1.0
                      ? 'bg-[#C83226] text-[#FAF7F0] border-[#FAF7F0]'
                      : alphaRatio >= 0.8
                      ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715]'
                      : 'bg-[#33634B] text-[#FAF7F0] border-[#FAF7F0]'
                  }`}
                >
                  {(alphaRatio * 100).toFixed(1)}% {alphaRatio >= 1.0 ? '⚠ UNSTABLE' : 'STABLE'}
                </span>
              </div>
            </div>
          </div>

          {/* REPRESENTATION 2: ACTIVE MATHEMATICAL INVARIANT (KaTeX) */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
              <span className="font-black uppercase text-[#1A1715]">
                2. GOVERNING EQUATION (LIVE EVALUATED)
              </span>
              <span className="text-[10px] font-bold text-[#5C544B]">KATEX</span>
            </div>
            <FormulaPlate
              latex={explanation.equationLatex}
              label="DISCRETE UPDATE STEP"
              className="text-xs"
            />
          </div>

          {/* REPRESENTATION 3: STEP EXPLANATION & MISCONCEPTION TRAP */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C83226]" />
                <span className="font-black uppercase text-[#1A1715]">
                  3. DYNAMICS & PHYSICAL EXPLANATION
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#1A1715] leading-relaxed">
              <div className="text-[11px] font-black text-[#1848B8]">
                {explanation.headline}
              </div>
              <p>{explanation.description}</p>
            </div>

            {explanation.misconceptionTrap && (
              <div className="p-3 bg-[#E8E1D3]/80 border-l-4 border-[#C83226] text-xs text-[#1A1715] space-y-1">
                <div className="flex items-center gap-1.5 text-[#C83226] font-bold text-[10px] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cognitive Misconception Alert</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#5C544B]">
                  {explanation.misconceptionTrap}
                </p>
              </div>
            )}
          </div>

          {/* REPRESENTATION 4 & 5: NUMPY PYTHON IMPLEMENTATION */}
          <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-4 shadow-[3px_3px_0px_#1A1715] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#33634B]" />
                <span className="font-black uppercase text-[#1A1715]">
                  4. SYNCHRONIZED PYTHON / NUMPY
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#5C544B]">NUMPY PARITY</span>
            </div>

            <div className="bg-[#1A1715] text-[#FAF7F0] p-3 border border-[#1A1715] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-[#FAF7F0]/40"># Exact Python implementation of active step:</div>
              <div className="text-[#FAF7F0]">
                <span className="text-[#C83226]">import</span> numpy <span className="text-[#C83226]">as</span> np
              </div>
              <div className="text-[#FAF7F0] mt-1">
                theta = np.array([{simState.prevTheta.map((v) => v.toFixed(2)).join(', ')}])
              </div>
              <div className="text-[#FAF7F0]">
                alpha = <span className="text-[#E28C05]">{simState.config.learningRate.toFixed(3)}</span>
              </div>
              <div className="text-[#FAF7F0]">
                grad = np.array([{simState.gradient.map((v) => v.toFixed(2)).join(', ')}])
              </div>
              <div className="bg-[#33634B]/30 px-1 py-0.5 border-l-2 border-[#33634B] text-[#FAF7F0] font-bold mt-1">
                theta = theta - alpha * grad  <span className="text-[#FAF7F0]/40"># =&gt; [{simState.theta.map((v) => v.toFixed(2)).join(', ')}]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM PANEL: LOSS TRAJECTORY CHART & HISTORICAL TABLE */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-5 shadow-[3px_3px_0px_#1A1715] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1A1715] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1848B8]" />
            <span className="font-black uppercase text-[#1A1715]">
              LOSS DYNAMICS CURVE: J(θ) OVER ITERATIONS t
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5C544B]">
            TOTAL RECORDED ITERATIONS: {simState.pathHistory.length}
          </span>
        </div>

        {/* Mini SVG Loss Strip */}
        <div className="h-28 w-full bg-[#E8E1D3]/50 border border-[#1A1715] relative p-2 flex items-end">
          <svg className="w-full h-full overflow-visible">
            {simState.lossHistory.length > 1 && (
              <polyline
                points={simState.lossHistory
                  .map((loss, idx) => {
                    const x = (idx / Math.max(1, simState.lossHistory.length - 1)) * 560 + 20;
                    const maxRecordedLoss = Math.max(10, Math.min(100, ...simState.lossHistory.filter(Number.isFinite)));
                    const normLoss = Math.min(1, Math.max(0, loss / maxRecordedLoss));
                    const y = 90 - normLoss * 80;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#C83226"
                strokeWidth="2"
              />
            )}
            {simState.lossHistory.map((loss, idx) => {
              const x = (idx / Math.max(1, simState.lossHistory.length - 1)) * 560 + 20;
              const maxRecordedLoss = Math.max(10, Math.min(100, ...simState.lossHistory.filter(Number.isFinite)));
              const normLoss = Math.min(1, Math.max(0, loss / maxRecordedLoss));
              const y = 90 - normLoss * 80;
              return (
                <circle
                  key={`loss-dot-${idx}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#1A1715"
                />
              );
            })}
          </svg>
        </div>

        {/* History Iteration Summary Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse border border-[#1A1715]">
            <thead>
              <tr className="bg-[#E8E1D3] text-[#1A1715] text-[11px] font-bold">
                <th className="border border-[#1A1715] p-1.5 text-left">ITERATION t</th>
                <th className="border border-[#1A1715] p-1.5 text-left">PARAMETER θ</th>
                <th className="border border-[#1A1715] p-1.5 text-left">LOSS J(θ)</th>
                <th className="border border-[#1A1715] p-1.5 text-left">GRADIENT ∇J</th>
                <th className="border border-[#1A1715] p-1.5 text-left">NORM ||∇J||₂</th>
                <th className="border border-[#1A1715] p-1.5 text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {simState.pathHistory.slice(-8).map((pt, i) => {
                const actualStep = simState.pathHistory.length - 8 + i;
                if (actualStep < 0) return null;
                const lossVal = simState.lossHistory[actualStep];
                const gradNorm = simState.gradientNormHistory[actualStep];
                return (
                  <tr
                    key={`hist-${actualStep}`}
                    className={`border border-[#1A1715] font-mono ${
                      actualStep === simState.stepNumber ? 'bg-[#1848B8]/10 font-bold' : ''
                    }`}
                  >
                    <td className="border border-[#1A1715] p-1.5">{actualStep}</td>
                    <td className="border border-[#1A1715] p-1.5">[{pt.map((v) => v.toFixed(3)).join(', ')}]</td>
                    <td className="border border-[#1A1715] p-1.5 text-[#E28C05] font-bold">
                      {Number.isFinite(lossVal) ? lossVal.toFixed(4) : '∞'}
                    </td>
                    <td className="border border-[#1A1715] p-1.5 text-[#C83226]">
                      [{currentObjective.evaluateGradient(pt).map((v) => v.toFixed(3)).join(', ')}]
                    </td>
                    <td className="border border-[#1A1715] p-1.5">{gradNorm ? gradNorm.toFixed(4) : '-'}</td>
                    <td className="border border-[#1A1715] p-1.5">
                      <span className="text-[10px] px-1 py-0.5 bg-[#FAF7F0] border border-[#1A1715]">
                        {actualStep === 0 ? 'INIT' : simState.regime}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
