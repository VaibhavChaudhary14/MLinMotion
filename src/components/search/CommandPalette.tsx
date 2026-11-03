'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, FlaskConical, Sliders, Database, ArrowRight, X, Cpu } from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'LESSON' | 'LAB' | 'FORMULA' | 'CONCEPT' | 'DIAGNOSTIC';
  url: string;
  badge?: string;
}

const SEARCH_CATALOG: SearchItem[] = [
  // 1. Lessons
  {
    id: 'les-kmeans',
    title: 'K-Means Clustering: Finding Structure in Unlabeled Geometry',
    description: '10-step interactive lesson: Voronoi cells, Lloyd algorithm, coordinate descent, inertia, and failure modes.',
    category: 'LESSON',
    url: '/lessons/kmeans',
    badge: '10 STEPS',
  },
  {
    id: 'les-lr',
    title: 'Ordinary Least Squares: The Geometry of Prediction',
    description: '10-step interactive lesson: Residual vectors, normal equations, closed-form projection, and MSE.',
    category: 'LESSON',
    url: '/lessons/linear-regression',
    badge: '10 STEPS',
  },
  {
    id: 'les-gd',
    title: 'Gradient Descent: Navigating the Error Surface',
    description: '10-step interactive lesson: Convex bowls, learning rate tuning, ravines, and convergence criteria.',
    category: 'LESSON',
    url: '/lessons/gradient-descent',
    badge: '10 STEPS',
  },
  {
    id: 'les-logit',
    title: 'Logistic Regression: From Continuous Lines to Probabilities',
    description: '10-step interactive lesson: Sigmoid activation, log-odds, decision thresholds, and binary cross-entropy.',
    category: 'LESSON',
    url: '/lessons/logistic-regression',
    badge: '10 STEPS',
  },
  {
    id: 'les-tree',
    title: 'Decision Trees: Recursive Partitioning & Information Gain',
    description: '10-step interactive lesson: Orthogonal axis cuts, Gini impurity, entropy, and depth pruning.',
    category: 'LESSON',
    url: '/lessons/decision-trees',
    badge: '10 STEPS',
  },
  {
    id: 'les-pca',
    title: 'Principal Component Analysis: Orthogonal Axes of Variance',
    description: '10-step interactive lesson: Covariance matrix, spectral decomposition, eigenvectors, and projection.',
    category: 'LESSON',
    url: '/lessons/pca',
    badge: '10 STEPS',
  },

  // 2. Interactive Labs & Studio Tools
  {
    id: 'tool-cinema',
    title: 'Algorithm Cinema: Step-by-Step Lloyd Simulation',
    description: 'Signature visual laboratory: watch centroids migrate, Voronoi partitions update, and synchronized code line-by-line.',
    category: 'LAB',
    url: '/cinema',
    badge: 'CINEMA',
  },
  {
    id: 'tool-lab',
    title: 'Interactive ML Lab: 5 Computational Sandboxes',
    description: 'Continuous parameter manipulation across Linear Regression, Gradient Descent, Logistic, Decision Trees, and PCA.',
    category: 'LAB',
    url: '/lab',
    badge: '5 EXPERIMENTS',
  },
  {
    id: 'tool-datalab',
    title: 'My Data Lab & Preprocessing Studio',
    description: 'Ingest CSV datasets, inspect quality, apply StandardScaler/MinMaxScaler, and execute models with zero leakage.',
    category: 'LAB',
    url: '/datalab',
    badge: 'DATA WORKBENCH',
  },
  {
    id: 'tool-compare',
    title: 'Algorithm Comparison Studio: Same Data, Different Biases',
    description: 'Direct head-to-head comparison: K-Means vs DBSCAN vs Agglomerative on concentric, elongated, and blob geometries.',
    category: 'LAB',
    url: '/compare',
    badge: 'MULTI-MODEL',
  },
  {
    id: 'tool-dashboard',
    title: 'Adaptive Learning Dashboard & Revision Queue',
    description: 'Personalized recommendations, concept mastery tracking, spaced repetition schedule, and misconception history.',
    category: 'LAB',
    url: '/dashboard',
    badge: 'ADAPTIVE',
  },
  {
    id: 'tool-history',
    title: 'Personal Experiment Notebook & Audit Log',
    description: 'Reproducible scientific journal: full hyperparameter tables, metrics, dataset fingerprints, and JSON export.',
    category: 'LAB',
    url: '/history',
    badge: 'AUDIT LOG',
  },

  // 3. Mathematical Equations
  {
    id: 'math-ols',
    title: 'Normal Equation (OLS Closed-Form Solution)',
    description: 'β = (XᵀX)⁻¹ Xᵀy : Analytical minimum of sum of squared residuals via orthogonal projection.',
    category: 'FORMULA',
    url: '/lessons/linear-regression',
    badge: 'MATH',
  },
  {
    id: 'math-lloyd',
    title: "Lloyd's Step Update Equation",
    description: 'μₖ = (1/|Sₖ|) ∑ x : Coordinate descent step finding the optimal centroid mean for a fixed Voronoi partition.',
    category: 'FORMULA',
    url: '/lessons/kmeans',
    badge: 'MATH',
  },
  {
    id: 'math-gd',
    title: 'First-Order Gradient Descent Update',
    description: 'w_{t+1} = w_t - α ∇L(w_t) : Iterative step along the steepest negative gradient direction.',
    category: 'FORMULA',
    url: '/lessons/gradient-descent',
    badge: 'MATH',
  },
  {
    id: 'math-sigmoid',
    title: 'Sigmoid Logistic Link Function',
    description: 'σ(z) = 1 / (1 + e⁻ᶻ) : Non-linear activation mapping real log-odds into the valid probability range [0, 1].',
    category: 'FORMULA',
    url: '/lessons/logistic-regression',
    badge: 'MATH',
  },
  {
    id: 'math-gini',
    title: 'Gini Impurity Equation',
    description: 'Gini(S) = 1 - ∑ pᵢ² : Probability of incorrectly labeling an element if randomly labeled according to distribution.',
    category: 'FORMULA',
    url: '/lessons/decision-trees',
    badge: 'MATH',
  },
  {
    id: 'math-pca',
    title: 'PCA Covariance Eigenvalue Problem',
    description: 'Σ v = λ v : Finding the orthogonal unit vectors v that maximize coordinate variance λ.',
    category: 'FORMULA',
    url: '/lessons/pca',
    badge: 'MATH',
  },

  // 4. Misconceptions & Diagnostics
  {
    id: 'diag-optimum',
    title: 'Misconception: K-Means Finds Global Optimum',
    description: 'Why Lloyd algorithm converges to local minima and why K-means++ initialization with multiple restarts is essential.',
    category: 'DIAGNOSTIC',
    url: '/lessons/kmeans',
    badge: 'MISCONCEPTION',
  },
  {
    id: 'diag-scale',
    title: 'Misconception: Feature Scaling is Optional for K-Means',
    description: 'Euclidean distance is dominated by whichever feature has the largest coordinate variance, requiring StandardScaler.',
    category: 'DIAGNOSTIC',
    url: '/datalab',
    badge: 'MISCONCEPTION',
  },
  {
    id: 'diag-concentric',
    title: 'Misconception: K-Means Can Separate Non-Convex Clusters',
    description: 'Voronoi boundaries are mathematically straight hyperplanes. Non-convex rings require DBSCAN density connectivity.',
    category: 'DIAGNOSTIC',
    url: '/compare',
    badge: 'MISCONCEPTION',
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIdx]) {
          handleSelect(filteredResults[selectedIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const filteredResults = SEARCH_CATALOG.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#1A1715]/60 backdrop-blur-[1px]">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F0] border-[2px] border-[#1A1715] shadow-[6px_6px_0px_#1A1715] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 p-3.5 border-b-[1.5px] border-[#1A1715] bg-[#FAF7F0]">
          <Search className="w-5 h-5 text-[#C83226] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Search lessons, formulas, lab experiments, or misconceptions... (e.g. Lloyd, OLS, DBSCAN)"
            className="w-full bg-transparent font-mono text-sm text-[#1A1715] placeholder-[#948B7D] outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1715] bg-[#FAF7F0] hover:bg-[#E8E1D3] text-[#1A1715]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-[#D8CFC0] max-h-[55vh]">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-[#948B7D]">
              No matching algorithms, formulas, or experiments found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`p-3 cursor-pointer transition-colors flex items-start justify-between gap-3 font-mono text-xs ${
                    isSelected ? 'bg-[#1848B8]/10 border-l-4 border-l-[#1848B8]' : 'bg-[#FAF7F0] hover:bg-[#F4EFE4]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 border border-[#1A1715] ${
                          item.category === 'LESSON'
                            ? 'bg-[#1848B8] text-white'
                            : item.category === 'FORMULA'
                            ? 'bg-[#C83226] text-white'
                            : item.category === 'LAB'
                            ? 'bg-[#E28C05] text-[#1A1715]'
                            : 'bg-[#33634B] text-white'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="font-bold text-[#1A1715]">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-[#5C544B] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 mt-1 text-[#948B7D]">
                    {item.badge && (
                      <span className="text-[9px] uppercase border border-[#D8CFC0] px-1 py-0.5 bg-[#E8E1D3]">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts strip */}
        <div className="p-2.5 bg-[#E8E1D3] border-t-[1.5px] border-[#1A1715] flex items-center justify-between font-mono text-[10px] text-[#5C544B]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-[#FAF7F0] border border-[#1A1715] font-bold text-[#1A1715]">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-[#FAF7F0] border border-[#1A1715] font-bold text-[#1A1715]">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-[#FAF7F0] border border-[#1A1715] font-bold text-[#1A1715]">ESC</kbd> Close
            </span>
          </div>
          <span className="font-bold text-[#1A1715]">{filteredResults.length} ENTRIES</span>
        </div>
      </div>
    </div>
  );
};
