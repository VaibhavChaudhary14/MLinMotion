/**
 * ML in Motion — Gradient Descent Interactive Learning System
 * Prediction Checkpoints & Break-the-Algorithm Challenges
 */

import type {
  PredictionQuestion,
  PredictionEvaluationResult,
  ChallengeDefinition,
  ChallengeVerificationResult,
} from './types.ts';
import type {
  GradientDescentSimulationState,
  GradientDescentConfig,
  GradientDescentMetrics,
} from '../simulation/gradientDescentEngine.ts';
import {
  stepGradientDescent,
  GRADIENT_DESCENT_OBJECTIVES,
} from '../simulation/gradientDescentEngine.ts';

// =============================================================================
// 1. PREDICTION CHECKPOINTS FOR GRADIENT DESCENT
// =============================================================================

export function getGDPredictionForStep(
  state: GradientDescentSimulationState
): PredictionQuestion<GradientDescentSimulationState, GradientDescentSimulationState> | null {
  // If already diverged or converged, no next step prediction
  if (state.isConverged || state.isDiverged) {
    return null;
  }
  if (state.isLimitCycle && state.stepNumber > 2) {
    return null;
  }

  // 1D Parameter Update Numerical Checkpoint (At step 0 on 1D Quadratic)
  if (state.config.objectiveId === 'quadratic1d' && state.stepNumber === 0) {
    const currentTheta = state.theta[0];
    const alpha = state.config.learningRate;
    const grad = currentTheta - 3.5;
    const expectedNextTheta = currentTheta - alpha * grad;

    return {
      id: 'gd-pred-1d-step',
      algorithmId: 'gradient-descent',
      title: 'Predict Next Parameter Update: θ_(t+1)',
      category: 'parameter_update',
      prompt: `Given current parameter θ₀ = ${currentTheta.toFixed(2)}, learning rate α = ${alpha.toFixed(2)}, and objective J(θ) = 1/2(θ - 3.5)² + 1 with gradient ∇J(θ) = θ - 3.5: calculate the exact value of θ₁ after the first step.`,
      type: 'numerical',
      numericalTolerance: {
        absolute: 0.05,
        relative: 0.05,
        targetLabel: 'θ₁ (Next Parameter Value)',
      },
      evaluate: (userGuess: unknown) => {
        const val = typeof userGuess === 'number' ? userGuess : parseFloat(String(userGuess));
        if (isNaN(val)) {
          return {
            status: 'incorrect',
            userAnswerSummary: 'Invalid numerical input',
            actualAnswerSummary: `θ₁ = ${expectedNextTheta.toFixed(3)}`,
            score: 0,
            explanation: {
              headline: 'Numerical Evaluation Error',
              mathEquation: `\\theta_{1} = \\theta_0 - \\alpha \\nabla J(\\theta_0)`,
              numericalEvidence: `θ₀ = ${currentTheta}, ∇J = ${grad.toFixed(3)}, α = ${alpha}`,
              pseudocodeLine: 3,
              pseudocodeSnippet: 'theta = theta - alpha * gradient',
              pythonSnippet: `theta = ${currentTheta} - ${alpha} * (${grad.toFixed(3)}) # = ${expectedNextTheta.toFixed(3)}`,
              graphicalClue: 'Look at the vermilion residual vector pointing toward the minimum at 3.5.',
            },
          };
        }

        const err = Math.abs(val - expectedNextTheta);
        const isExact = err <= 0.05;
        const isPartial = !isExact && err <= 0.20;

        return {
          status: isExact ? 'correct' : isPartial ? 'partially_correct' : 'incorrect',
          userAnswerSummary: `θ_pred = ${val.toFixed(3)}`,
          actualAnswerSummary: `θ_actual = ${expectedNextTheta.toFixed(3)} (Δ = ${(val - expectedNextTheta).toFixed(3)})`,
          toleranceApplied: 0.05,
          isWithinTolerance: isExact,
          score: isExact ? 1.0 : isPartial ? 0.5 : 0.0,
          explanation: {
            headline: isExact
              ? 'Exact Mathematical Match!'
              : isPartial
              ? 'Close Approximation (Within Tolerance Window)'
              : 'Mathematical Discrepancy',
            mathEquation: `\\theta_1 = ${currentTheta.toFixed(2)} - ${alpha.toFixed(2)} \\cdot (${grad.toFixed(2)}) = ${expectedNextTheta.toFixed(3)}`,
            numericalEvidence: `Analytical Gradient: ∇J(${currentTheta.toFixed(2)}) = ${grad.toFixed(3)}. Update: ${currentTheta.toFixed(2)} - (${(alpha * grad).toFixed(3)}) = ${expectedNextTheta.toFixed(3)}.`,
            pseudocodeLine: 3,
            pseudocodeSnippet: 'theta_next = theta_current - learning_rate * grad(theta_current)',
            pythonSnippet: `theta_1 = ${currentTheta} - (${alpha} * (${grad})) # Exact result: ${expectedNextTheta}`,
            graphicalClue: `The point moves from ${currentTheta.toFixed(2)} along the negative gradient to ${expectedNextTheta.toFixed(2)}.`,
          },
        };
      },
    };
  }

  // Spectral Stability Regime Checkpoint (When learning rate is varied on 1D Quadratic)
  if (state.config.objectiveId === 'quadratic1d' && state.stepNumber <= 2) {
    const alpha = state.config.learningRate;
    let expectedRegime: string;
    let regimeExplanation: string;

    if (alpha <= 0) {
      expectedRegime = 'stationary';
      regimeExplanation = 'α = 0 results in zero displacement; the parameter remains frozen.';
    } else if (alpha > 0 && alpha < 1.0) {
      expectedRegime = 'monotonic';
      regimeExplanation = `0 < α < 1 (α = ${alpha}) contracts monotonically toward the optimum 3.5 without crossing.`;
    } else if (Math.abs(alpha - 1.0) < 1e-4) {
      expectedRegime = 'deadbeat';
      regimeExplanation = 'α = 1.0 achieves deadbeat convergence to the exact minimum in exactly one step.';
    } else if (alpha > 1.0 && alpha < 2.0) {
      expectedRegime = 'oscillatory';
      regimeExplanation = `1 < α < 2 (α = ${alpha}) overshoots the minimum on every step but contracts exponentially.`;
    } else if (Math.abs(alpha - 2.0) < 1e-4) {
      expectedRegime = 'limit_cycle';
      regimeExplanation = 'α = 2.0 is the spectral boundary: contraction factor |1 - α| = 1, yielding a persistent undamped 2-cycle.';
    } else {
      expectedRegime = 'divergent';
      regimeExplanation = `α > 2 (α = ${alpha}) has spectral radius |1 - α| > 1, causing geometric divergence to ±∞.`;
    }

    return {
      id: 'gd-pred-stability-regime',
      algorithmId: 'gradient-descent',
      title: 'Predict Dynamical Regime',
      category: 'spectral_stability',
      prompt: `With learning rate α = ${alpha.toFixed(2)} on J(θ) = 1/2(θ - 3.5)² + 1 (Hessian H = 1), what dynamical regime will the parameter trajectory exhibit?`,
      type: 'multiple_choice',
      options: [
        {
          id: 'monotonic',
          label: 'A',
          text: 'Monotonic Convergence (no overshooting, 0 < α < 1)',
          isCorrect: expectedRegime === 'monotonic',
        },
        {
          id: 'deadbeat',
          label: 'B',
          text: 'Deadbeat One-Step Convergence (exact minimum in step 1, α = 1)',
          isCorrect: expectedRegime === 'deadbeat',
        },
        {
          id: 'oscillatory',
          label: 'C',
          text: 'Damped Oscillatory Convergence (alternates sides while contracting, 1 < α < 2)',
          isCorrect: expectedRegime === 'oscillatory',
        },
        {
          id: 'limit_cycle',
          label: 'D',
          text: 'Conservative Limit Cycle (bounces eternally between two symmetric points, α = 2)',
          isCorrect: expectedRegime === 'limit_cycle',
        },
        {
          id: 'divergent',
          label: 'E',
          text: 'Geometric Divergence (oscillations explode exponentially to ±∞, α > 2)',
          isCorrect: expectedRegime === 'divergent',
        },
      ],
      evaluate: (userGuess: unknown) => {
        const isCorrect = userGuess === expectedRegime;
        return {
          status: isCorrect ? 'correct' : 'incorrect',
          userAnswerSummary: String(userGuess),
          actualAnswerSummary: expectedRegime,
          score: isCorrect ? 1.0 : 0.0,
          explanation: {
            headline: isCorrect ? 'Regime Verified by Spectral Analysis' : 'Mispredicted Dynamical Regime',
            mathEquation: `\\theta_{t+1} - 3.5 = (1 - \\alpha) (\\theta_t - 3.5) \\implies |1 - ${alpha.toFixed(2)}| = ${Math.abs(1 - alpha).toFixed(2)}`,
            numericalEvidence: regimeExplanation,
            pseudocodeLine: 4,
            pseudocodeSnippet: 'contraction_factor = 1.0 - learning_rate * hessian',
            pythonSnippet: `contraction = abs(1.0 - ${alpha} * 1.0) # = ${Math.abs(1 - alpha).toFixed(2)}`,
            graphicalClue: `Spectral radius is ${Math.abs(1 - alpha).toFixed(2)}. Values < 1 contract; = 1 cycles; > 1 diverges.`,
          },
        };
      },
    };
  }

  // Saddle Point Escape Prediction (On saddle surface)
  if (state.config.objectiveId === 'saddle2d') {
    const theta1 = state.theta[0];
    const theta2 = state.theta[1];
    const isStationaryOnRidge = Math.abs(theta1) < 1e-4;

    return {
      id: 'gd-pred-saddle-dynamics',
      algorithmId: 'gradient-descent',
      title: 'Predict Saddle Point Curvature & Escape',
      category: 'saddle_escape',
      prompt: `At point θ = (${theta1.toFixed(3)}, ${theta2.toFixed(3)}) on saddle J(θ) = -θ₁² + θ₂² (Hessian eigenvalues λ₁ = -2, λ₂ = +2): what will occur as steps proceed?`,
      type: 'multiple_choice',
      options: [
        {
          id: 'stall_or_repel',
          label: 'A',
          text: isStationaryOnRidge
            ? 'Stall at (0, 0) because ∇J = (0, 0), even though it is an unstable saddle'
            : 'Explosively accelerate along θ₁ towards ±∞ due to negative curvature (λ₁ = -2)',
          isCorrect: true,
        },
        {
          id: 'converge_minimum',
          label: 'B',
          text: 'Find a global minimum at (0, 0) where loss J reaches its lowest value',
          isCorrect: false,
        },
        {
          id: 'orbit',
          label: 'C',
          text: 'Form a closed elliptical orbit around the saddle center',
          isCorrect: false,
        },
      ],
      evaluate: (userGuess: unknown) => {
        const isCorrect = userGuess === 'stall_or_repel';
        return {
          status: isCorrect ? 'correct' : 'incorrect',
          userAnswerSummary: String(userGuess),
          actualAnswerSummary: 'stall_or_repel',
          score: isCorrect ? 1.0 : 0.0,
          explanation: {
            headline: 'Saddle Point Curvature Mechanics',
            mathEquation: `\\mathbf{H} = \\begin{bmatrix} -2 & 0 \\\\ 0 & 2 \\end{bmatrix}, \\quad \\nabla J = \\begin{bmatrix} -2\\theta_1 \\\\ 2\\theta_2 \\end{bmatrix}`,
            numericalEvidence: isStationaryOnRidge
              ? 'Because θ₁ = 0, the gradient along θ₁ is exactly 0. Vanilla GD cannot escape without perturbation!'
              : `Because θ₁ = ${theta1.toFixed(3)} ≠ 0, ∇J₁ = ${(-2 * theta1).toFixed(3)}. The step pushes away from the origin exponentially.`,
            pseudocodeLine: 2,
            pseudocodeSnippet: 'if norm(grad) < tol and min(eig(H)) < 0: # saddle trap',
            pythonSnippet: `grad = np.array([-2 * ${theta1.toFixed(3)}, 2 * ${theta2.toFixed(3)}])`,
            graphicalClue: 'The saddle surface slopes upward along θ₂ and downward along θ₁.',
          },
        };
      },
    };
  }

  // 2D Anisotropic Valley Directional Prediction
  if (state.config.objectiveId === 'quadratic2d-anisotropic') {
    return {
      id: 'gd-pred-anisotropic-oscillation',
      algorithmId: 'gradient-descent',
      title: 'Predict Anisotropic Step Direction',
      category: 'optimizer_dynamics',
      prompt: `In this ill-conditioned anisotropic valley (Hessian λ_max = 10 along θ₂, λ_min = 1 along θ₁), in which axis will the gradient displacement be largest?`,
      type: 'multiple_choice',
      options: [
        {
          id: 'theta2_steep',
          label: 'A',
          text: 'Along θ₂ (the steep canyon walls, where curvature is 10× greater)',
          isCorrect: true,
        },
        {
          id: 'theta1_shallow',
          label: 'B',
          text: 'Along θ₁ (the flat canyon floor toward the true minimum)',
          isCorrect: false,
        },
        {
          id: 'equal',
          label: 'C',
          text: 'Equal displacements along both axes',
          isCorrect: false,
        },
      ],
      evaluate: (userGuess: unknown) => {
        const isCorrect = userGuess === 'theta2_steep';
        return {
          status: isCorrect ? 'correct' : 'incorrect',
          userAnswerSummary: String(userGuess),
          actualAnswerSummary: 'theta2_steep',
          score: isCorrect ? 1.0 : 0.0,
          explanation: {
            headline: 'Ill-Conditioned Hessian Anisotropy',
            mathEquation: `\\nabla J(\\boldsymbol{\\theta}) = \\begin{bmatrix} 1 \\cdot \\theta_1 \\\\ 10 \\cdot \\theta_2 \\end{bmatrix}, \\quad \\kappa = \\frac{\\lambda_{\\max}}{\\lambda_{\\min}} = 10`,
            numericalEvidence: 'The gradient vector is dominated by the steep perpendicular wall θ₂, pointing across the valley rather than down it.',
            pseudocodeLine: 3,
            pseudocodeSnippet: 'step = -alpha * np.array([1.0 * theta[0], 10.0 * theta[1]])',
            pythonSnippet: `grad = np.array([theta[0], 10.0 * theta[1]]) # 10x steeper along y`,
            graphicalClue: 'Contours are eccentric ellipses stretched along θ₁.',
          },
        };
      },
    };
  }

  return null;
}

