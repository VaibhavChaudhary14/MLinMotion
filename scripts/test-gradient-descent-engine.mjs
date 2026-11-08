import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGradientDescentSimulation,
  stepGradientDescent,
  stepBackGradientDescent,
  runGradientDescent,
  getGradientDescentExplanation,
  createOptimizerComparison,
  stepOptimizerComparison,
  stepBackOptimizerComparison,
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
  assert.ok(state.isMaxIterationsReached, 'Max iteration triggers termination flag');
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

// -----------------------------------------------------------------------------
// 6. PHASE 2 CHECKS: EXACT 2D EIGENMODE BOUNDARIES & EXCEPTIONAL CASES
// -----------------------------------------------------------------------------

test('TC-GD-16: Exact 2D stability boundary for anisotropic Hessian (alpha = 0.19, 0.20, 0.21)', () => {
  // Hessian H = diag(1, 10). lambdaMax = 10 -> alphaCrit = 0.20. Minimum at (3, 2).
  // Initial point offset on both coordinates: (0.0, 3.0) -> e1_0 = -3.0, e2_0 = 1.0

  // 1. Case alpha = 0.19 (subcritical: both modes converge)
  // r1 = 1 - 0.19 = 0.81 < 1; r2 = 1 - 1.9 = -0.90 (|r2| = 0.90 < 1)
  // With r2 = -0.90, reaching ||grad|| < 1e-4 takes exactly ceil(ln(1e-5)/ln(0.90)) = 110 steps
  let state19 = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.19,
    initialTheta: [0.0, 3.0],
    maxIterations: 120,
  });
  state19 = runGradientDescent(state19, 120);
  assert.ok(state19.isConverged, 'alpha = 0.19 must converge on both modes within 120 steps');
  assert.ok(Math.abs(state19.theta[0] - 3.0) < 1e-3, 'theta_1 must converge to 3.0');
  assert.ok(Math.abs(state19.theta[1] - 2.0) < 1e-3, 'theta_2 must converge to 2.0');

  // 2. Case alpha = 0.20 (critical boundary: r2 = -1.0 persistent limit cycle, r1 = 0.80 contracts)
  let state20 = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.20,
    initialTheta: [0.0, 3.0],
    maxIterations: 30,
  });
  for (let step = 0; step < 10; step++) {
    state20 = stepGradientDescent(state20);
    // theta_2 error must flip signs with constant magnitude 1.0: alternates between 1.0 and 3.0
    const expectedT2 = step % 2 === 0 ? 1.0 : 3.0;
    assert.ok(
      Math.abs(state20.theta[1] - expectedT2) < 1e-6,
      `Step ${step + 1}: theta_2 (${state20.theta[1]}) must alternate around minimum 2.0 with amplitude 1.0`
    );
    // theta_1 error must strictly contract by 0.80 each step
    const expectedT1 = 3.0 - 3.0 * Math.pow(0.8, step + 1);
    assert.ok(
      Math.abs(state20.theta[0] - expectedT1) < 1e-6,
      `Step ${step + 1}: theta_1 must contract monotonically`
    );
  }
  assert.ok(!state20.isDiverged, 'alpha = 0.20 must not be flagged as divergent');
  assert.ok(!state20.isConverged, 'alpha = 0.20 limit cycle must not be flagged as converged');

  // 3. Case alpha = 0.21 (supercritical: r2 = -1.10 explodes geometrically)
  let state21 = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.21,
    initialTheta: [0.0, 3.0],
    maxIterations: 35,
  });
  state21 = runGradientDescent(state21, 35);
  assert.ok(state21.isDiverged, 'alpha = 0.21 must diverge along the steep mode');
  assert.ok(!state21.isConverged, 'Must not report convergence on diverging run');
});

