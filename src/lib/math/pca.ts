import { Point2D } from '@/types';

export interface PCAResult {
  mean: { x: number; y: number };
  centeredPoints: Point2D[];
  eigenvectors: Array<{ x: number; y: number; eigenvalue: number; varianceRatio: number }>;
  projections: Array<{ id: string; original: Point2D; projected: { x: number; y: number }; error: number }>;
  totalReconstructionError: number;
}

export function compute2DPCA(points: Point2D[]): PCAResult {
  if (points.length < 2) {
    return {
      mean: { x: 0, y: 0 },
      centeredPoints: points,
      eigenvectors: [
        { x: 1, y: 0, eigenvalue: 1, varianceRatio: 1 },
        { x: 0, y: 1, eigenvalue: 0, varianceRatio: 0 },
      ],
      projections: [],
      totalReconstructionError: 0,
    };
  }

  const n = points.length;
  const meanX = points.reduce((acc, p) => acc + p.x, 0) / n;
  const meanY = points.reduce((acc, p) => acc + p.y, 0) / n;

  const centered = points.map((p) => ({
    ...p,
    x: p.x - meanX,
    y: p.y - meanY,
  }));

  // Covariance matrix C = [[varX, covXY], [covXY, varY]]
  let varX = 0;
  let varY = 0;
  let covXY = 0;

  for (const p of centered) {
    varX += p.x * p.x;
    varY += p.y * p.y;
    covXY += p.x * p.y;
  }
  varX /= n - 1;
  varY /= n - 1;
  covXY /= n - 1;

  // 2x2 Eigenvalues: lambda^2 - tr(C)*lambda + det(C) = 0
  const tr = varX + varY;
  const det = varX * varY - covXY * covXY;
  const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));

  const l1 = (tr + disc) / 2;
  const l2 = (tr - disc) / 2;

  // Eigenvectors
  const calcEigenvector = (lambda: number) => {
    // (C - lambda * I) * v = 0
    if (Math.abs(covXY) > 1e-7) {
      const vx = covXY;
      const vy = lambda - varX;
      const mag = Math.sqrt(vx * vx + vy * vy) || 1;
      return { x: vx / mag, y: vy / mag };
    } else {
      return varX >= varY ? { x: 1, y: 0 } : { x: 0, y: 1 };
    }
  };

  const v1 = calcEigenvector(l1);
  // v2 is orthogonal to v1
  const v2 = { x: -v1.y, y: v1.x };

  const totalVar = l1 + l2 || 1;
  const varRatio1 = Number((l1 / totalVar).toFixed(4));
  const varRatio2 = Number((l2 / totalVar).toFixed(4));

  // Project points onto 1st principal component
  let totalError = 0;
  const projections = centered.map((p, idx) => {
    // dot product with v1
    const t = p.x * v1.x + p.y * v1.y;
    const projX = t * v1.x;
    const projY = t * v1.y;
    const err = (p.x - projX) ** 2 + (p.y - projY) ** 2;
    totalError += err;

    return {
      id: p.id,
      original: points[idx],
      projected: { x: Number((projX + meanX).toFixed(3)), y: Number((projY + meanY).toFixed(3)) },
      error: Number(Math.sqrt(err).toFixed(3)),
    };
  });

  return {
    mean: { x: Number(meanX.toFixed(3)), y: Number(meanY.toFixed(3)) },
    centeredPoints: centered,
    eigenvectors: [
      { x: Number(v1.x.toFixed(4)), y: Number(v1.y.toFixed(4)), eigenvalue: Number(l1.toFixed(3)), varianceRatio: varRatio1 },
      { x: Number(v2.x.toFixed(4)), y: Number(v2.y.toFixed(4)), eigenvalue: Number(l2.toFixed(3)), varianceRatio: varRatio2 },
    ],
    projections,
    totalReconstructionError: Number((totalError / n).toFixed(4)),
  };
}
