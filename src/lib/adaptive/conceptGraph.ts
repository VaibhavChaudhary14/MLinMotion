export interface ConceptNode {
  id: string;
  title: string;
  category: 'Linear Algebra' | 'Supervised' | 'Unsupervised' | 'Foundations' | 'Optimization';
  eyebrow: string;
  description: string;
  prerequisites: string[]; // Concept IDs required before unlocking or mastering
  recommendedNext: string[];
  lessonId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const CONCEPT_GRAPH: Record<string, ConceptNode> = {
  'distance-metrics': {
    id: 'distance-metrics',
    title: 'Distance Metrics & Norms',
    category: 'Foundations',
    eyebrow: 'MATH 01 // GEOMETRY',
    description: 'Euclidean distance L2, Manhattan L1, and how metric selection shapes neighborhood geometry.',
    prerequisites: [],
    recommendedNext: ['kmeans-clustering'],
    lessonId: 'kmeans',
    difficulty: 'Beginner',
  },
  'kmeans-clustering': {
    id: 'kmeans-clustering',
    title: 'K-Means Clustering',
    category: 'Unsupervised',
    eyebrow: 'ALGO 01 // PARTITIONING',
    description: 'Centroid initialization, iterative Voronoi assignments, Lloyd algorithm convergence, and inertia.',
    prerequisites: ['distance-metrics'],
    recommendedNext: ['cluster-evaluation', 'clustering-failure-cases'],
    lessonId: 'kmeans',
    difficulty: 'Beginner',
  },
  'cluster-evaluation': {
    id: 'cluster-evaluation',
    title: 'Inertia & Silhouette Analysis',
    category: 'Unsupervised',
    eyebrow: 'EVAL 01 // INTRINSIC METRICS',
    description: 'Within-cluster sum of squares (WCSS), elbow heuristics, and silhouette coefficients.',
    prerequisites: ['kmeans-clustering'],
    recommendedNext: ['clustering-failure-cases'],
    difficulty: 'Intermediate',
  },
  'clustering-failure-cases': {
    id: 'clustering-failure-cases',
    title: 'Clustering Failure Modes & DBSCAN',
    category: 'Unsupervised',
    eyebrow: 'DIAG 01 // PATHOLOGIES',
    description: 'Why K-means fails on non-convex rings, density variations, and severe outlier presence.',
    prerequisites: ['cluster-evaluation'],
    recommendedNext: ['pca-reduction'],
    difficulty: 'Intermediate',
  },
  'linear-regression': {
    id: 'linear-regression',
    title: 'Ordinary Least Squares Regression',
    category: 'Supervised',
    eyebrow: 'ALGO 02 // CONTINUOUS PREDICTION',
    description: 'Linear hypothesis, error residuals, analytical closed-form normal equations, and MSE loss.',
    prerequisites: [],
    recommendedNext: ['loss-functions', 'gradient-descent'],
    lessonId: 'linear-regression',
    difficulty: 'Beginner',
  },
  'loss-functions': {
    id: 'loss-functions',
    title: 'Convex Loss Functions & Residuals',
    category: 'Optimization',
    eyebrow: 'MATH 02 // OBJECTIVES',
    description: 'Mean Squared Error vs Mean Absolute Error, convex bowl geometry, and residual distributions.',
    prerequisites: ['linear-regression'],
    recommendedNext: ['gradient-descent'],
    difficulty: 'Beginner',
  },
  'gradient-descent': {
    id: 'gradient-descent',
    title: 'Gradient Descent & Step Optimization',
    category: 'Optimization',
    eyebrow: 'OPTIM 01 // FIRST-ORDER UPDATES',
    description: 'Partial derivatives, learning rate overshoot, oscillation along ravines, and convergence criteria.',
    prerequisites: ['loss-functions'],
    recommendedNext: ['logistic-regression'],
    lessonId: 'gradient-descent',
    difficulty: 'Intermediate',
  },
  'logistic-regression': {
    id: 'logistic-regression',
    title: 'Logistic Regression & Classification',
    category: 'Supervised',
    eyebrow: 'ALGO 03 // PROBABILITY',
    description: 'Sigmoid activation, log-odds, decision thresholds, and binary cross-entropy.',
    prerequisites: ['gradient-descent'],
    recommendedNext: ['decision-trees'],
    lessonId: 'logistic-regression',
    difficulty: 'Intermediate',
  },
  'decision-trees': {
    id: 'decision-trees',
    title: 'Decision Trees & Partitioning',
    category: 'Supervised',
    eyebrow: 'ALGO 04 // NON-PARAMETRIC',
    description: 'Gini impurity, Information Gain entropy, recursive orthogonal axis splits, and pruning.',
    prerequisites: ['logistic-regression'],
    recommendedNext: ['pca-reduction'],
    lessonId: 'decision-trees',
    difficulty: 'Intermediate',
  },
  'pca-reduction': {
    id: 'pca-reduction',
    title: 'Principal Component Analysis (PCA)',
    category: 'Unsupervised',
    eyebrow: 'ALGO 05 // PROJECTION',
    description: 'Data centering, covariance matrices, orthogonal eigenvectors, and variance retention.',
    prerequisites: ['distance-metrics'],
    recommendedNext: [],
    lessonId: 'pca',
    difficulty: 'Advanced',
  },
};

export const LEARNING_PATHS = [
  {
    id: 'foundations',
    title: 'Path A: ML Foundations & Core Algorithms',
    description: 'Master distance geometry, clustering, continuous prediction, and optimization from scratch.',
    concepts: ['distance-metrics', 'kmeans-clustering', 'linear-regression', 'gradient-descent', 'logistic-regression'],
  },
  {
    id: 'gate-da',
    title: 'Path B: GATE DA & Interview Mastery',
    description: 'Deep mathematical foundations, analytical derivations, loss convexity, and failure cases.',
    concepts: ['loss-functions', 'gradient-descent', 'kmeans-clustering', 'cluster-evaluation', 'decision-trees', 'pca-reduction'],
  },
  {
    id: 'unsupervised-deep-dive',
    title: 'Path C: Unsupervised Discovery & Latent Space',
    description: 'Clustering geometries, density algorithms, high-dimensional projection, and variance preservation.',
    concepts: ['distance-metrics', 'kmeans-clustering', 'clustering-failure-cases', 'pca-reduction'],
  },
];
