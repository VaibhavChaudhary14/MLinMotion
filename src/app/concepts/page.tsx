import { ConceptLibrary } from '@/components/concepts/ConceptLibrary';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '14 Visual Concept Cards — Interactive Machine Learning Reference Deck',
  description:
    '14 structured explanatory concept cards for machine learning algorithms: nutshell definition, working mechanics, interactive simulations, variants, Python implementation, trade-offs, and failure modes.',
  keywords: [
    'machine learning concept cards',
    'algorithm flashcards',
    'visual ML reference',
    'linear regression concept card',
    'k-means concept card',
    'gradient descent concept card',
    'decision tree concept card',
    'PCA concept card',
  ],
  alternates: {
    canonical: '/concepts',
  },
  openGraph: {
    title: '14 Visual Concept Cards Library | ML in Motion',
    description:
      'Structured 7-layer explanatory concept decks covering core Supervised, Unsupervised, Optimization, and Evaluation algorithms.',
    url: 'https://mlinmotion.vercel.app/concepts',
    type: 'website',
  },
};

export default function ConceptsPage() {
  return <ConceptLibrary />;
}
