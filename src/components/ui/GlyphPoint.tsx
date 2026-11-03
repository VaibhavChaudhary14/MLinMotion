import React from 'react';
import { CENTROID_COLORS } from '@/lib/math/kmeans';

interface GlyphPointProps {
  x: number;
  y: number;
  cluster?: number;
  size?: number;
  isCentroid?: boolean;
  isOutlier?: boolean;
  label?: string | number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const GlyphPoint: React.FC<GlyphPointProps> = ({
  x,
  y,
  cluster,
  size = 8,
  isCentroid = false,
  isOutlier = false,
  label,
  isSelected = false,
  onClick,
}) => {
  // Centroid Concentric Target Disc (18px)
  if (isCentroid) {
    const color = cluster !== undefined ? CENTROID_COLORS[cluster % CENTROID_COLORS.length] : '#1848B8';
    return (
      <g
        transform={`translate(${x}, ${y})`}
        className="cursor-pointer group select-none"
        onClick={onClick}
      >
        {/* Outer Ring */}
        <circle r={10} fill="none" stroke="#1A1715" strokeWidth={1.5} />
        {/* White Spacer Ring */}
        <circle r={8} fill="#FAF7F0" stroke="#1A1715" strokeWidth={1} />
        {/* Dominant Color Core */}
        <circle r={5} fill={color} stroke="#1A1715" strokeWidth={1} />
        {/* Centroid Label Tag */}
        {label !== undefined && (
          <text
            y={-14}
            textAnchor="middle"
            className="font-mono text-[9px] font-bold fill-[#1A1715] select-none pointer-events-none"
          >
            μ_{label}
          </text>
        )}
      </g>
    );
  }

  // Outlier: Red Alert Glyph
  if (isOutlier) {
    return (
      <g transform={`translate(${x}, ${y})`} className="cursor-pointer" onClick={onClick}>
        <circle r={6} fill="#FAF7F0" stroke="#C83226" strokeWidth={1.5} />
        <line x1={-3} y1={-3} x2={3} y2={3} stroke="#C83226" strokeWidth={1.5} />
        <line x1={-3} y1={3} x2={3} y2={-3} stroke="#C83226" strokeWidth={1.5} />
      </g>
    );
  }

  // Unassigned Data Point: Hollow Circle with Dashed Border
  if (cluster === undefined || cluster === -1) {
    return (
      <circle
        cx={x}
        cy={y}
        r={size / 2}
        fill="#FAF7F0"
        stroke="#948B7D"
        strokeWidth={1.2}
        strokeDasharray="2.5 2"
        className="cursor-pointer transition-transform duration-100 hover:scale-125"
        onClick={onClick}
      />
    );
  }

  // Pair Cluster with distinct Bauhaus Primary + Geometric Glyph
  const clusterIdx = cluster % 4;

  switch (clusterIdx) {
    // Cluster 1: Ultramarine Solid Circle
    case 0:
      return (
        <circle
          cx={x}
          cy={y}
          r={size / 2}
          fill="#1848B8"
          stroke="#1A1715"
          strokeWidth={1}
          className="cursor-pointer transition-transform duration-100 hover:scale-125"
          onClick={onClick}
        />
      );

    // Cluster 2: Vermilion Rotated Square / Diamond
    case 1: {
      const half = size / 2;
      return (
        <rect
          x={x - half}
          y={y - half}
          width={size}
          height={size}
          transform={`rotate(45, ${x}, ${y})`}
          fill="#C83226"
          stroke="#1A1715"
          strokeWidth={1}
          className="cursor-pointer transition-transform duration-100 hover:scale-125"
          onClick={onClick}
        />
      );
    }

    // Cluster 3: Cadmium Yellow Equilateral Triangle
    case 2: {
      const r = size * 0.65;
      const h = (r * Math.sqrt(3)) / 2;
      const pointsStr = `${x},${y - r} ${x - h},${y + r / 2} ${x + h},${y + r / 2}`;
      return (
        <polygon
          points={pointsStr}
          fill="#E28C05"
          stroke="#1A1715"
          strokeWidth={1}
          className="cursor-pointer transition-transform duration-100 hover:scale-125"
          onClick={onClick}
        />
      );
    }

    // Cluster 4: Sage Green Crosshair Square
    case 3:
    default: {
      const half = size / 2;
      return (
        <g transform={`translate(${x}, ${y})`} className="cursor-pointer hover:scale-125" onClick={onClick}>
          <rect
            x={-half}
            y={-half}
            width={size}
            height={size}
            fill="#33634B"
            stroke="#1A1715"
            strokeWidth={1}
          />
          <circle r={1} fill="#FAF7F0" />
        </g>
      );
    }
  }
};
