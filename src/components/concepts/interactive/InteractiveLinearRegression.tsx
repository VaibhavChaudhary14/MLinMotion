'use client';

import React, { useState, useMemo } from 'react';
import { computeOLS } from '@/lib/math/regression';
import { Point2D } from '@/types';
import { RefreshCw, Zap } from 'lucide-react';

export const InteractiveLinearRegression: React.FC = () => {
  // Pre-configured relatable data points: X = Area (100 sq ft), Y = Price ($k)
  const initialPoints: Point2D[] = [
    { id: 'p1', x: 12, y: 35 },
    { id: 'p2', x: 16, y: 48 },
    { id: 'p3', x: 20, y: 55 },
    { id: 'p4', x: 24, y: 72 },
    { id: 'p5', x: 28, y: 80 },
    { id: 'p6', x: 34, y: 105 },
    { id: 'p7', x: 38, y: 115 },
  ];

  const [points, setPoints] = useState<Point2D[]>(initialPoints);
  
  // Interactive slope and intercept
  const [slope, setSlope] = useState<number>(2.5);
  const [intercept, setIntercept] = useState<number>(5.0);

  // Compute closed-form exact OLS solution
  const ols = useMemo(() => computeOLS(points), [points]);

  // Compute residuals and MSE for current (w, b)
  const stats = useMemo(() => {
    let sse = 0;
    const residuals = points.map((p) => {
      const yHat = slope * p.x + intercept;
      const res = p.y - yHat;
      sse += res * res;
      return { ...p, yHat, res };
    });
    const mse = points.length > 0 ? sse / points.length : 0;
    return { residuals, mse };
  }, [points, slope, intercept]);

  // Coordinate mapping for SVG (X: 5 to 45, Y: 10 to 135)
  const svgWidth = 460;
  const svgHeight = 260;
  const padLeft = 45;
  const padBottom = 35;
  const padTop = 15;
  const padRight = 15;

  const toSvgX = (x: number) => padLeft + ((x - 8) / (44 - 8)) * (svgWidth - padLeft - padRight);
  const toSvgY = (y: number) => svgHeight - padBottom - ((y - 20) / (135 - 20)) * (svgHeight - padTop - padBottom);

  const snapToOLS = () => {
    setSlope(ols.slope);
    setIntercept(ols.intercept);
  };

  const resetManual = () => {
    setSlope(2.5);
    setIntercept(5.0);
  };

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            INTERACTIVE OLS RESIDUAL BENCH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={snapToOLS}
            className="px-2 py-1 bg-[#1848B8] text-[#FAF7F0] font-bold text-[10px] uppercase border border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#133aa0] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>Snap to Analytical OLS</span>
          </button>
          <button
            onClick={resetManual}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Coordinate SVG Canvas */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Subtle Grid Lines */}
          {[10, 20, 30, 40].map((gx) => (
            <line
              key={`gx-${gx}`}
              x1={toSvgX(gx)}
              y1={padTop}
              x2={toSvgX(gx)}
              y2={svgHeight - padBottom}
              stroke="#D8CFC0"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          ))}
          {[40, 70, 100, 130].map((gy) => (
            <line
              key={`gy-${gy}`}
              x1={padLeft}
              y1={toSvgY(gy)}
              x2={svgWidth - padRight}
              y2={toSvgY(gy)}
              stroke="#D8CFC0"
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          ))}

          {/* Coordinate Axes */}
          <line
            x1={padLeft}
            y1={svgHeight - padBottom}
            x2={svgWidth - padRight}
            y2={svgHeight - padBottom}
            stroke="#1A1715"
            strokeWidth="1.5"
          />
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={svgHeight - padBottom}
            stroke="#1A1715"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text x={svgWidth - padRight} y={svgHeight - 12} textAnchor="end" fill="#5C544B" fontSize="9" fontFamily="monospace">
            AREA (100 SQ FT) →
          </text>
          <text x={12} y={padTop + 8} textAnchor="start" fill="#5C544B" fontSize="9" fontFamily="monospace">
            PRICE ($k) ↑
          </text>

          {/* Error Residuals (Vertical Vermilion Lines) */}
          {stats.residuals.map((p) => (
            <g key={`res-${p.id}`}>
              <line
                x1={toSvgX(p.x)}
                y1={toSvgY(p.y)}
                x2={toSvgX(p.x)}
                y2={toSvgY(p.yHat)}
                stroke="#C83226"
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />
              {/* Residual square indicator (proportional area) */}
              <rect
                x={toSvgX(p.x)}
                y={Math.min(toSvgY(p.y), toSvgY(p.yHat))}
                width={Math.min(18, Math.abs(toSvgY(p.y) - toSvgY(p.yHat)) * 0.4)}
                height={Math.abs(toSvgY(p.y) - toSvgY(p.yHat))}
                fill="#C83226"
                fillOpacity="0.12"
                stroke="#C83226"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Analytical OLS Line (Subtle Ghost) */}
          <line
            x1={toSvgX(8)}
            y1={toSvgY(ols.slope * 8 + ols.intercept)}
            x2={toSvgX(44)}
            y2={toSvgY(ols.slope * 44 + ols.intercept)}
            stroke="#1848B8"
            strokeWidth="1"
            strokeDasharray="4,3"
            opacity="0.45"
          />

          {/* Active Model Line */}
          <line
            x1={toSvgX(8)}
            y1={toSvgY(slope * 8 + intercept)}
            x2={toSvgX(44)}
            y2={toSvgY(slope * 44 + intercept)}
            stroke="#1A1715"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {points.map((p) => (
            <circle
              key={p.id}
              cx={toSvgX(p.x)}
              cy={toSvgY(p.y)}
              r="4.5"
              fill="#FAF7F0"
              stroke="#1A1715"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 text-[9px] space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-[2px] bg-[#1A1715]" />
            <span>Active Model Line (ŷ = w·x + b)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-[1.5px] bg-[#C83226] border-b border-dashed border-[#C83226]" />
            <span className="text-[#C83226]">Residual e = y - ŷ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-[1px] bg-[#1848B8] opacity-50" />
            <span className="text-[#1848B8]">Analytical OLS Minimum</span>
          </div>
        </div>
      </div>

      {/* Real-time Math Counters & Slider Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Sliders */}
        <div className="space-y-2 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold">SLOPE WEIGHT (w):</span>
              <span className="font-mono font-bold text-[#1848B8]">{slope.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.5"
              step="0.05"
              value={slope}
              onChange={(e) => setSlope(parseFloat(e.target.value))}
              className="w-full accent-[#1848B8] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold">INTERCEPT BIAS (b):</span>
              <span className="font-mono font-bold text-[#1848B8]">{intercept.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="1"
              value={intercept}
              onChange={(e) => setIntercept(parseFloat(e.target.value))}
              className="w-full accent-[#1848B8] cursor-pointer"
            />
          </div>
        </div>

        {/* Live Calculation Plates */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">CURRENT LOSS (MSE):</span>
            <div className="font-mono text-base font-black text-[#C83226]">
              {stats.mse.toFixed(2)}
            </div>
            <span className="text-[9px] text-[#948B7D]">Mean Squared Error</span>
          </div>

          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">OPTIMAL OLS MSE:</span>
            <div className="font-mono text-base font-black text-[#33634B]">
              {ols.mse.toFixed(2)}
            </div>
            <span className="text-[9px] text-[#33634B] font-bold">w*={ols.slope}, b*={ols.intercept}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
