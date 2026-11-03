import { notFound } from 'next/navigation';
import { ALL_CONCEPT_CARDS, getConceptCardById } from '@/lib/curriculum/conceptCardsData';
import { ConceptDeckView } from '@/components/concepts/ConceptDeckView';
import { Metadata } from 'next';

interface ConceptPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return ALL_CONCEPT_CARDS.map((c) => ({
    id: c.id,
  }));
}

export function generateMetadata({ params }: ConceptPageProps): Metadata {
  const concept = getConceptCardById(params.id);
  if (!concept) {
    return {
      title: 'Concept Not Found | ML in Motion',
    };
  }

  return {
    title: `${concept.title} // Visual Concept Cards | ML in Motion`,
    description: concept.subtitle,
  };
}

export default function ConceptPage({ params }: ConceptPageProps) {
  const concept = getConceptCardById(params.id);

  if (!concept) {
    notFound();
  }

  return <ConceptDeckView concept={concept} />;
}
