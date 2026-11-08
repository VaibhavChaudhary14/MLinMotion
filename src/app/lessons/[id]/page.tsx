import type { Metadata } from 'next';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { LESSONS_REGISTRY, getAllLessons } from '@/lib/curriculum/lessonsData';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((l) => ({ id: l.id }));
}

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const lesson = LESSONS_REGISTRY[params.id];
  if (!lesson) {
    return {
      title: 'Lesson | ML in Motion',
    };
  }

  return {
    title: `${lesson.title} — Stage ${lesson.stageCode} | ML in Motion`,
    description:
      lesson.subtitle ||
      `Interactive step-by-step laboratory lesson for ${lesson.title}. Explore visual intuition, live coordinate sandboxes, and Python code.`,
    alternates: {
      canonical: `/lessons/${params.id}`,
    },
    openGraph: {
      title: `${lesson.title} | ML in Motion`,
      description: lesson.subtitle,
      url: `https://mlinmotion.vercel.app/lessons/${params.id}`,
      type: 'article',
    },
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LessonPlayer lessonId={params.id} />
    </div>
  );
}
