export interface Misconception {
  id: string;
  name: string;
  category: 'clustering' | 'optimization' | 'regression' | 'evaluation' | 'general';
  flawedReasoning: string;
  targetedExplanation: string;
  suggestedAction: string;
}

export const MISCONCEPTIONS_CATALOG: Record<string, Misconception> = {
  'kmeans-global-optimum': {
    id: 'kmeans-global-optimum',
    name: 'K-Means Reaches Global Optimum',
    category: 'clustering',
    flawedReasoning: 'Believing that running K-means to convergence guarantees finding the true global minimum of inertia.',
    targetedExplanation: 'Lloyd’s algorithm is a greedy coordinate descent. It converges to a LOCAL minimum of inertia $J(c, \\mu)$. Bad random centroid initialization traps the algorithm in suboptimal partitions.',
    suggestedAction: 'Open Break-The-Algorithm: Test "Poor Initialization" to watch K-means get stuck in local traps.',
  },
  'inertia-determines-k': {
    id: 'inertia-determines-k',
    name: 'Lower Inertia Always Means Better K',
    category: 'clustering',
    flawedReasoning: 'Believing that increasing K is always better because inertia monotonically decreases.',
    targetedExplanation: 'When $K = N$ (each point is its own centroid), inertia drops to zero, but cluster generalizability is completely lost. We look for the "Elbow" inflection or maximize the Silhouette Score, not raw zero inertia.',
    suggestedAction: 'Review Cluster Evaluation: Compare Inertia vs Silhouette score curve across $K=2 \\dots 6$.',
  },
  'gradient-is-loss': {
    id: 'gradient-is-loss',
    name: 'Confusing Gradient with Loss Value',
    category: 'optimization',
    flawedReasoning: 'Thinking a high loss implies a large gradient, or a small loss implies a small gradient.',
    targetedExplanation: 'Loss $J(\\theta)$ is the height of the cost terrain (the error). The gradient $\\nabla J(\\theta)$ is the SLOPE (direction of steepest ascent). A model can be near an optimum with flat gradient but moderate loss, or on a steep cliff with zero loss.',
    suggestedAction: 'Step through Gradient Descent Lab: Watch how gradient approaches zero as the needle flattens.',
  },
  'high-lr-speeds-up': {
    id: 'high-lr-speeds-up',
    name: 'Larger Learning Rate Always Converges Faster',
    category: 'optimization',
    flawedReasoning: 'Assuming that multiplying $\\alpha$ by 10 will reach minimum 10 times sooner without side-effects.',
    targetedExplanation: 'If $\\alpha > 2 / L$ (where $L$ is the Lipschitz constant of the gradient), step sizes overshoot the convex valley, causing catastrophic numerical divergence ($J \\to \\infty$).',
    suggestedAction: 'Run Break-The-Algorithm: Increase learning rate to 1.8 and observe explosive oscillations.',
  },
  'r2-is-correlation': {
    id: 'r2-is-correlation',
    name: 'R² Equals Correlation Coefficient',
    category: 'regression',
    flawedReasoning: 'Treating $R^2$ as simply $r$ or assuming $R^2$ can never be negative.',
    targetedExplanation: 'While $R^2 = r^2$ for simple 1D OLS with an intercept, $R^2 = 1 - \\text{SSE}/\\text{SST}$ can actually be negative if an arbitrary non-optimal or out-of-sample model performs worse than predicting the horizontal mean line $\\bar{y}$.',
    suggestedAction: 'Inspect Ordinary Least Squares: Drag the manual prediction line to see negative $R^2$.',
  },
  'pca-preserves-labels': {
    id: 'pca-preserves-labels',
    name: 'PCA Preserves Class Separability',
    category: 'evaluation',
    flawedReasoning: 'Assuming unsupervised PCA maximizes classification boundary margin.',
    targetedExplanation: 'PCA maximizes total feature VARIANCE $\\text{Var}(X)$, completely agnostic to target labels $y$. High-variance dimensions can consist of pure uninformative noise while the class separation lies along a low-variance axis.',
    suggestedAction: 'Review PCA Lab: Inspect explained variance vs projection accuracy.',
  },
};
