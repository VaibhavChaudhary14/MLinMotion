'use client';

import React, { useState, useMemo } from 'react';
import { Target, Zap, AlertTriangle, HelpCircle } from 'lucide-react';

export const InteractiveLossFunctions: React.FC = () => {
  const [domain, setDomain] = useState<'regression' | 'classification'>('regression');

  // Regression states
  const [residual, setResidual] = useState<number>(1.5); // e = y - y_hat
  const [huberDelta, setHuberDelta] = useState<number>(1.0);

  // Classification states
  const [trueLabel, setTrueLabel] = useState<1 | 0>(1);
  const [predictedProb, setPredictedProb] = useState<number>(0.75);

  // Computed Regression Losses
  const regMetrics = useMemo(() => {
    const e = residual;
    const absE = Math.abs(e);

    // 1. Squared Error (L2)
    const mse = e * e;
    const mseGrad = 2 * e;

    // 2. Absolute Error (L1)
    const mae = absE;
    const maeGrad = e === 0 ? 0 : e > 0 ? 1 : -1;

    // 3. Huber Loss
    let huber = 0;
    let huberGrad = 0;
    if (absE <= huberDelta) {
      huber = 0.5 * e * e;
      huberGrad = e;
    } else {
      huber = huberDelta * (absE - 0.5 * huberDelta);
      huberGrad = huberDelta * (e > 0 ? 1 : -1);
    }

    return { mse, mseGrad, mae, maeGrad, huber, huberGrad };
  }, [residual, huberDelta]);

  // Computed Classification Losses
  const clsMetrics = useMemo(() => {
    const p = Math.max(0.001, Math.min(0.999, predictedProb));
    const y = trueLabel;

    // Binary Cross-Entropy
    const bce = -(y * Math.log(p) + (1 - y) * Math.log(1 - p));

    // Brier Score (Squared error on probabilities)
    const brier = Math.pow(p - y, 2);

    // 0-1 Classification Loss (threshold 0.5)
    const yPred = p >= 0.5 ? 1 : 0;
    const zeroOne = yPred === y ? 0 : 1;

    return { bce, brier, zeroOne };
  }, [predictedProb, trueLabel]);

  // SVG coordinate mapper for regression curves (X: -4 to +4, Y: 0 to 16)
  const svgW = 460;
  const svgH = 220;
  const padL = 40;
  const padB = 30;
  const padT = 15;
  const padR = 15;

  const toRegX = (e: number) => padL + ((e + 4) / 8) * (svgW - padL - padR);
  const toRegY = (loss: number) => svgH - padB - (Math.min(loss, 16) / 16) * (svgH - padT - padB);

  // Generate curve path strings for regression
  const regPaths = useMemo<{
    msePath: string;
    maePath: string;
    huberPath: string;
  }>(() => {
    let mPath = '';
    let aPath = '';
    let hPath = '';

    for (let e = -4.0; e <= 4.05; e += 0.2) {
      const absE = Math.abs(e);
      const mVal = e * e;
      const aVal = absE;
      const hVal = absE <= huberDelta ? 0.5 * e * e : huberDelta * (absE - 0.5 * huberDelta);

      const xCoord = toRegX(e);
      const mY = toRegY(mVal);
      const aY = toRegY(aVal);
      const hY = toRegY(hVal);

      if (e === -4.0) {
        mPath = `M ${xCoord} ${mY}`;
        aPath = `M ${xCoord} ${aY}`;
        hPath = `M ${xCoord} ${hY}`;
      } else {
        mPath += ` L ${xCoord} ${mY}`;
        aPath += ` L ${xCoord} ${aY}`;
        hPath += ` L ${xCoord} ${hY}`;
      }
    }

    return { msePath: mPath, maePath: aPath, huberPath: hPath };
  }, [huberDelta]);

  const { msePath, maePath, huberPath } = regPaths;

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            OBJECTIVE SURFACE: MATHEMATICAL LOSS BENCH
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#F4EFE4] border border-[#1A1715] p-0.5">
          <button
            onClick={() => setDomain('regression')}
            className={`px-2 py-0.5 text-[10px] font-bold ${
              domain === 'regression' ? 'bg-[#1848B8] text-white' : 'text-[#1A1715]'
            }`}
          >
            REGRESSION (L2 vs L1 vs HUBER)
          </button>
          <button
            onClick={() => setDomain('classification')}
            className={`px-2 py-0.5 text-[10px] font-bold ${
              domain === 'classification' ? 'bg-[#1848B8] text-white' : 'text-[#1A1715]'
            }`}
          >
            CLASSIFICATION (LOG LOSS)
          </button>
        </div>
      </div>

      {domain === 'regression' ? (
        <>
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#5C544B] uppercase">RESIDUAL ERROR e = y - ŷ:</span>
                <span className="text-[#C83226] text-xs font-black">
                  {residual > 0 ? `+${residual.toFixed(2)}` : residual.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-3.8"
                max="3.8"
                step="0.1"
                value={residual}
                onChange={(e) => setResidual(parseFloat(e.target.value))}
                className="w-full accent-[#C83226] cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResidual(3.5)}
                className="w-full py-1.5 px-2 bg-[#FAF7F0] border border-[#1A1715] text-[10px] font-bold text-[#C83226] hover:bg-[#E8E1D3] flex items-center justify-center gap-1"
              >
                <Zap className="w-3 h-3" />
                SIMULATE OUTLIER ($e=3.5$)
              </button>
            </div>
          </div>

          {/* SVG Curves Comparison */}
          <div className="relative bg-[#F4EFE4] border-[1.5px] border-[#1A1715] p-1">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none">
              {/* Axes & Zero Gridlines */}
              <line
                x1={toRegX(0)}
                y1={padT}
                x2={toRegX(0)}
                y2={svgH - padB}
                stroke="#D8CFC0"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line
                x1={padL}
                y1={toRegY(0)}
                x2={svgW - padR}
                y2={toRegY(0)}
                stroke="#1A1715"
                strokeWidth="1.5"
              />
              <line
                x1={padL}
                y1={padT}
                x2={padL}
                y2={svgH - padB}
                stroke="#1A1715"
                strokeWidth="1.5"
              />

              {/* Loss Paths */}
              <path d={msePath} fill="none" stroke="#C83226" strokeWidth="2.5" />
              <path d={maePath} fill="none" stroke="#1848B8" strokeWidth="2" strokeDasharray="4 2" />
              <path d={huberPath} fill="none" stroke="#33634B" strokeWidth="2" />

              {/* Current residual vertical marker */}
              <line
                x1={toRegX(residual)}
                y1={padT}
                x2={toRegX(residual)}
                y2={svgH - padB}
                stroke="#1A1715"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Indicator dots */}
              <circle
                cx={toRegX(residual)}
                cy={toRegY(regMetrics.mse)}
                r="4.5"
                fill="#C83226"
                stroke="#1A1715"
                strokeWidth="1.5"
              />
              <circle
                cx={toRegX(residual)}
                cy={toRegY(regMetrics.mae)}
                r="4"
                fill="#1848B8"
                stroke="#1A1715"
                strokeWidth="1.5"
              />
              <circle
                cx={toRegX(residual)}
                cy={toRegY(regMetrics.huber)}
                r="4"
                fill="#33634B"
                stroke="#1A1715"
                strokeWidth="1.5"
              />

              {/* Axis labels */}
              <text x={svgW - 20} y={svgH - 12} fill="#1A1715" fontSize="10" fontWeight="bold">
                Residual $e$
              </text>
              <text x={padL + 5} y={padT + 12} fill="#1A1715" fontSize="10" fontWeight="bold">
                Loss $L(e)$
              </text>
            </svg>

            {/* Floating Legend */}
            <div className="absolute top-3 right-3 bg-[#FAF7F0] border border-[#1A1715] p-2 space-y-1 text-[9px] shadow-[2px_2px_0px_#1A1715]">
              <div className="flex items-center gap-1.5 text-[#C83226] font-bold">
                <span className="w-2.5 h-0.5 bg-[#C83226]" /> MSE ($e^2$): {regMetrics.mse.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 text-[#33634B] font-bold">
                <span className="w-2.5 h-0.5 bg-[#33634B]" /> Huber: {regMetrics.huber.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 text-[#1848B8] font-bold">
                <span className="w-2.5 h-0.5 bg-[#1848B8]" /> MAE ($|e|$): {regMetrics.mae.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Mathematical Derivative Readout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
              <span className="text-[9px] uppercase font-bold text-[#C83226] block">
                MSE GRADIENT ∂L/∂e = 2e
              </span>
              <div className="text-sm font-black text-[#1A1715]">
                {regMetrics.mseGrad > 0 ? `+${regMetrics.mseGrad.toFixed(2)}` : regMetrics.mseGrad.toFixed(2)}
              </div>
              <span className="text-[8px] text-[#5C544B]">Grows linearly with error magnitude. Outliers pull the line violently.</span>
            </div>
            <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
              <span className="text-[9px] uppercase font-bold text-[#33634B] block">
                HUBER GRADIENT (CLIP $\le \delta$)
              </span>
              <div className="text-sm font-black text-[#1A1715]">
                {regMetrics.huberGrad > 0 ? `+${regMetrics.huberGrad.toFixed(2)}` : regMetrics.huberGrad.toFixed(2)}
              </div>
              <span className="text-[8px] text-[#5C544B]">Bounded by $\pm\delta$. Quadratic near 0, robust linear for large errors.</span>
            </div>
            <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
              <span className="text-[9px] uppercase font-bold text-[#1848B8] block">
                MAE GRADIENT sign(e)
              </span>
              <div className="text-sm font-black text-[#1A1715]">
                {regMetrics.maeGrad > 0 ? `+${regMetrics.maeGrad.toFixed(1)}` : regMetrics.maeGrad.toFixed(1)}
              </div>
              <span className="text-[8px] text-[#5C544B]">Constant $\pm 1$. Discontinuous at $e=0$, requires subgradient descent.</span>
            </div>
          </div>
        </>
      ) : (
        /* Classification View */
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F4EFE4] p-2.5 border border-[#1A1715]">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
                TRUE BINARY LABEL y ∈ [0, 1]:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrueLabel(1)}
                  className={`flex-1 py-1 text-[10px] font-bold border ${
                    trueLabel === 1
                      ? 'bg-[#33634B] text-white border-[#1A1715]'
                      : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715]'
                  }`}
                >
                  $y = 1$ (POSITIVE)
                </button>
                <button
                  onClick={() => setTrueLabel(0)}
                  className={`flex-1 py-1 text-[10px] font-bold border ${
                    trueLabel === 0
                      ? 'bg-[#C83226] text-white border-[#1A1715]'
                      : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715]'
                  }`}
                >
                  $y = 0$ (NEGATIVE)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#5C544B] uppercase">MODEL PREDICTED PROBABILITY p̂:</span>
                <span className="text-[#1848B8] text-xs font-black">
                  {(predictedProb * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={predictedProb}
                onChange={(e) => setPredictedProb(parseFloat(e.target.value))}
                className="w-full accent-[#1848B8] cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#C83226] block">
                BINARY CROSS-ENTROPY (LOG LOSS)
              </span>
              <div className="text-xl font-black text-[#1A1715]">
                {clsMetrics.bce.toFixed(3)}
              </div>
              <span className="text-[9px] text-[#5C544B] block leading-tight">
                Formula: -[y·ln(p̂) + (1-y)·ln(1-p̂)]. Explodes toward ∞ when confident and wrong.
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#1848B8] block">
                BRIER SCORE (p̂ - y)²
              </span>
              <div className="text-xl font-black text-[#1A1715]">
                {clsMetrics.brier.toFixed(3)}
              </div>
              <span className="text-[9px] text-[#5C544B] block leading-tight">
                Mean squared error on probabilities. Heavily penalizes miscalibrated probabilities.
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#33634B] block">
                0-1 CLASSIFICATION ERROR
              </span>
              <div className="text-xl font-black text-[#1A1715]">
                {clsMetrics.zeroOne}
              </div>
              <span className="text-[9px] text-[#5C544B] block leading-tight">
                Non-differentiable step loss. Gradient is zero everywhere; cannot be optimized via gradient descent.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
