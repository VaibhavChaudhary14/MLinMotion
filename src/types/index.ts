export type AlgorithmId =
  | 'kmeans'
  | 'linear-regression'
  | 'gradient-descent'
  | 'logistic-regression'
  | 'decision-trees'
  | 'pca';

export type ComparisonAlgorithmId =
  | 'kmeans'
  | 'dbscan'
  | 'agglomerative'
  | 'linear-regression'
  | 'ridge-regression'
  | 'decision-tree-regressor';

export type TaskType =
  | 'clustering'
  | 'regression'
  | 'binary-classification'
  | 'multiclass-classification'
  | 'dimensionality-reduction';

export interface Point2D {
  id: string;
  x: number;
  y: number;
  label?: number | string;
  cluster?: number;
  initialCluster?: number;
  distToCentroid?: number;
  isOutlier?: boolean;
}

export interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
  history: Array<{ x: number; y: number; step: number }>;
}

export interface TraceEvent {
  step: number;
  stageName: string;
  description: string;
  equationLatex: string;
  codeLine: number;
  codeSnippet: string;
  metrics: Record<string, number | string>;
  changedEntity?: string;
  internalState: Record<string, any>;
}

export interface SimulationState {
  step: number;
  totalSteps: number;
  isRunning: boolean;
  speedMs: number;
  isConverged: boolean;
  history: TraceEvent[];
}

export interface DataColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'identifier';
  missingCount: number;
  uniqueCount: number;
  min?: number;
  max?: number;
  mean?: number;
  sampleValues: any[];
}

export interface QualityWarning {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  explanation: string;
  recommendedAction: string;
}

export interface PreprocessingConfig {
  scaling: 'none' | 'standard' | 'minmax';
  missingImputation: 'mean' | 'median' | 'drop';
  trainSplitRatio: number;
  randomSeed: number;
}

export interface ExperimentRecord {
  id: string;
  timestamp: string;
  name: string;
  datasetName: string;
  datasetFingerprint: string;
  algorithm: string;
  taskType: TaskType;
  hyperparameters: Record<string, any>;
  metrics: Record<string, number | string>;
  runtimeMs: number;
  warnings: string[];
  notes?: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  misconceptionMap: Record<number, string>; // optionIndex -> misconception ID
  explanation: string;
  mathExplanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LessonStep {
  id: string;
  title: string;
  eyebrow: string;
  phase:
    | 'hook'
    | 'intuition'
    | 'explore'
    | 'predict'
    | 'reveal'
    | 'under-the-hood'
    | 'break-it'
    | 'code-it'
    | 'assessment'
    | 'mastery';
  contentMarkdown: string;
  equation?: string;
  interactiveComponent?: string;
  predictionOptions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  questions?: AssessmentQuestion[];
  codeSnippet?: {
    python: string;
    sklearn: string;
    explanation: string;
  };
}

export interface Lesson {
  id: string;
  algorithmId: AlgorithmId;
  title: string;
  subtitle: string;
  durationMinutes: number;
  prerequisites: string[];
  learningObjectives: string[];
  steps: LessonStep[];
}

export interface LearnerConceptState {
  conceptId: string;
  title: string;
  attempts: number;
  correctAnswers: number;
  masteryScore: number; // 0 to 100
  lastPracticed?: string;
  misconceptionsObserved: string[];
  nextReviewDate?: string;
  confidenceRating?: number;
}
