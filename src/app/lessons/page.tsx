import type { Metadata } from 'next';
import { ConceptExplorer } from '@/components/curriculum/ConceptExplorer';

export const metadata: Metadata = {
  title: '12-Stage Machine Learning Curriculum — Guided Learning Pathway',
  description:
    'Master machine learning from first principles through a guided 12-stage curriculum. From data literacy and vector math to regression, gradient descent, trees, clustering, and model comparison.',
  keywords: [
    'machine learning curriculum',
    'ML roadmap',
    'learn ML step by step',
    'essential machine learning',
    'GATE DA machine learning',
    'first principles ML course',
  ],
  alternates: {
    canonical: '/lessons',
  },
  openGraph: {
    title: '12-Stage Machine Learning Curriculum | ML in Motion',
    description:
      'A structured visual journey through 12 core stages of machine learning. Zero black boxes, genuine math, and interactive sandboxes.',
    url: 'https://mlinmotion.vercel.app/lessons',
    type: 'website',
  },
};

export default function LessonsIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ConceptExplorer />
    </div>
  );
}
