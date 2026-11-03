import { Point2D, TraceEvent } from '@/types';

export interface RegressionParams {
  slope: number;
  intercept: number;
}

export interface RegressionStepResult {
  params: RegressionParams;
  residuals: Array<{ id: string; x: number; y: number; yHat: number; residual: number }>;
  mse: number;
  r2: number;
  gradient: { dw: number; db: number };
  iteration: number;
  trace: TraceEvent;
}

// Compute Ordinary Least Squares (Closed-form analytical solution)
export function computeOLS(points: Point2D[]): RegressionParams & { mse: number; r2: number } {
  if (points.length < 2) {
    return { slope: 0, intercept: 0, mse: 0, r2: 0 };
  }

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - meanX) * (p.y - meanY);
    den += (p.x - meanX) * (p.x - meanX);
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  // MSE and R2
  let sse = 0;
  let sst = 0;
  for (const p of points) {
    const yHat = slope * p.x + intercept;
    sse += (p.y - yHat) ** 2;
    sst += (p.y - meanY) ** 2;
  }

  const mse = sse / n;
  const r2 = sst === 0 ? 1 : 1 - sse / sst;

  return {
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    mse: Number(mse.toFixed(4)),
    r2: Number(r2.toFixed(4)),
  };
}

// Compute single Gradient Descent Step
export function computeGDStep(
  points: Point2D[],
  currentParams: RegressionParams,
  learningRate: number,
  iteration: number
): RegressionStepResult {
  const m = points.length;
  const { slope: w, intercept: b } = currentParams;

  let dw = 0;
  let db = 0;
  let sse = 0;
  let sst = 0;

  const meanY = points.reduce((acc, p) => acc + p.y, 0) / (m || 1);

  const residuals = points.map((p) => {
    const yHat = w * p.x + b;
    const residual = p.y - yHat;
    dw += -(2 / m) * p.x * residual;
    db += -(2 / m) * residual;
    sse += residual * residual;
    sst += (p.y - meanY) ** 2;

    return {
      id: p.id,
      x: p.x,
      y: p.y,
      yHat: Number(yHat.toFixed(3)),
      residual: Number(residual.toFixed(3)),
    };
  });

  const nextW = Number((w - learningRate * dw).toFixed(4));
  const nextB = Number((b - learningRate * db).toFixed(4));
  const mse = Number((sse / m).toFixed(4));
  const r2 = sst === 0 ? 1 : Number((1 - sse / sst).toFixed(4));

  return {
    params: { slope: nextW, intercept: nextB },
    residuals,
    mse,
    r2,
    gradient: { dw: Number(dw.toFixed(4)), db: Number(db.toFixed(4)) },
    iteration,
    trace: {
      step: iteration,
      stageName: `STEP ${iteration} // GRADIENT UPDATE`,
      description: `Computed partial derivatives: ∂J/∂w = ${dw.toFixed(3)}, ∂J/∂b = ${db.toFixed(3)}. Applied update with α = ${learningRate}.`,
      equationLatex: 'w \\leftarrow w - \\alpha \\frac{\\partial J}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial J}{\\partial b}',
      codeLine: 5,
      codeSnippet: `w -= lr * (-2/m) * np.dot(X, (y - y_hat))\nb -= lr * (-2/m) * np.sum(y - y_hat)`,
      metrics: {
        'Slope w': nextW,
        'Intercept b': nextB,
        MSE: mse,
        'R²': r2,
      },
      internalState: { dw, db, learningRate },
    },
  };
}
