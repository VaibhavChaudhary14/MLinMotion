'use client';

import React from 'react';
import { VisualExampleCard } from '@/types/conceptCards';
import { InteractiveLinearRegression } from '@/components/concepts/interactive/InteractiveLinearRegression';
import { InteractiveGradientDescent } from '@/components/concepts/interactive/InteractiveGradientDescent';
import { InteractiveKMeans } from '@/components/concepts/interactive/InteractiveKMeans';
import { InteractiveLogisticRegression } from '@/components/concepts/interactive/InteractiveLogisticRegression';
import { InteractiveDecisionTree } from '@/components/concepts/interactive/InteractiveDecisionTree';
import { InteractivePCA } from '@/components/concepts/interactive/InteractivePCA';
import { InteractiveEnsemble } from '@/components/concepts/interactive/InteractiveEnsemble';
import { InteractiveFeaturesLabels } from '@/components/concepts/interactive/InteractiveFeaturesLabels';
import { InteractiveTrainTestSplit } from '@/components/concepts/interactive/InteractiveTrainTestSplit';
import { InteractiveLossFunctions } from '@/components/concepts/interactive/InteractiveLossFunctions';
import { InteractiveBiasVariance } from '@/components/concepts/interactive/InteractiveBiasVariance';
import { InteractiveEvaluationMetrics } from '@/components/concepts/interactive/InteractiveEvaluationMetrics';
import { InteractiveKNN } from '@/components/concepts/interactive/InteractiveKNN';
import { InteractiveRegularization } from '@/components/concepts/interactive/InteractiveRegularization';
import { Sliders, Eye, ArrowRight } from 'lucide-react';

interface CardVisualExampleProps {
  data: VisualExampleCard;
}

export const CardVisualExample: React.FC<CardVisualExampleProps> = ({ data }) => {
  const renderInteractiveComponent = () => {
    switch (data.interactiveType) {
      case 'linear-regression':
        return <InteractiveLinearRegression />;
      case 'gradient-descent':
        return <InteractiveGradientDescent />;
      case 'kmeans':
        return <InteractiveKMeans />;
      case 'logistic-regression':
        return <InteractiveLogisticRegression />;
      case 'decision-trees':
        return <InteractiveDecisionTree />;
      case 'pca':
        return <InteractivePCA />;
      case 'ensemble-learning':
        return <InteractiveEnsemble />;
      case 'features-labels-datasets':
        return <InteractiveFeaturesLabels />;
      case 'train-test-validation':
        return <InteractiveTrainTestSplit />;
      case 'loss-functions':
        return <InteractiveLossFunctions />;
      case 'bias-variance-tradeoff':
        return <InteractiveBiasVariance />;
      case 'evaluation-metrics':
        return <InteractiveEvaluationMetrics />;
      case 'knn':
        return <InteractiveKNN />;
      case 'regularization':
        return <InteractiveRegularization />;
      default:
        return null;
    }
  };

  return (
    <article
      id="card-visual-example"
      className="bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[3px_3px_0px_#1A1715] overflow-hidden"
    >
      {/* Top Punch Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E8E1D3] border-b-[1.5px] border-[#1A1715]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#E28C05] border border-[#1A1715]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-black text-[#1A1715]">
            CARD 03 // VISUAL WORKED EXAMPLE & LIVE SIMULATION
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#E28C05] font-bold">
          <Eye className="w-3 h-3" />
          <span>INTERACTIVE BENCH</span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Scenario Header */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#E28C05] block">
            INTUITIVE CASE SCENARIO
          </span>
          <h3 className="font-mono text-base sm:text-lg font-black text-[#1A1715] tracking-tight">
            {data.scenarioTitle}
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] leading-relaxed">
            {data.relatableScenario}
          </p>
        </div>

        {/* Inputs, Intermediates, Output Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#F4EFE4] border-[1.5px] border-[#1A1715]">
          <div className="space-y-1">
            <span className="font-mono text-[9px] uppercase font-black text-[#1848B8] block">
              01. INPUT DATA
            </span>
            <p className="font-mono text-[11px] text-[#5C544B] leading-snug">
              {data.inputsDescription}
            </p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#D8CFC0] pt-2 md:pt-0 md:pl-3">
            <span className="font-mono text-[9px] uppercase font-black text-[#E28C05] block">
              02. INTERMEDIATE STATE
            </span>
            <p className="font-mono text-[11px] text-[#5C544B] leading-snug">
              {data.intermediateDescription}
            </p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#D8CFC0] pt-2 md:pt-0 md:pl-3">
            <span className="font-mono text-[9px] uppercase font-black text-[#33634B] block">
              03. DERIVED OUTPUT
            </span>
            <p className="font-mono text-[11px] text-[#5C544B] leading-snug">
              {data.outputDescription}
            </p>
          </div>
        </div>

        {/* Interactive Live Mathematical Canvas */}
        <div className="pt-1">
          {renderInteractiveComponent()}
        </div>
      </div>
    </article>
  );
};
