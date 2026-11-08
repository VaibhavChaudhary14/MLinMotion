import test from 'node:test';
import assert from 'node:assert/strict';
import { KMeansSimulationEngine } from '../src/lib/simulation/kmeansEngine.ts';
import { KMEANS_FAILURE_SCENARIOS } from '../src/lib/datasets/failureScenarios.ts';

test('KMeans Engine: Seeded Reproducibility Test', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.separated.generate().points;

  const state1 = engine.initialize({ k: 3, initMethod: 'kmeans++', seed: 42 }, dataset, 42);
  const state2 = engine.initialize({ k: 3, initMethod: 'kmeans++', seed: 42 }, dataset, 42);

  assert.equal(state1.centroids.length, 3);
  assert.equal(state2.centroids.length, 3);

  // Exact coordinates match down to floating precision
  for (let i = 0; i < 3; i++) {
    assert.equal(state1.centroids[i].x, state2.centroids[i].x, `Centroid ${i} x coordinate must match`);
    assert.equal(state1.centroids[i].y, state2.centroids[i].y, `Centroid ${i} y coordinate must match`);
  }
});

test('KMeans Engine: Reversible Bidirectional Stepping (Step and StepBack)', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.separated.generate().points;

  const initial = engine.initialize({ k: 3, initMethod: 'kmeans++', seed: 42 }, dataset, 42);
  const initialCentroids = JSON.parse(JSON.stringify(initial.centroids));

  // Step forward 4 times
  let state = initial;
  for (let i = 0; i < 4; i++) {
    state = engine.step(state);
  }

  assert.equal(state.stepNumber, 4);
  assert.notDeepEqual(state.centroids, initialCentroids);

  // Step back 4 times
  for (let i = 0; i < 4; i++) {
    state = engine.stepBack(state);
  }

  assert.equal(state.stepNumber, 0);
  assert.equal(state.phase, 'init');
  assert.deepEqual(state.centroids, initialCentroids, 'State after stepping back must match initial state exactly');
});

test('KMeans Engine: Center of Mass Arithmetic Mean Invariant', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.separated.generate().points;

  let state = engine.initialize({ k: 3, initMethod: 'kmeans++', seed: 42 }, dataset, 42);

  // Step 1: Assign
  state = engine.step(state);
  assert.equal(state.phase, 'assign');

  // Step 2: Update Centroids
  state = engine.step(state);
  assert.equal(state.phase, 'update');

  // Verify that updated centroids equal the arithmetic mean of assigned points
  for (let cIdx = 0; cIdx < state.centroids.length; cIdx++) {
    const assigned = state.points.filter((p) => p.cluster === cIdx);
    if (assigned.length > 0) {
      const expectedMeanX = Number((assigned.reduce((acc, p) => acc + p.x, 0) / assigned.length).toFixed(2));
      const expectedMeanY = Number((assigned.reduce((acc, p) => acc + p.y, 0) / assigned.length).toFixed(2));

      assert.equal(state.centroids[cIdx].x, expectedMeanX, `Centroid ${cIdx} X must be exact arithmetic mean`);
      assert.equal(state.centroids[cIdx].y, expectedMeanY, `Centroid ${cIdx} Y must be exact arithmetic mean`);
    }
  }
});

test('KMeans Engine: Monotonic WCSS (Inertia) Non-Increasing Invariant', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.separated.generate().points;

  let state = engine.initialize({ k: 3, initMethod: 'kmeans++', seed: 42 }, dataset, 42);

  // Run full convergence
  state = engine.run(state, 40);

  assert.ok(state.isConverged, 'Algorithm must converge on well-separated blobs');
  assert.ok(state.inertiaHistory.length >= 2, 'Should have multiple inertia measurements');

  // Each reassignment step must non-increase WCSS
  for (let i = 1; i < state.inertiaHistory.length; i++) {
    assert.ok(
      state.inertiaHistory[i] <= state.inertiaHistory[i - 1] + 1e-4,
      `WCSS must not increase between iterations: ${state.inertiaHistory[i]} vs ${state.inertiaHistory[i - 1]}`
    );
  }
});

