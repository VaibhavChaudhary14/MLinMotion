import { GradientDescentWorkbench } from '@/components/simulation/GradientDescentWorkbench';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gradient Descent Optimization Laboratory — Cinema // ML in Motion',
  description:
    'Interactive Analog Bauhaus workbench exploring 1D and 2D Gradient Descent dynamics, spectral stability conditions, and the 5 learning-rate convergence regimes.',
};

export default function GradientDescentCinemaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <GradientDescentWorkbench />
    </div>
  );
}
