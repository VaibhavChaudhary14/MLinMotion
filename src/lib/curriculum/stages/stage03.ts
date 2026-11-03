import { Lesson } from '@/types';

export const stage03Lesson: Lesson = {
  id: 'math-for-ml',
  stageNumber: 3,
  stageCode: '03',
  layer: 'essential',
  algorithmId: 'math-for-ml',
  title: 'Stage 03: Mathematics for Machine Learning',
  subtitle: 'Vectors, Dot Products, Distances, Covariance Matrices, and Gradients.',
  durationMinutes: 22,
  prerequisites: ['ml-foundations'],
  learningObjectives: [
    'Represent data and model weights as vectors and matrices.',
    'Calculate vector dot products, norms (L1 and L2), and angles.',
    'Construct sample covariance matrices and understand directional spread.',
    'Compute partial derivatives and formulate the directional gradient vector.',
    'Interpret the geometric curvature of convex loss functions.',
  ],
  steps: [
    {
      id: 's03-1-hook',
      title: 'The Language of the Machine: Linear Algebra & Calculus',
      eyebrow: '01 // THE MATHEMATICAL SUBSTRATE',
      phase: 'hook',
      contentMarkdown:
        'Machine learning algorithms do not see images, text, or spreadsheets. They see multidimensional geometric vectors navigating high-dimensional vector spaces. Linear algebra provides the vocabulary to represent data structures, while multivariate calculus provides the engine to optimize parameters.',
      equation: '\\mathbf{x} = [x_1, x_2, \\dots, x_D]^T \\in \\mathbb{R}^D, \\quad \\mathbf{W} \\in \\mathbb{R}^{D \\times K}',
    },
    {
      id: 's03-2-intuition',
      title: 'Vectors, Dot Products & Geometric Angles',
      eyebrow: '02 // VECTOR GEOMETRY',
      phase: 'intuition',
      contentMarkdown:
        'The dot product of two vectors u and v multiplies their aligned components. Geometrically, u · v equals ||u|| ||v|| cos(θ), where θ is the angle between them. If two vectors are orthogonal (perpendicular, θ = 90°), their dot product is exactly 0. If they point in identical directions, their dot product is maximized.',
      equation: '\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^D u_i v_i = \\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2 \\cos(\\theta)',
    },
    {
      id: 's03-3-explore',
      title: 'Distances: Euclidean (L2) vs Manhattan (L1)',
      eyebrow: '03 // DISTANCE METRICS',
      phase: 'explore',
      interactiveComponent: 'vector-angle-visualizer',
      contentMarkdown:
        'How do we measure distance between points p and q? The Euclidean norm (L2) measures straight-line distance (the hypotenuse). The Manhattan norm (L1) measures grid-like distance along coordinate axes (like taxicabs in Manhattan). Metric choice profoundly impacts clustering and regularization geometry.',
      equation: 'd_{\\text{L2}}(\\mathbf{p}, \\mathbf{q}) = \\sqrt{\\sum_{i=1}^D (p_i - q_i)^2}, \\quad d_{\\text{L1}}(\\mathbf{p}, \\mathbf{q}) = \\sum_{i=1}^D |p_i - q_i|',
    },
    {
      id: 's03-4-predict',
      title: 'Predicting Vector Alignment',
      eyebrow: '04 // PREDICTION CHALLENGE',
      phase: 'predict',
      contentMarkdown:
        'Test your geometric intuition on normalized coordinate vectors.',
      predictionOptions: {
        question:
          'If two normalized unit vectors u and v (||u|| = 1, ||v|| = 1) have a dot product of -1.0, what is the geometric relationship between them?',
        options: [
          'They are perpendicular (orthogonal, 90° angle).',
          'They point in identical directions (0° angle).',
          'They point in exactly opposite directions (180° angle, anti-parallel).',
          'They have zero length.',
        ],
        correctIndex: 2,
        explanation:
          'Since cos(180°) = -1, a dot product of -1 between unit vectors means they point in exactly opposite directions.',
      },
    },
    {
      id: 's03-5-reveal',
      title: 'Variance & The Covariance Matrix',
      eyebrow: '05 // MULTIVARIATE SPREAD',
      phase: 'reveal',
      contentMarkdown:
        'Variance measures the spread of a single feature. Covariance measures whether two features vary together. If feature X increases when Y increases, Cov(X, Y) is positive. For a zero-centered data matrix X_c, the covariance matrix Sigma summarizes all pairwise variances along the diagonal and covariances off-diagonal.',
      equation: '\\boldsymbol{\\Sigma} = \\frac{1}{N} \\mathbf{X}_c^T \\mathbf{X}_c = \\begin{bmatrix} \\text{Var}(X_1) & \\text{Cov}(X_1, X_2) \\\\ \\text{Cov}(X_2, X_1) & \\text{Var}(X_2) \\end{bmatrix}',
    },
    {
      id: 's03-6-under-the-hood',
      title: 'Calculus: Slopes, Partial Derivatives & The Gradient',
      eyebrow: '06 // MULTIVARIATE CALCULUS',
      phase: 'under-the-hood',
      contentMarkdown:
        'The derivative df/dx represents the instantaneous slope of a single variable function. When a loss function depends on multiple weights w = [w_1, w_2, ..., w_d]^T, the partial derivative ∂J/∂w_j measures sensitivity with respect to w_j while holding all other weights constant. The Gradient vector nabla J(w) packs all partial derivatives together, pointing in the direction of steepest loss ascent.',
      equation: '\\nabla J(\\mathbf{w}) = \\left[ \\frac{\\partial J}{\\partial w_1}, \\frac{\\partial J}{\\partial w_2}, \\dots, \\frac{\\partial J}{\\partial w_d} \\right]^T',
    },
    {
      id: 's03-7-break-it',
      title: 'Convex vs Non-Convex Loss Landscapes',
      eyebrow: '07 // OPTIMIZATION TERRAIN',
      phase: 'break-it',
      contentMarkdown:
        'In Linear and Logistic Regression, the loss function is strictly Convex (a smooth bowl with a single global minimum where nabla J = 0). Any downhill step leads toward the global truth. In Deep Neural Networks, loss surfaces are non-convex, populated with saddle points, ravines, and countless local minima.',
      equation: 'J(\\lambda \\mathbf{w}_1 + (1-\\lambda)\\mathbf{w}_2) \\le \\lambda J(\\mathbf{w}_1) + (1-\\lambda) J(\\mathbf{w}_2), \\quad \\forall \\lambda \\in [0, 1]',
    },
    {
      id: 's03-8-code-it',
      title: 'Vector Dot Products & Gradients in NumPy',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Inspect how fast vector dot products and analytical gradients are calculated using vectorized matrix operations.',
      codeSnippet: {
        python: `import numpy as np

# Synthetic feature matrix (N=100, D=3) and weights (D=3)
X = np.random.randn(100, 3)
y = np.random.randn(100)
w = np.array([0.5, -1.2, 2.0])

# 1. Forward Pass: Vectorized predictions y_hat = X @ w
y_hat = X @ w

# 2. Residual error vector
residuals = y_hat - y

# 3. Analytical Gradient for MSE Loss: (2/N) * X^T @ residuals
gradient = (2.0 / len(y)) * (X.T @ residuals)

print("Gradient shape:", gradient.shape)
print("Gradient vector:", np.round(gradient, 4))`,
        sklearn: 'np.dot(u, v) or X @ w',
        explanation:
          'Matrix multiplication X @ w replaces nested Python loops with hardware-accelerated BLAS vector instructions.',
      },
    },
    {
      id: 's03-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Confirm your mathematical foundations across linear algebra, norms, and calculus.',
      questions: [
        {
          id: 's03-q1',
          prompt: 'If the dot product between two non-zero vectors is 0, what does that indicate geometrically?',
          options: [
            'The vectors are parallel and point in the same direction.',
            'The vectors are orthogonal (perpendicular) at a 90° angle.',
            'One of the vectors must contain negative infinity.',
            'The vectors are linearly dependent.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'parallel-myth',
            2: 'inf-myth',
            3: 'dependent-myth',
          },
          explanation:
            'u · v = ||u|| ||v|| cos(90°) = 0. Zero dot product defines perpendicularity.',
          difficulty: 'beginner',
        },
        {
          id: 's03-q2',
          prompt: 'What direction does the gradient vector ∇J(w) always point toward?',
          options: [
            'Directly toward the global minimum.',
            'The direction of steepest instantaneous ascent (fastest increase of J).',
            'The direction of steepest instantaneous descent (fastest decrease of J).',
            'Tangent to the contour line where loss is constant.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'global-min-myth',
            2: 'descent-gradient-confusion',
            3: 'tangent-myth',
          },
          explanation:
            'The gradient points in the direction of steepest ASCENT. This is why gradient descent moves in the negative gradient direction: -nabla J.',
          difficulty: 'intermediate',
        },
        {
          id: 's03-q3',
          prompt: 'What do the diagonal elements of a covariance matrix Σ represent?',
          options: [
            'The correlation between feature 1 and feature D.',
            'The variance of each individual feature.',
            'The eigenvalues of the dataset.',
            'The mean of each column.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'diag-correlation',
            2: 'diag-eigenvalues',
            3: 'diag-means',
          },
          explanation:
            'The i-th diagonal element of Sigma is Cov(X_i, X_i), which is by definition the variance Var(X_i).',
          difficulty: 'beginner',
        },
        {
          id: 's03-q4',
          prompt: 'How does Manhattan distance (L1) differ from Euclidean distance (L2)?',
          options: [
            'L1 sums the absolute differences; L2 takes the square root of the sum of squared differences.',
            'L1 can only be calculated on binary vectors.',
            'L2 distance is always greater than or equal to L1 distance.',
            'L1 distance is rotationally invariant; L2 is not.',
          ],
          correctIndex: 0,
          misconceptionMap: {
            1: 'binary-l1',
            2: 'metric-inequality-inversion',
            3: 'rotation-invariance-reversal',
          },
          explanation:
            'L1 is taxicab distance (sum of absolute coordinate shifts), while L2 is straight-line Euclidean distance.',
          difficulty: 'intermediate',
        },
        {
          id: 's03-q5',
          prompt: 'What is the key property of a strictly convex loss function?',
          options: [
            'It contains multiple local minima of equal depth.',
            'Any local minimum is guaranteed to be the unique global minimum.',
            'Its gradient is zero everywhere.',
            'It can only be solved with analytical normal equations, not gradient descent.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'multi-local-convex',
            2: 'zero-grad-myth',
            3: 'numerical-constraint',
          },
          explanation:
            'Convexity guarantees that every local stationary point with zero gradient is the true global minimum.',
          difficulty: 'intermediate',
        },
      ],
    },
    {
      id: 's03-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have mastered vector geometry, dot products, distance norms, covariance matrices, and the calculus of gradients. Next, advance into Stage 04: The Learning Problem & Generalization to understand how models learn from data without simply memorizing training samples.',
    },
  ],
};
