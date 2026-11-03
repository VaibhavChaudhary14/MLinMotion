import { ConceptCardUnit } from '@/types/conceptCards';

export const FOUNDATIONS_CONCEPTS: Record<string, ConceptCardUnit> = {
  // =========================================================================
  // 01 // FEATURES, LABELS & DATASETS
  // =========================================================================
  'features-labels-datasets': {
    id: 'features-labels-datasets',
    title: 'Features, Labels & Datasets',
    subtitle: 'Structuring observational data into mathematical design matrices.',
    eyebrow: '00 // ML FOUNDATIONS',
    category: 'ML Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    prerequisites: ['Basic Algebra', 'Vectors'],
    nextConceptId: 'train-test-validation',
    colorAccent: 'ultramarine',
    tags: ['Design Matrix', 'Feature Encoding', 'Target Vector', 'Standardization', 'Tabular'],
    nutshell: {
      definition:
        'The foundational data structure of statistical learning where observational entities are encoded into an n-by-d numeric feature matrix X and paired with target response labels y.',
      whyExists:
        'Learning algorithms operate on vector spaces, computing dot products, Euclidean distances, and matrix inversions. Raw physical phenomena (text, sensor streams, categories) cannot be mathematically computed until mapped into quantified geometric coordinates.',
      problemSolved:
        'Translates ambiguous unstructured phenomena into a rigorous tabular representation where dimensions correspond to measured attributes and rows represent independent observations.',
      primaryFormula: {
        latex: '\\mathbf{X} = \\begin{bmatrix} x_{11} & \\dots & x_{1d} \\\\ \\vdots & \\ddots & \\vdots \\\\ x_{n1} & \\dots & x_{nd} \\end{bmatrix} \\in \\mathbb{R}^{n \\times d}, \\quad \\mathbf{y} \\in \\mathbb{R}^n',
        label: 'DESIGN MATRIX & RESPONSE VECTOR',
        explanation: 'n is the number of observed samples; d is the dimensionality of measured features.',
      },
      keyCharacteristics: [
        'Features define the coordinate axes of the input space: continuous, discrete, or categorical',
        'Labels serve as supervisory ground truth for prediction (continuous for regression, discrete for classification)',
        'Requires numerical encoding (One-Hot, Ordinal) and scaling to prevent dimension dominance',
      ],
    },
    howItWorks: {
      headline: 'From Raw Observations to Geometric Vector Spaces in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Attribute Identification & Typing',
          description:
            'Identify which attributes represent independent predictive variables (features X) and which column represents the dependent outcome (target y).',
          mathDetail: '(\\mathbf{x}^{(i)}, y^{(i)}) \\in \\mathcal{X} \\times \\mathcal{Y}',
          diagramNote: 'Column typing: numerical continuous, categorical nominal, ordinal, or text.',
        },
        {
          stepNumber: 2,
          title: 'Categorical Vectorization',
          description:
            'Convert non-numeric categories into binary orthogonal axes via One-Hot Encoding to avoid implying an artificial mathematical order.',
          mathDetail: '\\text{Category}_c \\mapsto \\mathbf{e}_c = [0, \\dots, 1, \\dots, 0]^T',
          diagramNote: 'A 3-category column expands into 3 binary columns {0, 1}.',
        },
        {
          stepNumber: 3,
          title: 'Feature Scaling & Standardization',
          description:
            'Center features to zero mean and scale to unit variance so high-magnitude features do not artificially dominate Euclidean distances or gradient descent step paths.',
          mathDetail: 'z_{ij} = \\frac{x_{ij} - \\mu_j}{\\sigma_j}',
          diagramNote: 'Transforms ill-conditioned elongated contours into spherical isotropic surfaces.',
        },
        {
          stepNumber: 4,
          title: 'Assembly of the Design Matrix',
          description:
            'Stack individual sample row vectors into the master design matrix X alongside the target vector y, ready for linear hypothesis matrix products.',
          mathDetail: '\\hat{\\mathbf{y}} = \\mathbf{X}\\mathbf{w} + b',
          diagramNote: 'Dimensions verified: X is (n x d), w is (d x 1), y_hat is (n x 1).',
        },
      ],
      coreLoopSummary:
        'Raw Observations -> Feature Typing -> Numerical Encoding -> Standardization -> Design Matrix X and Target y.',
    },
    visualExample: {
      scenarioTitle: 'Real Estate Appraisal: From Tabular Attributes to Matrix Dimensions',
      relatableScenario:
        'Consider predicting house prices from raw records with square footage (1450 sq ft), bedroom count (3), neighborhood ("Downtown"), and price ($420k). Notice how raw strings break linear algebra until one-hot encoded and standardized.',
      inputsDescription: '4 home appraisal records containing both numeric measurements and categorical text.',
      intermediateDescription: 'Comparison across Raw Tabular, One-Hot Encoded, and Standardized Z-Score representations.',
      outputDescription: 'A clean mathematical feature matrix X (4x5) and response vector y (4x1).',
      interactiveType: 'features-labels-datasets',
    },
    variants: {
      summary: 'Data representation strategies adapted to attribute characteristics and model families.',
      variants: [
        {
          id: 'numerical-scaling',
          name: 'StandardScaler vs MinMaxScaler',
          tag: 'Scaling Strategy',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'StandardScaler centers to mu=0, sigma=1 (preserves outliers); MinMaxScaler bounds strictly to [0, 1] using min and max values.',
          idealUseCase: 'StandardScaler for gradient descent and PCA; MinMaxScaler for bounded neural inputs and image pixels.',
          drawback: 'MinMaxScaler is heavily distorted by extreme out-of-range outliers.',
        },
        {
          id: 'onehot-vs-target',
          name: 'One-Hot vs Target Encoding',
          tag: 'Categorical Encoding',
          badgeVariant: 'amber',
          howItDiffers:
            'One-hot adds d binary indicator columns; Target encoding replaces categories with the mean target value of that category.',
          idealUseCase: 'One-hot for low-cardinality nominal features (<= 10 categories); Target encoding for high-cardinality features (e.g. zip codes).',
          drawback: 'Target encoding easily causes severe data leakage and target memorization if not regularized.',
        },
        {
          id: 'dense-vs-sparse',
          name: 'Dense vs Sparse CSR Representation',
          tag: 'Memory Geometry',
          badgeVariant: 'sage',
          howItDiffers:
            'Dense matrices allocate full n x d floating point arrays; Sparse Compressed Sparse Row (CSR) matrices only store non-zero entries and coordinates.',
          idealUseCase: 'Natural language processing TF-IDF matrices and one-hot encoded high-dimensional tabular datasets.',
          drawback: 'Matrix element slicing and in-place updates are computationally slower.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Data Pipeline Engineering: Scikit-Learn ColumnTransformer',
      realWorldScenario:
        'Preprocessing a customer churn dataset containing continuous numerical metrics and categorical service tiers into a unified NumPy matrix for training.',
      inputsSpecs: 'X_raw: pandas DataFrame with continuous and categorical columns; y: binary churn target.',
      outputsSpecs: 'X_processed: float64 NumPy 2D array ready for scikit-learn estimators.',
      keyHyperparameters: [
        { name: 'remainder', type: 'str', defaultVal: "'drop'", role: 'Action for unselected columns ("drop" or "passthrough")' },
        { name: 'sparse_threshold', type: 'float', defaultVal: '0.3', role: 'Outputs scipy sparse matrix if non-zero ratio is below this' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# 1. Raw Tabular Observations
df = pd.DataFrame({
    'sqft': [1450, 980, 2200, 1750],
    'bedrooms': [3, 2, 4, 3],
    'location': ['Downtown', 'Suburbs', 'Downtown', 'Rural'],
    'price': [420, 280, 610, 295]
})

X_raw = df[['sqft', 'bedrooms', 'location']]
y = df['price'].values

# 2. Composable Preprocessing Pipeline
preprocessor = ColumnTransformer(transformers=[
    ('num', StandardScaler(), ['sqft', 'bedrooms']),
    ('cat', OneHotEncoder(drop='first'), ['location'])
])

# 3. Fit on training statistics and transform
X_design = preprocessor.fit_transform(X_raw)
print("Design Matrix Shape:", X_design.shape)  # (4, 4)
print("First row vector:", np.round(X_design[0], 2))`,
      codeExplanation:
        'ColumnTransformer separates numerical features for standardization while encoding categorical strings. Setting drop="first" drops the reference category to prevent collinearity in linear models.',
    },
    tradeoffs: {
      advantages: [
        'Provides unambiguous mathematical contracts between tabular business records and linear algebra operations',
        'Standardization stabilizes condition numbers, speeding up gradient descent convergence by orders of magnitude',
        'Decouples feature engineering from model architecture, enabling modular, reusable preprocessing pipelines',
      ],
      limitations: [
        'One-hot encoding high-cardinality features causes explosive dimensionality growth (Curse of Dimensionality)',
        'Standardization statistics (mean, variance) are sensitive to extreme measurement corruption if not winsorized',
        'Careless preprocessing across whole datasets causes catastrophic data leakage into evaluation splits',
      ],
      fundamentalAssumptions: [
        'Observations (rows) are independent and identically distributed (i.i.d.) draws from the target population',
        'Numerical features are measured on an interval or ratio scale where distance metrics carry semantic meaning',
        'All categories encountered in deployment were observed during the training pipeline fitting phase',
      ],
      failureModes: [
        {
          symptom: 'Linear regression model coefficients explode to +/- 10^12 with singular matrix errors.',
          underlyingReason: 'Dummy variable trap: One-hot encoding all categories without dropping a baseline creates linearly dependent columns (multicollinearity).',
          fix: 'Set drop="first" in OneHotEncoder or apply L2 Ridge regularization to condition the matrix inversion.',
        },
        {
          symptom: 'Model trained on standardized data throws ValueError when fed raw production inputs.',
          underlyingReason: 'Production inference pipeline bypassed the fitted StandardScaler and fed unscaled real-world units directly.',
          fix: 'Serialize the fitted preprocessing pipeline via joblib or scikit-learn Pipeline and deploy as a single immutable artifact.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Algorithms compute numbers, not concepts; all observational data must be vectorized into a design matrix X and target y.',
        'Feature scaling (StandardScaler) is mandatory for distance-based (KNN, K-Means) and gradient-based (Logistic, Neural) models.',
        'Always fit preprocessing parameters strictly on the training partition to prevent evaluation contamination.',
      ],
      misconception: {
        myth: 'Decision trees and Random Forests require standardized features just like linear models.',
        reality:
          'Tree algorithms make orthogonal threshold splits based solely on feature order (rank-invariant). Multiplying a feature by 1000 does not alter tree split points or predictions at all.',
        whyLearnersConfuseIt:
          'StandardScaler is taught as universal best practice, leading beginners to apply it indiscriminately even when algorithms are invariant to monotonic scaling.',
      },
      recallQuestion: {
        id: 'recall-features-1',
        question:
          'Why must StandardScaler parameters (mean mu and standard deviation sigma) be calculated ONLY on the training split, and not the entire dataset?',
        options: [
          'To prevent data leakage: computing statistics on the whole dataset leaks future information about the test distribution into model training.',
          'Because computing mean on the full dataset is mathematically impossible in Python.',
          'Because StandardScaler only supports arrays with fewer than 1000 rows.',
          'Because test sets always have a standard deviation of zero.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! Calculating mean and standard deviation across the full dataset allows test set properties to bleed into feature scaling. This violates the out-of-sample assumption and yields over-optimistic test performance.',
      },
      nextConcept: {
        id: 'train-test-validation',
        title: 'Train, Validation & Test Splits',
        whyNext:
          'Now that you understand design matrices, learn how to partition data into disjoint sets to safeguard generalization and prevent leakage.',
      },
      challenge: {
        title: 'Tabular Vectorization & Dummy Variable Audit',
        goldenTriad: {
          whatIsIt: 'Transforming real-world observations into structured numerical design matrices X in R^(n x d) and target vectors y in R^n.',
          whyDoesItWork: 'Converts qualitative phenomena into metric spaces where distance, slope, and gradient optimization can be computed algebraically.',
          whenToUseIt: 'The mandatory foundation stage of every machine learning project before model fitting.',
        },
        taskInstruction:
          'In the Feature Matrix Bench, toggle between "01. RAW TABULAR", "02. ONE-HOT ENCODED", and "03. STANDARDIZED (Z-SCORE)". Notice how the dimensionality D expands from 3 to 5, and how continuous variables are centered around 0.',
        hint: 'Examine the values in the location columns when One-Hot is selected: each location receives its own independent orthogonal indicator.',
        solutionExplanation:
          'Linear and distance-based algorithms cannot process raw strings like "Downtown". One-hot encoding creates orthogonal binary axes. Furthermore, standardization prevents Area (1450) from dominating Bedrooms (3) by a factor of 500 in gradient updates.',
      },
    },
  },

  // =========================================================================
  // 02 // TRAIN, VALIDATION & TEST SPLITS
  // =========================================================================
  'train-test-validation': {
    id: 'train-test-validation',
    title: 'Train, Validation & Test Splits',
    subtitle: 'Safeguarding out-of-sample generalization and preventing data leakage.',
    eyebrow: '00 // ML FOUNDATIONS',
    category: 'ML Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    prerequisites: ['Features, Labels & Datasets'],
    nextConceptId: 'loss-functions',
    colorAccent: 'amber',
    tags: ['Cross-Validation', 'Data Leakage', 'Generalization', 'Stratification', 'Evaluation'],
    nutshell: {
      definition:
        'A rigorous methodology of partitioning an observational dataset into three strictly disjoint subsets: Training (for parameter fitting), Validation (for model tuning and selection), and Test (for final unbiased evaluation).',
      whyExists:
        'Machine learning models can easily memorize noise and idiosyncratic artifacts in training data. Evaluating a model on the data it trained on yields over-optimistic assessments that collapse when deployed into production.',
      problemSolved:
        'Provides an unbiased estimate of model generalization performance on previously unseen data distributions, exposing overfitting before deployment.',
      primaryFormula: {
        latex: '\\mathcal{D} = \\mathcal{D}_{\\text{train}} \\cup \\mathcal{D}_{\\text{val}} \\cup \\mathcal{D}_{\\text{test}}, \\quad \\mathcal{D}_i \\cap \\mathcal{D}_j = \\emptyset',
        label: 'DISJOINT PARTITION CONSTRAINT',
        explanation: 'The subsets must have zero intersection to guarantee complete isolation of test knowledge.',
      },
      keyCharacteristics: [
        'Training Set (~60-80%): Used exclusively by optimization algorithms to fit weights and parameters',
        'Validation Set (~10-20%): Used to tune hyperparameters, select model architectures, and detect early stopping',
        'Test Set (~10-20%): Locked away until the final audit; touched only once to measure true generalization',
      ],
    },
    howItWorks: {
      headline: 'The 4 Rules of Rigorous Scientific Data Partitioning',
      steps: [
        {
          stepNumber: 1,
          title: 'Establish Strict Temporal or Spatial Isolation',
          description:
            'Determine the partitioning axis. For time-series, use forward temporal splits; for tabular data, use stratified random splits.',
          mathDetail: 't_{\\text{train}} < t_{\\text{val}} < t_{\\text{test}}',
          diagramNote: 'Never shuffle time-series randomly; doing so leaks future information into past predictions.',
        },
        {
          stepNumber: 2,
          title: 'Execute Stratified Sampling for Imbalanced Classes',
          description:
            'Guarantee that the target class distribution (e.g. 95% negative, 5% rare disease) is preserved identically across train, val, and test partitions.',
          mathDetail: 'P(y = c \\mid \\mathcal{D}_{\\text{train}}) = P(y = c \\mid \\mathcal{D}_{\\text{test}})',
          diagramNote: 'Random shuffling on rare classes risks starving the test set of positive cases.',
        },
        {
          stepNumber: 3,
          title: 'Fit Preprocessors Exclusively on Training Data',
          description:
            'Fit scalers, imputers, and encoders solely on D_train. Transform D_val and D_test using the frozen training parameters.',
          mathDetail: '\\mu = \\mu_{\\text{train}}, \\quad \\sigma = \\sigma_{\\text{train}}',
          diagramNote: 'Any calculation using test labels or features during preprocessing is data leakage.',
        },
        {
          stepNumber: 4,
          title: 'Audit the Generalization Gap',
          description:
            'Compare performance metrics across subsets: Generalization Gap = Error(test) - Error(train). A large gap indicates memorization (high variance).',
          mathDetail: '\\Delta_{\\text{gen}} = \\mathcal{L}(\\mathcal{D}_{\\text{test}}) - \\mathcal{L}(\\mathcal{D}_{\\text{train}})',
          diagramNote: 'Near zero gap with low error indicates optimal model generalization.',
        },
      ],
      coreLoopSummary:
        'Partition Data -> Stratified Split -> Fit Pipeline on Train Only -> Tune on Val -> Final Unbiased Test Audit.',
    },
    visualExample: {
      scenarioTitle: 'Rare Disease Diagnosis: The Perils of Random vs Stratified Splitting',
      relatableScenario:
        'In a clinical dataset of 20 patients where only 4 have a rare disease (20%), a random shuffle can accidentally leave zero positive cases in the test set. Explore how stratified partitioning preserves balance, and witness how data leakage inflates reported test metrics.',
      inputsDescription: '20 patient cases: 16 healthy (0) and 4 rare disease (1).',
      intermediateDescription: 'Interactive split ratio slider (50% to 90%) and Stratified vs Random sampling toggle.',
      outputDescription: 'Class balance verification bars and Honest vs Leaked accuracy comparison meter.',
      interactiveType: 'train-test-validation',
    },
    variants: {
      summary: 'Resampling and partitioning methodologies for diverse dataset scales and topologies.',
      variants: [
        {
          id: 'k-fold-cv',
          name: 'K-Fold Cross-Validation',
          tag: 'Gold Standard (Tabular)',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'Partitions training data into K equal folds, iteratively training on K-1 folds and validating on the remaining fold K times.',
          idealUseCase: 'Small to medium datasets (< 100k samples) where a single train/test split has high sampling variance.',
          drawback: 'Computationally expensive: multiplies training time by K.',
        },
        {
          id: 'time-series-split',
          name: 'Expanding Window Time-Series Split',
          tag: 'Temporal Geometry',
          badgeVariant: 'amber',
          howItDiffers:
            'Trains strictly on historical observations [0, t] and tests on future window [t+1, t+k], rolling forward progressively.',
          idealUseCase: 'Financial market prediction, demand forecasting, and weather models with autocorrelation.',
          drawback: 'Older folds train on smaller subsets of data than later folds.',
        },
        {
          id: 'grouped-split',
          name: 'GroupKFold / Leave-One-Group-Out',
          tag: 'Clustered Observations',
          badgeVariant: 'sage',
          howItDiffers:
            'Ensures all observations belonging to the same entity (e.g. all medical scans from patient #402) remain in the same partition.',
          idealUseCase: 'Healthcare, audio recording, and multi-session user telemetry where samples from the same subject correlate.',
          drawback: 'Cannot guarantee perfectly balanced fold sample sizes if group sizes vary widely.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Production ML Pipeline: Leak-Free Cross-Validation',
      realWorldScenario:
        'Validating a loan default classifier with 5-fold stratified cross-validation wrapped inside an automated scikit-learn Pipeline.',
      inputsSpecs: 'X: (n, d) tabular feature matrix; y: binary loan default target vector.',
      outputsSpecs: 'scores: array of out-of-fold ROC-AUC scores; mean and standard error.',
      keyHyperparameters: [
        { name: 'n_splits', type: 'int', defaultVal: '5', role: 'Number of cross-validation folds' },
        { name: 'shuffle', type: 'bool', defaultVal: 'True', role: 'Shuffles records before fold partitioning' },
        { name: 'random_state', type: 'int', defaultVal: '42', role: 'Ensures deterministic reproducibility of splits' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# 1. Synthetic imbalanced data (100 samples, 10% positive)
np.random.seed(42)
X = np.random.randn(100, 5)
y = (np.random.rand(100) < 0.10).astype(int)

# 2. Encapsulate Preprocessing INSIDE Pipeline to prevent leakage
# Scaler is re-fit independently on each fold's training portion
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression())
])

# 3. Stratified 5-Fold Partitioning
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# 4. Out-of-fold scoring
scores = cross_val_score(pipeline, X, y, cv=cv, scoring='roc_auc')
print(f"5-Fold ROC-AUC: {np.mean(scores):.3f} +/- {np.std(scores):.3f}")`,
      codeExplanation:
        'Wrapping StandardScaler inside Pipeline ensures that fit_transform runs strictly on the K-1 training folds for every iteration, eliminating data leakage into the validation fold.',
    },
    tradeoffs: {
      advantages: [
        'Provides statistically grounded confidence intervals for expected generalization performance in production',
        'Exposes overfitting and high variance early in the model development cycle before deployment',
        'Stratification guarantees consistent representation of minority classes across small datasets',
      ],
      limitations: [
        'Reduces the total volume of data available for model parameter fitting (sacrificing 20-30% for eval)',
        'Can give false confidence if deployment data undergoes covariate shift or out-of-distribution drift',
        'K-Fold Cross-Validation scales computational cost and energy consumption linearly with K',
      ],
      fundamentalAssumptions: [
        'The training and testing partitions are drawn from the exact same underlying probability distribution P(X, y)',
        'No duplicate, near-duplicate, or identical subject records cross the partition boundary',
        'In time-series settings, observations must maintain strict chronological arrow of time',
      ],
      failureModes: [
        {
          symptom: 'Model achieves 99% test accuracy in validation, but plummets to 61% accuracy upon live deployment.',
          underlyingReason: 'Data leakage: Feature engineering (e.g. target encoding, imputation, scaling) was fitted on the entire dataset prior to splitting.',
          fix: 'Reconstruct workflow into a scikit-learn Pipeline where all transformations are fit strictly within each fold.',
        },
        {
          symptom: 'Test set contains zero positive instances in an anomaly detection project; model evaluation crashes with NaN.',
          underlyingReason: 'Random split was applied to a severely imbalanced dataset without stratification.',
          fix: 'Replace train_test_split(shuffle=True) with StratifiedKFold or train_test_split(stratify=y).',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Never evaluate a model on the data it trained on; training error measures memorization, not learning.',
        'Use Stratified K-Fold for tabular data to guarantee equal class proportions across all validation slices.',
        'Always wrap feature transformations inside a Pipeline so test fold statistics never leak into preprocessing.',
      ],
      misconception: {
        myth: 'Once a model achieves great test set accuracy, you can safely deploy it without ongoing monitoring.',
        reality:
          'Test set performance is valid only as long as real-world inputs follow the original distribution. Data drift and concept drift inevitably degrade performance over time.',
        whyLearnersConfuseIt:
          'Static academic benchmark datasets never change, creating the false illusion that machine learning models remain accurate permanently without recalibration.',
      },
      recallQuestion: {
        id: 'recall-splits-1',
        question:
          'What happens if you scale your entire dataset with StandardScaler BEFORE running train_test_split?',
        options: [
          'Information from the test set (mean and variance) leaks into the training data, producing an artificially optimistic evaluation score.',
          'The model will fail to train because StandardScaler only works on split data.',
          'It improves model accuracy by making the test set easier to predict in production.',
          'It has zero mathematical impact because mean and variance are scale-invariant.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! Fitting a scaler on all data computes the global mean and variance, which leaks information about the test distribution into the training set. This is subtle data leakage that inflates validation metrics.',
      },
      nextConcept: {
        id: 'loss-functions',
        title: 'Loss Functions & Objectives',
        whyNext:
          'Now that your evaluation splits are isolated, explore how loss functions mathematically penalize prediction errors during training.',
      },
      challenge: {
        title: 'Data Leakage and Rare Class Starvation Audit',
        goldenTriad: {
          whatIsIt: 'Partitioning data into strictly isolated train, validation, and test sets to measure unbiased generalization.',
          whyDoesItWork: 'Exposes memorization (overfitting) by auditing models on samples they never encountered during parameter estimation.',
          whenToUseIt: 'Every supervised and unsupervised machine learning workflow without exception.',
        },
        taskInstruction:
          'In the Data Splitting Bench, switch from "STRATIFIED" to "RANDOM" and click the refresh button several times. Observe how random splits can starve the test set of positive disease cases, and check the "LEAKAGE SIMULATED" box to see how leakage inflates reported accuracy.',
        hint: 'Watch the "TEST SET" panel: when positive count drops to 0, the model cannot be evaluated on rare disease sensitivity.',
        solutionExplanation:
          'On imbalanced datasets, random sampling introduces high partition variance. Stratified sampling guarantees that every fold contains the true 20% minority class proportion. Simulating data leakage demonstrates how leaking test statistics artificially inflates reported accuracy from 84.2% to 96.5%.',
      },
    },
  },

  // =========================================================================
  // 03 // LOSS FUNCTIONS & OBJECTIVES
  // =========================================================================
  'loss-functions': {
    id: 'loss-functions',
    title: 'Loss Functions & Objectives',
    subtitle: 'Quantifying discrepancy: MSE, MAE, Huber, and Cross-Entropy.',
    eyebrow: '02 // OPTIMIZATION & LOSS',
    category: 'Optimization',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Features, Labels & Datasets', 'Derivatives'],
    nextConceptId: 'gradient-descent',
    colorAccent: 'vermilion',
    tags: ['MSE', 'MAE', 'Huber Loss', 'Cross-Entropy', 'Cost Function', 'Convexity'],
    nutshell: {
      definition:
        'A mathematical scalar function that maps model predictions and true targets into a non-negative penalty value, defining the geometric cost landscape that optimization algorithms navigate.',
      whyExists:
        'Machines have no human intuition of "good" or "bad" predictions. They require an unambiguous, differentiable scalar objective function that mathematically quantifies error magnitude and provides gradients for parameter adjustment.',
      problemSolved:
        'Transforms qualitative predictive error into a smooth mathematical surface where the global minimum corresponds to the optimal model hypothesis.',
      primaryFormula: {
        latex: '\\mathcal{L}_{\\text{MSE}} = \\frac{1}{2}(y - \\hat{y})^2, \\quad \\mathcal{L}_{\\text{BCE}} = -\\left[ y \\ln \\hat{p} + (1 - y) \\ln(1 - \\hat{p}) \\right]',
        label: 'CANONICAL REGRESSION & CLASSIFICATION LOSSES',
        explanation: 'MSE penalizes continuous Euclidean errors quadratically; BCE penalizes confident misclassifications logarithmically.',
      },
      keyCharacteristics: [
        'Convexity: Guarantees that any local minimum is a global minimum for linear parameterizations',
        'Differentiability: Provides analytical gradients nabla_w L that guide gradient descent steps',
        'Domain Sensitivity: MSE assumes Gaussian noise; MAE assumes Laplacian noise; Cross-Entropy assumes Bernoulli/Multinomial distributions',
      ],
    },
    howItWorks: {
      headline: 'How Objective Functions Steer Machine Learning in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Compute Residual Discrepancy',
          description:
            'Measure the algebraic difference between observed ground truth y and model prediction y_hat for every sample.',
          mathDetail: 'e^{(i)} = y^{(i)} - \\hat{y}^{(i)}',
          diagramNote: 'Vertical signed distance in regression; probability delta in classification.',
        },
        {
          stepNumber: 2,
          title: 'Apply Penalty Curvature',
          description:
            'Pass the residual through the loss function. Squared error penalizes large mistakes quadratically; absolute error penalizes linearly.',
          mathDetail: 'L_2(e) = e^2, \\quad L_1(e) = |e|',
          diagramNote: 'MSE turns an error of 4 into a penalty of 16; MAE gives a penalty of 4.',
        },
        {
          stepNumber: 3,
          title: 'Compute Gradient Vector',
          description:
            'Calculate the first partial derivatives with respect to model parameters. The gradient points in the direction of steepest loss ascent.',
          mathDetail: '\\nabla_{\\mathbf{w}} J = \\frac{1}{n} \\sum_{i=1}^n \\frac{\\partial L}{\\partial \\hat{y}^{(i)}} \\nabla_{\\mathbf{w}} \\hat{y}^{(i)}',
          diagramNote: 'MSE gradient is proportional to residual (2e); MAE gradient is constant (+/- 1).',
        },
        {
          stepNumber: 4,
          title: 'Aggregate Global Cost Across Dataset',
          description:
            'Sum or average individual sample losses into the global Empirical Risk objective function J(w) for batch optimization.',
          mathDetail: 'J(\\mathbf{w}) = \\frac{1}{n} \\sum_{i=1}^n \\mathcal{L}(y^{(i)}, f(\\mathbf{x}^{(i)}; \\mathbf{w}))',
          diagramNote: 'Empirical Risk Minimization (ERM) seeks the global minimum of this aggregated surface.',
        },
      ],
      coreLoopSummary:
        'True Target & Prediction -> Compute Error Residual -> Map Through Penalty Geometry -> Calculate Gradients -> Update Weights.',
    },
    visualExample: {
      scenarioTitle: 'Outlier Impact: Quadratic Explosion (MSE) vs Robust Linear Clamping (Huber)',
      relatableScenario:
        'When predicting property values, an anomalous data entry error (e = $3.5k error) generates an MSE penalty of 12.25 with a violent gradient of 7.0, pulling the fitted line off course. Observe how Huber Loss transitions from quadratic to linear, capping gradient influence.',
      inputsDescription: 'Continuous residual error e = y - y_hat in [-4.0, +4.0] with adjustable Huber delta.',
      intermediateDescription: 'Live SVG loss curves comparing Squared Error (L2), Absolute Error (L1), and Huber Loss.',
      outputDescription: 'Exact loss value and first-order gradient derivative at the current residual.',
      interactiveType: 'loss-functions',
    },
    variants: {
      summary: 'Objective functions tailored to noise distributions and target data types.',
      variants: [
        {
          id: 'mse-vs-mae',
          name: 'Mean Squared Error (L2) vs Mean Absolute Error (L1)',
          tag: 'Regression Objectives',
          badgeVariant: 'vermilion',
          howItDiffers:
            'MSE squares errors (smooth parabola, penalizes outliers heavily); MAE takes absolute value (V-shape, robust to outliers).',
          idealUseCase: 'MSE when errors are normally distributed; MAE when data contains wild anomalies or heavy tails.',
          drawback: 'MAE gradient is discontinuous at e=0, preventing simple closed-form normal equations.',
        },
        {
          id: 'huber-loss',
          name: 'Huber Loss (Smooth Robust Regression)',
          tag: 'Hybrid Curvature',
          badgeVariant: 'sage',
          howItDiffers:
            'Acts like MSE for small errors (|e| <= delta) and transitions smoothly to linear MAE for large errors (|e| > delta).',
          idealUseCase: 'Robust linear regression and reinforcement learning (Deep Q-Networks) to stabilize large gradient spikes.',
          drawback: 'Requires tuning an additional hyperparameter: the transition threshold delta.',
        },
        {
          id: 'bce-vs-focal',
          name: 'Binary Cross-Entropy vs Focal Loss',
          tag: 'Classification Objectives',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'BCE penalizes -log(p) uniformly; Focal Loss adds a modulating factor (1-p)^gamma to down-weight easy examples.',
          idealUseCase: 'Focal loss is preferred in dense object detection and extreme class imbalance (e.g. 1 positive per 10,000 negatives).',
          drawback: 'Focal loss introduces two sensitive hyperparameters (gamma and alpha).',
        },
      ],
    },
    implementation: {
      industryTitle: 'Custom Robust Objective: NumPy & Scikit-Learn HuberRegressor',
      realWorldScenario:
        'Fitting a robust continuous regression model on financial trade execution slippage containing extreme outlier spikes.',
      inputsSpecs: 'X: (n, d) feature array; y: observed trade slippage in basis points.',
      outputsSpecs: 'model: fitted HuberRegressor parameters resistant to outlier distortion.',
      keyHyperparameters: [
        { name: 'epsilon', type: 'float', defaultVal: '1.35', role: 'Threshold delta for switching from quadratic to linear loss' },
        { name: 'alpha', type: 'float', defaultVal: '0.0001', role: 'L2 regularization penalty parameter' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.linear_model import HuberRegressor, LinearRegression

# 1. Dataset with an extreme measurement outlier
np.random.seed(42)
X = np.linspace(1, 10, 10).reshape(-1, 1)
y = 2.0 * X.ravel() + np.random.normal(0, 0.5, 10)
y[8] = 45.0  # Massive corrupt outlier at index 8!

# 2. Fit standard OLS (MSE objective)
ols = LinearRegression().fit(X, y)

# 3. Fit Robust Huber Regression (Huber loss objective)
# epsilon=1.35 achieves 95% statistical efficiency on Gaussian data
huber = HuberRegressor(epsilon=1.35).fit(X, y)

print("True slope: 2.00")
print(f"OLS Slope (MSE distorted):   {ols.coef_[0]:.2f}")
print(f"Huber Slope (Outlier robust): {huber.coef_[0]:.2f}")`,
      codeExplanation:
        'Standard OLS squares the outlier error (45 - 18)^2 = 729, pulling the regression slope toward the outlier. HuberRegressor clamps large residual gradients, recovering a near-perfect slope of 2.0.',
    },
    tradeoffs: {
      advantages: [
        'Mathematically connects the optimization problem to Maximum Likelihood Estimation (MLE) under specific noise models',
        'Differentiable convex loss functions guarantee global convergence without getting trapped in local minima',
        'Huber loss provides the statistical efficiency of MSE on normal data with the robustness of MAE on outliers',
      ],
      limitations: [
        'Standard MSE is extremely vulnerable to high-leverage outliers, causing regression lines to tilt unnaturally',
        'Zero-One loss (misclassification count) has zero gradient almost everywhere, making direct gradient optimization impossible',
        'Cross-Entropy loss can cause parameter weights to diverge to infinity on linearly separable data without regularization',
      ],
      fundamentalAssumptions: [
        'The loss function aligns with the real-world utility or financial cost function of the target problem',
        'Residual errors e = y - y_hat are statistically independent across samples',
        'In Cross-Entropy, predicted outputs p are well-calibrated probabilities in [0, 1]',
      ],
      failureModes: [
        {
          symptom: 'Model weights explode to NaN during gradient descent training on a tabular regression dataset.',
          underlyingReason: 'MSE squared error on unnormalized target values produced massive residuals e = 10,000, creating gradients of 20,000 that blew up parameter updates.',
          fix: 'Standardize the target variable y or clip gradients, or switch to Huber loss with bounded gradient magnitude.',
        },
        {
          symptom: 'Logistic regression model exhibits complete parameter divergence (+/- infinity) on clean benchmark data.',
          underlyingReason: 'Data is perfectly linearly separable; Cross-Entropy loss drives weights to infinity trying to output predicted probability 1.000.',
          fix: 'Apply L2 regularization (Ridge penalty) to constrain weight norms.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Loss functions are the steering wheel of machine learning; they define the landscape that gradients navigate.',
        'MSE assumes Gaussian noise and is sensitive to outliers; MAE and Huber are robust to heavy-tailed noise.',
        'Classification requires Cross-Entropy (Log Loss) because 0-1 error has zero gradient everywhere.',
      ],
      misconception: {
        myth: 'You should always train classification models by directly minimizing the misclassification error rate.',
        reality:
          'Misclassification error (0-1 loss) is a flat step function: its derivative is zero everywhere and undefined at the threshold. Gradient descent cannot take steps on a flat surface; smooth Cross-Entropy is mandatory.',
        whyLearnersConfuseIt:
          'Learners evaluate classification using Accuracy (which is 1 - 0-1 error), assuming the model trained on the exact same metric.',
      },
      recallQuestion: {
        id: 'recall-loss-1',
        question:
          'Why does Huber loss perform better than Mean Squared Error (MSE) when training on datasets with extreme outliers?',
        options: [
          'Because for large errors (|e| > delta), Huber loss transitions to a linear penalty, capping the gradient magnitude at delta.',
          'Because Huber loss sets all errors to zero automatically.',
          'Because Huber loss only works with decision trees, which ignore outliers.',
          'Because Huber loss squares errors twice to punish outliers even harder.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! For residuals exceeding delta, Huber loss grows linearly instead of quadratically. Its gradient is bounded by +/- delta, preventing single outlier points from dominating model parameter updates.',
      },
      nextConcept: {
        id: 'gradient-descent',
        title: 'Gradient Descent',
        whyNext:
          'Now that you understand loss landscapes and gradients, explore how Gradient Descent uses these derivatives to march toward optimal parameters.',
      },
      challenge: {
        title: 'Outlier Gradient Explosion Audit',
        goldenTriad: {
          whatIsIt: 'Differentiable mathematical penalty function measuring discrepancy between true targets and model predictions.',
          whyDoesItWork: 'Creates a convex cost landscape where negative gradients guide parameters monotonically toward optimal solutions.',
          whenToUseIt: 'Every machine learning model: MSE for Gaussian regression, Huber for outliers, Cross-Entropy for classification.',
        },
        taskInstruction:
          'In the Loss Bench, click "SIMULATE OUTLIER ($e=3.5$)". Compare the MSE Gradient against the Huber Gradient and MAE Gradient.',
        hint: 'Observe the numerical gradient values: MSE gradient explodes to 7.00, while Huber gradient remains strictly capped at 1.00.',
        solutionExplanation:
          'Because MSE squares the residual (e^2), its gradient is 2e. An error of 3.5 creates an enormous gradient of 7.0 that drags the model parameters toward the outlier. Huber loss clamps the gradient at +/- delta, protecting model parameters from corruption.',
      },
    },
  },

  // =========================================================================
  // 04 // BIAS-VARIANCE TRADEOFF
  // =========================================================================
  'bias-variance-tradeoff': {
    id: 'bias-variance-tradeoff',
    title: 'The Bias-Variance Tradeoff',
    subtitle: 'Balancing underfitting and overfitting in model generalization error.',
    eyebrow: '00 // ML FOUNDATIONS',
    category: 'ML Foundations',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Features, Labels & Datasets', 'Loss Functions'],
    nextConceptId: 'evaluation-metrics',
    colorAccent: 'plum',
    tags: ['Overfitting', 'Underfitting', 'Model Capacity', 'Generalization', 'Decomposition'],
    nutshell: {
      definition:
        'The foundational theorem of supervised learning stating that expected generalization error decomposes into three additive components: squared Bias (erroneous model assumptions), Variance (sensitivity to training data fluctuations), and irreducible Noise.',
      whyExists:
        'Increasing model complexity allows an algorithm to fit complex non-linear patterns, but simultaneously increases its vulnerability to memorizing random sample noise. We need a mathematical framework to find the optimal capacity sweet spot.',
      problemSolved:
        'Explains why training error continuously decreases as models grow more complex, while out-of-sample test error forms a U-shaped curve that explodes when capacity is too high.',
      primaryFormula: {
        latex: '\\mathbb{E}\\left[(y - \\hat{f}(x))^2\\right] = \\underbrace{\\text{Bias}^2(\\hat{f}(x))}_{\\text{Underfitting}} + \\underbrace{\\text{Var}(\\hat{f}(x))}_{\\text{Overfitting}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Noise}}',
        label: 'MSE ERROR DECOMPOSITION',
        explanation: 'Bias measures systematic error of simplifying assumptions; Variance measures prediction instability across different training draws.',
      },
      keyCharacteristics: [
        'Underfitting (High Bias, Low Variance): Model is too simple to capture true underlying structure (e.g. linear model on sine wave)',
        'Overfitting (Low Bias, High Variance): Model is excessively flexible and memorizes noise fluctuations (e.g. 9th degree polynomial)',
        'Sweet Spot: Intermediate model capacity that minimizes the sum of Bias^2 and Variance on unseen test data',
      ],
    },
    howItWorks: {
      headline: 'The Mechanics of Model Generalization Error in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Establish the Data Generating Process',
          description:
            'Assume true targets are generated by y = f(x) + epsilon, where epsilon is zero-mean irreducible measurement noise with variance sigma^2.',
          mathDetail: 'y = f(x) + \\epsilon, \\quad \\mathbb{E}[\\epsilon] = 0, \\quad \\text{Var}(\\epsilon) = \\sigma^2',
          diagramNote: 'No algorithm can ever achieve an expected test error below sigma^2.',
        },
        {
          stepNumber: 2,
          title: 'Estimate the Hypothesis Across Datasets',
          description:
            'Imagine training the model repeatedly on different random training sample draws D. The expected model hypothesis is E[f_hat(x)].',
          mathDetail: '\\bar{f}(x) = \\mathbb{E}_{\\mathcal{D}}[\\hat{f}(x; \\mathcal{D})]',
          diagramNote: 'Averaging infinite models reveals the intrinsic structural bias of the algorithm.',
        },
        {
          stepNumber: 3,
          title: 'Decompose the Expected Test Error',
          description:
            'Expanding the squared difference reveals that cross-terms cancel to zero, leaving three distinct non-negative components.',
          mathDetail: '\\mathbb{E}[(y - \\hat{f})^2] = (f(x) - \\bar{f}(x))^2 + \\mathbb{E}[(\\hat{f}(x) - \\bar{f}(x))^2] + \\sigma^2',
          diagramNote: 'Term 1 is Bias^2; Term 2 is Variance; Term 3 is irreducible variance.',
        },
        {
          stepNumber: 4,
          title: 'Navigate the U-Shaped Test Error Curve',
          description:
            'As model capacity d increases, Bias^2 monotonically drops toward zero while Variance monotonically rises. The minimum test error lies at the trough.',
          mathDetail: 'd^* = \\arg\\min_d \\left( \\text{Bias}^2(d) + \\text{Var}(d) \\right)',
          diagramNote: 'Training error keeps dropping to 0, completely blind to the exploding test error.',
        },
      ],
      coreLoopSummary:
        'Increase Capacity -> Bias Decreases -> Variance Increases -> Test Error Reaches Minimum -> Past Sweet Spot, Overfitting Explodes.',
    },
    visualExample: {
      scenarioTitle: 'Polynomial Curve Fitting: From Rigid Line (d=1) to Wild Oscillation (d=9)',
      relatableScenario:
        'Fitting a sine wave manifold f(x) = sin(pi * x) with 8 noisy points. A linear model (d=1) underfits with high bias. A cubic model (d=3) captures the true curve. A 9th-degree polynomial (d=9) interpolates every noisy point perfectly (Train MSE = 0), but oscillates wildly on unseen test points (Test MSE explodes).',
      inputsDescription: '8 training points (Sage circles) and 6 test points (Vermilion squares) sampled from sin(pi * x).',
      intermediateDescription: 'Interactive polynomial degree selector d in {1, 2, 3, 5, 9}.',
      outputDescription: 'Live curves, Train MSE, Test MSE, estimated Bias^2, Variance, and status badge.',
      interactiveType: 'bias-variance-tradeoff',
    },
    variants: {
      summary: 'Strategies for controlling capacity and balancing bias and variance.',
      variants: [
        {
          id: 'regularization-control',
          name: 'Shrinkage Regularization (L1 / L2)',
          tag: 'Variance Reducer',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'Keeps model architecture flexible but adds an explicit penalty lambda * ||w|| to constrain parameter magnitudes.',
          idealUseCase: 'High-dimensional linear models, neural networks, and spline regressions to prevent overfitting.',
          drawback: 'Slightly increases bias in exchange for a dramatic reduction in variance.',
        },
        {
          id: 'ensemble-averaging',
          name: 'Bagging & Random Forests',
          tag: 'Pure Variance Reducer',
          badgeVariant: 'sage',
          howItDiffers:
            'Trains multiple high-capacity models (deep trees) on bootstrap resamples and averages their predictions.',
          idealUseCase: 'High-variance algorithms (unpruned decision trees) where averaging reduces variance by factor 1/M without increasing bias.',
          drawback: 'Increases computational memory and training time proportionally with tree count.',
        },
        {
          id: 'boosting-bias',
          name: 'Boosting (AdaBoost / Gradient Boosting)',
          tag: 'Pure Bias Reducer',
          badgeVariant: 'vermilion',
          howItDiffers:
            'Sequentially trains shallow weak learners (stumps), each fitting the residuals of previous models.',
          idealUseCase: 'Underfitting tabular models that require higher expressive power and complex decision boundaries.',
          drawback: 'Can overfit (increase variance) if number of boosting iterations is tuned too high.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Model Selection: Polynomial Features & Validation Curves in Scikit-Learn',
      realWorldScenario:
        'Auditing learning curves on a manufacturing sensor calibration dataset to diagnose whether a predictive model suffers from high bias or high variance.',
      inputsSpecs: 'X_train, y_train, X_val, y_val: split continuous sensor telemetry arrays.',
      outputsSpecs: 'validation_curve: train and test score matrix across polynomial degrees 1 to 10.',
      keyHyperparameters: [
        { name: 'degree', type: 'int', defaultVal: '3', role: 'Maximum polynomial exponent in feature expansion' },
        { name: 'alpha', type: 'float', defaultVal: '1.0', role: 'Ridge L2 penalty strength to suppress variance' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# 1. Generate noisy sine wave dataset
np.random.seed(42)
x_train = np.sort(np.random.uniform(-1, 1, 12))
y_train = np.sin(np.pi * x_train) + np.random.normal(0, 0.15, 12)
x_test = np.sort(np.random.uniform(-1, 1, 30))
y_test = np.sin(np.pi * x_test) + np.random.normal(0, 0.15, 30)

# 2. Compare Degrees: 1 (Underfit), 3 (Optimal), 9 (Overfit)
for d in [1, 3, 9]:
    model = make_pipeline(PolynomialFeatures(degree=d), LinearRegression())
    model.fit(x_train[:, None], y_train)
    
    train_err = mean_squared_error(y_train, model.predict(x_train[:, None]))
    test_err = mean_squared_error(y_test, model.predict(x_test[:, None]))
    
    print(f"Degree {d} -> Train MSE: {train_err:.4f} | Test MSE: {test_err:.4f}")`,
      codeExplanation:
        'Degree 1 yields high train and test error (underfit). Degree 9 yields near-zero train error (0.001) but test error explodes (1.45+). Degree 3 hits the sweet spot with balanced, minimal test error.',
    },
    tradeoffs: {
      advantages: [
        'Provides an intuitive diagnostic framework: diagnose error type to choose the exact engineering remedy',
        'Guides hyperparameter tuning: tells you whether to add features (decrease bias) or add regularization (decrease variance)',
        'Mathematically proves that zero training error is not the goal of machine learning',
      ],
      limitations: [
        'Bias, Variance, and Irreducible Noise cannot be measured exactly in real-world applications (true f(x) is unknown)',
        'In deep learning, the "Double Descent" phenomenon shows test error can decrease again at extreme overparameterization',
        'Reducing bias almost always increases variance, requiring deliberate engineering compromises',
      ],
      fundamentalAssumptions: [
        'The loss function is squared Euclidean error (the exact additive decomposition applies strictly to MSE)',
        'The data contains a fixed, non-zero irreducible error term sigma^2 that no model can eliminate',
        'Training samples are randomly drawn from a stationary data distribution',
      ],
      failureModes: [
        {
          symptom: 'Engineer keeps collecting more training data to fix a high-bias model, but test accuracy never improves.',
          underlyingReason: 'High bias stems from model assumption defects (e.g. linear model on non-linear data). More data does not increase model expressive capacity.',
          fix: 'Increase model complexity: add non-linear polynomial features, tree depth, or switch to a more flexible model family.',
        },
        {
          symptom: 'Model achieves 99.8% accuracy on training data, but crashes to 58% on new production transactions.',
          underlyingReason: 'High variance / overfitting: model has too many parameters relative to sample count and memorized training noise.',
          fix: 'Collect more training data, prune features, decrease model capacity, or introduce L1/L2 regularization.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Expected test error = Bias^2 (underfitting) + Variance (overfitting) + Irreducible noise.',
        'High bias is solved by increasing model capacity; high variance is solved by adding data or regularization.',
        'Never judge a model by training error alone; minimum test error lies at the intermediate capacity sweet spot.',
      ],
      misconception: {
        myth: 'A model with zero training error is a perfect machine learning model.',
        reality:
          'Zero training error on complex real-world data is almost always evidence of severe overfitting and noise memorization. It predicts terrible performance on unseen test data.',
        whyLearnersConfuseIt:
          'In traditional software engineering, 100% test pass rate on unit tests is the goal. In machine learning, fitting 100% of training data memorizes the noise.',
      },
      recallQuestion: {
        id: 'recall-bias-var-1',
        question:
          'If your model has very high training error AND very high validation error, what is the primary diagnosis and correct fix?',
        options: [
          'High Bias (Underfitting); fix by increasing model capacity or engineering more expressive features.',
          'High Variance (Overfitting); fix by adding L2 regularization.',
          'High Variance; fix by removing features.',
          'Data Leakage; fix by shuffling training labels.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! When both training error and validation error are high, the model is too simple to capture the underlying structure (High Bias / Underfitting). The remedy is to increase capacity, add polynomial features, or use a more expressive model.',
      },
      nextConcept: {
        id: 'evaluation-metrics',
        title: 'Evaluation Metrics & Diagnostics',
        whyNext:
          'Now that you understand generalization error, learn how to measure classification performance rigorously using Precision, Recall, and the Confusion Matrix.',
      },
      challenge: {
        title: 'Polynomial Runge Phenomenon & Capacity Sweet Spot',
        goldenTriad: {
          whatIsIt: 'Fundamental theorem proving generalization error decomposes into squared Bias, Variance, and irreducible Noise.',
          whyDoesItWork: 'Exposes the tradeoff between model flexibility (reducing bias) and sensitivity to training sample fluctuations (increasing variance).',
          whenToUseIt: 'Diagnosing model learning curves to decide whether to add features or apply regularization.',
        },
        taskInstruction:
          'In the Model Capacity Bench, click through degrees d=1, d=2, d=3, d=5, and d=9. Observe how Degree 9 achieves near-zero Train Loss while Test Loss explodes violently.',
        hint: 'Examine the fitted curve on d=9: notice how it passes through all green training circles but swings into massive wild oscillations at the boundaries.',
        solutionExplanation:
          'Degree 9 exhibits severe overfitting (High Variance / Runge phenomenon). It memorizes the random noise in the 8 training points, driving train MSE to 0.00, but its test MSE explodes to 1.45+. Degree 3 represents the optimal capacity sweet spot, minimizing total out-of-sample error.',
      },
    },
  },

  // =========================================================================
  // 05 // EVALUATION METRICS & DIAGNOSTICS
  // =========================================================================
  'evaluation-metrics': {
    id: 'evaluation-metrics',
    title: 'Evaluation Metrics & Diagnostics',
    subtitle: 'The Confusion Matrix, Precision, Recall, F1-Score, and ROC-AUC.',
    eyebrow: '00 // ML FOUNDATIONS',
    category: 'ML Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    prerequisites: ['Features, Labels & Datasets', 'Train, Validation & Test Splits'],
    nextConceptId: 'logistic-regression',
    colorAccent: 'sage',
    tags: ['Confusion Matrix', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC', 'Class Imbalance'],
    nutshell: {
      definition:
        'A comprehensive framework of quantitative diagnostic metrics that evaluate classifier performance under asymmetric real-world error costs, moving beyond misleading overall accuracy.',
      whyExists:
        'In imbalanced real-world scenarios (e.g. 99% healthy patients, 1% cancer), a trivial naive model that predicts "Healthy" for everyone achieves 99% accuracy while killing every sick patient. We need metrics that separate true detections from false alarms and missed cases.',
      problemSolved:
        'Decouples predictive performance into four fundamental quadrants (TP, FP, FN, TN), allowing engineers to tune decision thresholds to match specific business and clinical risk tolerances.',
      primaryFormula: {
        latex: '\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}, \\quad F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
        label: 'THE DIAGNOSTIC METRIC TRIAD',
        explanation: 'Precision measures purity of positive alerts; Recall measures completeness of true positive capture; F1 computes their harmonic balance.',
      },
      keyCharacteristics: [
        'Confusion Matrix: The 2x2 contingency table that serves as the arithmetic source of all discrete classification metrics',
        'Precision-Recall Tradeoff: Lowering the decision threshold tau increases Recall (catches more positives) but decreases Precision (more false alarms)',
        'ROC-AUC: Area under the Receiver Operating Characteristic curve measuring threshold-independent ranking ability',
      ],
    },
    howItWorks: {
      headline: 'From Raw Predicted Probabilities to Actionable Decisions in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Establish Continuous Prediction Scores',
          description:
            'The model outputs continuous risk probabilities p in [0, 1] for each observation, rather than hard discrete labels.',
          mathDetail: 'p^{(i)} = P(y = 1 \\mid \\mathbf{x}^{(i)}) \\in [0, 1]',
          diagramNote: 'Scores reflect model confidence before any threshold decision.',
        },
        {
          stepNumber: 2,
          title: 'Apply Decision Threshold tau',
          description:
            'Binarize continuous probabilities into discrete predictions: predict Positive if p >= tau; predict Negative otherwise.',
          mathDetail: '\\hat{y}^{(i)} = \\mathbb{I}(p^{(i)} \\ge \\tau)',
          diagramNote: 'Default tau=0.50 is arbitrary; optimal threshold depends on domain error costs.',
        },
        {
          stepNumber: 3,
          title: 'Construct the 2x2 Contingency Matrix',
          description:
            'Compare predictions against ground truth labels to populate the four fundamental quadrants: TP, FP, FN, and TN.',
          mathDetail: 'N = TP + FP + FN + TN',
          diagramNote: 'FP is Type I Error (False Alarm); FN is Type II Error (Missed Detection).',
        },
        {
          stepNumber: 4,
          title: 'Calculate Domain-Aligned Performance Ratios',
          description:
            'Compute Precision, Recall, Specificity, and F1 to evaluate model readiness against domain risk requirements.',
          mathDetail: '\\text{TPR} = \\frac{TP}{TP + FN}, \\quad \\text{FPR} = \\frac{FP}{TN + FP}',
          diagramNote: 'Plotting TPR vs FPR across all thresholds tau generates the ROC curve.',
        },
      ],
      coreLoopSummary:
        'Predicted Risk Scores -> Apply Threshold tau -> Populate 2x2 Matrix (TP, FP, FN, TN) -> Compute Precision, Recall & F1.',
    },
    visualExample: {
      scenarioTitle: 'Clinical Diagnostic Triage: Tuning Thresholds for Rare Pathology',
      relatableScenario:
        'In a screening cohort of 100 patients with 20 diseased cases, explore how shifting the decision threshold tau from 0.75 (high precision) down to 0.35 (high recall) eliminates lethal False Negatives (FN -> 0), at the acceptable cost of performing follow-up biopsies on a few False Positives.',
      inputsDescription: '100 patient cases (20 Disease, 80 Healthy) with continuous risk scores.',
      intermediateDescription: 'Interactive threshold slider tau in [0.10, 0.90] with scenario presets.',
      outputDescription: 'Live 2x2 Confusion Matrix, Precision, Recall, Specificity, F1, and Raw Accuracy meters.',
      interactiveType: 'evaluation-metrics',
    },
    variants: {
      summary: 'Evaluation frameworks adapted to diverse target topologies and class distributions.',
      variants: [
        {
          id: 'roc-vs-pr',
          name: 'ROC Curve vs Precision-Recall (PR) Curve',
          tag: 'Curve Geometry',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'ROC plots TPR vs FPR; PR curve plots Precision vs Recall. ROC is insensitive to class imbalance; PR curve exposes false alarm degradation under extreme skew.',
          idealUseCase: 'PR curves for fraud detection and rare diseases (< 1% prevalence); ROC curves for balanced binary benchmarks.',
          drawback: 'ROC-AUC can look deceitfully optimistic (0.95+) on highly imbalanced datasets even when precision is disastrous.',
        },
        {
          id: 'f-beta',
          name: 'F-Beta Score (Weighted Asymmetry)',
          tag: 'Metric Weighting',
          badgeVariant: 'amber',
          howItDiffers:
            'Generalizes F1 by weighting recall beta times higher than precision: F_beta = (1 + beta^2) * (P * R) / (beta^2 * P + R).',
          idealUseCase: 'F2 score in medical diagnostics (recalling cancer is 2x more important than false alarms); F0.5 in spam filters.',
          drawback: 'Requires domain consensus on the exact subjective value of beta.',
        },
        {
          id: 'macro-vs-micro',
          name: 'Macro vs Micro vs Weighted Averaging',
          tag: 'Multiclass Aggregation',
          badgeVariant: 'sage',
          howItDiffers:
            'Macro averages metric across classes unweighted (treats rare class equal to common); Micro pools global TP, FP, FN; Weighted weights by class support.',
          idealUseCase: 'Macro-F1 when rare classes are critical; Micro-F1 when overall throughput accuracy dominates.',
          drawback: 'Weighted-F1 can mask total failure on small minority classes.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Scikit-Learn Classification Report & Precision-Recall Thresholding',
      realWorldScenario:
        'Evaluating a credit card fraud detection system with extreme class imbalance (99.8% legitimate, 0.2% fraudulent).',
      inputsSpecs: 'y_true: binary ground truth array; y_probs: continuous predicted fraud probabilities.',
      outputsSpecs: 'classification_report: precision, recall, f1-score; precision_recall_curve arrays.',
      keyHyperparameters: [
        { name: 'threshold', type: 'float', defaultVal: '0.35', role: 'Custom binarization threshold' },
        { name: 'average', type: 'str', defaultVal: "'macro'", role: 'Multiclass aggregation method' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# 1. Realistic test cohort (100 samples, 20 positive)
np.random.seed(42)
y_true = np.array([1]*20 + [0]*80)
# Model outputs probabilities (positives higher, with overlap)
y_probs = np.concatenate([
    np.random.normal(0.72, 0.15, 20),
    np.random.normal(0.28, 0.15, 80)
]).clip(0.01, 0.99)

# 2. Select threshold aligned with risk: tau = 0.35 (Prioritize Recall)
threshold = 0.35
y_pred = (y_probs >= threshold).astype(int)

# 3. Audit Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:\\n", cm)
# [[TN, FP], [FN, TP]]

# 4. Generate Comprehensive Diagnostic Report
print("\\n" + classification_report(y_true, y_pred, target_names=['Healthy', 'Disease']))
print(f"ROC-AUC: {roc_auc_score(y_true, y_probs):.3f}")`,
      codeExplanation:
        'Lowering the threshold from 0.50 to 0.35 increases Disease Recall to 95%, ensuring sick patients are not missed, while computing ROC-AUC independently of threshold binarization.',
    },
    tradeoffs: {
      advantages: [
        'Exposes the "Accuracy Paradox": proves why a 99% accurate model can be completely useless in practice',
        'Enables operational threshold tuning: choose your operational operating point along the trade-off curve',
        'Harmonic mean in F1 prevents models from claiming high performance with degenerate 0% recall',
      ],
      limitations: [
        'Precision and Recall cannot be maximized simultaneously; improving one inevitably harms the other',
        'ROC curves can present an overly optimistic impression when negative class samples vastly outnumber positives',
        'Metrics assume all False Positives have equal cost, which may not hold in tiered escalation workflows',
      ],
      fundamentalAssumptions: [
        'Ground truth labels y in the test set are accurate and free from systemic annotation bias',
        'The cost of False Positives and False Negatives is asymmetric and known to the engineering team',
        'Predicted probabilities are sufficiently calibrated to allow meaningful threshold sweeping',
      ],
      failureModes: [
        {
          symptom: 'Fraud model reported 99.7% accuracy during executive presentation, but millions of dollars were lost to fraud in week 1.',
          underlyingReason: 'Accuracy paradox: Fraud comprised 0.3% of transactions. The model simply predicted "Legitimate" for 100% of cases.',
          fix: 'Ban raw Accuracy on imbalanced problems. Evaluate strictly with Precision, Recall, PR-AUC, and financial cost-weighted loss.',
        },
        {
          symptom: 'Autonomous driving safety system triggers phantom emergency braking every 10 miles.',
          underlyingReason: 'Threshold tau was tuned excessively low for 100% recall of obstacles, driving Precision down and causing catastrophic False Positive rates.',
          fix: 'Raise the threshold or combine multi-sensor fusion (camera + LiDAR + radar) to elevate precision without sacrificing recall.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Never evaluate imbalanced classification models with raw accuracy alone.',
        'Precision = TP / (TP + FP) measures purity; Recall = TP / (TP + FN) measures completeness.',
        'Adjust the decision threshold tau to match real-world risk: low threshold for medicine/safety, high threshold for spam.',
      ],
      misconception: {
        myth: 'The decision threshold between Class 0 and Class 1 must always be set at exactly 0.50.',
        reality:
          '0.50 is an arbitrary mathematical convention assuming symmetric costs. In cancer screening or fraud detection, missing a positive (FN) is 100x more costly than a false alarm (FP), requiring thresholds of 0.20 or lower.',
        whyLearnersConfuseIt:
          'Scikit-learn default model.predict() automatically applies tau=0.50 under the hood, teaching beginners to treat 0.50 as an immutable law.',
      },
      recallQuestion: {
        id: 'recall-metrics-1',
        question:
          'In a medical diagnostic system for a fatal contagious disease, which type of error is vastly more catastrophic, and which metric must be maximized?',
        options: [
          'False Negatives (Type II Error); Recall must be maximized.',
          'False Positives (Type I Error); Specificity must be maximized.',
          'False Positives; Accuracy must be maximized.',
          'True Negatives; Log Loss must be maximized.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! A False Negative sends an infected patient home without treatment, leading to fatal outcomes and contagion. In high-stakes medicine, Recall (TP / (TP + FN)) must be maximized to drive False Negatives as close to zero as possible.',
      },
      nextConcept: {
        id: 'knn',
        title: 'K-Nearest Neighbors (KNN)',
        whyNext:
          'Now explore instance-based non-parametric classification, where local spatial proximity determines class assignment.',
      },
      challenge: {
        title: 'Clinical Threshold Tuning & Asymmetry Audit',
        goldenTriad: {
          whatIsIt: 'Diagnostic performance framework decomposing classifier predictions into four quadrants (TP, FP, FN, TN).',
          whyDoesItWork: 'Exposes asymmetric cost trade-offs between false alarms (FP) and missed events (FN) across decision cutoffs.',
          whenToUseIt: 'Every binary and multiclass classification system, especially under class imbalance.',
        },
        taskInstruction:
          'In the Confusion Matrix Bench, click "CANCER (HIGH RECALL)" (tau=0.35) and observe the FN count. Then click "SPAM (HIGH PRECISION)" (tau=0.75) and observe what happens to FP and Recall.',
        hint: 'Notice that at tau=0.35, Recall jumps to 95.0% and FN drops to only 1, while at tau=0.75, Precision hits 100% but Recall collapses.',
        solutionExplanation:
          'Threshold tuning directly controls the operational operating point along the Precision-Recall trade-off curve. Cancer diagnosis requires low thresholds (tau=0.35) to drive False Negatives to near-zero, while spam filters require high thresholds (tau=0.75) to prevent legitimate emails from being falsely quarantined.',
      },
    },
  },

  // =========================================================================
  // 06 // K-NEAREST NEIGHBORS (KNN)
  // =========================================================================
  'knn': {
    id: 'knn',
    title: 'K-Nearest Neighbors (KNN)',
    subtitle: 'Instance-based non-parametric classification via spatial proximity.',
    eyebrow: '01 // SUPERVISED LEARNING',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    prerequisites: ['Features, Labels & Datasets', 'Euclidean Norm'],
    nextConceptId: 'decision-trees',
    colorAccent: 'amber',
    tags: ['Non-Parametric', 'Lazy Learning', 'Metric Spaces', 'Voronoi', 'Classification', 'Regression'],
    nutshell: {
      definition:
        'A non-parametric, instance-based supervised learning algorithm that assigns labels to query points based on the majority class or average value among its K geometrically closest training examples.',
      whyExists:
        'Many real-world phenomena have complex, irregular decision boundaries that cannot be captured by linear equations or rigid parametric models. KNN provides a simple, intuitive solution by memorizing training instances directly.',
      problemSolved:
        'Classifies new queries without assuming any functional form for P(y|x), relying entirely on the local spatial clustering of observations in feature space.',
      primaryFormula: {
        latex: '\\hat{y}(\\mathbf{x}_q) = \\arg\\max_{c} \\sum_{i \\in \\mathcal{N}_K(\\mathbf{x}_q)} \\mathbb{I}(y^{(i)} = c), \\quad d(\\mathbf{x}, \\mathbf{z}) = \\sqrt{\\sum_{j=1}^d (x_j - z_j)^2}',
        label: 'MAJORITY BALLOT & EUCLIDEAN METRIC',
        explanation: 'N_K(x_q) denotes the set of K training samples with the smallest distance to query point x_q.',
      },
      keyCharacteristics: [
        'Lazy Learning: Zero training phase (time complexity O(1) to train); all computation occurs at inference time',
        'Non-Parametric: Makes zero assumptions about underlying data distribution; number of parameters is not fixed',
        'Metric Sensitive: Requires feature normalization; distances in unscaled spaces are distorted by high-variance features',
      ],
    },
    howItWorks: {
      headline: 'From Query Coordinates to Majority Ballot in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Store Normalized Training Instances',
          description:
            'Store the entire training dataset in memory (or build a KD-Tree/Ball-Tree indexing structure) after feature standardization.',
          mathDetail: '\\mathcal{D} = \\{(\\mathbf{x}^{(1)}, y^{(1)}), \\dots, (\\mathbf{x}^{(n)}, y^{(n)})\\}',
          diagramNote: 'No weights w or bias b are fitted during training.',
        },
        {
          stepNumber: 2,
          title: 'Compute Pairwise Distances to Query',
          description:
            'When a new query point x_q arrives, compute its distance to all n points in the training set using Euclidean (L2) or Manhattan (L1) norm.',
          mathDetail: 'd_i = \\|\\mathbf{x}_q - \\mathbf{x}^{(i)}\\|_2 = \\sqrt{(\\mathbf{x}_q - \\mathbf{x}^{(i)})^T (\\mathbf{x}_q - \\mathbf{x}^{(i)})}',
          diagramNote: 'Linear scan takes O(n * d) operations without spatial indexing.',
        },
        {
          stepNumber: 3,
          title: 'Select K-Nearest Neighbors',
          description:
            'Sort distances in ascending order and select the indices of the K smallest distance observations.',
          mathDetail: '\\mathcal{N}_K(\\mathbf{x}_q) = \\{i_1, i_2, \\dots, i_K\\}',
          diagramNote: 'Odd values of K (e.g. 3, 5, 7) avoid ties in binary classification.',
        },
        {
          stepNumber: 4,
          title: 'Execute Majority Vote or Distance Weighting',
          description:
            'Tally the class labels among the K neighbors. The class with the highest vote count is returned as the final prediction.',
          mathDetail: 'P(y = c \\mid \\mathbf{x}_q) = \\frac{1}{K} \\sum_{i \\in \\mathcal{N}_K} \\mathbb{I}(y^{(i)} = c)',
          diagramNote: 'Optional weighting: give closer neighbors higher vote weight w_i = 1 / d_i.',
        },
      ],
      coreLoopSummary:
        'Receive Query x_q -> Calculate Distances to All Training Points -> Identify K Nearest Neighbors -> Tally Ballot -> Return Majority Class.',
    },
    visualExample: {
      scenarioTitle: 'Spatial Balloting: Filtering Noise Outliers with K=1 vs K=5',
      relatableScenario:
        'Observe an isolated Class A outlier situated deep inside Class B territory. With K=1, a query placed near the outlier is incorrectly classified as Class A (overfitting to noise). Increasing K to 5 aggregates local neighborhood density, allowing surrounding Class B points to outvote the outlier (robust generalization).',
      inputsDescription: '18 labeled points (Class A Vermilion circles, Class B Ultramarine squares) on a 100x100 plane.',
      intermediateDescription: 'Click canvas to move query point x_q; adjust K in {1, 3, 5, 7, 9} and toggle L2 vs L1 norm.',
      outputDescription: 'Neighborhood boundary contour, connection rays, vote ballot counter, and majority classification.',
      interactiveType: 'knn',
    },
    variants: {
      summary: 'Distance metrics and spatial indexing algorithms for high-speed KNN.',
      variants: [
        {
          id: 'distance-weighted',
          name: 'Distance-Weighted KNN',
          tag: 'Voting Refinement',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'Weights neighbor votes by inverse distance: w_i = 1 / (d_i + epsilon). Closer neighbors have much greater influence.',
          idealUseCase: 'Regression prediction and uneven density clusters where distant neighbors should not dilute close consensus.',
          drawback: 'Makes model slightly more sensitive to near-query outliers.',
        },
        {
          id: 'spatial-trees',
          name: 'KD-Tree & Ball-Tree Search',
          tag: 'Inference Acceleration',
          badgeVariant: 'sage',
          howItDiffers:
            'Organizes training data into hierarchical spatial bounding trees to prune distant branches during nearest-neighbor search.',
          idealUseCase: 'Accelerating query times from O(n * d) brute force down to O(log n * d) in low to moderate dimensions (d < 20).',
          drawback: 'Collapses back to O(n) brute force in high dimensions due to the Curse of Dimensionality.',
        },
        {
          id: 'approximate-knn',
          name: 'Approximate Nearest Neighbors (HNSW / FAISS)',
          tag: 'Massive Scale Vector Search',
          badgeVariant: 'amber',
          howItDiffers:
            'Uses Hierarchical Navigable Small World graphs to find 99%+ accurate neighbors in sub-millisecond times on billions of embeddings.',
          idealUseCase: 'Modern vector databases, LLM RAG pipelines, and large-scale visual search engines.',
          drawback: 'Sacrifices 100% exact neighbor guarantees for massive speedup.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Scikit-Learn KNeighborsClassifier with GridSearch for Optimal K',
      realWorldScenario:
        'Predicting customer service plan subscriptions based on normalized usage metrics with cross-validated K hyperparameter tuning.',
      inputsSpecs: 'X: (n, d) normalized continuous usage features; y: discrete plan tier.',
      outputsSpecs: 'knn: fitted KNeighborsClassifier model; best_params: optimal K value.',
      keyHyperparameters: [
        { name: 'n_neighbors', type: 'int', defaultVal: '5', role: 'Number of neighbors K to participate in voting' },
        { name: 'weights', type: 'str', defaultVal: "'uniform'", role: 'Weighting scheme ("uniform" or "distance")' },
        { name: 'metric', type: 'str', defaultVal: "'minkowski'", role: 'Distance metric: p=2 for Euclidean, p=1 for Manhattan' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# 1. Synthetic classification data
np.random.seed(42)
X = np.random.randn(150, 4)
y = (X[:, 0] + X[:, 1] > 0.2).astype(int)

# 2. Pipeline with mandatory StandardScaler
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('knn', KNeighborsClassifier())
])

# 3. Grid search over odd values of K
param_grid = {'knn__n_neighbors': [1, 3, 5, 7, 11, 15], 'knn__weights': ['uniform', 'distance']}
grid = GridSearchCV(pipeline, param_grid, cv=5, scoring='accuracy')
grid.fit(X, y)

print(f"Optimal K: {grid.best_params_['knn__n_neighbors']}")
print(f"Optimal Weighting: {grid.best_params_['knn__weights']}")
print(f"Cross-Validated Accuracy: {grid.best_score_:.3f}")`,
      codeExplanation:
        'GridSearchCV tests odd K values from 1 to 15. K=1 has high variance; large K has high bias. Cross-validation identifies the optimal intermediate K balancing noise filtering against boundary resolution.',
    },
    tradeoffs: {
      advantages: [
        'Completely non-parametric: can capture complex, disjoint, non-linear decision boundaries of any arbitrary shape',
        'Zero training time: new data can be added instantly without retraining the model',
        'Naturally supports multiclass classification and multi-output regression without architectural changes',
      ],
      limitations: [
        'Inference is computationally expensive: testing a single query requires computing distances against all n training points',
        'Curse of Dimensionality: in high dimensions (d > 50), all pairwise distances converge to the same value (equidistance)',
        'Extremely memory intensive: entire training dataset must be retained in active RAM for deployment',
      ],
      fundamentalAssumptions: [
        'Features that are close together in metric space share identical semantic labels (Smoothness assumption)',
        'All features are scaled appropriately so Euclidean distance reflects true relational similarity',
        'The feature space is relatively low-dimensional (d < 30) or compressed via PCA prior to clustering',
      ],
      failureModes: [
        {
          symptom: 'KNN model classifies every query point solely based on feature #1 (Annual Income in $), completely ignoring feature #2 (Age in years).',
          underlyingReason: 'Unscaled features: Income differences of $10,000 completely overwhelm Age differences of 5 years in the Euclidean sum (x_1 - z_1)^2.',
          fix: 'Apply StandardScaler to all features prior to distance computation.',
        },
        {
          symptom: 'KNN query latency exceeds 1.5 seconds per request in a production API serving 1,000,000 training records.',
          underlyingReason: 'Brute force linear scan computes 1,000,000 vector distances per incoming query.',
          fix: 'Index training embeddings with an Approximate Nearest Neighbor index (e.g. FAISS / HNSW) or distill into a fast parametric model.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'KNN is an instance-based lazy learner that classifies queries by local majority ballot of K nearest neighbors.',
        'Feature scaling (StandardScaler) is strictly mandatory; unscaled features completely destroy distance geometry.',
        'Small K (K=1) overfits to noise; large K underfits by smoothing across distinct class clusters. Use odd K to prevent ties.',
      ],
      misconception: {
        myth: 'KNN is identical to K-Means clustering because both have "K" and use Euclidean distance.',
        reality:
          'KNN is a supervised classification/regression algorithm requiring labeled training data and a query point. K-Means is an unsupervised clustering algorithm that discovers centroids in unlabeled data.',
        whyLearnersConfuseIt:
          'Both algorithms start with the letter K and rely on Euclidean distance, causing frequent confusion on introductory exams.',
      },
      recallQuestion: {
        id: 'recall-knn-1',
        question:
          'What happens to the decision boundary of a KNN classifier as hyperparameter K increases from K=1 to K=50?',
        options: [
          'The decision boundary becomes smoother and simpler, reducing model variance but increasing bias.',
          'The decision boundary becomes more jagged and complex, increasing overfitting.',
          'The model runs 50 times faster at inference time.',
          'The model switches from supervised learning to unsupervised clustering.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! K=1 creates intricate Voronoi cell boundaries that wrap tightly around every training point (high variance / overfitting). As K increases, the boundary aggregates more neighbors, smoothing into a simpler, lower-variance decision contour.',
      },
      nextConcept: {
        id: 'regularization',
        title: 'Regularization: Lasso ($L_1$) & Ridge ($L_2$)',
        whyNext:
          'Now explore how mathematical penalty constraints prevent high-capacity parametric models from overfitting.',
      },
      challenge: {
        title: 'Outlier Neighborhood Balloting Audit',
        goldenTriad: {
          whatIsIt: 'Instance-based non-parametric supervised learning algorithm classifying queries via local spatial majority vote.',
          whyDoesItWork: 'Relying on the smoothness assumption: points close together in feature metric space share identical labels.',
          whenToUseIt: 'Low-dimensional tabular baselines (d < 20), collaborative filtering, and similarity search.',
        },
        taskInstruction:
          'In the KNN Bench, click "NEAR OUTLIER". Set K=1 and observe the majority classification. Then increase K to 5 or 7 and observe how the ballot switches.',
        hint: 'At K=1, the model is trapped by the single red outlier point. At K=5, the surrounding blue squares outvote the outlier 4 to 1.',
        solutionExplanation:
          'With K=1, the query point adopts the label of the closest single neighbor, blindly memorizing an isolated anomalous outlier. When K is increased to 5 or 7, the neighborhood expands, allowing the true dominant cluster points to outvote the noise and output the robust classification.',
      },
    },
  },

  // =========================================================================
  // 07 // REGULARIZATION: LASSO & RIDGE
  // =========================================================================
  'regularization': {
    id: 'regularization',
    title: 'Regularization: Lasso ($L_1$) & Ridge ($L_2$)',
    subtitle: 'Shrinkage penalties, sparsity geometry, and parameter capacity control.',
    eyebrow: '02 // OPTIMIZATION & LOSS',
    category: 'Optimization',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Linear Regression', 'Loss Functions'],
    nextConceptId: 'linear-regression',
    colorAccent: 'ultramarine',
    tags: ['L1 Lasso', 'L2 Ridge', 'ElasticNet', 'Sparsity', 'Feature Selection', 'Shrinkage'],
    nutshell: {
      definition:
        'A mathematical technique that adds a penalty term proportional to parameter magnitude into the loss function, restricting model capacity to prevent overfitting and resolve ill-conditioned multicollinearity.',
      whyExists:
        'When feature count d is large or features correlate strongly, unconstrained OLS normal equations can produce wildly inflated, unstable coefficients (+/- 10^5) that overfit training noise. Regularization constrains the parameter search budget.',
      problemSolved:
        'Controls the bias-variance tradeoff by trading a tiny amount of bias for a massive reduction in model variance, while Lasso ($L_1$) automatically performs feature selection by driving irrelevant weights to exact zero.',
      primaryFormula: {
        latex: 'J_{\\text{Ridge}}(\\mathbf{w}) = \\text{Loss} + \\frac{\\lambda}{2} \\sum_{j=1}^d w_j^2, \\quad J_{\\text{Lasso}}(\\mathbf{w}) = \\text{Loss} + \\lambda \\sum_{j=1}^d |w_j|',
        label: 'RIDGE ($L_2$) & LASSO ($L_1$) PENALTY OBJECTIVES',
        explanation: 'lambda >= 0 controls shrinkage strength: lambda=0 recovers unconstrained OLS; lambda -> infinity forces all weights to 0.',
      },
      keyCharacteristics: [
        'L2 Ridge (Tikhonov): Shrinks all coefficients smoothly toward zero; solves singular matrix inversions (X^T X + lambda I)^-1',
        'L1 Lasso: Diamond constraint geometry produces exact zero coefficients (sparse models, automatic feature selection)',
        'ElasticNet: Convex combination of L1 and L2 penalties balancing sparsity with grouped feature stability',
      ],
    },
    howItWorks: {
      headline: 'The Geometry of Regularized Optimization in 4 Stages',
      steps: [
        {
          stepNumber: 1,
          title: 'Establish the Unconstrained Loss Contours',
          description:
            'Ordinary Least Squares forms elliptical loss contours centered at the unconstrained optimum w_OLS in weight space (w1, w2).',
          mathDetail: 'J_{\\text{OLS}}(\\mathbf{w}) = \\frac{1}{2n} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2',
          diagramNote: 'Ellipses expand outwards as loss increases away from w_OLS.',
        },
        {
          stepNumber: 2,
          title: 'Define the Parameter Constraint Region',
          description:
            'The penalty acts as a geometric budget centered at the origin (0, 0). L2 forms a smooth circle; L1 forms a diamond with sharp corners.',
          mathDetail: 'L_2: \\|\\mathbf{w}\\|_2^2 \\le C, \\quad L_1: \\|\\mathbf{w}\\|_1 \\le C',
          diagramNote: 'Higher lambda shrinks constraint radius C toward the origin.',
        },
        {
          stepNumber: 3,
          title: 'Identify the Tangency Contact Point',
          description:
            'The regularized solution w_reg is the exact point where the expanding elliptical loss contour first touches the constraint boundary.',
          mathDetail: '\\nabla_{\\mathbf{w}} \\text{Loss}(\\mathbf{w}) + \\lambda \\partial \\|\\mathbf{w}\\|_p = 0',
          diagramNote: 'Balance point where loss gradient exactly opposes constraint subgradient.',
        },
        {
          stepNumber: 4,
          title: 'The Sparsity Mechanism (L1 Diamond Corners)',
          description:
            'Because the L1 diamond has sharp vertices located along the coordinate axes (where w_j = 0), the elliptical contour frequently strikes a corner first, zeroing out weights.',
          mathDetail: 'w_j = \\text{sign}(w_j) \\max(0, |w_j| - \\lambda)',
          diagramNote: 'Soft-thresholding operator mathematically snaps small weights to absolute zero.',
        },
      ],
      coreLoopSummary:
        'Unconstrained Loss Ellipses -> Add Norm Constraint Budget -> Find Tangency Contact Point -> L2 Shrinks Weights / L1 Enforces Sparsity.',
    },
    visualExample: {
      scenarioTitle: 'The Geometry of Sparsity: L1 Diamond Corners vs L2 Smooth Spheres',
      relatableScenario:
        'In parameter space (w1, w2) with unconstrained OLS solution at (3.2, 1.8), observe how increasing lambda shrinks the constraint region. For L1 Lasso, the expanding elliptical contour contacts the sharp corner on the horizontal axis, snapping w2 to exact zero (feature discarded). For L2 Ridge, contact occurs on a smooth curve, shrinking both weights without zeroing either.',
      inputsDescription: 'Parameter space (w1, w2) with OLS optimum at (3.2, 1.8) and adjustable lambda in [0.0, 4.5].',
      intermediateDescription: 'Toggle between L1 Lasso (Diamond) and L2 Ridge (Sphere) penalty geometries.',
      outputDescription: 'Live regularized weights (w1, w2), constraint boundary, tangency contact point, and sparsity status.',
      interactiveType: 'regularization',
    },
    variants: {
      summary: 'Penalty formulations balancing feature selection, stability, and grouping.',
      variants: [
        {
          id: 'ridge-l2',
          name: 'Ridge Regression ($L_2$ Penalty)',
          tag: 'Smooth Shrinkage',
          badgeVariant: 'ultramarine',
          howItDiffers:
            'Penalizes sum of squared weights: lambda * sum(w_j^2). Has closed-form analytical solution w = (X^T X + lambda I)^-1 X^T y.',
          idealUseCase: 'When all features have small non-zero effects or when severe multicollinearity exists between features.',
          drawback: 'Never sets coefficients to exact zero; cannot perform automated feature selection.',
        },
        {
          id: 'lasso-l1',
          name: 'Lasso Regression ($L_1$ Penalty)',
          tag: 'Sparse Feature Selection',
          badgeVariant: 'vermilion',
          howItDiffers:
            'Penalizes sum of absolute weights: lambda * sum(|w_j|). Non-differentiable at w=0; solved via coordinate descent.',
          idealUseCase: 'High-dimensional datasets (d >> n, e.g. genomics) where only a tiny fraction of features are truly relevant.',
          drawback: 'Arbitrarily picks one feature among highly correlated features and drops the rest.',
        },
        {
          id: 'elastic-net',
          name: 'ElasticNet ($L_1 + L_2$ Hybrid)',
          tag: 'Balanced Compromise',
          badgeVariant: 'sage',
          howItDiffers:
            'Combines L1 and L2 penalties: r * lambda * ||w||_1 + ((1-r)/2) * lambda * ||w||_2^2.',
          idealUseCase: 'When multiple correlated features are important (L2 encourages grouped selection, L1 enforces sparsity).',
          drawback: 'Requires tuning two hyperparameters (lambda and l1_ratio r).',
        },
      ],
    },
    implementation: {
      industryTitle: 'Scikit-Learn LassoCV & RidgeCV with Automated Penalty Tuning',
      realWorldScenario:
        'Predicting disease progression from 100 biological indicators where only 5 are genuine causal drivers (high-dimensional sparsity).',
      inputsSpecs: 'X: (n=50, d=100) sparse genomic design matrix; y: disease score.',
      outputsSpecs: 'lasso: fitted LassoCV model; non_zero_count: count of retained active features.',
      keyHyperparameters: [
        { name: 'alphas', type: 'array', defaultVal: 'logspace(-3, 2, 50)', role: 'Search grid for regularization strength lambda' },
        { name: 'cv', type: 'int', defaultVal: '5', role: 'Stratified cross-validation folds for lambda tuning' },
        { name: 'max_iter', type: 'int', defaultVal: '2000', role: 'Coordinate descent convergence iterations' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.linear_model import LassoCV, RidgeCV
from sklearn.preprocessing import StandardScaler

# 1. High-dimensional synthetic data (n=60 samples, d=50 features)
np.random.seed(42)
X = np.random.randn(60, 50)
# Only features #0, #1, and #2 have true non-zero coefficients!
y = 3.5 * X[:, 0] - 2.0 * X[:, 1] + 1.5 * X[:, 2] + np.random.normal(0, 0.5, 60)

# 2. Fit RidgeCV (L2 Shrinkage)
ridge = RidgeCV(alphas=np.logspace(-2, 2, 20)).fit(X, y)
ridge_nonzeros = np.sum(np.abs(ridge.coef_) > 1e-4)

# 3. Fit LassoCV (L1 Sparsity)
lasso = LassoCV(cv=5, random_state=42).fit(X, y)
lasso_nonzeros = np.sum(np.abs(lasso.coef_) > 1e-4)

print(f"Total Candidate Features: 50")
print(f"Ridge Active Coefficients: {ridge_nonzeros} / 50 (Dense, all retained)")
print(f"Lasso Active Coefficients: {lasso_nonzeros} / 50 (Sparse feature selection!)")
print(f"Lasso Retained Features:  {np.where(np.abs(lasso.coef_) > 1e-4)[0]}")`,
      codeExplanation:
        'Ridge retains all 50 features with small non-zero weights. Lasso correctly identifies that only 3 features are genuine predictors, setting the other 47 coefficients to exact zero.',
    },
    tradeoffs: {
      advantages: [
        'L2 Ridge fixes singular matrix errors: guarantees (X^T X + lambda I) is strictly invertible even when d > n',
        'L1 Lasso performs automated feature selection, creating sparse, interpretable models with lower inference cost',
        'Massively reduces model variance, preventing high-degree polynomials and linear models from overfitting training noise',
      ],
      limitations: [
        'Introduces systematic shrinkage bias: estimated weights are pushed closer to zero than their true population values',
        'Features must be standardized first: unscaled features with large raw values are penalized unfairly',
        'Lasso can behave erratically when features are collinear, arbitrarily discarding one and retaining another',
      ],
      fundamentalAssumptions: [
        'Features are centered and standardized so the penalty treats all dimensions with equal scale proportionality',
        'The unregularized OLS solution is overparameterized or ill-conditioned, warranting variance reduction',
        'In Lasso, the true underlying data generating process is believed to be approximately sparse',
      ],
      failureModes: [
        {
          symptom: 'Lasso regression sets every single model coefficient to zero, predicting only the target mean.',
          underlyingReason: 'Regularization strength lambda was set too high, completely overpowering the residual loss term.',
          fix: 'Use cross-validated LassoCV to test a logarithmic range of lambda values (e.g. 10^-4 to 10^1).',
        },
        {
          symptom: 'L2 Ridge penalty fails to eliminate any of the 500 noise features in a genomic analysis.',
          underlyingReason: 'Misunderstanding algorithm properties: L2 Ridge contracts weights smoothly but mathematically never produces exact zeros.',
          fix: 'Switch from Ridge (L2) to Lasso (L1) or ElasticNet when feature selection / sparsity is required.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Regularization adds a penalty term lambda * ||w|| to prevent overfitting and stabilize matrix inversions.',
        'L2 Ridge shrinks all weights continuously; L1 Lasso drives irrelevant weights to exact zero (sparsity).',
        'Always standardize features before applying regularization so all coefficients are penalized on an equal footing.',
      ],
      misconception: {
        myth: 'L2 Ridge regression can be used to select the top 10 most important features in a dataset.',
        reality:
          'L2 Ridge never sets coefficients to exact zero. Because the L2 spherical constraint has smooth curvature everywhere, the tangency contact point never lands on an axis. Only L1 Lasso produces exact sparsity.',
        whyLearnersConfuseIt:
          'Learners notice Ridge shrinks weights and assume small weights can just be thresholded away, rather than using L1 Lasso which does this mathematically and optimally.',
      },
      recallQuestion: {
        id: 'recall-reg-1',
        question:
          'Why does L1 Lasso regression produce exact zero weights (sparsity) while L2 Ridge regression does not?',
        options: [
          'Because the L1 constraint region is a diamond with sharp corners along the coordinate axes where expanding loss contours strike first.',
          'Because L1 regression uses a learning rate of zero.',
          'Because L2 Ridge only works on classification problems.',
          'Because L1 deletes columns from the SQL database automatically.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! The L1 diamond constraint |w1| + |w2| <= C has sharp vertices situated directly along the coordinate axes (where w_j = 0). When the elliptical OLS contours expand from the unconstrained optimum, they frequently make first contact at a corner vertex, setting that coordinate identically to zero.',
      },
      nextConcept: {
        id: 'linear-regression',
        title: 'Linear Regression',
        whyNext:
          'Return to the core Linear Regression module to see how Ordinary Least Squares serves as the unregularized foundation.',
      },
      challenge: {
        title: 'L1 Diamond Sparsity vs L2 Shrinkage Audit',
        goldenTriad: {
          whatIsIt: 'Mathematical penalty constraint added to the loss function to penalize extreme parameter magnitudes.',
          whyDoesItWork: 'Reduces model variance by restricting parameter space; L1 diamond geometry forces exact zeros at axis corners.',
          whenToUseIt: 'Whenever feature count d is large, features are collinear, or automated feature selection is desired.',
        },
        taskInstruction:
          'In the Regularization Bench, select "$L_1$ LASSO (DIAMOND)" and increase lambda above 1.20. Observe what happens to weight w2. Then switch to "$L_2$ RIDGE (SPHERE)" at the same lambda.',
        hint: 'Notice that in L1, w2 hits exact 0.000 (green badge: SPARSITY DETECTED), while in L2, w2 shrinks but remains non-zero.',
        solutionExplanation:
          'In L1 Lasso, as lambda increases the constraint budget shrinks, forcing the tangency point into the horizontal diamond vertex where w2 = 0.000. This is the mathematical mechanism of Lasso feature selection. In L2 Ridge, the smooth circular constraint maintains tangency on the curve, shrinking w1 and w2 proportionally without ever reaching absolute zero.',
      },
    },
  },
};
