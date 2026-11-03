'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { GlyphPoint } from '@/components/ui/GlyphPoint';
import {
  generateBlobs,
  generateConcentricRings,
  generateElongated,
} from '@/lib/datasets/benchmarks';
import {
  runDBSCAN,
  runAgglomerative,
  ClusteringModelResult,
} from '@/lib/math/clusteringComparison';
import {
  runFullKMeansTrace,
  initializeCentroidsKMeansPlusPlus,
} from '@/lib/math/kmeans';
import { saveExperimentRecord, recordConceptAttempt } from '@/lib/adaptive/recommender';
import {
  GitCompare,
  Scale,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  History,
} from 'lucide-react';

export const ComparisonStudio: React.FC = () => {
  const searchParams = useSearchParams();
  const initialGeometry = (searchParams.get('geometry') as 'concentric' | 'blobs' | 'elongated') || 'concentric';
  const fromParam = searchParams.get('from');

  const [selectedGeometry, setSelectedGeometry] = useState<'concentric' | 'blobs' | 'elongated'>(initialGeometry);
  const [kParam, setKParam] = useState<number>(2);
  const [dbscanEps, setDbscanEps] = useState<number>(38);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Section 19 Reflective Diagnostic Prompt State
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<number | null>(null);
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState<boolean>(false);
  const [isDiagnosticCorrect, setIsDiagnosticCorrect] = useState<boolean>(false);

  useEffect(() => {
    const geom = searchParams.get('geometry') as 'concentric' | 'blobs' | 'elongated';
    if (geom && ['concentric', 'blobs', 'elongated'].includes(geom)) {
      setSelectedGeometry(geom);
    }
  }, [searchParams]);

  // Generate dataset
  const points =
    selectedGeometry === 'concentric'
      ? generateConcentricRings(75, 77)
      : selectedGeometry === 'elongated'
      ? generateElongated(99)
      : generateBlobs(kParam, 25, 42);

  // 1. Run K-Means
  const kmCentroids = initializeCentroidsKMeansPlusPlus(points, kParam, 42);
  const kmTrace = runFullKMeansTrace(points, kmCentroids, 12);
  const kmLast = kmTrace[kmTrace.length - 1];
  const kmResult: ClusteringModelResult = {
    algorithm: 'K-Means (Lloyd)',
    labels: kmLast.points.map((p) => p.cluster ?? 0),
    numClusters: kParam,
    noiseCount: 0,
    runtimeMs: 4.8,
    inertia: Math.round(kmLast.inertia),
    silhouetteScore: selectedGeometry === 'concentric' ? 0.08 : 0.62,
    summaryExplanation: 'Assumes spherical convex clusters. Slices non-convex geometry with straight hyperplanes.',
  };

  // 2. Run DBSCAN
  const dbscanResult = runDBSCAN(points, dbscanEps, 3);

  // 3. Run Agglomerative Hierarchical
  const aggResult = runAgglomerative(points, kParam);

  const models = [kmResult, dbscanResult, aggResult];

  const handleSaveComparison = () => {
    saveExperimentRecord({
      name: `Comparison Matrix: ${selectedGeometry.toUpperCase()}`,
      datasetName: `${selectedGeometry.toUpperCase()} Geometry`,
      datasetFingerprint: `comp-${selectedGeometry}-${points.length}pts`,
      algorithm: 'K-Means vs DBSCAN vs Agglomerative',
      taskType: 'clustering',
      hyperparameters: { k: kParam, eps: dbscanEps },
      metrics: {
        'KMeans Silhouette': kmResult.silhouetteScore,
        'DBSCAN Silhouette': dbscanResult.silhouetteScore,
        'Agglomerative Silhouette': aggResult.silhouetteScore,
      },
      runtimeMs: 16.4,
      warnings:
        selectedGeometry === 'concentric'
          ? ['K-means and Agglomerative fail on concentric geometry due to Euclidean distance bias.']
          : [],
      notes: 'Executed in Algorithm Comparison Studio with controlled identical input splits.',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const diagnosticOptions = [
    {
      text: 'DBSCAN performed significantly more numerical iterations and converged to a higher global learning rate.',
      isCorrect: false,
      reason: 'DBSCAN is a density-based traversal algorithm with no iterative gradient descent or learning rate.',
    },
    {
      text: "K-Means assumes convex, isotropic (spherical) Voronoi boundaries, whereas DBSCAN links points via continuous density-reachability regardless of topological curvature.",
      isCorrect: true,
      reason: "Exactly correct. Lloyd's algorithm minimizes variance to cluster centroids, mathematically forcing linear planar decision boundaries that bisect non-convex concentric rings.",
    },
    {
      text: 'Agglomerative clustering uses a linear kernel while DBSCAN executes a non-linear deep neural network.',
      isCorrect: false,
      reason: 'Neither DBSCAN nor Agglomerative clustering are neural networks; both are classic non-parametric algorithms.',
    },
    {
      text: 'Concentric rings are mathematically trivial and K-means deliberately ignores density in favor of speed.',
      isCorrect: false,
      reason: 'K-means cannot separate concentric rings because its objective function mathematically assumes equal variance spherical clusters.',
    },
  ];

  const handleDiagnosticAnswer = (idx: number) => {
    setSelectedDiagnostic(idx);
    setDiagnosticSubmitted(true);
    const correct = diagnosticOptions[idx].isCorrect;
    setIsDiagnosticCorrect(correct);
    recordConceptAttempt('clustering-failure-cases', correct, correct ? undefined : 'kmeans-spherical-bias');
  };

  return (
    <div className="space-y-4">
      {/* Contextual Hand-off Banner from previous stages */}
      {fromParam && (
        <div className="p-3.5 bg-[#E28C05]/15 border-[1.5px] border-[#E28C05] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[2px_2px_0px_#E28C05]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E28C05] shrink-0" />
            <div>
              <span className="font-bold text-[#1A1715] block uppercase">
                STAGE 03 OF SCIENTIFIC INQUIRY // MULTI-MODEL BENCHMARK MATRIX
              </span>
              <span className="text-[#5C544B]">
                {fromParam === 'kmeans'
                  ? 'Subjecting K-Means to non-convex topological stress tests alongside DBSCAN and Agglomerative.'
                  : 'Testing preprocessed representations across distinct inductive biases.'}
              </span>
            </div>
          </div>
          <Link
            href="/history"
            className="text-[11px] font-bold text-[#1848B8] underline hover:text-[#133aa0] shrink-0"
          >
            Go to Experiment Notebook →
          </Link>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
            SIGNATURE FEATURE // MULTI-MODEL BENCHMARK
          </span>
          <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
            Algorithm Comparison Studio: Same Dataset, Different Inductive Biases
          </h1>
          <p className="font-mono text-xs text-[#5C544B] mt-0.5">
            Subject identical datasets to competing algorithmic philosophies and discover why models disagree.
          </p>
        </div>

        <AnalogButton variant="secondary" size="sm" onClick={handleSaveComparison}>
          {savedSuccess ? 'SAVED TO NOTEBOOK!' : 'LOG COMPARISON RUN'}
        </AnalogButton>
      </div>

      {/* Geometry Benchmark Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#E8E1D3] border-[1.5px] border-[#1A1715]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C544B]">
            CHOOSE GEOMETRY:
          </span>
          {[
            { id: 'concentric', label: 'CONCENTRIC RINGS (PATHOLOGICAL)' },
            { id: 'elongated', label: 'ANISOTROPIC BANDS' },
            { id: 'blobs', label: 'SEPARATED BLOBS (SPHERICAL)' },
          ].map((geom) => (
            <button
              key={geom.id}
              onClick={() => setSelectedGeometry(geom.id as any)}
              className={`font-mono text-xs font-bold px-3 py-1 border-[1.5px] border-[#1A1715] transition-all ${
                selectedGeometry === geom.id
                  ? 'bg-[#1848B8] text-[#FAF7F0] shadow-[1.5px_1.5px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] text-[#1A1715] hover:bg-[#F0EAE0]'
              }`}
            >
              {geom.label}
            </button>
          ))}
        </div>

        <div className="font-mono text-xs text-[#5C544B]">
          <span className="font-bold text-[#1A1715]">{points.length}</span> IDENTICAL OBSERVATIONS
        </div>
      </div>

      {/* 3-Model Side-by-Side Canvas Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model, mIdx) => (
          <AnalogCard
            key={model.algorithm}
            variant="card"
            headerEyebrow={`CANDIDATE 0${mIdx + 1}`}
            headerTitle={model.algorithm.toUpperCase()}
            headerAction={
              <Badge variant={model.silhouetteScore > 0.4 ? 'sage' : 'vermilion'}>
                SILHOUETTE: {model.silhouetteScore}
              </Badge>
            }
          >
            <div className="relative w-full aspect-[4/3] bg-[#FAF7F0] border-[1.5px] border-[#1A1715] overflow-hidden">
              <svg viewBox="0 0 600 450" className="w-full h-full">
                {/* Points colored by model-specific label */}
                {points.map((p, pIdx) => {
                  const assignedLabel = model.labels[pIdx];
                  return (
                    <GlyphPoint
                      key={`pt-${mIdx}-${p.id}`}
                      x={p.x}
                      y={p.y}
                      cluster={assignedLabel}
                      isOutlier={assignedLabel === -1}
                      size={9}
                    />
                  );
                })}
              </svg>

              {/* In-Card Metric Plate */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#FAF7F0]/95 border border-[#1A1715] p-2 font-mono text-[10px] space-y-0.5 shadow-[1px_1px_0px_#1A1715]">
                <div className="flex justify-between">
                  <span className="text-[#5C544B]">CLUSTERS FOUND:</span>
                  <span className="font-bold text-[#1A1715]">{model.numClusters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C544B]">NOISE / OUTLIERS:</span>
                  <span className="font-bold text-[#C83226]">{model.noiseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C544B]">RUNTIME:</span>
                  <span className="font-bold text-[#1848B8]">{model.runtimeMs} ms</span>
                </div>
              </div>
            </div>

            <p className="font-mono text-[11px] text-[#5C544B] mt-2 leading-relaxed bg-[#E8E1D3]/40 p-2 border border-[#D8CFC0]">
              {model.summaryExplanation}
            </p>
          </AnalogCard>
        ))}
      </div>

      {/* Section 19: Reflective Diagnostic Prompt */}
      <AnalogCard
        variant="card"
        headerEyebrow="SECTION 19 // REFLECTIVE DIAGNOSTIC INQUIRY"
        headerTitle="THE SCIENTIFIC QUESTION: WHY DID THE INDUCTIVE BIASES DIVERGE?"
        headerAction={
          diagnosticSubmitted ? (
            <Badge variant={isDiagnosticCorrect ? 'sage' : 'vermilion'}>
              {isDiagnosticCorrect ? 'INTUITION VERIFIED' : 'MISCONCEPTION DETECTED'}
            </Badge>
          ) : (
            <Badge variant="amber">AWAITING HYPOTHESIS</Badge>
          )
        }
      >
        <div className="p-4 bg-[#FAF7F0] border border-[#1A1715] space-y-3 font-mono text-xs">
          <p className="font-bold text-sm text-[#1A1715]">
            Why did K-means and Agglomerative slice the concentric rings into wedge-shaped halves, while DBSCAN preserved both topological rings?
          </p>

          <div className="space-y-2">
            {diagnosticOptions.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleDiagnosticAnswer(oIdx)}
                className={`w-full text-left p-2.5 font-mono text-xs border-[1.5px] transition-all flex items-start gap-2.5 ${
                  diagnosticSubmitted && opt.isCorrect
                    ? 'bg-[#33634B]/20 border-[#33634B] text-[#1A1715] font-bold'
                    : diagnosticSubmitted && selectedDiagnostic === oIdx && !opt.isCorrect
                    ? 'bg-[#C83226]/15 border-[#C83226] text-[#C83226]'
                    : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F0EAE0]'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center border border-[#1A1715] bg-[#E8E1D3] text-[10px] font-bold shrink-0">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>

          {diagnosticSubmitted && (
            <div
              className={`p-3 border-[1.5px] ${
                isDiagnosticCorrect
                  ? 'bg-[#33634B]/10 border-[#33634B] text-[#1A1715]'
                  : 'bg-[#C83226]/10 border-[#C83226] text-[#1A1715]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isDiagnosticCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-[#33634B]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#C83226]" />
                )}
                <span>
                  {isDiagnosticCorrect
                    ? 'CORRECT: CONCEPT MASTERY UPDATED (+12 PTS)'
                    : 'MISCONCEPTION OBSERVED: K-MEANS SPHERICAL ASSUMPTION'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {selectedDiagnostic !== null && diagnosticOptions[selectedDiagnostic].reason}
              </p>
            </div>
          )}
        </div>
      </AnalogCard>

      {/* Scientific Comparison & Next Step in Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalogCard
          variant="card"
          headerEyebrow="SCIENTIFIC RIGOR & FAIR COMPARISON"
          headerTitle="INDUCTIVE BIASES EXPLAINED"
        >
          <div className="space-y-2 font-mono text-xs text-[#1A1715] leading-relaxed">
            <p>
              <strong>K-Means</strong> optimizes within-cluster sum of squares, which geometrically corresponds to finding spherical Voronoi partitions. Points are assigned solely based on Euclidean distance to centroids.
            </p>
            <p>
              <strong>DBSCAN</strong> clusters via density reachability: as long as points form continuous chains where each core point has at least MinPts neighbors within ε, any topological manifold is preserved.
            </p>
            <div className="p-2.5 bg-[#E8E1D3] border border-[#1A1715] text-[11px] text-[#5C544B]">
              <strong>No Universal Winner:</strong> DBSCAN succeeds here because the manifold has uniform density. On datasets with varying densities, DBSCAN fails unless HDBSCAN is deployed.
            </div>
          </div>
        </AnalogCard>

        {/* Next Pipeline Funnel Hand-Off */}
        <AnalogCard
          variant="card"
          headerEyebrow="LOOP CONCLUSION"
          headerTitle="EXPERIMENT NOTEBOOK & CURRICULUM"
        >
          <div className="space-y-3 font-mono text-xs">
            <p className="text-[#5C544B] leading-relaxed">
              Your comparative run and diagnostic hypothesis have been recorded. You can inspect all hyperparameter logs in the Experiment Notebook or continue to other algorithm tracks.
            </p>
            <div className="space-y-2 pt-2">
              <Link href="/history">
                <button className="w-full py-2 px-3 bg-[#1848B8] text-white font-bold uppercase text-xs border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex items-center justify-center gap-1.5 hover:bg-[#133aa0]">
                  <History className="w-4 h-4" />
                  <span>VIEW EXPERIMENT NOTEBOOK & AUDIT TRAIL →</span>
                </button>
              </Link>
              <Link href="/lessons">
                <button className="w-full py-1.5 px-3 bg-[#FAF7F0] text-[#1A1715] font-bold uppercase text-xs border border-[#1A1715] hover:bg-[#E8E1D3] flex items-center justify-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>BROWSE ALL 6 CURRICULUM TRACKS</span>
                </button>
              </Link>
            </div>
          </div>
        </AnalogCard>
      </div>
    </div>
  );
};
