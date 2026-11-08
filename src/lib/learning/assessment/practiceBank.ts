/**
 * ML in Motion — Curated Practice Question Bank
 * Rigorous conceptual, numerical, and code-interpretation problems.
 */

import type { PracticeQuestion, PracticeEvaluationResult } from './types.ts';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ---------------------------------------------------------------------------
  // 1. MATHEMATICAL DERIVATIVES & GRADIENTS
  // ---------------------------------------------------------------------------
  {
    id: 'prac-math-func-01',
    conceptId: 'math-functions',
    title: 'Level Sets on Quadratic Bowls',
    format: 'multiple_choice',
    prompt: 'For the objective function J(θ₁, θ₂) = 1/2 θ₁² + 5 θ₂², what geometric shape do the contours (level curves where J = constant) form on the (θ₁, θ₂) parameter plane?',
    options: [
      { id: 'opt_a', text: 'Concentric circles centered at (0, 0)', isCorrect: false },
      { id: 'opt_b', text: 'Concentric ellipses elongated horizontally along θ₁', isCorrect: true },
      { id: 'opt_c', text: 'Concentric ellipses elongated vertically along θ₂', isCorrect: false },
      { id: 'opt_d', text: 'Hyperbolic saddle curves', isCorrect: false },
    ],
    explanation: {
      summary: 'Because the coefficient of θ₂² is 10× greater than that of θ₁², for a fixed level J = C, the semi-major axis along θ₁ is √10 ≈ 3.16× longer than along θ₂, producing ellipses stretched horizontally along θ₁.',
      mathDerivation: '\\frac{\\theta_1^2}{2C} + \\frac{\\theta_2^2}{2C / 10} = 1 \\implies a = \\sqrt{2C}, \\quad b = \\sqrt{0.2C}',
      pitfall: 'Do not confuse the direction of greater curvature (steep θ₂) with the direction of contour elongation (shallow θ₁).',
    },
    syllabusTag: 'Foundational',
  },
  {
    id: 'prac-math-deriv-01',
    conceptId: 'math-derivatives',
    title: '1D Quadratic Gradient Calculation',
    format: 'numerical',
    prompt: 'Given objective function J(θ) = 1/2 (θ - 3.5)² + 1, calculate the exact numerical derivative ∇J(θ) evaluated at θ = 1.0.',
    numericalTarget: {
      answer: -2.5,
      tolerance: 0.01,
      targetLabel: '∇J(1.0)',
    },
    explanation: {
      summary: 'Using the power rule and chain rule, d/dθ [1/2 (θ - 3.5)² + 1] = θ - 3.5. At θ = 1.0, ∇J(1.0) = 1.0 - 3.5 = -2.5.',
      mathDerivation: '\\nabla J(\\theta) = \\theta - 3.5 \\implies \\nabla J(1.0) = 1.0 - 3.5 = -2.5',
    },
    syllabusTag: 'Foundational',
  },
  {
    id: 'prac-math-grad-01',
    conceptId: 'math-gradients',
    title: 'Direction of Steepest Descent',
    format: 'multiple_choice',
    prompt: 'Why is the negative gradient direction -∇J(θ) chosen for gradient descent parameter updates rather than any other unit vector?',
    options: [
      { id: 'opt_a', text: 'Because -∇J(θ) minimizes the directional derivative D_u J = ∇J · u by Cauchy-Schwarz inequality', isCorrect: true },
      { id: 'opt_b', text: 'Because the gradient is always parallel to contour level curves', isCorrect: false },
      { id: 'opt_c', text: 'Because it guarantees reaching the global minimum in 1 step for all functions', isCorrect: false },
      { id: 'opt_d', text: 'Because second derivatives are always zero along -∇J', isCorrect: false },
    ],
    explanation: {
      summary: 'By the Cauchy-Schwarz inequality, the directional derivative ∇J · u is minimized when the unit vector u points in the exact opposite direction of ∇J, i.e., u = -∇J / ||∇J||.',
      mathDerivation: '\\min_{\\|\\mathbf{u}\\|=1} \\nabla J(\\boldsymbol{\\theta}) \\cdot \\mathbf{u} = -\\|\\nabla J(\\boldsymbol{\\theta})\\| \\quad \\text{at } \\mathbf{u} = -\\frac{\\nabla J}{\\|\\nabla J\\|}',
    },
    syllabusTag: 'GATE DA',
  },
  {
    id: 'prac-math-hess-01',
    conceptId: 'math-hessians',
    title: 'Hessian Eigenvalues & Local Geometry',
    format: 'multiple_choice',
    prompt: 'At a stationary point θ* where ∇J(θ*) = 0, the Hessian matrix has eigenvalues λ₁ = +3.0 and λ₂ = -1.5. What is the geometric nature of this point?',
    options: [
      { id: 'opt_a', text: 'Strict local minimum because λ₁ > 0', isCorrect: false },
      { id: 'opt_b', text: 'Strict local maximum because |λ₁| > |λ₂|', isCorrect: false },
      { id: 'opt_c', text: 'Saddle point (indefinite Hessian with both positive and negative eigenvalues)', isCorrect: true },
      { id: 'opt_d', text: 'Degenerate flat plateau', isCorrect: false },
    ],
    explanation: {
      summary: 'A stationary point is a strict local minimum if and only if all eigenvalues of the Hessian are strictly positive (positive definite). Having mixed signs (λ₁ > 0, λ₂ < 0) proves the point is an indefinite saddle point: curving upward along the eigenvector of λ₁ and downward along that of λ₂.',
      mathDerivation: '\\lambda_{\\min}(\\mathbf{H}) = -1.5 < 0 < 3.0 = \\lambda_{\\max}(\\mathbf{H}) \\implies \\text{Indefinite Saddle}',
      pitfall: 'A point is NOT a minimum just because one eigenvalue is positive.',
    },
    syllabusTag: 'GATE DA',
  },

  // ---------------------------------------------------------------------------
  // 2. OPTIMIZATION & GRADIENT DESCENT
  // ---------------------------------------------------------------------------
  {
    id: 'prac-opt-gd-01',
    conceptId: 'opt-gradient-descent',
    title: 'One-Step Parameter Update Calculation',
    format: 'numerical',
    prompt: 'For J(θ) = 1/2 (θ - 3.5)² + 1 with current position θ₀ = 0.50 and learning rate α = 0.40: calculate the exact value of parameter θ₁ after 1 vanilla gradient descent step.',
    numericalTarget: {
      answer: 1.70,
      tolerance: 0.02,
      targetLabel: 'θ₁',
    },
    explanation: {
      summary: '∇J(0.50) = 0.50 - 3.5 = -3.00. The update rule θ₁ = θ₀ - α ∇J(θ₀) yields 0.50 - (0.40)(-3.00) = 0.50 + 1.20 = 1.70.',
      mathDerivation: '\\theta_1 = 0.50 - 0.40 \\cdot (0.50 - 3.5) = 0.50 - 0.40 \\cdot (-3.00) = 1.70',
    },
    syllabusTag: 'Foundational',
  },
  {
    id: 'prac-opt-lr-01',
    conceptId: 'opt-learning-rate',
    title: 'Critical Stability Threshold α_crit',
    format: 'numerical',
    prompt: 'On quadratic bowl J(θ) = 1/2 θ₁² + 5 θ₂² with Hessian eigenvalues λ₁ = 1 and λ₂ = 10: what is the maximum learning rate α_crit above which gradient descent will diverge along the steep vertical axis?',
    numericalTarget: {
      answer: 0.20,
      tolerance: 0.01,
      targetLabel: 'α_crit',
    },
    explanation: {
      summary: 'For a quadratic objective with Hessian H, stability along eigendirection i requires the contraction factor |1 - α λ_i| < 1, which implies α < 2 / λ_i. The critical threshold for the entire system is governed by the maximum eigenvalue: α_crit = 2 / λ_max = 2 / 10 = 0.20.',
      mathDerivation: '\\alpha_{\\text{crit}} = \\frac{2}{\\lambda_{\\max}(\\mathbf{H})} = \\frac{2}{10} = 0.20',
    },
    syllabusTag: 'GATE DA',
  },
  {
    id: 'prac-opt-regimes-01',
    conceptId: 'opt-convergence-regimes',
    title: 'Conservative Limit Cycle Boundary',
    format: 'multiple_choice',
    prompt: 'For 1D quadratic J(θ) = 1/2(θ - 3.5)² + 1 (H = 1), setting learning rate α = 2.0 produces which exact mathematical behavior?',
    options: [
      { id: 'opt_a', text: 'Geometric divergence to ±∞', isCorrect: false },
      { id: 'opt_b', text: 'Persistent undamped 2-cycle (conservative limit cycle) bouncing between symmetric points', isCorrect: true },
      { id: 'opt_c', text: 'Deadbeat one-step convergence to 3.5', isCorrect: false },
      { id: 'opt_d', text: 'Damped exponential decay toward 3.5', isCorrect: false },
    ],
    explanation: {
      summary: 'The error recurrence is e_{t+1} = (1 - α) e_t. When α = 2.0, 1 - α = -1.0. The error flips sign every step with magnitude unchanged (|e_{t+1}| = |-1| |e_t| = |e_t|), resulting in an eternal undamped 2-cycle.',
      mathDerivation: '\\theta_{t+1} - 3.5 = (1 - 2.0)(\\theta_t - 3.5) = -(\\theta_t - 3.5)',
      pitfall: 'Do not claim α = 2.0 diverges; divergence requires spectral radius |1 - α| > 1 (i.e. α > 2.0).',
    },
    syllabusTag: 'GATE DA',
  },
  {
    id: 'prac-opt-saddle-01',
    conceptId: 'opt-saddle-points',
    title: 'First-Order Vanilla GD on Saddle Point',
    format: 'multiple_choice',
    prompt: 'Consider saddle objective J(θ₁, θ₂) = 1/2 θ₁² - 1/2 θ₂² initialized directly on the ridge at (0.5, 0.0). Why does Vanilla GD converge to (0, 0) and permanently stall there?',
    options: [
      { id: 'opt_a', text: 'Because (0, 0) is a global minimum of the function', isCorrect: false },
      { id: 'opt_b', text: 'Because along θ₂, initial gradient ∂J/∂θ₂ = -θ₂ = 0, so the update Δθ₂ = -α(0) = 0 leaves the parameter on the unstable ridge with zero symmetry-breaking force', isCorrect: true },
      { id: 'opt_c', text: 'Because learning rate drops to zero automatically at saddles', isCorrect: false },
      { id: 'opt_d', text: 'Because the Hessian determinant is positive at the origin', isCorrect: false },
    ],
    explanation: {
      summary: 'Along θ₁, ∇J₁ = θ₁ > 0, so θ₁ contracts to 0. Along θ₂, because initial θ₂ = 0, ∇J₂ = -θ₂ = 0. The update Δθ₂ is exactly 0. Without noise, perturbation, or negative-curvature descent, vanilla GD has no component to push it off the ridge.',
      mathDerivation: '\\nabla J(0, 0) = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} \\implies \\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\alpha \\mathbf{0} = \\boldsymbol{\\theta}_t',
    },
    syllabusTag: 'Advanced Practice',
  },

  // ---------------------------------------------------------------------------
  // 3. CLUSTERING & UNSUPERVISED LEARNING
  // ---------------------------------------------------------------------------
  {
    id: 'prac-clust-dist-01',
    conceptId: 'clust-distance-metrics',
    title: 'Feature Scaling & Euclidean Isotropy',
    format: 'multiple_choice',
    prompt: 'In a 2D dataset, Feature 1 (annual income) has range [10,000, 100,000] and Feature 2 (age) has range [18, 70]. What happens if K-Means is applied without standardization?',
    options: [
      { id: 'opt_a', text: 'Both features contribute equally to Euclidean distance', isCorrect: false },
      { id: 'opt_b', text: 'Feature 1 accounts for >99.9% of squared Euclidean distance, effectively reducing clustering to a 1D partition on income alone', isCorrect: true },
      { id: 'opt_c', text: 'K-Means fails to converge due to division by zero', isCorrect: false },
      { id: 'opt_d', text: 'Centroids snap to the geometric median instead of arithmetic mean', isCorrect: false },
    ],
    explanation: {
      summary: 'Euclidean distance d(x, μ)² = (x₁ - μ₁)² + (x₂ - μ₂)² assumes unit scale across all coordinates. A variance ratio of 10^8 vs 10^2 means differences in age are completely dwarfed by income variance.',
      mathDerivation: '\\frac{\\Delta x_1^2}{\\Delta x_1^2 + \\Delta x_2^2} \\approx \\frac{10^8}{10^8 + 10^3} \\approx 0.99999',
    },
    syllabusTag: 'Foundational',
  },
  {
    id: 'prac-clust-cent-01',
    conceptId: 'clust-centroids',
    title: 'Center of Mass Closed-Form Calculation',
    format: 'numerical',
    prompt: 'Cluster S_k contains three 2D points: (2.0, 4.0), (4.0, 8.0), and (6.0, 6.0). What is the exact x-coordinate of the updated centroid μ_k,x?',
    numericalTarget: {
      answer: 4.0,
      tolerance: 0.01,
      targetLabel: 'μ_k,x',
    },
    explanation: {
      summary: 'By the center of mass formula, μ_k,x = (2.0 + 4.0 + 6.0) / 3 = 12.0 / 3 = 4.0.',
      mathDerivation: '\\mu_{k,x} = \\frac{1}{3} \\sum_{i=1}^3 x_i = \\frac{2.0 + 4.0 + 6.0}{3} = 4.0',
    },
    syllabusTag: 'Foundational',
  },
  {
    id: 'prac-clust-wcss-01',
    conceptId: 'clust-wcss-monotonicity',
    title: 'Selim-Ismail Two-Stage Monotonicity',
    format: 'multiple_choice',
    prompt: 'According to the Selim-Ismail Theorem for Lloyd’s K-Means algorithm, why is WCSS mathematically guaranteed never to increase on any valid step?',
    options: [
      { id: 'opt_a', text: 'Because points are reassigned to nearest centroids (Stage 1 minimizer) and centroids move to cluster arithmetic means (Stage 2 minimizer) under the same objective J', isCorrect: true },
      { id: 'opt_b', text: 'Because learning rate is decayed exponentially after each iteration', isCorrect: false },
      { id: 'opt_c', text: 'Because K-Means optimizes a convex objective function with a single global basin', isCorrect: false },
      { id: 'opt_d', text: 'Because Voronoi boundaries are restricted to orthogonal hyperplanes', isCorrect: false },
    ],
    explanation: {
      summary: 'Lloyd’s algorithm is exact alternating coordinate descent on J(c, μ). In Stage 1, Voronoi assignment argmin_k ||x - μ_k||² minimizes J with respect to discrete assignments c. In Stage 2, arithmetic mean minimizes J with respect to continuous coordinates μ. Both stages satisfy J_new ≤ J_old.',
      mathDerivation: 'J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t+1)}) \\le J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t)}) \\le J(c^{(t)}, \\boldsymbol{\\mu}^{(t)})',
    },
    syllabusTag: 'GATE DA',
  },
  {
    id: 'prac-clust-kmpp-01',
    conceptId: 'clust-kmeans-plus-plus',
    title: 'K-Means++ Theoretical Guarantee',
    format: 'multiple_choice',
    prompt: 'What theoretical guarantee does the K-Means++ D² initialization algorithm provide according to Arthur & Vassilvitskii (2007)?',
    options: [
      { id: 'opt_a', text: 'It guarantees finding the exact global minimum clustering on every run', isCorrect: false },
      { id: 'opt_b', text: 'It guarantees an expected approximation ratio E[φ] ≤ 8(ln K + 2)φ_opt on clustering potential φ (WCSS)', isCorrect: true },
      { id: 'opt_c', text: 'It guarantees WCSS < 150 on any 3-cluster dataset regardless of scale', isCorrect: false },
      { id: 'opt_d', text: 'It guarantees convergence in exactly 2 Lloyd iterations', isCorrect: false },
    ],
    explanation: {
      summary: 'Arthur & Vassilvitskii proved that by selecting initial centroids with probability proportional to D(x)², the expected clustering potential satisfies E[φ] ≤ 8(ln K + 2)φ_opt. It does NOT guarantee the global minimum or an arbitrary fixed numerical threshold on a single stochastic run.',
      mathDerivation: '\\mathbb{E}[\\phi] \\le 8(\\ln K + 2)\\phi_{\\text{opt}} = O(\\log K) \\cdot \\phi_{\\text{opt}}',
    },
    syllabusTag: 'GATE DA',
  },
  {
    id: 'prac-clust-kchoice-01',
    conceptId: 'clust-model-complexity',
    title: 'WCSS Behavior with Increasing K',
    format: 'multiple_choice',
    prompt: 'As the number of clusters K increases from 1 to N (number of data points), how does optimal WCSS behave mathematically?',
    options: [
      { id: 'opt_a', text: 'Decreases monotonically, reaching exactly 0 when K = N', isCorrect: true },
      { id: 'opt_b', text: 'Follows an inverted U-shaped curve peaking at K = N/2', isCorrect: false },
      { id: 'opt_c', text: 'Remains strictly constant because total dataset variance is fixed', isCorrect: false },
      { id: 'opt_d', text: 'Fluctuates randomly depending on the random seed', isCorrect: false },
    ],
    explanation: {
      summary: 'Adding cluster centroids introduces additional free parameters, so min_μ J_K ≤ min_μ J_(K-1) holds mathematically. When K = N, every point is its own centroid, giving WCSS = 0. This is why minimizing WCSS alone will always falsely favor larger K without an Elbow heuristic or BIC penalty.',
      mathDerivation: '\\min_{\\boldsymbol{\\mu}} J_K \\le \\min_{\\boldsymbol{\\mu}} J_{K-1}, \\quad J_N = \\sum_{i=1}^N \\|\\mathbf{x}_i - \\mathbf{x}_i\\|^2 = 0',
    },
    syllabusTag: 'Foundational',
  },
];