test('TC-GD-17: Stationary and exceptional cases (alpha = 0, starting at optimum)', () => {
  // A. Alpha = 0: parameters remain stationary, but must NOT be reported as converged!
  let stateZero = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 0.0,
    initialTheta: [0.5],
  });
  assert.equal(stateZero.regime, 'zero-step');
  assert.equal(stateZero.isConverged, false, 'alpha = 0 must NOT be flagged as converged');

  stateZero = stepGradientDescent(stateZero);
  assert.equal(stateZero.theta[0], 0.5, 'Coordinates must remain frozen at alpha = 0');
  assert.equal(stateZero.isConverged, false, 'Must not be converged after step with alpha = 0');
  assert.ok(stateZero.stopReason?.includes('Zero step size'));

  // B. Starting exactly at the optimum with alpha > alpha_crit (e.g. alpha = 5.0)
  // Gradient is zero, so no movement occurs; remains in equilibrium
  let stateOpt = createGradientDescentSimulation({
    objectiveId: 'quadratic1d',
    learningRate: 5.0, // well above critical alphaCrit = 2.0
    initialTheta: [3.5], // exactly at optimum
  });
  assert.equal(stateOpt.isStationary, true);
  assert.equal(stateOpt.isConverged, true);
  assert.equal(stateOpt.isDiverged, false);
  assert.equal(stateOpt.regime, 'stationary');

  stateOpt = stepGradientDescent(stateOpt);
  assert.equal(stateOpt.theta[0], 3.5, 'Must remain at optimum');
  assert.equal(stateOpt.isDiverged, false);
});

test('TC-GD-18: Explanation layer modal decomposition verification for anisotropic valley', () => {
  // Test at alpha = 0.15 on anisotropic valley
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.15,
    initialTheta: [0.0, 3.5],
  });
  state = stepGradientDescent(state);

  const expl = getGradientDescentExplanation(state);
  // Verify that the explanation describes both eigenmodes: steep canyon wall and shallow floor
  assert.ok(
    expl.description.includes('steep canyon wall') || expl.description.includes('λ₂ = 10'),
    'Explanation must detail steep eigenmode'
  );
  assert.ok(
    expl.description.includes('shallow floor') || expl.description.includes('λ₁ = 1'),
    'Explanation must detail shallow eigenmode'
  );
  assert.ok(
    expl.description.includes('zig-zag'),
    'Explanation must identify the characteristic zig-zag pattern'
  );
});

// -----------------------------------------------------------------------------
// 7. PHASE 2 OPTIMIZERS: MOMENTUM & ADAM STATE REVERSIBILITY
// -----------------------------------------------------------------------------

test('TC-GD-19: Polyak Momentum velocity accumulation and bidirectional state reversibility', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    optimizer: 'momentum',
    learningRate: 0.05,
    momentumGamma: 0.9,
    initialTheta: [0.0, 3.0],
  });

  // Step 0: velocity initialized to [0, 0]
  assert.deepEqual(state.optimizerState.velocity, [0, 0]);

  // Step 1: grad = [-3.0, 10.0]
  // v_1 = 0.9 * [0, 0] + 0.05 * [-3.0, 10.0] = [-0.15, 0.50]
  // theta_1 = [0.0 - (-0.15), 3.0 - 0.50] = [0.15, 2.50]
  state = stepGradientDescent(state);
  assert.ok(Math.abs(state.optimizerState.velocity[0] - (-0.15)) < 1e-6);
  assert.ok(Math.abs(state.optimizerState.velocity[1] - 0.50) < 1e-6);
  assert.ok(Math.abs(state.theta[0] - 0.15) < 1e-6);
  assert.ok(Math.abs(state.theta[1] - 2.50) < 1e-6);

  // Step 2, 3, 4: velocity accumulates
  for (let i = 0; i < 3; i++) {
    state = stepGradientDescent(state);
  }
  assert.equal(state.stepNumber, 4);
  const vAtStep4 = [...state.optimizerState.velocity];

  // Reversibility: step back 4 times
  for (let i = 0; i < 4; i++) {
    state = stepBackGradientDescent(state);
  }

  assert.equal(state.stepNumber, 0);
  assert.deepEqual(state.theta, [0.0, 3.0]);
  assert.deepEqual(state.optimizerState.velocity, [0, 0], 'Velocity must be restored to [0, 0] after stepBack');

  // Forward after backward reproduces identical state
  for (let i = 0; i < 4; i++) {
    state = stepGradientDescent(state);
  }
  assert.deepEqual(state.optimizerState.velocity, vAtStep4, 'Forward after backward reproduces exact velocity');
});

