'use client';

import React, { useState } from 'react';
import { AnalogSlider } from '@/components/ui/AnalogSlider';
import { Badge } from '@/components/ui/Badge';
import { GlyphPoint } from '@/components/ui/GlyphPoint';

interface LessonMiniSandboxProps {
  algorithmId: string;
}

export const LessonMiniSandbox: React.FC<LessonMiniSandboxProps> = ({ algorithmId }) => {
  // Linear Regression Mini-Sandbox State
  const [lrSlope, setLrSlope] = useState<number>(1.2);
  const [lrIntercept, setLrIntercept] = useState<number>(30);

  // Gradient Descent Mini-Sandbox State
  const [lrRate, setLrRate] = useState<number>(0.15);
  const [gdStep, setGdStep] = useState<number>(1);

  // Logistic Regression Mini-Sandbox State
  const [logitThreshold, setLogitThreshold] = useState<number>(0.5);

  // Decision Tree Mini-Sandbox State
  const [treeThreshold, setTreeThreshold] = useState<number>(50);

  // PCA Mini-Sandbox State
  const [pcaAngle, setPcaAngle] = useState<number>(35);

  // K-Means Draggable Centroid Mini-Sandbox State
  const [c1, setC1] = useState<{ x: number; y: number }>({ x: 140, y: 120 });
  const [c2, setC2] = useState<{ x: number; y: number }>({ x: 280, y: 160 });

  // Render K-Means Sandbox
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
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            LIVE INTERACTIVE PREVIEW // VORONOI PARTITION DYNAMICS
          </span>
          <Badge variant="ultramarine">2 CENTROIDS</Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Drag or click inside the frame to reposition Centroid $\mu_1$ (Ultramarine) or $\mu_2$ (Amber). Watch observations instantaneously flip Voronoi cell ownership based on Euclidean distance.
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => { setC1({ x: 100, y: 100 }); setC2({ x: 280, y: 180 }); }}
            className="font-mono text-[10px] px-2 py-1 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3]"
          >
            PRESET: BALANCED
          </button>
          <button
            onClick={() => { setC1({ x: 180, y: 150 }); setC2({ x: 200, y: 150 }); }}
            className="font-mono text-[10px] px-2 py-1 bg-[#FAF7F0] border border-[#1A1715] hover:bg-[#E8E1D3]"
          >
            PRESET: COLLAPSED CENTERS
          </button>
        </div>

        <div className="relative w-full h-56 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
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
            {/* Grid pattern */}
            <defs>
              <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D8CFC0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="240" fill="url(#miniGrid)" />

            {/* Connecting line between centroids */}
            <line
              x1={c1.x}
              y1={c1.y}
              x2={c2.x}
              y2={c2.y}
              stroke="#948B7D"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Points with membership lines */}
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

            {/* Centroid 1 Disc */}
            <g transform={`translate(${c1.x}, ${c1.y})`}>
              <circle r="9" fill="#1848B8" stroke="#1A1715" strokeWidth="1.5" />
              <circle r="3" fill="#FFFFFF" />
              <text x="12" y="4" className="font-mono text-[9px] font-bold fill-[#1848B8]">μ₁</text>
            </g>

            {/* Centroid 2 Disc */}
            <g transform={`translate(${c2.x}, ${c2.y})`}>
              <circle r="9" fill="#E28C05" stroke="#1A1715" strokeWidth="1.5" />
              <circle r="3" fill="#FFFFFF" />
              <text x="12" y="4" className="font-mono text-[9px] font-bold fill-[#E28C05]">μ₂</text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  // Render Linear Regression Mini-Sandbox
  if (algorithmId === 'linear-regression') {
    const pts = [
      { x: 40, y: 80 },
      { x: 90, y: 110 },
      { x: 140, y: 170 },
      { x: 200, y: 190 },
      { x: 260, y: 250 },
      { x: 320, y: 280 },
    ];

    // Compute residuals
    let totalSqError = 0;
    const residuals = pts.map((p) => {
      const predY = lrSlope * p.x + lrIntercept;
      const res = p.y - predY;
      totalSqError += res * res;
      return { ...p, predY, res };
    });
    const mse = Math.round(totalSqError / pts.length);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            LIVE RESIDUAL SIMULATOR // ORDINARY LEAST SQUARES
          </span>
          <Badge variant={mse < 300 ? 'sage' : 'vermilion'}>MSE: {mse}</Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Adjust the slope (w₁) and intercept (w₀). Notice the vertical red lines representing error residuals (yᵢ - ŷᵢ). OLS mathematically minimizes the sum of these squared lengths.
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

        <div className="relative w-full h-56 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 320" className="w-full h-full">
            {/* Coordinates axes */}
            <line x1="20" y1="300" x2="360" y2="300" stroke="#1A1715" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2="300" stroke="#1A1715" strokeWidth="1.5" />

            {/* Regression line */}
            <line
              x1="20"
              y1={300 - (lrSlope * 20 + lrIntercept)}
              x2="360"
              y2={300 - (lrSlope * 360 + lrIntercept)}
              stroke="#1848B8"
              strokeWidth="2.5"
            />

            {/* Residual error sticks */}
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

  // Render Gradient Descent Mini-Sandbox
  if (algorithmId === 'gradient-descent') {
    // Loss function f(w) = 0.05 * (w - 100)^2
    // Derivative f'(w) = 0.1 * (w - 100)
    let w = 20;
    const trajectory = [w];
    for (let i = 0; i < 6; i++) {
      const grad = 0.1 * (w - 100);
      w = w - lrRate * grad * 40;
      trajectory.push(w);
    }

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            FIRST-ORDER STEP SIMULATOR // LEARNING RATE DYNAMICS
          </span>
          <Badge variant={lrRate > 0.45 ? 'vermilion' : lrRate < 0.08 ? 'amber' : 'sage'}>
            {lrRate > 0.45 ? 'DIVERGENCE' : lrRate < 0.08 ? 'UNDERDAMPED' : 'CONVERGING'}
          </Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Drag the learning rate ($\alpha$) potentiometer. If $\alpha$ is too high, steps wildly overshoot the minimum and diverge. If too low, progress stalls.
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

        <div className="relative w-full h-56 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 200" className="w-full h-full">
            {/* Parabolic Loss Curve */}
            <path
              d="M 20 180 Q 190 20 360 180"
              fill="none"
              stroke="#1A1715"
              strokeWidth="2"
            />
            {/* Trajectory dots & lines */}
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
                  <text x={svgX + 7} y={svgY - 5} className="font-mono text-[9px] font-bold fill-[#1A1715]">
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

  // Render Logistic Regression Mini-Sandbox
  if (algorithmId === 'logistic-regression') {
    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            SIGMOID THRESHOLD CONTROLLER // P(y=1|x)
          </span>
          <Badge variant="ultramarine">THRESHOLD: {logitThreshold.toFixed(2)}</Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Adjust the decision threshold τ. When probability P(ŷ = 1 | x) ≥ τ, the observation is classified as Positive (Class 1). Shifting τ trades Precision against Recall.
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

        <div className="relative w-full h-52 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 200" className="w-full h-full">
            {/* Threshold line */}
            <line
              x1="30"
              y1={170 - logitThreshold * 140}
              x2="350"
              y2={170 - logitThreshold * 140}
              stroke="#C83226"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Sigmoid S-curve */}
            <path
              d="M 30 165 C 150 165, 170 35, 350 35"
              fill="none"
              stroke="#1848B8"
              strokeWidth="3"
            />
            <text x="35" y={162 - logitThreshold * 140} className="font-mono text-[10px] font-bold fill-[#C83226]">
              τ = {logitThreshold.toFixed(2)}
            </text>
            <text x="300" y="30" className="font-mono text-[9px] fill-[#5C544B]">y = 1</text>
            <text x="300" y="180" className="font-mono text-[9px] fill-[#5C544B]">y = 0</text>
          </svg>
        </div>
      </div>
    );
  }

  // Render Decision Tree Mini-Sandbox
  if (algorithmId === 'decision-trees') {
    // 10 samples: 5 negative at x < 45, 5 positive at x > 40
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
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            ORTHOGONAL SPLIT FINDER // GINI IMPURITY MINIMIZER
          </span>
          <Badge variant={weightedGini <= 0.15 ? 'sage' : 'amber'}>WEIGHTED GINI: {weightedGini}</Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Slide the split cut $x = t$. The algorithm sweeps all candidate split boundaries to find the threshold producing the maximum impurity reduction (minimum weighted Gini).
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

        <div className="relative w-full h-44 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 160" className="w-full h-full">
            {/* Axis */}
            <line x1="20" y1="100" x2="360" y2="100" stroke="#1A1715" strokeWidth="1.5" />
            {/* Split Threshold Line */}
            <line
              x1={20 + treeThreshold * 3.4}
              y1="20"
              x2={20 + treeThreshold * 3.4}
              y2="140"
              stroke="#C83226"
              strokeWidth="2.5"
            />
            {/* Points */}
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

  // Render PCA Mini-Sandbox
  if (algorithmId === 'pca') {
    const rad = (pcaAngle * Math.PI) / 180;
    const varianceRatio = Math.round(Math.abs(Math.cos(rad - 0.6)) * 88 + 10);

    return (
      <div className="p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715] space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-1.5">
          <span className="font-mono text-xs font-bold uppercase text-[#C83226]">
            ROTATIONAL PROJECTION AXIS // FIRST PRINCIPAL COMPONENT
          </span>
          <Badge variant={varianceRatio > 85 ? 'sage' : 'amber'}>EXPLAINED: {varianceRatio}%</Badge>
        </div>
        <p className="font-mono text-xs text-[#5C544B]">
          Rotate the candidate projection axis vector $v_1$. The First Principal Component is mathematically defined as the unit vector that maximizes the variance of projected coordinates.
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

        <div className="relative w-full h-48 bg-[#FAF7F0] border border-[#1A1715] overflow-hidden">
          <svg viewBox="0 0 380 180" className="w-full h-full">
            <line x1="190" y1="10" x2="190" y2="170" stroke="#D8CFC0" strokeWidth="1" />
            <line x1="20" y1="90" x2="360" y2="90" stroke="#D8CFC0" strokeWidth="1" />

            {/* Rotating Eigenvector Projection Line */}
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

  return null;
};
