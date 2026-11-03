'use client';

import React, { useState, useEffect } from 'react';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import { getSavedExperiments } from '@/lib/adaptive/recommender';
import { ExperimentRecord } from '@/types';
import { History, Download, Trash2, Sliders, ExternalLink } from 'lucide-react';

export const ExperimentHistory: React.FC = () => {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([]);
  const [selectedExp, setSelectedExp] = useState<ExperimentRecord | null>(null);

  useEffect(() => {
    const exps = getSavedExperiments();
    setExperiments(exps);
    if (exps.length > 0) setSelectedExp(exps[0]);
  }, []);

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(experiments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ml_in_motion_experiments_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715]">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
            LAB JOURNAL // REPRODUCIBLE AUDIT
          </span>
          <h1 className="font-mono text-2xl font-black text-[#1A1715] tracking-tight">
            Personal Experiment Notebook
          </h1>
          <p className="font-mono text-xs text-[#5C544B] mt-0.5">
            Full parameter configurations, metrics, and dataset fingerprints for scientific reproducibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AnalogButton variant="secondary" size="sm" onClick={exportJSON} className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIT LOG</span>
          </AnalogButton>
        </div>
      </div>

      {/* Grid: List of Runs & Inspector Plate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Run List (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              onClick={() => setSelectedExp(exp)}
              className={`p-3 border-[1.5px] cursor-pointer transition-all ${
                selectedExp?.id === exp.id
                  ? 'bg-[#E8E1D3] border-[#1A1715] shadow-[2.5px_2.5px_0px_#1A1715]'
                  : 'bg-[#FAF7F0] border-[#1A1715] hover:bg-[#F4EFE4]'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-1">
                <span className="font-bold text-[#1A1715] truncate max-w-[200px]">{exp.name}</span>
                <span className="text-[10px] text-[#948B7D]">
                  {new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <Badge variant="dark" size="sm">
                  {exp.algorithm}
                </Badge>
                <span className="text-[#5C544B] truncate">{exp.datasetName}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Run Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedExp ? (
            <AnalogCard
              variant="card"
              headerEyebrow="RUN INSPECTOR"
              headerTitle={selectedExp.name.toUpperCase()}
              headerAction={
                <Badge variant="sage">{selectedExp.taskType.toUpperCase()}</Badge>
              }
            >
              <div className="space-y-4 font-mono text-xs">
                {/* Metadata Strip */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                  <div>
                    <span className="text-[10px] text-[#5C544B] block">DATASET FINGERPRINT</span>
                    <span className="font-bold text-[#1A1715]">{selectedExp.datasetFingerprint}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C544B] block">TIMESTAMP</span>
                    <span className="font-bold text-[#1A1715]">
                      {new Date(selectedExp.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C544B] block">RUNTIME</span>
                    <span className="font-bold text-[#1848B8]">{selectedExp.runtimeMs} ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C544B] block">ALGORITHM</span>
                    <span className="font-bold text-[#1A1715]">{selectedExp.algorithm}</span>
                  </div>
                </div>

                {/* Hyperparameters Plate */}
                <div>
                  <span className="font-bold text-[#C83226] block uppercase mb-1">
                    HYPERPARAMETERS & CONFIG
                  </span>
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#1A1715] space-y-1">
                    {Object.entries(selectedExp.hyperparameters).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[#5C544B]">{k}:</span>
                        <span className="font-bold text-[#1A1715]">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Metrics */}
                <div>
                  <span className="font-bold text-[#1848B8] block uppercase mb-1">
                    EVALUATION METRICS
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedExp.metrics).map(([k, v]) => (
                      <div key={k} className="p-2 bg-[#FAF7F0] border border-[#1A1715]">
                        <span className="text-[10px] text-[#5C544B] block">{k}</span>
                        <span className="font-bold text-sm text-[#1A1715] tnum">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedExp.notes && (
                  <div className="p-2.5 bg-[#F4EFE4] border border-[#D8CFC0]">
                    <span className="font-bold text-[#5C544B] block text-[10px] uppercase mb-0.5">
                      EXPERIMENT OBSERVATIONS
                    </span>
                    <p className="text-[#1A1715] leading-relaxed">{selectedExp.notes}</p>
                  </div>
                )}
              </div>
            </AnalogCard>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-[#948B7D]">
              Select an experiment from the left column to inspect parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
