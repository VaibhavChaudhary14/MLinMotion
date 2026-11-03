export type StageCategory =
  | 'Foundations'
  | 'Data Engineering'
  | 'Mathematics'
  | 'Optimization'
  | 'Supervised'
  | 'Unsupervised'
  | 'Evaluation'
  | 'Advanced';

export type CurriculumLayer = 'essential' | 'evaluation' | 'planned';

export interface ConceptNode {
  id: string;
  stageNumber: number;
  stageCode: string;
  title: string;
  category: StageCategory;
  layer: CurriculumLayer;
  eyebrow: string;
  description: string;
  prerequisites: string[]; // Concept IDs required before unlocking or mastering
  recommendedNext: string[];
  lessonId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  topicsCovered: string[];
  plannedStatus?: 'implemented' | 'planned';
}

export interface PlannedExtension {
  id: string;
  title: string;
  category: string;
  description: string;
  prerequisiteStages: string[];
  estimatedDifficulty: 'Intermediate' | 'Advanced';
  status: 'Planned for Phase 2';
}

// -------------------------------------------------------------
// THE ESSENTIAL 20% ML CURRICULUM (12 ORDERED STAGES)
// Layer 1: Essential Core (Stages 01–10)
// Layer 2: Evaluation & Scientific Thinking (Stages 11–12)
// -------------------------------------------------------------
export const CURRICULUM_STAGES: Record<string, ConceptNode> = {
  'ml-foundations': {
    id: 'ml-foundations',
    stageNumber: 1,
    stageCode: '01',
    title: 'Machine Learning Foundations',
    category: 'Foundations',
    layer: 'essential',
    eyebrow: 'STAGE 01 // FOUNDATIONS',
    description:
      'What machine learning actually is, AI vs ML vs Deep Learning, Supervised vs Unsupervised vs Reinforcement learning, batch vs online learning, and the ML development lifecycle.',
    prerequisites: [],
    recommendedNext: ['data-literacy', 'math-for-ml'],
    lessonId: 'ml-foundations',
    difficulty: 'Beginner',
    durationMinutes: 18,
    topicsCovered: [
      'What is Machine Learning?',
      'AI vs ML vs Deep Learning',
      'Supervised, Unsupervised & Reinforcement Learning',
      'Regression vs Classification vs Clustering',
      'Batch vs Online Learning',
      'Instance-based vs Model-based Learning',
      'ML development lifecycle',
      'Train, validation & test datasets',
    ],
    plannedStatus: 'implemented',
  },
  'data-literacy': {
    id: 'data-literacy',
    stageNumber: 2,
    stageCode: '02',
    title: 'Data Literacy & Feature Engineering',
    category: 'Data Engineering',
    layer: 'essential',
    eyebrow: 'STAGE 02 // DATA HYGIENE',
    description:
      'Samples, features, labels and targets, numerical vs categorical features, missing data, outlier detection, StandardScaler vs MinMaxScaler, and preventing fatal data leakage in preprocessing pipelines.',
    prerequisites: ['ml-foundations'],
    recommendedNext: ['math-for-ml', 'learning-problem', 'kmeans'],
    lessonId: 'data-literacy',
    difficulty: 'Beginner',
    durationMinutes: 20,
    topicsCovered: [
      'Samples, features, labels & targets',
      'Numerical vs categorical data',
      'Structured datasets and data types',
      'Mean, median, variance & standard deviation',
      'Missing values, outliers & noisy data',
      'Feature scaling: standardization & min-max normalization',
      'Encoding categorical variables',
      'Data leakage & preprocessing pipelines',
    ],
    plannedStatus: 'implemented',
  },
  'math-for-ml': {
    id: 'math-for-ml',
    stageNumber: 3,
    stageCode: '03',
    title: 'Mathematics for Machine Learning',
    category: 'Mathematics',
    layer: 'essential',
    eyebrow: 'STAGE 03 // MATHEMATICS',
    description:
      'Vectors, dot products and geometric angles, Euclidean vs Manhattan norms, covariance matrices, slopes and partial derivatives, gradients, and conditional probability foundations.',
    prerequisites: ['ml-foundations'],
    recommendedNext: ['learning-problem', 'kmeans', 'pca'],
    lessonId: 'math-for-ml',
    difficulty: 'Beginner',
    durationMinutes: 22,
    topicsCovered: [
      'Scalars, vectors & matrices',
      'Dot products & vector geometry',
      'Distances: Euclidean & Manhattan',
      'Mean, variance & covariance',
      'Functions, slopes & derivatives',
      'Partial derivatives & gradients',
      'Basic probability & conditional probability',
      'Loss functions & optimization intuition',
    ],
    plannedStatus: 'implemented',
  },
  'learning-problem': {
    id: 'learning-problem',
    stageNumber: 4,
    stageCode: '04',
    title: 'The Learning Problem & Generalization',
    category: 'Optimization',
    layer: 'essential',
    eyebrow: 'STAGE 04 // LEARNING THEORY',
    description:
      'Hypothesis functions, model parameters vs hyperparameters, Empirical Risk Minimization, the bias-variance tradeoff, underfitting vs overfitting, and L1/L2 regularization intuition.',
    prerequisites: ['data-literacy', 'math-for-ml'],
    recommendedNext: ['linear-regression', 'decision-trees'],
    lessonId: 'learning-problem',
    difficulty: 'Beginner',
    durationMinutes: 20,
    topicsCovered: [
      'Hypothesis & model parameters',
      'Predictions: ŷ = f(x)',
      'Loss vs cost function',
      'Empirical Risk Minimization',
      'Parameters vs hyperparameters',
      'Underfitting & overfitting',
      'Bias–variance tradeoff',
      'Regularization intuition: L1 & L2',
    ],
    plannedStatus: 'implemented',
  },
  'linear-regression': {
    id: 'linear-regression',
    stageNumber: 5,
    stageCode: '05',
    title: 'Linear Regression & Ordinary Least Squares',
    category: 'Supervised',
    layer: 'essential',
    eyebrow: 'STAGE 05 // CORE ALGORITHM',
    description:
      'The first complete model: Simple and multiple linear regression, residual geometry, Ordinary Least Squares closed-form normal equations, R² coefficient, and regression failure assumptions.',
    prerequisites: ['learning-problem'],
    recommendedNext: ['gradient-descent', 'model-evaluation'],
    lessonId: 'linear-regression',
    difficulty: 'Beginner',
    durationMinutes: 22,
    topicsCovered: [
      'Simple linear regression',
      'Multiple linear regression',
      'Ordinary Least Squares (OLS)',
      'Residuals & SSE / MSE',
      'Normal equation: β = (XᵀX)⁻¹ Xᵀy',
      'R² and its limitations',
      'Regression assumptions & failure cases',
    ],
    plannedStatus: 'implemented',
  },
  'gradient-descent': {
    id: 'gradient-descent',
    stageNumber: 6,
    stageCode: '06',
    title: 'Gradient Descent & Step Optimization',
    category: 'Optimization',
    layer: 'essential',
    eyebrow: 'STAGE 06 // CORE ALGORITHM',
    description:
      'Navigating error surfaces: First-order negative gradient steps, learning rate tuning, initialization sensitivity, ravines and oscillation, and Batch vs Stochastic vs Mini-Batch updates.',
    prerequisites: ['linear-regression'],
    recommendedNext: ['logistic-regression'],
    lessonId: 'gradient-descent',
    difficulty: 'Intermediate',
    durationMinutes: 24,
    topicsCovered: [
      'Objective functions & loss terrain',
      'Derivative & gradient intuition',
      'Gradient descent update rule: w ← w - α ∇J(w)',
      'Learning rate selection & tuning',
      'Initialization sensitivity',
      'Convergence, oscillation & divergence',
      'Batch, stochastic & mini-batch gradient descent',
      'Feature scaling and optimization speed',
    ],
    plannedStatus: 'implemented',
  },
  'logistic-regression': {
    id: 'logistic-regression',
    stageNumber: 7,
    stageCode: '07',
    title: 'Logistic Regression & Classification',
    category: 'Supervised',
    layer: 'essential',
    eyebrow: 'STAGE 07 // CORE ALGORITHM',
    description:
      'Transitioning to discrete decisions: Sigmoid probability mapping, log-odds linearity, binary cross-entropy log loss, decision thresholds, and confusion matrix metrics (precision, recall, ROC-AUC).',
    prerequisites: ['gradient-descent'],
    recommendedNext: ['decision-trees', 'model-evaluation'],
    lessonId: 'logistic-regression',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    topicsCovered: [
      'Classification probabilities',
      'Sigmoid activation function: σ(z) = 1 / (1 + e⁻ᶻ)',
      'Log-odds intuition & linear boundary',
      'Binary cross-entropy / log loss',
      'Decision thresholds & confusion matrix',
      'Precision, recall, F1 & accuracy',
      'ROC-AUC intuition',
      'Class imbalance & threshold trade-offs',
    ],
    plannedStatus: 'implemented',
  },
  'decision-trees': {
    id: 'decision-trees',
    stageNumber: 8,
    stageCode: '08',
    title: 'Decision Trees: Recursive Partitioning',
    category: 'Supervised',
    layer: 'essential',
    eyebrow: 'STAGE 08 // CORE ALGORITHM',
    description:
      'Non-parametric classification: Recursive orthogonal axis cuts, Gini impurity vs Entropy information gain, greedy split sweeps, stopping conditions, and cost-complexity pruning.',
    prerequisites: ['learning-problem', 'logistic-regression'],
    recommendedNext: ['kmeans'],
    lessonId: 'decision-trees',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    topicsCovered: [
      'Recursive orthogonal partitioning',
      'Gini impurity: 1 - ∑ pᵢ²',
      'Entropy & information gain',
      'Greedy split threshold selection',
      'Tree depth & stopping conditions',
      'Overfitting in unconstrained trees',
      'Pruning & regularization',
      'Orthogonal decision boundaries',
    ],
    plannedStatus: 'implemented',
  },
  'kmeans': {
    id: 'kmeans',
    stageNumber: 9,
    stageCode: '09',
    title: 'Unsupervised Learning & K-Means',
    category: 'Unsupervised',
    layer: 'essential',
    eyebrow: 'STAGE 09 // CORE ALGORITHM',
    description:
      'Discovering unlabeled structure: Centroid-based partitioning, Voronoi cell geometry, Lloyd coordinate descent iterations, inertia WCSS, choosing K via elbow/silhouette, and non-convex failure modes.',
    prerequisites: ['data-literacy', 'math-for-ml'],
    recommendedNext: ['pca', 'model-comparison'],
    lessonId: 'kmeans',
    difficulty: 'Beginner',
    durationMinutes: 25,
    topicsCovered: [
      'What clustering solves',
      'Distance-based geometric similarity',
      'Centroids & Voronoi cluster assignments',
      'K-means++ initialization',
      'Lloyd’s algorithm: assign → update loop',
      'Inertia / within-cluster sum of squares',
      'Choosing K: elbow heuristic & silhouette analysis',
      'Sensitivity to initialization & feature scaling',
      'Spherical-cluster bias, outliers & local minima',
    ],
    plannedStatus: 'implemented',
  },
  'pca': {
    id: 'pca',
    stageNumber: 10,
    stageCode: '10',
    title: 'PCA & Dimensionality Reduction',
    category: 'Unsupervised',
    layer: 'essential',
    eyebrow: 'STAGE 10 // CORE ALGORITHM',
    description:
      'The final essential algorithm: High-dimensional geometry, variance as information, covariance matrices, eigenvalues and orthogonal eigenvectors, coordinate projection, and reconstruction error.',
    prerequisites: ['math-for-ml', 'kmeans'],
    recommendedNext: ['model-evaluation', 'model-comparison'],
    lessonId: 'pca',
    difficulty: 'Intermediate',
    durationMinutes: 26,
    topicsCovered: [
      'High-dimensional data intuition & curse of dimensionality',
      'Variance and information preservation',
      'Sample covariance matrix computation',
      'Eigenvalues & orthogonal eigenvectors',
      'Principal components as maximal variance directions',
      'Projection matrix & explained variance ratio',
      'Dimensionality reduction & reconstruction error',
      'PCA limitations, linearity & scaling requirement',
    ],
    plannedStatus: 'implemented',
  },
  'model-evaluation': {
    id: 'model-evaluation',
    stageNumber: 11,
    stageCode: '11',
    title: 'Model Evaluation & Generalization',
    category: 'Evaluation',
    layer: 'evaluation',
    eyebrow: 'STAGE 11 // EVALUATION & RIGOR',
    description:
      'Assessing real-world performance: K-fold cross-validation, the generalization gap, data leakage prevention, regression vs classification metrics, clustering evaluation pitfalls, baseline models, and residual error diagnostics.',
    prerequisites: ['linear-regression', 'logistic-regression'],
    recommendedNext: ['model-comparison'],
    lessonId: 'model-evaluation',
    difficulty: 'Intermediate',
    durationMinutes: 22,
    topicsCovered: [
      'Train vs validation vs test performance',
      'K-Fold Cross-validation & stratification',
      'The generalization gap & sample size effects',
      'Data leakage revisited: train-split transformations',
      'Regression vs classification metrics matrix',
      'Clustering evaluation limitations (unsupervised pitfall)',
      'Baseline naive models (mean predictor, majority class)',
      'Model selection & systematic error analysis',
    ],
    plannedStatus: 'implemented',
  },
  'model-comparison': {
    id: 'model-comparison',
    stageNumber: 12,
    stageCode: '12',
    title: 'Model Comparison & Scientific Experimentation',
    category: 'Evaluation',
    layer: 'evaluation',
    eyebrow: 'STAGE 12 // SCIENTIFIC EXPERIMENTATION',
    description:
      'The synthesis of the learning journey: Benchmarking K-Means vs DBSCAN vs Agglomerative clustering on identical splits, understanding inductive biases, controlled experiments, reproducibility seeds, and logging audit trails.',
    prerequisites: ['kmeans', 'pca', 'model-evaluation'],
    recommendedNext: [],
    lessonId: 'model-comparison',
    difficulty: 'Intermediate',
    durationMinutes: 24,
    topicsCovered: [
      'K-means vs DBSCAN vs Agglomerative clustering benchmark',
      'Model assumptions & inductive bias divergence',
      'Controlled experiments: keeping splits and random seeds constant',
      'Hyperparameter tuning without test set contamination',
      'Ablation & parameter sensitivity experiments',
      'Error analysis & boundary failure cases',
      'Communicating experiment results & audit log notebooks',
    ],
    plannedStatus: 'implemented',
  },
};

