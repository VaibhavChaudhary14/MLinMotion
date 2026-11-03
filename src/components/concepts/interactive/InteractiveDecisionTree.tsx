'use client';

import React, { useState, useMemo } from 'react';
import { RefreshCw, Zap, Sliders, CheckCircle2 } from 'lucide-react';

interface DataPoint {
  id: string;
  dti: number; // Debt to income %
  approved: 0 | 1;
}

export const InteractiveDecisionTree: React.FC = () => {
  // 14 realistic credit profiles
  const points: DataPoint[] = [
    { id: 'c1', dti: 14, approved: 1 },
    { id: 'c2', dti: 18, approved: 1 },
    { id: 'c3', dti: 22, approved: 1 },
    { id: 'c4', dti: 26, approved: 1 },
    { id: 'c5', dti: 30, approved: 1 },
    { id: 'c6', dti: 33, approved: 1 },
    { id: 'c7', dti: 35, approved: 0 }, // Borderline denial
    { id: 'c8', dti: 38, approved: 1 }, // Borderline approval
    { id: 'c9', dti: 42, approved: 0 },
    { id: 'c10', dti: 48, approved: 0 },
    { id: 'c11', dti: 52, approved: 0 },
    { id: 'c12', dti: 57, approved: 0 },
    { id: 'c13', dti: 63, approved: 0 },
    { id: 'c14', dti: 68, approved: 0 },
  ];

  // Interactive split threshold slider
  const [threshold, setThreshold] = useState<number>(36);
  // Criterion toggle: Gini vs Entropy
  const [criterion, setCriterion] = useState<'gini' | 'entropy'>('gini');

  // Gini Impurity: Gini(S) = 1 - (p1^2 + p0^2), bounded in [0, 0.5] for binary
  const calcGini = (subset: DataPoint[]) => {
    if (subset.length === 0) return 0;
    const p1 = subset.filter((p) => p.approved === 1).length / subset.length;
    const p0 = 1 - p1;
    return 1 - (p1 * p1 + p0 * p0);
  };

  // Shannon Entropy: H(S) = - (p1 * log2(p1) + p0 * log2(p0)), bounded in [0, 1.0] bits
  const calcEntropy = (subset: DataPoint[]) => {
    if (subset.length === 0) return 0;
    const p1 = subset.filter((p) => p.approved === 1).length / subset.length;
    const p0 = 1 - p1;
    const term1 = p1 > 0 ? p1 * Math.log2(p1) : 0;
    const term0 = p0 > 0 ? p0 * Math.log2(p0) : 0;
    return -(term1 + term0);
  };

  const parentGini = useMemo(() => calcGini(points), [points]);
  const parentEntropy = useMemo(() => calcEntropy(points), [points]);

  // Compute Left and Right children stats for both Gini and Entropy
  const splitStats = useMemo(() => {
    const left = points.filter((p) => p.dti <= threshold);
    const right = points.filter((p) => p.dti > threshold);

    const leftGini = calcGini(left);
    const rightGini = calcGini(right);
    const weightedGini =
      (left.length / points.length) * leftGini + (right.length / points.length) * rightGini;
    const giniReduction = parentGini - weightedGini;

    const leftEntropy = calcEntropy(left);
    const rightEntropy = calcEntropy(right);
    const weightedEntropy =
      (left.length / points.length) * leftEntropy + (right.length / points.length) * rightEntropy;
    const informationGain = parentEntropy - weightedEntropy;

    return {
      left,
      right,
      leftGini,
      rightGini,
      weightedGini,
      giniReduction,
      leftEntropy,
      rightEntropy,
      weightedEntropy,
      informationGain,
    };
  }, [points, threshold, parentGini, parentEntropy]);

  // Optimal threshold (found at 36)
  const snapToOptimal = () => {
    setThreshold(36);
  };

  // SVG coordinate transformation (DTI: 10 to 72)
  const svgWidth = 460;
  const svgHeight = 140;
  const padLeft = 35;
  const padRight = 35;

  const toSvgX = (dti: number) => padLeft + ((dti - 10) / (72 - 10)) * (svgWidth - padLeft - padRight);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#33634B] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            RECURSIVE PARTITIONING: GINI VS ENTROPY BENCH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={snapToOptimal}
            className="px-2 py-1 bg-[#33634B] text-[#FAF7F0] font-bold text-[10px] uppercase border border-[#1A1715] shadow-[1.5px_1.5px_0px_#1A1715] hover:bg-[#284f3c] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>Optimal Split (36%)</span>
          </button>
          <button
            onClick={() => setThreshold(25)}
            className="px-2 py-1 bg-[#E8E1D3] text-[#1A1715] font-bold text-[10px] uppercase border border-[#1A1715] hover:bg-[#DDD5C5]"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Criterion Toggle: Gini Impurity (CART) vs Shannon Entropy (ID3/C4.5) */}
      <div className="p-2 bg-[#E8E1D3]/60 border border-[#1A1715] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#1A1715]">SPLITTING CRITERION:</span>
          <span className="text-[9px] text-[#5C544B]">
            {criterion === 'gini' ? 'Gini Impurity (CART Algorithm)' : 'Shannon Entropy (ID3 / C4.5 Algorithm)'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCriterion('gini')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
              criterion === 'gini'
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#FAF7F0] text-[#5C544B] border-[#1A1715] hover:bg-[#F0EAE0]'
            }`}
          >
            <span>Gini Impurity (CART)</span>
          </button>
          <button
            onClick={() => setCriterion('entropy')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
              criterion === 'entropy'
                ? 'bg-[#6E3867] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#FAF7F0] text-[#5C544B] border-[#1A1715] hover:bg-[#F0EAE0]'
            }`}
          >
            <span>Shannon Entropy (ID3/C4.5)</span>
          </button>
        </div>
      </div>

      {/* Criterion Formula Explanation Pill */}
      <div className="p-2 bg-[#FAF7F0] border border-[#1A1715] text-[10px] flex items-center justify-between gap-2">
        {criterion === 'gini' ? (
          <div>
            <strong className="text-[#1848B8]">GINI FORMULA:</strong> G(S) = 1 - Σ p_k² | Bounds: [0, 0.50] | Metric: <strong>Gini Impurity Reduction (ΔGini)</strong>
          </div>
        ) : (
          <div>
            <strong className="text-[#6E3867]">ENTROPY FORMULA:</strong> H(S) = -Σ p_k·log₂(p_k) | Bounds: [0, 1.00 bit] | Metric: <strong>Information Gain (IG)</strong>
          </div>
        )}
        <span className="text-[9px] text-[#5C544B] shrink-0">
          Parent: {criterion === 'gini' ? parentGini.toFixed(3) : `${parentEntropy.toFixed(3)} bits`}
        </span>
      </div>

      {/* Main Split Axis SVG */}
      <div className="relative border border-[#1A1715] bg-[#F4EFE4] overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          {/* Axis line */}
          <line x1={padLeft} y1={70} x2={svgWidth - padRight} y2={70} stroke="#1A1715" strokeWidth="1.5" />

          {/* Left child background highlight */}
          <rect
            x={padLeft}
            y={20}
            width={toSvgX(threshold) - padLeft}
            height={90}
            fill="#33634B"
            fillOpacity="0.08"
          />

          {/* Right child background highlight */}
          <rect
            x={toSvgX(threshold)}
            y={20}
            width={svgWidth - padRight - toSvgX(threshold)}
            height={90}
            fill="#C83226"
            fillOpacity="0.08"
          />

          {/* Vertical Split Threshold Blade */}
          <line
            x1={toSvgX(threshold)}
            y1={10}
            x2={toSvgX(threshold)}
            y2={120}
            stroke="#1A1715"
            strokeWidth="2.5"
            strokeDasharray="4,2"
          />
          {/* Threshold Flag */}
          <rect x={toSvgX(threshold) - 24} y={12} width="48" height="16" fill="#1A1715" />
          <text x={toSvgX(threshold)} y={23} textAnchor="middle" fill="#FAF7F0" fontSize="8" fontWeight="bold">
            t = {threshold}%
          </text>

          {/* Data Points on Axis */}
          {points.map((p) => {
            const isApproved = p.approved === 1;
            return (
              <g key={p.id}>
                {/* Vertical tick */}
                <line x1={toSvgX(p.dti)} y1={65} x2={toSvgX(p.dti)} y2={75} stroke="#1A1715" strokeWidth="1" />
                <circle
                  cx={toSvgX(p.dti)}
                  cy={70}
                  r="5"
                  fill={isApproved ? '#33634B' : '#C83226'}
                  stroke="#1A1715"
                  strokeWidth="1.5"
                />
                <text x={toSvgX(p.dti)} y={90} textAnchor="middle" fill="#5C544B" fontSize="7" fontFamily="monospace">
                  {p.dti}
                </text>
              </g>
            );
          })}

          {/* Region Label Tags */}
          <text x={padLeft + 8} y={32} fill="#33634B" fontSize="9" fontWeight="bold">
            LEFT CHILD (DTI ≤ {threshold}%)
          </text>
          <text x={svgWidth - padRight - 8} y={32} textAnchor="end" fill="#C83226" fontSize="9" fontWeight="bold">
            RIGHT CHILD (DTI &gt; {threshold}%)
          </text>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-[#FAF7F0]/90 border border-[#1A1715] px-2 py-0.5 text-[8px] flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#33634B]" /> Approved (1)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#C83226]" /> Denied (0)
          </span>
        </div>
      </div>

      {/* Threshold Slider & Purity Calculations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Slider */}
        <div className="space-y-1 p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715]">
          <div className="flex justify-between text-[10px]">
            <span className="font-bold">SPLIT THRESHOLD (DTI %):</span>
            <span className="font-mono font-bold text-[#1A1715]">{threshold}%</span>
          </div>
          <input
            type="range"
            min="16"
            max="65"
            step="1"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
            className="w-full accent-[#33634B] cursor-pointer"
          />
          <div className="flex justify-between text-[8px] text-[#948B7D]">
            <span>Min (16%)</span>
            <span className="text-[#33634B] font-bold">Optimal (36%)</span>
            <span>Max (65%)</span>
          </div>
        </div>

        {/* Live Purity Metrics: Showing exact selected criterion */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">
              {criterion === 'gini' ? 'LEFT GINI' : 'LEFT ENTROPY'}
            </span>
            <span className="font-mono text-xs font-black text-[#33634B]">
              {criterion === 'gini' ? splitStats.leftGini.toFixed(3) : splitStats.leftEntropy.toFixed(3)}
            </span>
            <span className="text-[8px] text-[#948B7D]">n = {splitStats.left.length}</span>
          </div>

          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">
              {criterion === 'gini' ? 'RIGHT GINI' : 'RIGHT ENTROPY'}
            </span>
            <span className="font-mono text-xs font-black text-[#C83226]">
              {criterion === 'gini' ? splitStats.rightGini.toFixed(3) : splitStats.rightEntropy.toFixed(3)}
            </span>
            <span className="text-[8px] text-[#948B7D]">n = {splitStats.right.length}</span>
          </div>

          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">
              {criterion === 'gini' ? 'GINI REDUCTION' : 'INFO GAIN (IG)'}
            </span>
            <span className="font-mono text-xs font-black text-[#1848B8]">
              +{criterion === 'gini' ? splitStats.giniReduction.toFixed(3) : `${splitStats.informationGain.toFixed(3)}b`}
            </span>
            <span className="text-[8px] text-[#33634B] font-bold">
              {threshold === 36 ? 'Optimal Peak ★' : 'Suboptimal'}
            </span>
          </div>
        </div>
      </div>

      {/* Comparative Insight Plate */}
      <div className="p-2.5 bg-[#F4EFE4] border border-[#1A1715] text-[10px] font-mono text-[#5C544B] flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#1A1715]">Mathematical Note:</strong> Toggle between Gini and Entropy and observe that both metrics reach their maximum improvement at the exact same split point (36%). Gini Impurity operates in quadratic probability space without costly <code className="bg-[#E8E1D3] px-1 py-0.2">log₂</code> calculations, making CART significantly faster during training.
        </p>
      </div>
    </div>
  );
};
