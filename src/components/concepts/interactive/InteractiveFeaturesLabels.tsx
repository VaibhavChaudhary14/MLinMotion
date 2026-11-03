'use client';

import React, { useState } from 'react';
import { Database, Binary, BarChart3, ArrowRight } from 'lucide-react';

interface RawSample {
  id: string;
  sqft: number;
  bedrooms: number;
  location: 'Downtown' | 'Suburbs' | 'Rural';
  price: number; // Target y ($k)
}

const RAW_SAMPLES: RawSample[] = [
  { id: 'x1', sqft: 1450, bedrooms: 3, location: 'Downtown', price: 420 },
  { id: 'x2', sqft: 980, bedrooms: 2, location: 'Suburbs', price: 280 },
  { id: 'x3', sqft: 2200, bedrooms: 4, location: 'Downtown', price: 610 },
  { id: 'x4', sqft: 1750, bedrooms: 3, location: 'Rural', price: 295 },
];

export const InteractiveFeaturesLabels: React.FC = () => {
  const [encodingMode, setEncodingMode] = useState<'raw' | 'onehot' | 'standardized'>('raw');
  const [highlightFeature, setHighlightFeature] = useState<string | null>(null);

  // Mean & std for normalization
  const sqftMean = 1595;
  const sqftStd = 444.6;
  const bedMean = 3.0;
  const bedStd = 0.707;

  return (
    <div className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] p-3 sm:p-4 shadow-[2px_2px_0px_#1A1715] font-mono text-xs space-y-3">
      {/* Top Header Plate */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8CFC0] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#1848B8] border border-[#1A1715]" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#1A1715]">
            ANATOMY OF A DATASET: FEATURE MATRIX & TARGET VECTOR
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-[#F4EFE4] border border-[#1A1715] font-bold text-[#1A1715]">
            N = 4 SAMPLES
          </span>
          <span className="px-1.5 py-0.5 bg-[#E8E1D3] border border-[#1A1715] font-bold text-[#1848B8]">
            {encodingMode === 'onehot' || encodingMode === 'standardized' ? 'D = 5 FEATURES' : 'D = 3 FEATURES'}
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F4EFE4] p-2 border border-[#1A1715]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-[#5C544B]">REPRESENTATION:</span>
          <button
            onClick={() => setEncodingMode('raw')}
            className={`px-2 py-1 text-[10px] font-bold border transition-none ${
              encodingMode === 'raw'
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715]'
                : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            01. RAW TABULAR
          </button>
          <button
            onClick={() => setEncodingMode('onehot')}
            className={`px-2 py-1 text-[10px] font-bold border transition-none ${
              encodingMode === 'onehot'
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715]'
                : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            02. ONE-HOT ENCODED
          </button>
          <button
            onClick={() => setEncodingMode('standardized')}
            className={`px-2 py-1 text-[10px] font-bold border transition-none ${
              encodingMode === 'standardized'
                ? 'bg-[#1848B8] text-[#FAF7F0] border-[#1A1715]'
                : 'bg-[#FAF7F0] text-[#1A1715] border-[#1A1715] hover:bg-[#E8E1D3]'
            }`}
          >
            03. STANDARDIZED (Z-SCORE)
          </button>
        </div>
        <div className="text-[10px] text-[#5C544B] italic">
          Hover columns to trace role in design matrix X (n rows × d features)
        </div>
      </div>

      {/* Interactive Matrix Display */}
      <div className="overflow-x-auto border-[1.5px] border-[#1A1715] bg-[#FAF7F0]">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
              <th className="p-2 border-r border-[#1A1715] font-black text-[#5C544B] w-12 text-center">
                ID
              </th>
              {/* Feature Matrix Header */}
              <th
                colSpan={encodingMode === 'raw' ? 3 : 5}
                className="p-2 border-r-[2px] border-[#1A1715] bg-[#E0D8C7] text-center font-black tracking-wider text-[#1848B8]"
              >
                FEATURE MATRIX X (4 × {encodingMode === 'raw' ? 3 : 5})
              </th>
              {/* Target Vector Header */}
              <th className="p-2 bg-[#EADFD0] text-center font-black tracking-wider text-[#C83226]">
                TARGET y (4 × 1)
              </th>
            </tr>
            <tr className="bg-[#F4EFE4] border-b border-[#1A1715] text-[10px]">
              <th className="p-1.5 border-r border-[#1A1715] text-center text-[#5C544B]">INDEX</th>
              {encodingMode === 'raw' && (
                <>
                  <th
                    onMouseEnter={() => setHighlightFeature('sqft')}
                    onMouseLeave={() => setHighlightFeature(null)}
                    className={`p-1.5 border-r border-[#1A1715] cursor-pointer ${
                      highlightFeature === 'sqft' ? 'bg-[#D6E2FA]' : ''
                    }`}
                  >
                    $x_1$: AREA (SQFT)
                    <span className="block text-[8px] font-normal text-[#5C544B]">NUMERICAL CONTINUOUS</span>
                  </th>
                  <th
                    onMouseEnter={() => setHighlightFeature('bed')}
                    onMouseLeave={() => setHighlightFeature(null)}
                    className={`p-1.5 border-r border-[#1A1715] cursor-pointer ${
                      highlightFeature === 'bed' ? 'bg-[#D6E2FA]' : ''
                    }`}
                  >
                    $x_2$: BEDROOMS
                    <span className="block text-[8px] font-normal text-[#5C544B]">NUMERICAL DISCRETE</span>
                  </th>
                  <th
                    onMouseEnter={() => setHighlightFeature('loc')}
                    onMouseLeave={() => setHighlightFeature(null)}
                    className={`p-1.5 border-r-[2px] border-[#1A1715] cursor-pointer ${
                      highlightFeature === 'loc' ? 'bg-[#FCE3D8]' : ''
                    }`}
                  >
                    $x_3$: NEIGHBORHOOD
                    <span className="block text-[8px] font-normal text-[#C83226]">RAW STRING (CATEGORICAL)</span>
                  </th>
                </>
              )}
              {(encodingMode === 'onehot' || encodingMode === 'standardized') && (
                <>
                  <th className="p-1.5 border-r border-[#1A1715]">
                    {encodingMode === 'standardized' ? '$x_1$: SQFT (Z-SCORE)' : '$x_1$: SQFT'}
                    <span className="block text-[8px] font-normal text-[#5C544B]">FLOAT64</span>
                  </th>
                  <th className="p-1.5 border-r border-[#1A1715]">
                    {encodingMode === 'standardized' ? '$x_2$: BEDS (Z-SCORE)' : '$x_2$: BEDS'}
                    <span className="block text-[8px] font-normal text-[#5C544B]">FLOAT64</span>
                  </th>
                  <th className="p-1.5 border-r border-[#1A1715] bg-[#E8F0E6]">
                    $x_3$: LOC_DOWNTOWN
                    <span className="block text-[8px] font-normal text-[#33634B]">BINARY {`{0, 1}`}</span>
                  </th>
                  <th className="p-1.5 border-r border-[#1A1715] bg-[#E8F0E6]">
                    $x_4$: LOC_SUBURBS
                    <span className="block text-[8px] font-normal text-[#33634B]">BINARY {`{0, 1}`}</span>
                  </th>
                  <th className="p-1.5 border-r-[2px] border-[#1A1715] bg-[#E8F0E6]">
                    $x_5$: LOC_RURAL
                    <span className="block text-[8px] font-normal text-[#33634B]">BINARY {`{0, 1}`}</span>
                  </th>
                </>
              )}
              <th className="p-1.5 text-center text-[#C83226]">
                $y$: SALE PRICE ($K)
                <span className="block text-[8px] font-normal text-[#5C544B]">SUPERVISED TARGET</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {RAW_SAMPLES.map((s, idx) => {
              const zSqft = ((s.sqft - sqftMean) / sqftStd).toFixed(2);
              const zBed = ((s.bedrooms - bedMean) / bedStd).toFixed(2);
              const isDowntown = s.location === 'Downtown' ? '1' : '0';
              const isSuburbs = s.location === 'Suburbs' ? '1' : '0';
              const isRural = s.location === 'Rural' ? '1' : '0';

              return (
                <tr
                  key={s.id}
                  className={`border-b border-[#D8CFC0] hover:bg-[#F4EFE4] ${
                    idx % 2 === 1 ? 'bg-[#FDFBF7]' : 'bg-[#FAF7F0]'
                  }`}
                >
                  <td className="p-2 border-r border-[#1A1715] font-black text-center text-[#5C544B]">
                    {idx + 1}
                  </td>
                  {encodingMode === 'raw' && (
                    <>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-[#1A1715]">
                        {s.sqft}
                      </td>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-[#1A1715]">
                        {s.bedrooms}
                      </td>
                      <td className="p-2 border-r-[2px] border-[#1A1715] text-[#C83226] font-bold bg-[#FFF4EF]">
                        "{s.location}"
                      </td>
                    </>
                  )}
                  {encodingMode === 'onehot' && (
                    <>
                      <td className="p-2 border-r border-[#1A1715]">{s.sqft}</td>
                      <td className="p-2 border-r border-[#1A1715]">{s.bedrooms}</td>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-center text-[#33634B]">
                        {isDowntown}
                      </td>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-center text-[#33634B]">
                        {isSuburbs}
                      </td>
                      <td className="p-2 border-r-[2px] border-[#1A1715] font-bold text-center text-[#33634B]">
                        {isRural}
                      </td>
                    </>
                  )}
                  {encodingMode === 'standardized' && (
                    <>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-[#1848B8]">
                        {zSqft > '0' ? `+${zSqft}` : zSqft}
                      </td>
                      <td className="p-2 border-r border-[#1A1715] font-bold text-[#1848B8]">
                        {zBed > '0' ? `+${zBed}` : zBed}
                      </td>
                      <td className="p-2 border-r border-[#1A1715] text-center">{isDowntown}</td>
                      <td className="p-2 border-r border-[#1A1715] text-center">{isSuburbs}</td>
                      <td className="p-2 border-r-[2px] border-[#1A1715] text-center">{isRural}</td>
                    </>
                  )}
                  <td className="p-2 font-bold text-center text-[#C83226] bg-[#FFF8F6]">
                    ${s.price}k
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanatory Callout Banner */}
      <div className="p-2.5 bg-[#E8E1D3] border border-[#1A1715] flex items-start gap-2 text-[10px] leading-relaxed">
        <Database className="w-4 h-4 text-[#1848B8] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1A1715] uppercase">Mathematical Mandate: </span>
          {encodingMode === 'raw' && (
            <span>
              Linear and gradient-based models perform matrix operations: ŷ = wᵀx. They cannot compute w × &quot;Downtown&quot;. Raw strings must be vectorized into quantitative dimensions before machine learning begins.
            </span>
          )}
          {encodingMode === 'onehot' && (
            <span>
              One-Hot Encoding converts a nominal categorical column of cardinality C = 3 into 3 orthogonal binary flags. To avoid multicollinearity in unregularized OLS (the &quot;dummy variable trap&quot;), one column can be dropped as the base reference (C - 1).
            </span>
          )}
          {encodingMode === 'standardized' && (
            <span>
              Standardization z = (x - μ) / σ centers features at zero with unit variance (σ = 1). Without this, Area (1450) dwarfs Bedrooms (3) by a factor of 500, causing severe elongation in gradient descent loss contours and distorting Euclidean distance metrics.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
