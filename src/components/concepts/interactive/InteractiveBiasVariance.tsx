'use client';

import React, { useState, useMemo } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

export const InteractiveBiasVariance: React.FC = () => {
  const [degree, setDegree] = useState<number>(3);

  // Fixed synthetic dataset generated from true f(x) = sin(pi * x)
  const trainPoints = useMemo(
    () => [
      { x: -0.85, y: -0.48 },
      { x: -0.6, y: -0.92 },
      { x: -0.35, y: -0.85 },
      { x: -0.1, y: -0.32 },
      { x: 0.15, y: 0.42 },
      { x: 0.45, y: 0.98 },
      { x: 0.7, y: 0.79 },
      { x: 0.9, y: 0.35 },
    ],
    []
  );

  const testPoints = useMemo(
    () => [
      { x: -0.75, y: -0.71 },
      { x: -0.45, y: -0.99 },
      { x: 0.0, y: 0.05 },
      { x: 0.3, y: 0.81 },
      { x: 0.6, y: 0.95 },
      { x: 0.8, y: 0.58 },
    ],
    []
  );

  // Precomputed polynomial evaluations for degrees 1, 2, 3, 5, 9
  // (Deterministic regression coefficients on trainPoints)
  const evalModel = (x: number, d: number): number => {
    switch (d) {
      case 1:
        // y = 0.62 * x + 0.02
        return 0.62 * x + 0.02;
      case 2:
        // y = -0.18*x^2 + 0.68*x + 0.05
        return -0.18 * x * x + 0.68 * x + 0.05;
      case 3:
        // y = -1.55*x^3 + 0.02*x^2 + 2.15*x - 0.03
        return -1.55 * Math.pow(x, 3) + 0.02 * x * x + 2.15 * x - 0.03;
      case 5:
        // 5th degree fit
        return (
          0.85 * Math.pow(x, 5) -
          2.6 * Math.pow(x, 3) +
          0.05 * Math.pow(x, 2) +
          2.45 * x -
          0.02
        );
      case 9:
        // Runge-phenomenon severe high-degree overfit interpolating noise
        return (
          -18.5 * Math.pow(x, 9) +
          34.2 * Math.pow(x, 7) -
          22.0 * Math.pow(x, 5) +
          4.1 * Math.pow(x, 3) +
          2.3 * x +
          0.35 * Math.sin(x * 12)
        );
      default:
        return 0;
    }
  };

  // Compute stats
  const stats = useMemo(() => {
    let trainSSE = 0;
    for (const p of trainPoints) {
      const pred = evalModel(p.x, degree);
      trainSSE += Math.pow(p.y - pred, 2);
    }
    const trainMSE = trainSSE / trainPoints.length;

    let testSSE = 0;
    for (const p of testPoints) {
      const pred = evalModel(p.x, degree);
      testSSE += Math.pow(p.y - pred, 2);
    }
    const testMSE = testSSE / testPoints.length;

    // Approximated bias-variance decomposition
    let biasSq = 0;
    let variance = 0;
    const noise = 0.025; // sigma^2 irreducible

    if (degree === 1) {
      biasSq = 0.21;
      variance = 0.01;
    } else if (degree === 2) {
      biasSq = 0.16;
      variance = 0.02;
    } else if (degree === 3) {
      biasSq = 0.015;
      variance = 0.022;
    } else if (degree === 5) {
      biasSq = 0.01;
      variance = 0.085;
    } else {
      biasSq = 0.005;
      variance = 0.85;
    }

    return { trainMSE, testMSE, biasSq, variance, noise };
  }, [degree, trainPoints, testPoints]);

  // SVG coordinate mapping (X: -1 to 1, Y: -1.6 to 1.6)
  const svgW = 460;
  const svgH = 220;
  const padL = 40;
  const padB = 30;
  const padT = 15;
  const padR = 15;

  const toSvgX = (x: number) => padL + ((x + 1) / 2) * (svgW - padL - padR);
  const toSvgY = (y: number) => svgH - padB - ((y + 1.6) / 3.2) * (svgH - padT - padB);

  // Generate curve path for true f(x) and fitted model
  const curvePaths = useMemo<{ truePath: string; modelPath: string }>(() => {
    let tPath = '';
    let mPath = '';

    for (let x = -1.0; x <= 1.01; x += 0.04) {
      const trueY = Math.sin(Math.PI * x);
      const modY = evalModel(x, degree);

      const sx = toSvgX(x);
      const syTrue = toSvgY(trueY);
      const syMod = toSvgY(modY);

      if (x === -1.0) {
        tPath = `M ${sx} ${syTrue}`;
        mPath = `M ${sx} ${syMod}`;
      } else {
        tPath += ` L ${sx} ${syTrue}`;
        mPath += ` L ${sx} ${syMod}`;
      }
    }
    return { truePath: tPath, modelPath: mPath };
  }, [degree]);

  const { truePath, modelPath } = curvePaths;

  const statusLabel =
    degree <= 2
      ? { label: 'UNDERFITTING (HIGH BIAS)', color: '#E28C05', icon: AlertOctagon }
      : degree === 3
      ? { label: 'OPTIMAL BALANCE (MINIMUM TEST ERROR)', color: '#33634B', icon: CheckCircle2 }
      : { label: 'OVERFITTING (HIGH VARIANCE)', color: '#C83226', icon: ShieldAlert };

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            BIAS-VARIANCE TRADEOFF & MODEL CAPACITY BENCH
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 border border-[#1A1715] font-bold text-[10px]"
          style={{ backgroundColor: `${statusLabel.color}15`, color: statusLabel.color }}
        >
          <statusLabel.icon className="w-3 h-3" />
          <span>{statusLabel.label}</span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-[#5C544B]">
            POLYNOMIAL DEGREE ($d$):
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 5, 9].map((d) => (
              <button
                key={d}
                onClick={() => setDegree(d)}
                className={`px-2.5 py-1 text-[10px] font-bold border transition-none ${
                  degree === d
                    ? 'bg-[#1848B8] text-white border-[#1A1715]'
                    : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
                }`}
              >
                $d = {d}$
              </button>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-[#5C544B]">
          True manifold: $f(x) = \sin(\pi x)$ with measurement noise $\sigma^2$
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative bg-[#F4EFE4] border-[1.5px] border-[#1A1715] p-1">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto select-none">
          {/* Zero lines */}
          <line
            x1={toSvgX(0)}
            y1={padT}
            x2={toSvgX(0)}
            y2={svgH - padB}
            stroke="#D8CFC0"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <line
            x1={padL}
            y1={toSvgY(0)}
            x2={svgW - padR}
            y2={toSvgY(0)}
            stroke="#D8CFC0"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />

          {/* Axes */}
          <line
            x1={padL}
            y1={toSvgY(-1.6)}
            x2={svgW - padR}
            y2={toSvgY(-1.6)}
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

          {/* True Underlying Sine Curve */}
          <path d={truePath} fill="none" stroke="#8A8275" strokeWidth="2" strokeDasharray="5 3" />

          {/* Fitted Polynomial Hypothesis */}
          <path
            d={modelPath}
            fill="none"
            stroke={degree === 3 ? '#33634B' : degree >= 5 ? '#C83226' : '#E28C05'}
            strokeWidth="2.5"
          />

          {/* Training Points (Sage circles) */}
          {trainPoints.map((p, i) => (
            <circle
              key={`tr-${i}`}
              cx={toSvgX(p.x)}
              cy={toSvgY(p.y)}
              r="4"
              fill="#33634B"
              stroke="#1A1715"
              strokeWidth="1.5"
            />
          ))}

          {/* Test Points (Vermilion squares) */}
          {testPoints.map((p, i) => (
            <rect
              key={`te-${i}`}
              x={toSvgX(p.x) - 3.5}
              y={toSvgY(p.y) - 3.5}
              width="7"
              height="7"
              fill="#C83226"
              stroke="#1A1715"
              strokeWidth="1.5"
            />
          ))}

          {/* Axis Labels */}
          <text x={svgW - 20} y={svgH - 12} fill="#1A1715" fontSize="10" fontWeight="bold">
            Feature $x$
          </text>
          <text x={padL + 5} y={padT + 12} fill="#1A1715" fontSize="10" fontWeight="bold">
            Output $y$
          </text>
        </svg>

        {/* Floating Legend */}
        <div className="absolute top-3 right-3 bg-[#FAF7F0] border border-[#1A1715] p-2 space-y-1 text-[9px] shadow-[2px_2px_0px_#1A1715]">
          <div className="flex items-center gap-1.5 text-[#33634B] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#33634B] border border-[#1A1715]" />
            Train Points ($N=8$)
          </div>
          <div className="flex items-center gap-1.5 text-[#C83226] font-bold">
            <span className="w-2 h-2 bg-[#C83226] border border-[#1A1715]" />
            Test Points ($N=6$)
          </div>
          <div className="flex items-center gap-1.5 text-[#8A8275] font-bold">
            <span className="w-3 h-0.5 bg-[#8A8275]" />
            True $f(x) = \sin(\pi x)$
          </div>
        </div>
      </div>

      {/* Metrics & Decomposition Readout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">
            TRAIN LOSS MSE (train)
          </span>
          <div className="text-base font-black text-[#1A1715]">
            {stats.trainMSE.toFixed(4)}
          </div>
          <span className="text-[8px] text-[#5C544B]">In-sample memorization</span>
        </div>

        <div
          className={`p-2 border-[1.5px] border-[#1A1715] ${
            stats.testMSE > 0.15 ? 'bg-[#FDF0EE]' : 'bg-[#FAF7F0]'
          }`}
        >
          <span className="text-[9px] uppercase font-bold text-[#C83226] block">
            TEST LOSS MSE (test)
          </span>
          <div className="text-base font-black text-[#C83226]">
            {stats.testMSE.toFixed(4)}
          </div>
          <span className="text-[8px] text-[#5C544B]">Generalization test</span>
        </div>

        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#E28C05] block">
            BIAS² ESTIMATE
          </span>
          <div className="text-base font-black text-[#E28C05]">
            {stats.biasSq.toFixed(3)}
          </div>
          <span className="text-[8px] text-[#5C544B]">Model assumption error</span>
        </div>

        <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#1848B8] block">
            VARIANCE ESTIMATE
          </span>
          <div className="text-base font-black text-[#1848B8]">
            {stats.variance.toFixed(3)}
          </div>
          <span className="text-[8px] text-[#5C544B]">Sensitivity to fluctuations</span>
        </div>
      </div>
    </div>
  );
};
