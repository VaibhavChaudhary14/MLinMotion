import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGradientDescentSimulation,
  stepGradientDescent,
  stepBackGradientDescent,
  runGradientDescent,
  GRADIENT_DESCENT_OBJECTIVES,
  finiteDifferenceGradient,
  vectorNorm,
} from '../src/lib/simulation/gradientDescentEngine.ts';

// -----------------------------------------------------------------------------
// 1. ANALYTICAL GRADIENT TESTS & FINITE-DIFFERENCE CHECKS
// -----------------------------------------------------------------------------

test('TC-GD-01: Correct analytical gradient for 1D objective and finite-difference validation', () => {
  const obj1d = GRADIENT_DESCENT_OBJECTIVES.quadratic1d;
  const testPoints = [[-2.0], [0.0], [3.5], [5.0], [10.0]];

  for (const pt of testPoints) {
    const analyticalGrad = obj1d.evaluateGradient(pt);
    // Analytical expectation: grad = theta - 3.5
    const expectedGrad = [pt[0] - 3.5];
    assert.deepEqual(analyticalGrad, expectedGrad);

    // Finite-difference verification
    const fdGrad = finiteDifferenceGradient(obj1d, pt, 1e-6);
    assert.ok(
      Math.abs(analyticalGrad[0] - fdGrad[0]) < 1e-5,
      `Finite difference gradient (${fdGrad[0]}) must match analytical (${analyticalGrad[0]})`
    );
  }
});

test('TC-GD-02: Correct analytical gradient for both 2D objectives (isotropic & anisotropic)', () => {
  const objIso = GRADIENT_DESCENT_OBJECTIVES['quadratic2d-isotropic'];
  const objAniso = GRADIENT_DESCENT_OBJECTIVES['quadratic2d-anisotropic'];
  const testPoints2D = [
    [0.0, 0.0],
    [3.0, 2.0], // optimum
    [5.0, -1.0],
    [-2.0, 4.0],
  ];

  for (const pt of testPoints2D) {
    // Isotropic: grad = [theta1 - 3, theta2 - 2]
    const gradIso = objIso.evaluateGradient(pt);
    assert.equal(gradIso[0], pt[0] - 3.0);
    assert.equal(gradIso[1], pt[1] - 2.0);

    const fdIso = finiteDifferenceGradient(objIso, pt, 1e-6);
    assert.ok(Math.abs(gradIso[0] - fdIso[0]) < 1e-5);
    assert.ok(Math.abs(gradIso[1] - fdIso[1]) < 1e-5);

    // Anisotropic: grad = [theta1 - 3, 10 * (theta2 - 2)]
    const gradAniso = objAniso.evaluateGradient(pt);
    assert.equal(gradAniso[0], pt[0] - 3.0);
    assert.equal(gradAniso[1], 10.0 * (pt[1] - 2.0));

    const fdAniso = finiteDifferenceGradient(objAniso, pt, 1e-6);
    assert.ok(Math.abs(gradAniso[0] - fdAniso[0]) < 1e-5);
    assert.ok(Math.abs(gradAniso[1] - fdAniso[1]) < 1e-5);
  }
});

// -----------------------------------------------------------------------------
// 2. THE FIVE 1D SCALAR REGIMES
// -----------------------------------------------------------------------------

test('TC-GD-03: Monotonic convergence for 0 < alpha < 1', () => {
  const alpha = 0.4;
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: alpha,
    initialTheta: [0.5],
  });

  assert.equal(state.regime, 'monotonic');

  for (let step = 0; step < 10; step++) {
    const prevTheta = state.theta[0];
    const prevLoss = state.loss;
    state = stepGradientDescent(state);

    // Error recurrence: e_{t+1} = (1 - alpha) * e_t
    const expectedTheta = 3.5 + (0.5 - 3.5) * Math.pow(1 - alpha, step + 1);
    assert.ok(
      Math.abs(state.theta[0] - expectedTheta) < 1e-6,
      `Step ${step + 1}: theta (${state.theta[0]}) must match analytical recurrence (${expectedTheta})`
    );

    // Strictly monotonic loss decrease and strictly no overshoot
    assert.ok(state.loss < prevLoss, 'Loss must strictly decrease');
    assert.ok(state.theta[0] > prevTheta, 'Parameter must move monotonically rightward toward 3.5');
    assert.ok(state.theta[0] < 3.5, 'Parameter must not overshoot the minimum 3.5');
  }
});

