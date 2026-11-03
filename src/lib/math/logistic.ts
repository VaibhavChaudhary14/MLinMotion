import { Point2D, TraceEvent } from '@/types';

export interface LogisticParams {
  w1: number;
  w2: number;
  bias: number;
  threshold: number;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
}

export function evaluateLogisticModel(
  points: Point2D[],
  params: LogisticParams
): { predictions: Array<{ id: string; prob: number; predClass: number; isCorrect: boolean }>; cm: ConfusionMatrix; logLoss: number } {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  let totalLoss = 0;

  const predictions = points.map((p) => {
    const trueClass = Number(p.label ?? p.cluster ?? 0);
    const z = params.w1 * p.x + params.w2 * p.y + params.bias;
    const prob = sigmoid(z);
    const predClass = prob >= params.threshold ? 1 : 0;

    if (trueClass === 1 && predClass === 1) tp++;
    else if (trueClass === 0 && predClass === 1) fp++;
    else if (trueClass === 0 && predClass === 0) tn++;
    else if (trueClass === 1 && predClass === 0) fn++;

    // Binary cross-entropy
    const eps = 1e-12;
    const clampedProb = Math.min(1 - eps, Math.max(eps, prob));
    const loss = -(trueClass * Math.log(clampedProb) + (1 - trueClass) * Math.log(1 - clampedProb));
    totalLoss += loss;

    return {
      id: p.id,
      prob: Number(prob.toFixed(3)),
      predClass,
      isCorrect: trueClass === predClass,
    };
  });

  const total = points.length || 1;
  const accuracy = Number(((tp + tn) / total).toFixed(3));
  const precision = tp + fp > 0 ? Number((tp / (tp + fp)).toFixed(3)) : 0;
  const recall = tp + fn > 0 ? Number((tp / (tp + fn)).toFixed(3)) : 0;
  const f1 = precision + recall > 0 ? Number(((2 * precision * recall) / (precision + recall)).toFixed(3)) : 0;
  const logLoss = Number((totalLoss / total).toFixed(4));

  return {
    predictions,
    cm: { tp, fp, tn, fn, accuracy, precision, recall, f1 },
    logLoss,
  };
}
