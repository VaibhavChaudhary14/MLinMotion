import { Lesson } from '@/types';

export const stage04Lesson: Lesson = {
  id: 'learning-problem',
  stageNumber: 4,
  stageCode: '04',
  layer: 'essential',
  algorithmId: 'learning-problem',
  title: 'Stage 04: The Learning Problem & Generalization',
  subtitle: 'Hypothesis Spaces, Empirical Risk Minimization, Bias-Variance Tradeoff, and Regularization.',
  durationMinutes: 20,
  prerequisites: ['data-literacy', 'math-for-ml'],
  learningObjectives: [
    'Formulate the supervised learning problem mathematically: hypothesis f(x; w), loss, and empirical cost.',
    'Differentiate between model parameters (learned via optimization) and hyperparameters (tuned externally).',
    'Derive the Bias-Variance Decomposition of Mean Squared Error.',
    'Diagnose Underfitting (High Bias) and Overfitting (High Variance) from loss curves.',
    'Understand L1 Lasso and L2 Ridge regularization penalties as geometric constraint spheres.',
  ],
  steps: [
    {
      id: 's04-1-hook',
      title: 'The Memorization Fallacy',
      eyebrow: '01 // LEARNING VS MEMORIZING',
      phase: 'hook',
      contentMarkdown:
        'A student who memorizes every question in the practice textbook may score 100% on practice homework, but fails completely on the unseen final exam. Machine learning is not about achieving zero loss on training samples; it is about Generalization—the ability to make accurate predictions on data the algorithm has never seen before.',
    },
    {
      id: 's04-2-intuition',
      title: 'Hypothesis Spaces & Empirical Risk Minimization',
      eyebrow: '02 // THE FORMAL PROBLEM',
      phase: 'intuition',
      contentMarkdown:
        'We assume an unknown target distribution generates pairs (x, y). We select a Hypothesis Space H of candidate functions f(x; w). The Loss Function L(y, y_hat) measures individual prediction error. The Cost Function J(w) averages this loss across all N training samples. Empirical Risk Minimization (ERM) searches for the weight vector w* that minimizes this training cost.',
      equation: 'J(\\mathbf{w}) = \\frac{1}{N} \\sum_{i=1}^N L(y_i, f(\\mathbf{x}_i; \\mathbf{w})), \\quad \\mathbf{w}^* = \\arg\\min_{\\mathbf{w}} J(\\mathbf{w})',
    },
    {
      id: 's04-3-explore',
      title: 'Parameters vs Hyperparameters',
      eyebrow: '03 // ARCHITECTURAL DISTINCTION',
      phase: 'explore',
      interactiveComponent: 'bias-variance-simulator',
      contentMarkdown:
        'Parameters are the internal coefficients learned directly by the algorithm from data during training (e.g. slopes w_1 and bias w_0 in regression, split thresholds in trees). Hyperparameters are structural knobs set by the engineer before training begins (e.g. learning rate alpha, polynomial degree d, tree max_depth, regularization penalty lambda). Hyperparameters are tuned using validation data.',
    },
    {
      id: 's04-4-predict',
      title: 'The Polynomial Capacity Test',
      eyebrow: '04 // PREDICTION CHALLENGE',
      phase: 'predict',
      contentMarkdown:
        'You have 15 noisy data points generated from a gentle sine wave y = sin(x) + noise. You fit a degree-14 polynomial through all 15 points, achieving exactly 0.000 training error.',
      predictionOptions: {
        question:
          'What will happen to the model’s prediction error on 100 new out-of-sample test points?',
        options: [
          'The test error will be 0.000 because the model fits the training points perfectly.',
          'The test error will be catastrophically high because the model overfitted and oscillated violently between training points.',
          'The test error will be lower than the training error.',
          'Degree-14 polynomials cannot be computed mathematically.',
        ],
        correctIndex: 1,
        explanation:
          'High-degree polynomials have excessive model capacity. They memorize stochastic noise in the sample, causing massive out-of-sample generalization error (High Variance).',
      },
    },
    {
      id: 's04-5-reveal',
      title: 'The Bias-Variance Decomposition',
      eyebrow: '05 // MATHEMATICAL FOUNDATION',
      phase: 'reveal',
      contentMarkdown:
        'The expected out-of-sample prediction error of any estimator decomposes into three fundamental terms: 1) Bias Squared: error stemming from wrong assumptions (e.g. assuming a linear line for a curved phenomenon). 2) Variance: sensitivity to fluctuations in the training set. 3) Irreducible Error sigma^2: noise inherent in the physical universe.',
      equation: '\\mathbb{E}[(y - \\hat{f}(\\mathbf{x}))^2] = \\underbrace{\\text{Bias}[\\hat{f}(\\mathbf{x})]^2}_{\\text{Underfitting}} + \\underbrace{\\text{Var}[\\hat{f}(\\mathbf{x})]}_{\\text{Overfitting}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Noise}}',
    },
    {
      id: 's04-6-under-the-hood',
      title: 'Diagnosing Bias vs Variance from Loss Curves',
      eyebrow: '06 // DIAGNOSTIC PATTERNS',
      phase: 'under-the-hood',
      contentMarkdown:
        'Compare your training loss and validation loss: 1) High Bias (Underfitting): Both training loss and validation loss are high and close together. The model is too simple. Solution: Increase complexity, add features. 2) High Variance (Overfitting): Training loss is very low, but validation loss is significantly higher (a large Generalization Gap). Solution: Collect more data, apply regularization, reduce features.',
    },
    {
      id: 's04-7-break-it',
      title: 'Regularization: Taming Model Capacity with L1 & L2',
      eyebrow: '07 // MATHEMATICAL CONTROLS',
      phase: 'break-it',
      contentMarkdown:
        'To prevent overfitting without discarding features, we append a complexity penalty to the loss function: J_reg(w) = J_loss(w) + lambda * Penalty(w). L2 Ridge penalizes the squared sum of weights (shrinking coefficients toward zero smoothly). L1 Lasso penalizes the absolute sum of weights (forcing uninformative weights to become exactly zero, yielding sparse feature selection).',
      equation: 'J_{\\text{Ridge}}(\\mathbf{w}) = J(\\mathbf{w}) + \\lambda \\sum_{j=1}^D w_j^2, \\quad J_{\\text{Lasso}}(\\mathbf{w}) = J(\\mathbf{w}) + \\lambda \\sum_{j=1}^D |w_j|',
    },
    {
      id: 's04-8-code-it',
      title: 'Ridge vs Lasso in Python',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Inspect how L1 Lasso forces irrelevant coefficients to exactly 0.0, performing automatic feature selection.',
      codeSnippet: {
        python: `import numpy as np
from sklearn.linear_model import Ridge, Lasso

# Synthetic high-dimensional data (100 samples, 10 features, only 2 informative)
X = np.random.randn(100, 10)
y = 3.0 * X[:, 0] - 2.5 * X[:, 1] + 0.1 * np.random.randn(100)

# 1. Ridge Regression (L2 penalty) - shrinks weights smoothly
ridge = Ridge(alpha=1.0)
ridge.fit(X, y)

# 2. Lasso Regression (L1 penalty) - zeros uninformative weights
lasso = Lasso(alpha=0.3)
lasso.fit(X, y)

print("Ridge weights:", np.round(ridge.coef_, 2))
print("Lasso weights:", np.round(lasso.coef_, 2))  # Notice zeros!`,
        sklearn: 'from sklearn.linear_model import Ridge, Lasso',
        explanation:
          'Lasso produces sparse models because its L1 diamond constraint boundary touches loss contours at axis vertices where coordinates are zero.',
      },
    },
    {
      id: 's04-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Verify your mastery of hypothesis spaces, generalization, and regularization.',
      questions: [
        {
          id: 's04-q1',
          prompt: 'Which of the following is a Model Parameter rather than a Hyperparameter?',
          options: [
            'The learning rate alpha in gradient descent.',
            'The slope coefficient w_1 in linear regression.',
            'The regularization strength lambda in Ridge regression.',
            'The maximum depth limit in a decision tree.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'lr-is-param',
            2: 'lambda-is-param',
            3: 'depth-is-param',
          },
          explanation:
            'Weight coefficients w are parameters learned directly by the algorithm. Alpha, lambda, and max_depth are hyperparameters set externally.',
          difficulty: 'beginner',
        },
        {
          id: 's04-q2',
          prompt: 'If a model achieves 0.2% training error but 28.5% validation error, what pathology is present?',
          options: [
            'High Bias (Underfitting).',
            'High Variance (Overfitting).',
            'Numerical underflow.',
            'Underdamped convergence.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'underfitting-gap',
            2: 'underflow-gap',
            3: 'convergence-gap',
          },
          explanation:
            'A large discrepancy between near-zero training error and high validation error is the hallmark of High Variance (Overfitting).',
          difficulty: 'beginner',
        },
        {
          id: 's04-q3',
          prompt: 'What unique mathematical property distinguishes L1 Lasso regularization from L2 Ridge?',
          options: [
            'L1 Lasso produces sparse models by driving uninformative feature weights strictly to zero.',
            'L1 Lasso can only be used on classification problems.',
            'L2 Ridge is non-convex while Lasso is convex.',
            'L1 Lasso guarantees zero training loss.',
          ],
          correctIndex: 0,
          misconceptionMap: {
            1: 'lasso-classification-only',
            2: 'ridge-nonconvex',
            3: 'zero-loss-lasso',
          },
          explanation:
            'L1 regularization has sharp corners along coordinate axes, forcing weights to zero and performing feature selection.',
          difficulty: 'intermediate',
        },
        {
          id: 's04-q4',
          prompt: 'Why can Irreducible Error (sigma^2) never be reduced by adding more model parameters?',
          options: [
            'Because algorithms are limited by 64-bit floating point precision.',
            'Because sigma^2 represents noise intrinsic to the physical measurement and unobserved confounding variables in the universe.',
            'Because gradient descent always stops before reaching zero.',
            'Because cross-validation introduces variance.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'float-precision-myth',
            2: 'stopping-criteria-myth',
            3: 'cv-noise-myth',
          },
          explanation:
            'Irreducible error is noise inherent in the true data generation process (unmeasured factors, sensor jitter).',
          difficulty: 'intermediate',
        },
        {
          id: 's04-q5',
          prompt: 'If your model is suffering from High Bias (Underfitting), which action is most appropriate?',
          options: [
            'Increase L2 regularization strength lambda.',
            'Reduce the number of polynomial features.',
            'Increase model capacity (e.g. use higher polynomial degree or add relevant features).',
            'Collect 10 times more training data without changing model complexity.',
          ],
          correctIndex: 2,
          misconceptionMap: {
            0: 'increase-reg-bias',
            1: 'reduce-features-bias',
            3: 'more-data-fixes-bias',
          },
          explanation:
            'Underfitting means the model is too simple to capture the underlying pattern. More data alone cannot fix a fundamentally underpowered model.',
          difficulty: 'intermediate',
        },
      ],
    },
    {
      id: 's04-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have mastered hypothesis spaces, empirical risk minimization, the bias-variance tradeoff, and regularization geometry. Now, you are fully prepared to build and inspect your first complete machine learning model in Stage 05: Linear Regression & Ordinary Least Squares.',
    },
  ],
};