test('TC-GD-20: Adam moments, bias-correction and bidirectional state reversibility', () => {
  let state = createGradientDescentSimulation({
    objectiveId: 'quadratic2d-anisotropic',
    optimizer: 'adam',
    learningRate: 0.1,
    adamBeta1: 0.9,
    adamBeta2: 0.999,
    initialTheta: [0.0, 3.0],
  });

  // Step 0: moments are [0, 0], t = 0
  assert.deepEqual(state.optimizerState.m, [0, 0]);
  assert.deepEqual(state.optimizerState.v, [0, 0]);
  assert.equal(state.optimizerState.t, 0);

  // Step forward 5 times
  for (let i = 0; i < 5; i++) {
    state = stepGradientDescent(state);
    assert.equal(state.optimizerState.t, i + 1);
    assert.ok(state.optimizerState.m.some((val) => val !== 0));
    assert.ok(state.optimizerState.v.some((val) => val > 0));
  }
  assert.equal(state.stepNumber, 5);
  const snapAtStep5 = JSON.parse(JSON.stringify(state));

  // Step backward 5 times
  for (let i = 0; i < 5; i++) {
    state = stepBackGradientDescent(state);
  }

  assert.equal(state.stepNumber, 0);
  assert.deepEqual(state.theta, [0.0, 3.0]);
  assert.deepEqual(state.optimizerState.m, [0, 0], 'm must be restored to [0, 0]');
  assert.deepEqual(state.optimizerState.v, [0, 0], 'v must be restored to [0, 0]');
  assert.equal(state.optimizerState.t, 0, 't must be restored to 0');

  // Step forward 5 times again
  for (let i = 0; i < 5; i++) {
    state = stepGradientDescent(state);
  }
  assert.deepEqual(state.theta, snapAtStep5.theta);
  assert.deepEqual(state.optimizerState.m, snapAtStep5.optimizerState.m);
  assert.deepEqual(state.optimizerState.v, snapAtStep5.optimizerState.v);
  assert.equal(state.optimizerState.t, snapAtStep5.optimizerState.t);
});

test('TC-GD-21: Multi-Optimizer Comparison runner forward and backward synchronization', () => {
  let compState = createOptimizerComparison({
    objectiveId: 'quadratic2d-anisotropic',
    learningRate: 0.08,
    initialTheta: [0.0, 3.5],
  });

  // Initial verification
  assert.equal(compState.stepNumber, 0);
  assert.deepEqual(compState.vanilla.theta, [0.0, 3.5]);
  assert.deepEqual(compState.momentum.theta, [0.0, 3.5]);
  assert.deepEqual(compState.adam.theta, [0.0, 3.5]);

  // Step forward 3 times
  for (let i = 0; i < 3; i++) {
    compState = stepOptimizerComparison(compState);
  }
  assert.equal(compState.stepNumber, 3);
  assert.equal(compState.vanilla.stepNumber, 3);
  assert.equal(compState.momentum.stepNumber, 3);
  assert.equal(compState.adam.stepNumber, 3);

  // Step back 3 times
  for (let i = 0; i < 3; i++) {
    compState = stepBackOptimizerComparison(compState);
  }
  assert.equal(compState.stepNumber, 0);
  assert.deepEqual(compState.vanilla.theta, [0.0, 3.5]);
  assert.deepEqual(compState.momentum.theta, [0.0, 3.5]);
  assert.deepEqual(compState.adam.theta, [0.0, 3.5]);
});

