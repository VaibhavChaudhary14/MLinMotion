'use client';

import React, { useState, useMemo } from 'react';
import { Target, HelpCircle, Layers } from 'lucide-react';

interface KNNPoint {
  id: string;
  x: number;
  y: number;
  label: 'Class A' | 'Class B';
}

export const InteractiveKNN: React.FC = () => {
  // 18 fixed points
  const points: KNNPoint[] = useMemo(
    () => [
      // Class A points (Vermilion Circles)
      { id: 'a1', x: 20, y: 70, label: 'Class A' },
      { id: 'a2', x: 25, y: 80, label: 'Class A' },
      { id: 'a3', x: 30, y: 65, label: 'Class A' },
      { id: 'a4', x: 35, y: 75, label: 'Class A' },
      { id: 'a5', x: 18, y: 55, label: 'Class A' },
      { id: 'a6', x: 28, y: 50, label: 'Class A' },
      { id: 'a7', x: 38, y: 60, label: 'Class A' },
      { id: 'a8', x: 42, y: 70, label: 'Class A' },
      { id: 'a_outlier', x: 72, y: 68, label: 'Class A' }, // Outlier in B territory!

      // Class B points (Ultramarine Squares)
      { id: 'b1', x: 65, y: 35, label: 'Class B' },
      { id: 'b2', x: 75, y: 40, label: 'Class B' },
      { id: 'b3', x: 80, y: 30, label: 'Class B' },
      { id: 'b4', x: 70, y: 22, label: 'Class B' },
      { id: 'b5', x: 60, y: 45, label: 'Class B' },
      { id: 'b6', x: 85, y: 45, label: 'Class B' },
      { id: 'b7', x: 78, y: 55, label: 'Class B' },
      { id: 'b8', x: 68, y: 58, label: 'Class B' },
      { id: 'b9', x: 55, y: 30, label: 'Class B' },
    ],
    []
  );

  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number }>({ x: 68, y: 62 });
  const [k, setK] = useState<number>(3);
  const [metric, setMetric] = useState<'euclidean' | 'manhattan'>('euclidean');

  // Compute distances & sort
  const { neighbors, maxDist, classACount, classBCount, winner, confidence } = useMemo(() => {
    const list = points.map((p) => {
      const dx = Math.abs(p.x - queryPoint.x);
      const dy = Math.abs(p.y - queryPoint.y);
      const dist =
        metric === 'euclidean'
          ? Math.sqrt(dx * dx + dy * dy)
          : dx + dy;
      return { ...p, dist, dx, dy };
    });

    list.sort((a, b) => a.dist - b.dist);
    const topK = list.slice(0, k);

    let countA = 0;
    let countB = 0;
    topK.forEach((n) => {
      if (n.label === 'Class A') countA++;
      else countB++;
    });

    const win = countA > countB ? 'Class A' : 'Class B';
    const conf = (Math.max(countA, countB) / k) * 100;
    const maxD = topK[topK.length - 1]?.dist || 0;

    return {
      neighbors: topK,
      maxDist: maxD,
      classACount: countA,
      classBCount: countB,
      winner: win,
      confidence: conf,
    };
  }, [points, queryPoint, k, metric]);

  // SVG dimensions
  const svgW = 460;
  const svgH = 240;
  const toSvgX = (x: number) => 30 + (x / 100) * (svgW - 50);
  const toSvgY = (y: number) => svgH - 25 - (y / 100) * (svgH - 45);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = Math.round(((clickX - 30) / (svgW - 50)) * 100);
    const normY = Math.round(((svgH - 25 - clickY) / (svgH - 45)) * 100);

    const clampedX = Math.max(5, Math.min(95, normX));
    const clampedY = Math.max(5, Math.min(95, normY));
    setQueryPoint({ x: clampedX, y: clampedY });
  };

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            K-NEAREST NEIGHBORS METRIC & BALLOT BENCH
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-[#F4EFE4] border border-[#1A1715] font-bold text-[#1A1715]">
            N = 18 LABELED POINTS
          </span>
          <span className="px-1.5 py-0.5 bg-[#E8E1D3] border border-[#1A1715] font-bold text-[#1848B8]">
            NON-PARAMETRIC
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        {/* K Selector */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            NEIGHBOR COUNT ($K$):
          </span>
          <div className="flex items-center gap-1">
            {[1, 3, 5, 7, 9].map((val) => (
              <button
                key={val}
                onClick={() => setK(val)}
                className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                  k === val
                    ? 'bg-[#E28C05] text-[#1A1715] border-[#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Metric */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            DISTANCE NORM:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMetric('euclidean')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                metric === 'euclidean'
                  ? 'bg-[#1848B8] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              $L_2$ EUCLIDEAN
            </button>
            <button
              onClick={() => setMetric('manhattan')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                metric === 'manhattan'
                  ? 'bg-[#1848B8] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              $L_1$ MANHATTAN
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            TEST POSITIONS:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQueryPoint({ x: 68, y: 62 })}
              className="flex-1 py-1 text-[9px] font-bold bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3] text-[#C83226]"
              title="Near Class A outlier in Class B territory"
            >
              NEAR OUTLIER
            </button>
            <button
              onClick={() => setQueryPoint({ x: 48, y: 52 })}
              className="flex-1 py-1 text-[9px] font-bold bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3] text-[#1848B8]"
              title="On the decision boundary"
            >
              BOUNDARY
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative bg-[#F4EFE4] border-[1.5px] border-[#1A1715] p-1">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          onClick={handleSvgClick}
          className="w-full h-auto cursor-crosshair select-none"
        >
          {/* Grid lines */}
          <line x1="30" y1={svgH - 25} x2={svgW - 20} y2={svgH - 25} stroke="#1A1715" strokeWidth="1.5" />
          <line x1="30" y1="15" x2="30" y2={svgH - 25} stroke="#1A1715" strokeWidth="1.5" />

          {/* Metric Neighborhood Boundary (Circle for L2, Diamond for L1) */}
          {metric === 'euclidean' ? (
            <circle
              cx={toSvgX(queryPoint.x)}
              cy={toSvgY(queryPoint.y)}
              r={(maxDist / 100) * (svgW - 50)}
              fill="rgba(226, 140, 5, 0.08)"
              stroke="#E28C05"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          ) : (
            <polygon
              points={`
                ${toSvgX(queryPoint.x)},${toSvgY(queryPoint.y + maxDist)}
                ${toSvgX(queryPoint.x + maxDist)},${toSvgY(queryPoint.y)}
                ${toSvgX(queryPoint.x)},${toSvgY(queryPoint.y - maxDist)}
                ${toSvgX(queryPoint.x - maxDist)},${toSvgY(queryPoint.y)}
              `}
              fill="rgba(226, 140, 5, 0.08)"
              stroke="#E28C05"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          {/* Rays from Query Point to K Neighbors */}
          {neighbors.map((n, i) => (
            <line
              key={`ray-${n.id}`}
              x1={toSvgX(queryPoint.x)}
              y1={toSvgY(queryPoint.y)}
              x2={toSvgX(n.x)}
              y2={toSvgY(n.y)}
              stroke={n.label === 'Class A' ? '#C83226' : '#1848B8'}
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          ))}

          {/* Labeled Training Points */}
          {points.map((p) => {
            const isNeighbor = neighbors.some((n) => n.id === p.id);
            const rank = neighbors.findIndex((n) => n.id === p.id);

            return (
              <g key={p.id}>
                {p.label === 'Class A' ? (
                  <circle
                    cx={toSvgX(p.x)}
                    cy={toSvgY(p.y)}
                    r={isNeighbor ? 6.5 : 4.5}
                    fill="#C83226"
                    stroke="#1A1715"
                    strokeWidth={isNeighbor ? 2 : 1}
                  />
                ) : (
                  <rect
                    x={toSvgX(p.x) - (isNeighbor ? 5.5 : 4)}
                    y={toSvgY(p.y) - (isNeighbor ? 5.5 : 4)}
                    width={isNeighbor ? 11 : 8}
                    height={isNeighbor ? 11 : 8}
                    fill="#1848B8"
                    stroke="#1A1715"
                    strokeWidth={isNeighbor ? 2 : 1}
                  />
                )}
                {isNeighbor && (
                  <text
                    x={toSvgX(p.x)}
                    y={toSvgY(p.y) - 9}
                    fill="#1A1715"
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    #{rank + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* Query Point (Rotated Crosshair Diamond) */}
          <g>
            <circle
              cx={toSvgX(queryPoint.x)}
              cy={toSvgY(queryPoint.y)}
              r="7"
              fill="#E28C05"
              stroke="#1A1715"
              strokeWidth="2"
            />
            <circle
              cx={toSvgX(queryPoint.x)}
              cy={toSvgY(queryPoint.y)}
              r="2"
              fill="#1A1715"
            />
            <text
              x={toSvgX(queryPoint.x)}
              y={toSvgY(queryPoint.y) + 16}
              fill="#1A1715"
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
            >
              $x_q$
            </text>
          </g>
        </svg>

        {/* Floating Instruction Banner */}
        <div className="absolute bottom-2 left-3 bg-[#FAF7F0] border border-[#1A1715] px-2 py-1 text-[9px] text-[#5C544B]">
          Click canvas anywhere to reposition query point $x_q$
        </div>
      </div>

      {/* Ballot Output & Decision Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">
            NEIGHBOR BALLOT ($K={k}$)
          </span>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#C83226] font-bold">Class A: {classACount} votes</span>
            <span className="text-[#1848B8] font-bold">Class B: {classBCount} votes</span>
          </div>
          <div className="w-full bg-[#E8E1D3] h-2 border border-[#1A1715] flex overflow-hidden">
            <div
              className="bg-[#C83226] h-full"
              style={{ width: `${(classACount / k) * 100}%` }}
            />
            <div
              className="bg-[#1848B8] h-full"
              style={{ width: `${(classBCount / k) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">
            MAJORITY CLASSIFICATION
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 ${
                winner === 'Class A' ? 'rounded-full bg-[#C83226]' : 'bg-[#1848B8]'
              }`}
            />
            <span className="text-sm font-black text-[#1A1715]">{winner}</span>
            <span className="text-[10px] font-bold text-[#5C544B]">
              ({confidence.toFixed(0)}% conf)
            </span>
          </div>
        </div>

        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#E28C05] block">
            INDUCTIVE LESSON
          </span>
          <span className="text-[9px] text-[#5C544B] block leading-tight">
            {k === 1
              ? 'K=1 is highly sensitive to noise and memorizes outliers without smoothing.'
              : `K=${k} aggregates local density, filtering out single anomalous points.`}
          </span>
        </div>
      </div>
    </div>
  );
};
