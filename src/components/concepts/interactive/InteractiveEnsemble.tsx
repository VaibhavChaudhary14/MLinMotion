'use client';

import React, { useState, useMemo } from 'react';
import { Users, CheckCircle2, XCircle, Sliders, Layers } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  groundTruth: 1 | 0;
  predA: 1 | 0;
  predB: 1 | 0;
  predC: 1 | 0;
}

export const InteractiveEnsemble: React.FC = () => {
  // 8 Test samples where individual models have errors, but collective majority vote gets 8/8 right!
  const testCases: TestCase[] = [
    { id: 't1', name: 'Sample #01 (Clear Positive)', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 't2', name: 'Sample #02 (Model A Mistake)', groundTruth: 1, predA: 0, predB: 1, predC: 1 }, // A errors, B&C correct
    { id: 't3', name: 'Sample #03 (Model B Mistake)', groundTruth: 0, predA: 0, predB: 1, predC: 0 }, // B errors, A&C correct
    { id: 't4', name: 'Sample #04 (Clear Negative)', groundTruth: 0, predA: 0, predB: 0, predC: 0 },
    { id: 't5', name: 'Sample #05 (Model C Mistake)', groundTruth: 1, predA: 1, predB: 1, predC: 0 }, // C errors, A&B correct
    { id: 't6', name: 'Sample #06 (Clear Positive)', groundTruth: 1, predA: 1, predB: 1, predC: 1 },
    { id: 't7', name: 'Sample #07 (Model A Mistake)', groundTruth: 0, predA: 1, predB: 0, predC: 0 }, // A errors, B&C correct
    { id: 't8', name: 'Sample #08 (Model B Mistake)', groundTruth: 1, predA: 1, predB: 0, predC: 1 }, // B errors, A&C correct
  ];

  // Base individual accuracy slider for Condorcet theorem math
  const [baseAccuracy, setBaseAccuracy] = useState<number>(0.70); // 70%

  // Compute theoretical Condorcet Jury Theorem accuracy for 3, 5, and 11 independent learners
  const condorcet = useMemo(() => {
    const p = baseAccuracy;
    const q = 1 - p;

    // For N = 3: majority is 2 or 3 correct: 3*p^2*q + p^3
    const n3 = 3 * p * p * q + p * p * p;

    // For N = 5: majority is 3, 4, or 5: 10*p^3*q^2 + 5*p^4*q + p^5
    const n5 = 10 * p ** 3 * q ** 2 + 5 * p ** 4 * q + p ** 5;

    // For N = 11:
    const binomial = (n: number, k: number) => {
      let coeff = 1;
      for (let i = 0; i < k; i++) coeff = (coeff * (n - i)) / (i + 1);
      return coeff;
    };
    let n11 = 0;
    for (let k = 6; k <= 11; k++) {
      n11 += binomial(11, k) * p ** k * q ** (11 - k);
    }

    return { n3, n5, n11 };
  }, [baseAccuracy]);

  // Compute empirical performance on the 8 test cases
  const empirical = useMemo(() => {
    let aCorrect = 0;
    let bCorrect = 0;
    let cCorrect = 0;
    let ensembleCorrect = 0;

    testCases.forEach((tc) => {
      if (tc.predA === tc.groundTruth) aCorrect++;
      if (tc.predB === tc.groundTruth) bCorrect++;
      if (tc.predC === tc.groundTruth) cCorrect++;

      const votes = tc.predA + tc.predB + tc.predC;
      const ensemblePred = votes >= 2 ? 1 : 0;
      if (ensemblePred === tc.groundTruth) ensembleCorrect++;
    });

    return {
      accA: (aCorrect / testCases.length) * 100,
      accB: (bCorrect / testCases.length) * 100,
      accC: (cCorrect / testCases.length) * 100,
      accEnsemble: (ensembleCorrect / testCases.length) * 100,
    };
  }, [testCases]);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            CONDORCET JURY THEOREM & MAJORITY VOTE TESTBENCH
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#33634B] font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>3 Diverse Base Models</span>
        </div>
      </div>

      {/* Model Benchmark Accuracy Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL A (TREE):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{empirical.accA.toFixed(0)}%</div>
          <span className="text-[8px] text-[#C83226]">2 Errors Observed</span>
        </div>

        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL B (SVM):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{empirical.accB.toFixed(0)}%</div>
          <span className="text-[8px] text-[#C83226]">2 Errors Observed</span>
        </div>

        <div className="p-2 bg-[#F4EFE4] border border-[#1A1715]">
          <span className="text-[9px] uppercase font-bold text-[#5C544B] block">MODEL C (LOGISTIC):</span>
          <div className="font-mono text-base font-black text-[#1A1715]">{empirical.accC.toFixed(0)}%</div>
          <span className="text-[8px] text-[#C83226]">1 Error Observed</span>
        </div>

        <div className="p-2 bg-[#33634B]/10 border-[1.5px] border-[#33634B] shadow-[1.5px_1.5px_0px_#33634B]">
          <span className="text-[9px] uppercase font-bold text-[#33634B] block">MAJORITY ENSEMBLE:</span>
          <div className="font-mono text-base font-black text-[#33634B]">{empirical.accEnsemble.toFixed(0)}%</div>
          <span className="text-[8px] text-[#33634B] font-bold">0 Errors! (100%) ★</span>
        </div>
      </div>

      {/* Empirical Voting Matrix Table */}
      <div className="border border-[#1A1715] bg-[#F4EFE4] overflow-x-auto">
        <table className="w-full text-left text-[10px] font-mono border-collapse">
          <thead>
            <tr className="bg-[#E8E1D3] border-b border-[#1A1715] text-[#1A1715]">
              <th className="p-1.5 pl-2 font-bold">TEST SAMPLE</th>
              <th className="p-1.5 text-center font-bold">TRUTH</th>
              <th className="p-1.5 text-center font-bold">MODEL A</th>
              <th className="p-1.5 text-center font-bold">MODEL B</th>
              <th className="p-1.5 text-center font-bold">MODEL C</th>
              <th className="p-1.5 text-center font-bold bg-[#33634B]/15 text-[#33634B]">ENSEMBLE VOTE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8CFC0]">
            {testCases.map((tc) => {
              const votes = tc.predA + tc.predB + tc.predC;
              const ensemblePred = votes >= 2 ? 1 : 0;
              const isCorrect = ensemblePred === tc.groundTruth;

              return (
                <tr key={tc.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="p-1.5 pl-2 font-semibold text-[#1A1715]">{tc.name}</td>
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
                  <td className="p-1.5 text-center font-black bg-[#33634B]/10 text-[#33634B]">
                    {ensemblePred} ({votes}/3) {isCorrect && '✔'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Condorcet Theorem Mathematical Simulation Slider */}
      <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#1A1715] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-bold text-[10px] text-[#1A1715]">
            CONDORCET THEOREM: INDEPENDENT LEARNER ACCURACY (p)
          </div>
          <span className="font-mono font-bold text-[#1848B8]">
            {(baseAccuracy * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0.51"
          max="0.95"
          step="0.01"
          value={baseAccuracy}
          onChange={(e) => setBaseAccuracy(parseFloat(e.target.value))}
          className="w-full accent-[#1848B8] cursor-pointer"
        />
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">3-MODEL ENSEMBLE</span>
            <span className="font-mono text-xs font-black text-[#1848B8]">
              {(condorcet.n3 * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">5-MODEL ENSEMBLE</span>
            <span className="font-mono text-xs font-black text-[#E28C05]">
              {(condorcet.n5 * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-1.5 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[8px] font-bold text-[#5C544B] block">11-MODEL ENSEMBLE</span>
            <span className="font-mono text-xs font-black text-[#33634B]">
              {(condorcet.n11 * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