/**
 * Evaluates a user answer against a practice question.
 */
export function evaluatePracticeQuestion(
  question: PracticeQuestion,
  userAnswer: unknown
): PracticeEvaluationResult {
  if (question.format === 'multiple_choice') {
    const selectedOptionId = String(userAnswer);
    const correctOption = question.options?.find((o) => o.isCorrect);
    const isCorrect = selectedOptionId === correctOption?.id;

    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      userAnswerSummary: selectedOptionId,
      actualAnswerSummary: correctOption?.id || '',
      explanation: question.explanation.summary,
      mathDerivation: question.explanation.mathDerivation,
    };
  }

  if (question.format === 'numerical') {
    const num = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer));
    const target = question.numericalTarget?.answer ?? 0;
    const tolerance = question.numericalTarget?.tolerance ?? 0.05;
    const diff = Math.abs(num - target);
    const isCorrect = !isNaN(num) && diff <= tolerance;

    return {
      isCorrect,
      score: isCorrect ? 1.0 : 0.0,
      userAnswerSummary: isNaN(num) ? 'Invalid' : num.toFixed(3),
      actualAnswerSummary: target.toFixed(3),
      explanation: question.explanation.summary,
      mathDerivation: question.explanation.mathDerivation,
    };
  }

  return {
    isCorrect: false,
    score: 0.0,
    userAnswerSummary: String(userAnswer),
    actualAnswerSummary: 'Unsupported format',
    explanation: 'Unsupported question format.',
  };
}
