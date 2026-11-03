'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalogCard } from '@/components/ui/AnalogCard';
import { AnalogButton } from '@/components/ui/AnalogButton';
import { Badge } from '@/components/ui/Badge';
import {
  getAdaptiveRecommendations,
  getLearnerConceptStates,
  getSavedExperiments,
  Recommendation,
} from '@/lib/adaptive/recommender';
import { LEARNING_PATHS } from '@/lib/adaptive/conceptGraph';
import {
  Play,
  Film,
  FlaskConical,
  Database,
  GitCompare,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  History,
  CheckCircle2,
} from 'lucide-react';

export const LearningDashboard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [conceptStates, setConceptStates] = useState<any>({});
  const [experiments, setExperiments] = useState<any[]>([]);

  useEffect(() => {
    setRecommendations(getAdaptiveRecommendations());
    setConceptStates(getLearnerConceptStates());
    setExperiments(getSavedExperiments().slice(0, 3));
  }, []);

  const topRec = recommendations[0] || {
    title: 'K-Means: Voronoi Partition Mechanics',
    eyebrow: 'TODAY’S RECOMMENDATION',
    reason: 'Recommended core foundation: Master distance metrics and iterative coordinate descent.',
    targetUrl: '/cinema',
  };

  const masteredCount = Object.values(conceptStates).filter((s: any) => s.masteryScore >= 80).length;
  const inProgressCount = Object.values(conceptStates).filter(
    (s: any) => s.masteryScore > 0 && s.masteryScore < 80
  ).length;

  return (
    <div className="space-y-6">
      {/* Hero Studio Banner */}
      <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[4px_4px_0px_#1A1715] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-[#C83226] border border-[#1A1715]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C83226]">
              PERSONAL COMPUTING LABORATORY
            </span>
          </div>
          <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#1A1715] tracking-tight">
            Welcome to ML in Motion
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#5C544B] max-w-2xl mt-1 leading-relaxed">
            Understand how machine learning algorithms reason internally. Step through real coordinate computations, manipulate hyperparameter levers, and break models to see where mathematical assumptions fail.
          </p>
        </div>

        {/* Quick Launch Cinema Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <Link href="/cinema">
            <AnalogButton variant="primary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>CONTINUE CINEMA</span>
            </AnalogButton>
          </Link>
          <Link href="/lab">
            <AnalogButton variant="secondary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <FlaskConical className="w-4 h-4" />
              <span>OPEN LAB</span>
            </AnalogButton>
          </Link>
        </div>
      </div>

      {/* Primary 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today's Recommendation & Learning Paths */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Adaptive Recommendation */}
          <AnalogCard
            variant="card"
            headerEyebrow="ADAPTIVE RECOMMENDATION ENGINE"
            headerTitle="TODAY'S PRIORITY ACTIVITY"
            headerAction={<Badge variant="vermilion">HIGH PRIORITY</Badge>}
          >
            <div className="p-4 bg-[#E8E1D3]/50 border-[1.5px] border-[#1A1715] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-[#1848B8] tracking-widest">
                  {topRec.eyebrow}
                </span>
                <h3 className="font-mono text-lg font-bold text-[#1A1715]">{topRec.title}</h3>
                <p className="font-mono text-xs text-[#5C544B] leading-relaxed max-w-xl">
                  {topRec.reason}
                </p>
              </div>

              <Link href={topRec.targetUrl}>
                <AnalogButton variant="ultramarine" size="md" className="flex items-center gap-1.5 shrink-0">
                  <span>START ACTIVITY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnalogButton>
              </Link>
            </div>
          </AnalogCard>

          {/* Core Curated Learning Paths */}
          <AnalogCard
            variant="card"
            headerEyebrow="CURRICULUM ARCHITECTURE"
            headerTitle="STRUCTURED LEARNING PATHWAYS"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {LEARNING_PATHS.map((path, idx) => (
                <div
                  key={path.id}
                  className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] flex flex-col justify-between hover:shadow-[2px_2px_0px_#1A1715] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#C83226]">
                        PATH 0{idx + 1}
                      </span>
                      <span className="font-mono text-[9px] text-[#948B7D]">
                        {(path.stages || (path as any).concepts)?.length || 0} UNITS
                      </span>
                    </div>
                    <h4 className="font-mono text-xs font-bold text-[#1A1715] leading-tight">
                      {path.title}
                    </h4>
                    <p className="font-mono text-[11px] text-[#5C544B] leading-snug">
                      {path.description}
                    </p>
                  </div>

                  <Link href="/lessons" className="mt-3">
                    <button className="w-full font-mono text-[10px] font-bold uppercase py-1 border border-[#1A1715] bg-[#E8E1D3] hover:bg-[#F0EAE0] flex items-center justify-center gap-1">
                      <span>ENTER PATH</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </AnalogCard>

          {/* Quick Instrument Launchpad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { title: 'ALGORITHM CINEMA', href: '/cinema', icon: Film, color: '#C83226' },
              { title: 'INTERACTIVE LAB', href: '/lab', icon: FlaskConical, color: '#1848B8' },
              { title: 'MY DATA LAB', href: '/datalab', icon: Database, color: '#E28C05' },
              { title: 'COMPARISON STUDIO', href: '/compare', icon: GitCompare, color: '#33634B' },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#1A1715] shadow-[2px_2px_0px_#1A1715] hover:shadow-[3px_3px_0px_#1A1715] active:translate-x-[1px] active:translate-y-[1px] transition-all flex flex-col items-center text-center gap-1.5 group"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center border border-[#1A1715]"
                    style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#1A1715] group-hover:text-[#C83226] uppercase">
                    {tool.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Mastery Gauges & Retention Scheduler */}
        <div className="lg:col-span-4 space-y-6">
          {/* Concept Mastery Radar */}
          <AnalogCard
            variant="card"
            headerEyebrow="KNOWLEDGE TRACER"
            headerTitle="CONCEPT MASTERY GAUGE"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                <span className="text-[#5C544B]">VERIFIED MASTERED:</span>
                <span className="font-bold text-[#33634B] tnum">{masteredCount} CONCEPTS</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                <span className="text-[#5C544B]">IN PROGRESS:</span>
                <span className="font-bold text-[#E28C05] tnum">{inProgressCount} CONCEPTS</span>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-[#5C544B] mb-1">
                  <span>FOUNDATION CURRICULUM</span>
                  <span className="font-bold">
                    {Math.round(((masteredCount * 100) / 10) || 20)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#D8CFC0] border border-[#1A1715] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.2)]">
                  <div
                    className="h-full bg-[#1848B8]"
                    style={{ width: `${Math.round(((masteredCount * 100) / 10) || 20)}%` }}
                  />
                </div>
              </div>
            </div>
          </AnalogCard>

          {/* Spaced Repetition Queue */}
          <AnalogCard
            variant="card"
            headerEyebrow="SPACED REPETITION ENGINE"
            headerTitle="RETENTION REVIEW QUEUE"
            headerAction={<Badge variant="amber">DUE</Badge>}
          >
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#1A1715]">K-Means Local Minima Traps</span>
                  <span className="text-[10px] text-[#C83226] font-bold">DUE TODAY</span>
                </div>
                <p className="text-[11px] text-[#5C544B]">
                  Spaced review: Re-evaluate why Lloyd algorithm is coordinate-wise greedy.
                </p>
                <Link href="/cinema" className="block mt-2">
                  <span className="text-[10px] font-bold text-[#1848B8] hover:underline">
                    REVIEW IN 3 MIN →
                  </span>
                </Link>
              </div>
            </div>
          </AnalogCard>

          {/* Recent Notebook Experiments */}
          <AnalogCard
            variant="card"
            headerEyebrow="LAB NOTEBOOK"
            headerTitle="RECENT SAVED RUNS"
          >
            <div className="space-y-2 font-mono text-xs">
              {experiments.length === 0 ? (
                <div className="text-[#948B7D] text-xs">No runs saved yet.</div>
              ) : (
                experiments.map((exp) => (
                  <div key={exp.id} className="p-2 bg-[#E8E1D3]/50 border border-[#D8CFC0]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1715] text-[11px] truncate">
                        {exp.name}
                      </span>
                      <span className="text-[9px] text-[#948B7D]">
                        {new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5C544B] block">{exp.algorithm}</span>
                  </div>
                ))
              )}
              <Link href="/history" className="block pt-1 text-center font-mono text-[10px] text-[#1848B8] font-bold hover:underline">
                VIEW FULL EXPERIMENT NOTEBOOK →
              </Link>
            </div>
          </AnalogCard>
        </div>
      </div>
    </div>
  );
};
