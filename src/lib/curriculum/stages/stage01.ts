import { Lesson } from '@/types';

export const stage01Lesson: Lesson = {
  id: 'ml-foundations',
  stageNumber: 1,
  stageCode: '01',
  layer: 'essential',
  algorithmId: 'ml-foundations',
  title: 'Stage 01: Machine Learning Foundations',
  subtitle: 'What is ML? AI vs ML vs DL, Paradigms, Lifecycle, and Datasets.',
  durationMinutes: 18,
  prerequisites: [],
  learningObjectives: [
    'Define Machine Learning using Tom Mitchell’s formal definition (T, P, E).',
    'Contrast the three core paradigms: Supervised, Unsupervised, and Reinforcement Learning.',
    'Differentiate between Regression (continuous) and Classification (discrete) target tasks.',
    'Distinguish Batch vs Online learning and Instance-based vs Model-based learning.',
    'Master the ML development lifecycle and the strict separation of Train, Validation, and Test datasets.',
  ],
  steps: [
    {
      id: 's01-1-hook',
      title: 'Beyond Explicit Rules: The Learning Revolution',
      eyebrow: '01 // THE CORE SHIFT',
      phase: 'hook',
      contentMarkdown:
        'In classical software engineering, humans write explicit deterministic rules: Input Data + Rules = Answers. In Machine Learning, we invert the computing paradigm: Input Data + Answers = Learned Rules. As Tom Mitchell formulated: A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E.',
      equation: 'P(T) \\text{ improves with } E',
    },
    {
      id: 's01-2-intuition',
      title: 'AI vs ML vs Deep Learning: The Concentric Reality',
      eyebrow: '02 // TAXONOMY',
      phase: 'intuition',
      contentMarkdown:
        'Artificial Intelligence is the broad aspirational field of synthesizing cognitive tasks. Machine Learning is the specific subfield focused on statistical algorithms that extract patterns from data without hand-crafted rules. Deep Learning is a specialized sub-branch of ML utilizing multi-layered artificial neural networks capable of learning hierarchical feature representations directly from raw perceptual signals (pixels, audio waveforms).',
    },
    {
      id: 's01-3-explore',
      title: 'The Three Master Paradigms',
      eyebrow: '03 // PARADIGM EXPLORATION',
      phase: 'explore',
      interactiveComponent: 'paradigm-selector',
      contentMarkdown:
        'Machine learning organizes into three primary algorithmic families: 1) Supervised Learning: pairs of inputs and ground-truth targets (x, y) where the algorithm learns a mapping function y = f(x). 2) Unsupervised Learning: unlabeled observations (x) where the algorithm uncovers latent structure or clusters. 3) Reinforcement Learning: an autonomous agent interacting with an environment, learning an optimal policy via reward feedback.',
    },
    {
      id: 's01-4-predict',
      title: 'Predicting the Paradigm',
      eyebrow: '04 // TEST YOUR INTUITION',
      phase: 'predict',
      contentMarkdown:
        'Test your conceptual understanding of algorithmic taxonomy before advancing into data modeling.',
      predictionOptions: {
        question:
          'A planetary rover navigates Martian terrain. It receives a +1 reward for advancing toward a waypoint, and a -10 penalty if its wheel slips into loose sand. What machine learning paradigm governs this system?',
        options: [
          'Supervised Regression (predicting continuous wheel velocities)',
          'Unsupervised Clustering (grouping rock formations into Voronoi cells)',
          'Reinforcement Learning (agent optimizing cumulative discounted reward)',
          'Classical Batch Programming without learning',
        ],
        correctIndex: 2,
        explanation:
          'Reinforcement Learning is characterized by an agent taking sequential actions in an uncertain environment to maximize cumulative reward signals over time.',
      },
    },
    {
      id: 's01-5-reveal',
      title: 'Task Types: Regression vs Classification vs Clustering',
      eyebrow: '05 // TASK TAXONOMY',
      phase: 'reveal',
      contentMarkdown:
        'Supervised learning branches into two fundamental tasks: Regression (the target variable y is a continuous real number, such as predicting housing prices or temperatures) and Classification (the target variable y is a discrete categorical class label, such as spam vs non-spam or malignant vs benign). When target labels do not exist, Clustering partitions the coordinate space into unlabeled cohorts.',
      equation: '\\hat{y} \\in \\mathbb{R} \\text{ (Regression)} \\quad \\text{vs} \\quad \\hat{y} \\in \\{0, 1, \\dots, C-1\\} \\text{ (Classification)}',
    },
    {
      id: 's01-6-under-the-hood',
      title: 'Batch vs Online & Instance vs Model-Based',
      eyebrow: '06 // SYSTEM ARCHITECTURE',
      phase: 'under-the-hood',
      contentMarkdown:
        'Algorithms differ in how they ingest data and store knowledge: Batch Learning trains on all historical data statically; updating requires full retraining. Online Learning updates parameters incrementally in real-time as data streams arrive. Instance-based Learning (like k-NN) memorizes raw training samples and computes distances at query time. Model-based Learning (like Linear Regression or Decision Trees) abstracts the data into fixed parameters, discarding raw samples after training.',
    },
    {
      id: 's01-7-break-it',
      title: 'The Cardinal Sin: Data Leakage in Splits',
      eyebrow: '07 // FAILURE MODES',
      phase: 'break-it',
      contentMarkdown:
        'The most catastrophic failure mode in machine learning is Data Leakage—allowing information from the test dataset to contaminate the training pipeline. The test set simulates unseen future reality; it must remain locked in a vault until final evaluation. If feature scaling, imputation, or hyperparameter tuning touches the test set, your performance metrics become an illusion that collapses in production.',
      equation: '\\mathcal{D}_{\\text{total}} = \\mathcal{D}_{\\text{train}} \\cup \\mathcal{D}_{\\text{val}} \\cup \\mathcal{D}_{\\text{test}}, \\quad \\mathcal{D}_{\\text{train}} \\cap \\mathcal{D}_{\\text{test}} = \\emptyset',
    },
    {
      id: 's01-8-code-it',
      title: 'The Canonical Train/Val/Test Split in Python',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Inspect how scikit-learn isolates training and testing partitions deterministically using pseudo-random seeds.',
      codeSnippet: {
        python: `import numpy as np
from sklearn.model_selection import train_test_split

# Generate synthetic dataset: 1000 samples, 4 features
X = np.random.randn(1000, 4)
y = (X[:, 0] * 1.5 + X[:, 1] > 0).astype(int)

# Step 1: Carve out 20% untouched final test holdout
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Step 2: Split remaining 80% into 75% train (60% total) and 25% validation (20% total)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=42, stratify=y_temp
)

print(f"Train: {X_train.shape[0]} | Val: {X_val.shape[0]} | Test: {X_test.shape[0]}")`,
        sklearn: 'from sklearn.model_selection import train_test_split',
        explanation:
          'Stratified splitting ensures that class label distributions remain identical across all three subsets.',
      },
    },
    {
      id: 's01-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Validate your comprehension of ML fundamentals across these 5 diagnostic questions.',
      questions: [
        {
          id: 's01-q1',
          prompt: 'Which scenario describes an Unsupervised Learning problem?',
          options: [
            'Predicting whether an email is spam using 10,000 human-flagged emails.',
            'Grouping 500,000 retail customers into purchasing personas without pre-existing labels.',
            'Forecasting the price of crude oil using historical interest rates and output quotas.',
            'Teaching a robot arm to stack blocks by awarding points for stability.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'supervised-classification',
            2: 'supervised-regression',
            3: 'reinforcement-learning',
          },
          explanation:
            'Customer segmentation without ground truth labels is unsupervised clustering.',
          difficulty: 'beginner',
        },
        {
          id: 's01-q2',
          prompt: 'What constitutes fatal data leakage during model training?',
          options: [
            'Evaluating the trained model on cross-validation folds.',
            'Computing feature mean and standard deviation across the combined train + test dataset before splitting.',
            'Shuffling the training set before performing mini-batch gradient descent.',
            'Using 80% of data for training and 20% for testing.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'cv-understanding',
            2: 'shuffle-validity',
            3: 'split-ratio',
          },
          explanation:
            'Computing scaling statistics across the combined dataset leaks test set distribution parameters into training.',
          difficulty: 'beginner',
        },
        {
          id: 's01-q3',
          prompt: 'How does model-based learning differ from instance-based learning?',
          options: [
            'Model-based learning discards the raw training points after fitting mathematical parameters; instance-based learning stores the raw data.',
            'Model-based learning requires a neural network; instance-based learning uses decision trees.',
            'Model-based learning only works on regression; instance-based only works on classification.',
            'Model-based learning does not require loss functions.',
          ],
          correctIndex: 0,
          misconceptionMap: {
            1: 'model-representation',
            2: 'task-constraint',
            3: 'loss-necessity',
          },
          explanation:
            'Model-based learning abstracts training points into fixed parameters (e.g. weights w). Instance-based learning queries raw stored points.',
          difficulty: 'intermediate',
        },
        {
          id: 's01-q4',
          prompt: 'Why is a Validation set strictly separated from the Test set?',
          options: [
            'The validation set is used to fit the model parameters; the test set is used for backpropagation.',
            'The validation set guides hyperparameter selection and model tuning; the test set provides an unbiased estimate of final generalization.',
            'The validation set must always contain twice as many samples as the test set.',
            'There is no difference; validation and test sets are interchangeable names for the same split.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'param-fitting-split',
            2: 'split-size-myth',
            3: 'split-equivalence',
          },
          explanation:
            'Repeatedly tuning hyperparameters on the validation set induces subtle selection bias. The untouched test set verifies true out-of-sample generalization.',
          difficulty: 'beginner',
        },
        {
          id: 's01-q5',
          prompt: 'What is the target variable type in a Regression problem?',
          options: [
            'A discrete categorical unordered class label.',
            'A binary flag taking values in {0, 1}.',
            'A continuous scalar real value in R.',
            'A set of cluster centroids.',
          ],
          correctIndex: 2,
          misconceptionMap: {
            0: 'categorical-regression',
            1: 'binary-regression',
            3: 'clustering-regression',
          },
          explanation:
            'Regression predicts continuous quantities (real numbers R), whereas classification predicts discrete classes.',
          difficulty: 'beginner',
        },
      ],
    },
    {
      id: 's01-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have mastered the foundational taxonomy of Machine Learning: paradigms, task types, system architectures, and the non-negotiable rules of data partitioning. Next, advance into Stage 02: Data Literacy & Feature Engineering to master raw data hygiene and scaling pipelines before mathematical modeling.',
    },
  ],
};
