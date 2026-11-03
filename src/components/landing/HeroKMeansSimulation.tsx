'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { CENTROID_COLORS } from '@/lib/math/kmeans';

interface Point {
  id: number;
  x: number;
  y: number;
  cluster: number;
}

interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
  history: Array<{ x: number; y: number }>;
}

// Initial deterministic 3-cluster data points (32 points)
const INITIAL_POINTS: Array<{ x: number; y: number; initialCluster: number }> = [
  // Cluster 1 (top-left)
  { x: 75, y: 80, initialCluster: 0 },
  { x: 95, y: 110, initialCluster: 0 },
  { x: 120, y: 70, initialCluster: 0 },
  { x: 135, y: 125, initialCluster: 0 },
  { x: 80, y: 140, initialCluster: 0 },
  { x: 110, y: 155, initialCluster: 0 },
  { x: 150, y: 90, initialCluster: 0 },
  { x: 60, y: 105, initialCluster: 0 },
  { x: 130, y: 170, initialCluster: 0 },
  { x: 100, y: 65, initialCluster: 0 },

  // Cluster 2 (top-right)
  { x: 310, y: 75, initialCluster: 1 },
  { x: 345, y: 110, initialCluster: 1 },
  { x: 290, y: 120, initialCluster: 1 },
  { x: 370, y: 85, initialCluster: 1 },
  { x: 330, y: 145, initialCluster: 1 },
  { x: 360, y: 135, initialCluster: 1 },
  { x: 285, y: 85, initialCluster: 1 },
  { x: 395, y: 115, initialCluster: 1 },
  { x: 325, y: 65, initialCluster: 1 },
  { x: 350, y: 165, initialCluster: 1 },

  // Cluster 3 (bottom-center)
  { x: 180, y: 245, initialCluster: 2 },
  { x: 220, y: 285, initialCluster: 2 },
  { x: 205, y: 230, initialCluster: 2 },
  { x: 250, y: 260, initialCluster: 2 },
  { x: 190, y: 310, initialCluster: 2 },
  { x: 235, y: 315, initialCluster: 2 },
  { x: 265, y: 235, initialCluster: 2 },
  { x: 165, y: 270, initialCluster: 2 },
  { x: 240, y: 290, initialCluster: 2 },
  { x: 215, y: 330, initialCluster: 2 },
  { x: 280, y: 275, initialCluster: 2 },
  { x: 175, y: 220, initialCluster: 2 },
];

