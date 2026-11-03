import { LessonPlayer } from '@/components/lessons/LessonPlayer';

interface LessonPageProps {
  params: {
    id: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LessonPlayer lessonId={params.id} />
    </div>
  );
}
