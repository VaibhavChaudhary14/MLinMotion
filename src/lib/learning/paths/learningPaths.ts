/**
 * ML in Motion — Curated Structured Learning Paths
 * Structured modules connecting mathematical intuition, interactive workbenches, and practice.
 */

import type { LearningPath } from './types.ts';

export const STRUCTURED_LEARNING_PATHS: Record<string, LearningPath> = {
  // ---------------------------------------------------------------------------
  // PATH 1: OPTIMIZATION ALGORITHMS (FLAGSHIP PATH)
  // ---------------------------------------------------------------------------
  'path-optimization': {
    id: 'path-optimization',
    title: 'Optimization Algorithms & Gradient Dynamics',
    subtitle: 'From partial derivatives to anisotropic ravines and non-convex saddle points',
    category: 'specialized',
    estimatedHours: 4.5,
    isPrimaryFlagship: true,
    bannerColor: '#C83226', // Vermilion
    targetAudience: 'Learners seeking rigorous mathematical intuition for how modern optimizers navigate loss manifolds.',
    modules: [
      {
        id: 'opt-mod-foundations',
        title: 'Module 1: Loss Landscapes & Differential Foundations',
        description: 'Understand loss manifolds, directional gradients, and quadratic bowls.',
        conceptIds: [
          'math-functions',
          'math-derivatives',
          'math-partial-derivatives',
          'math-gradients',
          'opt-loss-functions',
        ],
      },
      {
        id: 'opt-mod-gradient-descent',
        title: 'Module 2: Gradient Descent & Spectral Regimes',
        description: 'Step-by-step updates, learning rate thresholds, limit cycles, and divergence.',
        conceptIds: [
          'opt-gradient-descent',
          'opt-learning-rate',
          'opt-convergence-regimes',
        ],
      },
      {
        id: 'opt-mod-curvature-pathologies',
        title: 'Module 3: Curvature, Saddles & Adaptive Momentum',
        description: 'Ill-conditioned Hessians, negative curvature escape, Polyak momentum, and Adam.',
        conceptIds: [
          'math-hessians',
          'opt-anisotropic-valleys',
          'opt-saddle-points',
          'opt-momentum-adam',
          'opt-multimodal-landscapes',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // PATH 2: UNSUPERVISED LEARNING & CLUSTERING (FLAGSHIP PATH)
  // ---------------------------------------------------------------------------
  'path-clustering': {
    id: 'path-clustering',
    title: 'Unsupervised Learning & Lloyd’s K-Means',
    subtitle: 'Coordinate geometry, center of mass descent, D² seeding, and partition failure modes',
    category: 'specialized',
    estimatedHours: 4.0,
    isPrimaryFlagship: true,
    bannerColor: '#1848B8', // Ultramarine
    targetAudience: 'Learners mastering unsupervised coordinate partitioning, distance metrics, and clustering bounds.',
    modules: [
      {
        id: 'clust-mod-geometry',
        title: 'Module 1: Coordinate Geometry & Metric Foundations',
        description: 'Euclidean distance isotropy, feature standardization, and arithmetic mean centers of mass.',
        conceptIds: [
          'math-functions',
          'clust-distance-metrics',
          'clust-centroids',
        ],
      },
      {
        id: 'clust-mod-lloyd',
        title: 'Module 2: Lloyd’s Algorithm & Two-Stage Convergence',
        description: 'Voronoi cell boundaries and Selim-Ismail two-stage monotonic coordinate descent.',
        conceptIds: [
          'clust-kmeans-lloyd',
          'clust-wcss-monotonicity',
        ],
      },
      {
        id: 'clust-mod-seeding-failures',
        title: 'Module 3: K-Means++ Seeding & Partition Traps',
        description: 'D² probabilistic seeding, expected O(log K) approximation, model parsimony, and empty cluster collapse.',
        conceptIds: [
          'clust-kmeans-plus-plus',
          'clust-model-complexity',
          'clust-symmetric-equilibria',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // PATH 3: MATHEMATICAL FOUNDATIONS FOR ML
  // ---------------------------------------------------------------------------
  'path-math-for-ml': {
    id: 'path-math-for-ml',
    title: 'Mathematical Foundations for Machine Learning',
    subtitle: 'Calculus, multivariable gradients, and Hessian matrices from geometric first principles',
    category: 'core',
    estimatedHours: 3.0,
    isPrimaryFlagship: false,
    bannerColor: '#E28C05', // Amber
    targetAudience: 'Engineers building foundational mathematical literacy for optimization and modeling.',
    modules: [
      {
        id: 'math-mod-single-variable',
        title: 'Module 1: Functions & Single-Variable Calculus',
        description: 'Scalar mappings, tangent lines, and linear approximation.',
        conceptIds: [
          'math-functions',
          'math-derivatives',
        ],
      },
      {
        id: 'math-mod-multivariable',
        title: 'Module 2: Multivariable Gradients & Second-Order Curvature',
        description: 'Partial derivatives, directional derivatives, gradient vectors, and the Hessian matrix.',
        conceptIds: [
          'math-partial-derivatives',
          'math-gradients',
          'math-hessians',
          'opt-loss-functions',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // PATH 4: MACHINE LEARNING FOUNDATIONS
  // ---------------------------------------------------------------------------
  'path-ml-foundations': {
    id: 'path-ml-foundations',
    title: 'Machine Learning Foundations Core',
    subtitle: 'The essential core: optimization, distance metrics, and clustering',
    category: 'core',
    estimatedHours: 5.0,
    isPrimaryFlagship: false,
    bannerColor: '#33634B', // Sage Green
    targetAudience: 'Beginners seeking an intuition-first entry into fundamental ML mechanics.',
    modules: [
      {
        id: 'mlf-mod-opt',
        title: 'Module 1: The Optimization Loop',
        description: 'Objective loss functions, gradient descent updates, and step-size dynamics.',
        conceptIds: [
          'math-derivatives',
          'math-gradients',
          'opt-loss-functions',
          'opt-gradient-descent',
          'opt-learning-rate',
        ],
      },
      {
        id: 'mlf-mod-clust',
        title: 'Module 2: Unsupervised Grouping',
        description: 'Distance calculations, centers of mass, and cluster assignment heuristics.',
        conceptIds: [
          'clust-distance-metrics',
          'clust-centroids',
          'clust-kmeans-lloyd',
          'clust-model-complexity',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // PATH 5: GATE DA MACHINE LEARNING PREPARATION
  // ---------------------------------------------------------------------------
  'path-gate-da': {
    id: 'path-gate-da',
    title: 'GATE DA Machine Learning & Optimization',
    subtitle: 'Curriculum-aligned practice for the official GATE Data Science & AI syllabus',
    category: 'examination',
    estimatedHours: 6.0,
    isPrimaryFlagship: false,
    bannerColor: '#1A1715', // Ink Black
    targetAudience: 'Candidates preparing for GATE Data Science & AI (Calculus, Optimization, and Unsupervised Learning sections).',
    modules: [
      {
        id: 'gate-mod-calculus-opt',
        title: 'Module 1: Calculus & Optimization (GATE DA Syllabus)',
        description: 'Maxima and minima of functions, gradients, Hessians, and first-order gradient descent.',
        conceptIds: [
          'math-derivatives',
          'math-gradients',
          'math-hessians',
          'opt-gradient-descent',
          'opt-learning-rate',
          'opt-convergence-regimes',
          'opt-saddle-points',
        ],
      },
      {
        id: 'gate-mod-unsupervised',
        title: 'Module 2: Clustering Algorithms (GATE DA Syllabus)',
        description: 'K-Means, distance metrics, objective inertia function, initial seeding, and convergence guarantees.',
        conceptIds: [
          'clust-distance-metrics',
          'clust-centroids',
          'clust-kmeans-lloyd',
          'clust-wcss-monotonicity',
          'clust-kmeans-plus-plus',
          'clust-model-complexity',
        ],
      },
    ],
  },
};

/**
 * Returns all concept IDs in order across all modules of a path.
 */
export function getPathConceptIds(path: LearningPath): string[] {
  const ids: string[] = [];
  for (const mod of path.modules) {
    for (const cId of mod.conceptIds) {
      if (!ids.includes(cId)) {
        ids.push(cId);
      }
    }
  }
  return ids;
}
