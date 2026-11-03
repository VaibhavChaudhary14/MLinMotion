'use client';

import React, { useState, useMemo } from 'react';
import { CheckSquare, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface PatientCase {
  id: number;
  actual: 1 | 0; // 1 = Disease, 0 = Healthy
  score: number;  // Model risk score in [0.05, 0.95]
}

export const InteractiveEvaluationMetrics: React.FC = () => {
  // Pre-configured 100 patient cases (20 Disease, 80 Healthy)
  const patientPopulation: PatientCase[] = useMemo(() => {
    const list: PatientCase[] = [];
    // 20 Disease cases (mean ~0.72)
    const posScores = [
      0.42, 0.48, 0.52, 0.56, 0.61, 0.64, 0.68, 0.71, 0.73, 0.75,
      0.77, 0.79, 0.82, 0.84, 0.86, 0.89, 0.91, 0.92, 0.94, 0.96,
    ];
    posScores.forEach((score, i) => list.push({ id: i + 1, actual: 1, score }));

    // 80 Healthy cases (mean ~0.28)
    const negScores = [
      0.06, 0.08, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17,
      0.18, 0.19, 0.2, 0.21, 0.22, 0.22, 0.23, 0.24, 0.25, 0.26,
      0.27, 0.27, 0.28, 0.29, 0.29, 0.3, 0.31, 0.32, 0.32, 0.33,
      0.34, 0.35, 0.35, 0.36, 0.37, 0.38, 0.38, 0.39, 0.4, 0.41,
      0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49, 0.5, 0.51,
      0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61,
      0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.7, 0.71, 0.72,
      0.08, 0.12, 0.16, 0.22, 0.25, 0.29, 0.34, 0.38, 0.44, 0.49,
    ];
    negScores.forEach((score, i) => list.push({ id: 21 + i, actual: 0, score }));

    return list;
  }, []);

  const [threshold, setThreshold] = useState<number>(0.5);

  // Compute Confusion Matrix
  const matrix = useMemo(() => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;

    for (const p of patientPopulation) {
      const pred = p.score >= threshold ? 1 : 0;
      if (pred === 1 && p.actual === 1) tp++;
      else if (pred === 1 && p.actual === 0) fp++;
      else if (pred === 0 && p.actual === 1) fn++;
      else if (pred === 0 && p.actual === 0) tn++;
    }

    const total = patientPopulation.length;
    const accuracy = (tp + tn) / total;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return { tp, fp, fn, tn, accuracy, precision, recall, specificity, f1 };
  }, [patientPopulation, threshold]);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#33634B] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            CONFUSION MATRIX & THRESHOLD METRICS BENCH
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-[#F4EFE4] border border-[#1A1715] font-bold text-[#1A1715]">
            N = 100 PATIENTS
          </span>
          <span className="px-1.5 py-0.5 bg-[#FCE3D8] border border-[#1A1715] font-bold text-[#C83226]">
            20 DISEASE / 80 HEALTHY
          </span>
        </div>
      </div>

      {/* Control Strip & Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-[#5C544B] uppercase">DECISION THRESHOLD ($\tau$):</span>
            <span className="text-sm font-black text-[#1848B8]">
              {threshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-[#1848B8] cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            SCENARIO PRESETS:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setThreshold(0.35)}
              className={`flex-1 py-1 text-[9px] font-bold border transition-none ${
                threshold === 0.35
                  ? 'bg-[#C83226] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              CANCER (HIGH RECALL)
            </button>
            <button
              onClick={() => setThreshold(0.5)}
              className={`flex-1 py-1 text-[9px] font-bold border transition-none ${
                threshold === 0.5
                  ? 'bg-[#1848B8] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              BALANCED (0.50)
            </button>
            <button
              onClick={() => setThreshold(0.75)}
              className={`flex-1 py-1 text-[9px] font-bold border transition-none ${
                threshold === 0.75
                  ? 'bg-[#33634B] text-white border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              SPAM (HIGH PRECISION)
            </button>
          </div>
        </div>
      </div>

      {/* 2x2 Confusion Matrix + Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Confusion Matrix Table */}
        <div className="border-[1.5px] border-[#1A1715] bg-[#FAF7F0] p-2 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block text-center border-b border-[#D8CFC0] pb-1">
            2×2 CONTINGENCY MATRIX
          </span>
          <div className="grid grid-cols-2 gap-2 text-center">
            {/* TP */}
            <div className="p-3 bg-[#E8F0E6] border border-[#1A1715] space-y-0.5">
              <span className="text-[9px] font-bold text-[#33634B] block">
                TRUE POSITIVES (TP)
              </span>
              <div className="text-xl font-black text-[#1A1715]">{matrix.tp}</div>
              <span className="text-[8px] text-[#5C544B]">Sick detected sick</span>
            </div>
            {/* FP */}
            <div className="p-3 bg-[#FEF1EE] border border-[#1A1715] space-y-0.5">
              <span className="text-[9px] font-bold text-[#C83226] block">
                FALSE POSITIVES (FP)
              </span>
              <div className="text-xl font-black text-[#C83226]">{matrix.fp}</div>
              <span className="text-[8px] text-[#5C544B]">Type I Error (False Alarm)</span>
            </div>
            {/* FN */}
            <div className="p-3 bg-[#FEF1EE] border border-[#1A1715] space-y-0.5">
              <span className="text-[9px] font-bold text-[#C83226] block">
                FALSE NEGATIVES (FN)
              </span>
              <div className="text-xl font-black text-[#C83226]">{matrix.fn}</div>
              <span className="text-[8px] text-[#5C544B]">Type II Error (Missed Sick)</span>
            </div>
            {/* TN */}
            <div className="p-3 bg-[#EBF0FC] border border-[#1A1715] space-y-0.5">
              <span className="text-[9px] font-bold text-[#1848B8] block">
                TRUE NEGATIVES (TN)
              </span>
              <div className="text-xl font-black text-[#1A1715]">{matrix.tn}</div>
              <span className="text-[8px] text-[#5C544B]">Healthy detected healthy</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Ratio Gauges */}
        <div className="grid grid-cols-2 gap-2">
          {/* Recall */}
          <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-[#33634B]">
                RECALL (SENSITIVITY)
              </span>
              <span className="text-sm font-black text-[#1A1715]">
                {(matrix.recall * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715]">
              <div
                className="bg-[#33634B] h-full"
                style={{ width: `${matrix.recall * 100}%` }}
              />
            </div>
            <span className="text-[8px] text-[#5C544B] block leading-tight">
              TP / (TP + FN) — % of actual sick found
            </span>
          </div>

          {/* Precision */}
          <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-[#1848B8]">
                PRECISION (PPV)
              </span>
              <span className="text-sm font-black text-[#1A1715]">
                {(matrix.precision * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715]">
              <div
                className="bg-[#1848B8] h-full"
                style={{ width: `${matrix.precision * 100}%` }}
              />
            </div>
            <span className="text-[8px] text-[#5C544B] block leading-tight">
              TP / (TP + FP) — % of positive alarms true
            </span>
          </div>

          {/* F1 Score */}
          <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-[#E28C05]">
                F₁ SCORE (HARMONIC)
              </span>
              <span className="text-sm font-black text-[#1A1715]">
                {matrix.f1.toFixed(3)}
              </span>
            </div>
            <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715]">
              <div
                className="bg-[#E28C05] h-full"
                style={{ width: `${matrix.f1 * 100}%` }}
              />
            </div>
            <span className="text-[8px] text-[#5C544B] block leading-tight">
              2 · (P · R) / (P + R) — Harmonic compromise
            </span>
          </div>

          {/* Overall Accuracy */}
          <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-[#5C544B]">
                RAW ACCURACY
              </span>
              <span className="text-sm font-black text-[#1A1715]">
                {(matrix.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715]">
              <div
                className="bg-[#5C544B] h-full"
                style={{ width: `${matrix.accuracy * 100}%` }}
              />
            </div>
            <span className="text-[8px] text-[#5C544B] block leading-tight">
              (TP + TN) / Total — Misleading on rare events
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
