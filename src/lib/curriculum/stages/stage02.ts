import { Lesson } from '@/types';

export const stage02Lesson: Lesson = {
  id: 'data-literacy',
  stageNumber: 2,
  stageCode: '02',
  layer: 'essential',
  algorithmId: 'data-literacy',
  title: 'Stage 02: Data Literacy & Feature Engineering',
  subtitle: 'Samples, Features, Data Hygiene, Missing Values, and Scaling Pipelines.',
  durationMinutes: 20,
  prerequisites: ['ml-foundations'],
  learningObjectives: [
    'Define the anatomy of tabular data: samples (rows), features (columns), and targets.',
    'Differentiate between numerical (continuous/discrete) and categorical (nominal/ordinal) variables.',
    'Compute sample mean, median, variance, and standard deviation.',
    'Handle missing values via imputation and recognize outlier distortion.',
    'Master StandardScaler vs MinMaxScaler and prevent preprocessing data leakage.',
  ],
  steps: [
    {
      id: 's02-1-hook',
      title: 'Garbage In, Garbage Out: The Geometry of Data',
      eyebrow: '01 // THE RAW MATRIX',
      phase: 'hook',
      contentMarkdown:
        'No algorithm, no matter how sophisticated, can extract truth from corrupt coordinates. In machine learning, our universe is represented as a design matrix X of size N × D, where N represents distinct observations (samples) and D represents coordinate dimensions (features). Before fitting parameters, we must ensure every coordinate axis represents clean, comparable physical units.',
      equation: '\\mathbf{X} \\in \\mathbb{R}^{N \\times D}, \\quad \\mathbf{y} \\in \\mathbb{R}^N',
    },
    {
      id: 's02-2-intuition',
      title: 'Feature Types: Numerical vs Categorical',
      eyebrow: '02 // DATA TYPOLOGY',
      phase: 'intuition',
      contentMarkdown:
        'Features come in distinct mathematical types: 1) Continuous Numerical: real numbers with infinite possible gradations (height, temperature, salary). 2) Discrete Numerical: integer counts (number of bedrooms, website visits). 3) Nominal Categorical: discrete categories with no inherent mathematical order (blood type, country, color). 4) Ordinal Categorical: categories with a strict ranking order (education level: High School < Bachelors < PhD; t-shirt size: S < M < L).',
    },
    {
      id: 's02-3-explore',
      title: 'Central Tendency & Spread',
      eyebrow: '03 // STATISTICAL SUMMARY',
      phase: 'explore',
      interactiveComponent: 'scale-distortion-simulator',
      contentMarkdown:
        'The Sample Mean captures the center of mass of a distribution, but is vulnerable to extreme outliers. The Sample Median is robust against extreme values. Variance measures the average squared deviation from the mean, and Standard Deviation restores this measure to original physical units.',
      equation: '\\bar{x} = \\frac{1}{N} \\sum_{i=1}^N x_i, \\quad s^2 = \\frac{1}{N-1} \\sum_{i=1}^N (x_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}',
    },
    {
      id: 's02-4-predict',
      title: 'The Outlier Hazard',
      eyebrow: '04 // PREDICTION CHALLENGE',
      phase: 'predict',
      contentMarkdown:
        'Consider nine software engineers earning $100,000 each. A billionaire joins the room earning $100,000,000. How do the mean and median react?',
      predictionOptions: {
        question:
          'What happens to the mean and median salary of the 10 people in the room?',
        options: [
          'Both mean and median increase by approximately $10,000,000.',
          'The mean explodes to $10,090,000, while the median remains exactly $100,000.',
          'The median explodes to $10,090,000, while the mean remains $100,000.',
          'Neither metric changes because outliers are ignored automatically.',
        ],
        correctIndex: 1,
        explanation:
          'The mean is sensitive to extreme values (sum divided by 10). The median takes the middle rank, completely resisting extreme outliers.',
      },
    },
    {
      id: 's02-5-reveal',
      title: 'Feature Scaling: StandardScaler vs MinMaxScaler',
      eyebrow: '05 // THE SCALING PARADOX',
      phase: 'reveal',
      contentMarkdown:
        'If Feature 1 is Age (range 20 to 60) and Feature 2 is Income in Dollars (range 20,000 to 200,000), Euclidean distance calculations will be dominated 99.999% by Income! StandardScaler transforms each feature to have mean 0 and unit variance 1. MinMaxScaler rescales coordinates into a fixed [0, 1] interval.',
      equation: 'z = \\frac{x - \\mu}{\\sigma} \\quad \\text{(StandardScaler)}, \\quad x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}} \\quad \\text{(MinMaxScaler)}',
    },
    {
      id: 's02-6-under-the-hood',
      title: 'Encoding Categoricals: One-Hot vs Ordinal',
      eyebrow: '06 // CATEGORICAL ENCODING',
      phase: 'under-the-hood',
      contentMarkdown:
        'Algorithms cannot multiply text strings like "Red" or "Blue". For ordinal data with ranking, assign integers (Low=0, Medium=1, High=2). For nominal data without ordering, use One-Hot Encoding: convert a column with K categories into K binary indicator columns. Never assign arbitrary integers like Red=1, Green=2, Blue=3, as this falsely implies that Green is twice as large as Red!',
    },
    {
      id: 's02-7-break-it',
      title: 'The Preprocessing Leakage Trap',
      eyebrow: '07 // CRITICAL BREAKPOINT',
      phase: 'break-it',
      contentMarkdown:
        'Never fit a scaler or imputer on the full dataset! You must fit your scaler ONLY on the training split (learning mu_train and sigma_train), and then apply that transform to validation and test splits. Fitting a scaler across the entire dataset contaminates the training phase with future variance and range information.',
      equation: '\\mathbf{X}_{\\text{train, scaled}} = \\frac{\\mathbf{X}_{\\text{train}} - \\boldsymbol{\\mu}_{\\text{train}}}{\\boldsymbol{\\sigma}_{\\text{train}}}, \\quad \\mathbf{X}_{\\text{test, scaled}} = \\frac{\\mathbf{X}_{\\text{test}} - \\boldsymbol{\\mu}_{\\text{train}}}{\\boldsymbol{\\sigma}_{\\text{train}}}',
    },
    {
      id: 's02-8-code-it',
      title: 'Building Leak-Free Pipelines with Scikit-Learn',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Using Pipeline guarantees that scaling, imputation, and model fitting happen strictly inside training folds without leakage.',
      codeSnippet: {
        python: `import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression

# Construct atomic preprocessing & modeling pipeline
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler()),
    ('model', LinearRegression())
])

# Fit computes statistics ONLY on training fold
pipeline.fit(X_train, y_train)

# Predict applies learned training statistics to test set
predictions = pipeline.predict(X_test)`,
        sklearn: 'from sklearn.pipeline import Pipeline',
        explanation:
          'Scikit-learn Pipeline prevents data leakage by ensuring that transform operations use only training parameters during cross-validation.',
      },
    },
    {
      id: 's02-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Verify your feature engineering intuition before advancing into mathematical derivations.',
      questions: [
        {
          id: 's02-q1',
          prompt: 'Why is arbitrary integer encoding (Red=1, Green=2, Blue=3) dangerous for nominal categories?',
          options: [
            'It consumes three times more memory than one-hot encoding.',
            'It forces the model to assume artificial mathematical distances and order (e.g. Blue is greater than Red).',
            'Linear regression cannot compute matrix inverses with integer inputs.',
            'It causes instant division by zero during gradient descent.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'memory-myth',
            2: 'inversion-myth',
            3: 'zero-div-myth',
          },
          explanation:
            'Assigning arbitrary integers creates false arithmetic relationships that linear models will attempt to fit.',
          difficulty: 'beginner',
        },
        {
          id: 's02-q2',
          prompt: 'What happens to Euclidean distance if features are not scaled before running K-means or PCA?',
          options: [
            'Distance calculations become completely invariant to feature magnitude.',
            'The feature with the largest numerical range and variance dominates and distorts the distance matrix.',
            'The algorithm runs 10 times faster.',
            'The data matrix becomes singular and cannot be inverted.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'scale-invariance',
            2: 'speed-myth',
            3: 'singularity-myth',
          },
          explanation:
            'Unscaled features with large ranges (e.g. Income in dollars) completely overwhelm small features (e.g. Age in years).',
          difficulty: 'beginner',
        },
        {
          id: 's02-q3',
          prompt: 'When scaling test data using StandardScaler, which parameters should be used?',
          options: [
            'The mean and standard deviation computed exclusively from the test set.',
            'The mean and standard deviation computed exclusively from the training set.',
            'The mean of the training set, but standard deviation of the test set.',
            'Zero for mean and 1 for standard deviation.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'test-leak-scaler',
            2: 'hybrid-scaler',
            3: 'arbitrary-scaler',
          },
          explanation:
            'Test data must be transformed using the parameters learned from the training set to preserve the true data generation pipeline.',
          difficulty: 'intermediate',
        },
        {
          id: 's02-q4',
          prompt: 'Which feature scaling technique guarantees that all values fall strictly within the [0, 1] interval?',
          options: [
            'StandardScaler (z-score standardization)',
            'MinMaxScaler',
            'RobustScaler (IQR)',
            'L2 Normalization',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'standard-scaler-bounds',
            2: 'robust-scaler-bounds',
            3: 'l2-norm-bounds',
          },
          explanation:
            'MinMaxScaler subtracts min and divides by (max - min), bounding all coordinates strictly between 0 and 1.',
          difficulty: 'beginner',
        },
        {
          id: 's02-q5',
          prompt: 'Why is median imputation often preferred over mean imputation for heavily skewed data?',
          options: [
            'Mean imputation requires inverting a covariance matrix.',
            'The mean is heavily distorted by extreme outliers, whereas the median preserves robust central tendency.',
            'Median imputation guarantees zero variance.',
            'Median values can only be computed on categorical variables.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'matrix-imputation',
            2: 'zero-variance-myth',
            3: 'categorical-median',
          },
          explanation:
            'The median is a robust non-parametric statistic resistant to extreme outliers.',
          difficulty: 'intermediate',
        },
      ],
    },
    {
      id: 's02-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have mastered tabular anatomy, central tendency, categorical encoding, and leak-free feature scaling pipelines. Next, advance into Stage 03: Mathematics for Machine Learning to build the vector, distance, and gradient foundations required for optimization.',
    },
  ],
};
