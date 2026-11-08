import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MyDataLab } from '@/components/datalab/MyDataLab';

export const metadata: Metadata = {
  title: 'My Data Lab — Custom CSV Ingestion, Preprocessing & Quality Audit',
  description:
    'Bring your own data into the lab. Upload CSV datasets, run automated data quality audits (missing values, 1.5×IQR outliers), apply StandardScaler/MinMaxScaler, and execute machine learning models with zero server-side leakage.',
  keywords: [
    'custom CSV machine learning',
    'data quality audit tool',
    'data preprocessing studio',
    'client-side ML training',
    'standard scaler minmax scaler',
  ],
  alternates: {
    canonical: '/datalab',
  },
  openGraph: {
    title: 'My Data Lab: Bring Your Own Data | ML in Motion',
    description:
      'Inspect data quality, preprocessing, evaluation and model limitations on custom CSV files or curated benchmarks.',
    url: 'https://mlinmotion.vercel.app/datalab',
    type: 'website',
  },
};

export default function DataLabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense
        fallback={
          <div className="p-8 text-center font-mono text-xs text-[#5C544B] bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
            INITIALIZING SCIENTIFIC WORKBENCH...
          </div>
        }
      >
        <MyDataLab />
      </Suspense>
    </div>
  );
}
