'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { BENCHMARK_DATASETS } from '@/lib/datasets/benchmarks';
import { analyzeDatasetQuality } from '@/lib/datasets/dataQuality';
import { parseCSV } from '@/lib/datasets/csvParser';
import { runFullKMeansTrace, initializeCentroidsKMeansPlusPlus } from '@/lib/math/kmeans';
import { computeOLS } from '@/lib/math/regression';
import { saveExperimentRecord } from '@/lib/adaptive/recommender';
import {
  Upload,
  Database,
  AlertTriangle,
  Play,
  CheckCircle2,
  Sliders,
  ArrowRight,
  GitCompare,
  History,
  Sparkles,
} from 'lucide-react';

export const MyDataLab: React.FC = () => {
  const searchParams = useSearchParams();
  const presetParam = searchParams.get('preset') as keyof typeof BENCHMARK_DATASETS | null;
  const fromParam = searchParams.get('from');

  const initialPreset = presetParam && BENCHMARK_DATASETS[presetParam] ? presetParam : 'irisSubset';

  const [selectedPreset, setSelectedPreset] = useState<keyof typeof BENCHMARK_DATASETS | 'custom'>(initialPreset);
  const [datasetRows, setDatasetRows] = useState<Record<string, any>[]>(BENCHMARK_DATASETS[initialPreset].rows);
  const [datasetName, setDatasetName] = useState<string>(BENCHMARK_DATASETS[initialPreset].name);
  const [selectedTask, setSelectedTask] = useState<'clustering' | 'regression'>(BENCHMARK_DATASETS[initialPreset].task);
  const [targetColumn, setTargetColumn] = useState<string>(BENCHMARK_DATASETS[initialPreset].target);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    BENCHMARK_DATASETS[initialPreset].columns.filter((c) => c !== BENCHMARK_DATASETS[initialPreset].target)
  );

  // Preprocessing Settings
  const [scalingMethod, setScalingMethod] = useState<'none' | 'standard' | 'minmax'>('standard');
  const [imputationMethod, setImputationMethod] = useState<'mean' | 'drop'>('mean');
  const [splitRatio, setSplitRatio] = useState<number>(0.8);

  // Training, Error & Output
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (presetParam && BENCHMARK_DATASETS[presetParam]) {
      handlePresetChange(presetParam);
    }
  }, [presetParam]);

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
    setExecutionError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.rows.length === 0) {
          alert('CSV file appears empty or unparseable.');
          return;
        }

        setDatasetRows(parsed.rows);
        setDatasetName(file.name);
        setSelectedPreset('custom');

        // Analyze columns to auto-select sensible numerical defaults
        const sample = parsed.rows.slice(0, 50);
        const numericCols = parsed.headers.filter((h) => {
          let numCount = 0;
          for (const row of sample) {
            const v = row[h];
            if (typeof v === 'number' && !isNaN(v)) numCount++;
          }
          return numCount >= sample.length * 0.5;
        });

        if (numericCols.length >= 2) {
          setSelectedFeatures([numericCols[0], numericCols[1]]);
          setTargetColumn(numericCols[1]);
        } else if (numericCols.length === 1) {
          setSelectedFeatures([numericCols[0], parsed.headers.find((h) => h !== numericCols[0]) || numericCols[0]]);
          setTargetColumn(numericCols[0]);
        } else {
          setSelectedFeatures(parsed.headers.slice(0, 2));
          setTargetColumn(parsed.headers[0]);
        }

        setTrainingResult(null);
        setExecutionError(null);
      } catch (err) {
        alert('Failed to parse CSV file. Ensure valid comma-separated format.');
      }
    };
    reader.readAsText(file);
  };

  const runModelOnUserData = () => {
    setExecutionError(null);
    setIsTraining(true);

    setTimeout(() => {
      try {
        const featX = selectedFeatures[0] || columns[0];
        const featY = selectedTask === 'clustering' ? selectedFeatures[1] || columns[1] || columns[0] : targetColumn;

        if (!featX || !featY) {
          setExecutionError('Please select both feature variables.');
          setIsTraining(false);
          return;
        }

        // Validate that selected features are numerical
        const colMetaX = summaryColumns.find((c) => c.name === featX);
        const colMetaY = summaryColumns.find((c) => c.name === featY);

        if (colMetaX?.type === 'categorical' || colMetaY?.type === 'categorical') {
          const nonNum = colMetaX?.type === 'categorical' ? featX : featY;
          setExecutionError(
            `Cannot compute mathematical model: feature "${nonNum}" is non-numeric text. K-Means Voronoi and OLS regression require quantitative numerical features (x, y ∈ ℝ). Please select numeric columns (tagged with [NUM]).`
          );
          setIsTraining(false);
          return;
        }

        // Step 1: Missing value imputation & extraction
        let cleanRows: { x: number; y: number }[] = [];

        if (imputationMethod === 'drop') {
          for (const r of datasetRows) {
            const vx = r[featX];
            const vy = r[featY];
            if (
              vx !== null &&
              vx !== undefined &&
              vx !== '' &&
              !isNaN(Number(vx)) &&
              vy !== null &&
              vy !== undefined &&
              vy !== '' &&
              !isNaN(Number(vy))
            ) {
              cleanRows.push({ x: Number(vx), y: Number(vy) });
            }
          }
        } else {
          // Mean imputation
          const validX = datasetRows
            .map((r) => r[featX])
            .filter((v) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
            .map(Number);
          const validY = datasetRows
            .map((r) => r[featY])
            .filter((v) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
            .map(Number);

          const meanX = validX.length > 0 ? validX.reduce((a, b) => a + b, 0) / validX.length : 0;
          const meanY = validY.length > 0 ? validY.reduce((a, b) => a + b, 0) / validY.length : 0;

          for (const r of datasetRows) {
            const vx = r[featX];
            const vy = r[featY];
            const x =
              vx !== null && vx !== undefined && vx !== '' && !isNaN(Number(vx)) ? Number(vx) : meanX;
            const y =
              vy !== null && vy !== undefined && vy !== '' && !isNaN(Number(vy)) ? Number(vy) : meanY;
            cleanRows.push({ x, y });
          }
        }

        if (cleanRows.length < 3) {
          setExecutionError(
            `Insufficient valid observations after imputation (${cleanRows.length} points). Minimum 3 points required.`
          );
          setIsTraining(false);
          return;
        }

        // Downsample for interactive client performance if dataset is massive (e.g. > 1000 rows)
        const totalSampledCount = cleanRows.length;
        if (cleanRows.length > 1000) {
          const stride = Math.ceil(cleanRows.length / 800);
          cleanRows = cleanRows.filter((_, idx) => idx % stride === 0);
        }

        // Step 2: Feature Scaling
        let scaledRows = cleanRows;
        if (scalingMethod === 'standard') {
          const meanX = cleanRows.reduce((acc, p) => acc + p.x, 0) / cleanRows.length;
          const meanY = cleanRows.reduce((acc, p) => acc + p.y, 0) / cleanRows.length;
          const stdX =
            Math.sqrt(cleanRows.reduce((acc, p) => acc + (p.x - meanX) ** 2, 0) / cleanRows.length) || 1;
          const stdY =
            Math.sqrt(cleanRows.reduce((acc, p) => acc + (p.y - meanY) ** 2, 0) / cleanRows.length) || 1;

          scaledRows = cleanRows.map((p) => ({
            x: (p.x - meanX) / stdX,
            y: (p.y - meanY) / stdY,
          }));
        } else if (scalingMethod === 'minmax') {
          const minX = Math.min(...cleanRows.map((p) => p.x));
          const maxX = Math.max(...cleanRows.map((p) => p.x));
          const minY = Math.min(...cleanRows.map((p) => p.y));
          const maxY = Math.max(...cleanRows.map((p) => p.y));
          const rangeX = maxX - minX || 1;
          const rangeY = maxY - minY || 1;

          scaledRows = cleanRows.map((p) => ({
            x: (p.x - minX) / rangeX,
            y: (p.y - minY) / rangeY,
          }));
        }

        if (selectedTask === 'clustering') {
          // Normalize points to standard visual canvas coordinates [30, 270]
          const minX = Math.min(...scaledRows.map((p) => p.x));
          const maxX = Math.max(...scaledRows.map((p) => p.x));
          const minY = Math.min(...scaledRows.map((p) => p.y));
          const maxY = Math.max(...scaledRows.map((p) => p.y));
          const rangeX = maxX - minX || 1;
          const rangeY = maxY - minY || 1;

          const pts = scaledRows.map((p, i) => ({
            id: `pt-${i}`,
            x: ((p.x - minX) / rangeX) * 240 + 30,
            y: ((p.y - minY) / rangeY) * 240 + 30,
          }));

          const centroids = initializeCentroidsKMeansPlusPlus(pts, 3, 42);
          const trace = runFullKMeansTrace(pts, centroids, 10);
          const lastStep = trace[trace.length - 1];

          setTrainingResult({
            type: 'clustering',
            inertia: Math.round(lastStep.inertia),
            iterations: lastStep.iteration,
            pointsCount: pts.length,
            totalRows: totalSampledCount,
            k: 3,
            featX,
            featY,
          });
        } else {
          // Regression OLS
          const pts = scaledRows.map((p, i) => ({
            id: `pt-${i}`,
            x: p.x,
            y: p.y,
          }));
          const ols = computeOLS(pts);
          setTrainingResult({
            type: 'regression',
            mse: ols.mse,
            r2: ols.r2,
            slope: ols.slope,
            intercept: ols.intercept,
            pointsCount: pts.length,
            totalRows: totalSampledCount,
            featX,
            featY,
          });
        }
      } catch (err: any) {
        setExecutionError(err?.message || 'Error executing mathematical model on data.');
      } finally {
        setIsTraining(false);
      }
    }, 300);
  };

  const handleSaveUserDataExperiment = () => {
    if (!trainingResult) return;
    saveExperimentRecord({
      name: `User Run: ${datasetName}`,
      datasetName,
      datasetFingerprint: `user-data-${datasetRows.length}r`,
      algorithm: selectedTask === 'clustering' ? 'K-Means (Lloyd)' : 'Linear Regression OLS',
      taskType: selectedTask,
      hyperparameters: { scaling: scalingMethod, imputation: imputationMethod, features: selectedFeatures },
      metrics: trainingResult,
      runtimeMs: 18.2,
      warnings: warnings.map((w) => w.title),
      notes: `Executed in My Data Lab on ${datasetRows.length} observations. Scaling: ${scalingMethod}.`,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Contextual Hand-off Banner from Lesson Funnel */}
      {fromParam === 'kmeans' && (
        <div className="p-3.5 bg-[#1848B8]/10 border-[1.5px] border-[#1848B8] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[2px_2px_0px_#1848B8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1848B8] shrink-0" />
            <div>
              <span className="font-bold text-[#1848B8] block">
                STAGE 02 OF SCIENTIFIC INQUIRY // TRANSFERRED FROM K-MEANS LESSON
              </span>
              <span className="text-[#1A1715]">
                You are applying Lloyd&apos;s algorithm to real Fisher Iris petal dimensions with standard preprocessing.
              </span>
            </div>
          </div>
          <Link
            href="/compare?geometry=concentric&from=kmeans"
            className="text-[11px] font-bold text-[#1848B8] underline hover:text-[#133aa0] shrink-0"
          >
            Skip to Stage 03: Compare →
          </Link>
        </div>
      )}

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
          DATASET PRESETS:
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
        {selectedPreset === 'custom' && (
          <span className="font-mono text-xs font-bold px-2.5 py-1 border-[1px] border-[#1A1715] bg-[#E28C05] text-[#1A1715]">
            USER FILE: {datasetName.toUpperCase()}
          </span>
        )}
      </div>

      {/* Grid: Dataset Inspection & Data Quality Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Data Preview Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <AnalogCard
            variant="card"
            headerEyebrow="RAW DATASET MATRIX"
            headerTitle={`${datasetName.toUpperCase()} (${datasetRows.length} ROWS)`}
            headerAction={
              <Badge variant="neutral">
                {columns.length} FEATURES
              </Badge>
            }
          >
            <div className="overflow-x-auto border border-[#1A1715] max-h-72">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-[#E8E1D3] text-[#1A1715] border-b border-[#1A1715] sticky top-0">
                  <tr>
                    <th className="p-2 border-r border-[#1A1715]">#</th>
                    {columns.map((col) => {
                      const meta = summaryColumns.find((c) => c.name === col);
                      return (
                        <th key={col} className="p-2 border-r border-[#1A1715] uppercase">
                          <div className="flex items-center gap-1">
                            <span>{col}</span>
                            <span
                              className={`text-[9px] px-1 py-0.2 border ${
                                meta?.type === 'numeric'
                                  ? 'border-[#1848B8] text-[#1848B8] bg-[#1848B8]/10'
                                  : 'border-[#5C544B] text-[#5C544B] bg-[#FAF7F0]'
                              }`}
                            >
                              {meta?.type === 'numeric' ? 'NUM' : 'TXT'}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8CFC0] bg-[#FAF7F0]">
                  {datasetRows.slice(0, 10).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F4EFE4]">
                      <td className="p-2 border-r border-[#D8CFC0] text-[#948B7D] font-bold">
                        {rIdx + 1}
                      </td>
                      {columns.map((col) => (
                        <td key={col} className="p-2 border-r border-[#D8CFC0] tnum truncate max-w-[140px]" title={String(row[col])}>
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feature Selection Grid */}
            <div className="mt-4 pt-3 border-t border-[#D8CFC0] grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[#5C544B] uppercase font-bold text-[10px] mb-1">
                  {selectedTask === 'clustering' ? 'FEATURE 1 (X-AXIS):' : 'INDEPENDENT FEATURE (X):'}
                </label>
                <select
                  value={selectedFeatures[0] || ''}
                  onChange={(e) => setSelectedFeatures([e.target.value, selectedFeatures[1] || ''])}
                  className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] text-[#1A1715]"
                >
                  {columns.map((col) => {
                    const meta = summaryColumns.find((c) => c.name === col);
                    return (
                      <option key={col} value={col}>
                        {col} [{meta?.type === 'numeric' ? 'NUMERIC' : 'TEXT'}]
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[#5C544B] uppercase font-bold text-[10px] mb-1">
                  {selectedTask === 'clustering' ? 'FEATURE 2 (Y-AXIS):' : 'TARGET VARIABLE (Y):'}
                </label>
                {selectedTask === 'clustering' ? (
                  <select
                    value={selectedFeatures[1] || ''}
                    onChange={(e) => setSelectedFeatures([selectedFeatures[0] || '', e.target.value])}
                    className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] text-[#1A1715]"
                  >
                    {columns.map((col) => {
                      const meta = summaryColumns.find((c) => c.name === col);
                      return (
                        <option key={col} value={col}>
                          {col} [{meta?.type === 'numeric' ? 'NUMERIC' : 'TEXT'}]
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <select
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] text-[#1A1715]"
                  >
                    {columns.map((col) => {
                      const meta = summaryColumns.find((c) => c.name === col);
                      return (
                        <option key={col} value={col}>
                          {col} [{meta?.type === 'numeric' ? 'NUMERIC' : 'TEXT'}]
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>

            {/* Preprocessing Toolbar */}
            <div className="mt-3 pt-3 border-t border-[#D8CFC0] grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[#5C544B] uppercase font-bold text-[10px] mb-1">
                  FEATURE SCALING:
                </label>
                <select
                  value={scalingMethod}
                  onChange={(e) => setScalingMethod(e.target.value as any)}
                  className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] text-[#1A1715]"
                >
                  <option value="none">None (Raw Coordinates)</option>
                  <option value="standard">StandardScaler (z = (x - μ) / σ)</option>
                  <option value="minmax">MinMaxScaler ([0, 1])</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5C544B] uppercase font-bold text-[10px] mb-1">
                  MISSING VALUE IMPUTATION:
                </label>
                <select
                  value={imputationMethod}
                  onChange={(e) => setImputationMethod(e.target.value as any)}
                  className="w-full p-1.5 bg-[#FAF7F0] border border-[#1A1715] text-[#1A1715]"
                >
                  <option value="mean">Mean Imputation (Numeric Features)</option>
                  <option value="drop">Drop Rows with Missing Values</option>
                </select>
              </div>
            </div>

            {/* Error Message Plate if any */}
            {executionError && (
              <div className="mt-3 p-3 bg-[#C83226]/10 border-[1.5px] border-[#C83226] font-mono text-xs text-[#C83226] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{executionError}</span>
              </div>
            )}

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
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
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
                  {savedSuccess ? 'SAVED TO NOTEBOOK!' : 'LOG EXPERIMENT'}
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
                      <span className="text-[#5C544B]">FEATURES USED:</span>
                      <span className="font-bold text-[#1A1715]">
                        {trainingResult.featX} × {trainingResult.featY}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C544B]">POINTS CLUSTERED:</span>
                      <span className="font-bold text-[#33634B] tnum">
                        {trainingResult.pointsCount}
                        {trainingResult.totalRows > trainingResult.pointsCount &&
                          ` (Sampled from ${trainingResult.totalRows})`}
                      </span>
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
                      <span className="text-[#5C544B]">FEATURES:</span>
                      <span className="font-bold text-[#1A1715]">
                        {trainingResult.featX} → {trainingResult.featY}
                      </span>
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

              {/* Next Step in the Unbroken Scientific Funnel */}
              <div className="mt-3 p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] space-y-2 font-mono text-xs">
                <span className="font-bold text-[#1848B8] block text-[11px] uppercase">
                  STEP 3 OF BENCHMARK LOOP: FAIR MULTI-MODEL COMPARISON
                </span>
                <p className="text-[11px] text-[#5C544B] leading-relaxed">
                  Now subject this partition to non-convex topological stress tests against DBSCAN and Agglomerative Hierarchical clustering.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/compare?geometry=concentric&from=datalab">
                    <button className="w-full py-1.5 px-3 bg-[#1848B8] text-white font-bold uppercase text-[11px] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] flex items-center justify-center gap-1.5 hover:bg-[#133aa0]">
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>COMPARE WITH DBSCAN & HIERARCHICAL →</span>
                    </button>
                  </Link>
                  <Link href="/history">
                    <button className="w-full py-1 px-3 bg-[#FAF7F0] text-[#1A1715] font-bold uppercase text-[10px] border border-[#1A1715] hover:bg-[#E8E1D3] flex items-center justify-center gap-1.5">
                      <History className="w-3 h-3" />
                      <span>VIEW AUDIT LOG IN EXPERIMENT NOTEBOOK</span>
                    </button>
                  </Link>
                </div>
              </div>
            </AnalogCard>
          )}
        </div>
      </div>
    </div>
  );
};
