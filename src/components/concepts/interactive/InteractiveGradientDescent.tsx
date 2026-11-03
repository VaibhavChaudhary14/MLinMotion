'use client';

import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Zap } from 'lucide-react';

export const InteractiveGradientDescent: React.FC = () => {
  // Quadratic convex loss surface: J(theta) = 0.5 * (theta - 3.5)^2 + 1.0
  // Minimum is at theta* = 3.5 where J(3.5) = 1.0, grad = (theta - 3.5)
  // Mathematical contraction factor: (theta_{t+1} - 3.5) = (1 - alpha) * (theta_t - 3.5)
  const [theta, setTheta] = useState<number>(0.5);
  const [learningRate, setLearningRate] = useState<number>(0.3);
  const [history, setHistory] = useState<Array<{ theta: number; loss: number; step: number }>>([
    { theta: 0.5, loss: 0.5 * (0.5 - 3.5) ** 2 + 1.0, step: 0 },
  ]);

  const computeLoss = (t: number) => 0.5 * (t - 3.5) ** 2 + 1.0;
  const computeGradient = (t: number) => t - 3.5;

  const currentLoss = computeLoss(theta);
  const currentGrad = computeGradient(theta);

  // Contraction multiplier: (1 - alpha)
  const contractionFactor = 1 - learningRate;

  // Single step execution
  const takeStep = () => {
    const grad = computeGradient(theta);
    const newTheta = theta - learningRate * grad;
    // Bounded for SVG drawing, but allows showing divergence up to bounds
    const boundedTheta = Math.max(-2.5, Math.min(9.5, newTheta));
    const newLoss = computeLoss(boundedTheta);

    setTheta(boundedTheta);
    setHistory((prev) => [
      ...prev.slice(-20),
      { theta: boundedTheta, loss: newLoss, step: prev.length },
    ]);
  };

  const resetTo = (startTheta: number, lr?: number) => {
    const targetLr = lr !== undefined ? lr : learningRate;
    setTheta(startTheta);
    if (lr !== undefined) setLearningRate(lr);
    setHistory([{ theta: startTheta, loss: computeLoss(startTheta), step: 0 }]);
  };

  // Determine active convergence regime
  const getRegime = () => {
    if (learningRate < 0.98) {
      return {
        label: 'MONOTONIC DESCENT (0 < α < 1)',
        desc: 'Contraction 0 < (1 - α) < 1: Smooth geometric approach without overshooting.',
        color: '#1848B8',
        tag: 'monotonic',
      };
    }
    if (Math.abs(learningRate - 1.0) <= 0.03) {
      return {
        label: 'EXACT 1-STEP CONVERGENCE (α = 1.0)',
        desc: 'Contraction (1 - α) = 0: Hits the global minimum θ* = 3.5 in exactly 1 update step!',
        color: '#33634B',
        tag: 'exact',
      };
    }
    if (learningRate < 1.98) {
      return {
        label: 'DAMPED OSCILLATION (1 < α < 2)',
        desc: 'Contraction -1 < (1 - α) < 0: Alternates sides across the valley, but decays to 0.',
        color: '#E28C05',
        tag: 'damped',
      };
    }
    if (Math.abs(learningRate - 2.0) <= 0.03) {
      return {
        label: 'PERPETUAL OSCILLATION (α = 2.0)',
        desc: 'Contraction (1 - α) = -1: Bounces indefinitely between opposite walls without decaying.',
        color: '#C83226',
        tag: 'perpetual',
      };
    }
    return {
      label: 'EXPLOSIVE DIVERGENCE (α > 2.0)',
      desc: 'Contraction |1 - α| > 1: Step magnitudes expand geometrically, escaping to infinity.',
      color: '#C83226',
      tag: 'divergent',
    };
  };

  const regime = getRegime();

  // SVG coordinate transformation (theta: -2 to 9, loss: 0.5 to 14)
  const svgWidth = 460;
  const svgHeight = 240;
  const padLeft = 35;
  const padBottom = 30;
  const padTop = 15;
  const padRight = 15;

  const toSvgX = (t: number) => padLeft + ((t - (-1.5)) / (8.5 - (-1.5))) * (svgWidth - padLeft - padRight);
  const toSvgY = (l: number) => svgHeight - padBottom - ((l - 0.5) / (12.0 - 0.5)) * (svgHeight - padTop - padBottom);

  // Generate smooth parabolic curve points
  const curvePoints: string[] = [];
  for (let t = -1.5; t <= 8.5; t += 0.2) {
    curvePoints.push(`${toSvgX(t)},${toSvgY(computeLoss(t))}`);
  }
  const curvePath = `M ${curvePoints.join(' L ')}`;

  // Tangent line at current theta
  const tangentX1 = theta - 1.2;
  const tangentY1 = currentLoss - 1.2 * currentGrad;
  const tangentX2 = theta + 1.2;
  const tangentY2 = currentLoss + 1.2 * currentGrad;

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            GRADIENT VECTOR STEPPING ENGINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={takeStep}
            className="px-2.5 py-1 bg-[#1A1715] text-[#FAF7F0] font-bold text-[10px] uppercase border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#C83226] hover:bg-[#332e2a] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
          >
            <span>Step Iteration</span>
            <ArrowRight className="w-3 h-3 text-[#E28C05]" />
          </button>
          <button
            onClick={() => resetTo(0.5)}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
            title="Reset Position"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Coordinate Loss Bowl Canvas */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Coordinate axes */}
          <line x1={padLeft} y1={svgHeight - padBottom} x2={svgWidth - padRight} y2={svgHeight - padBottom} stroke="#1A1715" strokeWidth="1.5" />
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={svgHeight - padBottom} stroke="#1A1715" strokeWidth="1.5" />

          {/* Target minimum vertical reference */}
          <line
            x1={toSvgX(3.5)}
            y1={padTop}
            x2={toSvgX(3.5)}
            y2={svgHeight - padBottom}
            stroke="#33634B"
            strokeDasharray="2,2"
            strokeWidth="1"
          />
          <text x={toSvgX(3.5) + 3} y={padTop + 10} fill="#33634B" fontSize="8" fontFamily="monospace" fontWeight="bold">
            OPTIMUM (θ* = 3.5)
          </text>

          {/* Smooth Loss Parabola J(θ) */}
          <path d={curvePath} fill="none" stroke="#1A1715" strokeWidth="2.5" />

          {/* Historical Descent Trajectory Steps */}
          {history.length > 1 && (
            <polyline
              points={history.map((h) => `${toSvgX(h.theta)},${toSvgY(h.loss)}`).join(' ')}
              fill="none"
              stroke="#C83226"
              strokeWidth="1.5"
              strokeDasharray="3,2"
            />
          )}

          {/* Tangent Slope Line */}
          <line
            x1={toSvgX(tangentX1)}
            y1={toSvgY(tangentY1)}
            x2={toSvgX(tangentX2)}
            y2={toSvgY(tangentY2)}
            stroke="#E28C05"
            strokeWidth="2"
          />

          {/* Trajectory dots */}
          {history.map((h, idx) => (
            <circle
              key={idx}
              cx={toSvgX(h.theta)}
              cy={toSvgY(h.loss)}
              r={idx === history.length - 1 ? 5.5 : 2.5}
              fill={idx === history.length - 1 ? '#C83226' : '#FAF7F0'}
              stroke="#1A1715"
              strokeWidth="1.5"
            />
          ))}

          {/* Axis Labels */}
          <text x={svgWidth - padRight} y={svgHeight - 10} textAnchor="end" fill="#5C544B" fontSize="9" fontFamily="monospace">
            PARAMETER (θ) →
          </text>
          <text x={padLeft + 5} y={padTop + 10} textAnchor="start" fill="#5C544B" fontSize="9" fontFamily="monospace">
            LOSS J(θ) ↑
          </text>
        </svg>

        {/* Dynamic Status Callout Plate */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/95 border border-[#1A1715] px-2.5 py-1.5 text-[9px] space-y-1 max-w-[210px] shadow-[1px_1px_0px_#1A1715]">
          <div className="flex items-center gap-1.5 font-bold" style={{ color: regime.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: regime.color }} />
            <span>{regime.label}</span>
          </div>
          <div className="text-[#5C544B] leading-tight text-[8px]">
            {regime.desc}
          </div>
          <div className="border-t border-[#D8CFC0] pt-1 text-[#1A1715] flex justify-between">
            <span>Pos: θ = {theta.toFixed(3)}</span>
            <span>∇J = {currentGrad.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Preset Regimes Quick Bench Buttons */}
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase font-bold text-[#5C544B] block">
          MATHEMATICAL REGIME PRESETS (TRY EACH):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            onClick={() => resetTo(0.5, 0.3)}
            className={`p-1.5 border text-[10px] font-mono font-bold text-left transition-all ${
              learningRate === 0.3
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            <span>① Monotonic (α=0.3)</span>
          </button>
          <button
            onClick={() => resetTo(0.5, 1.0)}
            className={`p-1.5 border text-[10px] font-mono font-bold text-left transition-all ${
              learningRate === 1.0
                ? 'bg-[#33634B] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            <span>② 1-Step Optimum (α=1.0)</span>
          </button>
          <button
            onClick={() => resetTo(0.5, 1.5)}
            className={`p-1.5 border text-[10px] font-mono font-bold text-left transition-all ${
              learningRate === 1.5
                ? 'bg-[#E28C05] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            <span>③ Damped Osc. (α=1.5)</span>
          </button>
          <button
            onClick={() => resetTo(0.5, 2.1)}
            className={`p-1.5 border text-[10px] font-mono font-bold text-left transition-all ${
              learningRate === 2.1
                ? 'bg-[#C83226] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#F4EFE4] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            <span>④ Divergence (α=2.1)</span>
          </button>
        </div>
      </div>

      {/* Control Sliders & Metric Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-2 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold">LEARNING RATE STEP (α):</span>
              <span className="font-mono font-bold" style={{ color: regime.color }}>
                {learningRate.toFixed(2)} | (1 - α) = {contractionFactor.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.25"
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-[#1848B8] cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-[#5C544B]">
              <span>0 &lt; α &lt; 1 (Descent)</span>
              <span className="text-[#33634B] font-bold">α = 1 (Optimum)</span>
              <span>1 &lt; α &lt; 2 (Oscillates)</span>
              <span className="text-[#C83226] font-bold">α &gt; 2 (Diverges)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">CURRENT LOSS:</span>
            <div className="font-mono text-base font-black text-[#C83226]">
              {currentLoss.toFixed(3)}
            </div>
            <span className="text-[9px] text-[#948B7D]">Target Minimum: 1.000</span>
          </div>

          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">STEP COUNT:</span>
            <div className="font-mono text-base font-black text-[#1A1715]">
              {history.length - 1}
            </div>
            <span className="text-[9px] text-[#33634B]">
              {Math.abs(currentGrad) < 0.02 ? 'Converged at θ=3.5 ✔' : 'Iterating...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
