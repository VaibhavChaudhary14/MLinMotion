'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';

export const InteractiveGradientDescent: React.FC = () => {
  // Quadratic convex loss surface: J(theta) = 0.5 * (theta - 3.5)^2 + 1.0
  // Minimum is at theta* = 3.5 where J(3.5) = 1.0, grad = (theta - 3.5)
  const [theta, setTheta] = useState<number>(0.5);
  const [learningRate, setLearningRate] = useState<number>(0.2);
  const [history, setHistory] = useState<Array<{ theta: number; loss: number; step: number }>>([
    { theta: 0.5, loss: 0.5 * (0.5 - 3.5) ** 2 + 1.0, step: 0 },
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const computeLoss = (t: number) => 0.5 * (t - 3.5) ** 2 + 1.0;
  const computeGradient = (t: number) => t - 3.5;

  const currentLoss = computeLoss(theta);
  const currentGrad = computeGradient(theta);

  // Single step execution
  const takeStep = () => {
    const grad = computeGradient(theta);
    const newTheta = theta - learningRate * grad;
    // Cap to prevent canvas overflow
    const boundedTheta = Math.max(-1.5, Math.min(8.5, newTheta));
    const newLoss = computeLoss(boundedTheta);

    setTheta(boundedTheta);
    setHistory((prev) => [
      ...prev.slice(-15),
      { theta: boundedTheta, loss: newLoss, step: prev.length },
    ]);
  };

  const reset = () => {
    setIsRunning(false);
    setTheta(0.5);
    setHistory([{ theta: 0.5, loss: computeLoss(0.5), step: 0 }]);
  };

  // SVG coordinate transformation (theta: -1 to 8, loss: 0 to 12)
  const svgWidth = 460;
  const svgHeight = 240;
  const padLeft = 40;
  const padBottom = 30;
  const padTop = 15;
  const padRight = 15;

  const toSvgX = (t: number) => padLeft + ((t - (-0.5)) / (7.5 - (-0.5))) * (svgWidth - padLeft - padRight);
  const toSvgY = (l: number) => svgHeight - padBottom - ((l - 0.5) / (8.5 - 0.5)) * (svgHeight - padTop - padBottom);

  // Generate smooth parabolic curve points
  const curvePoints: string[] = [];
  for (let t = -0.5; t <= 7.5; t += 0.2) {
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
            className="px-2.5 py-1 bg-[#FAF7F0] text-[#1A1715] font-bold text-[10px] uppercase border-[1.5px] border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
          >
            <span>Step Iteration</span>
            <ArrowRight className="w-3 h-3 text-[#C83226]" />
          </button>
          <button
            onClick={reset}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
            title="Reset Parameters"
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

          {/* Target minimum indicator */}
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
            MINIMUM (θ* = 3.5)
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

        {/* Dynamic Status Callout */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 text-[9px] space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#C83226] rounded-full inline-block" />
            <span className="font-bold">Position: θ = {theta.toFixed(3)}</span>
          </div>
          <div className="text-[#5C544B]">
            Grad ∇J = {currentGrad.toFixed(3)} ({currentGrad > 0 ? 'Sloping Uphill' : 'Sloping Downhill'})
          </div>
          {learningRate >= 1.0 && (
            <div className="text-[#C83226] font-bold">
              ⚠ DIVERGENCE ZONE (α ≥ 1.0)
            </div>
          )}
        </div>
      </div>

      {/* Control Sliders & Metric Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-2 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold">LEARNING RATE STEP (α):</span>
              <span className={`font-mono font-bold ${learningRate >= 1.0 ? 'text-[#C83226]' : 'text-[#1848B8]'}`}>
                {learningRate.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.15"
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-[#1848B8] cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-[#948B7D]">
              <span>Cautious (0.05)</span>
              <span>Optimal (0.2-0.5)</span>
              <span className="text-[#C83226]">Unstable (&gt;1.0)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">CURRENT LOSS:</span>
            <div className="font-mono text-base font-black text-[#C83226]">
              {currentLoss.toFixed(3)}
            </div>
            <span className="text-[9px] text-[#948B7D]">Target: 1.000</span>
          </div>

          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] flex flex-col justify-between">
            <span className="text-[9px] uppercase font-bold text-[#5C544B]">STEP COUNT:</span>
            <div className="font-mono text-base font-black text-[#1A1715]">
              {history.length - 1}
            </div>
            <span className="text-[9px] text-[#33634B]">
              {Math.abs(currentGrad) < 0.05 ? 'Converged ✔' : 'Iterating...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
