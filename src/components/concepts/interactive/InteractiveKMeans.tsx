'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw, Play, ArrowRight } from 'lucide-react';

interface Point {
  id: string;
  x: number;
  y: number;
  cluster: number; // 0, 1, 2
}

interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
  glyph: 'circle' | 'diamond' | 'triangle';
  trail: Array<{ x: number; y: number }>;
}

export const InteractiveKMeans: React.FC = () => {
  // 21 Fixed 2D data points clustered into 3 loose groups
  const initialPoints: Point[] = [
    // Group A (Bottom Left)
    { id: 'p1', x: 2.2, y: 2.5, cluster: 0 },
    { id: 'p2', x: 2.8, y: 3.2, cluster: 0 },
    { id: 'p3', x: 3.5, y: 2.0, cluster: 0 },
    { id: 'p4', x: 1.8, y: 3.8, cluster: 0 },
    { id: 'p5', x: 3.0, y: 4.0, cluster: 0 },
    { id: 'p6', x: 4.0, y: 2.8, cluster: 0 },
    { id: 'p7', x: 2.5, y: 1.5, cluster: 0 },

    // Group B (Top Center)
    { id: 'p8', x: 5.5, y: 7.5, cluster: 1 },
    { id: 'p9', x: 6.2, y: 8.2, cluster: 1 },
    { id: 'p10', x: 6.8, y: 7.0, cluster: 1 },
    { id: 'p11', x: 5.0, y: 6.8, cluster: 1 },
    { id: 'p12', x: 7.2, y: 8.0, cluster: 1 },
    { id: 'p13', x: 6.0, y: 9.0, cluster: 1 },
    { id: 'p14', x: 5.8, y: 6.2, cluster: 1 },

    // Group C (Bottom Right)
    { id: 'p15', x: 8.0, y: 2.0, cluster: 2 },
    { id: 'p16', x: 8.5, y: 3.0, cluster: 2 },
    { id: 'p17', x: 9.2, y: 2.2, cluster: 2 },
    { id: 'p18', x: 7.5, y: 3.5, cluster: 2 },
    { id: 'p19', x: 8.8, y: 4.2, cluster: 2 },
    { id: 'p20', x: 9.5, y: 3.2, cluster: 2 },
    { id: 'p21', x: 8.2, y: 1.2, cluster: 2 },
  ];

  // Intentionally offset initial seeds to demonstrate convergence movement
  const initialCentroids: Centroid[] = [
    { id: 0, x: 2.0, y: 6.5, color: '#1848B8', glyph: 'circle', trail: [{ x: 2.0, y: 6.5 }] },
    { id: 1, x: 5.0, y: 4.0, color: '#E28C05', glyph: 'diamond', trail: [{ x: 5.0, y: 4.0 }] },
    { id: 2, x: 8.5, y: 7.0, color: '#33634B', glyph: 'triangle', trail: [{ x: 8.5, y: 7.0 }] },
  ];

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [centroids, setCentroids] = useState<Centroid[]>(initialCentroids);
  const [phase, setPhase] = useState<'assign' | 'update'>('assign');
  const [iteration, setIteration] = useState<number>(0);
  const [isConverged, setIsConverged] = useState<boolean>(false);

  // Compute inertia (WCSS)
  const inertia = useMemo(() => {
    let sum = 0;
    for (const p of points) {
      const c = centroids[p.cluster];
      if (c) {
        sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      }
    }
    return sum;
  }, [points, centroids]);

  // Execute one step of Lloyd algorithm
  const stepLloyd = () => {
    if (isConverged) return;

    if (phase === 'assign') {
      // Step 1: Assign each point to nearest centroid
      let swaps = 0;
      const updatedPoints = points.map((p) => {
        let minDist = Infinity;
        let bestCluster = p.cluster;
        centroids.forEach((c) => {
          const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          if (d < minDist) {
            minDist = d;
            bestCluster = c.id;
          }
        });
        if (bestCluster !== p.cluster) swaps++;
        return { ...p, cluster: bestCluster };
      });

      setPoints(updatedPoints);
      setPhase('update');
      if (swaps === 0 && iteration > 0) {
        setIsConverged(true);
      }
    } else {
      // Step 2: Update centroid coordinates to cluster arithmetic mean
      let totalShift = 0;
      const updatedCentroids = centroids.map((c) => {
        const assigned = points.filter((p) => p.cluster === c.id);
        if (assigned.length === 0) return c;
        const meanX = assigned.reduce((acc, p) => acc + p.x, 0) / assigned.length;
        const meanY = assigned.reduce((acc, p) => acc + p.y, 0) / assigned.length;
        totalShift += Math.abs(meanX - c.x) + Math.abs(meanY - c.y);
        return {
          ...c,
          x: Number(meanX.toFixed(3)),
          y: Number(meanY.toFixed(3)),
          trail: [...c.trail, { x: Number(meanX.toFixed(3)), y: Number(meanY.toFixed(3)) }],
        };
      });

      setCentroids(updatedCentroids);
      setPhase('assign');
      setIteration((i) => i + 1);
      if (totalShift < 0.02) {
        setIsConverged(true);
      }
    }
  };

  const reset = () => {
    setPoints(initialPoints);
    setCentroids(initialCentroids);
    setPhase('assign');
    setIteration(0);
    setIsConverged(false);
  };

  // SVG coordinate transformation (X: 0 to 11, Y: 0 to 10)
  const svgWidth = 460;
  const svgHeight = 240;
  const pad = 25;

  const toSvgX = (x: number) => pad + (x / 11) * (svgWidth - pad * 2);
  const toSvgY = (y: number) => svgHeight - pad - (y / 10) * (svgHeight - pad * 2);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            LLOYD’S TWO-PHASE INTERACTIVE BENCH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={stepLloyd}
            disabled={isConverged}
            className="px-2.5 py-1 bg-[#1848B8] text-[#FAF7F0] font-bold text-[10px] uppercase border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#133aa0] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40 flex items-center gap-1"
          >
            <span>{phase === 'assign' ? '1. Assign Points' : '2. Update Centroids'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={reset}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
            title="Reset Centroids"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Coordinate Grid SVG */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Subtle grid */}
          {[2, 4, 6, 8, 10].map((gx) => (
            <line key={`gx-${gx}`} x1={toSvgX(gx)} y1={pad} x2={toSvgX(gx)} y2={svgHeight - pad} stroke="#E0D7C8" strokeWidth="1" />
          ))}
          {[2, 4, 6, 8].map((gy) => (
            <line key={`gy-${gy}`} x1={pad} y1={toSvgY(gy)} x2={svgWidth - pad} y2={toSvgY(gy)} stroke="#E0D7C8" strokeWidth="1" />
          ))}

          {/* Centroid Trajectory Trails */}
          {centroids.map((c) => (
            <polyline
              key={`trail-${c.id}`}
              points={c.trail.map((t) => `${toSvgX(t.x)},${toSvgY(t.y)}`).join(' ')}
              fill="none"
              stroke={c.color}
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          ))}

          {/* Assignment Lines from Points to Centroid */}
          {points.map((p) => {
            const c = centroids[p.cluster];
            if (!c) return null;
            return (
              <line
                key={`line-${p.id}`}
                x1={toSvgX(p.x)}
                y1={toSvgY(p.y)}
                x2={toSvgX(c.x)}
                y2={toSvgY(c.y)}
                stroke={c.color}
                strokeWidth="0.75"
                opacity="0.35"
              />
            );
          })}

          {/* Data Points */}
          {points.map((p) => {
            const c = centroids[p.cluster];
            const color = c ? c.color : '#1A1715';
            return (
              <circle
                key={p.id}
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r="4.5"
                fill={color}
                stroke="#1A1715"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Concentric Target Centroids */}
          {centroids.map((c) => (
            <g key={`centroid-${c.id}`}>
              {/* Outer halo disc */}
              <circle
                cx={toSvgX(c.x)}
                cy={toSvgY(c.y)}
                r="9"
                fill={c.color}
                fillOpacity="0.2"
                stroke={c.color}
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              {/* Core target */}
              <circle
                cx={toSvgX(c.x)}
                cy={toSvgY(c.y)}
                r="5"
                fill="#FAF7F0"
                stroke="#1A1715"
                strokeWidth="2"
              />
              <circle
                cx={toSvgX(c.x)}
                cy={toSvgY(c.y)}
                r="2"
                fill={c.color}
              />
              {/* Centroid Label Tag */}
              <text
                x={toSvgX(c.x) + 10}
                y={toSvgY(c.y) - 5}
                fill="#1A1715"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                μ_{c.id + 1}
              </text>
            </g>
          ))}
        </svg>

        {/* Status Callout */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 text-[9px] space-y-0.5">
          <div className="font-bold flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isConverged ? 'bg-[#33634B]' : 'bg-[#E28C05]'}`} />
            <span>{isConverged ? 'STATUS: CONVERGED' : `PHASE: ${phase.toUpperCase()}`}</span>
          </div>
          <div className="text-[#5C544B]">Inertia (WCSS): {inertia.toFixed(2)}</div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">CURRENT STEP:</span>
          <span className="font-mono text-xs font-black text-[#1848B8]">
            {phase === 'assign' ? 'Point Assignment' : 'Centroid Update'}
          </span>
        </div>
        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">ITERATION:</span>
          <span className="font-mono text-xs font-black text-[#1A1715]">{iteration}</span>
        </div>
        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">TOTAL INERTIA:</span>
          <span className="font-mono text-xs font-black text-[#C83226]">{inertia.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
