import { Lesson } from '@/types';

export const LESSONS_REGISTRY: Record<string, Lesson> = {
  kmeans: {
    id: 'kmeans',
    algorithmId: 'kmeans',
    title: 'K-Means Clustering: Lloyd’s Algorithm & Partitioning',
    subtitle: 'From random spatial seeding to deterministic Voronoi convergence.',
    durationMinutes: 18,
    prerequisites: ['Distance Metrics', 'Euclidean Norm'],
    learningObjectives: [
      'Understand the iterative coordinate descent of Lloyd’s algorithm.',
      'Differentiate between assignment phase and centroid update phase.',
      'Recognize inertia objective minimization and its sensitivity to local minima.',
      'Identify topological failure cases on non-spherical clusters.',
    ],
    steps: [
      {
        id: 's1-hook',
        title: 'The Unlabeled Spatial Riddle',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'Imagine you run an astronomy observatory receiving coordinates of thousands of unknown stars. No labels exist. How do we mathematically decide which stars belong to distinct galactic clusters, without human preconceptions?',
      },
      {
        id: 's2-intuition',
        title: 'Geometric Gravity & Centroids',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'K-Means solves clustering by placing $K$ synthetic reference points called **centroids** ($\\boldsymbol{\\mu}_1, \\dots, \\boldsymbol{\\mu}_K$). Each data point is pulled toward its nearest centroid, creating sharp polygonal Voronoi boundary cells.',
      },
      {
        id: 's3-explore',
        title: 'Interactive Spatial Sandbox',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'kmeans-sandbox',
        contentMarkdown:
          'Test the centroid behavior directly. Watch how changing $K$ alters the geometric boundaries.',
      },
      {
        id: 's4-predict',
        title: 'Predicting the Next Step',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If a centroid has NO points assigned to it during an iteration, what happens mathematically during the update step?',
        predictionOptions: {
          question: 'What is the mathematical consequence when $|S_k| = 0$?',
          options: [
            'Division by zero occurs in the mean computation (1 / |S_k|).',
            'The centroid multiplies its coordinates by 2.',
            'The centroid automatically jumps to the origin (0, 0).',
            'Inertia becomes negative.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! Computing the arithmetic mean $\\boldsymbol{\\mu}_k = \\frac{1}{|S_k|} \\sum \\mathbf{x}^{(i)}$ divides by zero when a cluster is empty. Production implementations (like scikit-learn) re-seed empty centroids at the point furthest from all other centroids.',
        },
      },
      {
        id: 's5-reveal',
        title: 'The Lloyd Iteration Cycle',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Lloyd’s algorithm guarantees that inertia never increases between iterations. It strictly descends until no points swap partitions, achieving numerical convergence.',
      },
      {
        id: 's6-under-the-hood',
        title: 'Mathematical Formulation & Objective',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: 'J(\\mathbf{c}, \\boldsymbol{\\mu}) = \\sum_{i=1}^{m} \\left\\Vert \\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_{c^{(i)}} \\right\\Vert^2',
        contentMarkdown:
          'The objective $J$ is the Within-Cluster Sum of Squares (WCSS). In the assignment step, we fix $\\boldsymbol{\\mu}$ and minimize $J$ over $\\mathbf{c}$. In the update step, we fix $\\mathbf{c}$ and minimize $J$ over $\\boldsymbol{\\mu}$ by computing arithmetic means.',
      },
      {
        id: 's7-break-it',
        title: 'Break The Algorithm: Concentric Rings',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-kmeans-rings',
        contentMarkdown:
          'K-Means fundamentally assumes spherical clusters of comparable size. When given concentric circular data, Voronoi lines slice directly through the outer circle, failing completely. Explore this failure mode in the interactive canvas.',
      },
      {
        id: 's8-code-it',
        title: 'Scikit-Learn vs Pure NumPy',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Connect the visual physics to production scikit-learn code.',
        codeSnippet: {
          sklearn: `from sklearn.cluster import KMeans\n\n# Initialize with K-Means++ heuristic\nmodel = KMeans(n_clusters=3, init="k-means++", n_init=10, random_state=42)\nlabels = model.fit_predict(X)\ncentroids = model.cluster_centers_\ninertia = model.inertia_`,
          python: `import numpy as np\nfrom scipy.spatial.distance import cdist\n\n# Pure vector implementation of Lloyd step\ndists = cdist(X, centroids, metric="sqeuclidean")\nlabels = np.argmin(dists, axis=1)\nnew_centroids = np.array([X[labels == k].mean(axis=0) for k in range(k)])`,
          explanation: 'n_init=10 runs Lloyd 10 times with different seeds and returns the run with lowest inertia to avoid local minima traps.',
        },
      },
      {
        id: 's9-assessment',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your conceptual and mathematical understanding.',
        questions: [
          {
            id: 'km-q1',
            prompt: 'Does K-means convergence guarantee finding the global minimum of inertia J?',
            options: [
              'No, Lloyd’s algorithm is a local heuristic that can become trapped in local minima.',
              'Yes, because inertia is strictly convex in both variables simultaneously.',
              'Yes, provided we run at least 100 iterations.',
              'No, K-means never converges numerically.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'kmeans-global-optimum' },
            explanation: 'Lloyd algorithm optimizes coordinate-wise. It is NOT globally convex and is sensitive to initial centroid placement.',
            difficulty: 'intermediate',
          },
          {
            id: 'km-q2',
            prompt: 'Why does K-means fail on concentric circles (two concentric rings)?',
            options: [
              'Because Voronoi boundaries are linear hyperplanes based on Euclidean distance.',
              'Because concentric rings have zero variance.',
              'Because K-means requires all features to be strictly non-negative.',
              'Because distance metrics cannot be computed on circles.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'inertia-determines-k' },
            explanation: 'Euclidean distance to a point centroid partitions space into convex polyhedra. It cannot form non-convex ring topologies.',
            difficulty: 'intermediate',
          },
        ],
      },
      {
        id: 's10-mastery',
        title: 'Concept Synthesis & Next Milestone',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You have mastered the mechanics, objective function, and limitations of K-Means. Next recommended: Explore DBSCAN to discover how density-based algorithms solve non-convex topologies.',
      },
    ],
  },
};
