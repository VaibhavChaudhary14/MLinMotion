'use client';

import React from 'react';

// 1. Linear Regression Thumbnail
export const LinearRegressionThumb: React.FC = () => {
  const points = [
    { x: 25, y: 80 },
    { x: 45, y: 65 },
    { x: 70, y: 55 },
    { x: 95, y: 40 },
    { x: 120, y: 35 },
    { x: 145, y: 20 },
  ];
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Grid line */}
      <line x1="10" y1="90" x2="160" y2="90" stroke="#E8E1D3" strokeWidth="1" />
      <line x1="10" y1="10" x2="10" y2="90" stroke="#E8E1D3" strokeWidth="1" />
      {/* Regression Line */}
      <line x1="15" y1="88" x2="155" y2="15" stroke="#1848B8" strokeWidth="2" />
      {/* Residual Error bars (Vermilion) */}
      {points.map((p, i) => {
        const lineY = -0.52 * p.x + 96;
        return (
          <g key={i}>
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={lineY}
              stroke="#C83226"
              strokeWidth="1.2"
              strokeDasharray="1.5 1.5"
            />
            <circle cx={p.x} cy={p.y} r="2.8" fill="#1A1715" />
          </g>
        );
      })}
    </svg>
  );
};

// 2. Gradient Descent Thumbnail
export const GradientDescentThumb: React.FC = () => {
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Convex Bowl Curve */}
      <path
        d="M 20 85 Q 85 10 150 85"
        fill="none"
        stroke="#1A1715"
        strokeWidth="1.5"
      />
      {/* Step points descending down the bowl */}
      <g>
        <circle cx="35" cy="72" r="3" fill="#C83226" />
        <line x1="35" y1="72" x2="52" y2="52" stroke="#C83226" strokeWidth="1.5" />
        <circle cx="52" cy="52" r="2.8" fill="#C83226" />
        <line x1="52" y1="52" x2="68" y2="38" stroke="#C83226" strokeWidth="1.2" />
        <circle cx="68" cy="38" r="2.5" fill="#C83226" />
        <circle cx="85" cy="30" r="3.5" fill="#33634B" stroke="#1A1715" strokeWidth="1" />
      </g>
      <text x="85" y="24" textAnchor="middle" className="font-mono text-[7px] fill-[#33634B] font-bold">
        MINIMUM
      </text>
    </svg>
  );
};

// 3. K-Means Thumbnail
export const KMeansThumb: React.FC = () => {
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Cluster 1 points (Ultramarine circles) */}
      <circle cx="40" cy="35" r="2.5" fill="#1848B8" />
      <circle cx="50" cy="45" r="2.5" fill="#1848B8" />
      <circle cx="30" cy="50" r="2.5" fill="#1848B8" />
      <circle cx="55" cy="30" r="2.5" fill="#1848B8" />
      {/* Centroid 1 */}
      <circle cx="43" cy="40" r="5" fill="none" stroke="#1A1715" strokeWidth="1" />
      <circle cx="43" cy="40" r="2.5" fill="#1848B8" />

      {/* Cluster 2 points (Vermilion diamonds) */}
      <rect x="115" y="55" width="4.5" height="4.5" transform="rotate(45, 117, 57)" fill="#C83226" />
      <rect x="125" y="65" width="4.5" height="4.5" transform="rotate(45, 127, 67)" fill="#C83226" />
      <rect x="135" y="50" width="4.5" height="4.5" transform="rotate(45, 137, 52)" fill="#C83226" />
      {/* Centroid 2 */}
      <circle cx="125" cy="58" r="5" fill="none" stroke="#1A1715" strokeWidth="1" />
      <circle cx="125" cy="58" r="2.5" fill="#C83226" />

      {/* Voronoi partition separator */}
      <line x1="90" y1="10" x2="80" y2="90" stroke="#1A1715" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
};

// 4. Logistic Regression Thumbnail
export const LogisticRegressionThumb: React.FC = () => {
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Sigmoid Curve */}
      <path
        d="M 15 85 C 65 85, 75 15, 155 15"
        fill="none"
        stroke="#1848B8"
        strokeWidth="2"
      />
      {/* Threshold line tau = 0.5 */}
      <line x1="15" y1="50" x2="155" y2="50" stroke="#C83226" strokeWidth="1" strokeDasharray="2 2" />
      <text x="140" y="46" className="font-mono text-[7px] fill-[#C83226] font-bold">
        t=0.5
      </text>
      {/* Class 0 and Class 1 points */}
      <circle cx="30" cy="85" r="2.5" fill="#1A1715" />
      <circle cx="45" cy="85" r="2.5" fill="#1A1715" />
      <circle cx="130" cy="15" r="2.5" fill="#1848B8" />
      <circle cx="145" cy="15" r="2.5" fill="#1848B8" />
    </svg>
  );
};

// 5. Decision Trees Thumbnail
export const DecisionTreesThumb: React.FC = () => {
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Bounding partition box */}
      <rect x="15" y="15" width="140" height="70" fill="none" stroke="#1A1715" strokeWidth="1.2" />
      {/* Split 1: vertical cut x <= 75 */}
      <line x1="75" y1="15" x2="75" y2="85" stroke="#C83226" strokeWidth="1.5" />
      {/* Split 2: horizontal cut in right region y <= 50 */}
      <line x1="75" y1="50" x2="155" y2="50" stroke="#1848B8" strokeWidth="1.5" />
      {/* Sample dots in distinct partitions */}
      <circle cx="45" cy="40" r="2.5" fill="#33634B" />
      <circle cx="35" cy="65" r="2.5" fill="#33634B" />
      <circle cx="110" cy="35" r="2.5" fill="#1848B8" />
      <circle cx="120" cy="68" r="2.5" fill="#C83226" />
    </svg>
  );
};

// 6. PCA Thumbnail
export const PCAThumb: React.FC = () => {
  return (
    <svg viewBox="0 0 170 100" className="w-full h-full bg-[#FAF7F0]">
      {/* Data cluster ellipse points */}
      <circle cx="50" cy="70" r="2.5" fill="#1A1715" />
      <circle cx="70" cy="55" r="2.5" fill="#1A1715" />
      <circle cx="85" cy="50" r="2.5" fill="#1A1715" />
      <circle cx="105" cy="42" r="2.5" fill="#1A1715" />
      <circle cx="120" cy="30" r="2.5" fill="#1A1715" />
      {/* Principal Component Vector 1 (steep diagonal) */}
      <line x1="30" y1="85" x2="140" y2="20" stroke="#1848B8" strokeWidth="2" />
      {/* Orthogonal PC2 */}
      <line x1="70" y1="35" x2="100" y2="65" stroke="#E28C05" strokeWidth="1.2" strokeDasharray="2 2" />
      {/* Text label */}
      <text x="130" y="18" className="font-mono text-[7px] fill-[#1848B8] font-bold">
        PC1 (88%)
      </text>
    </svg>
  );
};
