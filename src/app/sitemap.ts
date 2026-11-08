import { MetadataRoute } from 'next';
import { ALL_CONCEPT_CARDS } from '@/lib/curriculum/conceptCardsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mlinmotion.vercel.app';
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/concepts`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lessons`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lab`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cinema`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/datalab`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/history`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Dynamic concept cards (14 units)
  const conceptRoutes: MetadataRoute.Sitemap = ALL_CONCEPT_CARDS.map((concept) => ({
    url: `${baseUrl}/concepts/${concept.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Core algorithm lessons
  const lessonIds = [
    'linear-regression',
    'gradient-descent',
    'kmeans',
    'logistic-regression',
    'decision-trees',
    'pca',
    'model-evaluation',
    'model-comparison',
  ];
  const lessonRoutes: MetadataRoute.Sitemap = lessonIds.map((id) => ({
    url: `${baseUrl}/lessons/${id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...conceptRoutes, ...lessonRoutes];
}
