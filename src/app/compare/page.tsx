import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ComparisonStudio } from '@/components/comparison/ComparisonStudio';

export const metadata: Metadata = {
  title: 'Comparison Studio — Same Data, Different Inductive Biases',
  description:
    'Compare compatible machine learning algorithms head-to-head on identical benchmark datasets. Explore predictions, decision boundaries, clustering partitions, and failure modes across concentric rings, elongated blobs, and moons.',
  keywords: [
    'algorithm comparison',
    'k-means vs dbscan',
    'inductive bias machine learning',
    'model comparison studio',
    'benchmark ML algorithms',
  ],
  alternates: {
    canonical: '/compare',
  },
  openGraph: {
    title: 'Algorithm Comparison Studio | ML in Motion',
    description:
      'Subject models to identical evaluation splits and observe where geometric assumptions succeed or fail.',
    url: 'https://mlinmotion.vercel.app/compare',
    type: 'website',
  },
};

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Suspense
        fallback={
          <div className="p-8 text-center font-mono text-xs text-[#5C544B] bg-[#FAF7F0] border-[1.5px] border-[#1A1715]">
            INITIALIZING BENCHMARK STUDIO...
          </div>
        }
      >
        <ComparisonStudio />
      </Suspense>
    </div>
  );
}