test('TC-GD-04: One-step deadbeat convergence for alpha = 1.0', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 1.0,
    initialTheta: [0.5],
  });

  assert.equal(state.regime, 'deadbeat');
  state = stepGradientDescent(state);

  // Exactly lands on 3.5 in one step: theta_1 = 0.5 - 1.0 * (0.5 - 3.5) = 3.5
  assert.equal(state.theta[0], 3.5);
  assert.equal(state.loss, 1.0);
  assert.equal(state.gradientNorm, 0.0);
  assert.ok(state.isConverged, 'Must declare convergence in step 1');
  assert.equal(state.stepNumber, 1);
});

test('TC-GD-05: Oscillating convergence for 1 < alpha < 2', () => {
  const alpha = 1.6;
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: alpha,
    initialTheta: [0.5],
  });

  assert.equal(state.regime, 'oscillating');

  for (let step = 0; step < 8; step++) {
    const prevDist = state.theta[0] - 3.5;
    state = stepGradientDescent(state);
    const currDist = state.theta[0] - 3.5;

    // Sign of error must alternate: sign(e_{t+1}) = -sign(e_t)
    assert.equal(
      Math.sign(currDist),
      -Math.sign(prevDist),
      `Step ${step + 1}: Error sign must oscillate`
    );

    // Magnitude must decay by |1 - alpha| = 0.6
    assert.ok(
      Math.abs(Math.abs(currDist) - Math.abs(prevDist) * 0.6) < 1e-6,
      `Step ${step + 1}: Error amplitude must decay by exactly 0.6`
    );
  }

  // Must converge after enough iterations
  state = runGradientDescent(state, 50);
  assert.ok(state.isConverged, 'Oscillating trajectory must eventually converge');
  assert.ok(Math.abs(state.theta[0] - 3.5) < 1e-4);
});

test('TC-GD-06: Persistent undamped oscillation for alpha = 2.0 (Conservative Limit Cycle)', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 2.0,
    initialTheta: [0.5],
  });

  assert.equal(state.regime, 'limit-cycle');

  // Step 1: theta_1 = 0.5 - 2.0 * (0.5 - 3.5) = 0.5 - 2 * (-3) = 6.5
  state = stepGradientDescent(state);
  assert.equal(state.theta[0], 6.5);
  assert.equal(state.loss, 5.5); // 0.5 * (6.5 - 3.5)^2 + 1 = 0.5 * 9 + 1 = 5.5
  assert.ok(state.isLimitCycle, 'Must be flagged as limit cycle');
  assert.ok(!state.isDiverged, 'Must NOT be flagged as divergent');
  assert.ok(!state.isConverged, 'Must NOT be falsely flagged as converged');

  // Step 2: theta_2 = 6.5 - 2.0 * (6.5 - 3.5) = 6.5 - 2 * (3) = 0.5
  state = stepGradientDescent(state);
  assert.equal(state.theta[0], 0.5);
  assert.equal(state.loss, 5.5);

  // Over 10 steps, strictly flips between 0.5 and 6.5 with constant loss = 5.5
  for (let i = 0; i < 10; i++) {
    state = stepGradientDescent(state);
    const expectedCoord = i % 2 === 0 ? 6.5 : 0.5;
    assert.equal(state.theta[0], expectedCoord);
    assert.equal(state.loss, 5.5);
    assert.ok(!state.isDiverged, 'Limit cycle is bounded; not divergent');
    assert.ok(!state.isConverged, 'Limit cycle never converges');
  }
});

