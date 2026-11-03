import { ConceptLibrary } from '@/components/concepts/ConceptLibrary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visual Concept Cards Library | ML in Motion',
  description:
    'Structured explanatory concept cards for machine learning algorithms: definition, working pipeline, interactive worked examples, variants, code, and failure modes.',
};

export default function ConceptsPage() {
  return <ConceptLibrary />;
}
