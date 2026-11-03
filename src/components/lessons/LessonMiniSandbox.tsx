'use client';

import React, { useState } from 'react';
import { AnalogSlider } from '@/components/ui/AnalogSlider';
import { Badge } from '@/components/ui/Badge';
import { GlyphPoint } from '@/components/ui/GlyphPoint';

interface LessonMiniSandboxProps {
  algorithmId: string;
}

export const LessonMiniSandbox: React.FC<LessonMiniSandboxProps> = ({ algorithmId }) => {
  // Stage 01: ML Foundations State
  const [selectedParadigm, setSelectedParadigm] = useState<'supervised' | 'unsupervised' | 'reinforcement'>('supervised');

  // Stage 02: Data Literacy State
  const [scalingMode, setScalingMode] = useState<'raw' | 'standard' | 'minmax'>('raw');

  // Stage 03: Math for ML State
  const [vectorAngle, setVectorAngle] = useState<number>(45);

  // Stage 04: The Learning Problem State
  const [polyDegree, setPolyDegree] = useState<number>(3);

  // Stage 05: Linear Regression State
  const [lrSlope, setLrSlope] = useState<number>(1.2);
  const [lrIntercept, setLrIntercept] = useState<number>(30);

  // Stage 06: Gradient Descent State
  const [lrRate, setLrRate] = useState<number>(0.15);

  // Stage 07: Logistic Regression State
  const [logitThreshold, setLogitThreshold] = useState<number>(0.5);

  // Stage 08: Decision Trees State
  const [treeThreshold, setTreeThreshold] = useState<number>(50);

  // Stage 09: K-Means Centroid State
  const [c1, setC1] = useState<{ x: number; y: number }>({ x: 140, y: 120 });
  const [c2, setC2] = useState<{ x: number; y: number }>({ x: 280, y: 160 });

  // Stage 10: PCA State
  const [pcaAngle, setPcaAngle] = useState<number>(35);

  // Stage 11: Model Evaluation State
  const [evalThreshold, setEvalThreshold] = useState<number>(0.5);

  // Stage 12: Model Comparison State
  const [comparisonDataset, setComparisonDataset] = useState<'concentric' | 'elongated' | 'blobs'>('concentric');

  // -------------------------------------------------------------
  // STAGE 01: ML FOUNDATIONS SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'ml-foundations') {
    const paradigmInfo = {
      supervised: {
        title: 'SUPERVISED LEARNING',
        badge: 'LABELED DATA {(xᵢ, yᵢ)}',
        color: '#1848B8',
        tag: 'PREDICTION & MAPPING',
        tasks: ['Continuous Regression (Housing prices, temperature)', 'Discrete Classification (Spam vs Ham, disease diagnosis)'],
        equation: 'y = f(x; θ) + ε',
        description: 'Every training observation possesses a ground-truth supervisory label y. The algorithm learns a functional mapping f(x) minimizing discrepancy with ground truth.',
      },
      unsupervised: {
        title: 'UNSUPERVISED LEARNING',
        badge: 'UNLABELED OBSERVATIONS {xᵢ}',
        color: '#E28C05',
        tag: 'STRUCTURE DISCOVERY',
        tasks: ['Clustering (Customer segmentation, anomaly detection)', 'Dimensionality Reduction (PCA, latent manifolds)'],
        equation: 'Structure = argmin J(C, μ)',
        description: 'No teacher signal or target labels exist. The algorithm uncovers intrinsic geometric manifolds, cluster densities, or orthogonal axes of maximum variance.',
      },
      reinforcement: {
        title: 'REINFORCEMENT LEARNING',
        badge: 'POLICY & REWARDS {s, a, r, s′}',
        color: '#33634B',
        tag: 'SEQUENTIAL DECISIONS',
        tasks: ['Robotics locomotion & drone control', 'Game playing (AlphaGo, Chess)', 'LLM RLHF alignment'],
        equation: 'Q(s, a) = r + γ max Q(s′, a′)',
        description: 'An agent takes actions in a dynamic environment, receiving delayed numerical scalar rewards. It learns an optimal behavioral policy maximizing expected cumulative discounted return.',
      },
    };

    const activeInfo = paradigmInfo[selectedParadigm];

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            INTERACTIVE TAXONOMY EXPLORER // THE 3 PARADIGMS
          </span>
          <Badge variant="dark">{activeInfo.tag}</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['supervised', 'unsupervised', 'reinforcement'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedParadigm(p)}
              className={`px-3 py-1 border-[1.5px] border-[#1A1715] font-bold uppercase transition-all ${
                selectedParadigm === p
                  ? 'bg-[#1848B8] text-white shadow-[1.5px_1.5px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#E8E1D3]'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="p-3 bg-[#E8E1D3] border border-[#1A1715] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#1A1715]">{activeInfo.title}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF7F0] border border-[#1A1715] text-[#C83226]">
              {activeInfo.badge}
            </span>
          </div>
          <p className="text-[#1A1715] leading-relaxed text-[11px]">{activeInfo.description}</p>
          <div className="pt-2 border-t border-[#D8CFC0] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5C544B]">CANONICAL USE CASES:</span>
            {activeInfo.tasks.map((t, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#1A1715]">
                <span className="text-[#1848B8] font-bold">›</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 02: DATA LITERACY & FEATURE SCALING SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'data-literacy') {
    // Two raw observations: Point A(1, 100) vs Point B(2, 1000)
    // Feature 1 is Salary / Feature 2 is Age or Income
    const p1Raw = { x: 2, y: 12000 };
    const p2Raw = { x: 5, y: 85000 };

    const rawDx = p2Raw.x - p1Raw.x;
    const rawDy = p2Raw.y - p1Raw.y;
    const rawDist = Math.hypot(rawDx, rawDy);
    const f1RawShare = ((rawDx * rawDx) / (rawDist * rawDist)) * 100;
    const f2RawShare = ((rawDy * rawDy) / (rawDist * rawDist)) * 100;

    // Standardized (z-score assuming μ=[3.5, 48500], σ=[1.5, 36500])
    const p1Std = { x: (2 - 3.5) / 1.5, y: (12000 - 48500) / 36500 };
    const p2Std = { x: (5 - 3.5) / 1.5, y: (85000 - 48500) / 36500 };
    const stdDist = Math.hypot(p2Std.x - p1Std.x, p2Std.y - p1Std.y);
    const f1StdShare = (Math.pow(p2Std.x - p1Std.x, 2) / (stdDist * stdDist)) * 100;
    const f2StdShare = (Math.pow(p2Std.y - p1Std.y, 2) / (stdDist * stdDist)) * 100;

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            LIVE SCALE DISTORTION SIMULATOR // WHY SCALING MATTERS
          </span>
          <Badge variant={scalingMode === 'raw' ? 'vermilion' : 'sage'}>
            {scalingMode === 'raw' ? 'SCALE SKEWED' : 'BALANCED METRIC'}
          </Badge>
        </div>
        <p className="text-[#5C544B]">
          Compare two observations where Feature 1 is Age (2 to 5 years experience) and Feature 2 is Annual Income ($12,000 to $85,000).
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setScalingMode('raw')}
            className={`px-3 py-1 border-[1.5px] border-[#1A1715] font-bold ${
              scalingMode === 'raw' ? 'bg-[#C83226] text-white' : 'bg-[#FAF7F0]'
            }`}
          >
            RAW (UNSCALED)
          </button>
          <button
            onClick={() => setScalingMode('standard')}
            className={`px-3 py-1 border-[1.5px] border-[#1A1715] font-bold ${
              scalingMode === 'standard' ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
            }`}
          >
            STANDARD SCALER (Z-SCORE)
          </button>
        </div>

        <div className="p-3 bg-[#E8E1D3] border border-[#1A1715] space-y-2">
          <div className="flex justify-between">
            <span className="text-[#5C544B]">FEATURE 1 (EXPERIENCE) CONTRIBUTION:</span>
            <span className="font-bold text-[#1A1715]">{scalingMode === 'raw' ? f1RawShare.toFixed(4) : f1StdShare.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5C544B]">FEATURE 2 (INCOME) CONTRIBUTION:</span>
            <span className="font-bold text-[#C83226]">{scalingMode === 'raw' ? f2RawShare.toFixed(4) : f2StdShare.toFixed(1)}%</span>
          </div>
          <p className="text-[11px] text-[#1A1715] pt-1 border-t border-[#D8CFC0] leading-relaxed">
            {scalingMode === 'raw'
              ? 'WARNING: Feature 2 (Income) contributes 99.9998% to the Euclidean distance. The distance algorithm completely ignores Experience.'
              : 'VERIFIED: Both features now contribute symmetrically (50/50 balance) to distance calculations.'}
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 03: MATHEMATICS FOR ML SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'math-for-ml') {
    const rad = (vectorAngle * Math.PI) / 180;
    const dotProduct = Math.cos(rad).toFixed(3);
    const isOrthogonal = vectorAngle === 90;

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            VECTOR GEOMETRY // DOT PRODUCT & ORTHOGONALITY
          </span>
          <Badge variant={isOrthogonal ? 'sage' : 'ultramarine'}>
            {isOrthogonal ? 'ORTHOGONAL (u ⊥ v)' : `DOT PRODUCT = ${dotProduct}`}
          </Badge>
        </div>
        <p className="text-[#5C544B]">
          Rotate vector v relative to fixed unit vector u = [1, 0]. The dot product u · v = ||u|| ||v|| cos(θ) directly determines geometric alignment.
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="ANGLE (θ)"
            min={0}
            max={180}
            step={5}
            value={vectorAngle}
            onChange={setVectorAngle}
            unit="°"
          />
        </div>

        <div className="relative w-full h-44 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 180" className="w-full h-full">
            <line x1="20" y1="140" x2="360" y2="140" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="190" y1="20" x2="190" y2="170" stroke="#D8CFC0" strokeWidth="1" />

            {/* Base Vector u (horizontal) */}
            <line x1="190" y1="140" x2="310" y2="140" stroke="#1848B8" strokeWidth="3" />
            <polygon points="315,140 305,135 305,145" fill="#1848B8" />
            <text x="320" y="145" className="font-bold fill-[#1848B8]">u</text>

            {/* Rotating Vector v */}
            <line
              x1="190"
              y1="140"
              x2={190 + Math.cos(rad) * 120}
              y2={140 - Math.sin(rad) * 120}
              stroke="#C83226"
              strokeWidth="3"
            />
            <circle cx={190 + Math.cos(rad) * 120} cy={140 - Math.sin(rad) * 120} r="4" fill="#C83226" />
            <text x={190 + Math.cos(rad) * 120 + 8} y={140 - Math.sin(rad) * 120} className="font-bold fill-[#C83226]">
              v
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 04: THE LEARNING PROBLEM SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'learning-problem') {
    const isUnderfitting = polyDegree === 1;
    const isOptimal = polyDegree >= 2 && polyDegree <= 4;
    const isOverfitting = polyDegree >= 5;

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            BIAS-VARIANCE TRADEOFF // MODEL COMPLEXITY
          </span>
          <Badge variant={isOptimal ? 'sage' : isUnderfitting ? 'amber' : 'vermilion'}>
            {isUnderfitting ? 'HIGH BIAS (UNDERFITTING)' : isOptimal ? 'OPTIMAL SWEET SPOT' : 'HIGH VARIANCE (OVERFITTING)'}
          </Badge>
        </div>
        <p className="text-[#5C544B]">
          Adjust the hypothesis polynomial degree d. Notice how a degree-1 line fails to capture the true underlying curve (High Bias), while degree-7 wildly oscillates to memorize noisy points (High Variance).
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="POLYNOMIAL DEGREE (d)"
            min={1}
            max={7}
            step={1}
            value={polyDegree}
            onChange={setPolyDegree}
            unit=""
          />
        </div>

        <div className="relative w-full h-44 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 180" className="w-full h-full">
            {/* Axis */}
            <line x1="20" y1="160" x2="360" y2="160" stroke="#1A1715" strokeWidth="1.5" />
            {/* Synthetic noisy points */}
            {[
              { x: 50, y: 130 },
              { x: 100, y: 70 },
              { x: 160, y: 55 },
              { x: 220, y: 90 },
              { x: 290, y: 140 },
              { x: 330, y: 80 },
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1A1715" />
            ))}

            {/* Model curve based on degree */}
            {polyDegree === 1 && (
              <line x1="40" y1="95" x2="340" y2="95" stroke="#E28C05" strokeWidth="3" />
            )}
            {polyDegree >= 2 && polyDegree <= 4 && (
              <path d="M 40 140 Q 180 20 340 120" fill="none" stroke="#33634B" strokeWidth="3" />
            )}
            {polyDegree >= 5 && (
              <path
                d="M 40 150 Q 80 40 100 70 T 160 55 T 220 90 T 290 140 T 340 50"
                fill="none"
                stroke="#C83226"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
            )}
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 05: LINEAR REGRESSION SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'linear-regression') {
    const pts = [
      { x: 40, y: 80 },
      { x: 90, y: 110 },
      { x: 140, y: 170 },
      { x: 200, y: 190 },
      { x: 260, y: 250 },
      { x: 320, y: 280 },
    ];

    let totalSqError = 0;
    const residuals = pts.map((p) => {
      const predY = lrSlope * p.x + lrIntercept;
      const res = p.y - predY;
      totalSqError += res * res;
      return { ...p, predY, res };
    });
    const mse = Math.round(totalSqError / pts.length);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            LIVE RESIDUAL SIMULATOR // ORDINARY LEAST SQUARES
          </span>
          <Badge variant={mse < 300 ? 'sage' : 'vermilion'}>MSE: {mse}</Badge>
        </div>
        <p className="text-[#5C544B]">
          Adjust slope w₁ and intercept w₀. Notice the vertical red lines representing error residuals (yᵢ - ŷᵢ). OLS mathematically minimizes the sum of these squared lengths.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnalogSlider
            label="SLOPE (w₁)"
            min={-0.5}
            max={2.5}
            step={0.05}
            value={lrSlope}
            onChange={setLrSlope}
            unit=""
          />
          <AnalogSlider
            label="INTERCEPT (w₀)"
            min={-40}
            max={100}
            step={2}
            value={lrIntercept}
            onChange={setLrIntercept}
            unit="px"
          />
        </div>

        <div className="relative w-full h-48 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 320" className="w-full h-full">
            <line x1="20" y1="300" x2="360" y2="300" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2="300" stroke="#1A1715" strokeWidth="1.5" />

            <line
              x1="20"
              y1={300 - (lrSlope * 20 + lrIntercept)}
              x2="360"
              y2={300 - (lrSlope * 360 + lrIntercept)}
              stroke="#1848B8"
              strokeWidth="2.5"
            />

            {residuals.map((r, i) => (
              <g key={i}>
                <line
                  x1={r.x}
                  y1={300 - r.y}
                  x2={r.x}
                  y2={300 - r.predY}
                  stroke="#C83226"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
                <circle cx={r.x} cy={300 - r.y} r="5" fill="#1A1715" stroke="#FAF7F0" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 06: GRADIENT DESCENT SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'gradient-descent') {
    let w = 20;
    const trajectory = [w];
    for (let i = 0; i < 6; i++) {
      const grad = 0.1 * (w - 100);
      w = w - lrRate * grad * 40;
      trajectory.push(w);
    }

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            FIRST-ORDER STEP SIMULATOR // LEARNING RATE DYNAMICS
          </span>
          <Badge variant={lrRate > 0.45 ? 'vermilion' : lrRate < 0.08 ? 'amber' : 'sage'}>
            {lrRate > 0.45 ? 'DIVERGENCE' : lrRate < 0.08 ? 'UNDERDAMPED' : 'CONVERGING'}
          </Badge>
        </div>
        <p className="text-[#5C544B]">
          Drag the learning rate (α) potentiometer. If α is too high, steps wildly overshoot the minimum and diverge. If too low, progress stalls.
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="LEARNING RATE (α)"
            min={0.02}
            max={0.55}
            step={0.02}
            value={lrRate}
            onChange={setLrRate}
            unit=""
          />
        </div>

        <div className="relative w-full h-48 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 200" className="w-full h-full">
            <path d="M 20 180 Q 190 20 360 180" fill="none" stroke="#1A1715" strokeWidth="2" />
            {trajectory.slice(0, 5).map((pos, idx) => {
              const svgX = Math.max(30, Math.min(350, 190 + (pos - 100) * 1.6));
              const svgY = 40 + Math.pow((svgX - 190) / 10, 2) * 0.8;
              const nextPos = trajectory[idx + 1];
              const nextSvgX = nextPos !== undefined ? Math.max(30, Math.min(350, 190 + (nextPos - 100) * 1.6)) : svgX;
              const nextSvgY = 40 + Math.pow((nextSvgX - 190) / 10, 2) * 0.8;

              return (
                <g key={idx}>
                  {idx < 4 && (
                    <line
                      x1={svgX}
                      y1={svgY}
                      x2={nextSvgX}
                      y2={nextSvgY}
                      stroke="#C83226"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                  )}
                  <circle cx={svgX} cy={svgY} r="5" fill="#1848B8" stroke="#1A1715" strokeWidth="1.5" />
                  <text x={svgX + 7} y={svgY - 5} className="font-bold fill-[#1A1715] text-[9px]">
                    w({idx})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 07: LOGISTIC REGRESSION SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'logistic-regression') {
    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            SIGMOID THRESHOLD CONTROLLER // P(y=1|x)
          </span>
          <Badge variant="ultramarine">THRESHOLD: {logitThreshold.toFixed(2)}</Badge>
        </div>
        <p className="text-[#5C544B]">
          Adjust decision threshold τ. When probability P(ŷ = 1 | x) ≥ τ, the observation is classified as Positive (Class 1). Shifting τ trades Precision against Recall.
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="DECISION THRESHOLD (τ)"
            min={0.1}
            max={0.9}
            step={0.05}
            value={logitThreshold}
            onChange={setLogitThreshold}
            unit=""
          />
        </div>

        <div className="relative w-full h-44 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 200" className="w-full h-full">
            <line
              x1="30"
              y1={170 - logitThreshold * 140}
              x2="350"
              y2={170 - logitThreshold * 140}
              stroke="#C83226"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <path d="M 30 165 C 150 165, 170 35, 350 35" fill="none" stroke="#1848B8" strokeWidth="3" />
            <text x="35" y={162 - logitThreshold * 140} className="font-bold fill-[#C83226] text-[10px]">
              τ = {logitThreshold.toFixed(2)}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 08: DECISION TREES SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'decision-trees') {
    const points = [
      { x: 15, cls: 0 },
      { x: 25, cls: 0 },
      { x: 35, cls: 0 },
      { x: 42, cls: 1 },
      { x: 48, cls: 0 },
      { x: 55, cls: 1 },
      { x: 65, cls: 1 },
      { x: 75, cls: 1 },
      { x: 85, cls: 1 },
    ];
    const left = points.filter((p) => p.x <= treeThreshold);
    const right = points.filter((p) => p.x > treeThreshold);

    const calcGini = (subset: typeof points) => {
      if (subset.length === 0) return 0;
      const p1 = subset.filter((p) => p.cls === 1).length / subset.length;
      const p0 = 1 - p1;
      return +(1 - (p1 * p1 + p0 * p0)).toFixed(3);
    };

    const leftGini = calcGini(left);
    const rightGini = calcGini(right);
    const weightedGini = +(
      (left.length / points.length) * leftGini +
      (right.length / points.length) * rightGini
    ).toFixed(3);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            ORTHOGONAL SPLIT FINDER // GINI IMPURITY MINIMIZER
          </span>
          <Badge variant={weightedGini <= 0.15 ? 'sage' : 'amber'}>WEIGHTED GINI: {weightedGini}</Badge>
        </div>
        <p className="text-[#5C544B]">
          Slide split cut x = t. The algorithm sweeps candidate split thresholds to find the boundary producing maximum impurity reduction (minimum weighted Gini).
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="SPLIT CUT-OFF THRESHOLD (t)"
            min={20}
            max={80}
            step={2}
            value={treeThreshold}
            onChange={setTreeThreshold}
            unit=""
          />
        </div>

        <div className="relative w-full h-40 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 160" className="w-full h-full">
            <line x1="20" y1="100" x2="360" y2="100" stroke="#1A1715" strokeWidth="1.5" />
            <line
              x1={20 + treeThreshold * 3.4}
              y1="20"
              x2={20 + treeThreshold * 3.4}
              y2="140"
              stroke="#C83226"
              strokeWidth="2.5"
            />
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={20 + p.x * 3.4}
                cy="100"
                r="7"
                fill={p.cls === 1 ? '#1848B8' : '#E28C05'}
                stroke="#1A1715"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 09: K-MEANS SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'kmeans') {
    const pts = [
      { id: '1', x: 80, y: 70 },
      { id: '2', x: 110, y: 90 },
      { id: '3', x: 130, y: 120 },
      { id: '4', x: 90, y: 140 },
      { id: '5', x: 260, y: 180 },
      { id: '6', x: 290, y: 150 },
      { id: '7', x: 310, y: 200 },
      { id: '8', x: 270, y: 220 },
    ];

    const getAssigned = (p: { x: number; y: number }) => {
      const d1 = Math.hypot(p.x - c1.x, p.y - c1.y);
      const d2 = Math.hypot(p.x - c2.x, p.y - c2.y);
      return d1 <= d2 ? 0 : 1;
    };

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            LIVE VORONOI PARTITION DYNAMICS // LLOYD STEP PREVIEW
          </span>
          <Badge variant="ultramarine">2 CENTROIDS</Badge>
        </div>
        <p className="text-[#5C544B]">
          Click inside the canvas to reposition Centroid μ₁ (Ultramarine) or μ₂ (Amber). Observations flip Voronoi cell ownership based on Euclidean distance.
        </p>

        <div className="relative w-full h-48 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full cursor-crosshair select-none"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = ((e.clientX - rect.left) / rect.width) * 400;
              const clickY = ((e.clientY - rect.top) / rect.height) * 240;
              const d1 = Math.hypot(clickX - c1.x, clickY - c1.y);
              const d2 = Math.hypot(clickX - c2.x, clickY - c2.y);
              if (d1 < d2) {
                setC1({ x: Math.round(clickX), y: Math.round(clickY) });
              } else {
                setC2({ x: Math.round(clickX), y: Math.round(clickY) });
              }
            }}
          >
            <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="#948B7D" strokeWidth="1" strokeDasharray="3 3" />
            {pts.map((p) => {
              const cluster = getAssigned(p);
              const targetCentroid = cluster === 0 ? c1 : c2;
              return (
                <g key={p.id}>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={targetCentroid.x}
                    y2={targetCentroid.y}
                    stroke={cluster === 0 ? '#1848B8' : '#E28C05'}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                  <GlyphPoint x={p.x} y={p.y} cluster={cluster} size={8} />
                </g>
              );
            })}
            <g transform={`translate(${c1.x}, ${c1.y})`}>
              <circle r="9" fill="#1848B8" stroke="#1A1715" strokeWidth="1.5" />
              <circle r="3" fill="#FFFFFF" />
              <text x="12" y="4" className="font-bold fill-[#1848B8] text-[9px]">μ₁</text>
            </g>
            <g transform={`translate(${c2.x}, ${c2.y})`}>
              <circle r="9" fill="#E28C05" stroke="#1A1715" strokeWidth="1.5" />
              <circle r="3" fill="#FFFFFF" />
              <text x="12" y="4" className="font-bold fill-[#E28C05] text-[9px]">μ₂</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 10: PCA SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'pca') {
    const rad = (pcaAngle * Math.PI) / 180;
    const varianceRatio = Math.round(Math.abs(Math.cos(rad - 0.6)) * 88 + 10);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            ROTATIONAL PROJECTION AXIS // FIRST PRINCIPAL COMPONENT
          </span>
          <Badge variant={varianceRatio > 85 ? 'sage' : 'amber'}>EXPLAINED: {varianceRatio}%</Badge>
        </div>
        <p className="text-[#5C544B]">
          Rotate candidate projection axis v₁. The First Principal Component is mathematically defined as the unit vector maximizing variance of projected coordinates.
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="PROJECTION ANGLE (θ)"
            min={0}
            max={180}
            step={5}
            value={pcaAngle}
            onChange={setPcaAngle}
            unit="°"
          />
        </div>

        <div className="relative w-full h-44 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 180" className="w-full h-full">
            <line x1="190" y1="10" x2="190" y2="170" stroke="#D8CFC0" strokeWidth="1" />
            <line x1="20" y1="90" x2="360" y2="90" stroke="#D8CFC0" strokeWidth="1" />
            <line
              x1={190 - Math.cos(rad) * 140}
              y1={90 + Math.sin(rad) * 140}
              x2={190 + Math.cos(rad) * 140}
              y2={90 - Math.sin(rad) * 140}
              stroke="#1848B8"
              strokeWidth="2.5"
            />
            <circle cx="190" cy="90" r="4" fill="#C83226" />
          </svg>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 11: MODEL EVALUATION & GENERALIZATION SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'model-evaluation') {
    // 100 validation samples: 20 positive, 80 negative
    // Threshold moves between 0.1 and 0.9
    const tp = Math.round(20 * (1 - evalThreshold * 0.7));
    const fn = 20 - tp;
    const fp = Math.round(80 * Math.max(0, 0.6 - evalThreshold * 0.6));
    const tn = 80 - fp;

    const precision = tp + fp > 0 ? (tp / (tp + fp)).toFixed(2) : '1.00';
    const recall = tp + fn > 0 ? (tp / (tp + fn)).toFixed(2) : '0.00';
    const f1 = +(2 * (Number(precision) * Number(recall)) / (Number(precision) + Number(recall) || 1)).toFixed(2);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            PRECISION-RECALL BALANCER // VALIDATION CONFUSION MATRIX
          </span>
          <Badge variant="ultramarine">F1 SCORE: {f1}</Badge>
        </div>
        <p className="text-[#5C544B]">
          Adjust decision threshold τ to inspect how the confusion matrix shifts between False Positives and False Negatives.
        </p>

        <div className="max-w-xs">
          <AnalogSlider
            label="THRESHOLD (τ)"
            min={0.1}
            max={0.9}
            step={0.05}
            value={evalThreshold}
            onChange={setEvalThreshold}
            unit=""
          />
        </div>

        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#E8E1D3] border border-[#1A1715]">
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[10px] text-[#5C544B] block">TRUE POSITIVES (TP)</span>
            <span className="font-bold text-sm text-[#33634B]">{tp}</span>
          </div>
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[10px] text-[#5C544B] block">FALSE POSITIVES (FP)</span>
            <span className="font-bold text-sm text-[#C83226]">{fp}</span>
          </div>
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[10px] text-[#5C544B] block">FALSE NEGATIVES (FN)</span>
            <span className="font-bold text-sm text-[#C83226]">{fn}</span>
          </div>
          <div className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
            <span className="text-[10px] text-[#5C544B] block">TRUE NEGATIVES (TN)</span>
            <span className="font-bold text-sm text-[#1848B8]">{tn}</span>
          </div>
        </div>

        <div className="flex justify-between text-[11px] pt-1">
          <span>PRECISION: <strong>{precision}</strong></span>
          <span>RECALL: <strong>{recall}</strong></span>
          <span>F1: <strong>{f1}</strong></span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STAGE 12: MODEL COMPARISON & SCIENTIFIC EXPERIMENTATION SANDBOX
  // -------------------------------------------------------------
  if (algorithmId === 'model-comparison') {
    const comparisonResults = {
      concentric: {
        kmeans: { sil: 0.08, pass: false, desc: 'Slices concentric rings with straight Voronoi lines.' },
        dbscan: { sil: 0.72, pass: true, desc: 'Density connectivity follows non-convex circular rings perfectly.' },
        agg: { sil: 0.12, pass: false, desc: 'Ward variance linkage merges parts of both circles.' },
      },
      elongated: {
        kmeans: { sil: 0.31, pass: false, desc: 'Chops parallel bands into orthogonal circular blobs.' },
        dbscan: { sil: 0.68, pass: true, desc: 'Follows contiguous linear density chains.' },
        agg: { sil: 0.54, pass: true, desc: 'Single-linkage preserves chaining geometry.' },
      },
      blobs: {
        kmeans: { sil: 0.84, pass: true, desc: 'Ideal isotropic spherical clusters; converges rapidly.' },
        dbscan: { sil: 0.79, pass: true, desc: 'Finds core clusters but sensitive to epsilon parameter.' },
        agg: { sil: 0.82, pass: true, desc: 'Hierarchical merge matches true spatial variance.' },
      },
    };

    const res = comparisonResults[comparisonDataset];

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-bold uppercase text-[#C83226]">
            MULTI-MODEL BENCHMARK // INDUCTIVE BIAS MATRIX
          </span>
          <Badge variant="amber">3 ALGORITHMS</Badge>
        </div>

        <div className="flex gap-2">
          {(['concentric', 'elongated', 'blobs'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setComparisonDataset(g)}
              className={`px-2.5 py-1 border-[1.5px] border-[#1A1715] font-bold uppercase text-[10px] ${
                comparisonDataset === g ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2.5 bg-[#E8E1D3] border border-[#1A1715] space-y-1">
            <span className="font-bold text-[#1A1715] block">K-MEANS</span>
            <Badge variant={res.kmeans.pass ? 'sage' : 'vermilion'}>SIL: {res.kmeans.sil}</Badge>
            <p className="text-[10px] text-[#5C544B] leading-tight pt-1">{res.kmeans.desc}</p>
          </div>
          <div className="p-2.5 bg-[#E8E1D3] border border-[#1A1715] space-y-1">
            <span className="font-bold text-[#1848B8] block">DBSCAN</span>
            <Badge variant={res.dbscan.pass ? 'sage' : 'vermilion'}>SIL: {res.dbscan.sil}</Badge>
            <p className="text-[10px] text-[#5C544B] leading-tight pt-1">{res.dbscan.desc}</p>
          </div>
          <div className="p-2.5 bg-[#E8E1D3] border border-[#1A1715] space-y-1">
            <span className="font-bold text-[#33634B] block">AGGLOMERATIVE</span>
            <Badge variant={res.agg.pass ? 'sage' : 'vermilion'}>SIL: {res.agg.sil}</Badge>
            <p className="text-[10px] text-[#5C544B] leading-tight pt-1">{res.agg.desc}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