// Aliases for backwards compatibility with legacy routes / query params
export const CONCEPT_GRAPH: Record<string, ConceptNode> = {
  ...CURRICULUM_STAGES,
  // Backwards compatible aliases
  'distance-metrics': CURRICULUM_STAGES['math-for-ml'],
  'kmeans-clustering': CURRICULUM_STAGES['kmeans'],
  'cluster-evaluation': CURRICULUM_STAGES['model-evaluation'],
  'clustering-failure-cases': CURRICULUM_STAGES['model-comparison'],
  'loss-functions': CURRICULUM_STAGES['learning-problem'],
  'pca-reduction': CURRICULUM_STAGES['pca'],
};

// -------------------------------------------------------------
// LAYER 3: ADVANCED EXTENSIONS (DISCOVERABLE / PLANNED)
// -------------------------------------------------------------
export const PLANNED_EXTENSIONS: PlannedExtension[] = [
  {
    id: 'ext-svm',
    title: 'Support Vector Machines (SVM)',
    category: 'Supervised Learning',
    description: 'Maximal margin hyperplanes, support vectors, soft margin slack variables (C), and the Kernel trick (RBF).',
    prerequisiteStages: ['07 (Logistic Regression)', '10 (PCA & Inner Products)'],
    estimatedDifficulty: 'Intermediate',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-naive-bayes',
    title: 'Naive Bayes Classifiers',
    category: 'Probabilistic Modeling',
    description: 'Bayes Theorem, conditional independence assumption, prior/posterior probabilities, and Laplace smoothing.',
    prerequisiteStages: ['03 (Mathematics for ML)', '07 (Logistic Regression)'],
    estimatedDifficulty: 'Intermediate',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-knn',
    title: 'k-Nearest Neighbors (k-NN)',
    category: 'Instance-Based Learning',
    description: 'Non-parametric local voting, Minkowski distance metrics, choice of k, KD-trees, and the curse of dimensionality.',
    prerequisiteStages: ['02 (Feature Scaling)', '03 (Distance Metrics)'],
    estimatedDifficulty: 'Intermediate',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-random-forests',
    title: 'Random Forests & Bagging Ensembles',
    category: 'Ensemble Learning',
    description: 'Bootstrap aggregating (Bagging), feature subspace sampling, variance reduction, and Out-of-Bag (OOB) error estimation.',
    prerequisiteStages: ['08 (Decision Trees)', '11 (Model Evaluation)'],
    estimatedDifficulty: 'Intermediate',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-gradient-boosting',
    title: 'Gradient Boosted Decision Trees (XGBoost / LightGBM)',
    category: 'Ensemble Learning',
    description: 'Sequential residual fitting, gradient loss optimization, learning rate shrinkage, and leaf regularization.',
    prerequisiteStages: ['06 (Gradient Descent)', '08 (Decision Trees)'],
    estimatedDifficulty: 'Advanced',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-neural-networks',
    title: 'Multilayer Perceptrons & Deep Learning',
    category: 'Deep Learning',
    description: 'Artificial neurons, forward propagation, backpropagation chain rule, activation functions (ReLU, GELU), and SGD with momentum.',
    prerequisiteStages: ['06 (Gradient Descent)', '07 (Logistic Regression)'],
    estimatedDifficulty: 'Advanced',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-cnn',
    title: 'Convolutional Neural Networks (CNNs)',
    category: 'Deep Learning',
    description: 'Spatial 2D convolution kernels, pooling layers, translational invariance, and feature hierarchy extraction.',
    prerequisiteStages: ['Advanced: Multilayer Perceptrons'],
    estimatedDifficulty: 'Advanced',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-transformers',
    title: 'Transformers & Self-Attention',
    category: 'Deep Learning',
    description: 'Scaled dot-product attention, query-key-value projections, multi-head attention, and positional encodings.',
    prerequisiteStages: ['03 (Linear Algebra)', 'Advanced: Multilayer Perceptrons'],
    estimatedDifficulty: 'Advanced',
    status: 'Planned for Phase 2',
  },
  {
    id: 'ext-reinforcement-learning',
    title: 'Reinforcement Learning Foundations',
    category: 'Autonomous Agents',
    description: 'Markov Decision Processes, state-action rewards, Bellman equations, value iteration, and Q-learning.',
    prerequisiteStages: ['04 (The Learning Problem)', '06 (Optimization)'],
    estimatedDifficulty: 'Advanced',
    status: 'Planned for Phase 2',
  },
];

