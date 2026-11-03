import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Test Euclidean Distance Squared
function euclideanDistSq(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

test('Euclidean Distance Squared Calculation', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 3, y: 4 };
  assert.equal(euclideanDistSq(p1, p2), 25);
});

// 2. Test Ordinary Least Squares
test('OLS Closed-Form Regression', () => {
  // y = 2x + 1
  const points = [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
  ];

  const n = points.length;
  const meanX = points.reduce((acc, p) => acc + p.x, 0) / n;
  const meanY = points.reduce((acc, p) => acc + p.y, 0) / n;

  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - meanX) * (p.y - meanY);
    den += (p.x - meanX) ** 2;
  }
  const slope = num / den;
  const intercept = meanY - slope * meanX;

  assert.equal(Math.round(slope), 2);
  assert.equal(Math.round(intercept), 1);
});

// 3. Test Sigmoid Function
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

test('Sigmoid Activation Bounds & Symmetry', () => {
  assert.equal(sigmoid(0), 0.5);
  assert.ok(sigmoid(10) > 0.999);
  assert.ok(sigmoid(-10) < 0.001);
});

// 4. Test 2x2 Covariance and Eigenvalue
test('2x2 Covariance Matrix Eigenvalues', () => {
  // Perfectly correlated line y = x -> Var(X)=1, Var(Y)=1, Cov(X,Y)=1
  // Eigenvalues should be 2 and 0
  const varX = 1;
  const varY = 1;
  const covXY = 1;

  const tr = varX + varY;
  const det = varX * varY - covXY * covXY;
  const disc = Math.sqrt(tr * tr - 4 * det);

  const l1 = (tr + disc) / 2;
  const l2 = (tr - disc) / 2;

  assert.equal(l1, 2);
  assert.equal(l2, 0);
});

console.log('Math verification tests loaded successfully.');
