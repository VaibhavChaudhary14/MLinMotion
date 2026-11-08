import type { SimulationMetrics, SimulationExplanation, SavedExperimentRecord } from './types.ts';

// -----------------------------------------------------------------------------
// 1. TYPES & DATA CONTRACTS
// -----------------------------------------------------------------------------

export type GradientDescentObjectiveId =
  | 'quadratic1d'
  | 'quadratic2d-isotropic'
  | 'quadratic2d-anisotropic';

export type ConvergenceRegime =
  | 'monotonic'
  | 'deadbeat'
  | 'oscillating'
  | 'limit-cycle'
  | 'divergent'
  | 'stationary'
  | 'running';

export interface GradientDescentObjective {
  id: GradientDescentObjectiveId;
  name: string;
  dimension: 1 | 2;
  description: string;
  formulaLatex: string;
  gradientLatex: string;
  globalOptimum: number[];
  minimumLoss: number;
  bounds: { min: number[]; max: number[] };
  hessian: number[][];
  eigenvalues: { lambdaMax: number; lambdaMin: number };
  criticalLearningRate: number; // 2 / lambdaMax
  evaluateLoss(theta: number[]): number;
  evaluateGradient(theta: number[]): number[];
}

export interface OptimizerState {
  type: 'vanilla' | 'momentum' | 'adam';
  velocity?: number[];
  m?: number[];
  v?: number[];
  t?: number;
}

export interface GradientDescentConfig {
  objectiveId: GradientDescentObjectiveId;
  learningRate: number; // alpha
  initialTheta?: number[];
  maxIterations?: number; // default: 50
  gradientTolerance?: number; // default: 1e-4
  lossTolerance?: number; // default: 1e-7
  divergenceLossThreshold?: number; // default: 1e7
  divergenceCoordThreshold?: number; // default: 1e5
}

export interface GradientDescentSnapshot {
  stepNumber: number;
  iteration: number;
  theta: number[];
  prevTheta: number[];
  loss: number;
  gradient: number[];
  gradientNorm: number;
  stepDisplacement: number[];
  regime: ConvergenceRegime;
  isConverged: boolean;
  isDiverged: boolean;
  isLimitCycle: boolean;
  isStationary: boolean;
  stopReason?: string;
  optimizerState: OptimizerState;
}

export interface GradientDescentSimulationState extends GradientDescentSnapshot {
  config: GradientDescentConfig;
  objective: GradientDescentObjective;
  pathHistory: number[][]; // [[theta_0], [theta_1], ...]
  lossHistory: number[];
  gradientNormHistory: number[];
  historyStack: GradientDescentSnapshot[];
}

export interface GradientDescentMetrics extends SimulationMetrics {
  objectiveId: GradientDescentObjectiveId;
  dimension: number;
  theta: number[];
  loss: number;
  gradientNorm: number;
  stepDisplacementNorm: number;
  learningRate: number;
  criticalLearningRate: number;
  learningRateRatio: number; // alpha / alpha_crit
  regime: ConvergenceRegime;
  isConverged: boolean;
  isDiverged: boolean;
  isLimitCycle: boolean;
  isStationary: boolean;
  stopReason?: string;
}

// -----------------------------------------------------------------------------
// 2. ANALYTICAL OBJECTIVES REPOSITORY
// -----------------------------------------------------------------------------

export const GRADIENT_DESCENT_OBJECTIVES: Record<
  GradientDescentObjectiveId,
  GradientDescentObjective
