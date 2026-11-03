'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

interface Sample {
  id: string;
  z: number; // logit score
  trueLabel: 0 | 1;
}

export const InteractiveLogisticRegression: React.FC = () => {
  // 12 synthetic medical biopsy test samples
  const samples: Sample[] = [
    { id: 's1', z: -3.5, trueLabel: 0 },
    { id: 's2', z: -2.8, trueLabel: 0 },
    { id: 's3', z: -2.0, trueLabel: 0 },
    { id: 's4', z: -1.2, trueLabel: 0 },
    { id: 's5', z: -0.8, trueLabel: 0 },
    { id: 's6', z: -0.3, trueLabel: 1 }, // Borderline false negative if threshold high
    { id: 's7', z: 0.2, trueLabel: 0 },  // Borderline false positive if threshold low
    { id: 's8', z: 0.7, trueLabel: 1 },
    { id: 's9', z: 1.4, trueLabel: 1 },
    { id: 's10', z: 2.1, trueLabel: 1 },
    { id: 's11', z: 2.9, trueLabel: 1 },
    { id: 's12', z: 3.8, trueLabel: 1 },
  ];

  const [threshold, setThreshold] = useState<number>(0.5);

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // Compute confusion matrix & metrics
  const evaluation = useMemo(() => {
    let tp = 0;
    let fp = 0;
    let tn = 0;
    let fn = 0;

    samples.forEach((s) => {
      const prob = sigmoid(s.z);
      const predicted = prob >= threshold ? 1 : 0;
      if (s.trueLabel === 1 && predicted === 1) tp++;
      else if (s.trueLabel === 0 && predicted === 1) fp++;
      else if (s.trueLabel === 0 && predicted === 0) tn++;
      else if (s.trueLabel === 1 && predicted === 0) fn++;
    });

    const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
    const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
    const accuracy = ((tp + tn) / samples.length) * 100;

    return { tp, fp, tn, fn, precision, recall, accuracy };
  }, [samples, threshold]);

  // Invert sigmoid to find z coordinate of threshold: z = ln(tau / (1 - tau))
  const thresholdZ = Math.log(threshold / (1 - threshold));

  // SVG coordinate transformation (z: -4.5 to 4.5, prob: 0 to 1)
  const svgWidth = 460;
  const svgHeight = 220;
  const padLeft = 40;
  const padBottom = 25;
  const padTop = 15;
  const padRight = 15;

  const toSvgX = (z: number) => padLeft + ((z - (-4.5)) / (4.5 - (-4.5))) * (svgWidth - padLeft - padRight);
  const toSvgY = (p: number) => svgHeight - padBottom - p * (svgHeight - padTop - padBottom);

  // Generate smooth sigmoid S-curve
  const curvePoints: string[] = [];
  for (let z = -4.5; z <= 4.5; z += 0.2) {
    curvePoints.push(`${toSvgX(z)},${toSvgY(sigmoid(z))}`);
  }
  const curvePath = `M ${curvePoints.join(' L ')}`;

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#6E3867] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            SIGMOID THRESHOLD & CONFUSION WORKBENCH
          </span>
        </div>
        <button
          onClick={() => setThreshold(0.5)}
          className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
          title="Reset Threshold"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Main Sigmoid Canvas */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Grid lines at probability 0.5 and 1.0 */}
          <line x1={padLeft} y1={toSvgY(0.5)} x2={svgWidth - padRight} y2={toSvgY(0.5)} stroke="#D8CFC0" strokeDasharray="3,3" strokeWidth="1" />
          <line x1={padLeft} y1={toSvgY(1.0)} x2={svgWidth - padRight} y2={toSvgY(1.0)} stroke="#D8CFC0" strokeDasharray="3,3" strokeWidth="1" />

          {/* Coordinate axes */}
          <line x1={padLeft} y1={svgHeight - padBottom} x2={svgWidth - padRight} y2={svgHeight - padBottom} stroke="#1A1715" strokeWidth="1.5" />
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={svgHeight - padBottom} stroke="#1A1715" strokeWidth="1.5" />

          {/* Decision Threshold Vertical Divider Line */}
          <line
            x1={toSvgX(thresholdZ)}
            y1={padTop}
            x2={toSvgX(thresholdZ)}
            y2={svgHeight - padBottom}
            stroke="#C83226"
            strokeWidth="2"
            strokeDasharray="4,2"
          />
          {/* Horizontal threshold line */}
          <line
            x1={padLeft}
            y1={toSvgY(threshold)}
            x2={toSvgX(thresholdZ)}
            y2={toSvgY(threshold)}
            stroke="#C83226"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Smooth Sigmoid S-Curve */}
          <path d={curvePath} fill="none" stroke="#1A1715" strokeWidth="2.5" />

          {/* Sample observations */}
          {samples.map((s) => {
            const prob = sigmoid(s.z);
            const isPredictedPositive = prob >= threshold;
            const isCorrect = (s.trueLabel === 1 && isPredictedPositive) || (s.trueLabel === 0 && !isPredictedPositive);
            return (
              <g key={s.id}>
                {/* Vertical drop line to curve */}
                <line
                  x1={toSvgX(s.z)}
                  y1={toSvgY(s.trueLabel)}
                  x2={toSvgX(s.z)}
                  y2={toSvgY(prob)}
                  stroke={isCorrect ? '#33634B' : '#C83226'}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.6"
                />
                {/* Data point on ground-truth baseline */}
                <circle
                  cx={toSvgX(s.z)}
                  cy={toSvgY(prob)}
                  r="4"
                  fill={s.trueLabel === 1 ? '#6E3867' : '#FAF7F0'}
                  stroke={isCorrect ? '#1A1715' : '#C83226'}
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          <text x={svgWidth - padRight} y={svgHeight - 8} textAnchor="end" fill="#5C544B" fontSize="9" fontFamily="monospace">
            LOGIT SCORE z = w·x + b →
          </text>
          <text x={padLeft + 4} y={padTop + 8} fill="#5C544B" fontSize="9" fontFamily="monospace">
            P(Y=1|x) ↑
          </text>
        </svg>

        {/* Legend Overlay */}
        <div className="absolute top-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-1 text-[9px] space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-[2px] bg-[#C83226]" />
            <span>Threshold τ = {threshold.toFixed(2)} (z = {thresholdZ.toFixed(2)})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5C544B]">
            <span className="w-2 h-2 rounded-full bg-[#6E3867]" />
            <span>Filled: Malignant (1) | Hollow: Benign (0)</span>
          </div>
        </div>
      </div>

      {/* Threshold Slider & Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Slider */}
        <div className="space-y-1 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="flex justify-between text-[10px]">
            <span className="font-bold">DECISION THRESHOLD (τ):</span>
            <span className="font-mono font-bold text-[#C83226]">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-[#C83226] cursor-pointer"
          />
          <div className="flex justify-between text-[8px] text-[#948B7D]">
            <span>Low (Prioritize Recall)</span>
            <span>Balanced (0.50)</span>
            <span>High (Prioritize Precision)</span>
          </div>
        </div>

        {/* Live Evaluation Matrix */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">PRECISION</span>
            <span className="font-mono text-xs font-black text-[#1848B8]">
              {evaluation.precision.toFixed(0)}%
            </span>
          </div>
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">RECALL</span>
            <span className="font-mono text-xs font-black text-[#E28C05]">
              {evaluation.recall.toFixed(0)}%
            </span>
          </div>
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">ACCURACY</span>
            <span className="font-mono text-xs font-black text-[#33634B]">
              {evaluation.accuracy.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
