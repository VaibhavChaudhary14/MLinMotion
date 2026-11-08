import type { Metadata } from 'next';
import { LearningDashboard } from '@/components/dashboard/LearningDashboard';

export const metadata: Metadata = {
  title: 'Learning Dashboard & Adaptive Knowledge Tracker',
  description:
    'Track your personal machine learning concept mastery, review recommendations, view saved experiment runs, and manage spaced repetition intervals.',
  keywords: [
    'machine learning dashboard',
    'adaptive learning tracker',
    'concept mastery radar',
    'ML revision schedule',
  ],
  alternates: {
    canonical: '/dashboard',
  },
  openGraph: {
    title: 'Adaptive Learning Dashboard | ML in Motion',
    description:
      'Personalized machine learning recommendation engine, concept mastery tracking, spaced repetition schedule, and misconception history.',
    url: 'https://mlinmotion.vercel.app/dashboard',
    type: 'website',
  },
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LearningDashboard />
    </div>
  );
}