> = {
  // Model A: One-dimensional quadratic: J(theta) = 0.5 * (theta - 3.5)^2 + 1
  quadratic1d: {
    id: 'quadratic1d',
    name: '1D Quadratic Loss',
    dimension: 1,
    description: 'J(θ) = 0.5(θ - 3.5)² + 1. Global minimum at θ* = 3.5 with loss J* = 1.',
    formulaLatex: 'J(\\theta) = \\frac{1}{2}(\\theta - 3.5)^2 + 1',
    gradientLatex: '\\nabla J(\\theta) = \\theta - 3.5',
    globalOptimum: [3.5],
    minimumLoss: 1.0,
    bounds: { min: [-1.0], max: [8.0] },
    hessian: [[1.0]],
    eigenvalues: { lambdaMax: 1.0, lambdaMin: 1.0 },
    criticalLearningRate: 2.0, // 2 / 1.0 = 2.0
    evaluateLoss(theta: number[]): number {
      const t = theta[0];
      return 0.5 * (t - 3.5) ** 2 + 1.0;
    },
    evaluateGradient(theta: number[]): number[] {
      const t = theta[0];
      return [t - 3.5];
    },
  },

  // Model B1: 2D Isotropic Quadratic Bowl: H = [[1, 0], [0, 1]], optimum = [3, 2], c = 0
  'quadratic2d-isotropic': {
    id: 'quadratic2d-isotropic',
    name: '2D Isotropic Bowl (κ = 1)',
    dimension: 2,
    description:
      'J(θ) = 0.5(θ₁ - 3)² + 0.5(θ₂ - 2)². Circular symmetric equipotential contours; condition number κ = 1.',
    formulaLatex:
      'J(\\boldsymbol{\\theta}) = \\frac{1}{2}(\\theta_1 - 3)^2 + \\frac{1}{2}(\\theta_2 - 2)^2',
    gradientLatex:
      '\\nabla J(\\boldsymbol{\\theta}) = \\begin{bmatrix} \\theta_1 - 3 \\\\ \\theta_2 - 2 \\end{bmatrix}',
    globalOptimum: [3.0, 2.0],
    minimumLoss: 0.0,
    bounds: { min: [-1.0, -2.0], max: [7.0, 6.0] },
    hessian: [
      [1.0, 0.0],
      [0.0, 1.0],
    ],
    eigenvalues: { lambdaMax: 1.0, lambdaMin: 1.0 },
    criticalLearningRate: 2.0, // 2 / 1.0 = 2.0
    evaluateLoss(theta: number[]): number {
      const [t1, t2] = theta;
      return 0.5 * (t1 - 3.0) ** 2 + 0.5 * (t2 - 2.0) ** 2;
    },
    evaluateGradient(theta: number[]): number[] {
      const [t1, t2] = theta;
      return [t1 - 3.0, t2 - 2.0];
    },
  },

  // Model B2: 2D Anisotropic Quadratic Bowl: H = [[1, 0], [0, 10]], optimum = [3, 2], c = 0
  'quadratic2d-anisotropic': {
    id: 'quadratic2d-anisotropic',
    name: '2D Anisotropic Valley (κ = 10)',
    dimension: 2,
    description:
      'J(θ) = 0.5(θ₁ - 3)² + 5(θ₂ - 2)². Steep canyon with 10:1 eigenvalue ratio (κ = 10); critical learning rate α_crit = 0.20.',
    formulaLatex:
      'J(\\boldsymbol{\\theta}) = \\frac{1}{2}(\\theta_1 - 3)^2 + 5(\\theta_2 - 2)^2',
    gradientLatex:
      '\\nabla J(\\boldsymbol{\\theta}) = \\begin{bmatrix} \\theta_1 - 3 \\\\ 10(\\theta_2 - 2) \\end{bmatrix}',
    globalOptimum: [3.0, 2.0],
    minimumLoss: 0.0,
    bounds: { min: [-1.0, -0.5], max: [7.0, 4.5] },
    hessian: [
      [1.0, 0.0],
      [0.0, 10.0],
    ],
    eigenvalues: { lambdaMax: 10.0, lambdaMin: 1.0 },
    criticalLearningRate: 0.2, // 2 / 10.0 = 0.20
    evaluateLoss(theta: number[]): number {
      const [t1, t2] = theta;
      return 0.5 * (t1 - 3.0) ** 2 + 5.0 * (t2 - 2.0) ** 2;
    },
    evaluateGradient(theta: number[]): number[] {
      const [t1, t2] = theta;
      return [t1 - 3.0, 10.0 * (t2 - 2.0)];
    },
  },
};

// -----------------------------------------------------------------------------
// 3. UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

