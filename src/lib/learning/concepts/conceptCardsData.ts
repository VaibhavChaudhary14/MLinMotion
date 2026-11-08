/**
 * ML in Motion — Concept Cards Registry for all 20 Concept Knowledge Graph Nodes
 * 
 * Provides rich pedagogical, intuitive, and mathematical reference data for every
 * node in the concept Directed Acyclic Graph (DAG).
 */

import type { ConceptSubject, ConceptDifficulty } from './types.ts';

export interface ConceptCardData {
  id: string;
  name: string;
  subject: ConceptSubject;
  difficulty: ConceptDifficulty;
  categoryTitle: string;
  plainLanguageDefinition: string;
  intuitiveExplanation: string;
  mathematicalFormulation: {
    formulaLabel: string;
    latex: string;
    explanation: string;
  };
  workedExample: {
    title: string;
    steps: string[];
    numericalOutcome: string;
  };
  commonMisconception: {
    misconception: string;
    correction: string;
  };
  prerequisites: string[];
  downstreamConcepts: string[];
  linkedSimulation: {
    title: string;
    url: string;
    isImplemented: boolean;
    description: string;
  };
  practiceQuestionIds: string[];
  relatedChallenges: string[];
}

export const CONCEPT_CARDS_MAP: Record<string, ConceptCardData> = {
  // ---------------------------------------------------------------------------
  // 1. MATHEMATICAL FOUNDATIONS
  // ---------------------------------------------------------------------------
  'math-functions': {
    id: 'math-functions',
    name: 'Functions & Coordinate Manifolds',
    subject: 'mathematics',
    difficulty: 'foundational',
    categoryTitle: 'Differential Calculus & Geometry',
    plainLanguageDefinition:
      'A mathematical mapping that assigns each set of input parameters to a single scalar loss or outcome value.',
    intuitiveExplanation:
      'Think of a function as a physical terrain: your current position on the map is defined by your coordinate parameters, and the elevation at that exact spot is the value of the function (loss).',
    mathematicalFormulation: {
      formulaLabel: 'SCALAR LOSS MANIFOLD',
      latex: 'J: \\mathbb{R}^n \\to \\mathbb{R}, \\quad \\boldsymbol{\\theta} \\mapsto J(\\boldsymbol{\\theta})',
      explanation: '\\boldsymbol{\\theta} \\in \\mathbb{R}^n is the n-dimensional parameter vector and J(\\boldsymbol{\\theta}) is the scalar loss.',
    },
    workedExample: {
      title: 'Evaluating 1D Quadratic Loss',
      steps: [
        'Objective: J(\\theta) = 0.5(\\theta - 3.5)^2 + 1',
        'Substitute \\theta = 0.5: J(0.5) = 0.5(0.5 - 3.5)^2 + 1',
        'Evaluate discrepancy: 0.5(-3.0)^2 + 1 = 0.5(9.0) + 1 = 4.5 + 1',
      ],
      numericalOutcome: 'J(0.5) = 5.50',
    },
    commonMisconception: {
      misconception: 'Believing that minimizing a function means parameters must reach zero.',
      correction: 'Optimization seeks the argument \\theta* that minimizes the loss value J(\\theta*), which rarely occurs at the origin \\theta = 0.',
    },
    prerequisites: [],
    downstreamConcepts: ['math-derivatives', 'clust-distance-metrics'],
    linkedSimulation: {
      title: 'Function Manifold & Contour Viewer',
      url: '/concepts/math-for-ml',
      isImplemented: true,
      description: 'Explore 1D slices and 2D contour projections of scalar loss manifolds.',
    },
    practiceQuestionIds: ['prac-math-func-01', 'prac-math-func-02'],
    relatedChallenges: [],
  },

  'math-derivatives': {
    id: 'math-derivatives',
    name: 'Single-Variable Derivatives',
    subject: 'mathematics',
    difficulty: 'foundational',
    categoryTitle: 'Differential Calculus & Geometry',
    plainLanguageDefinition:
      'The instantaneous rate of change of a scalar function with respect to its single input parameter.',
    intuitiveExplanation:
      'The derivative is the local slope of the hill beneath your feet. A positive slope means moving right climbs uphill; a negative slope means moving right descends downhill.',
    mathematicalFormulation: {
      formulaLabel: 'FIRST-ORDER DERIVATIVE',
      latex: "J'(\\theta) = \\lim_{\\Delta \\theta \\to 0} \\frac{J(\\theta + \\Delta \\theta) - J(\\theta)}{\\Delta \\theta}",
      explanation: "J'(\\theta) measures sensitivity: how much the loss changes per infinitesimal parameter displacement.",
    },
    workedExample: {
      title: 'Differentiating a Parabolic Loss',
      steps: [
        'Objective: J(\\theta) = 0.5(\\theta - 3.5)^2 + 1',
        'Apply the chain rule: d/d\\theta [0.5 u^2 + 1] = 0.5 \\cdot 2u \\cdot (1) = u',
        'Where u = \\theta - 3.5, giving J\'(\\theta) = \\theta - 3.5',
        'Evaluate at \\theta = 0.5: J\'(0.5) = 0.5 - 3.5',
      ],
      numericalOutcome: "J'(0.5) = -3.00",
    },
    commonMisconception: {
      misconception: 'Assuming a negative derivative implies the loss is negative.',
      correction: 'The derivative represents the slope (direction of tilt), not the elevation. A negative derivative means the function is decreasing toward the right, even if J(\\theta) > 0.',
    },
    prerequisites: ['math-functions'],
    downstreamConcepts: ['math-partial-derivatives'],
    linkedSimulation: {
      title: 'Derivative & Tangent Slope Instrument',
      url: '/concepts/math-for-ml',
      isImplemented: true,
      description: 'Interact with tangent lines and observe instantaneous rates of change.',
    },
    practiceQuestionIds: ['prac-math-deriv-01', 'prac-math-deriv-02'],
    relatedChallenges: [],
  },

  'math-partial-derivatives': {
    id: 'math-partial-derivatives',
    name: 'Multivariable Partial Derivatives',
    subject: 'mathematics',
    difficulty: 'intermediate',
    categoryTitle: 'Multivariable Calculus',
    plainLanguageDefinition:
      'The rate of change of a multivariable function along one coordinate axis while holding all other coordinates fixed.',
    intuitiveExplanation:
      'Walking strictly North while locking your East-West position. The slope you experience along that single line is the partial derivative with respect to North.',
    mathematicalFormulation: {
      formulaLabel: 'PARTIAL DERIVATIVE OPERATOR',
      latex: '\\frac{\\partial J}{\\partial \\theta_i} = \\lim_{h \\to 0} \\frac{J(\\theta_1, \\dots, \\theta_i + h, \\dots, \\theta_n) - J(\\boldsymbol{\\theta})}{h}',
      explanation: 'Differentiates J solely with respect to \\theta_i while treating all other \\theta_{j \\neq i} as constant parameters.',
    },
    workedExample: {
      title: '2D Anisotropic Coordinate Differentiation',
      steps: [
        'Objective: J(\\theta_1, \\theta_2) = 0.5 \\theta_1^2 + 5 \\theta_2^2',
        'Differentiate wrt \\theta_1: \\partial J / \\partial \\theta_1 = \\theta_1',
        'Differentiate wrt \\theta_2: \\partial J / \\partial \\theta_2 = 10 \\theta_2',
        'Evaluate at (2.0, 1.0): \\partial J / \\partial \\theta_1 = 2.0, \\partial J / \\partial \\theta_2 = 10.0',
      ],
      numericalOutcome: '\\partial J/\\partial \\theta_1 = 2.0, \\quad \\partial J/\\partial \\theta_2 = 10.0',
    },
    commonMisconception: {
      misconception: 'Believing partial derivatives capture the overall direction of steepest slope.',
      correction: 'A partial derivative only measures slope along one cardinal axis. To find the true steepest slope in arbitrary directions, all partials must be combined into the gradient vector.',
    },
    prerequisites: ['math-derivatives'],
    downstreamConcepts: ['math-gradients'],
    linkedSimulation: {
      title: 'Multivariable Coordinate Slices',
      url: '/concepts/math-for-ml',
      isImplemented: true,
      description: 'Isolate coordinate dimensions to observe partial slopes independently.',
    },
    practiceQuestionIds: ['prac-math-pderiv-01'],
    relatedChallenges: [],
  },

  'math-gradients': {
    id: 'math-gradients',
    name: 'The Gradient Vector (∇J)',
    subject: 'mathematics',
    difficulty: 'intermediate',
    categoryTitle: 'Multivariable Calculus & Optimization',
    plainLanguageDefinition:
      'The vector collecting all first-order partial derivatives, pointing directly in the direction of greatest instantaneous increase.',
    intuitiveExplanation:
      'If you place a compass on an uneven terrain, the needle pointing straight uphill along the steepest possible ascent line is the gradient \\nabla J. Its negative -\\nabla J points straight downhill.',
    mathematicalFormulation: {
      formulaLabel: 'GRADIENT VECTOR',
      latex: '\\nabla J(\\boldsymbol{\\theta}) = \\left[ \\frac{\\partial J}{\\partial \\theta_1}, \\frac{\\partial J}{\\partial \\theta_2}, \\dots, \\frac{\\partial J}{\\partial \\theta_n} \\right]^T',
      explanation: '\\nabla J(\\boldsymbol{\\theta}) is orthogonal to the level contour curves of J at \\boldsymbol{\\theta}.',
    },
    workedExample: {
      title: 'Computing the Gradient on a 2D Paraboloid',
      steps: [
        'Objective: J(\\boldsymbol{\\theta}) = 0.5(\\theta_1 - 2)^2 + 2(\\theta_2 - 3)^2',
        'Compute partials: \\partial J / \\partial \\theta_1 = \\theta_1 - 2, \\quad \\partial J / \\partial \\theta_2 = 4(\\theta_2 - 3)',
        'Evaluate at \\boldsymbol{\\theta} = [4.0, 1.0]^T:',
        '\\nabla J_1 = 4.0 - 2 = 2.0, \\quad \\nabla J_2 = 4(1.0 - 3) = -8.0',
      ],
      numericalOutcome: '\\nabla J = [2.00, -8.00]^T, \\quad ||\\nabla J||_2 = \\sqrt{2^2 + (-8)^2} = 8.25',
    },
    commonMisconception: {
      misconception: 'Believing the gradient points toward the minimum of the loss function.',
      correction: 'The gradient points locally in the direction of steepest instantaneous ascent. It does not "see" where the global minimum lies; it only senses the immediate slope at the current point.',
    },
    prerequisites: ['math-partial-derivatives'],
    downstreamConcepts: ['math-hessians', 'opt-loss-functions'],
    linkedSimulation: {
      title: 'Gradient Vector Field Visualizer',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Observe orthogonal gradient vectors plotted across 2D contour manifolds.',
    },
    practiceQuestionIds: ['prac-math-grad-01', 'prac-math-grad-02'],
    relatedChallenges: [],
  },

  'math-hessians': {
    id: 'math-hessians',
    name: 'The Hessian Matrix & Curvature',
    subject: 'mathematics',
    difficulty: 'advanced',
    categoryTitle: 'Second-Order Matrix Calculus',
    plainLanguageDefinition:
      'A symmetric matrix of second-order partial derivatives describing the local curvature and anisotropy of a multivariable loss function.',
    intuitiveExplanation:
      'While the gradient tells you the slope, the Hessian tells you how fast the slope itself changes. A steep narrow canyon has high curvature across its walls and low curvature along its valley floor.',
    mathematicalFormulation: {
      formulaLabel: 'HESSIAN MATRIX & CONDITION NUMBER',
      latex: 'H_{ij} = \\frac{\\partial^2 J}{\\partial \\theta_i \\partial \\theta_j}, \\quad \\kappa = \\frac{\\lambda_{\\max}(H)}{\\lambda_{\\min}(H)}',
      explanation: 'Eigenvalues \\lambda_i quantify principal curvatures; the condition number \\kappa determines ill-conditioning.',
    },
    workedExample: {
      title: 'Calculating the Condition Number \\kappa',
      steps: [
        'Objective: J(\\theta_1, \\theta_2) = 0.5 \\theta_1^2 + 5 \\theta_2^2',
        'Second partials: \\partial^2 J / \\partial \\theta_1^2 = 1.0, \\quad \\partial^2 J / \\partial \\theta_2^2 = 10.0, \\quad \\partial^2 J / \\partial \\theta_1 \\partial \\theta_2 = 0',
        'Hessian: H = diag(1, 10) with eigenvalues \\lambda_1 = 1, \\lambda_2 = 10',
        'Condition number: \\kappa = \\lambda_{\\max} / \\lambda_{\\min} = 10 / 1',
      ],
      numericalOutcome: '\\kappa = 10.0, \\quad \\alpha_{\\text{crit}} = 2/\\lambda_{\\max} = 0.20',
    },
    commonMisconception: {
      misconception: 'Assuming all convex quadratics are equally easy for gradient descent to solve.',
      correction: 'When the condition number \\kappa \\gg 1, the Hessian creates an anisotropic valley where gradient descent oscillates aggressively along steep directions while making slow progress along flat directions.',
    },
    prerequisites: ['math-gradients'],
    downstreamConcepts: ['opt-anisotropic-valleys', 'opt-saddle-points'],
    linkedSimulation: {
      title: 'Spectral Curvature & Hessian Studio',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Explore anisotropic eigenvalues and critical stability boundaries.',
    },
    practiceQuestionIds: ['prac-math-hess-01'],
    relatedChallenges: ['gd-02-anisotropic-valley'],
  },

  // ---------------------------------------------------------------------------
  // 2. OPTIMIZATION ALGORITHMS
  // ---------------------------------------------------------------------------
  'opt-loss-functions': {
    id: 'opt-loss-functions',
    name: 'Optimization Objectives & Loss Landscapes',
    subject: 'optimization',
    difficulty: 'foundational',
    categoryTitle: 'Optimization Fundamentals',
    plainLanguageDefinition:
      'The objective function formulating the discrepancy between empirical observations and model predictions.',
    intuitiveExplanation:
      'The objective function is the score sheet: it assigns an error penalty to any hypothesis, creating a landscape whose lowest valley represents the best possible fit.',
    mathematicalFormulation: {
      formulaLabel: 'QUADRATIC LOSS RESIDUAL',
      latex: 'J(\\boldsymbol{\\theta}) = \\frac{1}{2} \\sum_{i=1}^m (y^{(i)} - f_{\\boldsymbol{\\theta}}(\\mathbf{x}^{(i)}))^2',
      explanation: 'Squaring penalizes large residuals exponentially and creates smooth, differentiable parabolas.',
    },
    workedExample: {
      title: 'Comparing Residual Penalties',
      steps: [
        'Residual error e_1 = 1.0 vs e_2 = 4.0',
        'Quadratic penalty: 0.5(1.0)^2 = 0.5',
        'Quadratic penalty: 0.5(4.0)^2 = 8.0',
        'Ratio of penalties: 8.0 / 0.5 = 16x penalty for a 4x error',
      ],
      numericalOutcome: 'Error ratio = 4x \\implies Penalty ratio = 16x',
    },
    commonMisconception: {
      misconception: 'Thinking any function with zero slope at a point has reached a minimum.',
      correction: 'A zero gradient \\nabla J = \\mathbf{0} is only a stationary point. It could be a local minimum, a local maximum, or an inflection/saddle point.',
    },
    prerequisites: ['math-gradients'],
    downstreamConcepts: ['opt-gradient-descent'],
    linkedSimulation: {
      title: 'Loss Landscape Workbench',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Visualize quadratic bowls, ill-conditioned ravines, and Rosenbrock valleys.',
    },
    practiceQuestionIds: ['prac-opt-loss-01'],
    relatedChallenges: [],
  },

  'opt-gradient-descent': {
    id: 'opt-gradient-descent',
    name: 'Vanilla Gradient Descent Algorithm',
    subject: 'optimization',
    difficulty: 'foundational',
    categoryTitle: 'First-Order Optimization',
    plainLanguageDefinition:
      'An iterative first-order optimization algorithm that updates parameters in the direction opposite to the gradient of the objective function.',
    intuitiveExplanation:
      'Like a hiker navigating down a fog-covered mountain: at every step, check the slope with your boots, then take a measured step straight downhill.',
    mathematicalFormulation: {
      formulaLabel: 'DISCRETE PARAMETER UPDATE',
      latex: '\\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\alpha \\nabla J(\\boldsymbol{\\theta}_t)',
      explanation: '\\alpha > 0 is the learning rate hyperparameter and \\nabla J is the gradient vector at step t.',
    },
    workedExample: {
      title: 'Calculating One Gradient Descent Step',
      steps: [
        'Loss: J(\\theta) = 0.5(\\theta - 3.5)^2 + 1, \\quad \\nabla J(\\theta) = \\theta - 3.5',
        'Parameters: \\theta_0 = 0.50, \\quad \\alpha = 0.40',
        'Compute gradient: \\nabla J(0.50) = 0.50 - 3.50 = -3.00',
        'Apply update: \\theta_1 = 0.50 - 0.40 \\cdot (-3.00) = 0.50 + 1.20',
      ],
      numericalOutcome: '\\theta_1 = 1.70, \\quad J(\\theta_1) = 0.5(1.7 - 3.5)^2 + 1 = 2.62',
    },
    commonMisconception: {
      misconception: 'Assuming gradient descent always takes the shortest path to the minimum.',
      correction: 'Gradient descent takes steps orthogonal to local level curves. In elongated ravines, this produces a zig-zag trajectory far longer than the direct Euclidean line to the minimum.',
    },
    prerequisites: ['opt-loss-functions'],
    downstreamConcepts: ['opt-learning-rate', 'opt-saddle-points'],
    linkedSimulation: {
      title: 'Vanilla Gradient Descent Cinema Laboratory',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Full interactive 1D and 2D reversible simulation workbench.',
    },
    practiceQuestionIds: ['prac-opt-gd-01', 'prac-opt-gd-02'],
    relatedChallenges: ['gd-01-break-learning-rate'],
  },

  'opt-learning-rate': {
    id: 'opt-learning-rate',
    name: 'Learning Rate & Spectral Stability',
    subject: 'optimization',
    difficulty: 'intermediate',
    categoryTitle: 'Optimization Dynamics',
    plainLanguageDefinition:
      'The positive scalar hyperparameter scaling step size, whose upper bound for stability is governed by the maximum curvature eigenvalue.',
    intuitiveExplanation:
      'The learning rate is your step length. Too small, and reaching the bottom takes thousands of steps; too large, and you overshoot the valley and get flung up the opposite mountain.',
    mathematicalFormulation: {
      formulaLabel: 'SPECTRAL STABILITY THRESHOLD',
      latex: '0 < \\alpha < \\alpha_{\\text{crit}} = \\frac{2}{\\lambda_{\\max}(H)}',
      explanation: 'The error contraction factor is |1 - \\alpha \\lambda|. Contraction requires |1 - \\alpha \\lambda| < 1.',
    },
    workedExample: {
      title: 'Computing the Critical Learning Rate',
      steps: [
        'Given Hessian eigenvalue \\lambda = 10.0',
        'Critical threshold: \\alpha_{\\text{crit}} = 2 / 10.0 = 0.20',
        'If \\alpha = 0.10: |1 - 0.10(10)| = 0.0 (deadbeat in 1 step)',
        'If \\alpha = 0.20: |1 - 0.20(10)| = |-1| = 1.0 (undamped limit cycle)',
        'If \\alpha = 0.22: |1 - 0.22(10)| = |-1.2| = 1.2 (geometric divergence)',
      ],
      numericalOutcome: '\\alpha_{\\text{crit}} = 0.20, \\quad \\text{Stable for } \\alpha \\in (0, 0.20)',
    },
    commonMisconception: {
      misconception: 'Claiming that \\alpha \\ge 2 always diverges for all loss functions.',
      correction: 'For 1D quadratic J(\\theta) = 0.5(\\theta - 3.5)^2 + 1, at exactly \\alpha = 2.0, the update yields persistent oscillation (limit cycle) that neither converges nor diverges. Strict divergence requires \\alpha > 2.0.',
    },
    prerequisites: ['opt-gradient-descent'],
    downstreamConcepts: ['opt-convergence-regimes'],
    linkedSimulation: {
      title: 'Spectral Stability Slider Instrument',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Tune \\alpha across all stability regimes and observe live contraction ratios.',
    },
    practiceQuestionIds: ['prac-opt-lr-01'],
    relatedChallenges: ['gd-01-break-learning-rate'],
  },

  'opt-convergence-regimes': {
    id: 'opt-convergence-regimes',
    name: 'Dynamical Regimes & Limit Cycles',
    subject: 'optimization',
    difficulty: 'intermediate',
    categoryTitle: 'Optimization Dynamics',
    plainLanguageDefinition:
      'The five distinct qualitative behaviors exhibited by gradient descent updates: monotonic, deadbeat, oscillatory, limit cycle, and divergence.',
    intuitiveExplanation:
      'Like a pendulum with adjustable stiffness: underdamped swings past the bottom, critically damped stops at once, undamped swings forever, and unstable blows apart.',
    mathematicalFormulation: {
      formulaLabel: 'ERROR CONTRACTION RECURRENCE',
      latex: '(\\theta_{t+1} - \\theta^*) = (1 - \\alpha \\lambda)(\\theta_t - \\theta^*)',
      explanation: 'Sign and magnitude of (1 - \\alpha \\lambda) dictate the exact dynamical regime.',
    },
    workedExample: {
      title: 'Classifying the Five Regimes for \\lambda = 1.0',
      steps: [
        '0 < \\alpha < 1.0 \\implies 0 < 1 - \\alpha < 1: Monotonic decay (no sign flips)',
        '\\alpha = 1.0 \\implies 1 - \\alpha = 0: Deadbeat convergence (reaches \\theta* in 1 step)',
        '1.0 < \\alpha < 2.0 \\implies -1 < 1 - \\alpha < 0: Alternating oscillatory convergence',
        '\\alpha = 2.0 \\implies 1 - \\alpha = -1: Conservative limit cycle (perpetual flip)',
        '\\alpha > 2.0 \\implies |1 - \\alpha| > 1: Unbounded geometric divergence',
      ],
      numericalOutcome: '5 distinct dynamical phases rigorously defined by |1 - \\alpha \\lambda|',
    },
    commonMisconception: {
      misconception: 'Assuming any oscillation in gradient descent indicates impending explosion.',
      correction: 'Oscillations in the regime 1 < \\alpha < 2 overshoot the minimum each turn but geometrically shrink in magnitude, guaranteeing convergence.',
    },
    prerequisites: ['opt-learning-rate'],
    downstreamConcepts: ['opt-anisotropic-valleys'],
    linkedSimulation: {
      title: 'Regime Preset Selector Studio',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Switch instantly between Monotonic, Deadbeat, Oscillate, Limit Cycle, and Divergence.',
    },
    practiceQuestionIds: ['prac-opt-regimes-01'],
    relatedChallenges: ['gd-01-break-learning-rate'],
  },

  'opt-anisotropic-valleys': {
    id: 'opt-anisotropic-valleys',
    name: 'Ill-Conditioned Ravines & Anisotropy',
    subject: 'optimization',
    difficulty: 'advanced',
    categoryTitle: 'Optimization Dynamics',
    plainLanguageDefinition:
      'Loss landscapes with high condition numbers (\\kappa \\gg 1) where steep axes demand tiny learning rates while shallow axes require large steps.',
    intuitiveExplanation:
      'Walking down a steep, narrow skate half-pipe that tilts slightly downward: gravity pulls you back and forth between the high walls rather than letting you roll straight down the pipe.',
    mathematicalFormulation: {
      formulaLabel: 'MODAL DECOUPLING ON ANISOTROPIC HESSIAN',
      latex: 'H = \\begin{bmatrix} 1 & 0 \\\\ 0 & 10 \\end{bmatrix}, \\quad \\begin{cases} \\theta_1^{(t+1)} = (1 - \\alpha) \\theta_1^{(t)} \\\\ \\theta_2^{(t+1)} = (1 - 10\\alpha) \\theta_2^{(t)} \\end{cases}',
      explanation: 'When \\alpha = 0.20, \\theta_2 enters a limit cycle while \\theta_1 contracts slowly by (1 - 0.20) = 0.80.',
    },
    workedExample: {
      title: 'Trajectory in an Ill-Conditioned Ravine (\\kappa = 10)',
      steps: [
        'Set \\alpha = 0.20 on J = 0.5\\theta_1^2 + 5.0\\theta_2^2',
        'Vertical update: \\theta_2^{(t+1)} = (1 - 10 \\cdot 0.20)\\theta_2^{(t)} = -\\theta_2^{(t)} (Perpetual flip between \\pm y_0)',
        'Horizontal update: \\theta_1^{(t+1)} = (1 - 1 \\cdot 0.20)\\theta_1^{(t)} = 0.80\\theta_1^{(t)} (Slow contraction)',
        'The point bounces between walls while creeping horizontally',
      ],
      numericalOutcome: '\\alpha = 0.20 \\implies \\theta_2 \\text{ bounded oscillation, } \\theta_1 \\text{ contracts by } 20\\% / \\text{step}',
    },
    commonMisconception: {
      misconception: 'Assuming increasing the learning rate is the solution when gradient descent makes slow progress in a ravine.',
      correction: 'Increasing \\alpha immediately destabilizes the steep axis \\theta_2, causing explosive divergence even though the shallow axis \\theta_1 wanted a larger step. Anisotropic ravines require momentum or adaptive scaling (Adam).',
    },
    prerequisites: ['opt-convergence-regimes', 'math-hessians'],
    downstreamConcepts: ['opt-momentum-adam'],
    linkedSimulation: {
      title: '2D Anisotropic Ravine Laboratory',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Observe high-condition number ravines (\\kappa = 10) with multi-optimizer comparisons.',
    },
    practiceQuestionIds: ['prac-opt-aniso-01'],
    relatedChallenges: ['gd-02-anisotropic-valley'],
  },

  'opt-saddle-points': {
    id: 'opt-saddle-points',
    name: 'Saddle Points & Indefinite Curvature',
    subject: 'optimization',
    difficulty: 'advanced',
    categoryTitle: 'Non-Convex Optimization',
    plainLanguageDefinition:
      'Stationary points where the gradient is zero (\\nabla J = \\mathbf{0}), but the Hessian has both positive and negative eigenvalues.',
    intuitiveExplanation:
      'A horse saddle or mountain pass: looking North-South it curves up like a bowl, but looking East-West it curves down into the valley.',
    mathematicalFormulation: {
      formulaLabel: 'INDEFINITE HESSIAN SIGNATURE',
      latex: '\\nabla J(\\boldsymbol{\\theta}^*) = \\mathbf{0}, \\quad \\lambda_{\\min}(H) < 0 < \\lambda_{\\max}(H)',
      explanation: 'Negative eigenvalue indicates a direction of negative curvature along which loss decreases.',
    },
    workedExample: {
      title: 'Analyzing the Monkey Saddle Landscape',
      steps: [
        'Objective: J(\\theta_1, \\theta_2) = \\theta_1^2 - \\theta_2^2',
        'Gradient: \\nabla J = [2\\theta_1, -2\\theta_2]^T = [0, 0]^T \\implies \\boldsymbol{\\theta} = (0, 0)',
        'Hessian: H = diag(2, -2) with eigenvalues \\lambda_1 = +2, \\lambda_2 = -2',
        'Perturb slightly along \\theta_2: \\theta_2 = 0.01 \\implies J = -(0.01)^2 = -0.0001 < 0',
      ],
      numericalOutcome: '\\lambda_1 > 0, \\lambda_2 < 0 \\implies \\text{Saddle point, not a local minimum}',
    },
    commonMisconception: {
      misconception: 'Believing gradient descent stalls permanently at all saddle points.',
      correction: 'An exact stationary initialization at the saddle stalls because \\nabla J = \\mathbf{0}. However, any infinitesimal perturbation along the negative curvature direction creates a non-zero gradient that escapes down the slope.',
    },
    prerequisites: ['math-hessians', 'opt-gradient-descent'],
    downstreamConcepts: ['opt-multimodal-landscapes'],
    linkedSimulation: {
      title: 'Saddle Point Negative Curvature Studio',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Observe saddle stall at the origin and escape under negative curvature perturbation.',
    },
    practiceQuestionIds: ['prac-opt-saddle-01'],
    relatedChallenges: ['gd-03-saddle-point-stall'],
  },

  'opt-momentum-adam': {
    id: 'opt-momentum-adam',
    name: 'Momentum Acceleration & Adam Optimizer',
    subject: 'optimization',
    difficulty: 'advanced',
    categoryTitle: 'Advanced First-Order Optimizers',
    plainLanguageDefinition:
      'Optimization extensions using accumulated velocity (Polyak momentum) and coordinate-wise adaptive second-moment scaling (Adam) to conquer anisotropy.',
    intuitiveExplanation:
      'Polyak momentum is a heavy bowling ball rolling down the half-pipe: its forward momentum carries it along the valley floor while canceling out side-to-side oscillations. Adam adds individual shock absorbers to every wheel.',
    mathematicalFormulation: {
      formulaLabel: 'ADAM COORDINATE-WISE UPDATE',
      latex: '\\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\frac{\\alpha}{\\sqrt{\\hat{\\mathbf{v}}_t} + \\varepsilon} \\hat{\\mathbf{m}}_t',
      explanation: '\\hat{\\mathbf{m}}_t is bias-corrected first moment (velocity); \\hat{\\mathbf{v}}_t scales coordinates inversely by gradient variance.',
    },
    workedExample: {
      title: 'Comparing Adam vs Vanilla on Steep Axis',
      steps: [
        'Steep axis gradient g_2 = 10.0, shallow axis gradient g_1 = 1.0',
        'Vanilla GD steps: \\Delta \\theta_2 = 10 \\alpha, \\Delta \\theta_1 = 1 \\alpha (10x imbalance)',
        'Adam divides by \\sqrt{v_2} \\approx 10.0 and \\sqrt{v_1} \\approx 1.0',
        'Resulting effective steps: \\Delta \\theta_2 \\approx \\alpha, \\Delta \\theta_1 \\approx \\alpha (Balanced progress)',
      ],
      numericalOutcome: 'Coordinate step disparity reduced from 10:1 to nearly 1:1',
    },
    commonMisconception: {
      misconception: 'Assuming Adam and Momentum make tuning the learning rate unnecessary.',
      correction: 'While Adam is resilient to anisotropic curvature, setting \\alpha too high still causes overshoot and divergence, and setting it too low causes premature stagnation in flat plateaus.',
    },
    prerequisites: ['opt-anisotropic-valleys'],
    downstreamConcepts: [],
    linkedSimulation: {
      title: 'Optimizer Comparison Studio (Vanilla vs Momentum vs Adam)',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Run three optimizers side-by-side with synchronized step controls and metrics.',
    },
    practiceQuestionIds: ['prac-opt-adam-01'],
    relatedChallenges: ['gd-04-rosenbrock-valley'],
  },

  'opt-multimodal-landscapes': {
    id: 'opt-multimodal-landscapes',
    name: 'Multimodal Landscapes & Basin Traps',
    subject: 'optimization',
    difficulty: 'advanced',
    categoryTitle: 'Non-Convex Optimization',
    plainLanguageDefinition:
      'Complex non-convex loss surfaces (such as the Rastrigin function) with dozens of local minima basins surrounding the global optimum.',
    intuitiveExplanation:
      'An egg carton: wherever you drop a marble, it rolls into the nearest pocket and stays stuck there, unable to climb the ridges to find the deepest egg pocket.',
    mathematicalFormulation: {
      formulaLabel: 'RASTRIGIN MULTIMODAL TEST OBJECTIVE',
      latex: 'J(\\boldsymbol{\\theta}) = 10n + \\sum_{i=1}^n \\left[ \\theta_i^2 - 10 \\cos(2\\pi \\theta_i) \\right]',
      explanation: 'High-frequency cosine modulation creates a dense grid of local minima basins around \\boldsymbol{\\theta}^* = \\mathbf{0}.',
    },
    workedExample: {
      title: 'Local Minimum Trap at \\theta = 1.0',
      steps: [
        'At \\theta = 1.0: \\cos(2\\pi \\cdot 1.0) = 1.0',
        'Loss: J(1.0) = 10 + [1^2 - 10(1)] = 10 + [-9] = 1.0',
        'At global minimum \\theta = 0.0: J(0.0) = 10 + [0 - 10] = 0.0',
        'Gradient at \\theta = 1.0: \\nabla J = 2(1) + 20\\pi \\sin(2\\pi) = 2 + 0 = 0 (Stationary local trap)',
      ],
      numericalOutcome: 'Local basin J = 1.0 vs Global optimum J = 0.0',
    },
    commonMisconception: {
      misconception: 'Believing random restarts or momentum guarantee finding the true global minimum.',
      correction: 'Restarts and momentum expand search exploration across basins, but in high-dimensional non-convex spaces, no deterministic or heuristic method guarantees global optimality.',
    },
    prerequisites: ['opt-saddle-points'],
    downstreamConcepts: [],
    linkedSimulation: {
      title: 'Rastrigin Multimodal Landscape Studio',
      url: '/cinema/gradient-descent',
      isImplemented: true,
      description: 'Observe local basin trapping and test restart exploration.',
    },
    practiceQuestionIds: ['prac-opt-nonconvex-01'],
    relatedChallenges: ['gd-05-rastrigin-multimodal'],
  },

  // ---------------------------------------------------------------------------
  // 3. CLUSTERING ALGORITHMS
  // ---------------------------------------------------------------------------
  'clust-distance-metrics': {
    id: 'clust-distance-metrics',
    name: 'Euclidean Metrics & Coordinate Scaling',
    subject: 'clustering',
    difficulty: 'foundational',
    categoryTitle: 'Geometry & Metrics',
    plainLanguageDefinition:
      'The mathematical distance metric measuring straight-line separation in Euclidean coordinate space, highly sensitive to feature scaling.',
    intuitiveExplanation:
      'Measuring distance with a ruler across your desk. If one axis is measured in millimeters and another in kilometers, the millimeter axis becomes completely invisible to the ruler.',
    mathematicalFormulation: {
      formulaLabel: 'SQUARED EUCLIDEAN DISTANCE',
      latex: 'd(\\mathbf{x}, \\boldsymbol{\\mu})^2 = ||\\mathbf{x} - \\boldsymbol{\\mu}||_2^2 = \\sum_{j=1}^d (x_j - \\mu_j)^2',
      explanation: 'Assumes isotropic geometry: 1 unit change in feature 1 equals 1 unit change in feature 2.',
    },
    workedExample: {
      title: 'Effect of Feature Scale Disparity (100:1)',
      steps: [
        'Point A = (1, 100), Centroid = (0, 0)',
        'Unstandardized squared distance: (1-0)^2 + (100-0)^2 = 1 + 10,000 = 10,001',
        'Feature 2 contributes 99.99% of the distance calculation',
        'If standardized to z-scores: A_scaled = (1, 1) \\implies d^2 = 1 + 1 = 2',
      ],
      numericalOutcome: 'Unscaled feature 2 dominates 99.99% of cluster assignments',
    },
    commonMisconception: {
      misconception: 'Believing K-Means is invariant to feature units (e.g. centimeters vs meters).',
      correction: 'K-Means uses Euclidean distance, which treats raw numbers as spatial coordinates. Changing units from meters to millimeters inflates distance squared by 1,000,000x, completely destroying original cluster boundaries.',
    },
    prerequisites: ['math-functions'],
    downstreamConcepts: ['clust-centroids'],
    linkedSimulation: {
      title: 'Feature Scaling & Euclidean Metric Workbench',
      url: '/cinema',
      isImplemented: true,
      description: 'Observe Voronoi distortions under unstandardized coordinate dimensions.',
    },
    practiceQuestionIds: ['prac-clust-dist-01'],
    relatedChallenges: ['km-04-feature-scale-distortion'],
  },

  'clust-centroids': {
    id: 'clust-centroids',
    name: 'Centroids & Centers of Mass',
    subject: 'clustering',
    difficulty: 'foundational',
    categoryTitle: 'Unsupervised Geometry',
    plainLanguageDefinition:
      'The cluster prototype point representing the vector arithmetic mean of all data points currently assigned to that partition.',
    intuitiveExplanation:
      'The center of gravity: if every data point had equal physical weight on a cardboard sheet, the centroid is the exact point where you could balance the sheet on a pencil tip.',
    mathematicalFormulation: {
      formulaLabel: 'ARITHMETIC MEAN PROTOTYPE',
      latex: '\\boldsymbol{\\mu}_k = \\frac{1}{|S_k|} \\sum_{\\mathbf{x} \\in S_k} \\mathbf{x}',
      explanation: 'The arithmetic mean is the unique continuous point minimizing the sum of squared Euclidean distances.',
    },
    workedExample: {
      title: 'Calculating the 2D Centroid of 3 Points',
      steps: [
        'Points: p_1 = (2, 4), p_2 = (4, 8), p_3 = (6, 3)',
        'Sum X: 2 + 4 + 6 = 12 \\implies \\mu_x = 12 / 3 = 4.0',
        'Sum Y: 4 + 8 + 3 = 15 \\implies \\mu_y = 15 / 3 = 5.0',
      ],
      numericalOutcome: '\\boldsymbol{\\mu} = (4.00, 5.00)',
    },
    commonMisconception: {
      misconception: 'Thinking the centroid must always be one of the actual data points.',
      correction: 'In standard K-Means, the centroid is the continuous average coordinates of the cluster members, which rarely coincides with an empirical data point (unlike K-Medoids).',
    },
    prerequisites: ['clust-distance-metrics'],
    downstreamConcepts: ['clust-kmeans-lloyd'],
    linkedSimulation: {
      title: 'Center of Mass Kinetic Tracker',
      url: '/cinema',
      isImplemented: true,
      description: 'Track centroid coordinates and trajectory vectors across iterations.',
    },
    practiceQuestionIds: ['prac-clust-cent-01'],
    relatedChallenges: ['km-03-empty-cluster-collapse'],
  },

  'clust-kmeans-lloyd': {
    id: 'clust-kmeans-lloyd',
    name: "Lloyd's K-Means Algorithm",
    subject: 'clustering',
    difficulty: 'intermediate',
    categoryTitle: 'Clustering Algorithms',
    plainLanguageDefinition:
      'An alternating coordinate descent algorithm iteratively partitioning observations into Voronoi cells and updating centroids to their arithmetic means.',
    intuitiveExplanation:
      'Two alternating steps: 1) Points pick the closest centroid, drawing geometric territory boundaries. 2) Centroids move to the exact center of their new territory. Repeat until nobody moves.',
    mathematicalFormulation: {
      formulaLabel: "LLOYD'S TWO-STAGE UPDATE",
      latex: 'S_k^{(t)} = \\{ \\mathbf{x} : ||\\mathbf{x} - \\boldsymbol{\\mu}_k^{(t)}|| \\le ||\\mathbf{x} - \\boldsymbol{\\mu}_j^{(t)}|| \\ \\forall j \\}, \\quad \\boldsymbol{\\mu}_k^{(t+1)} = \\frac{1}{|S_k^{(t)}|} \\sum_{\\mathbf{x} \\in S_k^{(t)}} \\mathbf{x}',
      explanation: 'Stage 1 minimizes J wrt assignments c; Stage 2 minimizes J wrt centroid coordinates \\boldsymbol{\\mu}.',
    },
    workedExample: {
      title: 'Voronoi Assignment for Point x = (3, 3)',
      steps: [
        'Centroid 1: \\mu_1 = (1, 1) \\implies d^2 = (3-1)^2 + (3-1)^2 = 4 + 4 = 8.0',
        'Centroid 2: \\mu_2 = (5, 4) \\implies d^2 = (3-5)^2 + (3-4)^2 = 4 + 1 = 5.0',
        'Compare distances: 5.0 < 8.0',
      ],
      numericalOutcome: 'x is assigned to Cluster 2 (argmin Euclidean distance)',
    },
    commonMisconception: {
      misconception: 'Assuming Lloyd\'s algorithm guarantees finding the best overall clustering.',
      correction: 'Lloyd\'s algorithm is a local greedy search. It is highly sensitive to initial seeds and frequently converges to suboptimal local Voronoi equilibria.',
    },
    prerequisites: ['clust-centroids', 'clust-distance-metrics'],
    downstreamConcepts: ['clust-wcss-monotonicity', 'clust-kmeans-plus-plus'],
    linkedSimulation: {
      title: 'Lloyd\'s Algorithm Cinema Workbench',
      url: '/cinema',
      isImplemented: true,
      description: 'Step-by-step reversible Lloyd execution with synchronized Voronoi shading.',
    },
    practiceQuestionIds: ['prac-clust-lloyd-01'],
    relatedChallenges: ['km-02-bad-initialization'],
  },

  'clust-wcss-monotonicity': {
    id: 'clust-wcss-monotonicity',
    name: 'WCSS Monotonicity & Selim-Ismail Theorem',
    subject: 'clustering',
    difficulty: 'intermediate',
    categoryTitle: 'Clustering Theory',
    plainLanguageDefinition:
      'The mathematical guarantee that Within-Cluster Sum of Squares (Inertia) is strictly non-increasing across both sub-stages of every iteration.',
    intuitiveExplanation:
      'A one-way ratchet: because points only switch to a closer centroid, and moving a centroid to the average can only reduce distances, the total cluster tension can never go up.',
    mathematicalFormulation: {
      formulaLabel: 'SELIM-ISMAIL TWO-STAGE MONOTONICITY',
      latex: 'J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t+1)}) \\le J(c^{(t+1)}, \\boldsymbol{\\mu}^{(t)}) \\le J(c^{(t)}, \\boldsymbol{\\mu}^{(t)})',
      explanation: 'Stage 1 assignment and Stage 2 update both minimize the exact same objective function J.',
    },
    workedExample: {
      title: 'Verifying WCSS Decrease on Step 1',
      steps: [
        'Initial WCSS at t=0: J_0 = 420.5',
        'After Voronoi point reassignment: J_{0.5} = 310.2 (\\le 420.5)',
        'After Centroid arithmetic mean update: J_1 = 285.8 (\\le 310.2)',
        'Net reduction: 420.5 - 285.8 = 134.7',
      ],
      numericalOutcome: 'J_1 \\le J_{0.5} \\le J_0 \\implies \\Delta J = -134.7 \\le 0',
    },
    commonMisconception: {
      misconception: 'Believing WCSS can occasionally increase when centroids jump across dense clusters.',
      correction: 'By the Selim-Ismail (1984) theorem, WCSS is strictly non-increasing. If WCSS ever increases in code, it is guaranteed to be a software bug (such as an unhandled empty cluster).',
    },
    prerequisites: ['clust-kmeans-lloyd'],
    downstreamConcepts: ['clust-model-complexity'],
    linkedSimulation: {
      title: 'WCSS Inertia Curve & Monotonicity Monitor',
      url: '/cinema',
      isImplemented: true,
      description: 'Watch WCSS decrease monotonically in real time with two-stage sub-step tracking.',
    },
    practiceQuestionIds: ['prac-clust-wcss-01'],
    relatedChallenges: ['km-05-symmetric-grid-trap'],
  },

  'clust-kmeans-plus-plus': {
    id: 'clust-kmeans-plus-plus',
    name: 'K-Means++ & D² Seeding',
    subject: 'clustering',
    difficulty: 'advanced',
    categoryTitle: 'Seeding Algorithms',
    plainLanguageDefinition:
      'A smart probabilistic initialization sampling candidate centroids proportional to squared distance from existing seeds, achieving an expected O(log K) bound.',
    intuitiveExplanation:
      'Placing fire stations in a city: after putting the first station, you put the next station in the neighborhood farthest away from any existing station, spreading them out evenly.',
    mathematicalFormulation: {
      formulaLabel: 'D² SAMPLING PROBABILITY',
      latex: 'P(\\mathbf{x}) = \\frac{D(\\mathbf{x})^2}{\\sum_{\\mathbf{x}\' \\in X} D(\\mathbf{x}\')^2}, \\quad \\mathbb{E}[\\text{WCSS}] \\le 8(\\ln K + 2)\\text{WCSS}_{\\text{opt}}',
      explanation: 'D(\\mathbf{x}) is the shortest Euclidean distance from \\mathbf{x} to the closest centroid already chosen.',
    },
    workedExample: {
      title: 'Computing D² Selection Probabilities',
      steps: [
        'Point A: D(A) = 1.0 \\implies D(A)^2 = 1.0',
        'Point B: D(B) = 3.0 \\implies D(B)^2 = 9.0',
        'Sum of D^2 = 1.0 + 9.0 = 10.0',
        'Probability of choosing B as next seed: P(B) = 9.0 / 10.0 = 90%',
      ],
      numericalOutcome: 'Point B has a 90% chance of selection (9x higher than A)',
    },
    commonMisconception: {
      misconception: 'Believing K-Means++ guarantees every single run achieves a WCSS below a fixed threshold.',
      correction: 'K-Means++ is a randomized algorithm with an expected theoretical approximation bound O(log K). An individual run can still get unlucky and require restarts.',
    },
    prerequisites: ['clust-kmeans-lloyd'],
    downstreamConcepts: ['clust-symmetric-equilibria'],
    linkedSimulation: {
      title: 'K-Means++ Seeding Probability Visualizer',
      url: '/cinema',
      isImplemented: true,
      description: 'Visualize D² probability heatmaps and compare convergence speed against random seeds.',
    },
    practiceQuestionIds: ['prac-clust-kpp-01'],
    relatedChallenges: ['km-02-bad-initialization'],
  },

  'clust-model-complexity': {
    id: 'clust-model-complexity',
    name: 'Choosing K: Fit vs Complexity Trade-off',
    subject: 'clustering',
    difficulty: 'intermediate',
    categoryTitle: 'Model Selection & Validation',
    plainLanguageDefinition:
      'Balancing within-cluster cohesion against model parsimony, using the Elbow heuristic and information criteria to prevent over-segmentation.',
    intuitiveExplanation:
      'Occam\'s Razor: if K=N (every person has their own private cluster), WCSS is exactly 0, but you have learned nothing about patterns. You want the smallest K that captures the true groupings.',
    mathematicalFormulation: {
      formulaLabel: 'WCSS MONOTONICITY IN K',
      latex: '\\text{WCSS}(K+1) \\le \\text{WCSS}(K), \\quad \\text{Elbow} = \\arg\\max_K |\\Delta^2 \\text{WCSS}(K)|',
      explanation: 'WCSS decreases monotonically as K increases; the inflection point (Elbow) reveals diminishing returns.',
    },
    workedExample: {
      title: 'Detecting the Elbow Point',
      steps: [
        'K=1: WCSS = 1000',
        'K=2: WCSS = 400 (\\Delta = -600)',
        'K=3: WCSS = 150 (\\Delta = -250)',
        'K=4: WCSS = 130 (\\Delta = -20) \\implies Diminishing return',
      ],
      numericalOutcome: 'Optimal inflection (Elbow) at K=3',
    },
    commonMisconception: {
      misconception: 'Choosing K by finding the absolute minimum of WCSS.',
      correction: 'Minimum WCSS is always at K=N where WCSS=0. Valid model selection requires penalizing complexity K or locating the structural elbow.',
    },
    prerequisites: ['clust-wcss-monotonicity'],
    downstreamConcepts: [],
    linkedSimulation: {
      title: 'K Selection & Elbow Curve Instrument',
      url: '/cinema',
      isImplemented: true,
      description: 'Sweep K from 1 to 8 and inspect the resulting inertia curve and Voronoi splits.',
    },
    practiceQuestionIds: ['prac-clust-k-01'],
    relatedChallenges: ['km-01-wrong-k-underclustering'],
  },

  'clust-symmetric-equilibria': {
    id: 'clust-symmetric-equilibria',
    name: 'Partition Landscapes & Seed Sensitivity',
    subject: 'clustering',
    difficulty: 'advanced',
    categoryTitle: 'Clustering Theory',
    plainLanguageDefinition:
      'The multi-basin landscape of Lloyd\'s algorithm on symmetric configurations where initial seed placement determines the final Voronoi equilibrium.',
    intuitiveExplanation:
      'Balancing a ball on the peak of a symmetric roof: even a microscopic breeze left or right decides whether the ball drops into the front garden or back yard.',
    mathematicalFormulation: {
      formulaLabel: 'ENERGY BARRIER IN PARTITION SPACE',
      latex: '\\exists \\boldsymbol{\\mu}^{(A)}, \\boldsymbol{\\mu}^{(B)} : \\nabla J(\\boldsymbol{\\mu}) = \\mathbf{0}, \\quad J(\\boldsymbol{\\mu}^{(A)}) \\neq J(\\boldsymbol{\\mu}^{(B)})',
      explanation: 'Discrete assignment space creates high energy barriers between distinct local Voronoi minima.',
    },
    workedExample: {
      title: 'Horizontal vs Vertical Split on 4 Symmetric Gaussian Blobs',
      steps: [
        'Blobs centered at (\\pm 2, \\pm 2) with K=2',
        'Horizontal seed pair \\implies Final horizontal split with WCSS = 320',
        'Vertical seed pair \\implies Final vertical split with WCSS = 320',
        'Diagonal seed pair \\implies Distorted diagonal split with WCSS = 580 (suboptimal local trap)',
      ],
      numericalOutcome: 'Identical dataset yields 3 distinct stable equilibria based strictly on initial seed coordinates',
    },
    commonMisconception: {
      misconception: 'Assuming running Lloyd\'s algorithm for more iterations can escape a bad local partition.',
      correction: 'Lloyd\'s algorithm cannot cross assignment energy barriers. Once a local Voronoi equilibrium is reached, additional iterations do nothing (zero centroid displacement). Escaping requires restarts or K-Means++.',
    },
    prerequisites: ['clust-kmeans-plus-plus'],
    downstreamConcepts: [],
    linkedSimulation: {
      title: 'Symmetric Grid Partition Laboratory',
      url: '/cinema',
      isImplemented: true,
      description: 'Trigger horizontal, vertical, and diagonal seed equilibria on symmetric datasets.',
    },
    practiceQuestionIds: ['prac-clust-symm-01'],
    relatedChallenges: ['km-05-symmetric-grid-trap'],
  },
};

export function getConceptCard(id: string): ConceptCardData | undefined {
  return CONCEPT_CARDS_MAP[id];
}

export function getAllConceptCards(): ConceptCardData[] {
  return Object.values(CONCEPT_CARDS_MAP);
}

export function getConceptCardsBySubject(subject: ConceptSubject): ConceptCardData[] {
  return Object.values(CONCEPT_CARDS_MAP).filter((c) => c.subject === subject);
}
