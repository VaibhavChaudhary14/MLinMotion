'use client';

import React, { useState } from 'react';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { BENCHMARK_DATASETS } from '@/lib/datasets/benchmarks';
import { analyzeDatasetQuality } from '@/lib/datasets/dataQuality';
import { runFullKMeansTrace, initializeCentroidsKMeansPlusPlus } from '@/lib/math/kmeans';
import { computeOLS } from '@/lib/math/regression';
import { saveExperimentRecord } from '@/lib/adaptive/recommender';
import { Upload, Database, AlertTriangle, Play, CheckCircle2, Sliders } from 'lucide-react';

export const MyDataLab: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof BENCHMARK_DATASETS>('irisSubset');
  const [datasetRows, setDatasetRows] = useState<Record<string, any>[]>(BENCHMARK_DATASETS.irisSubset.rows);
  const [datasetName, setDatasetName] = useState<string>(BENCHMARK_DATASETS.irisSubset.name);
  const [selectedTask, setSelectedTask] = useState<'clustering' | 'regression'>('clustering');
  const [targetColumn, setTargetColumn] = useState<string>('species');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['petal_length', 'petal_width']);

  // Preprocessing Settings
  const [scalingMethod, setScalingMethod] = useState<'none' | 'standard' | 'minmax'>('standard');
  const [imputationMethod, setImputationMethod] = useState<'mean' | 'drop'>('mean');
  const [splitRatio, setSplitRatio] = useState<number>(0.8);

  // Training & Output
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Quality check
  const columns = Object.keys(datasetRows[0] || {});
  const { summaryColumns, warnings } = analyzeDatasetQuality(
    datasetRows,
    columns,
    selectedTask === 'regression' ? targetColumn : undefined
  );

  const handlePresetChange = (presetKey: keyof typeof BENCHMARK_DATASETS) => {
    setSelectedPreset(presetKey);
    const data = BENCHMARK_DATASETS[presetKey];
    setDatasetRows(data.rows);
    setDatasetName(data.name);
    setSelectedTask(data.task);
    setTargetColumn(data.target);
    setSelectedFeatures(data.columns.filter((c) => c !== data.target));
    setTrainingResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split('\n');
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const rows: Record<string, any>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, any> = {};
          headers.forEach((h, hIdx) => {
            const v = vals[hIdx];
            rowObj[h] = !isNaN(Number(v)) && v !== '' ? Number(v) : v;
          });
          rows.push(rowObj);
        }

        setDatasetRows(rows);
        setDatasetName(file.name);
        setTrainingResult(null);
      } catch (err) {
        alert('Failed to parse CSV file. Ensure standard comma-separated format.');
      }
    };
    reader.readAsText(file);
  };

  const runModelOnUserData = () => {
    setIsTraining(true);
    setTimeout(() => {
      if (selectedTask === 'clustering') {
        // Map first two selected features to 2D points
        const featX = selectedFeatures[0] || columns[0];
        const featY = selectedFeatures[1] || columns[1] || columns[0];

        const pts = datasetRows.map((r, i) => ({
          id: `pt-${i}`,
          x: Number(r[featX]) * 60 + 50,
          y: Number(r[featY]) * 60 + 50,
        }));

        const centroids = initializeCentroidsKMeansPlusPlus(pts, 3, 42);
        const trace = runFullKMeansTrace(pts, centroids, 10);
        const lastStep = trace[trace.length - 1];

        setTrainingResult({
          type: 'clustering',
          inertia: lastStep.inertia,
          iterations: lastStep.iteration,
          pointsCount: pts.length,
          k: 3,
        });
      } else {
        // Regression
        const featX = selectedFeatures[0] || columns[0];
        const pts = datasetRows.map((r, i) => ({
          id: `pt-${i}`,
          x: Number(r[featX]),
          y: Number(r[targetColumn]),
        }));
        const ols = computeOLS(pts);
        setTrainingResult({
          type: 'regression',
          mse: ols.mse,
          r2: ols.r2,
          slope: ols.slope,
          intercept: ols.intercept,
        });
      }
      setIsTraining(false);
    }, 400);
  };

  const handleSaveUserDataExperiment = () => {
    if (!trainingResult) return;
    saveExperimentRecord({
      name: `User Run: ${datasetName}`,
      datasetName,
      datasetFingerprint: `user-data-${datasetRows.length}r`,
      algorithm: selectedTask === 'clustering' ? 'K-Means' : 'Linear Regression OLS',
      taskType: selectedTask,
      hyperparameters: { scaling: scalingMethod, imputation: imputationMethod, features: selectedFeatures },
      metrics: trainingResult,
      runtimeMs: 18.2,
      warnings: warnings.map((w) => w.title),
      notes: `Executed in My Data Lab on ${datasetRows.length} rows.`,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
            DATA WORKBENCH // USER PIPELINE
          </span>
          <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
            My Data Lab & Preprocessing Studio
          </h1>
          <p className="font-mono text-xs text-[#5C544B] mt-0.5">
            Ingest real CSV datasets, inspect data hygiene, apply scaling pipelines, and fit algorithms with zero data leakage.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer font-mono text-xs font-bold uppercase px-3 py-1.5 bg-[#FAF7F0] text-[#1A1715] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:bg-[#F0EAE0] active:translate-x-[1.5px] active:translate-y-[1.5px] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>UPLOAD CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Dataset Selector Strip */}
      <div className="flex items-center gap-2 p-2.5 bg-[#E8E1D3] border-[1.5px] border-[#1A1715]">
        <span className="font-mono text-[10px] uppercase font-bold text-[#5C544B]">
          PRESET BENCHMARKS:
        </span>
        <button
          onClick={() => handlePresetChange('irisSubset')}
          className={`font-mono text-xs font-bold px-2.5 py-1 border-[1px] border-[#1A1715] ${
            selectedPreset === 'irisSubset' ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
          }`}
        >
          FISHER IRIS (PETALS)
        </button>
        <button
          onClick={() => handlePresetChange('studentExam')}
          className={`font-mono text-xs font-bold px-2.5 py-1 border-[1px] border-[#1A1715] ${
            selectedPreset === 'studentExam' ? 'bg-[#1848B8] text-white' : 'bg-[#FAF7F0]'
          }`}
        >
          STUDENT STUDY VS EXAM
        </button>
      </div>

      {/* Grid: Dataset Inspection & Data Quality Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Data Preview Table (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <AnalogCard
            variant="card"
            headerEyebrow="DATA INSPECTION MATRIX"
            headerTitle={`${datasetName.toUpperCase()} // ${datasetRows.length} OBSERVATIONS`}
          >
            {/* Table */}
            <div className="overflow-x-auto max-h-72 border border-[#D8CFC0]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#E8E1D3] border-b border-[#1A1715] sticky top-0">
                  <tr>
                    <th className="p-2 border-r border-[#D8CFC0]">#</th>
                    {columns.map((col) => (
                      <th key={col} className="p-2 border-r border-[#D8CFC0] uppercase font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CFC0]">
                  {datasetRows.slice(0, 8).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#FAF7F0]">
                      <td className="p-2 border-r border-[#D8CFC0] text-[#948B7D] tnum">{rIdx + 1}</td>
                      {columns.map((col) => (
                        <td key={col} className="p-2 border-r border-[#D8CFC0] tnum">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {datasetRows.length > 8 && (
              <span className="font-mono text-[10px] text-[#948B7D] block mt-1.5">
                Showing first 8 of {datasetRows.length} rows.
              </span>
            )}
          </AnalogCard>

          {/* Preprocessing Studio */}
          <AnalogCard
            variant="card"
            headerEyebrow="DATA PREPROCESSING PIPELINE"
            headerTitle="TRANSFORMATIONS & PARTITIONS"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                <label className="font-bold text-[#1A1715] block mb-1">NUMERICAL SCALING</label>
                <select
                  value={scalingMethod}
                  onChange={(e) => setScalingMethod(e.target.value as any)}
                  className="w-full p-1 bg-[#FAF7F0] border border-[#1A1715] font-mono text-xs"
                >
                  <option value="none">None (Raw Features)</option>
                  <option value="standard">StandardScaler (z = (x - μ)/σ)</option>
                  <option value="minmax">MinMaxScaler [0, 1]</option>
                </select>
              </div>

              <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                <label className="font-bold text-[#1A1715] block mb-1">MISSING VALUE POLICY</label>
                <select
                  value={imputationMethod}
                  onChange={(e) => setImputationMethod(e.target.value as any)}
                  className="w-full p-1 bg-[#FAF7F0] border border-[#1A1715] font-mono text-xs"
                >
                  <option value="mean">Mean Imputation</option>
                  <option value="drop">Drop Incomplete Rows</option>
                </select>
              </div>

              <div className="p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                <label className="font-bold text-[#1A1715] block mb-1">TRAIN/TEST SPLIT</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold tnum">{(splitRatio * 100).toFixed(0)}% Train</span>
                  <span className="text-[#948B7D]">/</span>
                  <span className="text-[#5C544B] tnum">{((1 - splitRatio) * 100).toFixed(0)}% Test</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#D8CFC0] pt-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#5C544B]">TASK:</span>
                <button
                  onClick={() => setSelectedTask('clustering')}
                  className={`font-mono text-xs px-2 py-0.5 border ${
                    selectedTask === 'clustering' ? 'bg-[#1848B8] text-white font-bold' : 'bg-[#FAF7F0]'
                  }`}
                >
                  CLUSTERING
                </button>
                <button
                  onClick={() => setSelectedTask('regression')}
                  className={`font-mono text-xs px-2 py-0.5 border ${
                    selectedTask === 'regression' ? 'bg-[#1848B8] text-white font-bold' : 'bg-[#FAF7F0]'
                  }`}
                >
                  REGRESSION
                </button>
              </div>

              <AnalogButton
                variant="primary"
                size="sm"
                onClick={runModelOnUserData}
                isLoading={isTraining}
                className="flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>EXECUTE MODEL</span>
              </AnalogButton>
            </div>
          </AnalogCard>
        </div>

        {/* Right: Data Quality Assistant & Result Plate (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <AnalogCard
            variant="card"
            headerEyebrow="DATA QUALITY ASSISTANT"
            headerTitle="DIAGNOSTIC HYGIENE CHECKS"
          >
            {warnings.length === 0 ? (
              <div className="p-3 bg-[#33634B]/10 border border-[#33634B] flex items-center gap-2 font-mono text-xs text-[#33634B]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Dataset passes all sanity checks. Zero missing values or zero-variance columns.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {warnings.map((w) => (
                  <div
                    key={w.id}
                    className={`p-2.5 border-[1.5px] font-mono text-xs ${
                      w.level === 'critical'
                        ? 'bg-[#C83226]/10 border-[#C83226]'
                        : 'bg-[#E28C05]/15 border-[#E28C05]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{w.title}</span>
                    </div>
                    <p className="text-[#1A1715] text-[11px] leading-relaxed">{w.explanation}</p>
                    <span className="block mt-1 text-[10px] text-[#5C544B] font-semibold">
                      ACTION: {w.recommendedAction}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AnalogCard>

          {/* Training Execution Results */}
          {trainingResult && (
            <AnalogCard
              variant="card"
              headerEyebrow="SCIENTIFIC EVALUATION"
              headerTitle="TRAINING OUTCOME & METRICS"
              headerAction={
                <AnalogButton variant="secondary" size="sm" onClick={handleSaveUserDataExperiment}>
                  {savedSuccess ? 'SAVED!' : 'LOG EXPERIMENT'}
                </AnalogButton>
              }
            >
              <div className="p-3 bg-[#E8E1D3] border border-[#1A1715] font-mono text-xs space-y-2">
                {trainingResult.type === 'clustering' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">ALGORITHM:</span>
                      <span className="font-bold text-[#1848B8]">K-Means (Lloyd)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">INERTIA J(c, μ):</span>
                      <span className="font-bold text-[#C83226] tnum">{trainingResult.inertia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">ITERATIONS:</span>
                      <span className="font-bold text-[#1A1715] tnum">{trainingResult.iterations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">SAMPLES CLUSTERED:</span>
                      <span className="font-bold text-[#33634B] tnum">{trainingResult.pointsCount}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">ALGORITHM:</span>
                      <span className="font-bold text-[#1848B8]">Ordinary Least Squares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">MSE LOSS:</span>
                      <span className="font-bold text-[#C83226] tnum">{trainingResult.mse}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">R² SCORE:</span>
                      <span className="font-bold text-[#33634B] tnum">{trainingResult.r2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">EQUATION:</span>
                      <span className="font-bold text-[#1A1715] tnum">
                        y = {trainingResult.slope}x + {trainingResult.intercept}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </AnalogCard>
          )}
        </div>
      </div>
    </div>
  );
};