export function vectorNorm(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

export function vectorSubtract(a: number[], b: number[]): number[] {
  return a.map((val, i) => val - b[i]);
}

export function vectorScale(v: number[], scalar: number): number[] {
  return v.map((val) => val * scalar);
}

export function finiteDifferenceGradient(
  objective: GradientDescentObjective,
  theta: number[],
  eps = 1e-6
): number[] {
  const grad: number[] = [];
  for (let i = 0; i < theta.length; i++) {
    const thetaPlus = [...theta];
    const thetaMinus = [...theta];
    thetaPlus[i] += eps;
    thetaMinus[i] -= eps;
    const lossPlus = objective.evaluateLoss(thetaPlus);
    const lossMinus = objective.evaluateLoss(thetaMinus);
    grad.push((lossPlus - lossMinus) / (2 * eps));
  }
  return grad;
}

/**
 * Classifies the theoretical behavioral regime based on step size alpha and objective curvature.
 */
export function classifyRegime(
  objective: GradientDescentObjective,
  alpha: number,
  initialTheta: number[]
): ConvergenceRegime {
  const { dimension, eigenvalues, globalOptimum } = objective;

  // Check if stationary at initialization
  const isStationaryAtStart = initialTheta.every(
    (val, i) => Math.abs(val - globalOptimum[i]) < 1e-9
  );
  if (isStationaryAtStart) {
    return 'stationary';
  }

  if (dimension === 1) {
    // Exact scalar rules for J(theta) = 0.5(theta - 3.5)^2 + 1
    if (alpha <= 0) return 'running';
    if (Math.abs(alpha - 1.0) < 1e-9) return 'deadbeat';
    if (alpha > 0 && alpha < 1.0) return 'monotonic';
    if (alpha > 1.0 && alpha < 2.0) return 'oscillating';
    if (Math.abs(alpha - 2.0) < 1e-9) return 'limit-cycle';
    return 'divergent';
  } else {
    // Multidimensional positive-definite rules: stability depends on lambda_max
    const alphaCrit = 2.0 / eigenvalues.lambdaMax;
    if (alpha <= 0) return 'running';
    if (Math.abs(alpha - alphaCrit) < 1e-9) return 'limit-cycle';
    if (alpha > alphaCrit) return 'divergent';

    // Sub-critical: check if any modal contraction factor is negative (causing oscillation)
    // r_i = 1 - alpha * lambda_i. If alpha > 1 / lambda_max, oscillatory along that mode.
    const alphaOscillateThreshold = 1.0 / eigenvalues.lambdaMax;
    if (alpha > alphaOscillateThreshold) {
      return 'oscillating';
    }
    // Check if deadbeat along dominant mode
    if (Math.abs(alpha - alphaOscillateThreshold) < 1e-9 && eigenvalues.lambdaMax === eigenvalues.lambdaMin) {
      return 'deadbeat';
    }
    return 'monotonic';
  }
}

// -----------------------------------------------------------------------------
// 4. FUNCTIONAL SIMULATION API
// -----------------------------------------------------------------------------

/**
 * Creates and initializes a fresh Gradient Descent simulation state.
 */
export function createGradientDescentSimulation(
  config: GradientDescentConfig
): GradientDescentSimulationState {
  const objective = GRADIENT_DESCENT_OBJECTIVES[config.objectiveId];
  if (!objective) {
    throw new Error(`Unknown objective ID: ${config.objectiveId}`);
  }

  // Determine initial coordinates (defaults: 1D -> [0.5], 2D-iso -> [0.0, 5.0], 2D-aniso -> [0.5, 3.8])
  const initialTheta =
    config.initialTheta && config.initialTheta.length === objective.dimension
      ? [...config.initialTheta]
      : objective.dimension === 1
      ? [0.5]
      : objective.id === 'quadratic2d-anisotropic'
      ? [0.5, 3.8]
      : [0.0, 5.0];

  const initialLoss = objective.evaluateLoss(initialTheta);
  const initialGrad = objective.evaluateGradient(initialTheta);
  const initialGradNorm = vectorNorm(initialGrad);
  const regime = classifyRegime(objective, config.learningRate, initialTheta);

  const isStationary = initialGradNorm < (config.gradientTolerance ?? 1e-4);
  const isConverged = isStationary;

  const initialSnapshot: GradientDescentSnapshot = {
    stepNumber: 0,
    iteration: 0,
    theta: initialTheta,
    prevTheta: initialTheta,
    loss: initialLoss,
    gradient: initialGrad,
    gradientNorm: initialGradNorm,
    stepDisplacement: objective.dimension === 1 ? [0.0] : [0.0, 0.0],
    regime,
    isConverged,
    isDiverged: false,
    isLimitCycle: false,
    isStationary,
    stopReason: isStationary ? 'Stationary at global optimum (zero gradient at initialization).' : undefined,
    optimizerState: { type: 'vanilla' },
  };

  return {
    ...initialSnapshot,
    config: {
      maxIterations: 50,
      gradientTolerance: 1e-4,
      lossTolerance: 1e-7,
      divergenceLossThreshold: 1e7,
      divergenceCoordThreshold: 1e5,
      ...config,
      initialTheta,
    },
    objective,
    pathHistory: [initialTheta],
    lossHistory: [initialLoss],
    gradientNormHistory: [initialGradNorm],
    historyStack: [initialSnapshot],
  };
}

/**
 * Executes a single deterministic step of Vanilla Gradient Descent.
 */
export function stepGradientDescent(
  state: GradientDescentSimulationState
): GradientDescentSimulationState {
  // If already stopped by convergence or divergence, return state unchanged
  if (state.isConverged || state.isDiverged) {
    return state;
  }

  const { config, objective, theta, iteration, stepNumber } = state;
  const alpha = config.learningRate;
  const gradTol = config.gradientTolerance ?? 1e-4;
  const maxIter = config.maxIterations ?? 50;
  const divLossThresh = config.divergenceLossThreshold ?? 1e7;
  const divCoordThresh = config.divergenceCoordThreshold ?? 1e5;

  // 1. Current gradient and loss
  const currentGrad = objective.evaluateGradient(theta);

  // 2. Numerical safety check on gradient
  const hasNaNInGrad = currentGrad.some((val) => !Number.isFinite(val));
  if (hasNaNInGrad) {
    const errorSnapshot: GradientDescentSnapshot = {
      ...state,
      stepNumber: stepNumber + 1,
      iteration: iteration + 1,
      isDiverged: true,
      stopReason: 'Numerical failure: non-finite gradient encountered.',
    };
    return {
      ...state,
      ...errorSnapshot,
      historyStack: [...state.historyStack, errorSnapshot],
    };
  }

  // 3. Compute step displacement: delta = -alpha * grad
  const displacement = vectorScale(currentGrad, -alpha);
  const nextTheta = theta.map((val, i) => val + displacement[i]);

  // 4. Validate next parameter coordinates
  const hasNaNInTheta = nextTheta.some((val) => !Number.isFinite(val));
  const isOutOfCoordBounds = nextTheta.some((val) => Math.abs(val) > divCoordThresh);

  if (hasNaNInTheta || isOutOfCoordBounds) {
    const divSnapshot: GradientDescentSnapshot = {
      stepNumber: stepNumber + 1,
      iteration: iteration + 1,
      theta: nextTheta.map((v) => (Number.isFinite(v) ? v : 1e6)),
      prevTheta: theta,
      loss: Infinity,
      gradient: currentGrad,
      gradientNorm: vectorNorm(currentGrad),
      stepDisplacement: displacement,
      regime: 'divergent',
      isConverged: false,
      isDiverged: true,
      isLimitCycle: false,
      isStationary: false,
      stopReason: 'Geometric divergence: parameter coordinates exceeded stability threshold.',
      optimizerState: { type: 'vanilla' },
    };
    return {
      ...state,
      ...divSnapshot,
      pathHistory: [...state.pathHistory, divSnapshot.theta],
      lossHistory: [...state.lossHistory, 1e8],
      gradientNormHistory: [...state.gradientNormHistory, 1e8],
      historyStack: [...state.historyStack, divSnapshot],
    };
  }

  // 5. Evaluate new loss and new gradient
  const nextLoss = objective.evaluateLoss(nextTheta);
  const nextGrad = objective.evaluateGradient(nextTheta);
  const nextGradNorm = vectorNorm(nextGrad);

  // 6. Divergence check
  // Condition A: Parameter magnitude or loss exceeded numerical ceiling
  // Condition B: Theoretical regime is 'divergent' and distance to optimum has expanded by > 5x
  const initialDist = vectorNorm(vectorSubtract(state.pathHistory[0], objective.globalOptimum));
  const currentDist = vectorNorm(vectorSubtract(nextTheta, objective.globalOptimum));
  const baseRegime = classifyRegime(objective, alpha, state.config.initialTheta || state.pathHistory[0]);
  const isGeometricExpansion =
    baseRegime === 'divergent' && currentDist > Math.max(5.0, initialDist * 5.0);

  const isDivergenceDetected =
    !Number.isFinite(nextLoss) ||
    nextLoss > divLossThresh ||
    isOutOfCoordBounds ||
    isGeometricExpansion;

  if (isDivergenceDetected) {
    const divSnapshot: GradientDescentSnapshot = {
      stepNumber: stepNumber + 1,
      iteration: iteration + 1,
      theta: nextTheta,
      prevTheta: theta,
      loss: Number.isFinite(nextLoss) ? nextLoss : 1e8,
      gradient: nextGrad,
      gradientNorm: nextGradNorm,
      stepDisplacement: displacement,
      regime: 'divergent',
      isConverged: false,
      isDiverged: true,
      isLimitCycle: false,
      isStationary: false,
      stopReason: isGeometricExpansion
        ? `Geometric divergence: parameter distance expanded exponentially away from minimum (α = ${alpha.toFixed(2)} > α_crit = ${objective.criticalLearningRate.toFixed(2)}).`
        : `Geometric divergence: loss (${nextLoss}) exceeded divergence ceiling.`,
      optimizerState: { type: 'vanilla' },
    };
    return {
      ...state,
      ...divSnapshot,
      pathHistory: [...state.pathHistory, nextTheta],
      lossHistory: [...state.lossHistory, nextLoss],
      gradientNormHistory: [...state.gradientNormHistory, nextGradNorm],
      historyStack: [...state.historyStack, divSnapshot],
    };
  }

  // 7. Convergence & Limit Cycle Detection
  const nextIteration = iteration + 1;
  const isGradientConverged = nextGradNorm < gradTol;

  // Specific detection for the 2-cycle undamped oscillation (limit cycle)
  // For 1D at alpha = 2, theta flips symmetrically: (theta_{t+1} - 3.5) = -(theta_t - 3.5)
  // Check if loss remains identical to step 0 and distance to theta_{t-1} matches 2 * distance to minimum
  const isLimitCycleDetected =
    (objective.dimension === 1 && Math.abs(alpha - 2.0) < 1e-9 && !isGradientConverged) ||
    (state.pathHistory.length >= 2 &&
      Math.abs(nextLoss - state.lossHistory[0]) < 1e-4 &&
      vectorNorm(vectorSubtract(nextTheta, state.pathHistory[state.pathHistory.length - 2])) < 1e-4 &&
      vectorNorm(displacement) > 1e-3);

  const isMaxIterationsReached = nextIteration >= maxIter;
  const isConverged = isGradientConverged || (isMaxIterationsReached && !isLimitCycleDetected);

  let stopReason: string | undefined = undefined;
  if (isLimitCycleDetected) {
    stopReason = isMaxIterationsReached
      ? `Maximum iteration limit (${maxIter}) reached during persistent undamped limit cycle.`
      : 'Persistent 2-cycle undamped oscillation: conservative limit cycle alternating with constant loss. The system does not converge or diverge.';
  } else if (isGradientConverged) {
    stopReason = `Convergence achieved: gradient norm ||∇J|| = ${nextGradNorm.toExponential(3)} fell below tolerance (${gradTol}).`;
  } else if (isMaxIterationsReached) {
    stopReason = `Maximum iteration limit (${maxIter}) reached.`;
  }

  const regime = isLimitCycleDetected
    ? 'limit-cycle'
    : classifyRegime(objective, alpha, state.config.initialTheta || state.pathHistory[0]);

  const nextSnapshot: GradientDescentSnapshot = {
    stepNumber: stepNumber + 1,
    iteration: nextIteration,
    theta: nextTheta,
    prevTheta: theta,
    loss: nextLoss,
    gradient: nextGrad,
    gradientNorm: nextGradNorm,
    stepDisplacement: displacement,
    regime,
    isConverged: isConverged && !isLimitCycleDetected,
    isDiverged: false,
    isLimitCycle: isLimitCycleDetected,
    isStationary: false,
    stopReason,
    optimizerState: { type: 'vanilla' },
  };

  return {
    ...state,
    ...nextSnapshot,
    pathHistory: [...state.pathHistory, nextTheta],
    lossHistory: [...state.lossHistory, nextLoss],
    gradientNormHistory: [...state.gradientNormHistory, nextGradNorm],
    historyStack: [...state.historyStack, nextSnapshot],
  };
}

/**
 * Reversibility: Restores the exact preceding simulation state.
 */
export function stepBackGradientDescent(
  state: GradientDescentSimulationState
): GradientDescentSimulationState {
  if (state.historyStack.length <= 1) {
    return state;
  }

  const nextHistoryStack = state.historyStack.slice(0, -1);
  const restoredSnapshot = nextHistoryStack[nextHistoryStack.length - 1];

  return {
    ...state,
    ...restoredSnapshot,
    pathHistory: state.pathHistory.slice(0, -1),
    lossHistory: state.lossHistory.slice(0, -1),
    gradientNormHistory: state.gradientNormHistory.slice(0, -1),
    historyStack: nextHistoryStack,
  };
}

/**
 * Runs the simulation for up to `maxSteps` or until a terminal condition is met.
 */
export function runGradientDescent(
  state: GradientDescentSimulationState,
  maxSteps = 50
): GradientDescentSimulationState {
  let currentState = state;
  let stepsRun = 0;

  while (
    !currentState.isConverged &&
    !currentState.isDiverged &&
    !currentState.isLimitCycle &&
    stepsRun < maxSteps
  ) {
    currentState = stepGradientDescent(currentState);
    stepsRun++;
  }

  return currentState;
}

/**
 * Resets the simulation to the initial configuration.
 */
export function resetGradientDescent(
  config: GradientDescentConfig
): GradientDescentSimulationState {
  return createGradientDescentSimulation(config);
}

/**
 * Returns structured metrics for the active state.
 */
export function getGradientDescentMetrics(
  state: GradientDescentSimulationState
): GradientDescentMetrics {
  const alphaCrit = state.objective.criticalLearningRate;
  const ratio = state.config.learningRate / alphaCrit;
  const stepDispNorm = vectorNorm(state.stepDisplacement);

  return {
    iteration: state.iteration,
    converged: state.isConverged,
    objectiveId: state.objective.id,
    dimension: state.objective.dimension,
    theta: state.theta,
    loss: state.loss,
    gradientNorm: state.gradientNorm,
    stepDisplacementNorm: stepDispNorm,
    learningRate: state.config.learningRate,
    criticalLearningRate: alphaCrit,
    learningRateRatio: ratio,
    regime: state.regime,
    isConverged: state.isConverged,
    isDiverged: state.isDiverged,
    isLimitCycle: state.isLimitCycle,
    isStationary: state.isStationary,
    stopReason: state.stopReason,
  };
}

/**
 * Generates pedagogical multi-representation explanations for the active state.
 */
export function getGradientDescentExplanation(
  state: GradientDescentSimulationState
): SimulationExplanation {
  const { objective, theta, prevTheta, loss, gradient, config, regime, isConverged, isDiverged, isLimitCycle, iteration } = state;
  const alpha = config.learningRate;
  const alphaCrit = objective.criticalLearningRate;

  // 1. Headline
  let headline = `ITERATION ${String(iteration).padStart(2, '0')} // `;
  if (isDiverged) {
    headline += 'GEOMETRIC DIVERGENCE (α > α_crit)';
  } else if (isLimitCycle) {
    headline += 'PERSISTENT 2-CYCLE OSCILLATION (α = α_crit)';
  } else if (isConverged) {
    headline += 'CONVERGENCE ACHIEVED (||∇J|| < ε)';
  } else if (regime === 'deadbeat') {
    headline += 'DEADBEAT CRITICAL STEP (α = 1.0)';
  } else if (regime === 'oscillating') {
    headline += 'OSCILLATING STEP WITH OVERSHOOT';
  } else if (regime === 'monotonic') {
    headline += 'MONOTONIC VISCOUS DESCENT';
  } else {
    headline += 'GRADIENT STEP COMPUTATION';
  }

  // 2. Mathematical Description
  let description = '';
  if (iteration === 0) {
    description = `Initialized parameter at θ = [${theta.map((v) => v.toFixed(3)).join(', ')}] with loss J = ${loss.toFixed(4)}. Analytical gradient is ∇J = [${gradient.map((v) => v.toFixed(3)).join(', ')}]. Learning rate α = ${alpha.toFixed(3)} (critical limit α_crit = ${alphaCrit.toFixed(2)}).`;
  } else if (isLimitCycle) {
    description = `At α = 2.0 (the exact stability boundary), the error multiplier is 1 - α = -1.0. Each step flips parameter coordinates across the optimum with constant amplitude |θ - θ*| and identical loss J(θ) = ${loss.toFixed(4)}. The sequence is a conservative 2-cycle that neither converges nor diverges.`;
  } else if (isDiverged) {
    description = `Learning rate α = ${alpha.toFixed(3)} exceeds critical spectral limit α_crit = ${alphaCrit.toFixed(2)}. The error propagation factor |1 - α·λ_max| > 1, causing geometric explosion of the parameter distance away from the minimum.`;
  } else if (regime === 'deadbeat') {
    description = `At α = 1.0, the contraction factor (1 - α) = 0. The step displacement exactly cancels the distance to the optimum: θ - 1.0·(θ - 3.5) = 3.5. Optimum reached in exactly one update!`;
  } else if (regime === 'oscillating') {
    description = `Learning rate 1.0 < α < 2.0 yields a negative contraction factor (-1 < 1 - α < 0). The parameter overshoots the minimum to the opposite side, alternating signs while decaying toward θ*.`;
  } else {
    description = `Learning rate 0 < α < 1.0 provides overdamped monotonic convergence. Step displacement Δθ = -α∇J moves θ smoothly toward θ* without overshooting. Loss decreased by ${(state.lossHistory[state.lossHistory.length - 2] - loss).toFixed(5)}.`;
  }

  // 3. KaTeX Equations
  let equationLatex = '';
  if (objective.dimension === 1) {
    const tVal = theta[0].toFixed(3);
    const pVal = prevTheta[0].toFixed(3);
    const gVal = gradient[0].toFixed(3);
    const dispVal = (-alpha * gradient[0]).toFixed(3);
    equationLatex = `\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t) \\implies ${tVal} = ${pVal} - (${alpha.toFixed(2)})(${gVal}) = ${pVal} ${Number(dispVal) >= 0 ? '+' : ''}${dispVal}`;
  } else {
    const tStr = `\\begin{bmatrix} ${theta[0].toFixed(2)} \\\\ ${theta[1].toFixed(2)} \\end{bmatrix}`;
    const pStr = `\\begin{bmatrix} ${prevTheta[0].toFixed(2)} \\\\ ${prevTheta[1].toFixed(2)} \\end{bmatrix}`;
    const gStr = `\\begin{bmatrix} ${gradient[0].toFixed(2)} \\\\ ${gradient[1].toFixed(2)} \\end{bmatrix}`;
    equationLatex = `\\boldsymbol{\\theta}_{t+1} = \\boldsymbol{\\theta}_t - \\alpha \\nabla J(\\boldsymbol{\\theta}_t) \\implies ${tStr} = ${pStr} - ${alpha.toFixed(2)} ${gStr}`;
  }

  // 4. Misconception Traps
  let misconceptionTrap: string | undefined = undefined;
  if (alpha >= alphaCrit) {
    misconceptionTrap =
      'Common Misconception: "Higher learning rate always learns faster." In reality, when α exceeds 2/λ_max, gradient descent is mathematically unstable and diverges exponentially.';
  } else if (objective.id === 'quadratic2d-anisotropic' && alpha > 0.1) {
    misconceptionTrap =
      'Ill-Conditioning Trap: In valleys with high condition number (κ = 10), gradient descent bounces violently across the steep canyon walls while making frustratingly slow progress along the valley floor.';
  } else if (Math.abs(alpha - 2.0) < 1e-9 && objective.dimension === 1) {
    misconceptionTrap =
      'Limit Cycle Trap: Persistent oscillation at α = 2 is often mistakenly labeled as divergence. The sequence remains strictly bounded with constant loss for all eternity.';
  }

  // 5. Prediction Prompts (Interactive Predict-Before-Reveal Checkpoint)
  let predictionPrompt: SimulationExplanation['predictionPrompt'] = undefined;
  if (iteration === 0) {
    if (objective.dimension === 1) {
      if (Math.abs(alpha - 1.0) < 1e-9) {
        predictionPrompt = {
          question: 'With α = 1.0 on this quadratic function, what will happen on step 1?',
          options: [
            { id: 'opt1', label: 'A', text: 'It will land exactly on the minimum θ* = 3.5 in one step.', isCorrect: true },
            { id: 'opt2', label: 'B', text: 'It will overshoot to θ = 6.5 and oscillate.', isCorrect: false },
            { id: 'opt3', label: 'C', text: 'It will move halfway and take 10 steps to converge.', isCorrect: false },
          ],
          explanation:
            'Correct! For J(θ) = 0.5(θ - 3.5)² + 1, setting α = 1/H = 1.0 produces a deadbeat Newton step that eliminates all error in exactly one update: θ₁ - 3.5 = (1 - 1)(θ₀ - 3.5) = 0.',
        };
      } else if (Math.abs(alpha - 2.0) < 1e-9) {
        predictionPrompt = {
          question: 'With α = 2.0 initialized at θ₀ = 0.5, what will happen over multiple steps?',
          options: [
            { id: 'opt1', label: 'A', text: 'It will explode to infinity (divergence).', isCorrect: false },
            { id: 'opt2', label: 'B', text: 'It will alternate between 0.5 and 6.5 forever (undamped limit cycle).', isCorrect: true },
            { id: 'opt3', label: 'C', text: 'It will eventually converge to 3.5 after 20 iterations.', isCorrect: false },
          ],
          explanation:
            'Correct! The contraction factor is 1 - α = 1 - 2 = -1. The parameter alternates between θ₀ = 0.5 and 2(3.5) - 0.5 = 6.5 with constant loss J = 5.5.',
        };
      }
    }
  }

  return {
    headline,
    description,
    equationLatex,
    pseudocodeLine: iteration === 0 ? 1 : isConverged ? 5 : 3,
    pythonSnippetLine: iteration === 0 ? 3 : 4,
    misconceptionTrap,
    predictionPrompt,
  };
}

// -----------------------------------------------------------------------------
// 5. CLASS IMPLEMENTATION (SimulationEngine Interface)
// -----------------------------------------------------------------------------

export class GradientDescentSimulationEngine {
  readonly algorithmId = 'gradient-descent';
  readonly algorithmName = 'Gradient Descent';

  initialize(config: GradientDescentConfig): GradientDescentSimulationState {
    return createGradientDescentSimulation(config);
  }

  step(state: GradientDescentSimulationState): GradientDescentSimulationState {
    return stepGradientDescent(state);
  }

  stepBack(state: GradientDescentSimulationState): GradientDescentSimulationState {
    return stepBackGradientDescent(state);
  }

  run(state: GradientDescentSimulationState, maxSteps?: number): GradientDescentSimulationState {
    return runGradientDescent(state, maxSteps);
  }

  reset(config: GradientDescentConfig): GradientDescentSimulationState {
    return resetGradientDescent(config);
  }

  getMetrics(state: GradientDescentSimulationState): GradientDescentMetrics {
    return getGradientDescentMetrics(state);
  }

  getExplanation(state: GradientDescentSimulationState): SimulationExplanation {
    return getGradientDescentExplanation(state);
  }

  exportExperiment(state: GradientDescentSimulationState): SavedExperimentRecord {
    return {
      id: `gd-exp-${Date.now()}`,
      algorithmId: this.algorithmId,
      algorithmName: this.algorithmName,
      timestamp: new Date().toISOString(),
      seed: 42,
      config: { ...state.config },
      initialPointsCount: state.objective.dimension,
      finalMetrics: {
        loss: state.loss,
        theta: state.theta,
        gradientNorm: state.gradientNorm,
        iterations: state.iteration,
        regime: state.regime,
        isConverged: state.isConverged,
        isDiverged: state.isDiverged,
        isLimitCycle: state.isLimitCycle,
      },
      summary: `Gradient descent on ${state.objective.name} with α = ${state.config.learningRate}. Final loss: ${state.loss.toFixed(5)} at iteration ${state.iteration}.`,
    };
  }
}
