import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Analytics } from '@vercel/analytics/next';

const BASE_URL = 'https://mlinmotion.vercel.app';

export const viewport: Viewport = {
  themeColor: '#FAF7F0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ML in Motion — Stop Memorizing Algorithms. Start Seeing How They Work.',
    template: '%s | ML in Motion',
  },
  description:
    'An interactive visual laboratory and textbook for Machine Learning. Watch algorithms operate through genuine simulations, manipulate inputs, observe intermediate calculations, and connect intuition with Python.',
  applicationName: 'ML in Motion',
  authors: [{ name: 'ML in Motion Team', url: BASE_URL }],
  generator: 'Next.js',
  keywords: [
    'machine learning',
    'algorithm visualizer',
    'learn machine learning visually',
    'interactive machine learning',
    'k-means clustering visualizer',
    'gradient descent simulation',
    'linear regression residuals',
    'logistic regression interactive',
    'decision tree visualizer',
    'PCA dimensionality reduction step by step',
    'GATE DA machine learning prep',
    'data science visual textbook',
    'algorithm comparison studio',
    'analog bauhaus',
    'first principles machine learning',
    'ordinary least squares derivation',
    'confusion matrix interactive',
    'bias variance tradeoff',
    'L1 L2 regularization intuitive',
    'Lloyd algorithm simulation',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'ML in Motion',
  publisher: 'ML in Motion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ML in Motion — Stop Memorizing Algorithms. Start Seeing How They Work.',
    description:
      'Explore machine learning through interactive visualizations, deterministic simulations, mathematical derivations, and Python implementations.',
    url: BASE_URL,
    siteName: 'ML in Motion',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ML in Motion — Stop Memorizing Algorithms. Start Seeing How They Work.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ML in Motion — Interactive Machine Learning Lab',
    description:
      'Stop memorizing algorithms. Start seeing how they work. Step through real coordinate iterations and examine mathematical derivations line-by-line.',
    site: '@mlinmotion',
    creator: '@mlinmotion',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'ML in Motion',
        description: 'An interactive visual laboratory and textbook for Machine Learning.',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/concepts?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'ML in Motion',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/icon.svg`,
          width: 32,
          height: 32,
        },
        sameAs: ['https://github.com/mlinmotion'],
      },
      {
        '@type': 'EducationalApplication',
        '@id': `${BASE_URL}/#app`,
        name: 'Machine Learning in Motion',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any modern web browser',
        url: BASE_URL,
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
      },
      {
        '@type': 'Course',
        '@id': `${BASE_URL}/#course`,
        name: 'The Essential 20% Machine Learning Curriculum',
        description:
          '12 guided visual stages covering foundational to advanced machine learning mechanics from first principles.',
        provider: {
          '@id': `${BASE_URL}/#organization`,
        },
        educationalCredentialAwarded: 'First-Principles Conceptual Mastery',
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Online',
          courseWorkload: 'PT15H',
        },
      },
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
