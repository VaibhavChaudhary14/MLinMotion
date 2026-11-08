/**
 * ML in Motion — Interactive Learning Systems Automated Test Suite
 * Validates Prediction Checkpoints, Tolerance Handling, Challenge Verification,
 * Mathematical Invariants, and Local Learning Analytics.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGDPredictionForStep,
  GD_CHALLENGES,
} from '../src/lib/learning/gradientDescentLearning.ts';
import {
  getKMeansPredictionForStep,
  KMEANS_CHALLENGES,
} from '../src/lib/learning/kmeansLearning.ts';
import {
  createGradientDescentSimulation,
  stepGradientDescent,
  stepBackGradientDescent,
  getGradientDescentMetrics,
} from '../src/lib/simulation/gradientDescentEngine.ts';
import {
  KMeansSimulationEngine,
  calculatePointToCentroidDistance,
} from '../src/lib/simulation/kmeansEngine.ts';
import {
  getInitialProfile,
  calculateProfileStats,
} from '../src/lib/learning/storage.ts';

// =============================================================================
// TEST SUITE 1: PREDICTION CHECKPOINT ENGINE COUPLING & TOLERANCES
// =============================================================================

test('TC-IL-01: GD Prediction — Simulation does not advance before prediction commitment', () => {
  const sim = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 0.4,
    initialTheta: [0.5],
    maxIterations: 50,
  });

  const pred = getGDPredictionForStep(sim);
  assert.ok(pred !== null, 'Prediction question must be generated at step 0');
  assert.equal(pred.category, 'parameter_update');
  assert.equal(pred.type, 'numerical');

  // Verify that generating a prediction question does NOT mutate or step the engine state
  assert.equal(sim.stepNumber, 0);
  assert.equal(sim.theta[0], 0.5);
  assert.equal(sim.historyStack.length, 1);
});

test('TC-IL-02: GD Numerical Tolerance — Evaluates exact match within ±0.05, partial within ±0.20', () => {
  const sim = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 0.4,
    initialTheta: [0.5],
    maxIterations: 50,
  });

  const pred = getGDPredictionForStep(sim);
  assert.ok(pred !== null);

  // Exact target: theta_0 = 0.5, grad = -3.0, next_theta = 0.5 - 0.4*(-3.0) = 1.70
  // Test Exact guess: 1.71 (within 0.05)
  const evalExact = pred.evaluate(1.71, sim, sim);
  assert.equal(evalExact.status, 'correct');
  assert.equal(evalExact.score, 1.0);
  assert.equal(evalExact.isWithinTolerance, true);

  // Test Partial guess: 1.85 (diff = 0.15, within 0.20 window)
  const evalPartial = pred.evaluate(1.85, sim, sim);
  assert.equal(evalPartial.status, 'partially_correct');
  assert.equal(evalPartial.score, 0.5);
  assert.equal(evalPartial.isWithinTolerance, false);

  // Test Incorrect guess: 2.50 (diff = 0.80)
  const evalWrong = pred.evaluate(2.5, sim, sim);
  assert.equal(evalWrong.status, 'incorrect');
  assert.equal(evalWrong.score, 0.0);
  assert.equal(evalWrong.isWithinTolerance, false);
});

test('TC-IL-03: GD Step Progression — Stepping after prediction reproduces exact mathematical value', () => {
  const sim = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 0.4,
    initialTheta: [0.5],
    maxIterations: 50,
  });

  const pred = getGDPredictionForStep(sim);
  assert.ok(pred);
  const nextSim = stepGradientDescent(sim);

  assert.equal(nextSim.stepNumber, 1);
  assert.ok(Math.abs(nextSim.theta[0] - 1.70) < 1e-9, 'Engine step must equal 1.70');

  // Reversibility check: stepBack restores step 0
  const steppedBack = stepBackGradientDescent(nextSim);
  assert.equal(steppedBack.stepNumber, 0);
  assert.equal(steppedBack.theta[0], 0.5);
});

test('TC-IL-04: GD Spectral Stability Prediction Checkpoint evaluates distinct regimes correctly', () => {
  // 1. Monotonic (alpha = 0.5)
  const simMonotonic = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 0.5,
    initialTheta: [0.5],
    maxIterations: 50,
  });
  // Advance to step 1 so it tests stability regime
  const step1 = stepGradientDescent(simMonotonic);
  const predMono = getGDPredictionForStep(step1);
  assert.ok(predMono);
  assert.equal(predMono.category, 'spectral_stability');
  assert.equal(predMono.evaluate('monotonic', step1, step1).status, 'correct');
  assert.equal(predMono.evaluate('divergent', step1, step1).status, 'incorrect');

  // 2. Limit Cycle (alpha = 2.0)
  const simLimit = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 2.0,
    initialTheta: [0.5],
    maxIterations: 50,
  });
  const stepLimit1 = stepGradientDescent(simLimit);
  const predLimit = getGDPredictionForStep(stepLimit1);
  assert.ok(predLimit);
  assert.equal(predLimit.evaluate('limit_cycle', stepLimit1, stepLimit1).status, 'correct');

  // 3. Divergent (alpha = 2.2)
  const simDiverge = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 2.2,
    initialTheta: [0.5],
    maxIterations: 50,
  });
  const stepDiv1 = stepGradientDescent(simDiverge);
  const predDiv = getGDPredictionForStep(stepDiv1);
  assert.ok(predDiv);
  assert.equal(predDiv.evaluate('divergent', stepDiv1, stepDiv1).status, 'correct');
});

test('TC-IL-05: GD Saddle Point Prediction Checkpoint distinguishes ridge stall from negative curvature escape', () => {
  const simSaddleStall = createGradientDescentSimulation({
    objectiveId: 'saddle2d',
    optimizer: 'vanilla',
    learningRate: 0.1,
    initialTheta: [0.0, 2.0], // Exactly on ridge
    maxIterations: 50,
  });

  const predStall = getGDPredictionForStep(simSaddleStall);
  assert.ok(predStall);
  assert.equal(predStall.category, 'saddle_escape');
  const res = predStall.evaluate('stall_or_repel', simSaddleStall, simSaddleStall);
  assert.equal(res.status, 'correct');
});

test('TC-IL-06: KMeans Prediction — Point Assignment correctly evaluates Euclidean argmin', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: 'p0', x: 1.0, y: 1.0 },
    { id: 'p1', x: 8.0, y: 8.0 },
  ];
  const sim = engine.initialize({ k: 2, initMethod: 'random', seed: 42 }, dataset);

  const pred = getKMeansPredictionForStep(sim);
  assert.ok(pred !== null);
  assert.equal(pred.category, 'point_assignment');

  // Find which centroid is actually closest to p0
  const d0 = calculatePointToCentroidDistance(dataset[0], sim.centroids[0]);
  const d1 = calculatePointToCentroidDistance(dataset[0], sim.centroids[1]);
  const closestId = d0 <= d1 ? sim.centroids[0].id : sim.centroids[1].id;
  const otherId = d0 <= d1 ? sim.centroids[1].id : sim.centroids[0].id;

  assert.equal(pred.evaluate(closestId, sim, sim).status, 'correct');
  assert.equal(pred.evaluate(otherId, sim, sim).status, 'incorrect');
});

test('TC-IL-07: KMeans Prediction — WCSS Monotonicity evaluates Selim-Ismail property', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: 'p0', x: 1.0, y: 1.0 },
    { id: 'p1', x: 2.0, y: 2.0 },
    { id: 'p2', x: 8.0, y: 8.0 },
  ];
  let sim = engine.initialize({ k: 2, initMethod: 'random', seed: 42 }, dataset);
  sim = engine.step(sim); // assignment phase done, next is update

  const pred = getKMeansPredictionForStep(sim);
  assert.ok(pred !== null);
  assert.ok(pred.category === 'centroid_update' || pred.category === 'wcss_monotonicity');

  if (pred.category === 'centroid_update') {
    assert.equal(pred.evaluate('arithmetic_mean', sim, sim).status, 'correct');
    assert.equal(pred.evaluate('random_step', sim, sim).status, 'incorrect');
  }
});

// =============================================================================
// TEST SUITE 2: BREAK THE ALGORITHM — GRADIENT DESCENT CHALLENGES
// =============================================================================

test('TC-IL-08: GD-01 Challenge — Break the Learning Rate verifies limit cycle at alpha = 2.0', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-01');
  assert.ok(challenge);

  let sim = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 2.0,
    initialTheta: [0.5],
    maxIterations: 50,
  });

  // Step 6 times at alpha = 2.0
  for (let i = 0; i < 6; i++) {
    sim = stepGradientDescent(sim);
  }

  const outcome = challenge.verifyCondition(sim, getGradientDescentMetrics(sim), sim.pathHistory);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('conservative limit cycle'));
});

test('TC-IL-09: GD-01 Challenge — Break the Learning Rate verifies divergence at alpha = 2.2', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-01');
  assert.ok(challenge);

  let sim = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    optimizer: 'vanilla',
    learningRate: 2.2,
    initialTheta: [0.5],
    maxIterations: 50,
  });

  for (let i = 0; i < 10; i++) {
    sim = stepGradientDescent(sim);
  }

  const outcome = challenge.verifyCondition(sim, getGradientDescentMetrics(sim), sim.pathHistory);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('geometric divergence'));
});

test('TC-IL-10: GD-02 Challenge — Anisotropic Valley Trap verifies divergence along steep axis', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-02');
  assert.ok(challenge);

  let sim = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    optimizer: 'vanilla',
    learningRate: 0.21, // > alpha_crit = 0.20
    initialTheta: [2.0, 1.0],
    maxIterations: 40,
  });

  for (let i = 0; i < 12; i++) {
    sim = stepGradientDescent(sim);
  }

  const outcome = challenge.verifyCondition(sim, getGradientDescentMetrics(sim), sim.pathHistory);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('broke the anisotropic Hessian'));
});

test('TC-IL-11: GD-03 Challenge — Saddle Point stalls at origin then escapes on perturbation', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-03');
  assert.ok(challenge);

  // 1. Initialized at (0.5, 0) on ridge -> theta_1 contracts to 0 while theta_2 stays 0, stalls at (0, 0)
  let simStall = createGradientDescentSimulation({
    objectiveId: 'saddle2d',
    optimizer: 'vanilla',
    learningRate: 0.1,
    initialTheta: [0.5, 0.0],
    maxIterations: 50,
  });

  for (let i = 0; i < 20; i++) {
    simStall = stepGradientDescent(simStall);
  }

  const outcomeStall = challenge.verifyCondition(simStall, getGradientDescentMetrics(simStall), simStall.pathHistory);
  assert.equal(outcomeStall.passed, true);
  assert.ok(outcomeStall.message.includes('SADDLE STALL CONFIRMED'));

  // 2. Initialized with perturbation theta_2 = 0.05 -> escapes to ±infinity along negative curvature axis theta_2
  let simEscape = createGradientDescentSimulation({
    objectiveId: 'saddle2d',
    optimizer: 'vanilla',
    learningRate: 0.1,
    initialTheta: [0.5, 0.05],
    maxIterations: 50,
  });

  for (let i = 0; i < 35; i++) {
    simEscape = stepGradientDescent(simEscape);
  }

  const outcomeEscape = challenge.verifyCondition(simEscape, getGradientDescentMetrics(simEscape), simEscape.pathHistory);
  assert.equal(outcomeEscape.passed, true);
  assert.ok(outcomeEscape.message.includes('Negative curvature escape'));
});

test('TC-IL-12: GD-04 Challenge — Rosenbrock banana valley execution verification', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-04');
  assert.ok(challenge);

  let sim = createGradientDescentSimulation({
    objectiveId: 'rosenbrock2d',
    optimizer: 'vanilla',
    learningRate: 0.002,
    initialTheta: [-1.2, 1.0],
    maxIterations: 60,
  });

  for (let i = 0; i < 20; i++) {
    sim = stepGradientDescent(sim);
  }

  const outcome = challenge.verifyCondition(sim, getGradientDescentMetrics(sim), sim.pathHistory);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('Rosenbrock curvature geometry'));
});

test('TC-IL-13: GD-05 Challenge — Rastrigin multimodal local basin trapping verification', () => {
  const challenge = GD_CHALLENGES.find((c) => c.id === 'GD-05');
  assert.ok(challenge);

  let sim = createGradientDescentSimulation({
    objectiveId: 'rastrigin2d',
    optimizer: 'vanilla',
    learningRate: 0.02,
    initialTheta: [2.5, 2.5],
    maxIterations: 100,
  });

  while (!sim.isConverged && sim.stepNumber < 80) {
    sim = stepGradientDescent(sim);
  }

  const outcome = challenge.verifyCondition(sim, getGradientDescentMetrics(sim), sim.pathHistory);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('LOCAL MINIMUM TRAP CONFIRMED'));
});

// =============================================================================
// TEST SUITE 3: BREAK THE ALGORITHM — K-MEANS CHALLENGES
// =============================================================================

test('TC-IL-14: KM-01 Challenge — Wrong K verifies under-clustering and over-segmentation', () => {
  const challenge = KMEANS_CHALLENGES.find((c) => c.id === 'KM-01');
  assert.ok(challenge);

  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: '1', x: 1, y: 1 }, { id: '2', x: 1.5, y: 1.2 }, { id: '3', x: 1.2, y: 1.5 },
    { id: '4', x: 5, y: 5 }, { id: '5', x: 5.2, y: 5.1 }, { id: '6', x: 4.8, y: 5.3 },
    { id: '7', x: 9, y: 1 }, { id: '8', x: 9.2, y: 1.2 }, { id: '9', x: 8.8, y: 1.5 },
  ];

  // K = 2 (Under-clustering)
  let simK2 = engine.initialize({ k: 2, initMethod: 'random', seed: 42 }, dataset);
  while (!simK2.isConverged && simK2.iteration < 20) {
    simK2 = engine.step(simK2);
  }

  const outcomeK2 = challenge.verifyCondition(simK2, engine.getMetrics(simK2), []);
  assert.equal(outcomeK2.passed, true);
  assert.ok(outcomeK2.message.includes('UNDER-CLUSTERING OBSERVED'));
});

test('TC-IL-15: KM-02 Challenge — Bad Initialization vs KMeans++ sensitivity', () => {
  const challenge = KMEANS_CHALLENGES.find((c) => c.id === 'KM-02');
  assert.ok(challenge);

  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: '1', x: 1, y: 1 }, { id: '2', x: 2, y: 2 },
    { id: '3', x: 10, y: 10 }, { id: '4', x: 11, y: 11 },
  ];

  let sim = engine.initialize({ k: 2, initMethod: 'random', seed: 7 }, dataset);
  while (!sim.isConverged && sim.iteration < 20) {
    sim = engine.step(sim);
  }

  const outcome = challenge.verifyCondition(sim, engine.getMetrics(sim), []);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('initialization sensitivity'));
});

test('TC-IL-16: KM-03 Challenge — Empty Cluster resilience preserves finite coordinates', () => {
  const challenge = KMEANS_CHALLENGES.find((c) => c.id === 'KM-03');
  assert.ok(challenge);

  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: '1', x: 1, y: 1 },
    { id: '2', x: 1.1, y: 1.1 },
    { id: '3', x: 1.2, y: 1.2 },
  ];
  // 3 points, but K = 4 guarantees at least one empty cluster
  let sim = engine.initialize({ k: 4, initMethod: 'random', seed: 99 }, dataset);
  for (let i = 0; i < 4; i++) {
    sim = engine.step(sim);
  }

  const outcome = challenge.verifyCondition(sim, engine.getMetrics(sim), []);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('RESILIENCE CONFIRMED'));
  // Ensure no NaNs occurred
  assert.ok(sim.centroids.every((c) => Number.isFinite(c.x) && Number.isFinite(c.y)));
});

test('TC-IL-17: KM-04 Challenge — Feature Scale sensitivity verification', () => {
  const challenge = KMEANS_CHALLENGES.find((c) => c.id === 'KM-04');
  assert.ok(challenge);

  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: '1', x: 10, y: 0.1 },
    { id: '2', x: 20, y: 0.2 },
    { id: '3', x: 90, y: 0.9 },
  ];

  let sim = engine.initialize({ k: 2, initMethod: 'kmeans++', seed: 42 }, dataset);
  sim = engine.step(sim);
  sim = engine.step(sim);

  const outcome = challenge.verifyCondition(sim, engine.getMetrics(sim), []);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('SCALE SENSITIVITY VERIFIED'));
});

test('TC-IL-18: KM-05 Challenge — Symmetric Grid local equilibrium verification', () => {
  const challenge = KMEANS_CHALLENGES.find((c) => c.id === 'KM-05');
  assert.ok(challenge);

  const engine = new KMeansSimulationEngine();
  const dataset = [
    { id: '1', x: 1, y: 1 }, { id: '2', x: 1, y: 5 },
    { id: '3', x: 5, y: 1 }, { id: '4', x: 5, y: 5 },
  ];

  let sim = engine.initialize({ k: 4, initMethod: 'random', seed: 42 }, dataset);
  while (!sim.isConverged && sim.iteration < 20) {
    sim = engine.step(sim);
  }

  const outcome = challenge.verifyCondition(sim, engine.getMetrics(sim), []);
  assert.equal(outcome.passed, true);
  assert.ok(outcome.message.includes('LOCAL EQUILIBRIUM REACHED'));
});

// =============================================================================
// TEST SUITE 4: LOCAL LEARNING PROFILE & STATS COMPUTATION
// =============================================================================

test('TC-IL-19: Local Learning Analytics — Profile initialization and stats calculation', () => {
  const profile = getInitialProfile();
  assert.equal(profile.version, 1);
  assert.equal(profile.predictions.length, 0);
  assert.deepEqual(profile.challenges, {});

  // Add mock attempts
  profile.predictions.push({
    id: 'p1',
    questionId: 'gd-pred-1d-step',
    algorithmId: 'gradient-descent',
    category: 'parameter_update',
    userGuess: 1.70,
    status: 'correct',
    score: 1.0,
    timestamp: Date.now(),
  });
  profile.predictions.push({
    id: 'p2',
    questionId: 'gd-pred-stability-regime',
    algorithmId: 'gradient-descent',
    category: 'spectral_stability',
    userGuess: 'monotonic',
    status: 'partially_correct',
    score: 0.5,
    timestamp: Date.now(),
  });
  profile.predictions.push({
    id: 'p3',
    questionId: 'km-pred-assignment',
    algorithmId: 'kmeans',
    category: 'point_assignment',
    userGuess: 'wrong_c',
    status: 'incorrect',
    score: 0,
    timestamp: Date.now(),
  });

  profile.challenges['GD-01'] = {
    challengeId: 'GD-01',
    algorithmId: 'gradient-descent',
    completed: true,
    attemptsCount: 2,
    lastAttemptAt: Date.now(),
  };

  const stats = calculateProfileStats(profile);
  assert.equal(stats.totalPredictions, 3);
  assert.equal(stats.correctPredictions, 1);
  assert.equal(stats.partialPredictions, 1);
  // (1 + 0.5*1) / 3 = 1.5 / 3 = 50%
  assert.equal(stats.accuracyRate, 50);
  assert.equal(stats.totalChallengesAttempted, 1);
  assert.equal(stats.completedChallenges, 1);
});
