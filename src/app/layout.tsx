import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'ML in Motion — Stop Memorizing Algorithms. Start Seeing How They Work.',
  description:
    'An interactive visual laboratory and textbook for Machine Learning. Watch algorithms operate through genuine simulations, manipulate inputs, observe intermediate calculations, and connect intuition with Python.',
  keywords: [
    'machine learning',
    'algorithm visualizer',
    'k-means',
    'gradient descent',
    'interactive ML',
    'linear regression',
    'GATE DA',
    'analog bauhaus',
  ],
  authors: [{ name: 'ML in Motion Team' }],
  openGraph: {
    title: 'ML in Motion — Interactive Machine Learning Lab',
    description:
      'Understand how algorithms think, experiment with your own data, and discover why different models produce different results.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalApplication',
    name: 'Machine Learning in Motion',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    url: 'https://mlinmotion.vercel.app',
    description:
      'An interactive visual laboratory and textbook for Machine Learning. Watch algorithms operate through genuine simulations, manipulate inputs, observe intermediate calculations, and connect intuition with Python.',
    license: 'https://opensource.org/licenses/MIT',
    educationalLevel: 'Beginner to Advanced (Undergraduate / GATE DA)',
    teaches: [
      'Linear Regression and Ordinary Least Squares',
      'Gradient Descent and First-Order Optimization',
      'K-Means Clustering and Lloyd Coordinate Descent',
      'Logistic Regression and Binary Cross-Entropy',
      'Decision Trees, Gini Impurity and Entropy',
      'Principal Component Analysis (PCA) and Spectral Decomposition',
      'Ensemble Learning, Bagging and Boosting',
      'Bias-Variance Tradeoff and Regularization (L1 Lasso, L2 Ridge)',
      'Evaluation Metrics, Confusion Matrix, ROC-AUC and Precision-Recall',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#F4EFE4] text-[#1A1715] flex flex-col antialiased selection:bg-[#E28C05]/30 selection:text-[#1A1715]">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