// =============================================================================
// 2. BREAK THE ALGORITHM: GRADIENT DESCENT CHALLENGES
// =============================================================================

export const GD_CHALLENGES: ChallengeDefinition<
  GradientDescentConfig,
  GradientDescentSimulationState,
  GradientDescentMetrics
>[] = [
  {
    id: 'GD-01',
    algorithmId: 'gradient-descent',
    title: 'Break the Learning Rate',
    subtitle: 'Spectral stability thresholds and conservative limit cycles',
    difficulty: 'foundational',
    conceptTrap: 'Assuming a higher learning rate always trains faster, or that any high α simply blows up to infinity.',
    objective: 'Tamper with learning rate α on 1D quadratic J(θ) = 1/2(θ - 3.5)² + 1 to discover all 4 dynamical regimes: monotonic (0 < α < 1), oscillatory (1 < α < 2), conservative limit cycle (α = 2.0), and divergence (α > 2.0).',
    instruction: 'Adjust the learning rate slider to α = 2.0. Step or run for at least 6 steps and observe the perpetual bouncing without decay.',
    defaultConfig: {
      objectiveId: 'quadratic1d',
      optimizer: 'vanilla',
      learningRate: 2.0,
      initialTheta: [0.5],
      maxIterations: 50,
    },
    parameterConstraints: [
      {
        key: 'learningRate',
        label: 'Learning Rate (α)',
        type: 'slider',
        min: 0.1,
        max: 2.5,
        step: 0.05,
        helperText: 'Try α = 0.5, 1.5, 2.0, and 2.2',
      },
    ],
    verifyCondition: (state, metrics) => {
      const alpha = state.config.learningRate;
      if (Math.abs(alpha - 2.0) < 0.02 && state.stepNumber >= 4) {
        return {
          passed: true,
          message: 'SUCCESS: You produced a conservative limit cycle! At α = 2.0, |1 - α| = 1.0, creating an eternal undamped 2-cycle.',
          diagnosticEvidence: `Active α = ${alpha.toFixed(2)}, Step: ${state.stepNumber}, Contraction Factor: |1 - α| = ${Math.abs(1 - alpha).toFixed(2)}. Bounces symmetrically between ${state.theta[0].toFixed(2)} and ${(7.0 - state.theta[0]).toFixed(2)}.`,
          metricsObserved: { alpha, isConverged: state.isConverged, stepNumber: state.stepNumber },
        };
      }
      if (alpha > 2.0 && state.isDiverged) {
        return {
          passed: true,
          message: 'SUCCESS: You triggered geometric divergence! At α > 2.0, |1 - α| > 1.0, causing exponential explosion to ±∞.',
          diagnosticEvidence: `Active α = ${alpha.toFixed(2)}, Diverged: ${state.isDiverged}, Loss: ${state.loss.toExponential(2)}.`,
          metricsObserved: { alpha, isDiverged: state.isDiverged },
        };
      }
      return {
        passed: false,
        message: 'Keep experimenting! Set α = 2.0 and take ≥ 4 steps to produce the conservative limit cycle, or α > 2.0 to trigger divergence.',
        diagnosticEvidence: `Current α = ${alpha.toFixed(2)}, Step = ${state.stepNumber}. Target α = 2.00 or > 2.00.`,
      };
    },
    explanation: {
      phenomenon: 'Spectral Stability Boundary in Quadratic Optimization',
      mathematicalProof: 'The error recurrence is e_{t+1} = (1 - α·H) e_t. Convergence requires spectral radius |1 - α·H| < 1, which for H = 1 means 0 < α < 2. At α = 2, 1 - α·H = -1, preserving absolute error forever.',
      practicalLesson: 'In deep learning, setting the learning rate beyond 2/λ_max of the local Hessian produces catastrophic explosion or destabilizing oscillation.',
    },
  },
  {
    id: 'GD-02',
    algorithmId: 'gradient-descent',
    title: 'The Anisotropic Valley Trap',
    subtitle: 'Ill-conditioned Hessian with 10:1 condition number',
    difficulty: 'intermediate',
    conceptTrap: 'Assuming a single scalar learning rate can be simultaneously fast and stable in all coordinate directions.',
    objective: 'Demonstrate that in an anisotropic quadratic J(θ) = 1/2 θ₁² + 5 θ₂² (λ_max = 10, λ_min = 1), setting α = 0.21 causes divergence in θ₂ while θ₁ is still contracting.',
    instruction: 'Select the 2D Anisotropic Objective. Set α to 0.21. Advance the simulation and observe the trajectory blowing up along the vertical axis while contracting horizontally.',
    defaultConfig: {
      objectiveId: 'quadratic2d-anisotropic',
      optimizer: 'vanilla',
      learningRate: 0.21,
      initialTheta: [2.0, 1.0],
      maxIterations: 40,
    },
    parameterConstraints: [
      {
        key: 'learningRate',
        label: 'Learning Rate (α)',
        type: 'slider',
        min: 0.05,
        max: 0.30,
        step: 0.01,
        helperText: 'Critical threshold is α_crit = 2 / 10 = 0.20',
      },
    ],
    verifyCondition: (state) => {
      const alpha = state.config.learningRate;
      const step = state.stepNumber;
      if (alpha >= 0.205 && (state.isDiverged || Math.abs(state.theta[1]) > 5.0 || step >= 10)) {
        return {
          passed: true,
          message: 'SUCCESS: You broke the anisotropic Hessian! The steep direction θ₂ (λ=10) diverged because α > 2/λ_max = 0.20, while the shallow direction θ₁ (λ=1) was stable.',
          diagnosticEvidence: `α = ${alpha.toFixed(2)} > 0.20. |θ₂| = ${Math.abs(state.theta[1]).toFixed(2)} exploded while |θ₁| = ${Math.abs(state.theta[0]).toFixed(2)} contracted.`,
          metricsObserved: { alpha, theta: state.theta, isDiverged: state.isDiverged },
        };
      }
      return {
        passed: false,
        message: 'Set α to 0.21 (above 0.20) and step forward to see divergence along θ₂.',
        diagnosticEvidence: `Current α = ${alpha.toFixed(2)}, θ = [${state.theta.map((v) => v.toFixed(2)).join(', ')}]`,
      };
    },
    explanation: {
      phenomenon: 'Hessian Condition Number Pathology (κ = 10)',
      mathematicalProof: 'Stability requires α < 2/λ_i for ALL eigenvalues. Here λ₁ = 1 (stable for α < 2.0) and λ₂ = 10 (stable only for α < 0.20). At α = 0.21, 1 - 0.21(10) = -1.1 < -1 (explosive oscillation), while 1 - 0.21(1) = +0.79 (stable contraction).',
      practicalLesson: 'Why adaptive optimizers (Adam, RMSProp) or momentum are essential: they normalize step sizes by second moments along individual coordinate directions.',
    },
  },
  {
    id: 'GD-03',
    algorithmId: 'gradient-descent',
    title: 'Stop at the Saddle Point',
    subtitle: 'Zero gradient with negative curvature repulsion',
    difficulty: 'advanced',
    conceptTrap: 'Equating zero gradient ∇J = 0 with arriving at a local minimum.',
    objective: 'Start directly on the saddle ridge at (2.0, 0.0) with J(θ) = 1/2 θ₁² - 1/2 θ₂². Step until the algorithm stalls at (0, 0) with zero gradient. Then perturb θ₂ by 0.05 to watch explosive escape along the negative curvature axis.',
    instruction: 'Observe how Vanilla GD freezes at (0, 0) because ∇J(0,0) = (0,0). Then nudge initial θ₂ to 0.05 to break symmetry and escape.',
    defaultConfig: {
      objectiveId: 'saddle2d',
      optimizer: 'vanilla',
      learningRate: 0.1,
      initialTheta: [0.5, 0.0],
      maxIterations: 50,
    },
    parameterConstraints: [
      {
        key: 'initialTheta2',
        label: 'Initial θ₂ (Perturbation)',
        type: 'slider',
        min: 0.0,
        max: 0.2,
        step: 0.01,
        helperText: 'Set to 0.00 to stall at origin, or 0.05 to escape',
      },
    ],
    verifyCondition: (state) => {
      const theta1 = state.theta[0];
      const theta2 = state.theta[1];
      const atOrigin = Math.abs(theta1) < 0.15 && Math.abs(theta2) < 1e-4;
      const escaped = Math.abs(theta2) > 1.0 || (Math.abs(theta2) > 0.5 && state.stepNumber >= 20);

      if (atOrigin && state.stepNumber >= 8) {
        return {
          passed: true,
          message: 'SADDLE STALL CONFIRMED: The algorithm is trapped at the saddle point (0, 0) where ∇J = (0, 0), even though it is NOT a minimum! Now perturb θ₂ to 0.05.',
          diagnosticEvidence: `θ = [${theta1.toFixed(4)}, ${theta2.toFixed(4)}], ||∇J|| = ${state.gradientNorm.toExponential(2)} ≈ 0. Loss = ${state.loss.toFixed(4)}.`,
          metricsObserved: { theta: state.theta, gradNorm: state.gradientNorm },
        };
      }

      if (escaped) {
        return {
          passed: true,
          message: 'SUCCESS: Negative curvature escape! With θ₂ ≠ 0, the negative eigenvalue λ₂ = -1 accelerated the parameter away from the saddle towards ±∞.',
          diagnosticEvidence: `θ₂ escaped to ${theta2.toFixed(2)}, Loss dropped to ${state.loss.toFixed(2)}.`,
          metricsObserved: { theta: state.theta, loss: state.loss },
        };
      }

      return {
        passed: false,
        message: 'Step forward to reach (0, 0) on the ridge, or set θ₂ = 0.05 to observe the negative curvature escape.',
        diagnosticEvidence: `Current θ = [${theta1.toFixed(3)}, ${theta2.toFixed(3)}]`,
      };
    },
    explanation: {
      phenomenon: 'First-Order Inability to Distinguish Saddles from Minima',
      mathematicalProof: 'At the saddle (0,0), ∇J = (0,0). Gradient descent update is θ_{t+1} = θ_t - α(0) = θ_t. Along θ₂, update is θ_{t+1,2} = (1 + α)θ_{t,2}. When θ₂ = 0, it never moves. When θ₂ ≠ 0, it accelerates exponentially away.',
      practicalLesson: 'In deep neural networks, high-dimensional saddle points are far more common than bad local minima. Stochastic Gradient Descent (SGD) introduces gradient noise that naturally breaks saddle symmetry.',
    },
  },
  {
    id: 'GD-04',
    algorithmId: 'gradient-descent',
    title: 'The Rosenbrock Banana Valley',
    subtitle: 'Curved non-convex canyon with ill-conditioned curvature',
    difficulty: 'pathological',
    conceptTrap: 'Assuming gradient descent always follows the valley floor.',
    objective: 'Navigate the banana-shaped Rosenbrock valley J(θ) = 100(θ₂ - θ₁²)² + (1 - θ₁)². Observe how Vanilla GD bounces wildly across the canyon walls while Adam smoothly tracks the parabolic curve.',
    instruction: 'Set optimizer to Vanilla GD with α = 0.002. Run 30 steps to observe severe zigzagging across walls.',
    defaultConfig: {
      objectiveId: 'rosenbrock2d',
      optimizer: 'vanilla',
      learningRate: 0.002,
      initialTheta: [-1.2, 1.0],
      maxIterations: 60,
    },
    parameterConstraints: [
      {
        key: 'optimizer',
        label: 'Optimizer',
        type: 'select',
        options: [
          { value: 'vanilla', label: 'Vanilla GD (Zigzag)' },
          { value: 'momentum', label: 'Polyak Momentum' },
          { value: 'adam', label: 'Adam Optimizer' },
        ],
      },
    ],
    verifyCondition: (state) => {
      if (state.stepNumber >= 15) {
        return {
          passed: true,
          message: `SUCCESS: You observed the Rosenbrock curvature geometry with ${(state.config.optimizer ?? 'vanilla').toUpperCase()}! Notice how the trajectory negotiates the parabolic curve θ₂ = θ₁².`,
          diagnosticEvidence: `Step: ${state.stepNumber}, θ = [${state.theta.map((v) => v.toFixed(3)).join(', ')}], Loss = ${state.loss.toFixed(4)}.`,
          metricsObserved: { optimizer: state.config.optimizer ?? 'vanilla', loss: state.loss },
        };
      }
      return {
        passed: false,
        message: 'Take at least 15 steps to observe the trajectory navigating the narrow Rosenbrock ravine.',
        diagnosticEvidence: `Step = ${state.stepNumber}/15`,
      };
    },
    explanation: {
      phenomenon: 'Ravine Curvature and Directional Misalignment',
      mathematicalProof: 'The gradient vector is nearly perpendicular to the valley floor because the parabolic walls are thousands of times steeper than the gentle gradient along (1, 1).',
      practicalLesson: 'First-order gradient descent without momentum wastes almost all its steps bouncing back and forth across the ravine rather than moving forward.',
    },
  },
  {
    id: 'GD-05',
    algorithmId: 'gradient-descent',
    title: 'Trapped in the Rastrigin Multimodal Maze',
    subtitle: 'Highly non-convex landscape with dozens of local minima',
    difficulty: 'pathological',
    conceptTrap: 'Believing gradient descent guarantees finding the global minimum in non-convex optimization.',
    objective: 'Initialize Vanilla GD at (2.5, 2.5) on the Rastrigin function. Watch it get trapped permanently in a suboptimal local basin (Loss > 20.0), far from the true global minimum at (0, 0) with Loss = 0.',
    instruction: 'Run Vanilla GD and note that it converges to a local sink. Then switch to Momentum or Adam with tuning to see if inertia carries it closer to the global basin.',
    defaultConfig: {
      objectiveId: 'rastrigin2d',
      optimizer: 'vanilla',
      learningRate: 0.02,
      initialTheta: [2.5, 2.5],
      maxIterations: 60,
    },
    parameterConstraints: [
      {
        key: 'optimizer',
        label: 'Optimizer',
        type: 'select',
        options: [
          { value: 'vanilla', label: 'Vanilla GD' },
          { value: 'momentum', label: 'Momentum (β=0.9)' },
          { value: 'adam', label: 'Adam' },
        ],
      },
    ],
    verifyCondition: (state) => {
      const distToGlobal = Math.hypot(state.theta[0], state.theta[1]);
      if ((state.isConverged || state.stepNumber >= 15) && distToGlobal > 0.5 && state.loss > 0.8) {
        return {
          passed: true,
          message: 'LOCAL MINIMUM TRAP CONFIRMED: Vanilla GD is trapped in a local basin! Loss remains far above global minimum 0.0.',
          diagnosticEvidence: `Active at θ = [${state.theta.map((v) => v.toFixed(2)).join(', ')}], Loss = ${state.loss.toFixed(2)} (Global minimum is at (0, 0) with J=0).`,
          metricsObserved: { theta: state.theta, loss: state.loss, isConverged: state.isConverged },
        };
      }
      return {
        passed: false,
        message: 'Step until convergence to confirm the algorithm gets trapped in a local basin.',
        diagnosticEvidence: `Current θ = [${state.theta.map((v) => v.toFixed(2)).join(', ')}], Loss = ${state.loss.toFixed(2)}`,
      };
    },
    explanation: {
      phenomenon: 'Non-Convex Basin of Attraction Partitioning',
      mathematicalProof: 'Rastrigin has a cosine modulation term 10 cos(2πθ_i) superimposed on a quadratic bowl. This creates dozens of local basins of attraction with zero gradient rims separating them.',
      practicalLesson: 'In non-convex optimization, local search methods can only guarantee convergence to a stationary point (∇J = 0) within the initial basin of attraction, not the global optimum.',
    },
  },
];
