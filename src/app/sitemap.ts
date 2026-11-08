import { MetadataRoute } from 'next';
import { ALL_CONCEPT_CARDS } from '@/lib/curriculum/conceptCardsData';
import { getAllLessons } from '@/lib/curriculum/lessonsData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mlinmotion.vercel.app';
  const currentDate = new Date().toISOString();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/lessons`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/concepts`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/cinema`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cinema/gradient-descent`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/lab`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/datalab`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/quiz`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/history`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Dynamic concept cards (14 units)
  const conceptRoutes: MetadataRoute.Sitemap = ALL_CONCEPT_CARDS.map((concept) => ({
    url: `${baseUrl}/concepts/${concept.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // All 12 curriculum stages
  const lessonRoutes: MetadataRoute.Sitemap = getAllLessons().map((lesson) => ({
    url: `${baseUrl}/lessons/${lesson.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...conceptRoutes, ...lessonRoutes];
}
