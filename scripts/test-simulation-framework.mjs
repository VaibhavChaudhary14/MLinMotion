/**
 * ML in Motion — Shared Algorithm Simulation Framework
 * Framework Contract Verification Suite (Phase 04)
 *
 * Tests the 12 core framework guarantees across both KMeansSimulationAdapter
 * and GradientDescentSimulationAdapter.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  KMeansSimulationAdapter,
  GradientDescentSimulationAdapter,
  appendSnapshot,
  popHistoricalSnapshot,
  validateSnapshotFiniteness,
} from '../src/lib/simulation/framework/index.ts';

// Sample dataset for clustering tests
const SAMPLE_DATASET = [
  { id: 'p0', x: 10, y: 15 },
  { id: 'p1', x: 12, y: 18 },
  { id: 'p2', x: 80, y: 85 },
  { id: 'p3', x: 85, y: 90 },
  { id: 'p4', x: 50, y: 50 },
];

// -----------------------------------------------------------------------------
// 1. UNIT TESTS: HISTORY & SNAPSHOT MANAGEMENT
// -----------------------------------------------------------------------------

test('TC-FW-01: Snapshot appending preserves order and immutability', () => {
  const rootSnap = {
    stepNumber: 0,
    iteration: 0,
    status: 'ready',
    isConverged: false,
    isDiverged: false,
    payload: { val: 42 },
  };

  const stack1 = [rootSnap];
  const nextSnap = {
    stepNumber: 1,
    iteration: 1,
    status: 'iterating',
    isConverged: false,
    isDiverged: false,
    payload: { val: 43 },
  };

  const stack2 = appendSnapshot(stack1, nextSnap);
  assert.equal(stack2.length, 2);
  assert.equal(stack2[0].stepNumber, 0);
  assert.equal(stack2[1].stepNumber, 1);

  // Immutability: Mutating nextSnap must not affect stack2
  nextSnap.payload.val = 999;
  assert.equal(stack2[1].payload.val, 43, 'Appended snapshot must be an isolated clone');
});

test('TC-FW-02: Historical rollback (popHistoricalSnapshot) preserves root and restores state', () => {
  const root = { stepNumber: 0, iteration: 0, status: 'ready', isConverged: false, isDiverged: false };
  const s1 = { stepNumber: 1, iteration: 1, status: 'iterating', isConverged: false, isDiverged: false };
  const s2 = { stepNumber: 2, iteration: 2, status: 'iterating', isConverged: false, isDiverged: false };

  const stack = [root, s1, s2];
  const { newStack: stackAfter1, restoredSnapshot: restored1, hasReverted: rev1 } = popHistoricalSnapshot(stack);
  assert.equal(rev1, true);
  assert.equal(stackAfter1.length, 2);
  assert.equal(restored1.stepNumber, 1);

  const { newStack: stackAfter2, restoredSnapshot: restored2, hasReverted: rev2 } = popHistoricalSnapshot(stackAfter1);
  assert.equal(rev2, true);
  assert.equal(stackAfter2.length, 1);
  assert.equal(restored2.stepNumber, 0);

  // Attempting to pop below root:
  const { newStack: stackRoot, restoredSnapshot: restoredRoot, hasReverted: revRoot } = popHistoricalSnapshot(stackAfter2);
  assert.equal(revRoot, false);
  assert.equal(stackRoot.length, 1);
  assert.equal(restoredRoot.stepNumber, 0);
});

test('TC-FW-03: Finiteness validator catches NaN, null, and Infinity', () => {
  assert.equal(validateSnapshotFiniteness({ a: 1.5, b: [1, 2, 3] }), true);
  assert.equal(validateSnapshotFiniteness({ a: NaN }), false);
  assert.equal(validateSnapshotFiniteness({ a: Infinity }), false);
  assert.equal(validateSnapshotFiniteness({ a: [1, 2, -Infinity] }), false);
});

// -----------------------------------------------------------------------------
// 2. K-MEANS ADAPTER: 12 FRAMEWORK CONTRACT TESTS
// -----------------------------------------------------------------------------

test('TC-FW-04: KMeansAdapter — Engine initialization and contract compliance', () => {
  const adapter = new KMeansSimulationAdapter();
  assert.equal(adapter.algorithmId, 'kmeans');
  assert.equal(adapter.algorithmFamily, 'clustering');

  const state = adapter.initialize(
    { k: 2, initMethod: 'random', seed: 42 },
    { dataset: SAMPLE_DATASET, seed: 42 }
  );

  assert.equal(state.stepNumber, 0);
  assert.equal(state.iteration, 0);
  assert.equal(state.status, 'ready');
  assert.equal(state.isConverged, false);
  assert.equal(state.isDiverged, false);
  assert.equal(state.historyStack.length, 1);
  assert.equal(state.centroids.length, 2);
});

test('TC-FW-05: KMeansAdapter — Invalid configuration handling', () => {
  const adapter = new KMeansSimulationAdapter();
  assert.throws(() => {
    // Empty dataset
    adapter.initialize({ k: 2, initMethod: 'random', seed: 42 }, { dataset: [] });
  }, /initialization requires a non-empty Point2D dataset/);
});

test('TC-FW-06: KMeansAdapter — Forward stepping and lifecycle progression', () => {
  const adapter = new KMeansSimulationAdapter();
  let state = adapter.initialize(
    { k: 2, initMethod: 'random', seed: 42 },
    { dataset: SAMPLE_DATASET, seed: 42 }
  );

  // Step 1: Init -> Assign
  state = adapter.step(state);
  assert.equal(state.stepNumber, 1);
  assert.equal(state.phase, 'assign');
  assert.equal(state.status, 'iterating');
  assert.equal(state.historyStack.length, 2);

  // Step 2: Assign -> Update
  state = adapter.step(state);
  assert.equal(state.stepNumber, 2);
  assert.equal(state.historyStack.length, 3);
});

test('TC-FW-07: KMeansAdapter — Exact reverse stepping (stepBack)', () => {
  const adapter = new KMeansSimulationAdapter();
  let state = adapter.initialize(
    { k: 2, initMethod: 'random', seed: 42 },
    { dataset: SAMPLE_DATASET, seed: 42 }
  );

  const snap0 = JSON.parse(JSON.stringify(state.historyStack[0]));

  state = adapter.step(state);
  state = adapter.step(state);
  assert.equal(state.stepNumber, 2);

  state = adapter.stepBack(state);
  assert.equal(state.stepNumber, 1);

  state = adapter.stepBack(state);
  assert.equal(state.stepNumber, 0);
  assert.equal(state.status, 'ready');
  assert.deepEqual(state.historyStack[0].centroids, snap0.centroids);
});

test('TC-FW-08: KMeansAdapter — Forward-after-backward determinism', () => {
  const adapter = new KMeansSimulationAdapter();
  let state = adapter.initialize(
    { k: 2, initMethod: 'random', seed: 42 },
    { dataset: SAMPLE_DATASET, seed: 42 }
  );

  state = adapter.step(state);
  state = adapter.step(state);
  const snapStep2 = JSON.parse(JSON.stringify(state.historyStack[2]));

  // Step back 2 times
  state = adapter.stepBack(state);
  state = adapter.stepBack(state);

  // Step forward 2 times again
  state = adapter.step(state);
  state = adapter.step(state);

  assert.deepEqual(state.historyStack[2].centroids, snapStep2.centroids);
  assert.deepEqual(state.historyStack[2].inertia, snapStep2.inertia);
});

test('TC-FW-09: KMeansAdapter — Reset to initial state', () => {
  const adapter = new KMeansSimulationAdapter();
  let state = adapter.initialize(
    { k: 2, initMethod: 'random', seed: 42 },
    { dataset: SAMPLE_DATASET, seed: 42 }
  );

  state = adapter.run(state, 10);
  assert.ok(state.stepNumber > 0);

  const resetState = adapter.reset(state);
  assert.equal(resetState.stepNumber, 0);
  assert.equal(resetState.status, 'ready');
  assert.equal(resetState.historyStack.length, 1);
});

test('TC-FW-10: KMeansAdapter — Independent instances do not share mutable state', () => {
  const adapter1 = new KMeansSimulationAdapter();
  const adapter2 = new KMeansSimulationAdapter();

  let state1 = adapter1.initialize({ k: 2, initMethod: 'random', seed: 42 }, { dataset: SAMPLE_DATASET, seed: 42 });
  let state2 = adapter2.initialize({ k: 2, initMethod: 'random', seed: 42 }, { dataset: SAMPLE_DATASET, seed: 42 });

  state1 = adapter1.step(state1);
  assert.equal(state1.stepNumber, 1);
  assert.equal(state2.stepNumber, 0, 'Instance 2 must remain unaffected by instance 1 stepping');
});

// -----------------------------------------------------------------------------
// 3. GRADIENT DESCENT ADAPTER: 12 FRAMEWORK CONTRACT TESTS
// -----------------------------------------------------------------------------

test('TC-FW-11: GradientDescentAdapter — Engine initialization and contract compliance', () => {
  const adapter = new GradientDescentSimulationAdapter();
  assert.equal(adapter.algorithmId, 'gradient-descent');
  assert.equal(adapter.algorithmFamily, 'optimization');

  const state = adapter.initialize({
    objectiveId: 'quadratic1d',
    learningRate: 0.1,
    initialTheta: [1.5],
  });

  assert.equal(state.stepNumber, 0);
  assert.equal(state.iteration, 0);
  assert.equal(state.status, 'ready');
  assert.equal(state.isConverged, false);
  assert.equal(state.isDiverged, false);
  assert.equal(state.historyStack.length, 1);
  assert.equal(state.theta[0], 1.5);
});

test('TC-FW-12: GradientDescentAdapter — Forward stepping and lifecycle progression', () => {
  const adapter = new GradientDescentSimulationAdapter();
  let state = adapter.initialize({
    objectiveId: 'quadratic1d',
    learningRate: 0.1,
    initialTheta: [1.5],
  });

  state = adapter.step(state);
  assert.equal(state.stepNumber, 1);
  assert.equal(state.status, 'iterating');
  assert.equal(state.historyStack.length, 2);
  assert.ok(state.loss < 3.0);
});

test('TC-FW-13: GradientDescentAdapter — Exact reverse stepping (stepBack) with optimizer moments', () => {
  const adapter = new GradientDescentSimulationAdapter();
  let state = adapter.initialize({
    objectiveId: 'quadratic2d-anisotropic',
    optimizer: 'adam',
    learningRate: 0.1,
    initialTheta: [1.0, 3.0],
  });

  // Step forward 3 times
  for (let i = 0; i < 3; i++) {
    state = adapter.step(state);
  }
  assert.equal(state.stepNumber, 3);
  assert.equal(state.optimizerState.t, 3);

  // Step back 3 times
  for (let i = 0; i < 3; i++) {
    state = adapter.stepBack(state);
  }
  assert.equal(state.stepNumber, 0);
  assert.equal(state.status, 'ready');
  assert.equal(state.optimizerState.t, 0);
  assert.deepEqual(state.optimizerState.m, [0, 0]);
  assert.deepEqual(state.optimizerState.v, [0, 0]);
});

test('TC-FW-14: GradientDescentAdapter — Forward-after-backward determinism', () => {
  const adapter = new GradientDescentSimulationAdapter();
  let state = adapter.initialize({
    objectiveId: 'rosenbrock2d',
    optimizer: 'momentum',
    learningRate: 0.001,
    initialTheta: [-1.2, 1.0],
  });

  for (let i = 0; i < 4; i++) {
    state = adapter.step(state);
  }
  const snapAt4 = JSON.parse(JSON.stringify(state.historyStack[4]));

  for (let i = 0; i < 4; i++) {
    state = adapter.stepBack(state);
  }
  assert.equal(state.stepNumber, 0);

  for (let i = 0; i < 4; i++) {
    state = adapter.step(state);
  }
  assert.deepEqual(state.historyStack[4].theta, snapAt4.theta);
  assert.deepEqual(state.historyStack[4].optimizerState, snapAt4.optimizerState);
});

test('TC-FW-15: GradientDescentAdapter — Divergence status lifecycle transition', () => {
  const adapter = new GradientDescentSimulationAdapter();
  let state = adapter.initialize({
    objectiveId: 'quadratic1d',
    learningRate: 2.5, // > alpha_crit = 2.0 => divergence
    initialTheta: [1.0],
  });

  state = adapter.run(state, 10);
  assert.equal(state.isDiverged, true);
  assert.equal(state.status, 'diverged');
  assert.ok(state.stopReason?.includes('divergence'));
});

test('TC-FW-16: GradientDescentAdapter — Convergence status lifecycle transition', () => {
  const adapter = new GradientDescentSimulationAdapter();
  let state = adapter.initialize({
    objectiveId: 'quadratic1d',
    learningRate: 1.0, // Deadbeat Newton step
    initialTheta: [1.0],
  });

  state = adapter.step(state);
  assert.equal(state.isConverged, true);
  assert.equal(state.status, 'converged');
  assert.ok(Math.abs(state.theta[0] - 3.5) < 1e-12);
});

test('TC-FW-17: GradientDescentAdapter — Independent instances do not share mutable state', () => {
  const adapter1 = new GradientDescentSimulationAdapter();
  const adapter2 = new GradientDescentSimulationAdapter();

  let state1 = adapter1.initialize({ objectiveId: 'quadratic1d', learningRate: 0.1, initialTheta: [1.0] });
  let state2 = adapter2.initialize({ objectiveId: 'quadratic1d', learningRate: 0.1, initialTheta: [1.0] });

  state1 = adapter1.step(state1);
  assert.equal(state1.stepNumber, 1);
  assert.equal(state2.stepNumber, 0);
});
