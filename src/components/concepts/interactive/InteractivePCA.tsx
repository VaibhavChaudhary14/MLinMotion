'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const InteractivePCA: React.FC = () => {
  // 16 Zero-centered correlated 2D points (Covariance ellipse tilted around ~38 degrees)
  const points: Point[] = [
    { x: -3.2, y: -2.4 },
    { x: -2.8, y: -1.8 },
    { x: -2.1, y: -2.0 },
    { x: -1.7, y: -1.1 },
    { x: -1.2, y: -1.4 },
    { x: -0.8, y: -0.3 },
    { x: -0.4, y: -0.6 },
    { x: 0.1, y: 0.2 },
    { x: 0.5, y: -0.2 },
    { x: 0.9, y: 0.8 },
    { x: 1.4, y: 0.9 },
    { x: 1.8, y: 1.6 },
    { x: 2.3, y: 1.4 },
    { x: 2.7, y: 2.3 },
    { x: 3.1, y: 2.1 },
    { x: 3.5, y: 2.8 },
  ];

  // Rotation angle in degrees for candidate axis u
  const [angleDeg, setAngleDeg] = useState<number>(10);

  // Convert to radians and unit vector
  const rad = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);

  // Compute orthogonal projections and projected variance
  const projectionStats = useMemo(() => {
    let sumSq = 0;
    const projections = points.map((p) => {
      // Scalar projection dot product: s = p · u
      const s = p.x * ux + p.y * uy;
      sumSq += s * s;
      // Coordinates of projected point on line
      const projX = s * ux;
      const projY = s * uy;
      return { ...p, s, projX, projY };
    });
    const variance = sumSq / points.length;
    return { projections, variance };
  }, [points, ux, uy]);

  // Optimal PC1 angle for this dataset is ~38 degrees
  const snapToPC1 = () => {
    setAngleDeg(38);
  };

  // SVG coordinate transformation (X: -4.5 to 4.5, Y: -3.5 to 3.5)
  const svgWidth = 460;
  const svgHeight = 240;
  const padLeft = 30;
  const padBottom = 25;
  const padTop = 15;
  const padRight = 30;

  const toSvgX = (x: number) => padLeft + ((x - (-4.5)) / (4.5 - (-4.5))) * (svgWidth - padLeft - padRight);
  const toSvgY = (y: number) => svgHeight - padBottom - ((y - (-3.5)) / (3.5 - (-3.5))) * (svgHeight - padTop - padBottom);

  // Line endpoints across bounding domain
  const lineLength = 5.5;
  const lx1 = -lineLength * ux;
  const ly1 = -lineLength * uy;
  const lx2 = lineLength * ux;
  const ly2 = lineLength * uy;

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            ORTHOGONAL VARIANCE PROJECTION BENCH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={snapToPC1}
            className="px-2 py-1 bg-[#E28C05] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#d48103] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>Snap to PC1 (38°)</span>
          </button>
          <button
            onClick={() => setAngleDeg(0)}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Coordinate Grid SVG */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Centered coordinate crosshair */}
          <line x1={padLeft} y1={toSvgY(0)} x2={svgWidth - padRight} y2={toSvgY(0)} stroke="#D8CFC0" strokeWidth="1" />
          <line x1={toSvgX(0)} y1={padTop} x2={toSvgX(0)} y2={svgHeight - padBottom} stroke="#D8CFC0" strokeWidth="1" />

          {/* Orthogonal projection drop lines (Vermilion dashed) */}
          {projectionStats.projections.map((p, idx) => (
            <line
              key={`drop-${idx}`}
              x1={toSvgX(p.x)}
              y1={toSvgY(p.y)}
              x2={toSvgX(p.projX)}
              y2={toSvgY(p.projY)}
              stroke="#C83226"
              strokeWidth="1"
              strokeDasharray="2,2"
              opacity="0.65"
            />
          ))}

          {/* Candidate Axis Line (Active Orientation) */}
          <line
            x1={toSvgX(lx1)}
            y1={toSvgY(ly1)}
            x2={toSvgX(lx2)}
            y2={toSvgY(ly2)}
            stroke="#1A1715"
            strokeWidth="2.5"
          />

          {/* Axis Unit Vector Indicator Arrow */}
          <circle cx={toSvgX(ux * 2)} cy={toSvgY(uy * 2)} r="3" fill="#1848B8" />
          <text
            x={toSvgX(ux * 2.2) + 5}
            y={toSvgY(uy * 2.2) - 5}
            fill="#1848B8"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
          >
            u (unit vector)
          </text>

          {/* Projected Dots on Line */}
          {projectionStats.projections.map((p, idx) => (
            <circle
              key={`proj-dot-${idx}`}
              cx={toSvgX(p.projX)}
              cy={toSvgY(p.projY)}
              r="2.5"
              fill="#E28C05"
              stroke="#1A1715"
              strokeWidth="0.75"
            />
          ))}

          {/* Raw Data Points in 2D Space */}
          {points.map((p, idx) => (
            <circle
              key={`raw-dot-${idx}`}
              cx={toSvgX(p.x)}
              cy={toSvgY(p.y)}
              r="4"
              fill="#FAF7F0"
              stroke="#1A1715"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {/* Status Callout */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 text-[9px] space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2.5 h-[2px] bg-[#1A1715]" />
            <span>Angle: θ = {angleDeg}°</span>
          </div>
          <div className="text-[#5C544B]">
            Projected Var: <strong className="text-[#E28C05]">{projectionStats.variance.toFixed(3)}</strong>
          </div>
        </div>
      </div>

      {/* Angle Dial Slider & Variance Readout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Slider */}
        <div className="space-y-1 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="flex justify-between text-[10px]">
            <span className="font-bold">AXIS ROTATION ANGLE (θ):</span>
            <span className="font-mono font-bold text-[#1848B8]">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            value={angleDeg}
            onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
            className="w-full accent-[#1848B8] cursor-pointer"
          />
          <div className="flex justify-between text-[8px] text-[#948B7D]">
            <span>0° (Horizontal)</span>
            <span className="text-[#E28C05] font-bold">PC1 Max (~38°)</span>
            <span>90° (Vertical)</span>
            <span>180°</span>
          </div>
        </div>

        {/* Live Variance Metrics */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">PROJECTED VAR:</span>
            <div className="font-mono text-base font-black text-[#E28C05]">
              {projectionStats.variance.toFixed(3)}
            </div>
            <span className="text-[8px] text-[#948B7D]">Target: Maximize</span>
          </div>

          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">PC1 ALIGNMENT:</span>
            <div className="font-mono text-base font-black text-[#33634B]">
              {Math.abs(angleDeg - 38) <= 3 ? '100% ★' : `${Math.max(20, 100 - Math.abs(angleDeg - 38) * 1.5).toFixed(0)}%`}
            </div>
            <span className="text-[8px] text-[#33634B] font-bold">
              {Math.abs(angleDeg - 38) <= 3 ? 'Eigenvector Locked' : 'Searching...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
