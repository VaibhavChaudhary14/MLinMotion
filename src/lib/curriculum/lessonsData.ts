import { Lesson } from '@/types';

export const LESSONS_REGISTRY: Record<string, Lesson> = {
  // =========================================================================
  // 1. K-MEANS CLUSTERING
  // =========================================================================
  kmeans: {
    id: 'kmeans',
    algorithmId: 'kmeans',
    title: 'K-Means Clustering: Lloyd’s Algorithm & Partitioning',
    subtitle: 'From random spatial seeding to deterministic Voronoi convergence.',
    durationMinutes: 18,
    prerequisites: ['Distance Metrics', 'Euclidean Norm'],
    learningObjectives: [
      'Understand the iterative coordinate descent of Lloyd’s algorithm.',
      'Differentiate between assignment phase and centroid update phase.',
      'Recognize inertia objective minimization and its sensitivity to local minima.',
      'Identify topological failure cases on non-spherical clusters.',
    ],
    steps: [
      {
        id: 's1-hook',
        title: 'The Unlabeled Spatial Riddle',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'Imagine an astronomy observatory cataloging the coordinates of millions of unclassified celestial bodies. No labels exist. How do we mathematically group these stars into distinct galactic clusters without human preconceptions?',
      },
      {
        id: 's2-intuition',
        title: 'Centroid Gravitational Basins',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'K-Means places $K$ synthetic reference points called centroids ($\\boldsymbol{\\mu}_1, \\dots, \\boldsymbol{\\mu}_K$). Each data point is pulled toward its nearest centroid, partitioning the continuous space into polygonal Voronoi boundary cells.',
      },
      {
        id: 's3-explore',
        title: 'Interactive Coordinate Sandbox',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'kmeans-sandbox',
        contentMarkdown:
          'Observe how the number of centroids $K$ completely reshapes the partition boundaries. Each point strictly belongs to the partition whose centroid minimizes squared Euclidean distance.',
      },
      {
        id: 's4-predict',
        title: 'Predicting the Next Step',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If a centroid has NO data points assigned to it during an iteration ($|S_k| = 0$), what occurs mathematically during the update phase?',
        predictionOptions: {
          question: 'What happens when $|S_k| = 0$ in the update equation?',
          options: [
            'Division by zero occurs in the mean computation (1 / |S_k|).',
            'The centroid coordinates double automatically.',
            'The centroid jumps to the origin (0, 0).',
            'The inertia score becomes negative.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! Computing the arithmetic mean $\\boldsymbol{\\mu}_k = \\frac{1}{|S_k|} \\sum \\mathbf{x}^{(i)}$ involves dividing by $|S_k|$. Production libraries like scikit-learn handle this by re-seeding orphaned centroids at the point furthest from all other centroids.',
        },
      },
      {
        id: 's5-reveal',
        title: 'The Lloyd Iteration Cycle',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Lloyd’s algorithm strictly alternates between two optimization steps: (1) Assign each point to its closest centroid, and (2) Move each centroid to the mean of its cluster. Inertia is guaranteed to decrease or remain equal at every single step.',
      },
      {
        id: 's6-under-the-hood',
        title: 'Mathematical Formulation & Objective',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: 'J(\\mathbf{c}, \\boldsymbol{\\mu}) = \\sum_{i=1}^{m} \\left\\Vert \\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_{c^{(i)}} \\right\\Vert^2',
        contentMarkdown:
          'The objective function $J$ is the Within-Cluster Sum of Squares (WCSS). Because $J$ is non-convex in both variables simultaneously, Lloyd’s algorithm is a greedy coordinate descent that converges to a local minimum, not necessarily the global optimum.',
      },
      {
        id: 's7-break-it',
        title: 'Break The Algorithm: Concentric Rings',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-kmeans-rings',
        contentMarkdown:
          'K-Means fundamentally assumes spherical clusters of comparable density. When presented with two concentric rings, straight Voronoi boundaries slice across natural topological curves, failing completely.',
      },
      {
        id: 's8-code-it',
        title: 'Production Python Bridge',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Connect the visual geometry directly to Scikit-Learn and NumPy.',
        codeSnippet: {
          sklearn: `from sklearn.cluster import KMeans\n\nmodel = KMeans(n_clusters=3, init="k-means++", n_init=10, random_state=42)\nlabels = model.fit_predict(X)\ncentroids = model.cluster_centers_\ninertia = model.inertia_`,
          python: `import numpy as np\nfrom scipy.spatial.distance import cdist\n\n# Lloyd Iteration Step\ndists = cdist(X, centroids, metric="sqeuclidean")\nlabels = np.argmin(dists, axis=1)\nnew_centroids = np.array([X[labels == k].mean(axis=0) for k in range(k)])`,
          explanation: 'n_init=10 executes 10 independent runs with different initial seeds, selecting the run with minimum inertia to guard against local traps.',
        },
      },
      {
        id: 's9-assessment',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your conceptual and mathematical understanding.',
        questions: [
          {
            id: 'km-q1',
            prompt: 'Does K-means convergence guarantee finding the global minimum of inertia J?',
            options: [
              'No, Lloyd’s algorithm is a local heuristic that can become trapped in local minima.',
              'Yes, because inertia is strictly convex in both variables simultaneously.',
              'Yes, provided we run at least 100 iterations.',
              'No, K-means never converges numerically.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'kmeans-global-optimum' },
            explanation: 'Lloyd’s algorithm performs coordinate-wise optimization. It is sensitive to initial centroid placement and frequently settles in local minima.',
            difficulty: 'intermediate',
          },
          {
            id: 'km-q2',
            prompt: 'Why does K-means fail on concentric circles?',
            options: [
              'Because Voronoi boundaries are linear hyperplanes based on Euclidean distance.',
              'Because concentric rings have zero feature variance.',
              'Because K-means requires strictly non-negative features.',
              'Because distance metrics cannot be computed on curved paths.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'inertia-determines-k' },
            explanation: 'The Euclidean distance metric partitions space into convex polyhedra. It cannot form non-convex, topological ring partitions.',
            difficulty: 'intermediate',
          },
          {
            id: 'km-q3',
            prompt: 'What does the K-means++ initialization heuristic accomplish?',
            options: [
              'It seeds initial centroids far apart from each other using D(x)² probability weighting.',
              'It automatically finds the optimal value of K without human intervention.',
              'It converts the objective function into a convex quadratic problem.',
              'It normalizes feature variances to zero.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'inertia-determines-k' },
            explanation: 'K-means++ selects initial seeds with probability proportional to the squared distance to existing centroids, guaranteeing an O(log K) competitive bound.',
            difficulty: 'intermediate',
          },
          {
            id: 'km-q4',
            prompt: 'If you set K equal to the number of data points (K = N), what is the value of inertia?',
            options: [
              'Inertia J equals exactly 0, but the model has zero generalizability.',
              'Inertia J reaches its maximum possible theoretical bound.',
              'Inertia becomes undefined due to matrix singularity.',
              'Inertia equals the total dataset variance.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'inertia-determines-k' },
            explanation: 'When every point is its own centroid, the distance to centroid is zero everywhere. Thus inertia drops to 0, demonstrating why lower inertia alone does not mean a better K.',
            difficulty: 'advanced',
          },
          {
            id: 'km-q5',
            prompt: 'Why does feature scaling (e.g. StandardScaler) drastically impact K-means results?',
            options: [
              'Because Euclidean distance is dominated by features with arbitrarily large numerical scales.',
              'Because K-means requires all features to have zero covariance.',
              'Because unscaled features cause matrix non-invertibility.',
              'Because centroids cannot be updated on features larger than 100.',
            ],
            correctIndex: 0,
            misconceptionMap: { 2: 'pca-preserves-labels' },
            explanation: 'If feature A ranges from 0 to 10,000 (e.g. salary) and feature B ranges from 0 to 5 (e.g. rating), feature A will completely dominate Euclidean distance calculations.',
            difficulty: 'beginner',
          },
        ],
      },
      {
        id: 's10-mastery',
        title: 'Synthesis & End-to-End Hand-off',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You have mastered the mechanics, objective function, and limitations of K-Means. Now bridge your understanding into practice by testing this algorithm on real datasets or comparing its inductive bias with density-based models.',
      },
    ],
  },

  // =========================================================================
  // 2. LINEAR REGRESSION
  // =========================================================================
  'linear-regression': {
    id: 'linear-regression',
    algorithmId: 'linear-regression',
    title: 'Ordinary Least Squares: Closed-Form Derivations & Residuals',
    subtitle: 'Deriving the normal equations and measuring continuous prediction error.',
    durationMinutes: 20,
    prerequisites: ['Vectors & Matrices', 'Convex Functions'],
    learningObjectives: [
      'Understand how Ordinary Least Squares defines and minimizes vertical residuals.',
      'Derive the closed-form normal equations via matrix calculus.',
      'Interpret R² coefficient of determination and recognize its limitations.',
      'Examine high leverage points and outlier sensitivity.',
    ],
    steps: [
      {
        id: 'lr-1',
        title: 'The Continuous Estimation Problem',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'Given years of education, test scores, and market dynamics, how can an algorithm predict exact monetary salaries rather than broad categories? We seek a mathematical line that minimizes continuous error.',
      },
      {
        id: 'lr-2',
        title: 'The Linear Hypothesis & Residuals',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'A simple linear model assumes $\\hat{y} = w x + b$. For any observed point $(x^{(i)}, y^{(i)})$, the difference $e_i = y^{(i)} - \\hat{y}^{(i)}$ is the vertical error residual. Our goal is to find $w$ and $b$ such that the sum of squared vertical residuals is minimized.',
      },
      {
        id: 'lr-3',
        title: 'Interactive 2D Regression Canvas',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'regression-sandbox',
        contentMarkdown:
          'Drag data points or inject noise. Observe how the analytical OLS line shifts instantly to re-balance the positive and negative residuals.',
      },
      {
        id: 'lr-4',
        title: 'Predicting Leverage & Outliers',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If we place a single extreme outlier far out on the x-axis with an anomalously low y-value, what happens to the slope of the OLS line?',
        predictionOptions: {
          question: 'What is the impact of an isolated high-leverage outlier on OLS?',
          options: [
            'The slope tilts heavily toward the outlier because squaring penalizes large residuals quadratically.',
            'The slope remains completely unchanged because OLS ignores points outside the mean.',
            'The intercept shifts but the slope is mathematically invariant.',
            'The R² score automatically increases to 1.0.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! Because OLS squares the residuals ($e_i^2$), an error of 10 costs 100, while an error of 1 costs 1. The optimization sacrifices many small residuals to accommodate a single high-leverage extreme outlier.',
        },
      },
      {
        id: 'lr-5',
        title: 'Analytical Closed-Form Solution',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Unlike iterative models that require step tuning, Ordinary Least Squares has an exact closed-form analytical solution derived by setting the gradient of MSE to zero: $\\boldsymbol{\\theta} = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}$.',
      },
      {
        id: 'lr-6',
        title: 'Mathematical Formulation & R²',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: 'R^2 = 1 - \\frac{\\sum_{i=1}^{m} (y^{(i)} - \\hat{y}^{(i)})^2}{\\sum_{i=1}^{m} (y^{(i)} - \\bar{y})^2} = 1 - \\frac{\\text{SSE}}{\\text{SST}}',
        contentMarkdown:
          'R² quantifies the proportion of variance explained by the model compared to the baseline mean $\\bar{y}$. If a non-optimal model performs worse than simply predicting the mean $\\bar{y}$, R² can actually be negative!',
      },
      {
        id: 'lr-7',
        title: 'Break The Algorithm: Non-Linearity & Leverage',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-regression-outliers',
        contentMarkdown:
          'Test Ordinary Least Squares on sinusoidal or quadratic data. A straight line cannot capture curvature, resulting in patterned residual distributions that violate the Gauss-Markov assumptions.',
      },
      {
        id: 'lr-8',
        title: 'Scikit-Learn vs Closed-Form NumPy',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Connect the normal equation directly to Python.',
        codeSnippet: {
          sklearn: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression(fit_intercept=True)\nmodel.fit(X, y)\nw = model.coef_\nb = model.intercept_\nr2 = model.score(X, y)`,
          python: `import numpy as np\n\n# Analytical Normal Equation: theta = (X^T X)^(-1) X^T y\nX_b = np.c_[np.ones((len(X), 1)), X]\ntheta = np.linalg.pinv(X_b.T.dot(X_b)).dot(X_b.T).dot(y)\nb = theta[0]\nw = theta[1:]`,
          explanation: 'np.linalg.pinv uses SVD to compute the pseudo-inverse, ensuring numerical stability even if X^T X is singular or rank-deficient.',
        },
      },
      {
        id: 'lr-9',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your understanding of linear models and residuals.',
        questions: [
          {
            id: 'lr-q1',
            prompt: 'Can R² (coefficient of determination) ever be negative?',
            options: [
              'Yes, when evaluating on test data if the model predicts worse than the simple horizontal mean line.',
              'No, because R² is squared and mathematically bounded in [0, 1].',
              'No, R² cannot be computed if residuals are non-zero.',
              'Yes, but only if all target values y are negative.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'R² = 1 - SSE/SST. If the sum of squared errors SSE exceeds the total sum of squares SST around the mean, R² becomes strictly negative.',
            difficulty: 'intermediate',
          },
          {
            id: 'lr-q2',
            prompt: 'What happens to OLS computation if two feature columns are perfectly collinear (e.g. height in cm and height in meters)?',
            options: [
              'The matrix X^T X is singular (determinant = 0), so its inverse does not exist.',
              'The regression slope doubles automatically.',
              'The residual errors drop to negative infinity.',
              'The R² score drops to exactly 0.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Perfect multicollinearity reduces matrix rank, causing X^T X to be non-invertible without regularization (such as Ridge/L2).',
            difficulty: 'intermediate',
          },
          {
            id: 'lr-q3',
            prompt: 'Why does OLS minimize vertical residuals (y - y_hat) rather than perpendicular Euclidean distances to the line?',
            options: [
              'Because the independent feature x is assumed to be known exactly, while uncertainty lies in target y.',
              'Because perpendicular distances cannot be calculated in 2D space.',
              'Because vertical residuals guarantee zero computation time.',
              'Because target labels y are always categorical.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Standard regression models y as a conditional distribution P(y|x). Minimizing perpendicular distances corresponds to Total Least Squares / PCA.',
            difficulty: 'advanced',
          },
          {
            id: 'lr-q4',
            prompt: 'What is the sum of raw residuals sum(y^(i) - y_hat^(i)) in an OLS model that includes an intercept term?',
            options: [
              'Exactly zero, because the normal equations force the derivative with respect to bias b to be zero.',
              'Always positive due to squaring.',
              'Equal to the variance of the target variable.',
              'Equal to the mean squared error.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Setting dJ/db = -(2/m) * sum(y - y_hat) = 0 guarantees that the arithmetic sum of residuals is mathematically zero.',
            difficulty: 'intermediate',
          },
          {
            id: 'lr-q5',
            prompt: 'How does Ridge Regression (L2 regularization) modify the normal equations?',
            options: [
              'It adds lambda * I to X^T X, ensuring the matrix is strictly invertible and penalizing large weights.',
              'It removes the intercept term b from all calculations.',
              'It converts the squared loss into absolute value loss.',
              'It scales all feature columns by the learning rate.',
            ],
            correctIndex: 0,
            misconceptionMap: { 2: 'gradient-is-loss' },
            explanation: 'theta = (X^T X + lambda * I)^(-1) X^T y ensures strict positive-definiteness, shrinking coefficients and preventing explosion under multicollinearity.',
            difficulty: 'advanced',
          },
        ],
      },
      {
        id: 'lr-10',
        title: 'Mastery & Next Steps',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You understand analytical Ordinary Least Squares, residual mechanics, and leverage vulnerability. Next: Explore Gradient Descent to see how models optimize when datasets are too massive for matrix inversion.',
      },
    ],
  },

  // =========================================================================
  // 3. GRADIENT DESCENT
  // =========================================================================
  'gradient-descent': {
    id: 'gradient-descent',
    algorithmId: 'gradient-descent',
    title: 'Gradient Descent: Convex Landscapes & First-Order Optimization',
    subtitle: 'Navigating cost terrain through partial derivatives and step tuning.',
    durationMinutes: 20,
    prerequisites: ['Loss Functions', 'Derivatives'],
    learningObjectives: [
      'Understand the geometric meaning of the gradient vector as the direction of steepest ascent.',
      'Analyze the critical role of learning rate alpha in convergence vs divergence.',
      'Distinguish between cost height (loss) and terrain slope (gradient).',
      'Diagnose oscillation and ravines in ill-conditioned loss surfaces.',
    ],
    steps: [
      {
        id: 'gd-1',
        title: 'The Mountain Fog Metaphor',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'Imagine standing on a steep mountain enveloped in thick fog with zero visibility. You cannot see the lowest valley. How can you reliably reach the bottom by feeling only the tilt of the ground beneath your feet?',
      },
      {
        id: 'gd-2',
        title: 'The Negative Gradient Vector',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'The gradient $\\nabla J(\\boldsymbol{\\theta})$ is a vector pointing in the direction of steepest ASCENT. To minimize the cost function, we step in the exact opposite direction: $-\\nabla J(\\boldsymbol{\\theta})$.',
      },
      {
        id: 'gd-3',
        title: 'Interactive 1D/2D Optimization Basin',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'gd-sandbox',
        contentMarkdown:
          'Take manual steps down the quadratic loss bowl. Watch how the step size naturally shrinks as the slope flattens near the minimum.',
      },
      {
        id: 'gd-4',
        title: 'Predicting Learning Rate Overshoot',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If we multiply the learning rate $\\alpha$ by 10 on a steep loss surface, what happens during the very next update step?',
        predictionOptions: {
          question: 'What occurs when learning rate exceeds the stability threshold (alpha > 2/L)?',
          options: [
            'The step overshoots the valley floor and lands higher up on the opposite wall, leading to explosive divergence.',
            'The algorithm reaches the minimum in exactly 1/10th the number of steps.',
            'The gradient automatically flips its sign to prevent errors.',
            'The weights freeze and stop updating.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! When $\\alpha > 2/L$ (where $L$ is the Lipschitz constant of the gradient), step sizes grow larger on every oscillation, causing numerical explosion to infinity ($J \\to \\infty$).',
        },
      },
      {
        id: 'gd-5',
        title: 'First-Order Parameter Updates',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Every parameter update follows the universal first-order rule: $\\theta_j \\leftarrow \\theta_j - \\alpha \\frac{\\partial J}{\\partial \\theta_j}$. The magnitude of the step is proportional to both the learning rate and the steepness of the terrain.',
      },
      {
        id: 'gd-6',
        title: 'Mathematical Formulation & Partial Derivatives',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: '\\frac{\\partial J}{\\partial w} = -\\frac{2}{m} \\sum_{i=1}^{m} x^{(i)} (y^{(i)} - \\hat{y}^{(i)}), \\quad \\frac{\\partial J}{\\partial b} = -\\frac{2}{m} \\sum_{i=1}^{m} (y^{(i)} - \\hat{y}^{(i)})',
        contentMarkdown:
          'For linear regression with MSE loss, the cost landscape is a strictly convex paraboloid. This guarantees that Gradient Descent will converge to the global minimum, provided the learning rate is chosen appropriately.',
      },
      {
        id: 'gd-7',
        title: 'Break The Algorithm: Exploding Gradients',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-gd-divergence',
        contentMarkdown:
          'Set learning rate $\\alpha = 0.0003$ in the lab. Watch the parameters oscillate across the ravine and diverge exponentially.',
      },
      {
        id: 'gd-8',
        title: 'NumPy Vectorized Implementation',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Connect the derivative formulas to vector math in Python.',
        codeSnippet: {
          sklearn: `from sklearn.linear_model import SGDRegressor\n\nmodel = SGDRegressor(max_iter=1000, tol=1e-3, eta0=0.01, penalty="l2")\nmodel.fit(X, y)`,
          python: `import numpy as np\n\ndef gradient_descent_step(X, y, w, b, lr):\n    m = len(X)\n    y_hat = X.dot(w) + b\n    error = y - y_hat\n    dw = -(2/m) * X.T.dot(error)\n    db = -(2/m) * np.sum(error)\n    w -= lr * dw\n    b -= lr * db\n    return w, b`,
          explanation: 'Vector dot products replace slow Python for-loops, allowing billions of gradient updates per second on GPUs.',
        },
      },
      {
        id: 'gd-9',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your understanding of optimization landscapes.',
        questions: [
          {
            id: 'gd-q1',
            prompt: 'Does a low loss J value imply that the gradient magnitude is also small?',
            options: [
              'No, loss is terrain height while gradient is terrain slope; a cliff near zero elevation can have massive gradient.',
              'Yes, loss and gradient are proportional at all points.',
              'Yes, because dJ/dw equals J divided by w.',
              'No, gradient can only be computed when loss is zero.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Loss $J(\\theta)$ is the height (error value). Gradient $\\nabla J$ is the slope. A model can have low loss on a steep drop, or high loss on a flat plateau.',
            difficulty: 'intermediate',
          },
          {
            id: 'gd-q2',
            prompt: 'Why does Gradient Descent slow down dramatically as it nears the minimum, even with a constant learning rate?',
            options: [
              'Because the gradient slope naturally approaches zero as the terrain flattens, making the step size shrink.',
              'Because the learning rate is automatically multiplied by 0.9 by Python.',
              'Because the number of data points decreases near the minimum.',
              'Because memory caches saturate after multiple iterations.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'high-lr-speeds-up' },
            explanation: 'Step size = alpha * gradient. As slope approaches 0, alpha * slope naturally diminishes without needing manual decay.',
            difficulty: 'beginner',
          },
          {
            id: 'gd-q3',
            prompt: 'What causes severe zig-zagging / oscillation in 2D Gradient Descent?',
            options: [
              'Ill-conditioned loss surfaces where one feature has much higher curvature than another (ravines).',
              'Random noise in the NumPy pseudo-random generator.',
              'Setting learning rate to exactly 0.',
              'Having more data samples than feature columns.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'high-lr-speeds-up' },
            explanation: 'If feature scales differ widely, the loss contour forms an elongated elliptical valley. Gradients point perpendicularly across the ravine rather than down along its gentle floor.',
            difficulty: 'advanced',
          },
          {
            id: 'gd-q4',
            prompt: 'How does Momentum optimization address the ravine oscillation problem?',
            options: [
              'It accumulates an exponentially decaying moving average of past gradients to cancel cross-ravine oscillations.',
              'It forces all weights to be non-negative.',
              'It computes the exact second derivative Hessian matrix at every step.',
              'It doubles the learning rate after every step.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'high-lr-speeds-up' },
            explanation: 'v = beta * v + alpha * grad. Oscillations in opposing directions cancel out, while consistent velocity along the valley builds momentum.',
            difficulty: 'intermediate',
          },
          {
            id: 'gd-q5',
            prompt: 'What distinguishes Stochastic Gradient Descent (SGD) from Batch Gradient Descent?',
            options: [
              'SGD estimates the gradient from a single random sample (or mini-batch) rather than the full dataset.',
              'SGD cannot be used for linear regression.',
              'SGD guarantees finding the analytical normal equation in one iteration.',
              'SGD evaluates gradients only on the test set.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Full batch evaluates all m samples per step ($O(m)$). Mini-batch SGD computes noisy but computationally fast estimates ($O(B)$), essential for massive web-scale data.',
            difficulty: 'intermediate',
          },
        ],
      },
      {
        id: 'gd-10',
        title: 'Mastery & Synthesis',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You have mastered gradient vectors, step physics, and stability boundaries. Next: Apply first-order optimization to non-linear classification via Logistic Regression.',
      },
    ],
  },

  // =========================================================================
  // 4. LOGISTIC REGRESSION
  // =========================================================================
  'logistic-regression': {
    id: 'logistic-regression',
    algorithmId: 'logistic-regression',
    title: 'Logistic Regression: Sigmoid Probabilities & Decision Cutoffs',
    subtitle: 'Mapping unbounded real numbers into probabilities and evaluating binary boundaries.',
    durationMinutes: 22,
    prerequisites: ['Linear Regression', 'Gradient Descent', 'Logarithms'],
    learningObjectives: [
      'Understand how the sigmoid activation compresses real numbers into valid probabilities [0, 1].',
      'Analyze binary cross-entropy log loss and its convex geometry.',
      'Differentiate between predicted probability and classification decision thresholds.',
      'Evaluate model trade-offs using precision, recall, and the confusion matrix.',
    ],
    steps: [
      {
        id: 'log-1',
        title: 'The Bounded Probability Dilemma',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'If we use standard linear regression to predict tumor malignancy ($0 = \\text{benign}, 1 = \\text{malignant}$), the line outputs nonsensical values like $-0.4$ or $+1.8$. How do we constrain outputs strictly between 0 and 1 while preserving continuous gradient updates?',
      },
      {
        id: 'log-2',
        title: 'The Sigmoid S-Curve',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'The logistic sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ squashes any real value from $-\\infty$ to $+\\infty$ smoothly into $(0, 1)$. When $z = 0$, $\\sigma(0) = 0.5$, representing maximum uncertainty on the decision boundary.',
      },
      {
        id: 'log-3',
        title: 'Interactive Threshold & Boundary Lab',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'logistic-sandbox',
        contentMarkdown:
          'Slide the probability threshold $\\tau$ from 0.1 to 0.9. Observe how the decision boundary line translates across feature space.',
      },
      {
        id: 'log-4',
        title: 'Predicting Threshold Shifts on Recall',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If you lower the classification threshold from $\\tau = 0.5$ down to $\\tau = 0.2$ in cancer detection, what happens to the False Negative count?',
        predictionOptions: {
          question: 'What happens to False Negatives when lowering threshold tau?',
          options: [
            'False Negatives decrease because the model becomes much more eager to flag potential cancer cases.',
            'False Negatives increase because fewer points are classified as positive.',
            'Precision and Recall both increase simultaneously to 100%.',
            'The confusion matrix is unaffected by threshold changes.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! Lowering $\\tau$ requires less evidence to predict positive ($y=1$). While this captures more true cancers (boosting Recall and slashing False Negatives), it increases False Positives, reducing Precision.',
        },
      },
      {
        id: 'log-5',
        title: 'Binary Cross-Entropy Loss',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Squaring error on sigmoid outputs produces a non-convex surface plagued by local minima. Instead, we use Log Loss (Maximum Likelihood), which penalizes confident wrong predictions with infinite cost ($-\\ln(0) \\to \\infty$).',
      },
      {
        id: 'log-6',
        title: 'Mathematical Formulation & Log-Odds',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: 'J(\\mathbf{w}, b) = -\\frac{1}{m} \\sum_{i=1}^{m} \\left[ y^{(i)} \\ln(\\hat{p}^{(i)}) + (1 - y^{(i)}) \\ln(1 - \\hat{p}^{(i)}) \\right]',
        contentMarkdown:
          'Remarkably, the derivative of Log Loss with respect to weights simplifies to the exact same form as linear regression: $\\frac{\\partial J}{\\partial w_j} = \\frac{1}{m} \\sum (\\hat{p}^{(i)} - y^{(i)}) x_j^{(i)}$, enabling clean Gradient Descent updates.',
      },
      {
        id: 'log-7',
        title: 'Break The Algorithm: Severe Class Imbalance',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-logistic-imbalance',
        contentMarkdown:
          'Test Logistic Regression on fraud detection where 99.5% of samples are legitimate. A naive model predicting 0 everywhere achieves 99.5% accuracy but zero recall, proving why raw accuracy is a dangerous metric.',
      },
      {
        id: 'log-8',
        title: 'Scikit-Learn Implementation',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Configure thresholding and probability calibration in Python.',
        codeSnippet: {
          sklearn: `from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression(C=1.0, solver="lbfgs")\nmodel.fit(X, y)\nprobabilities = model.predict_proba(X)[:, 1]\n# Custom thresholding\npredictions = (probabilities >= 0.35).astype(int)`,
          python: `import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef log_loss(y, p):\n    eps = 1e-15\n    p = np.clip(p, eps, 1 - eps)\n    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`,
          explanation: 'predict_proba outputs raw calibrated continuous probabilities, allowing engineers to pick operational decision thresholds suited to domain risk.',
        },
      },
      {
        id: 'log-9',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your understanding of classification metrics and log loss.',
        questions: [
          {
            id: 'log-q1',
            prompt: 'In a medical cancer screening test, which metric is most critical to maximize?',
            options: [
              'Recall (Sensitivity), because missing a malignant cancer (False Negative) can be fatal.',
              'Precision, because false alarms are worse than undiagnosed cancer.',
              'Raw Accuracy, because all classification errors have identical clinical cost.',
              'Training speed in milliseconds.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Recall = TP / (TP + FN). In life-critical medical diagnosis, minimizing False Negatives (maximizing Recall) takes paramount priority.',
            difficulty: 'beginner',
          },
          {
            id: 'log-q2',
            prompt: 'Why can we not use Mean Squared Error (MSE) with the Sigmoid activation function?',
            options: [
              'Because the combination of sigmoid and MSE produces a non-convex loss surface with flat plateaus and local minima traps.',
              'Because MSE requires negative target values.',
              'Because sigmoid cannot be differentiated.',
              'Because the gradient of MSE is always zero.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Sigmoid saturates at 0 and 1, where its derivative is nearly zero. In MSE, this leads to vanishing gradients early in training. Binary Cross-Entropy cancels this saturation term.',
            difficulty: 'advanced',
          },
          {
            id: 'log-q3',
            prompt: 'What is the geometric shape of the decision boundary formed by standard Logistic Regression in 2D space?',
            options: [
              'A straight line defined by w1*x1 + w2*x2 + b = ln(tau / (1 - tau)).',
              'A parabolic curve.',
              'A circle around the origin.',
              'A stepped staircase.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Because the linear combination z = w^T x + b is linear, setting z equal to the log-odds cutoff forms a linear hyperplane in feature space.',
            difficulty: 'intermediate',
          },
          {
            id: 'log-q4',
            prompt: 'What does the F1 score represent mathematically?',
            options: [
              'The harmonic mean of Precision and Recall: 2 * (P * R) / (P + R).',
              'The arithmetic average of Accuracy and Loss.',
              'The ratio of True Positives to False Positives.',
              'The area under the ROC curve.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'The harmonic mean penalizes extreme imbalances heavily. If Precision is 99% but Recall is 1%, the arithmetic mean is 50% while the F1 score collapses to ~2%.',
            difficulty: 'intermediate',
          },
          {
            id: 'log-q5',
            prompt: 'What happens to the logistic regression weights w if the two classes are perfectly linearly separable without regularization?',
            options: [
              'The weights grow toward infinity (||w|| -> infinity) to drive sigmoid output to exactly 0 and 1.',
              'The weights collapse to zero.',
              'The loss function becomes undefined.',
              'The learning rate automatically doubles.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Without L2 regularization, the model continues pushing weights larger to output 1.000... and drive Log Loss to 0, causing severe numerical instability.',
            difficulty: 'advanced',
          },
        ],
      },
      {
        id: 'log-10',
        title: 'Mastery & Synthesis',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You understand the sigmoid transform, decision thresholds, and precision-recall trade-offs. Next: Explore Decision Trees to discover non-linear, hierarchical feature partitioning.',
      },
    ],
  },

  // =========================================================================
  // 5. DECISION TREES
  // =========================================================================
  'decision-trees': {
    id: 'decision-trees',
    algorithmId: 'decision-trees',
    title: 'Decision Trees: Recursive Splits & Impurity Minimization',
    subtitle: 'From orthogonal feature partitioning to pruning and bias-variance control.',
    durationMinutes: 24,
    prerequisites: ['Entropy & Probability', 'Binary Trees'],
    learningObjectives: [
      'Understand how greedy recursive splitting partitions feature space orthogonally.',
      'Compute Gini Impurity and Information Gain entropy mathematically.',
      'Visualize how deep trees memorize noise (overfitting).',
      'Apply regularization constraints: max_depth, min_samples_split, and pruning.',
    ],
    steps: [
      {
        id: 'dt-1',
        title: 'The 20 Questions Game',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'When playing the game of 20 Questions, asking *"Is it a living thing?"* is far more informative than asking *"Is it a Siamese cat?"*. How can an algorithm systematically choose the most informative yes/no question at each step?',
      },
      {
        id: 'dt-2',
        title: 'Orthogonal Axis Cuts',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'Unlike linear models that draw slanted hyperplanes, Decision Trees slice space using strictly axis-aligned cuts ($x_j \\le \\theta$). Repeated splits recursively carve the coordinate plane into a grid of hyper-rectangles.',
      },
      {
        id: 'dt-3',
        title: 'Interactive Tree Hierarchy Lab',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'tree-sandbox',
        contentMarkdown:
          'Adjust the maximum depth slider from 1 to 5. Watch how each additional tree level subdivides existing regions into smaller, purer partitions.',
      },
      {
        id: 'dt-4',
        title: 'Predicting Impurity Gain',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If a candidate split divides a node with 50 Class A and 50 Class B into two child nodes that both contain 25 Class A and 25 Class B, what is the Information Gain?',
        predictionOptions: {
          question: 'What is the Information Gain when child class proportions are identical to the parent?',
          options: [
            'Zero Information Gain, because the impurity has not decreased at all.',
            'Maximum Information Gain, because the split is balanced.',
            'Information Gain equals 1.0.',
            'Negative Information Gain.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! Information Gain is the reduction in impurity: $\\Delta I = I_{\\text{parent}} - \\sum \\frac{N_c}{N} I_c$. If the children have the same class distribution as the parent, the impurity reduction is exactly zero.',
        },
      },
      {
        id: 'dt-5',
        title: 'Gini Impurity vs Entropy',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'Gini impurity measures the probability that a randomly chosen element would be incorrectly labeled if it were randomly labeled according to the distribution in the subset. A pure node with all one class has Gini = 0.0.',
      },
      {
        id: 'dt-6',
        title: 'Mathematical Formulation',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: 'I_G(p) = 1 - \\sum_{k=1}^{K} p_k^2, \\quad H(p) = -\\sum_{k=1}^{K} p_k \\log_2(p_k)',
        contentMarkdown:
          'Gini impurity is computationally faster because it avoids computing transcendental logarithms. In practice, Gini and Entropy yield identical split decisions over 98% of the time.',
      },
      {
        id: 'dt-7',
        title: 'Break The Algorithm: The Unpruned Overfitter',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-tree-depth',
        contentMarkdown:
          'Set maximum depth to unlimited on noisy data. The tree will construct isolated narrow spikes to isolate every single outlier dot, achieving 100% training accuracy but horrific validation error.',
      },
      {
        id: 'dt-8',
        title: 'Scikit-Learn Tree Pruning',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Enforce tree regularizers in Python.',
        codeSnippet: {
          sklearn: `from sklearn.tree import DecisionTreeClassifier, export_text\n\nmodel = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, criterion="gini")\nmodel.fit(X, y)\nprint(export_text(model, feature_names=["petal_l", "petal_w"]))`,
          python: `import numpy as np\n\ndef gini_impurity(labels):\n    if len(labels) == 0: return 0\n    counts = np.bincount(labels)\n    probs = counts / len(labels)\n    return 1.0 - np.sum(probs ** 2)`,
          explanation: 'min_samples_leaf=5 prevents the tree from creating fragile terminal leaves that contain only 1 or 2 noise points.',
        },
      },
      {
        id: 'dt-9',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your understanding of non-parametric trees and overfitting.',
        questions: [
          {
            id: 'dt-q1',
            prompt: 'Why are Decision Trees invariant to monotonic feature scaling (e.g. StandardScaler has zero effect)?',
            options: [
              'Because trees make threshold decisions based on order rankings (x <= theta), which scaling does not change.',
              'Because trees convert all features to text strings.',
              'Because Gini impurity ignores numerical magnitude.',
              'Because trees normalize features internally using L2 norm.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'Whether a feature is scaled in meters or millimeters, the sorting order of the data points is identical, resulting in the exact same optimal threshold.',
            difficulty: 'intermediate',
          },
          {
            id: 'dt-q2',
            prompt: 'What is the maximum theoretical Gini impurity for a balanced binary classification problem (50% Class 0, 50% Class 1)?',
            options: [
              '0.5 (computed as 1 - (0.5² + 0.5²)).',
              '1.0.',
              '0.0.',
              'Infinity.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Gini = 1 - (0.25 + 0.25) = 0.5. For Entropy with base 2, maximum uncertainty is 1.0 bit.',
            difficulty: 'beginner',
          },
          {
            id: 'dt-q3',
            prompt: 'Why are Decision Trees susceptible to high variance?',
            options: [
              'Because a slight change in the training data can cause a completely different root split, altering the entire downstream hierarchy.',
              'Because they require too many matrix inversions.',
              'Because they cannot handle non-numeric categorical features.',
              'Because they have too few parameters.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'r2-is-correlation' },
            explanation: 'Hierarchical greedy splitting propagates early variance downward. Random Forests solve this by averaging hundreds of decorrelated bootstrapped trees.',
            difficulty: 'intermediate',
          },
          {
            id: 'dt-q4',
            prompt: 'How does Cost-Complexity Pruning (ccp_alpha) regularize a decision tree?',
            options: [
              'It penalizes the cost function by adding alpha * |T| (number of terminal leaves), pruning subtrees that provide negligible Gini improvement.',
              'It shrinks the weights of each leaf toward zero.',
              'It drops 50% of the features randomly at each node.',
              'It rounds all split thresholds to integers.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Cost = R(T) + alpha * |T|. Larger alpha values prune more leaves, preventing complex overfitting on training noise.',
            difficulty: 'advanced',
          },
          {
            id: 'dt-q5',
            prompt: 'Why do Decision Trees struggle to approximate simple diagonal boundaries (e.g. y = x)?',
            options: [
              'Because axis-aligned orthogonal cuts must create an inefficient jagged staircase of dozens of rectangular splits.',
              'Because Gini impurity cannot be computed on diagonal lines.',
              'Because diagonal lines require negative numbers.',
              'Because trees cannot perform classification in 2D.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'Each split can only test one feature at a time ($x_1 \\le c$). Approximating a $45^\\circ$ slope requires dozens of steps, consuming high depth.',
            difficulty: 'intermediate',
          },
        ],
      },
      {
        id: 'dt-10',
        title: 'Mastery & Synthesis',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You understand recursive orthogonal splits, Gini impurity, and variance control. Next: Explore Principal Component Analysis to discover how linear algebra rotates coordinate axes to capture maximum variance.',
      },
    ],
  },

  // =========================================================================
  // 6. PRINCIPAL COMPONENT ANALYSIS (PCA)
  // =========================================================================
  pca: {
    id: 'pca',
    algorithmId: 'pca',
    title: 'Principal Component Analysis: Covariance & Dimensionality Reduction',
    subtitle: 'Spectral decomposition of feature covariance into orthogonal variance axes.',
    durationMinutes: 24,
    prerequisites: ['Eigenvalues & Eigenvectors', 'Matrix Multiplication', 'Variance'],
    learningObjectives: [
      'Understand how data centering aligns coordinates with the centroid origin.',
      'Construct and interpret the feature covariance matrix.',
      'Derive principal components as eigenvectors of the covariance matrix.',
      'Differentiate between variance retention and classification separability.',
    ],
    steps: [
      {
        id: 'pca-1',
        title: 'The Shadow on the Wall',
        eyebrow: 'PHASE 01 // HOOK',
        phase: 'hook',
        contentMarkdown:
          'When you cast a shadow of your 3D hand onto a flat 2D wall, you lose one dimension of information. How can you orient your hand so that the shadow retains the maximum amount of detail and recognizable structure?',
      },
      {
        id: 'pca-2',
        title: 'Centering & Variance Maximization',
        eyebrow: 'PHASE 02 // VISUAL INTUITION',
        phase: 'intuition',
        contentMarkdown:
          'PCA begins by shifting the data so its mean is at the origin $(0, 0)$. It then rotates the coordinate axes to align with the directions of maximum spread (variance), discarding axes with minimal information.',
      },
      {
        id: 'pca-3',
        title: 'Interactive Covariance & Eigenvector Lab',
        eyebrow: 'PHASE 03 // EXPLORE',
        phase: 'explore',
        interactiveComponent: 'pca-sandbox',
        contentMarkdown:
          'Inspect the blue principal component vector $\\mathbf{v}_1$. Red dotted lines show the orthogonal projection error discarded when compressing 2D points onto the line.',
      },
      {
        id: 'pca-4',
        title: 'Predicting Reconstruction Error',
        eyebrow: 'PHASE 04 // PREDICT',
        phase: 'predict',
        contentMarkdown:
          'If all data points lie on a perfectly straight diagonal line ($y = 2x$), what percentage of variance is captured by the first principal component PC1?',
        predictionOptions: {
          question: 'What is the explained variance ratio of PC1 when data is perfectly collinear?',
          options: [
            '100% explained variance (eigenvalue lambda_2 = 0), with zero reconstruction error.',
            '50% explained variance because space is 2-dimensional.',
            '0% explained variance.',
            'The variance is undefined due to division by zero.',
          ],
          correctIndex: 0,
          explanation:
            'Correct! When data is collinear, all variation lies strictly along the first eigenvector $\\mathbf{v}_1$. The orthogonal second eigenvalue $\\lambda_2 = 0$, meaning the 2D data can be compressed to 1D with zero loss of information.',
        },
      },
      {
        id: 'pca-5',
        title: 'The Covariance Matrix & Spectral Theorem',
        eyebrow: 'PHASE 05 // REVEAL',
        phase: 'reveal',
        contentMarkdown:
          'The sample covariance matrix $\\mathbf{C} = \\frac{1}{m-1} \\mathbf{X}_c^T \\mathbf{X}_c$ is symmetric and positive semi-definite. By the Spectral Theorem, it has real eigenvalues and orthogonal eigenvectors that form a new coordinate basis.',
      },
      {
        id: 'pca-6',
        title: 'Mathematical Formulation',
        eyebrow: 'PHASE 06 // UNDER THE HOOD',
        phase: 'under-the-hood',
        equation: '\\mathbf{C} \\mathbf{v}_k = \\lambda_k \\mathbf{v}_k, \\quad \\text{Explained Ratio} = \\frac{\\lambda_k}{\\sum_{j=1}^{d} \\lambda_j}',
        contentMarkdown:
          'Eigenvector $\\mathbf{v}_1$ defines the direction of the first principal axis. The corresponding eigenvalue $\\lambda_1$ equals the exact variance of the projected data points along that axis.',
      },
      {
        id: 'pca-7',
        title: 'Break The Algorithm: The Swiss Roll & Label Blindness',
        eyebrow: 'PHASE 07 // BREAK IT',
        phase: 'break-it',
        interactiveComponent: 'break-pca-manifold',
        contentMarkdown:
          'Because PCA is strictly linear and unsupervised, it fails on non-linear manifolds (like a spiral Swiss Roll) and can accidentally discard low-variance dimensions that contain crucial classification boundaries.',
      },
      {
        id: 'pca-8',
        title: 'Scikit-Learn Implementation',
        eyebrow: 'PHASE 08 // CODE IT',
        phase: 'code-it',
        contentMarkdown: 'Compute PCA projection and variance ratios in Python.',
        codeSnippet: {
          sklearn: `from sklearn.decomposition import PCA\n\npca = PCA(n_components=2)\nX_projected = pca.fit_transform(X)\nvariance_ratios = pca.explained_variance_ratio_\neigenvectors = pca.components_`,
          python: `import numpy as np\n\n# 1. Center data\nX_c = X - np.mean(X, axis=0)\n# 2. Covariance matrix\nC = np.cov(X_c, rowvar=False)\n# 3. Eigen decomposition\neigenvalues, eigenvectors = np.linalg.eigh(C)`,
          explanation: 'Scikit-Learn uses SVD (Singular Value Decomposition) directly on X_c rather than computing X_c^T X_c to maintain numerical precision and avoid squaring condition numbers.',
        },
      },
      {
        id: 'pca-9',
        title: 'Diagnostic Understanding Check',
        eyebrow: 'PHASE 09 // ASSESSMENT',
        phase: 'assessment',
        contentMarkdown: 'Test your understanding of spectral dimensionality reduction.',
        questions: [
          {
            id: 'pca-q1',
            prompt: 'Does PCA guarantee that the projected dimensions will preserve class separability for a supervised classifier?',
            options: [
              'No, PCA is completely unsupervised and maximizes variance, which may consist of uninformative noise rather than class separation.',
              'Yes, PCA always maximizes the Fisher linear discriminant ratio.',
              'Yes, because eigenvectors preserve target labels.',
              'No, PCA can only be computed if all classes are balanced.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'PCA maximizes total feature variance without knowing target labels $y$. A high-variance feature can be pure noise, while the discriminative signal lies in a low-variance dimension.',
            difficulty: 'intermediate',
          },
          {
            id: 'pca-q2',
            prompt: 'Why MUST data be centered (mean subtracted) before computing PCA?',
            options: [
              'Otherwise the first principal component will point toward the mean of the data cloud rather than along its variance direction.',
              'Because uncentered data causes matrix inversion errors.',
              'Because eigenvalues become negative if mean is non-zero.',
              'Centering is optional and has zero mathematical effect.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'If the data center is far from (0,0), the vector maximizing sum(x^T v)^2 will simply point from origin to the cluster center rather than aligning with the internal spread.',
            difficulty: 'intermediate',
          },
          {
            id: 'pca-q3',
            prompt: 'What is the mathematical relationship between the principal component eigenvectors v1 and v2?',
            options: [
              'They are strictly orthogonal: their dot product v1 . v2 equals 0.',
              'They are parallel and point in the same direction.',
              'v2 is always twice the length of v1.',
              'Their cross product equals the learning rate.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'Symmetric matrices have mutually orthogonal eigenvectors. This guarantees that the transformed features are completely uncorrelated ($Cov(Z_1, Z_2) = 0$).',
            difficulty: 'beginner',
          },
          {
            id: 'pca-q4',
            prompt: 'Why does feature scaling (StandardScaler) dramatically alter PCA eigenvectors?',
            options: [
              'Because PCA aligns with the largest variance; an unscaled feature measured in millimeters will dominate over meters.',
              'Because scaling changes the rank of the matrix.',
              'Because PCA requires all eigenvalues to be integers.',
              'Because unscaled features cause singular matrices.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'pca-preserves-labels' },
            explanation: 'Variance is scale-dependent. Without standardization, a feature with large numerical values will falsely be selected as the primary component regardless of information content.',
            difficulty: 'intermediate',
          },
          {
            id: 'pca-q5',
            prompt: 'How is reconstruction error measured when compressing from d dimensions to k dimensions?',
            options: [
              'The mean squared Euclidean distance between the original point x and its reconstructed approximation x_hat.',
              'The difference between the first and last eigenvalue.',
              'The determinant of the covariance matrix.',
              'The number of discarded columns.',
            ],
            correctIndex: 0,
            misconceptionMap: { 1: 'gradient-is-loss' },
            explanation: 'Reconstruction error equals the sum of the discarded eigenvalues: sum_{j=k+1}^d lambda_j, measuring the exact variance sacrificed during projection.',
            difficulty: 'advanced',
          },
        ],
      },
      {
        id: 'pca-10',
        title: 'Mastery & Synthesis',
        eyebrow: 'PHASE 10 // MASTERY',
        phase: 'mastery',
        contentMarkdown:
          'You have mastered data centering, covariance matrices, and spectral projections. You have completed the 6 foundational algorithm lessons in ML in Motion!',
      },
    ],
  },
};
