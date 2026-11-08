import type { Metadata } from 'next';
import { ExperimentHistory } from '@/components/history/ExperimentHistory';

export const metadata: Metadata = {
  title: 'Experiment Notebook & Scientific Audit Log',
  description:
    'Reproducible scientific journal: full hyperparameter tables, training metrics, dataset fingerprints, and client-side JSON export.',
  keywords: [
    'machine learning experiment tracking',
    'reproducible ML journal',
    'audit log hyperparameter history',
  ],
  alternates: {
    canonical: '/history',
  },
  openGraph: {
    title: 'Experiment Notebook & Audit Log | ML in Motion',
    description:
      'Inspect past experimental runs, compare hyperparameter records, and review verified metric outcomes.',
    url: 'https://mlinmotion.vercel.app/history',
    type: 'website',
  },
};

export default function HistoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ExperimentHistory />
    </div>
  );
}
