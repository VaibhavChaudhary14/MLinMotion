import { Metadata } from 'next';
import { DiagnosticQuizEngine } from '@/components/quiz/DiagnosticQuizEngine';

export const metadata: Metadata = {
  title: 'Diagnostic Quiz & Knowledge Benchmark | ML in Motion',
  description:
    'Test your mathematical and algorithmic machine learning reasoning against 12 verified diagnostic problems. Instant feedback, misconception diagnosis, and zero-PII client-side tracking.',
  openGraph: {
    title: 'Diagnostic Quiz & Knowledge Benchmark | ML in Motion',
    description:
      'Rigorous machine learning diagnostic assessment covering Optimization, Supervised, Unsupervised, and Evaluation metrics.',
    type: 'website',
  },
};

export default function QuizPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DiagnosticQuizEngine />
    </div>
  );
}