test('TC-GD-07: Geometric divergence for alpha > 2 when initialized away from optimum', () => {
  const alpha = 2.2;
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: alpha,
    initialTheta: [0.5],
    maxIterations: 30,
  });

  assert.equal(state.regime, 'divergent');

  // Multiplier is 1 - 2.2 = -1.2. Magnitude grows geometrically as 1.2^t
  state = stepGradientDescent(state);
  // theta_1 = 0.5 - 2.2 * (-3.0) = 0.5 + 6.6 = 7.1. Dist = 7.1 - 3.5 = 3.6 (which is 3.0 * 1.2)
  assert.ok(Math.abs(state.theta[0] - 7.1) < 1e-12);

  state = runGradientDescent(state, 30);
  assert.ok(state.isDiverged, 'Engine must flag divergence when alpha > 2');
  assert.ok(!state.isConverged, 'Must not report convergence');
});

// -----------------------------------------------------------------------------
// 3. 2D QUADRATIC STABILITY & ANISOTROPY TESTS
// -----------------------------------------------------------------------------

test('TC-GD-08: Correct spectral stability boundaries for 2D objectives', () => {
  const objIso = GRADIENT_DESCENT_OBJECTIVES['quadratic2d-isotropic'];
  const objAniso = GRADIENT_DESCENT_OBJECTIVES['quadratic2d-anisotropic'];

  // Isotropic: lambdaMax = 1 -> alphaCrit = 2.0
  assert.equal(objIso.criticalLearningRate, 2.0);

  // Anisotropic: lambdaMax = 10 -> alphaCrit = 0.20
  assert.equal(objAniso.criticalLearningRate, 0.2);

  // Test that alpha = 0.25 is stable on isotropic, but explodes on anisotropic!
  let stateIso = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-isotropic',
    learningRate: 0.25,
    initialTheta: [0.0, 5.0],
  });
  stateIso = runGradientDescent(stateIso, 20);
  assert.ok(!stateIso.isDiverged, 'alpha = 0.25 must be stable on isotropic (alphaCrit = 2.0)');
  assert.ok(stateIso.loss < 5.0, 'Loss must decrease on isotropic');

  let stateAniso = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.25, // > 0.20!
    initialTheta: [3.0, 3.5], // offset only in steep direction
    maxIterations: 20,
  });
  stateAniso = runGradientDescent(stateAniso, 20);
  assert.ok(stateAniso.isDiverged, 'alpha = 0.25 must diverge on anisotropic (alphaCrit = 0.20)');
});

test('TC-GD-09: Anisotropic objective behaves differently from isotropic (high condition number κ = 10)', () => {
  // Set alpha = 0.15 (subcritical for anisotropic: alphaCrit = 0.20, but oscillates across steep axis)
  const alpha = 0.15;
  let stateAniso = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: alpha,
    initialTheta: [0.0, 3.0],
  });

  // Step 1:
  // grad = [0 - 3, 10 * (3 - 2)] = [-3, 10]
  // displacement = [-0.15 * -3, -0.15 * 10] = [0.45, -1.5]
  // theta_1 = [0.45, 1.5] (overshot theta2* = 2.0 to 1.5!)
  stateAniso = stepGradientDescent(stateAniso);
  assert.ok(stateAniso.theta[1] < 2.0, 'Theta 2 must overshoot minimum across the valley floor');

  // Step 2:
  // theta_2 was 1.5 (dist = -0.5). Next dist is (1 - 0.15 * 10) * (-0.5) = -0.5 * (-0.5) = +0.25
  stateAniso = stepGradientDescent(stateAniso);
  assert.ok(stateAniso.theta[1] > 2.0, 'Theta 2 must overshoot back across the valley floor');
});

// -----------------------------------------------------------------------------
// 4. REVERSIBILITY CONTRACT & STATE INVARIANTS
// -----------------------------------------------------------------------------