// Helper functions for curriculum navigation
export function getAllStagesList(): ConceptNode[] {
  return Object.values(CURRICULUM_STAGES).sort((a, b) => a.stageNumber - b.stageNumber);
}

export function getEssentialStages(): ConceptNode[] {
  return getAllStagesList().filter((s) => s.layer === 'essential');
}

export function getEvaluationStages(): ConceptNode[] {
  return getAllStagesList().filter((s) => s.layer === 'evaluation');
}

export function getStageByCode(code: string): ConceptNode | undefined {
  return Object.values(CURRICULUM_STAGES).find((s) => s.stageCode === code || s.id === code);
}

export function isStageUnlocked(stageId: string, conceptStates: Record<string, any>): boolean {
  const stage = CURRICULUM_STAGES[stageId];
  if (!stage) return true;
  if (stage.prerequisites.length === 0) return true;
  return stage.prerequisites.every((prId) => {
    const st = conceptStates[prId];
    return st && (st.masteryScore >= 60 || st.attempts >= 1);
  });
}

export function calculateEssentialCoreProgress(conceptStates: Record<string, any>): {
  completedCount: number;
  totalCount: number;
  percent: number;
  averageMastery: number;
} {
  const essential = getEssentialStages();
  let completed = 0;
  let totalMastery = 0;

  essential.forEach((s) => {
    const st = conceptStates[s.id];
    const score = st?.masteryScore || 0;
    if (score >= 60) completed++;
    totalMastery += score;
  });

  return {
    completedCount: completed,
    totalCount: essential.length,
    percent: Math.round((completed / essential.length) * 100),
    averageMastery: Math.round(totalMastery / essential.length),
  };
}

export const LEARNING_PATHS = [
  {
    id: 'essential-20',
    title: 'The Essential 20% ML Core Path (Stages 01–10)',
    description: 'The master guided sequence unlocking 80% of machine learning through data, math, and core algorithms.',
    stages: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  },
  {
    id: 'evaluation-track',
    title: 'Scientific Evaluation & Experimentation (Stages 11–12)',
    description: 'Rigorous validation, generalization gap, inductive bias testing, and multi-model benchmark matrices.',
    stages: ['11', '12'],
  },
];
