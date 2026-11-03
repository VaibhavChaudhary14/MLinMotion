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

// 5. Test RFC 4180 CSV Parser (Quotes, Commas in Strings, Escapes)
function parseCSV(text) {
  const records = [];
  let currentRecord = [];
  let currentField = '';
  let insideQuote = false;

  const len = text.length;
  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRecord.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRecord.push(currentField);
      currentField = '';
      if (currentRecord.length > 0 && !(currentRecord.length === 1 && currentRecord[0].trim() === '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.length > 0 && !(currentRecord.length === 1 && currentRecord[0].trim() === '')) {
      records.push(currentRecord);
    }
  }

  if (records.length === 0) return { headers: [], rows: [] };
  const headers = records[0].map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let r = 1; r < records.length; r++) {
    const record = records[r];
    const rowObj = {};
    headers.forEach((h, idx) => {
      let val = record[idx];
      if (val === undefined) {
        rowObj[h] = '';
      } else {
        val = val.trim();
        if (val !== '' && !isNaN(Number(val)) && !isNaN(parseFloat(val))) {
          rowObj[h] = Number(val);
        } else {
          rowObj[h] = val;
        }
      }
    });
    rows.push(rowObj);
  }
  return { headers, rows };
}

test('RFC 4180 CSV Parsing with Commas Inside Quotes', () => {
  const csv = `id,title,cast,year\ns1,"Movie, The First","Actor A, Actor B",2020\ns2,Short Film,Actor C,2021`;
  const parsed = parseCSV(csv);
  assert.equal(parsed.rows.length, 2);
  assert.equal(parsed.rows[0].title, 'Movie, The First');
  assert.equal(parsed.rows[0].cast, 'Actor A, Actor B');
  assert.equal(parsed.rows[0].year, 2020);
  assert.equal(typeof parsed.rows[0].year, 'number');
});

// 6. Test Data Quality Categorical vs Numeric Missing Recommendation
test('Semantic Quality Actions for Categorical vs Numeric', () => {
  function getMissingRecommendation(isNumeric, pct) {
    if (isNumeric) {
      return 'Configure mean/median imputation or drop rows in the Preprocessing Studio.';
    }
    return pct > 25
      ? 'High missingness in text feature. Recommend dropping this column or imputing with placeholder "Unknown". (Note: Mean/median is mathematically undefined for text).'
      : 'Impute missing entries with the mode (most frequent) or placeholder "Unknown", or drop empty rows. (Note: Mean/median is undefined for text).';
  }

  const numRec = getMissingRecommendation(true, 10);
  assert.ok(numRec.includes('mean/median'));

  const catRec = getMissingRecommendation(false, 30);
  assert.ok(catRec.includes('mathematically undefined'));
  assert.ok(catRec.includes('placeholder "Unknown"'));
});

// 7. Test Huber Loss Quadratic vs Linear Transition
test('Huber Loss Formulation and Derivative', () => {
  function huberLoss(e, delta = 1.0) {
    const absE = Math.abs(e);
    if (absE <= delta) {
      return 0.5 * e * e;
    }
    return delta * (absE - 0.5 * delta);
  }

  // Small error (e = 0.5 <= delta=1.0) -> quadratic 0.5 * 0.25 = 0.125
  assert.equal(huberLoss(0.5, 1.0), 0.125);
  // Large error (e = 3.0 > delta=1.0) -> linear 1.0 * (3.0 - 0.5) = 2.5
  assert.equal(huberLoss(3.0, 1.0), 2.5);
  // Symmetry
  assert.equal(huberLoss(-3.0, 1.0), 2.5);
});

// 8. Test Precision, Recall, F1 and Harmonic Mean
test('Confusion Matrix Diagnostics (Precision, Recall, F1)', () => {
  const tp = 18;
  const fp = 2;
  const fn = 2;
  const tn = 78;

  const precision = tp / (tp + fp); // 18 / 20 = 0.90
  const recall = tp / (tp + fn);    // 18 / 20 = 0.90
  const f1 = (2 * precision * recall) / (precision + recall); // 0.90

  assert.equal(precision, 0.9);
  assert.equal(recall, 0.9);
  assert.equal(f1, 0.9);

  // Severe recall failure: tp=2, fn=18
  const recFailPrecision = 2 / (2 + 2); // 0.50
  const recFailRecall = 2 / (2 + 18);   // 0.10
  const recFailF1 = (2 * recFailPrecision * recFailRecall) / (recFailPrecision + recFailRecall);
  assert.ok(recFailF1 < 0.20); // Harmonic mean severely penalized
});

// 9. Test KNN Majority Voting & Tie Prevention
test('KNN Majority Ballot and Neighborhood Selection', () => {
  const points = [
    { x: 1, y: 1, label: 'A' },
    { x: 2, y: 1, label: 'A' },
    { x: 5, y: 5, label: 'B' },
  ];
  const query = { x: 1.5, y: 1.2 };
  const k = 3;

  const distances = points.map((p) => ({
    label: p.label,
    dist: Math.hypot(p.x - query.x, p.y - query.y),
  }));
  distances.sort((a, b) => a.dist - b.dist);
  const neighbors = distances.slice(0, k);

  const votesA = neighbors.filter((n) => n.label === 'A').length;
  const votesB = neighbors.filter((n) => n.label === 'B').length;
  const winner = votesA > votesB ? 'A' : 'B';

  assert.equal(winner, 'A');
  assert.equal(votesA, 2);
  assert.equal(votesB, 1);
});

// 10. Test L1 Soft-Thresholding Sparsity
test('L1 Lasso Soft-Thresholding Operator (Sparsity)', () => {
  function softThreshold(w, lambda) {
    if (Math.abs(w) <= lambda) return 0;
    return Math.sign(w) * (Math.abs(w) - lambda);
  }

  // Large weight exceeds lambda -> shrunk but non-zero
  assert.equal(softThreshold(3.0, 1.0), 2.0);
  assert.equal(softThreshold(-3.0, 1.0), -2.0);

  // Small weight below lambda -> snapped to EXACT zero (sparsity!)
  assert.equal(softThreshold(0.8, 1.0), 0);
  assert.equal(softThreshold(-0.5, 1.0), 0);
});

// 11. Test Bias-Variance Additive Decomposition
test('Bias-Variance-Noise Additive Decomposition', () => {
  const biasSq = 0.04;
  const variance = 0.03;
  const noise = 0.01;
  const expectedTestError = biasSq + variance + noise;

  assert.equal(expectedTestError, 0.08);
  assert.ok(expectedTestError >= noise); // Irreducible noise is theoretical lower bound
});

console.log('Math verification tests loaded successfully.');
