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
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4EFE4] text-[#1A1715] flex flex-col antialiased selection:bg-[#E28C05]/30 selection:text-[#1A1715]">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
