import { Point2D } from '@/types';

export interface TreeNode {
  isLeaf: boolean;
  feature?: 'x' | 'y';
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: number;
  impurity: number;
  sampleCount: number;
  classCounts: Record<number, number>;
}

export function calculateGini(classCounts: Record<number, number>, total: number): number {
  if (total === 0) return 0;
  let sumSq = 0;
  for (const c in classCounts) {
    const p = classCounts[c] / total;
    sumSq += p * p;
  }
  return Number((1 - sumSq).toFixed(4));
}

export function buildDecisionTree(points: Point2D[], maxDepth: number = 3, currentDepth: number = 0): TreeNode {
  const classCounts: Record<number, number> = {};
  points.forEach((p) => {
    const label = Number(p.label ?? p.cluster ?? 0);
    classCounts[label] = (classCounts[label] || 0) + 1;
  });

  const total = points.length;
  const currentGini = calculateGini(classCounts, total);

  // Majority class
  let maxCount = -1;
  let majorityClass = 0;
  for (const c in classCounts) {
    if (classCounts[c] > maxCount) {
      maxCount = classCounts[c];
      majorityClass = Number(c);
    }
  }

  // Stopping conditions: pure node, max depth, or too few samples
  if (currentDepth >= maxDepth || currentGini === 0 || total <= 2) {
    return {
      isLeaf: true,
      prediction: majorityClass,
      impurity: currentGini,
      sampleCount: total,
      classCounts,
    };
  }

  // Find best split across x and y
  let bestGain = -Infinity;
  let bestFeature: 'x' | 'y' = 'x';
  let bestThreshold = 0;
  let bestLeft: Point2D[] = [];
  let bestRight: Point2D[] = [];

  const features: Array<'x' | 'y'> = ['x', 'y'];

  for (const feat of features) {
    const values = Array.from(new Set(points.map((p) => p[feat]))).sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const mid = (values[i] + values[i + 1]) / 2;
      const left = points.filter((p) => p[feat] <= mid);
      const right = points.filter((p) => p[feat] > mid);

      if (left.length === 0 || right.length === 0) continue;

      const leftCounts: Record<number, number> = {};
      left.forEach((p) => {
        const l = Number(p.label ?? p.cluster ?? 0);
        leftCounts[l] = (leftCounts[l] || 0) + 1;
      });
      const rightCounts: Record<number, number> = {};
      right.forEach((p) => {
        const l = Number(p.label ?? p.cluster ?? 0);
        rightCounts[l] = (rightCounts[l] || 0) + 1;
      });

      const leftGini = calculateGini(leftCounts, left.length);
      const rightGini = calculateGini(rightCounts, right.length);
      const gain = currentGini - (left.length / total) * leftGini - (right.length / total) * rightGini;

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feat;
        bestThreshold = mid;
        bestLeft = left;
        bestRight = right;
      }
    }
  }

  if (bestGain <= 0.0001 || bestLeft.length === 0 || bestRight.length === 0) {
    return {
      isLeaf: true,
      prediction: majorityClass,
      impurity: currentGini,
      sampleCount: total,
      classCounts,
    };
  }

  return {
    isLeaf: false,
    feature: bestFeature,
    threshold: Number(bestThreshold.toFixed(2)),
    impurity: currentGini,
    sampleCount: total,
    classCounts,
    left: buildDecisionTree(bestLeft, maxDepth, currentDepth + 1),
    right: buildDecisionTree(bestRight, maxDepth, currentDepth + 1),
  };
}

export function predictTree(node: TreeNode, pt: { x: number; y: number }): number {
  if (node.isLeaf) return node.prediction ?? 0;
  if (!node.feature || node.threshold === undefined) return 0;

  if (pt[node.feature] <= node.threshold) {
    return node.left ? predictTree(node.left, pt) : (node.prediction ?? 0);
  } else {
    return node.right ? predictTree(node.right, pt) : (node.prediction ?? 0);
  }
}
