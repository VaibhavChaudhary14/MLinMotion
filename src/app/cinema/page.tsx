import type { Metadata } from 'next';
import { AlgorithmCinema } from '@/components/cinema/AlgorithmCinema';

export const metadata: Metadata = {
  title: 'Algorithm Cinema — Step-by-Step Lloyd K-Means Simulation',
  description:
    'Watch Lloyd coordinate descent clustering unfold step-by-step. Inspect migrating centroids, evolving Voronoi partitions, WCSS inertia descent, and synchronized Python execution in real-time.',
  keywords: [
    'k-means visualizer',
    'lloyd algorithm step by step',
    'voronoi diagram machine learning',
    'wcss inertia convergence',
    'clustering simulation',
    'algorithm cinema',
  ],
  alternates: {
    canonical: '/cinema',
  },
  openGraph: {
    title: 'Algorithm Cinema: Step-by-Step K-Means Lloyd Simulation | ML in Motion',
    description:
      'Step-by-step interactive visual simulation of K-Means clustering. Watch centroids migrate, Voronoi cells dynamically repartition, and WCSS monotonically descend.',
    url: 'https://mlinmotion.vercel.app/cinema',
    type: 'website',
  },
};

export default function CinemaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AlgorithmCinema />
    </div>
  );
}
