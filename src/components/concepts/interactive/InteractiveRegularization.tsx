'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, Filter, AlertCircle } from 'lucide-react';

export const InteractiveRegularization: React.FC = () => {
  const [penaltyType, setPenaltyType] = useState<'l1' | 'l2'>('l1');
  const [lambda, setLambda] = useState<number>(1.5); // Regularization strength

  // Unconstrained OLS optimum
  const olsW1 = 3.2;
  const olsW2 = 1.8;

  // Compute regularized weights based on penalty
  const { regW1, regW2, isSparse, constraintRadius } = useMemo(() => {
    // Constraint budget C inversely proportional to lambda
    const C = Math.max(0.4, 4.2 / (1 + 0.9 * lambda));

    let w1 = 0;
    let w2 = 0;
    let sparse = false;

    if (penaltyType === 'l1') {
      // Soft-thresholding analytical behavior for L1
      // When lambda is high, w2 hits zero at the diamond vertex
      const threshold = 1.2;
      w1 = Math.max(0, olsW1 - 0.55 * lambda);
      if (lambda >= threshold) {
        w2 = 0.0; // Exact sparsity!
        sparse = true;
      } else {
        w2 = Math.max(0, olsW2 - 0.75 * lambda);
      }
    } else {
      // L2 Ridge shrinkage: w_ridge = (X^T X + lambda I)^-1 X^T y
      // Shrinks asymptotically toward origin without ever hitting zero
      const shrinkFactor = 1 / (1 + 0.6 * lambda);
      w1 = olsW1 * shrinkFactor;
      w2 = olsW2 * shrinkFactor;
      sparse = false;
    }

    return { regW1: w1, regW2: w2, isSparse: sparse, constraintRadius: C };
  }, [penaltyType, lambda]);

  // SVG coordinate mapper for (w1: -0.5 to 4.5, w2: -0.5 to 3.5)
  const svgW = 460;
  const svgH = 240;
  const padL = 40;
  const padB = 30;
  const padT = 15;
  const padR = 20;

  const toSvgW1 = (w: number) => padL + ((w + 0.5) / 5.0) * (svgW - padL - padR);
  const toSvgW2 = (w: number) => svgH - padB - ((w + 0.5) / 4.0) * (svgH - padT - padB);

  // SVG Ellipses for OLS Contours centered at (olsW1, olsW2)
  const centerSvgX = toSvgW1(olsW1);
  const centerSvgY = toSvgW2(olsW2);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            GEOMETRY OF REGULARIZATION: LASSO ($L_1$) vs RIDGE ($L_2$)
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-[#F4EFE4] border border-[#1A1715] font-bold text-[#1A1715]">
            PARAMETER SPACE $(w_1, w_2)$
          </span>
          <span
            className={`px-1.5 py-0.5 border border-[#1A1715] font-bold ${
              isSparse ? 'bg-[#E8F0E6] text-[#33634B]' : 'bg-[#E8E1D3] text-[#1848B8]'
            }`}
          >
            {isSparse ? 'SPARSITY DETECTED (w₂ = 0)' : 'DENSE WEIGHTS'}
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        {/* Penalty Selector */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            REGULARIZATION NORM:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPenaltyType('l1')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                penaltyType === 'l1'
                  ? 'bg-[#C83226] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              $L_1$ LASSO (DIAMOND)
            </button>
            <button
              onClick={() => setPenaltyType('l2')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                penaltyType === 'l2'
                  ? 'bg-[#1848B8] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              $L_2$ RIDGE (SPHERE)
            </button>
          </div>
        </div>

        {/* Regularization Strength Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-[#5C544B] uppercase">PENALTY COEFFICIENT ($\lambda$):</span>
            <span className="text-sm font-black text-[#1A1715]">
              {lambda.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="4.5"
            step="0.1"
            value={lambda}
            onChange={(e) => setLambda(parseFloat(e.target.value))}
            className="w-full accent-[#1848B8] cursor-pointer"
          />
        </div>
      </div>

      {/* 2D Geometric Plane Canvas */}
      <div className="relative bg-[#F4EFE4] border-[1.5px] border-[#1A1715] p-1">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none">
          {/* Coordinate Axes */}
          <line
            x1={toSvgW1(0)}
            y1={padT}
            x2={toSvgW1(0)}
            y2={svgH - padB}
            stroke="#1A1715"
            strokeWidth="1.5"
          />
          <line
            x1={padL}
            y1={toSvgW2(0)}
            x2={svgW - padR}
            y2={toSvgW2(0)}
            stroke="#1A1715"
            strokeWidth="1.5"
          />

          {/* OLS Unconstrained Loss Contours (Ellipses) */}
          {[25, 55, 90].map((rx, idx) => (
            <ellipse
              key={`contour-${idx}`}
              cx={centerSvgX}
              cy={centerSvgY}
              rx={rx}
              ry={rx * 0.65}
              fill="none"
              stroke="#D8CFC0"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          ))}

          {/* Unconstrained OLS Target Point */}
          <circle cx={centerSvgX} cy={centerSvgY} r="4" fill="#5C544B" />
          <text
            x={centerSvgX + 8}
            y={centerSvgY - 4}
            fill="#5C544B"
            fontSize="9"
            fontWeight="bold"
          >
            w(OLS) ({olsW1}, {olsW2})
          </text>

          {/* Constraint Region around (0,0) */}
          {penaltyType === 'l1' ? (
            /* Diamond for L1 */
            <polygon
              points={`
                ${toSvgW1(constraintRadius)},${toSvgW2(0)}
                ${toSvgW1(0)},${toSvgW2(constraintRadius)}
                ${toSvgW1(-constraintRadius)},${toSvgW2(0)}
                ${toSvgW1(0)},${toSvgW2(-constraintRadius)}
              `}
              fill="rgba(200, 50, 38, 0.12)"
              stroke="#C83226"
              strokeWidth="2"
            />
          ) : (
            /* Circle for L2 */
            <circle
              cx={toSvgW1(0)}
              cy={toSvgW2(0)}
              r={((constraintRadius) / 5.0) * (svgW - padL - padR)}
              fill="rgba(24, 72, 184, 0.12)"
              stroke="#1848B8"
              strokeWidth="2"
            />
          )}

          {/* Tangency Solution Point */}
          <circle
            cx={toSvgW1(regW1)}
            cy={toSvgW2(regW2)}
            r="6"
            fill={isSparse ? '#33634B' : penaltyType === 'l1' ? '#C83226' : '#1848B8'}
            stroke="#1A1715"
            strokeWidth="2"
          />

          {/* Vector Ray from (0,0) to Solution */}
          <line
            x1={toSvgW1(0)}
            y1={toSvgW2(0)}
            x2={toSvgW1(regW1)}
            y2={toSvgW2(regW2)}
            stroke="#1A1715"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Axis Labels */}
          <text x={svgW - 20} y={toSvgW2(0) + 14} fill="#1A1715" fontSize="10" fontWeight="bold">
            $w_1$
          </text>
          <text x={toSvgW1(0) + 6} y={padT + 10} fill="#1A1715" fontSize="10" fontWeight="bold">
            $w_2$
          </text>
        </svg>

        {/* Floating Geometry Badge */}
        <div className="absolute top-3 right-3 bg-[#FAF7F0] border border-[#1A1715] p-2 space-y-1 text-[9px] shadow-[2px_2px_0px_#1A1715]">
          <div className="font-bold text-[#1A1715]">
            {penaltyType === 'l1' ? 'L1 DIAMOND CONTOUR' : 'L2 CIRCLE CONTOUR'}
          </div>
          <div className="text-[#5C544B]">
            {penaltyType === 'l1'
              ? 'Corners touch axes where $w_j = 0$'
              : 'Smooth boundary; no directional bias'}
          </div>
        </div>
      </div>

      {/* Readout Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#1848B8] block">
            REGULARIZED WEIGHT $w_1$
          </span>
          <div className="text-base font-black text-[#1A1715]">
            {regW1.toFixed(3)}
          </div>
          <span className="text-[8px] text-[#5C544B]">Shrunk from OLS 3.200</span>
        </div>

        <div
          className={`p-2.5 border-[1.5px] border-[#1A1715] space-y-1 ${
            isSparse ? 'bg-[#E8F0E6]' : 'bg-[#FAF7F0]'
          }`}
        >
          <span className="text-[9px] uppercase font-bold text-[#C83226] block">
            REGULARIZED WEIGHT $w_2$
          </span>
          <div
            className={`text-base font-black ${
              isSparse ? 'text-[#33634B]' : 'text-[#1A1715]'
            }`}
          >
            {regW2.toFixed(3)}
          </div>
          <span className="text-[8px] text-[#5C544B]">
            {isSparse ? 'EXACT ZERO (FEATURE DISCARDED)' : 'Continuous shrinkage'}
          </span>
        </div>

        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#E28C05] block">
            MATHEMATICAL PRINCIPLE
          </span>
          <span className="text-[9px] text-[#5C544B] block leading-tight">
            {penaltyType === 'l1'
              ? 'L1 Diamond has non-differentiable sharp corners along coordinate axes where the elliptical loss contour strikes first, setting coefficients identically to zero.'
              : 'L2 Circle has smooth curvature everywhere; the tangency point with the ellipse never lands exactly on the axis, preserving all features with reduced magnitude.'}
          </span>
        </div>
      </div>
    </div>
  );
};
