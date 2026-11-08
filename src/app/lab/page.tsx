import type { Metadata } from 'next';
import { InteractiveMLLab } from '@/components/lab/InteractiveMLLab';

export const metadata: Metadata = {
  title: 'Interactive ML Lab — 5 Computational Parameter Sandboxes',
  description:
    'Hands-on parameter workbenches for Linear Regression, Gradient Descent, Logistic Regression, Decision Trees, and Principal Component Analysis (PCA). Drag data points, tune hyperparameters, and inspect instant mathematical derivations.',
  keywords: [
    'machine learning sandbox',
    'linear regression interactive',
    'gradient descent workbench',
    'logistic regression threshold',
    'decision tree visualizer',
    'PCA covariance eigenvalue simulation',
  ],
  alternates: {
    canonical: '/lab',
  },
  openGraph: {
    title: 'Interactive ML Lab: 5 Computational Sandboxes | ML in Motion',
    description:
      'Manipulate parameters, inject noise, drag coordinates, and inspect real-time mathematical derivations across 5 core ML algorithms.',
    url: 'https://mlinmotion.vercel.app/lab',
    type: 'website',
  },
};

export default function LabPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <InteractiveMLLab />
    </div>
  );
}