export const HeroKMeansSimulation: React.FC = () => {
  const [k, setK] = useState<number>(3);
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [iteration, setIteration] = useState<number>(1);
  const [statePhase, setStatePhase] = useState<'ASSIGNMENT' | 'UPDATE' | 'CONVERGED'>('ASSIGNMENT');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Initialize centroids based on K
  const initializeSimulation = (kVal: number) => {
    const rawPoints = INITIAL_POINTS.map((p, idx) => ({
      id: idx,
      x: p.x,
      y: p.y,
      cluster: p.initialCluster % kVal,
    }));

    // Initial intentionally offset centroid seeds
    const seedPositions = [
      { x: 90, y: 180 }, // Centroid 1
      { x: 340, y: 210 }, // Centroid 2
      { x: 210, y: 150 }, // Centroid 3
      { x: 140, y: 280 }, // Centroid 4 (if k=4)
    ];

    const initialCentroids: Centroid[] = [];
    for (let i = 0; i < kVal; i++) {
      const pos = seedPositions[i % seedPositions.length];
      initialCentroids.push({
        id: i,
        x: pos.x,
        y: pos.y,
        color: CENTROID_COLORS[i % CENTROID_COLORS.length],
        history: [{ x: pos.x, y: pos.y }],
      });
    }

    setPoints(rawPoints);
    setCentroids(initialCentroids);
    setIteration(1);
    setStatePhase('ASSIGNMENT');
  };

  useEffect(() => {
    initializeSimulation(k);
  }, [k]);

  // Single step of Lloyd's algorithm
  const stepSimulation = () => {
    if (statePhase === 'CONVERGED') {
      initializeSimulation(k);
      return;
    }

    if (statePhase === 'ASSIGNMENT') {
      // 1. Assign points to nearest centroid
      const updatedPoints = points.map((p) => {
        let minDistSq = Infinity;
        let bestC = 0;
        centroids.forEach((c) => {
          const dSq = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          if (dSq < minDistSq) {
            minDistSq = dSq;
            bestC = c.id;
          }
        });
        return { ...p, cluster: bestC };
      });
      setPoints(updatedPoints);
      setStatePhase('UPDATE');
    } else {
      // 2. Update centroid positions to arithmetic mean
      let maxShift = 0;
      const updatedCentroids = centroids.map((c) => {
        const clusterPts = points.filter((p) => p.cluster === c.id);
        if (clusterPts.length === 0) return c;

        const sumX = clusterPts.reduce((acc, p) => acc + p.x, 0);
        const sumY = clusterPts.reduce((acc, p) => acc + p.y, 0);
        const newX = Math.round(sumX / clusterPts.length);
        const newY = Math.round(sumY / clusterPts.length);

        const shift = Math.sqrt((newX - c.x) ** 2 + (newY - c.y) ** 2);
        if (shift > maxShift) maxShift = shift;

        return {
          ...c,
          x: newX,
          y: newY,
          history: [...c.history, { x: newX, y: newY }],
        };
      });

      setCentroids(updatedCentroids);
      if (maxShift < 2 || iteration >= 8) {
        setStatePhase('CONVERGED');
      } else {
        setIteration((prev) => prev + 1);
        setStatePhase('ASSIGNMENT');
      }
    }
  };

  // Playhead timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        stepSimulation();
      }, 950);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, statePhase, iteration, points, centroids, k]);

  return (
    <div className="w-full bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] flex flex-col overflow-hidden select-none">
      {/* Panel Top Title Plate */}
      <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1715] px-3.5 py-2 bg-[#F4EFE4]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#C83226]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1A1715]">
            K-MEANS // LIVE SIMULATION
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#33634B] animate-pulse" />
          <span className="font-mono text-[10px] font-semibold text-[#33634B] uppercase tracking-wide">
            DETERMINISTIC
          </span>
        </div>
      </div>

      {/* SVG Coordinate Grid Canvas (420 x 360) */}
      <div className="relative w-full aspect-[4/3] bg-[#FAF7F0] overflow-hidden">
        <svg viewBox="0 0 420 360" className="w-full h-full">
          {/* Subtle 30px Grid */}
          <defs>
            <pattern id="heroGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E8E1D3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="420" height="360" fill="url(#heroGrid)" />

          {/* Coordinate Axes */}
          <line x1="20" y1="340" x2="405" y2="340" stroke="#1A1715" strokeWidth="1.5" />
          <polygon points="410,340 402,337 402,343" fill="#1A1715" />
          <line x1="20" y1="340" x2="20" y2="15" stroke="#1A1715" strokeWidth="1.5" />
          <polygon points="20,10 17,18 23,18" fill="#1A1715" />

          {/* Numerical Axis Ticks */}
          {[100, 200, 300, 400].map((tick) => (
            <g key={`xtick-${tick}`}>
              <line x1={tick} y1={337} x2={tick} y2={343} stroke="#1A1715" strokeWidth="1" />
              <text x={tick} y={353} textAnchor="middle" className="font-mono text-[9px] fill-[#948B7D]">
                {tick}
              </text>
            </g>
          ))}
          {[100, 200, 300].map((tick) => (
            <g key={`ytick-${tick}`}>
              <line x1={17} y1={340 - tick} x2={23} y2={340 - tick} stroke="#1A1715" strokeWidth="1" />
              <text x={12} y={343 - tick} textAnchor="end" className="font-mono text-[9px] fill-[#948B7D]">
                {tick}
              </text>
            </g>
          ))}

          {/* Centroid Trajectory Trails (Dashed pen line with sequence dots) */}
          {centroids.map((c) => (
            <g key={`hero-traj-${c.id}`}>
              {c.history.length > 1 && (
                <polyline
                  points={c.history.map((h) => `${h.x},${h.y}`).join(' ')}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              )}
              {c.history.map((h, idx) => (
                <circle
                  key={`hist-${c.id}-${idx}`}
                  cx={h.x}
                  cy={h.y}
                  r={2}
                  fill="#FAF7F0"
                  stroke={c.color}
                  strokeWidth={1.5}
                />
              ))}
            </g>
          ))}

          {/* Data Points (Rendered as Bauhaus geometric glyphs) */}
          {points.map((p) => {
            const clusterIdx = p.cluster % 4;
            if (clusterIdx === 0) {
              // Solid circle (Ultramarine #1848B8)
              return (
                <circle
                  key={`pt-${p.id}`}
                  cx={p.x}
                  cy={p.y}
                  r={4.5}
                  fill="#1848B8"
                  stroke="#1A1715"
                  strokeWidth={1}
                />
              );
            } else if (clusterIdx === 1) {
              // Rotated square / diamond (Vermilion #C83226)
              return (
                <rect
                  key={`pt-${p.id}`}
                  x={p.x - 4}
                  y={p.y - 4}
                  width={8}
                  height={8}
                  transform={`rotate(45, ${p.x}, ${p.y})`}
                  fill="#C83226"
                  stroke="#1A1715"
                  strokeWidth={1}
                />
              );
            } else if (clusterIdx === 2) {
              // Equilateral triangle (Cadmium Yellow #E28C05)
              const r = 5;
              const h = (r * Math.sqrt(3)) / 2;
              return (
                <polygon
                  key={`pt-${p.id}`}
                  points={`${p.x},${p.y - r} ${p.x - h},${p.y + r / 2} ${p.x + h},${p.y + r / 2}`}
                  fill="#E28C05"
                  stroke="#1A1715"
                  strokeWidth={1}
                />
              );
            } else {
              // Crosshair Square (Sage Green #33634B)
              return (
                <g key={`pt-${p.id}`} transform={`translate(${p.x}, ${p.y})`}>
                  <rect x={-4} y={-4} width={8} height={8} fill="#33634B" stroke="#1A1715" strokeWidth={1} />
                  <circle r={1} fill="#FAF7F0" />
                </g>
              );
            }
          })}

          {/* Centroid Concentric Target Discs (dia 18px) */}
          {centroids.map((c) => (
            <g key={`centroid-${c.id}`} transform={`translate(${c.x}, ${c.y})`} className="cursor-pointer">
              <circle r={9} fill="none" stroke="#1A1715" strokeWidth={1.5} />
              <circle r={7} fill="#FAF7F0" stroke="#1A1715" strokeWidth={1} />
              <circle r={4} fill={c.color} stroke="#1A1715" strokeWidth={1} />
              <text
                y={-12}
                textAnchor="middle"
                className="font-mono text-[9px] font-bold fill-[#1A1715] select-none"
              >
                μ_{c.id + 1}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Mini Overlay State */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 font-mono text-[10px] text-[#5C544B] shadow-[1px_1px_0px_#1A1715]">
          <span>POINTS: </span>
          <span className="font-bold text-[#1A1715]">{points.length}</span>
        </div>
      </div>

      {/* Compact Status Readout Strip */}
      <div className="border-t-[1.5px] border-[#1A1715] px-3.5 py-1.5 bg-[#E8E1D3] flex items-center justify-between font-mono text-[11px] text-[#1A1715]">
        <div className="flex items-center gap-2 tnum">
          <span className="font-bold">ITERATION {String(iteration).padStart(2, '0')}</span>
          <span className="text-[#948B7D]">|</span>
          <span className="text-[#5C544B]">K = {k}</span>
          <span className="text-[#948B7D]">|</span>
          <span
            className={`font-bold ${
              statePhase === 'CONVERGED'
                ? 'text-[#33634B]'
                : statePhase === 'ASSIGNMENT'
                ? 'text-[#1848B8]'
                : 'text-[#C83226]'
            }`}
          >
            STATE: {statePhase}
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="border-t-[1.5px] border-[#1A1715] p-2 bg-[#FAF7F0] flex flex-wrap items-center justify-between gap-2">
        {/* Playback Stepper Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-8 h-8 flex items-center justify-center bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#F0EAE0]"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#1A1715] fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#C83226] fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              stepSimulation();
            }}
            title="Step Forward"
            className="w-8 h-8 flex items-center justify-center bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#F0EAE0]"
          >
            <SkipForward className="w-3.5 h-3.5 text-[#1A1715]" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              initializeSimulation(k);
            }}
            title="Reset"
            className="w-8 h-8 flex items-center justify-center bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#F0EAE0]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#1A1715]" />
          </button>
        </div>

        {/* K Selector */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] mr-1">CENTROIDS:</span>
          {[2, 3, 4].map((kOption) => (
            <button
              key={kOption}
              onClick={() => {
                setK(kOption);
              }}
              className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold border-[1.5px] border-[#1A1715] ${
                k === kOption
                  ? 'bg-[#1848B8] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              {kOption}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
