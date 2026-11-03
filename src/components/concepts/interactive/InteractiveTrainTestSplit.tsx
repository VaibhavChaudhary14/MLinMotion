'use client';

import React, { useState, useMemo } from 'react';
import { Split, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface SamplePoint {
  id: number;
  label: 'Healthy' | 'Disease'; // 16 Healthy (0), 4 Disease (1)
  featureVal: number;
}

export const InteractiveTrainTestSplit: React.FC = () => {
  // 20 patient cases: 4 Disease (indices 3, 8, 14, 19), 16 Healthy
  const rawDataset: SamplePoint[] = useMemo(
    () => [
      { id: 1, label: 'Healthy', featureVal: 2.1 },
      { id: 2, label: 'Healthy', featureVal: 2.4 },
      { id: 3, label: 'Healthy', featureVal: 1.9 },
      { id: 4, label: 'Disease', featureVal: 6.8 }, // Rare class
      { id: 5, label: 'Healthy', featureVal: 2.7 },
      { id: 6, label: 'Healthy', featureVal: 3.1 },
      { id: 7, label: 'Healthy', featureVal: 2.0 },
      { id: 8, label: 'Healthy', featureVal: 2.5 },
      { id: 9, label: 'Disease', featureVal: 7.2 }, // Rare class
      { id: 10, label: 'Healthy', featureVal: 1.8 },
      { id: 11, label: 'Healthy', featureVal: 3.3 },
      { id: 12, label: 'Healthy', featureVal: 2.9 },
      { id: 13, label: 'Healthy', featureVal: 2.2 },
      { id: 14, label: 'Healthy', featureVal: 2.8 },
      { id: 15, label: 'Disease', featureVal: 6.5 }, // Rare class
      { id: 16, label: 'Healthy', featureVal: 3.0 },
      { id: 17, label: 'Healthy', featureVal: 2.3 },
      { id: 18, label: 'Healthy', featureVal: 1.7 },
      { id: 19, label: 'Healthy', featureVal: 2.6 },
      { id: 20, label: 'Disease', featureVal: 7.9 }, // Rare class
    ],
    []
  );

  const [trainRatio, setTrainRatio] = useState<number>(0.7); // 70% train
  const [strategy, setStrategy] = useState<'random' | 'stratified'>('stratified');
  const [hasLeakage, setHasLeakage] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(42);

  // Split simulation
  const { trainSet, testSet, trainStats, testStats } = useMemo(() => {
    const total = rawDataset.length;
    const trainCount = Math.round(total * trainRatio);

    let train: SamplePoint[] = [];
    let test: SamplePoint[] = [];

    if (strategy === 'stratified') {
      const healthy = rawDataset.filter((s) => s.label === 'Healthy');
      const disease = rawDataset.filter((s) => s.label === 'Disease');

      const healthyTrainCount = Math.round(healthy.length * trainRatio);
      const diseaseTrainCount = Math.round(disease.length * trainRatio);

      train = [...healthy.slice(0, healthyTrainCount), ...disease.slice(0, diseaseTrainCount)];
      test = [...healthy.slice(healthyTrainCount), ...disease.slice(diseaseTrainCount)];
    } else {
      // Deterministic pseudo-random shuffle using seed
      const shuffled = [...rawDataset].sort((a, b) => {
        const hashA = Math.sin(a.id * 9999 + seed) * 10000;
        const hashB = Math.sin(b.id * 9999 + seed) * 10000;
        return (hashA - Math.floor(hashA)) - (hashB - Math.floor(hashB));
      });
      train = shuffled.slice(0, trainCount);
      test = shuffled.slice(trainCount);
    }

    const trainDisease = train.filter((s) => s.label === 'Disease').length;
    const testDisease = test.filter((s) => s.label === 'Disease').length;

    const trainDiseaseRate = (trainDisease / (train.length || 1)) * 100;
    const testDiseaseRate = (testDisease / (test.length || 1)) * 100;

    return {
      trainSet: train,
      testSet: test,
      trainStats: { total: train.length, disease: trainDisease, rate: trainDiseaseRate },
      testStats: { total: test.length, disease: testDisease, rate: testDiseaseRate },
    };
  }, [rawDataset, trainRatio, strategy, seed]);

  // Data leakage metric inflation
  const reportedTestAccuracy = useMemo(() => {
    if (hasLeakage) {
      return 96.5; // Inflated score due to test set statistics bleeding into normalization/imputation
    }
    return 84.2; // Honest out-of-sample generalization
  }, [hasLeakage]);

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            DATA SPLITTING & SCIENTIFIC EVALUATION BENCH
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-[#F4EFE4] border border-[#1A1715] font-bold text-[#1A1715]">
            N = 20 PATIENTS
          </span>
          <span className="px-1.5 py-0.5 bg-[#FAF7F0] border border-[#1A1715] font-bold text-[#C83226]">
            4 POSITIVE (20% RARE)
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        {/* Split Ratio Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-[#5C544B] uppercase">SPLIT RATIO:</span>
            <span className="text-[#1848B8]">
              {Math.round(trainRatio * 100)}% TRAIN / {Math.round((1 - trainRatio) * 100)}% TEST
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.9"
            step="0.1"
            value={trainRatio}
            onChange={(e) => setTrainRatio(parseFloat(e.target.value))}
            className="w-full accent-[#1848B8] cursor-pointer"
          />
        </div>

        {/* Sampling Strategy */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            PARTITION STRATEGY:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStrategy('stratified')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                strategy === 'stratified'
                  ? 'bg-[#33634B] text-[#FAF7F0] border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              STRATIFIED
            </button>
            <button
              onClick={() => setStrategy('random')}
              className={`flex-1 py-1 text-[10px] font-bold border transition-none ${
                strategy === 'random'
                  ? 'bg-[#C83226] text-[#FAF7F0] border-[#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              RANDOM
            </button>
            {strategy === 'random' && (
              <button
                onClick={() => setSeed((s) => s + 7)}
                title="Reshuffle with new seed"
                className="px-1.5 py-1 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3]"
              >
                <RefreshCw className="w-3 h-3 text-[#1A1715]" />
              </button>
            )}
          </div>
        </div>

        {/* Leakage Toggle */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5C544B] block">
            DATA INTEGRITY AUDIT:
          </span>
          <label className="flex items-center gap-2 p-1 bg-[#FAF7F0] border border-[#1A1715] cursor-pointer">
            <input
              type="checkbox"
              checked={hasLeakage}
              onChange={(e) => setHasLeakage(e.target.checked)}
              className="accent-[#C83226]"
            />
            <span className="text-[10px] font-bold text-[#1A1715]">
              {hasLeakage ? 'LEAKAGE SIMULATED' : 'HONEST SPLIT (NO LEAK)'}
            </span>
          </label>
        </div>
      </div>

      {/* Dataset Visual Distribution Matrix */}
      <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-2">
        <div className="flex items-center justify-between text-[10px] border-b border-[#D8CFC0] pb-1 font-bold">
          <span className="text-[#5C544B] uppercase">SAMPLE ALLOCATION TRAY (20 PATIENT SAMPLES)</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#33634B]">
              <span className="w-2 h-2 rounded-full bg-[#33634B]" /> HEALTHY (0)
            </span>
            <span className="flex items-center gap-1 text-[#C83226]">
              <span className="w-2 h-2 bg-[#C83226]" /> DISEASE (1)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 py-2">
          {rawDataset.map((sample) => {
            const isTrain = trainSet.some((s) => s.id === sample.id);
            const isDisease = sample.label === 'Disease';

            return (
              <div
                key={sample.id}
                className={`flex flex-col items-center justify-center p-1 border-[1.5px] ${
                  isTrain
                    ? 'border-[#1848B8] bg-[#EBF0FC]'
                    : 'border-[#E28C05] bg-[#FEF8ED]'
                }`}
                title={`#${sample.id}: ${sample.label} (${isTrain ? 'TRAIN' : 'TEST'})`}
              >
                <div
                  className={`w-3 h-3 ${
                    isDisease
                      ? 'bg-[#C83226] border border-[#1A1715]'
                      : 'rounded-full bg-[#33634B] border border-[#1A1715]'
                  }`}
                />
                <span className="text-[8px] font-black mt-1 text-[#1A1715]">
                  {isTrain ? 'TR' : 'TE'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics & Stratification Balance Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Train Set Stats */}
        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#1848B8] block">
            TRAINING SET ({trainStats.total} SAMPLES)
          </span>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-sm font-black text-[#1A1715]">
              {trainStats.disease} Positives
            </span>
            <span className="text-[10px] font-bold text-[#5C544B]">
              ({trainStats.rate.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715] overflow-hidden">
            <div
              className="bg-[#1848B8] h-full"
              style={{ width: `${trainStats.rate * 2.5}%` }}
            />
          </div>
        </div>

        {/* Test Set Stats */}
        <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#E28C05] block">
            TEST SET ({testStats.total} SAMPLES)
          </span>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-sm font-black text-[#1A1715]">
              {testStats.disease} Positives
            </span>
            <span className="text-[10px] font-bold text-[#5C544B]">
              ({testStats.rate.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-[#E8E1D3] h-1.5 border border-[#1A1715] overflow-hidden">
            <div
              className={`h-full ${
                testStats.disease === 0 ? 'bg-[#C83226]' : 'bg-[#E28C05]'
              }`}
              style={{ width: `${testStats.rate * 2.5}%` }}
            />
          </div>
          {testStats.disease === 0 && (
            <span className="text-[9px] text-[#C83226] font-black block">
              WARNING: ZERO POSITIVES IN TEST SET!
            </span>
          )}
        </div>

        {/* Generalization vs Leakage Metric Plate */}
        <div
          className={`p-2.5 border-[1.5px] border-[#1A1715] space-y-1 ${
            hasLeakage ? 'bg-[#FDF0EE]' : 'bg-[#EDF5F0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[9px] uppercase font-black ${
                hasLeakage ? 'text-[#C83226]' : 'text-[#33634B]'
              }`}
            >
              {hasLeakage ? 'LEAKED TEST ACCURACY' : 'TRUE GENERALIZATION'}
            </span>
            {hasLeakage ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#C83226]" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#33634B]" />
            )}
          </div>
          <div className="text-base font-black text-[#1A1715]">
            {reportedTestAccuracy.toFixed(1)}%
          </div>
          <span className="text-[9px] text-[#5C544B] block leading-tight">
            {hasLeakage
              ? 'Artificially inflated! Preprocessing computed over combined train+test.'
              : 'Honest evaluation. Parameters fit strictly on train split.'}
          </span>
        </div>
      </div>
    </div>
  );
};