test('TC-GD-10: Exact forward/backward state restoration (stepBack)', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.05,
    initialTheta: [1.0, 4.0],
  });

  const snapshot0 = JSON.parse(JSON.stringify(state));

  // Step forward 4 times
  for (let i = 0; i < 4; i++) {
    state = stepGradientDescent(state);
  }
  assert.equal(state.stepNumber, 4);
  assert.equal(state.iteration, 4);

  // Step backward 4 times
  for (let i = 0; i < 4; i++) {
    state = stepBackGradientDescent(state);
  }

  assert.equal(state.stepNumber, 0);
  assert.equal(state.iteration, 0);
  assert.deepEqual(state.theta, snapshot0.theta);
  assert.equal(state.loss, snapshot0.loss);
  assert.deepEqual(state.gradient, snapshot0.gradient);
  assert.equal(state.gradientNorm, snapshot0.gradientNorm);
  assert.equal(state.isConverged, snapshot0.isConverged);
  assert.equal(state.historyStack.length, 1);
});

test('TC-GD-11: Forward-after-backward reproduces the exact same state', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 0.3,
    initialTheta: [1.0],
  });

  // Step forward to step 1
  state = stepGradientDescent(state);
  const step1Snapshot = JSON.parse(JSON.stringify(state));

  // Step backward to step 0
  state = stepBackGradientDescent(state);
  assert.equal(state.stepNumber, 0);

  // Step forward again to step 1
  state = stepGradientDescent(state);

  assert.equal(state.stepNumber, step1Snapshot.stepNumber);
  assert.deepEqual(state.theta, step1Snapshot.theta);
  assert.equal(state.loss, step1Snapshot.loss);
  assert.deepEqual(state.gradient, step1Snapshot.gradient);
  assert.equal(state.gradientNorm, step1Snapshot.gradientNorm);
  assert.equal(state.historyStack.length, step1Snapshot.historyStack.length);
});

test('TC-GD-12: Correct objective value and gradient after every update', () => {
  const obj = GRADIENT_DESCENT_OBJECTIVES.quadratic1d;
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 0.5,
    initialTheta: [-1.0],
  });

  for (let step = 0; step < 5; step++) {
    state = stepGradientDescent(state);
    const expectedLoss = obj.evaluateLoss(state.theta);
    const expectedGrad = obj.evaluateGradient(state.theta);

    assert.equal(state.loss, expectedLoss, `Step ${step + 1}: Loss mismatch`);
    assert.deepEqual(state.gradient, expectedGrad, `Step ${step + 1}: Gradient mismatch`);
    assert.equal(state.gradientNorm, vectorNorm(expectedGrad));
  }
});

// -----------------------------------------------------------------------------
// 5. SAFETY GUARDS & TERMINATION TESTS
// -----------------------------------------------------------------------------

test('TC-GD-13: Non-finite values and extreme coordinates are handled safely without crash', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 50.0, // massively divergent
    initialTheta: [100.0],
  });

  // Run steps — must cleanly trigger divergence instead of throwing or NaN-locking
  state = runGradientDescent(state, 5);
  assert.ok(state.isDiverged);
  assert.ok(state.stopReason?.includes('divergence'));
});

test('TC-GD-14: Maximum iteration safeguard works cleanly', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 0.001, // extremely slow learning rate
    initialTheta: [0.0],
    maxIterations: 15,
  });

  state = runGradientDescent(state, 50);
  assert.equal(state.iteration, 15);
  assert.ok(state.isConverged, 'Max iteration triggers termination');
  assert.ok(state.stopReason?.includes('Maximum iteration'));
});

test('TC-GD-15: No false convergence at the alpha = 2 limit cycle', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 2.0,
    initialTheta: [0.0],
    maxIterations: 40,
  });

  for (let step = 0; step < 20; step++) {
    state = stepGradientDescent(state);
    assert.ok(
      !state.isConverged,
      `Step ${step + 1}: Persistent oscillation must NEVER be declared converged`
    );
    assert.ok(state.isLimitCycle, `Step ${step + 1}: Must retain limit-cycle flag`);
  }
});
