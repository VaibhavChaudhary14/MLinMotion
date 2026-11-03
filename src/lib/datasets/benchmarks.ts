import { Point2D } from '@/types';

// Deterministic Pseudo-Random Generator
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateGaussian(rand: () => number, mean: number = 0, std: number = 1): number {
  const u1 = Math.max(1e-15, rand());
  const u2 = rand();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

// 1. Separated Spherical Blobs (Ideal for K-means)
export function generateBlobs(k: number = 3, pointsPerCluster: number = 25, seed: number = 42): Point2D[] {
  const rand = seededRandom(seed);
  const centers = [
    { x: 120, y: 110 },
    { x: 380, y: 130 },
    { x: 250, y: 320 },
    { x: 450, y: 340 },
    { x: 100, y: 360 },
  ];

  const points: Point2D[] = [];
  for (let c = 0; c < k; c++) {
    const center = centers[c % centers.length];
    for (let i = 0; i < pointsPerCluster; i++) {
      const x = generateGaussian(rand, center.x, 28);
      const y = generateGaussian(rand, center.y, 28);
      points.push({
        id: `blob-${c}-${i}`,
        x: Math.max(20, Math.min(580, Number(x.toFixed(1)))),
        y: Math.max(20, Math.min(430, Number(y.toFixed(1)))),
        label: c,
        initialCluster: c,
      });
    }
  }
  return points;
}

// 2. Anisotropic / Elongated Clusters (Failure case for K-means, great for comparisons)
export function generateElongated(seed: number = 99): Point2D[] {
  const rand = seededRandom(seed);
  const points: Point2D[] = [];

  // Cluster 1: Steep diagonal line
  for (let i = 0; i < 35; i++) {
    const t = (i / 35) * 200;
    const x = 80 + t + generateGaussian(rand, 0, 10);
    const y = 80 + t * 0.8 + generateGaussian(rand, 0, 8);
    points.push({ id: `elong-0-${i}`, x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), label: 0 });
  }

  // Cluster 2: Parallel diagonal line shifted
  for (let i = 0; i < 35; i++) {
    const t = (i / 35) * 200;
    const x = 200 + t + generateGaussian(rand, 0, 10);
    const y = 200 + t * 0.8 + generateGaussian(rand, 0, 8);
    points.push({ id: `elong-1-${i}`, x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), label: 1 });
  }

  return points;
}

// 3. Concentric Rings (DBSCAN succeeds, K-means fails completely)
export function generateConcentricRings(count: number = 80, seed: number = 77): Point2D[] {
  const rand = seededRandom(seed);
  const points: Point2D[] = [];
  const cx = 300;
  const cy = 240;

  // Inner ring (r = 45)
  for (let i = 0; i < Math.floor(count * 0.35); i++) {
    const angle = rand() * 2 * Math.PI;
    const r = 45 + generateGaussian(rand, 0, 6);
    points.push({
      id: `ring-inner-${i}`,
      x: Number((cx + r * Math.cos(angle)).toFixed(1)),
      y: Number((cy + r * Math.sin(angle)).toFixed(1)),
      label: 0,
    });
  }

  // Outer ring (r = 135)
  for (let i = 0; i < Math.floor(count * 0.65); i++) {
    const angle = rand() * 2 * Math.PI;
    const r = 135 + generateGaussian(rand, 0, 8);
    points.push({
      id: `ring-outer-${i}`,
      x: Number((cx + r * Math.cos(angle)).toFixed(1)),
      y: Number((cy + r * Math.sin(angle)).toFixed(1)),
      label: 1,
    });
  }

  return points;
}

// 4. Linear Regression Dataset with Outliers
export function generateLinearRegressionData(noiseStd: number = 18, count: number = 30, addOutliers: boolean = false, seed: number = 101): Point2D[] {
  const rand = seededRandom(seed);
  const points: Point2D[] = [];
  const slope = 0.65;
  const intercept = 60;

  for (let i = 0; i < count; i++) {
    const x = 40 + (i / count) * 480 + generateGaussian(rand, 0, 10);
    const y = intercept + slope * x + generateGaussian(rand, 0, noiseStd);
    points.push({
      id: `reg-${i}`,
      x: Math.max(20, Math.min(580, Number(x.toFixed(1)))),
      y: Math.max(20, Math.min(430, Number(y.toFixed(1)))),
    });
  }

  if (addOutliers) {
    points.push(
      { id: 'outlier-1', x: 500, y: 70, isOutlier: true },
      { id: 'outlier-2', x: 80, y: 390, isOutlier: true }
    );
  }

  return points;
}

// 5. Benchmark Tabular Datasets for My Data Lab
export const BENCHMARK_DATASETS = {
  irisSubset: {
    name: 'Fisher Iris (Petal Geometry)',
    task: 'clustering' as const,
    columns: ['petal_length', 'petal_width', 'species'],
    target: 'species',
    rows: [
      { petal_length: 1.4, petal_width: 0.2, species: 'setosa' },
      { petal_length: 1.5, petal_width: 0.2, species: 'setosa' },
      { petal_length: 1.3, petal_width: 0.2, species: 'setosa' },
      { petal_length: 1.6, petal_width: 0.4, species: 'setosa' },
      { petal_length: 1.7, petal_width: 0.4, species: 'setosa' },
      { petal_length: 4.7, petal_width: 1.4, species: 'versicolor' },
      { petal_length: 4.5, petal_width: 1.5, species: 'versicolor' },
      { petal_length: 4.9, petal_width: 1.5, species: 'versicolor' },
      { petal_length: 4.0, petal_width: 1.3, species: 'versicolor' },
      { petal_length: 4.6, petal_width: 1.5, species: 'versicolor' },
      { petal_length: 6.0, petal_width: 2.5, species: 'virginica' },
      { petal_length: 5.1, petal_width: 1.9, species: 'virginica' },
      { petal_length: 5.9, petal_width: 2.1, species: 'virginica' },
      { petal_length: 5.6, petal_width: 1.8, species: 'virginica' },
      { petal_length: 6.6, petal_width: 2.1, species: 'virginica' },
    ],
  },
  studentExam: {
    name: 'Student Study Hours vs Score',
    task: 'regression' as const,
    columns: ['hours_studied', 'practice_exams', 'exam_score'],
    target: 'exam_score',
    rows: [
      { hours_studied: 2.5, practice_exams: 1, exam_score: 48 },
      { hours_studied: 3.2, practice_exams: 2, exam_score: 56 },
      { hours_studied: 4.5, practice_exams: 3, exam_score: 68 },
      { hours_studied: 5.0, practice_exams: 2, exam_score: 72 },
      { hours_studied: 6.1, practice_exams: 4, exam_score: 82 },
      { hours_studied: 7.2, practice_exams: 5, exam_score: 89 },
      { hours_studied: 8.0, practice_exams: 5, exam_score: 94 },
      { hours_studied: 9.2, practice_exams: 6, exam_score: 98 },
      { hours_studied: 1.5, practice_exams: 0, exam_score: 38 },
      { hours_studied: 3.8, practice_exams: 3, exam_score: 63 },
    ],
  },
};