test('KMeans Engine: Empty Cluster Resilience', () => {
  const engine = new KMeansSimulationEngine();
  // Provide 4 points in a tight corner, with manual centroids placed far away
  const dataset = [
    { id: 'p1', x: 10, y: 10 },
    { id: 'p2', x: 12, y: 11 },
    { id: 'p3', x: 11, y: 12 },
    { id: 'p4', x: 10, y: 11 },
  ];

  // K=3, but centroids 1 and 2 are at (500, 500) and (450, 450) where no points exist
  const manualCentroids = [
    { x: 11, y: 11 },
    { x: 500, y: 500 },
    { x: 450, y: 450 },
  ];

  let state = engine.initialize(
    { k: 3, initMethod: 'manual', manualCentroids, seed: 1 },
    dataset,
    1
  );

  // Step into assign
  state = engine.step(state);
  // Step into update
  state = engine.step(state);

  // Check empty clusters detected
  assert.ok(state.emptyClusterIndices.includes(1) || state.emptyClusterIndices.includes(2));
  // Coordinates must remain finite numbers, not NaN
  for (const c of state.centroids) {
    assert.ok(Number.isFinite(c.x), 'Centroid coordinate must remain finite');
    assert.ok(Number.isFinite(c.y), 'Centroid coordinate must remain finite');
  }
});

test('KMeans Engine: Full Multi-Representation Explanation Check', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.concentric.generate().points;

  let state = engine.initialize({ k: 2, initMethod: 'kmeans++', seed: 77 }, dataset, 77);

  const expInit = engine.getExplanation(state);
  assert.ok(expInit.equationLatex.includes('\\boldsymbol{\\mu}'));
  assert.ok(expInit.predictionPrompt !== undefined);

  state = engine.step(state);
  const expAssign = engine.getExplanation(state);
  assert.ok(expAssign.equationLatex.includes('\\arg\\min'));
  assert.equal(expAssign.pseudocodeLine, 3);

  state = engine.step(state);
  const expUpdate = engine.getExplanation(state);
  assert.ok(expUpdate.equationLatex.includes('\\frac{1}{|S_k|}'));
  assert.equal(expUpdate.pseudocodeLine, 4);
});

test('KMeans Engine: Two-Stage WCSS Inequality Separation (Selim-Ismail Theorem)', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.separated.generate().points;
  let state = engine.initialize({ k: 3, initMethod: 'random', seed: 13 }, dataset, 13);

  // Helper to calculate exact WCSS given points and centroids
  const calcWCSS = (pts, cents) => {
    let sum = 0;
    for (const p of pts) {
      if (p.cluster !== undefined && cents[p.cluster]) {
        const c = cents[p.cluster];
        sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      }
    }
    return sum;
  };

  // Step 1: Assignment Phase
  const prevCentroids = JSON.parse(JSON.stringify(state.centroids));
  state = engine.step(state);
  assert.equal(state.phase, 'assign');
  const wcssAfterAssign = calcWCSS(state.points, prevCentroids);

  // Step 2: Update Phase
  state = engine.step(state);
  assert.equal(state.phase, 'update');
  const wcssAfterUpdate = calcWCSS(state.points, state.centroids);

  // Mathematical Invariant: J(c^(t+1), mu^(t+1)) <= J(c^(t+1), mu^(t))
  assert.ok(
    wcssAfterUpdate <= wcssAfterAssign + 1e-4,
    `Stage 2 inequality failed: WCSS after update (${wcssAfterUpdate}) must be <= WCSS after assign (${wcssAfterAssign})`
  );
});

test('KMeans Engine: Deep Reversibility State Audit (All Fields Restored)', () => {
  const engine = new KMeansSimulationEngine();
  const dataset = KMEANS_FAILURE_SCENARIOS.outliers.generate().points;
  const initial = engine.initialize({ k: 2, initMethod: 'kmeans++', seed: 101 }, dataset, 101);

  // Snapshot initial deep state
  const initialDeep = JSON.parse(JSON.stringify(initial));

  // Step forward twice
  let state = engine.step(initial);
  state = engine.step(state);

  // Step backward twice
  state = engine.stepBack(state);
  state = engine.stepBack(state);

  // Assert every single field is strictly restored
  assert.equal(state.stepNumber, initial.stepNumber);
  assert.equal(state.iteration, initial.iteration);
  assert.equal(state.phase, initial.phase);
  assert.equal(state.inertia, initial.inertia);
  assert.equal(state.maxCentroidShift, initial.maxCentroidShift);
  assert.equal(state.reassignments, initial.reassignments);
  assert.equal(state.isConverged, initial.isConverged);
  assert.deepEqual(state.emptyClusterIndices, initial.emptyClusterIndices);
  assert.deepEqual(state.centroids, initial.centroids);
  assert.equal(state.points.length, initial.points.length);
  for (let i = 0; i < state.points.length; i++) {
    assert.equal(state.points[i].cluster, initial.points[i].cluster);
    assert.equal(state.points[i].x, initial.points[i].x);
    assert.equal(state.points[i].y, initial.points[i].y);
    assert.deepEqual(state.points[i].distsToAllCentroids, initial.points[i].distsToAllCentroids);
  }
  assert.equal(state.historyStack.length, 1);
});

