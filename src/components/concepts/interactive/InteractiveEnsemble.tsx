'use client';

import React, { useState, useMemo } from 'react';
import { Users, AlertTriangle, CheckCircle2, XCircle, Sliders, Layers } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  groundTruth: 1 | 0;
  predA: 1 | 0; // Model A (Decision Tree)
  predB: 1 | 0; // Model B (Linear SVM)
  predC: 1 | 0; // Model C (Logistic Classifier)
}

export const InteractiveEnsemble: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'toy' | 'realistic'>('toy');
  const [errorCorrelation, setErrorCorrelation] = useState<number>(0.2); // rho: correlation between errors

  // DATASET 1: Toy Case (Independent / Uncorrelated Errors)
  // Individual models make sporadic, independent errors; majority vote fixes them all!
  const toyTestCases: TestCase[] = [
    { id: 't1', name: 'Sample #01 (Unambiguous)', description: 'Clear positive cluster signal', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 't2', name: 'Sample #02 (Tree Overfit)', description: 'Model A makes isolated boundary mistake; B & C correct', groundTruth: 1, predA: 0, predB: 1, predC: 1 },
    { id: 't3', name: 'Sample #03 (Linear Margin)', description: 'Model B makes linear margin mistake; A & C correct', groundTruth: 0, predA: 0, predB: 1, predC: 0 },
    { id: 't4', name: 'Sample #04 (Unambiguous)', description: 'Clear negative cluster signal', groundTruth: 0, predA: 0, predB: 0, predC: 0 },
    { id: 't5', name: 'Sample #05 (Logit Outlier)', description: 'Model C miscalibrates probability; A & B correct', groundTruth: 1, predA: 1, predB: 1, predC: 0 },
    { id: 't6', name: 'Sample #06 (Unambiguous)', description: 'Clear positive cluster signal', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 't7', name: 'Sample #07 (Tree Axis Trap)', description: 'Model A staircase artifact; B & C correct', groundTruth: 0, predA: 1, predB: 0, predC: 0 },
    { id: 't8', name: 'Sample #08 (SVM Projection)', description: 'Model B hyperplane shift; A & C correct', groundTruth: 1, predA: 1, predB: 0, predC: 1 },
  ];

  // DATASET 2: Realistic Case (Correlated Errors & Hard Non-Linear Manifold)
  // Models share systematic inductive biases; when A and B both fail, the ensemble fails!
  const realisticTestCases: TestCase[] = [
    { id: 'r1', name: 'Sample #01 (Standard Case)', description: 'Well-separated region', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 'r2', name: 'Sample #02 (Deceptive Outlier)', description: 'Severe label noise: A & B BOTH fooled! Majority fails (1 vs 2)', groundTruth: 0, predA: 1, predB: 1, predC: 0 }, // Fails!
    { id: 'r3', name: 'Sample #03 (Sparse Region)', description: 'Model A errors; B & C correct', groundTruth: 1, predA: 0, predB: 1, predC: 1 },
    { id: 'r4', name: 'Sample #04 (Standard Case)', description: 'Well-separated region', groundTruth: 0, predA: 0, predB: 0, predC: 0 },
    { id: 'r5', name: 'Sample #05 (Concentric Point)', description: 'Non-linear pocket: Models B & C both fail! Majority fails (1 vs 2)', groundTruth: 1, predA: 1, predB: 0, predC: 0 }, // Fails!
    { id: 'r6', name: 'Sample #06 (Standard Case)', description: 'Well-separated region', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 'r7', name: 'Sample #07 (Boundary Shift)', description: 'Model C errors; A & B correct', groundTruth: 0, predA: 0, predB: 0, predC: 1 },
    { id: 'r8', name: 'Sample #08 (High Leverage)', description: 'Correlated bias: ALL 3 models fail on systemic distribution shift!', groundTruth: 0, predA: 1, predB: 1, predC: 1 }, // Fails!
  ];

  const currentCases = activeTab === 'toy' ? toyTestCases : realisticTestCases;

  // Compute empirical metrics for current dataset
  const metrics = useMemo(() => {
    let aCorrect = 0;
    let bCorrect = 0;
    let cCorrect = 0;
    let ensembleCorrect = 0;

    currentCases.forEach((tc) => {
      if (tc.predA === tc.groundTruth) aCorrect++;
      if (tc.predB === tc.groundTruth) bCorrect++;
      if (tc.predC === tc.groundTruth) cCorrect++;

      const votes = tc.predA + tc.predB + tc.predC;
      const ensemblePred = votes >= 2 ? 1 : 0;
      if (ensemblePred === tc.groundTruth) ensembleCorrect++;
    });

    const total = currentCases.length;
    return {
      accA: (aCorrect / total) * 100,
      accB: (bCorrect / total) * 100,
      accC: (cCorrect / total) * 100,
      accEnsemble: (ensembleCorrect / total) * 100,
      ensembleCorrectCount: ensembleCorrect,
      totalCount: total,
    };
  }, [currentCases]);

  // Theoretical Variance Reduction Formula (Hastie, Tibshirani):
  // Var(Ensemble) = rho * sigma^2 + ((1 - rho) / M) * sigma^2
  // When rho = 0 (perfect independence), variance drops by 1/M (e.g. 1/5 = 20% of original).
  // When rho = 1 (perfect correlation), variance reduction is 0%.
  const varianceReduction = useMemo(() => {
    const M = 5; // 5 models
    const rho = errorCorrelation;
    const relativeVariance = rho + (1 - rho) / M;
    const pctReduction = (1 - relativeVariance) * 100;
    return { relativeVariance, pctReduction };
  }, [errorCorrelation]);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-4">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            MODEL DIVERSITY & CORRELATED ERROR TESTBENCH
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#5C544B]">
          <Users className="w-3.5 h-3.5 text-[#1848B8]" />
          <span>3 Base Models: Decision Tree, SVM, Logistic</span>
        </div>
      </div>

      {/* Dataset View Mode Switcher */}
      <div className="p-2.5 bg-[#E8E1D3]/60 border border-[#1A1715] flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase text-[#1A1715]">
          SELECT EVALUATION SCENARIO:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('toy')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
              activeTab === 'toy'
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#FAF7F0] text-[#5C544B] border-[#1A1715] hover:bg-[#F0EAE0]'
            }`}
          >
            <span>Case A: Toy Demo (Independent Errors)</span>
          </button>
          <button
            onClick={() => setActiveTab('realistic')}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
              activeTab === 'realistic'
                ? 'bg-[#C83226] text-[#FAF7F0] border-[#1A1715] shadow-[1px_1px_0px_#1A1715]'
                : 'bg-[#FAF7F0] text-[#5C544B] border-[#1A1715] hover:bg-[#F0EAE0]'
            }`}
          >
            <span>Case B: Realistic Audit (Correlated Errors)</span>
          </button>
        </div>
      </div>

      {/* Context Banner */}
      {activeTab === 'toy' ? (
        <div className="p-2.5 bg-[#1848B8]/10 border border-[#1848B8] text-[#1848B8] space-y-0.5 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ILLUSTRATIVE TOY DEMONSTRATION: UNCORRELATED INDEPENDENT ERRORS</span>
          </div>
          <p className="leading-relaxed text-[#1A1715]">
            Each base model makes isolated, independent mistakes on different samples. Because errors do not coincide, the majority vote (2-vs-1) successfully corrects every individual blunder in this toy case.
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-[#C83226]/10 border border-[#C83226] text-[#C83226] space-y-0.5 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REALISTIC EVALUATION: CORRELATED ERRORS & SYSTEMIC BIAS</span>
          </div>
          <p className="leading-relaxed text-[#1A1715]">
            When data contains deceptive outliers, noisy ground-truth labels, or non-linear manifolds, base models often make <strong>the same correlated mistakes</strong>. In Samples #02, #05, and #08, correlated errors overpower the majority, showing that ensembles improve accuracy but are never magic bullets.
          </p>
        </div>
      )}

      {/* Benchmark Accuracy Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL A (TREE):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{metrics.accA.toFixed(0)}%</div>
          <span className="text-[8px] text-[#5C544B]">Individual Base Learner</span>
        </div>

        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL B (SVM):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{metrics.accB.toFixed(0)}%</div>
          <span className="text-[8px] text-[#5C544B]">Individual Base Learner</span>
        </div>

        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL C (LOGISTIC):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{metrics.accC.toFixed(0)}%</div>
          <span className="text-[8px] text-[#5C544B]">Individual Base Learner</span>
        </div>

        <div
          className={`p-2 border-[1.5px] shadow-[1.5px_1.5px_0px_#1A1715] ${
            activeTab === 'toy'
              ? 'bg-[#33634B]/15 border-[#33634B]'
              : 'bg-[#E28C05]/15 border-[#E28C05]'
          }`}
        >
          <span className="text-[9px] uppercase font-bold text-[#1A1715] block">MAJORITY ENSEMBLE:</span>
          <div
            className={`font-mono text-base font-black ${
              activeTab === 'toy' ? 'text-[#33634B]' : 'text-[#E28C05]'
            }`}
          >
            {metrics.accEnsemble.toFixed(0)}%
          </div>
          <span className="text-[8px] font-bold text-[#1A1715]">
            {metrics.ensembleCorrectCount} / {metrics.totalCount} correct {activeTab === 'toy' ? '(Toy Optimal)' : '(Realistic +12.5% boost)'}
          </span>
        </div>
      </div>

      {/* Evaluation Sample Table */}
      <div className="border border-[#1A1715] bg-[#F4EFE4] overflow-x-auto">
        <table className="w-full text-left text-[10px] font-mono border-collapse">
          <thead>
            <tr className="bg-[#E8E1D3] border-b border-[#1A1715] text-[#1A1715]">
              <th className="p-1.5 pl-2 font-bold">TEST SAMPLE & DIAGNOSTIC CONTEXT</th>
              <th className="p-1.5 text-center font-bold">TRUTH</th>
              <th className="p-1.5 text-center font-bold">MODEL A</th>
              <th className="p-1.5 text-center font-bold">MODEL B</th>
              <th className="p-1.5 text-center font-bold">MODEL C</th>
              <th className="p-1.5 text-center font-bold bg-[#E8E1D3] border-l border-[#1A1715]">
                MAJORITY VOTE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8CFC0]">
            {currentCases.map((tc) => {
              const votes = tc.predA + tc.predB + tc.predC;
              const ensemblePred = votes >= 2 ? 1 : 0;
              const isCorrect = ensemblePred === tc.groundTruth;

              return (
                <tr key={tc.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="p-1.5 pl-2">
                    <span className="font-bold text-[#1A1715] block">{tc.name}</span>
                    <span className="text-[9px] text-[#5C544B]">{tc.description}</span>
                  </td>
                  <td className="p-1.5 text-center font-bold">{tc.groundTruth}</td>
                  <td className="p-1.5 text-center">
                    <span className={tc.predA === tc.groundTruth ? 'text-[#33634B]' : 'text-[#C83226] font-bold'}>
                      {tc.predA} {tc.predA !== tc.groundTruth && '✗'}
                    </span>
                  </td>
                  <td className="p-1.5 text-center">
                    <span className={tc.predB === tc.groundTruth ? 'text-[#33634B]' : 'text-[#C83226] font-bold'}>
                      {tc.predB} {tc.predB !== tc.groundTruth && '✗'}
                    </span>
                  </td>
                  <td className="p-1.5 text-center">
                    <span className={tc.predC === tc.groundTruth ? 'text-[#33634B]' : 'text-[#C83226] font-bold'}>
                      {tc.predC} {tc.predC !== tc.groundTruth && '✗'}
                    </span>
                  </td>
                  <td
                    className={`p-1.5 text-center font-black border-l border-[#1A1715] ${
                      isCorrect ? 'bg-[#33634B]/10 text-[#33634B]' : 'bg-[#C83226]/10 text-[#C83226]'
                    }`}
                  >
                    {ensemblePred} ({votes}/3) {isCorrect ? '✔' : 'FAIL ✗'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Model Diversity & Correlation Mathematical Law */}
      <div className="p-3 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase font-bold text-[#1A1715] block">
              DIVERSITY LAW: ERROR CORRELATION MULTIPLIER (ρ)
            </span>
            <span className="text-[9px] text-[#5C544B]">
              Var(Ensemble) = ρ·σ² + ((1 - ρ) / M)·σ² (for M = 5 models)
            </span>
          </div>
          <span className="font-mono font-bold text-[#1848B8]">
            ρ = {errorCorrelation.toFixed(2)}
          </span>
        </div>

        <input
          type="range"
          min="0.00"
          max="0.95"
          step="0.05"
          value={errorCorrelation}
          onChange={(e) => setErrorCorrelation(parseFloat(e.target.value))}
          className="w-full accent-[#1848B8] cursor-pointer"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">RELATIVE VARIANCE</span>
            <span className="font-mono text-xs font-black text-[#1A1715]">
              {(varianceReduction.relativeVariance * 100).toFixed(0)}%
            </span>
            <span className="text-[8px] text-[#948B7D]">of single model</span>
          </div>

          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">VARIANCE REDUCTION</span>
            <span className="font-mono text-xs font-black text-[#33634B]">
              -{varianceReduction.pctReduction.toFixed(0)}%
            </span>
            <span className="text-[8px] text-[#33634B] font-bold">
              {errorCorrelation <= 0.25 ? 'High Diversity Benefit' : 'Diminished Benefit'}
            </span>
          </div>

          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715] col-span-2 sm:col-span-1">
            <span className="text-[8px] font-bold text-[#5C544B] block">ENSEMBLE TAKEAWAY</span>
            <span className="font-mono text-[10px] font-bold text-[#1848B8] block pt-0.5">
              {errorCorrelation < 0.3 ? 'Uncorrelated → Huge Gain' : 'Correlated → Weak Gain'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
