'use client';

import React, { useState, useEffect } from 'react';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { AnalogSlider } from '@/components/ui/AnalogSlider';
import { FormulaPlate } from '@/components/ui/FormulaPlate';
import { Badge } from '@/components/ui/Badge';
import { GlyphPoint } from '@/components/ui/GlyphPoint';
import { Point2D } from '@/types';
import { generateLinearRegressionData, generateBlobs } from '@/lib/datasets/benchmarks';
import { computeOLS, computeGDStep, RegressionParams } from '@/lib/math/regression';
import { evaluateLogisticModel, LogisticParams } from '@/lib/math/logistic';
import { compute2DPCA } from '@/lib/math/pca';
import { buildDecisionTree, predictTree, TreeNode } from '@/lib/math/decisionTree';
import { saveExperimentRecord } from '@/lib/adaptive/recommender';
import { Play, RotateCcw, Save, CheckCircle2, Sliders, Info } from 'lucide-react';

export const InteractiveMLLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regression' | 'gd' | 'logistic' | 'trees' | 'pca'>('regression');

  // --- Linear Regression State ---
  const [regPoints, setRegPoints] = useState<Point2D[]>(() => generateLinearRegressionData(18, 25, false, 42));
  const [regNoise, setRegNoise] = useState<number>(18);
  const [manualSlope, setManualSlope] = useState<number>(0.65);
  const [manualIntercept, setManualIntercept] = useState<number>(60);
  const [useOLS, setUseOLS] = useState<boolean>(true);

  // --- Gradient Descent State ---
  const [gdParams, setGdParams] = useState<RegressionParams>({ slope: 0.1, intercept: 120 });
  const [learningRate, setLearningRate] = useState<number>(0.00008);
  const [gdHistory, setGdHistory] = useState<Array<{ w: number; b: number; mse: number }>>([]);
  const [gdStepCount, setGdStepCount] = useState<number>(0);

  // --- Logistic Regression State ---
  const [logPoints, setLogPoints] = useState<Point2D[]>(() => [
    ...generateBlobs(2, 18, 55).map((p) => ({ ...p, label: p.label === 0 ? 0 : 1 })),
  ]);
  const [logisticParams, setLogisticParams] = useState<LogisticParams>({
    w1: 0.02,
    w2: -0.015,
    bias: -1.2,
    threshold: 0.5,
  });

  // --- Decision Trees State ---
  const [treeMaxDepth, setTreeMaxDepth] = useState<number>(3);
  const [treeModel, setTreeModel] = useState<TreeNode | null>(null);

  // --- PCA State ---
  const [pcaPoints, setPcaPoints] = useState<Point2D[]>(() => generateLinearRegressionData(35, 30, false, 88));

  // Shared state
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync OLS
  const olsResult = computeOLS(regPoints);

  useEffect(() => {
    if (useOLS) {
      setManualSlope(olsResult.slope);
      setManualIntercept(olsResult.intercept);
    }
  }, [useOLS, olsResult.slope, olsResult.intercept]);

  // Sync Decision Tree
  useEffect(() => {
    const tree = buildDecisionTree(logPoints, treeMaxDepth);
    setTreeModel(tree);
  }, [logPoints, treeMaxDepth]);

  // Step Gradient Descent
  const stepGD = () => {
    const stepRes = computeGDStep(regPoints, gdParams, learningRate, gdStepCount + 1);
    setGdParams(stepRes.params);
    setGdStepCount((prev) => prev + 1);
    setGdHistory((prev) => [
      ...prev,
      { w: stepRes.params.slope, b: stepRes.params.intercept, mse: stepRes.mse },
    ]);
  };

  const resetGD = () => {
    setGdParams({ slope: 0.05, intercept: 140 });
    setGdStepCount(0);
    setGdHistory([]);
  };

  const handleSaveLabExperiment = () => {
    let name = 'Regression Lab Run';
    let metrics: Record<string, any> = { MSE: olsResult.mse, R2: olsResult.r2 };

    if (activeTab === 'gd') {
      name = `GD Lab Run (α = ${learningRate})`;
      metrics = { 'Step Count': gdStepCount, 'Current W': gdParams.slope, 'Current B': gdParams.intercept };
    } else if (activeTab === 'logistic') {
      const evalRes = evaluateLogisticModel(logPoints, logisticParams);
      name = 'Logistic Regression Threshold Run';
      metrics = {
        Accuracy: evalRes.cm.accuracy,
        F1: evalRes.cm.f1,
        Threshold: logisticParams.threshold,
        LogLoss: evalRes.logLoss,
      };
    } else if (activeTab === 'pca') {
      const pca = compute2DPCA(pcaPoints);
      name = 'PCA Variance Retention Run';
      metrics = {
        'Explained Variance PC1': pca.eigenvectors[0].varianceRatio,
        'Total Recon Error': pca.totalReconstructionError,
      };
    }

    saveExperimentRecord({
      name,
      datasetName: 'Interactive Lab Realtime Canvas',
      datasetFingerprint: `lab-${activeTab}-${Date.now()}`,
      algorithm: activeTab.toUpperCase(),
      taskType: activeTab === 'pca' ? 'dimensionality-reduction' : activeTab === 'logistic' ? 'binary-classification' : 'regression',
      hyperparameters: { learningRate, threshold: logisticParams.threshold, depth: treeMaxDepth },
      metrics,
      runtimeMs: 8.5,
      warnings: [],
      notes: 'Executed in Analog Lab benchtop instrument.',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Plate */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
            BENCHTOP INSTRUMENTATION // LAB
          </span>
          <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
            Interactive ML Experiment Engine
          </h1>
          <p className="font-mono text-xs text-[#5C544B] mt-0.5">
            Manipulate parameters, inject noise, drag coordinates, and inspect real-time mathematical derivations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AnalogButton
            variant="secondary"
            size="sm"
            onClick={handleSaveLabExperiment}
            className="flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#33634B]" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>SAVE RUN</span>
              </>
            )}
          </AnalogButton>
        </div>
      </div>

      {/* Lab Module Selector Tabs */}
      <div className="flex flex-wrap gap-1 p-1.5 bg-[#E8E1D3] border-[1.5px] border-[#1A1715] shadow-[inset_1.5px_1.5px_0px_rgba(26,23,21,0.15)]">
        {[
          { id: 'regression', label: '1. LINEAR REGRESSION & RESIDUALS' },
          { id: 'gd', label: '2. GRADIENT DESCENT OPTIMIZATION' },
          { id: 'logistic', label: '3. LOGISTIC REGRESSION & THRESHOLDS' },
          { id: 'trees', label: '4. DECISION TREE PARTITIONS' },
          { id: 'pca', label: '5. PCA & EIGENVECTOR PROJECTION' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`font-mono text-xs font-bold px-3 py-1.5 border-[1.5px] transition-all ${
              activeTab === tab.id
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715] shadow-[2px_2px_0px_#1A1715]'
                : 'bg-[#FAF7F0] text-[#1A1715] border-transparent hover:border-[#1A1715]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Linear Regression & Residuals */}
      {activeTab === 'regression' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <AnalogCard
              variant="card"
              headerEyebrow="REGRESSION CANVAS // 2D LEAST SQUARES"
              headerTitle="PREDICTION LINE & ERROR RESIDUALS (y - ŷ)"
              headerAction={
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseOLS(true)}
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${
                      useOLS ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
                    }`}
                  >
                    CLOSED-FORM OLS
                  </button>
                  <button
                    onClick={() => setUseOLS(false)}
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${
                      !useOLS ? 'bg-[#C83226] text-white' : 'bg-[#FAF7F0]'
                    }`}
                  >
                    MANUAL LEVER
                  </button>
                </div>
              }
            >
              {/* Interactive Canvas */}
              <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] border-[1.5px] border-[#1A1715] overflow-hidden select-none">
                <svg viewBox="0 0 600 450" className="w-full h-full">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="regGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="600" height="450" fill="url(#regGrid)" />

                  {/* Axes */}
                  <line x1="20" y1="430" x2="580" y2="430" stroke="#1A1715" strokeWidth="1.5" />
                  <line x1="20" y1="430" x2="20" y2="20" stroke="#1A1715" strokeWidth="1.5" />

                  {/* Residual Error Lines in Vermilion (#C83226) */}
                  {regPoints.map((p) => {
                    const yHat = manualSlope * p.x + manualIntercept;
                    return (
                      <line
                        key={`res-${p.id}`}
                        x1={p.x}
                        y1={450 - p.y}
                        x2={p.x}
                        y2={450 - yHat}
                        stroke="#C83226"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                      />
                    );
                  })}

                  {/* Regression Line */}
                  <line
                    x1="20"
                    y1={450 - (manualSlope * 20 + manualIntercept)}
                    x2="580"
                    y2={450 - (manualSlope * 580 + manualIntercept)}
                    stroke="#1848B8"
                    strokeWidth={2.5}
                  />

                  {/* Data Points */}
                  {regPoints.map((p) => (
                    <circle
                      key={p.id}
                      cx={p.x}
                      cy={450 - p.y}
                      r={5}
                      fill={p.isOutlier ? '#C83226' : '#1A1715'}
                      stroke="#FAF7F0"
                      strokeWidth={1.2}
                    />
                  ))}
                </svg>

                {/* HUD Overlay */}
                <div className="absolute top-2 right-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-2.5 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#5C544B]">MSE LOSS:</span>
                    <span className="font-bold text-[#C83226] tnum">{olsResult.mse}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#5C544B]">R² SCORE:</span>
                    <span className="font-bold text-[#1848B8] tnum">{olsResult.r2}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#5C544B]">EQUATION:</span>
                    <span className="font-bold text-[#1A1715] tnum">
                      ŷ = {manualSlope.toFixed(2)}x + {manualIntercept.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </AnalogCard>
          </div>

          {/* Right Parameters & Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <AnalogCard variant="card" headerEyebrow="POTENTIOMETERS" headerTitle="HYPERPARAMETERS">
              <div className="space-y-3">
                <AnalogSlider
                  label="GAUSSIAN NOISE (σ)"
                  symbol="σ"
                  min={0}
                  max={50}
                  step={2}
                  value={regNoise}
                  onChange={(val) => {
                    setRegNoise(val);
                    setRegPoints(generateLinearRegressionData(val, 25, false, 42));
                  }}
                  helpText="Increase noise variance to see R² degrade."
                />

                {!useOLS && (
                  <>
                    <AnalogSlider
                      label="SLOPE LEVER (w)"
                      symbol="w"
                      min={-1.5}
                      max={2.0}
                      step={0.05}
                      value={manualSlope}
                      onChange={(val) => setManualSlope(Number(val.toFixed(2)))}
                    />
                    <AnalogSlider
                      label="INTERCEPT LEVER (b)"
                      symbol="b"
                      min={0}
                      max={200}
                      step={5}
                      value={manualIntercept}
                      onChange={(val) => setManualIntercept(val)}
                    />
                  </>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <AnalogButton
                    variant="amber"
                    size="sm"
                    onClick={() => {
                      setRegPoints(generateLinearRegressionData(regNoise, 25, true, Date.now()));
                    }}
                  >
                    INJECT LEVERAGE OUTLIERS
                  </AnalogButton>
                  <AnalogButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRegPoints(generateLinearRegressionData(18, 25, false, 42));
                    }}
                  >
                    RESET DATASET
                  </AnalogButton>
                </div>
              </div>
            </AnalogCard>

            <AnalogCard variant="card" headerEyebrow="MATHEMATICS" headerTitle="ORDINARY LEAST SQUARES">
              <FormulaPlate
                latex="\beta_1 = \frac{\sum (x - \bar{x})(y - \bar{y})}{\sum (x - \bar{x})^2}, \quad \beta_0 = \bar{y} - \beta_1 \bar{x}"
                displayMode={true}
              />
              <p className="font-mono text-xs text-[#5C544B] mt-2 leading-relaxed">
                Notice how the red dashed lines represent the vertical error residuals. OLS minimizes the square sum of these exact vertical segments.
              </p>
            </AnalogCard>
          </div>
        </div>
      )}

      {/* TAB 2: Gradient Descent Optimization */}
      {activeTab === 'gd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <AnalogCard
              variant="card"
              headerEyebrow="FIRST-ORDER OPTIMIZER"
              headerTitle={`GRADIENT DESCENT ITERATIONS // STEP ${gdStepCount}`}
            >
              {/* Convergence & Trajectory Graph */}
              <div className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] h-[340px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b pb-2 font-mono text-xs">
                  <span className="font-bold text-[#1A1715]">OPTIMIZATION TERRAIN & LOSS LOG</span>
                  <Badge variant={gdParams.slope > 5 ? 'vermilion' : 'sage'}>
                    {gdParams.slope > 5 ? 'DIVERGENCE ALERT' : 'CONVERGING'}
                  </Badge>
                </div>

                {/* SVG Loss Curve */}
                <div className="w-full h-56 bg-[#E8E1D3]/40 border border-[#D8CFC0] p-2 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200">
                    {/* Grid lines */}
                    <line x1="10" y1="180" x2="490" y2="180" stroke="#1A1715" strokeWidth="1" />
                    <line x1="10" y1="10" x2="10" y2="180" stroke="#1A1715" strokeWidth="1" />

                    {/* Polyline of MSE History */}
                    {gdHistory.length > 1 && (
                      <polyline
                        points={gdHistory
                          .map((h, i) => {
                            const x = 20 + (i / Math.max(1, gdHistory.length - 1)) * 460;
                            const y = Math.max(20, Math.min(170, 180 - (h.mse / 1500) * 150));
                            return `${x},${y}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#C83226"
                        strokeWidth={2}
                      />
                    )}

                    {/* Points on loss curve */}
                    {gdHistory.map((h, i) => {
                      const x = 20 + (i / Math.max(1, gdHistory.length - 1)) * 460;
                      const y = Math.max(20, Math.min(170, 180 - (h.mse / 1500) * 150));
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={3}
                          fill="#FAF7F0"
                          stroke="#C83226"
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </svg>
                  {gdHistory.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-[#948B7D]">
                      PRESS "STEP UPDATE" TO INITIATE DESCENT
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <AnalogButton variant="primary" size="sm" onClick={stepGD} className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" />
                      <span>STEP UPDATE</span>
                    </AnalogButton>
                    <AnalogButton variant="secondary" size="sm" onClick={resetGD} className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RESET</span>
                    </AnalogButton>
                  </div>
                  <div className="font-mono text-xs text-[#1A1715] flex gap-3">
                    <span>w = {gdParams.slope}</span>
                    <span>b = {gdParams.intercept}</span>
                  </div>
                </div>
              </div>
            </AnalogCard>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <AnalogCard variant="card" headerEyebrow="LEARNING RATE TUNER" headerTitle="STEP SIZE α">
              <AnalogSlider
                label="LEARNING RATE (α)"
                symbol="α"
                min={0.00001}
                max={0.00025}
                step={0.00001}
                value={learningRate}
                onChange={(val) => setLearningRate(val)}
                helpText="Too small = slow crawl. Too high = violent explosion."
              />
              <div className="mt-3">
                <FormulaPlate
                  latex="w \leftarrow w - \alpha \frac{\partial J}{\partial w}, \quad b \leftarrow b - \alpha \frac{\partial J}{\partial b}"
                  label="FIRST ORDER UPDATE"
                />
              </div>
            </AnalogCard>
          </div>
        </div>
      )}

      {/* TAB 3: Logistic Regression & Thresholds */}
      {activeTab === 'logistic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <AnalogCard
              variant="card"
              headerEyebrow="CLASSIFICATION PROBABILITIES"
              headerTitle="SIGMOID LOG-ODDS & DECISION BOUNDARY"
            >
              {(() => {
                const evalResult = evaluateLogisticModel(logPoints, logisticParams);
                return (
                  <div className="space-y-3">
                    {/* Visual 2D classification canvas */}
                    <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] border-[1.5px] border-[#1A1715] overflow-hidden select-none">
                      <svg viewBox="0 0 600 450" className="w-full h-full">
                        {/* Background decision partition overlay */}
                        <defs>
                          <pattern id="logGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E8E1D3" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect width="600" height="450" fill="url(#logGrid)" />

                        {/* Decision Boundary Line: w1*x + w2*y + b = ln(t / (1 - t)) */}
                        <line
                          x1="0"
                          y1="180"
                          x2="600"
                          y2="280"
                          stroke="#1A1715"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />

                        {/* Points */}
                        {evalResult.predictions.map((pred, i) => {
                          const p = logPoints[i];
                          const isPos = p.label === 1;
                          return (
                            <circle
                              key={p.id}
                              cx={p.x}
                              cy={p.y}
                              r={6}
                              fill={isPos ? '#1848B8' : '#C83226'}
                              stroke={pred.isCorrect ? '#1A1715' : '#FAF7F0'}
                              strokeWidth={pred.isCorrect ? 1.5 : 3}
                            />
                          );
                        })}
                      </svg>

                      {/* Floating Confusion Matrix Plate */}
                      <div className="absolute top-2 right-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-2 shadow-[2px_2px_0px_#1A1715] font-mono text-[11px]">
                        <span className="font-bold text-[#5C544B] block border-b pb-1 mb-1">
                          CONFUSION MATRIX
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-center font-bold">
                          <div className="p-1 bg-[#33634B]/15 border border-[#33634B]">
                            TP: {evalResult.cm.tp}
                          </div>
                          <div className="p-1 bg-[#C83226]/15 border border-[#C83226]">
                            FP: {evalResult.cm.fp}
                          </div>
                          <div className="p-1 bg-[#C83226]/15 border border-[#C83226]">
                            FN: {evalResult.cm.fn}
                          </div>
                          <div className="p-1 bg-[#33634B]/15 border border-[#33634B]">
                            TN: {evalResult.cm.tn}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scientific Evaluation Metrics */}
                    <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                      <div className="p-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
                        <span className="text-[10px] text-[#5C544B] block">ACCURACY</span>
                        <span className="font-bold text-sm text-[#1A1715] tnum">
                          {evalResult.cm.accuracy}
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
                        <span className="text-[10px] text-[#5C544B] block">PRECISION</span>
                        <span className="font-bold text-sm text-[#1848B8] tnum">
                          {evalResult.cm.precision}
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
                        <span className="text-[10px] text-[#5C544B] block">RECALL</span>
                        <span className="font-bold text-sm text-[#E28C05] tnum">
                          {evalResult.cm.recall}
                        </span>
                      </div>
                      <div className="p-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
                        <span className="text-[10px] text-[#5C544B] block">F1 SCORE</span>
                        <span className="font-bold text-sm text-[#33634B] tnum">
                          {evalResult.cm.f1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </AnalogCard>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <AnalogCard variant="card" headerEyebrow="DECISION THRESHOLD" headerTitle="CLASSIFICATION CUTOFF">
              <AnalogSlider
                label="PROBABILITY THRESHOLD (τ)"
                symbol="τ"
                min={0.1}
                max={0.9}
                step={0.05}
                value={logisticParams.threshold}
                onChange={(val) => setLogisticParams((prev) => ({ ...prev, threshold: Number(val.toFixed(2)) }))}
                helpText="Slide threshold to trade off Precision vs Recall."
              />
              <div className="mt-3">
                <FormulaPlate
                  latex="p = \sigma(\mathbf{w}^T \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}"
                  label="SIGMOID HYPOTHESIS"
                />
              </div>
            </AnalogCard>
          </div>
        </div>
      )}

      {/* TAB 4: Decision Tree Partitions */}
      {activeTab === 'trees' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <AnalogCard
              variant="card"
              headerEyebrow="ORTHOGONAL PARTITIONING"
              headerTitle={`DECISION TREE DEPTH: ${treeMaxDepth}`}
            >
              <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] min-h-[300px]">
                <div className="font-mono text-xs text-[#1A1715] mb-2 font-bold uppercase">
                  RECURSIVE SPLIT HIERARCHY
                </div>
                {treeModel ? (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2 bg-[#E8E1D3] border border-[#1A1715]">
                      <span className="font-bold text-[#1848B8]">ROOT NODE:</span> Split on{' '}
                      <span className="font-bold text-[#C83226]">Feature {treeModel.feature}</span> at threshold{' '}
                      <span className="font-bold text-[#1A1715]">{treeModel.threshold}</span> (Gini: {treeModel.impurity})
                    </div>
                    {treeModel.left && (
                      <div className="pl-6 border-l-2 border-[#1A1715] space-y-1">
                        <div className="p-1.5 bg-[#FAF7F0] border border-[#D8CFC0]">
                          LEFT BRANCH ({treeModel.feature} ≤ {treeModel.threshold}):{' '}
                          {treeModel.left.isLeaf ? (
                            <span className="font-bold text-[#33634B]">
                              LEAF (Class {treeModel.left.prediction}, Samples: {treeModel.left.sampleCount})
                            </span>
                          ) : (
                            <span>Sub-split on {treeModel.left.feature} ≤ {treeModel.left.threshold}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {treeModel.right && (
                      <div className="pl-6 border-l-2 border-[#1A1715] space-y-1">
                        <div className="p-1.5 bg-[#FAF7F0] border border-[#D8CFC0]">
                          RIGHT BRANCH ({treeModel.feature} &gt; {treeModel.threshold}):{' '}
                          {treeModel.right.isLeaf ? (
                            <span className="font-bold text-[#33634B]">
                              LEAF (Class {treeModel.right.prediction}, Samples: {treeModel.right.sampleCount})
                            </span>
                          ) : (
                            <span>Sub-split on {treeModel.right.feature} ≤ {treeModel.right.threshold}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-mono text-xs text-[#948B7D]">Building tree structure...</div>
                )}
              </div>
            </AnalogCard>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <AnalogCard variant="card" headerEyebrow="REGULARIZATION" headerTitle="TREE DEPTH">
              <AnalogSlider
                label="MAXIMUM DEPTH"
                symbol="d"
                min={1}
                max={5}
                step={1}
                value={treeMaxDepth}
                onChange={(val) => setTreeMaxDepth(val)}
                helpText="Deeper trees partition training data perfectly but risk severe overfitting."
              />
              <div className="mt-3">
                <FormulaPlate
                  latex="I_G(p) = 1 - \sum_{i=1}^{J} p_i^2"
                  label="GINI IMPURITY"
                />
              </div>
            </AnalogCard>
          </div>
        </div>
      )}

      {/* TAB 5: PCA & Eigenvector Projection */}
      {activeTab === 'pca' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-3">
            <AnalogCard
              variant="card"
              headerEyebrow="ORTHOGONAL DECOMPOSITION"
              headerTitle="PRINCIPAL AXIS & VARIANCE PROJECTION"
            >
              {(() => {
                const pcaRes = compute2DPCA(pcaPoints);
                const v1 = pcaRes.eigenvectors[0];
                return (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] border-[1.5px] border-[#1A1715] overflow-hidden select-none">
                      <svg viewBox="0 0 600 450" className="w-full h-full">
                        {/* Principal Axis Line */}
                        <line
                          x1={pcaRes.mean.x - v1.x * 250}
                          y1={pcaRes.mean.y - v1.y * 250}
                          x2={pcaRes.mean.x + v1.x * 250}
                          y2={pcaRes.mean.y + v1.y * 250}
                          stroke="#1848B8"
                          strokeWidth={2.5}
                        />

                        {/* Projection residual segments */}
                        {pcaRes.projections.map((proj) => (
                          <line
                            key={`proj-${proj.id}`}
                            x1={proj.original.x}
                            y1={proj.original.y}
                            x2={proj.projected.x}
                            y2={proj.projected.y}
                            stroke="#C83226"
                            strokeWidth={1}
                            strokeDasharray="2 2"
                          />
                        ))}

                        {/* Original points */}
                        {pcaPoints.map((p) => (
                          <circle
                            key={p.id}
                            cx={p.x}
                            cy={p.y}
                            r={4}
                            fill="#1A1715"
                            stroke="#FAF7F0"
                            strokeWidth={1}
                          />
                        ))}

                        {/* Projected points on principal axis */}
                        {pcaRes.projections.map((proj) => (
                          <circle
                            key={`dot-${proj.id}`}
                            cx={proj.projected.x}
                            cy={proj.projected.y}
                            r={3.5}
                            fill="#1848B8"
                          />
                        ))}
                      </svg>

                      {/* HUD */}
                      <div className="absolute top-2 right-2 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-2.5 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-[#5C544B]">EXPLAINED VAR (PC1):</span>
                          <span className="font-bold text-[#1848B8] tnum">
                            {(v1.varianceRatio * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#5C544B]">RECONSTRUCTION ERROR:</span>
                          <span className="font-bold text-[#C83226] tnum">
                            {pcaRes.totalReconstructionError}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </AnalogCard>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <AnalogCard variant="card" headerEyebrow="MATHEMATICAL DERIVATION" headerTitle="COVARIANCE EIGENVALUES">
              <FormulaPlate
                latex="\mathbf{C} = \frac{1}{m-1} \mathbf{X}_c^T \mathbf{X}_c, \quad \mathbf{C} \mathbf{v}_1 = \lambda_1 \mathbf{v}_1"
                label="SPECTRAL DECOMPOSITION"
              />
              <p className="font-mono text-xs text-[#5C544B] mt-2 leading-relaxed">
                The blue line is the first principal component vector v₁. Red dotted lines show the orthogonal projection error discarded when compressing to 1D.
              </p>
            </AnalogCard>
          </div>
        </div>
      )}
    </div>
  );
};
