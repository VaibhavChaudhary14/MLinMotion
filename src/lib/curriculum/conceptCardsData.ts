import { ConceptCardUnit } from '@/types/conceptCards';

export const CONCEPT_CARDS_REGISTRY: Record<string, ConceptCardUnit> = {
  // =========================================================================
  // 01 // LINEAR REGRESSION
  // =========================================================================
  'linear-regression': {
    id: 'linear-regression',
    title: 'Linear Regression',
    subtitle: 'Ordinary Least Squares, error residuals, and continuous prediction.',
    eyebrow: '01 // SUPERVISED LEARNING',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    prerequisites: ['Euclidean Norm', 'Vectors & Matrices'],
    nextConceptId: 'gradient-descent',
    labAlgorithmId: 'linear-regression',
    colorAccent: 'vermilion',
    tags: ['Regression', 'OLS', 'Closed-Form', 'Residuals', 'Continuous'],
    nutshell: {
      definition:
        'A fundamental supervised learning algorithm that models the linear relationship between a dependent continuous target variable and one or more independent predictor features by fitting an optimal straight hyperplane.',
      whyExists:
        'Real-world physical, financial, and biological processes often exhibit continuous proportional responses to input stimuli. We need a mathematically principled, interpretable method to quantify these linear effects and forecast unseen values.',
      problemSolved:
        'Eliminates guesswork in predicting numerical targets by finding the single deterministic hyperplane that minimizes the cumulative squared discrepancies between observed targets and model predictions.',
      primaryFormula: {
        latex: '\\hat{y} = w_1 x_1 + w_2 x_2 + \\dots + w_d x_d + b = \\mathbf{w}^T \\mathbf{x} + b',
        label: 'HYPOTHESIS EQUATION',
        explanation: 'w represents feature weights (slopes) and b is the bias (y-intercept).',
      },
      keyCharacteristics: [
        'Predicts continuous real-valued targets (e.g. price, temperature, dosage)',
        'Computable via analytical closed-form normal equations or iterative gradient descent',
        'Directly interpretable: each coefficient w_j reflects target change per unit feature increase',
      ],
    },
    howItWorks: {
      headline: 'From Raw Coordinates to Optimal Line Fitting in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Establish the Linear Hypothesis',
          description:
            'Assume the relationship is governed by y = w·x + b + ε, where ε represents zero-mean Gaussian measurement noise. Each observation x maps to a candidate prediction ŷ.',
          mathDetail: 'y^{(i)} = \\mathbf{w}^T \\mathbf{x}^{(i)} + b + \\epsilon^{(i)}',
          diagramNote: 'Initial line positioned arbitrarily across the coordinate space.',
        },
        {
          stepNumber: 2,
          title: 'Calculate Error Residuals',
          description:
            'For every observation point, calculate the vertical deviation between the ground-truth value y and the predicted line height ŷ. Positive residuals sit above the line; negative sit below.',
          mathDetail: 'e^{(i)} = y^{(i)} - \\hat{y}^{(i)} = y^{(i)} - (\\mathbf{w}^T \\mathbf{x}^{(i)} + b)',
          diagramNote: 'Vertical Vermilion drop-lines connecting observations to the line.',
        },
        {
          stepNumber: 3,
          title: 'Minimize the Sum of Squared Errors (MSE)',
          description:
            'Square every residual to ensure positive signs and penalize larger errors exponentially. Sum across all m samples to form the convex quadratic objective function J(w, b).',
          mathDetail: 'J(\\mathbf{w}, b) = \\frac{1}{2m} \\sum_{i=1}^{m} \\left( y^{(i)} - (\\mathbf{w}^T \\mathbf{x}^{(i)} + b) \\right)^2',
          diagramNote: 'Convex parabolic loss surface with a single global minimum bowl.',
        },
        {
          stepNumber: 4,
          title: 'Solve Deterministically via Normal Equations',
          description:
            'Set partial derivatives ∂J/∂w = 0 and solve analytically using matrix inversion, yielding the exact global minimum in one computational operation.',
          mathDetail: '\\mathbf{w}^* = (\\mathbf{X}^T \\mathbf{X})^{-1} \\mathbf{X}^T \\mathbf{y}',
          diagramNote: 'Optimal weights locked; residual vector orthogonal to column space of X.',
        },
      ],
      coreLoopSummary:
        'Line parameters are calibrated so the sum of squared vertical residuals is minimized, creating an unbiased estimator under the Gauss-Markov theorem.',
    },
    visualExample: {
      scenarioTitle: 'Real Estate Valuation: Square Footage vs Sale Price',
      relatableScenario:
        'Predicting home market valuation ($ thousands) strictly from habitable interior floor area (hundreds of sq ft). As square footage expands, market price trends upward with realistic variance.',
      inputsDescription: 'Independent feature x = interior area (e.g. 14 to 38 hundred sq ft).',
      intermediateDescription:
        'Calculate error residuals e_i = y_i - (w·x_i + b), squaring each to build the loss surface.',
      outputDescription: 'Continuous predicted property valuation ŷ in thousands of dollars.',
      interactiveType: 'linear-regression',
    },
    variants: {
      summary: 'Five primary variations adapt linear regression to high dimensionality, sparsity, and non-linear data.',
      variants: [
        {
          id: 'ols',
          name: 'Ordinary Least Squares (OLS)',
          tag: 'STANDARD CLOSED-FORM',
          badgeVariant: 'ultramarine',
          howItDiffers: 'No regularization penalties. Minimizes raw sum of squared residuals directly.',
          idealUseCase: 'Low-dimensional clean tabular data where features are uncorrelated and m > d.',
          drawback: 'Severely prone to overfitting and unstable matrix inversion under multicollinearity.',
        },
        {
          id: 'ridge',
          name: 'Ridge Regression (L2 Regularization)',
          tag: 'COEFFICIENT SHRINKAGE',
          badgeVariant: 'amber',
          howItDiffers: 'Appends squared L2 weight penalty λ ||w||² to loss function, shrinking weights toward zero.',
          idealUseCase: 'Features with high multicollinearity or datasets where d approaches m.',
          drawback: 'Never sets weights strictly to zero; all features remain in the final model.',
        },
        {
          id: 'lasso',
          name: 'Lasso Regression (L1 Regularization)',
          tag: 'SPARSE FEATURE SELECTION',
          badgeVariant: 'vermilion',
          howItDiffers: 'Appends absolute L1 penalty λ ||w||₁ which drives non-informative coefficients exactly to zero.',
          idealUseCase: 'High-dimensional genomics or sparse text signals where feature selection is essential.',
          drawback: 'Arbitrarily selects one feature from a group of highly correlated predictors.',
        },
        {
          id: 'elasticnet',
          name: 'ElasticNet Regularization',
          tag: 'L1 + L2 HYBRID',
          badgeVariant: 'sage',
          howItDiffers: 'Combines convex L1 and L2 penalties via mixing parameter α, balancing sparsity and grouping.',
          idealUseCase: 'Correlated feature groups in genomics or spectral sensor data.',
          drawback: 'Requires tuning two distinct regularization hyperparameters (alpha and l1_ratio).',
        },
        {
          id: 'polynomial',
          name: 'Polynomial Regression',
          tag: 'FEATURE BASIS EXPANSION',
          badgeVariant: 'neutral',
          howItDiffers: 'Expands feature vector with higher-order powers (x², x³, x₁x₂) while keeping parameter weights linear.',
          idealUseCase: 'Non-linear physical curves such as projectile trajectories or thermal decay.',
          drawback: 'High degrees cause catastrophic Runge-phenomenon oscillations at boundary extremes.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Industrial Property Appraisal & Cost Forecasting',
      realWorldScenario:
        'A municipal logistics enterprise predicts commercial warehouse leasing rates based on square footage, ceiling clearance height, and arterial highway proximity.',
      inputsSpecs: 'Feature matrix X (m × d numerical floats), target vector y (m × 1 continuous price).',
      outputsSpecs: 'Model coefficients w (weights per feature), intercept b, and R² goodness-of-fit.',
      keyHyperparameters: [
        { name: 'fit_intercept', type: 'bool', defaultVal: 'True', role: 'Whether to compute independent bias term b.' },
        { name: 'copy_X', type: 'bool', defaultVal: 'True', role: 'Avoids mutating original memory buffer during centering.' },
        { name: 'positive', type: 'bool', defaultVal: 'False', role: 'Constrains coefficients to non-negative values when physically required.' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 1. Realistic feature matrix: [Area (sq ft / 100), Highway Proximity (km)]
X = np.array([
    [14.2, 2.1], [18.5, 3.4], [22.0, 1.2], [26.4, 4.0],
    [30.1, 0.8], [34.8, 2.5], [38.2, 5.1], [42.0, 1.8]
])
# Target: Monthly lease valuation ($ thousands)
y = np.array([45.2, 58.0, 72.4, 80.5, 98.2, 110.0, 118.5, 134.0])

# 2. Fit model using Scikit-Learn
model = LinearRegression(fit_intercept=True)
model.fit(X, y)

# 3. Model inspection
w = model.coef_
b = model.intercept_
y_pred = model.predict(X)
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)

print(f"Optimal Weights: {w.round(3)}, Intercept: {b:.2f}")
print(f"MSE: {mse:.3f} | R² Coefficient: {r2:.3f}")

# 4. Pure NumPy closed-form verification: w* = (X_b^T X_b)^-1 X_b^T y
X_bias = np.c_[np.ones(len(X)), X]
theta_ols = np.linalg.pinv(X_bias.T @ X_bias) @ X_bias.T @ y
print(f"Closed-form verification: b={theta_ols[0]:.2f}, w={theta_ols[1:].round(3)}")`,
      codeExplanation:
        'Scikit-learn utilizes LAPACK driver gelsd (SVD decomposition) rather than raw matrix inversion to maintain numerical stability even if features exhibit near-zero determinants.',
    },
    tradeoffs: {
      advantages: [
        'Unmatched interpretability: each weight directly quantifies feature elasticity.',
        'Extremely low computational latency for real-time edge scoring (simple vector dot product).',
        'Deterministic global optimum: convex quadratic objective eliminates local minima traps.',
        'Solid mathematical foundation with rigorous statistical hypothesis testing (p-values, t-tests).',
      ],
      limitations: [
        'Strict linearity assumption: cannot capture non-linear relationships or complex feature interactions.',
        'Extreme vulnerability to leverage points and extreme outliers due to squared penalty.',
        'Multicollinearity causes high parameter variance and singular matrix inversion failure.',
      ],
      fundamentalAssumptions: [
        'Linearity: target is a linear combination of input features.',
        'Homoscedasticity: constant residual error variance across all predictor ranges.',
        'Independence of errors: residuals are uncorrelated (no autocorrelation).',
        'Normality: error residuals ε are normally distributed with zero mean.',
      ],
      failureModes: [
        {
          symptom: 'Weights explode to astronomically high positive and negative values.',
          underlyingReason: 'Two or more features are collinear; (X^T X) is rank-deficient and singular.',
          fix: 'Apply Ridge (L2) regularization or calculate Variance Inflation Factor (VIF) to drop redundant columns.',
        },
        {
          symptom: 'Model fits bulk data poorly despite high overall R².',
          underlyingReason: 'A single extreme leverage point far on the x-axis pulls the fitted line toward itself.',
          fix: 'Inspect Cook distance, apply Huber robust regression, or trim anomalous leverage observations.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Linear Regression minimizes the sum of squared vertical residuals (e_i = y_i - ŷ_i).',
        'The loss function is strictly convex quadratic, guaranteeing a unique global minimum.',
        'Feature weights represent the partial derivative ∂ŷ/∂x_j: unit change in feature holding all others constant.',
        'When collinearity or overfitting threatens stability, Ridge (L2) or Lasso (L1) regularization is imperative.',
      ],
      misconception: {
        myth: 'A high R² score (e.g. 0.95) guarantees that the linear regression model is valid and accurate.',
        reality:
          'R² only measures the fraction of variance explained. Anscombe Quartet proves that non-linear parabolas or single severe outliers can yield identical high R² values with completely invalid models. Always plot residual distributions.',
        whyLearnersConfuseIt:
          'Textbooks often introduce R² as the ultimate metric without emphasizing residual normality checks.',
      },
      recallQuestion: {
        id: 'recall-linreg-1',
        question:
          'What happens to the analytical normal equation w* = (X^T X)^(-1) X^T y if two features in X are perfectly identical?',
        options: [
          'The matrix (X^T X) becomes non-invertible (singular) because its determinant is exactly zero.',
          'The weights for both features automatically double in magnitude.',
          'The intercept b automatically shifts to the origin (0, 0).',
          'The sum of squared errors becomes negative.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! When two columns are linearly dependent, the columns of X do not form a full rank basis. Consequently, X^T X is singular and its inverse does not exist. Pseudoinverse or L2 regularization (Ridge) resolves this.',
      },
      nextConcept: {
        id: 'gradient-descent',
        title: 'Gradient Descent Optimization',
        whyNext:
          'When data scales to millions of samples or non-linear neural objectives, closed-form matrix inversion becomes computationally intractable O(d³). Gradient descent iteratively walks parameters toward minimal loss.',
      },
    },
  },

  // =========================================================================
  // 02 // GRADIENT DESCENT
  // =========================================================================
  'gradient-descent': {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    subtitle: 'First-order iterative optimization, learning rates, and loss valleys.',
    eyebrow: '02 // OPTIMIZATION',
    category: 'Optimization',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Linear Regression', 'Partial Derivatives'],
    nextConceptId: 'logistic-regression',
    labAlgorithmId: 'gradient-descent',
    colorAccent: 'amber',
    tags: ['Optimization', 'Loss Surface', 'Learning Rate', 'SGD', 'Convergence'],
    nutshell: {
      definition:
        'A generic first-order iterative optimization algorithm that finds local or global minima of differentiable objective functions by repeatedly taking steps proportional to the negative of the gradient at the current parameter position.',
      whyExists:
        'In high-dimensional machine learning (and deep neural networks), objective functions lack analytical closed-form solutions or calculating matrix inverses is prohibitively expensive O(d³). We need an iterative solver that scales linearly with feature dimensionality.',
      problemSolved:
        'Allows computers to calibrate millions of parameters without manual tuning by mathematically following the directional vector of steepest loss reduction.',
      primaryFormula: {
        latex: '\\boldsymbol{\\theta}^{(t+1)} = \\boldsymbol{\\theta}^{(t)} - \\alpha \\nabla_{\\boldsymbol{\\theta}} J(\\boldsymbol{\\theta})',
        label: 'PARAMETER UPDATE RULE',
        explanation: 'θ is the parameter vector, α is the learning rate step-size scalar, and ∇J is the gradient vector.',
      },
      keyCharacteristics: [
        'Universal optimization engine underlying Logistic Regression, SVMs, and Deep Learning',
        'Requires only first-order derivative computations (gradients), avoiding costly second-derivative Hessian matrices',
        'Behavior dictated by learning rate α: too small yields slow crawl; too large causes catastrophic divergence',
      ],
    },
    howItWorks: {
      headline: 'Walking Down the Loss Surface in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Initialize Parameters Arbitrarily',
          description:
            'Select starting weights θ^(0) (often zeros in convex regression, or small Gaussian noise in non-convex neural networks) to establish an initial loss position J(θ^(0)).',
          mathDetail: '\\boldsymbol{\\theta}^{(0)} \\sim \\mathcal{N}(0, 0.01 \\cdot \\mathbf{I})',
          diagramNote: 'A locator pin placed high on the rim of a convex parabolic bowl.',
        },
        {
          stepNumber: 2,
          title: 'Compute Objective Gradient',
          description:
            'Calculate the vector of partial derivatives with respect to each parameter. The gradient vector ∇J always points in the direction of steepest loss ascent.',
          mathDetail: '\\nabla_{\\boldsymbol{\\theta}} J(\\boldsymbol{\\theta}) = \\left[ \\frac{\\partial J}{\\partial \\theta_0}, \\frac{\\partial J}{\\partial \\theta_1}, \\dots, \\frac{\\partial J}{\\partial \\theta_d} \\right]^T',
          diagramNote: 'An arrow vector pointing uphill, perpendicular to loss contour level sets.',
        },
        {
          stepNumber: 3,
          title: 'Take Proportional Step in Opposite Direction',
          description:
            'Negate the gradient vector to point downhill toward lower loss. Scale its magnitude by the learning rate scalar α to determine step size.',
          mathDetail: '\\Delta \\boldsymbol{\\theta} = - \\alpha \\nabla_{\\boldsymbol{\\theta}} J(\\boldsymbol{\\theta})',
          diagramNote: 'Vermilion step vector hopping down into the depression of the valley.',
        },
        {
          stepNumber: 4,
          title: 'Evaluate Termination Condition',
          description:
            'Repeat the cycle until the gradient norm falls below convergence threshold ε (||∇J|| < ε) or maximum allowed epoch iterations are exhausted.',
          mathDetail: '\\|\\boldsymbol{\\theta}^{(t+1)} - \\boldsymbol{\\theta}^{(t)}\\| < \\epsilon',
          diagramNote: 'Tape counter ticks up; parameter trajectory settles into basin minimum.',
        },
      ],
      coreLoopSummary:
        'Parameters systematically slide downhill along the tangent plane of the loss landscape until the gradient flattens to zero.',
    },
    visualExample: {
      scenarioTitle: 'Hiker Descending a Mountain in Heavy Fog',
      relatableScenario:
        'A hiker stranded on a misty peak cannot see the base of the valley. By feeling the slope of the terrain underfoot with a hiking pole, they step downward in the direction of steepest downward pitch.',
      inputsDescription: 'Starting parameter θ_0 and learning rate step scalar α.',
      intermediateDescription:
        'Gradient evaluation ∂J/∂θ indicates tangent pitch; step vector shifts parameter value.',
      outputDescription: 'Converged parameter θ* where gradient slope equals zero.',
      interactiveType: 'gradient-descent',
    },
    variants: {
      summary: 'Optimization variants trade off computational speed, gradient variance, and memory efficiency.',
      variants: [
        {
          id: 'bgd',
          name: 'Batch Gradient Descent (BGD)',
          tag: 'DETERMINISTIC FULL BATCH',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Processes all m training examples to compute one single exact gradient step per epoch.',
          idealUseCase: 'Small to medium datasets where entire dataset easily resides in GPU/CPU RAM.',
          drawback: 'Extremely slow and computationally prohibitive when m exceeds millions of observations.',
        },
        {
          id: 'sgd',
          name: 'Stochastic Gradient Descent (SGD)',
          tag: 'SINGLE-SAMPLE NOISY',
          badgeVariant: 'amber',
          howItDiffers: 'Updates parameters immediately after evaluating a single randomly picked data sample.',
          idealUseCase: 'Streaming real-time data or escaping shallow local minima in non-convex landscapes.',
          drawback: 'High gradient variance causes violent zigzagging; never settles into minimum without decaying α.',
        },
        {
          id: 'mbgd',
          name: 'Mini-Batch Gradient Descent',
          tag: 'INDUSTRY STANDARD',
          badgeVariant: 'sage',
          howItDiffers: 'Evaluates batches of b samples (e.g. 32, 64, 256) balancing vectorization and stability.',
          idealUseCase: 'Universal standard for training modern deep learning and neural network architectures.',
          drawback: 'Introduces batch size b as an additional hyperparameter to tune.',
        },
        {
          id: 'adam',
          name: 'Adam (Adaptive Moment Estimation)',
          tag: 'ADAPTIVE LEARNING RATES',
          badgeVariant: 'vermilion',
          howItDiffers: 'Maintains exponentially decaying running averages of past gradients (momentum) and squared gradients (scaling).',
          idealUseCase: 'Sparse gradients, complex loss ravines, and training deep transformer networks.',
          drawback: 'Can occasionally fail to converge in simple convex settings where SGD with momentum excels.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Large-Scale Online Ad-Click Conversion Optimization',
      realWorldScenario:
        'An ad-tech platform iteratively calibrates click-through-rate prediction weights across millions of continuous user auction events.',
      inputsSpecs: 'Feature vectors X, target vector y, learning rate α, epoch count, batch size.',
      outputsSpecs: 'Calibrated weight vector θ*, loss trajectory history J(t).',
      keyHyperparameters: [
        { name: 'learning_rate (α)', type: 'float', defaultVal: '0.01', role: 'Step size multiplier for weight updates.' },
        { name: 'n_iter_no_change', type: 'int', defaultVal: '5', role: 'Early stopping patience threshold when loss plateau occurs.' },
        { name: 'tol', type: 'float', defaultVal: '1e-4', role: 'Gradient or loss change tolerance to declare numerical convergence.' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np

# 1. Synthetic convex loss problem: J(w) = 0.5 * (w - 3.5)^2 + 2.0
# True minimum lies at w* = 3.5
def compute_loss(w):
    return 0.5 * (w - 3.5)**2 + 2.0

def compute_gradient(w):
    return (w - 3.5)

# 2. Gradient Descent Loop
w = 0.0          # Initial parameter guess
alpha = 0.15     # Learning rate
tolerance = 1e-5
max_epochs = 100
history = []

for epoch in range(1, max_epochs + 1):
    grad = compute_gradient(w)
    loss = compute_loss(w)
    history.append((epoch, w, loss, grad))
    
    # Check stopping criterion
    if abs(grad) < tolerance:
        print(f"Converged at epoch {epoch} with gradient {grad:.6f}")
        break
        
    # Parameter update
    w = w - alpha * grad

print(f"Final Estimated Parameter: w = {w:.4f} (True: 3.5000)")
print(f"Final Minimum Loss: J(w) = {compute_loss(w):.4f}")`,
      codeExplanation:
        'With convex loss functions, setting α below the inverse Lipschitz constant of the gradient ensures monotonic geometric convergence toward the global minimum.',
    },
    tradeoffs: {
      advantages: [
        'Memory efficient: does not construct or invert d × d matrix; scales cleanly to millions of features.',
        'Extremely versatile: applicable to any differentiable objective function.',
        'Mini-batch variants seamlessly leverage parallel hardware GPU matrix multiplication tensor cores.',
      ],
      limitations: [
        'Extremely sensitive to learning rate α: divergence or glacial convergence if misconfigured.',
        'Susceptible to saddle points, ravines, and plateaus where gradients vanish.',
        'Requires rigorous feature scaling (z-score standardization) to prevent elongated elliptical contours.',
      ],
      fundamentalAssumptions: [
        'Differentiability: objective function J(θ) must possess continuous first-order partial derivatives.',
        'Smoothness: gradient does not oscillate infinitely within small neighborhoods.',
        'Feature scale uniformity: unscaled features cause ill-conditioned elliptical loss valleys.',
      ],
      failureModes: [
        {
          symptom: 'Loss values explode to NaN or positive infinity after a few iterations.',
          underlyingReason: 'Learning rate α is too large; the update overshoots the minimum and ascends the opposite valley wall.',
          fix: 'Immediately decrease α by an order of magnitude or implement adaptive learning rate schedules / gradient clipping.',
        },
        {
          symptom: 'Optimization progress stalls completely on narrow elongated ravines.',
          underlyingReason: 'Unscaled input features produce steep vertical walls but flat horizontal floors, causing perpetual oscillation.',
          fix: 'Standardize all input features to zero mean and unit variance using StandardScaler before training.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Gradient points uphill in steepest ascent; multiplying by -α steps downhill.',
        'Learning rate α controls the fundamental speed vs stability trade-off.',
        'Feature standardization is non-negotiable for spherical loss contours and uniform step trajectories.',
        'Mini-batch gradient descent is the workhorse of real-world machine learning and deep neural training.',
      ],
      misconception: {
        myth: 'Choosing a tiny learning rate (e.g. α = 0.000001) is always best because it is safe and will never overshoot.',
        reality:
          'While a tiny α avoids divergence, it causes catastrophic training slowness and causes optimization to get permanently trapped in saddle points or shallow local minima before reaching meaningful parameter values.',
        whyLearnersConfuseIt:
          'Beginners observe that large α causes divergence, concluding that smaller must always be superior.',
      },
      recallQuestion: {
        id: 'recall-gd-1',
        question:
          'Why do machine learning practitioners apply StandardScaler (z-score normalization) to features before running Gradient Descent?',
        options: [
          'It transforms elliptical loss contours into spherical circles, allowing the gradient to point directly toward the minimum.',
          'It converts non-convex loss functions into strictly convex functions.',
          'It forces all features to become integers.',
          'It eliminates the need for computing partial derivatives.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! When features operate on disparate scales (e.g. income in thousands vs age in tens), loss level curves stretch into elongated ravines. Gradients oscillate violently across the narrow axis instead of moving down the floor. Scaling circularizes the contours.',
      },
      nextConcept: {
        id: 'logistic-regression',
        title: 'Logistic Regression & Classification',
        whyNext:
          'Now that you understand gradient optimization, see how it trains the non-linear cross-entropy loss function in binary classification.',
      },
    },
  },

  // =========================================================================
  // 03 // K-MEANS CLUSTERING
  // =========================================================================
  'kmeans': {
    id: 'kmeans',
    title: 'K-Means Clustering',
    subtitle: 'Voronoi partitioning, Lloyd iterative coordinate descent, and centroid convergence.',
    eyebrow: '03 // UNSUPERVISED LEARNING',
    category: 'Unsupervised Learning',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    prerequisites: ['Euclidean Distance', 'Centroids & Arithmetic Mean'],
    nextConceptId: 'pca',
    labAlgorithmId: 'kmeans',
    cinemaStepId: 'kmeans',
    colorAccent: 'ultramarine',
    tags: ['Clustering', 'Unsupervised', 'Voronoi', 'Lloyd Algorithm', 'Inertia'],
    nutshell: {
      definition:
        'A foundational unsupervised partitioning algorithm that segments n multidimensional observations into K mutually exclusive clusters, where each sample belongs to the cluster with the nearest synthetic arithmetic mean (centroid).',
      whyExists:
        'Most real-world datasets lack supervisory ground-truth target labels. We need an automated mathematical mechanism to discover latent geometric groupings and structure within spatial coordinate distributions.',
      problemSolved:
        'Discovers organic cohorts, customer profiles, and spatial clusters without requiring human manual annotation or pre-existing labels.',
      primaryFormula: {
        latex: 'J(\\mathbf{c}, \\boldsymbol{\\mu}) = \\sum_{i=1}^{m} \\left\\Vert \\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_{c^{(i)}} \\right\\Vert^2',
        label: 'INERTIA OBJECTIVE (WCSS)',
        explanation: 'Minimizes the Within-Cluster Sum of Squares between observations and assigned centroids.',
      },
      keyCharacteristics: [
        'Partitions vector space into convex polygonal Voronoi boundary cells',
        'Alternates deterministically between two phases: Assignment Step and Centroid Update Step',
        'Inertia J is guaranteed to monotonically decrease or remain constant at every iteration',
      ],
    },
    howItWorks: {
      headline: 'The Lloyd Iterative Coordinate Descent in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Seed K Centroids in Feature Space',
          description:
            'Choose parameter K. Initialize K synthetic centroid vectors μ_1, ..., μ_K across the data domain, ideally utilizing the probabilistic K-Means++ dispersion heuristic.',
          mathDetail: '\\boldsymbol{\\mu}_1^{(0)}, \\boldsymbol{\\mu}_2^{(0)}, \\dots, \\boldsymbol{\\mu}_K^{(0)} \\in \\mathbb{R}^d',
          diagramNote: 'Three concentric target discs dropped onto an unassigned point cloud.',
        },
        {
          stepNumber: 2,
          title: 'Assignment Step (Voronoi Tessellation)',
          description:
            'Hold centroid coordinates fixed. Calculate Euclidean distance from every point to all K centroids. Assign each observation to its nearest centroid.',
          mathDetail: 'c^{(i)} = \\arg\\min_{k \\in \\{1,\\dots,K\\}} \\left\\Vert \\mathbf{x}^{(i)} - \\boldsymbol{\\mu}_k \\right\\Vert^2',
          diagramNote: 'Points adopt the color and geometric glyph of their nearest centroid.',
        },
        {
          stepNumber: 3,
          title: 'Update Step (Center of Mass Calculation)',
          description:
            'Hold cluster memberships fixed. Recompute each centroid coordinate as the exact arithmetic mean of all data points currently assigned to that partition.',
          mathDetail: '\\boldsymbol{\\mu}_k = \\frac{1}{|S_k|} \\sum_{i \\in S_k} \\mathbf{x}^{(i)}',
          diagramNote: 'Centroids translate along dashed pen trajectories to new geometric centers.',
        },
        {
          stepNumber: 4,
          title: 'Check Convergence and Repeat',
          description:
            'Repeat Steps 2 and 3 until centroid coordinates cease moving (||Δμ|| < ε) or point cluster memberships become completely static.',
          mathDetail: '\\sum_{k=1}^K \\|\\boldsymbol{\\mu}_k^{(t)} - \\boldsymbol{\\mu}_k^{(t-1)}\\| = 0',
          diagramNote: 'Voronoi boundaries lock permanently into place; algorithm converges.',
        },
      ],
      coreLoopSummary:
        'Alternates between minimizing inertia with respect to cluster memberships c (Assignment) and centroid positions μ (Update) until coordinate descent terminates.',
    },
    visualExample: {
      scenarioTitle: 'E-Commerce Customer Persona Discovery',
      relatableScenario:
        'An online retail platform segments customer accounts across two normalized axes: Purchase Frequency (orders/year) vs Average Cart Value ($). Discovers budget frequenters, luxury shoppers, and occasional buyers.',
      inputsDescription: '2D coordinates representing normalized customer behavior metrics.',
      intermediateDescription:
        'Iterative Voronoi assignment shifts points into 3 distinct color cohorts with centroid trajectories.',
      outputDescription: '3 definitive customer segments with identifiable archetypal centers.',
      interactiveType: 'kmeans',
    },
    variants: {
      summary: 'Variants resolve initialization sensitivity, streaming scale, and non-Euclidean distance.',
      variants: [
        {
          id: 'lloyd',
          name: 'Standard Lloyd Algorithm',
          tag: 'CANONICAL K-MEANS',
          badgeVariant: 'neutral',
          howItDiffers: 'Original 1957 batch algorithm. Random initial seeding and full dataset passes.',
          idealUseCase: 'Educational intuition and small benchmark datasets.',
          drawback: 'Highly sensitive to bad random seeding; prone to suboptimal local minima traps.',
        },
        {
          id: 'kmeanspp',
          name: 'K-Means++ Initialization',
          tag: 'SMART SEEDING HEURISTIC',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Probabilistically spaces initial centroids far apart proportional to D(x)² distance.',
          idealUseCase: 'Default standard in all modern production libraries (e.g. scikit-learn).',
          drawback: 'Adds minor initial O(K · n) computational overhead during the initialization pass.',
        },
        {
          id: 'minibatch',
          name: 'Mini-Batch K-Means',
          tag: 'OUT-OF-CORE STREAMING',
          badgeVariant: 'amber',
          howItDiffers: 'Updates centroids using small random subsets of points rather than full dataset.',
          idealUseCase: 'Massive datasets with millions of samples that exceed memory capacity.',
          drawback: 'Slightly higher final inertia than standard full-batch K-Means convergence.',
        },
        {
          id: 'kmedoids',
          name: 'K-Medoids (PAM)',
          tag: 'ROBUST MEDIAN CENTROIDS',
          badgeVariant: 'sage',
          howItDiffers: 'Restricts cluster centers to actual observed data points (medoids) using L1 Manhattan distance.',
          idealUseCase: 'Datasets containing severe outliers or non-Euclidean distance spaces.',
          drawback: 'Higher computational complexity O(n² · K) for pairwise distance evaluation.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Geographic Store Location & Fleet Depot Allocation',
      realWorldScenario:
        'A national postal carrier determines optimal regional parcel hub locations by clustering latitude/longitude delivery density points.',
      inputsSpecs: 'Spatial coordinate matrix X (m × 2 floats), number of clusters K.',
      outputsSpecs: 'Cluster assignments vector, final centroid coordinates, total inertia.',
      keyHyperparameters: [
        { name: 'n_clusters (K)', type: 'int', defaultVal: '8', role: 'Number of clusters and centroids to generate.' },
        { name: 'init', type: 'string', defaultVal: "'k-means++'", role: 'Centroid initialization heuristic to avoid local minima.' },
        { name: 'n_init', type: 'int', defaultVal: '10', role: 'Number of independent seed runs; returns lowest inertia run.' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# 1. Synthetic 2D spatial coordinate clusters
np.random.seed(42)
c1 = np.random.randn(50, 2) + np.array([2.0, 2.0])
c2 = np.random.randn(50, 2) + np.array([8.0, 3.0])
c3 = np.random.randn(50, 2) + np.array([5.0, 8.0])
X = np.vstack([c1, c2, c3])

# 2. Fit K-Means with K-Means++ smart seeding
kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
labels = kmeans.fit_predict(X)

# 3. Retrieve mathematical properties
centroids = kmeans.cluster_centers_
inertia = kmeans.inertia_
silhouette = silhouette_score(X, labels)

print(f"Optimal Centroid Coordinates:\\n{centroids.round(2)}")
print(f"Final Inertia (WCSS): {inertia:.2f}")
print(f"Silhouette Coefficient: {silhouette:.3f}")`,
      codeExplanation:
        'The n_init=10 parameter runs Lloyd algorithm 10 separate times with distinct seeds, retaining the single configuration that achieved the lowest final inertia.',
    },
    tradeoffs: {
      advantages: [
        'Extremely computationally scalable: linear complexity O(n · K · d · i) per iteration.',
        'Simple, mathematically clean, and straightforward to implement and maintain.',
        'Guaranteed convergence: inertia monotonically descends and never oscillates.',
      ],
      limitations: [
        'Requires specifying K in advance (requires elbow heuristic or silhouette analysis).',
        'Assumes spherical, isotropic clusters of roughly equal variance and density.',
        'Catastrophic failure on non-convex manifolds (e.g. concentric circles or intertwined spirals).',
      ],
      fundamentalAssumptions: [
        'Spherical symmetry: variance is uniform in all directions around centroids.',
        'Equal cluster scale: all K clusters have comparable point counts and spatial spread.',
        'Euclidean distance validity: coordinates operate in a continuous metric space.',
      ],
      failureModes: [
        {
          symptom: 'Concentric circular rings are sliced straight down the middle into wedge halves.',
          underlyingReason: 'Voronoi partition boundaries are strictly linear hyperplanes; cannot form curved rings.',
          fix: 'Use density-based clustering like DBSCAN or Spectral Clustering which handle arbitrary topology.',
        },
        {
          symptom: 'A lone extreme outlier pulls a centroid completely away from a legitimate cluster.',
          underlyingReason: 'Arithmetic mean calculation is non-robust and heavily shifted by large distances.',
          fix: 'Filter anomalous outliers or transition to K-Medoids (PAM) with Manhattan L1 distance.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'K-Means alternates between point assignment and centroid arithmetic mean updates.',
        'Inertia J measures Within-Cluster Sum of Squares and strictly decreases during training.',
        'Voronoi boundaries are linear hyperplanes; K-Means fundamentally assumes spherical clusters.',
        'Always use K-Means++ initialization and multiple restarts (n_init) to avoid local minima.',
      ],
      misconception: {
        myth: 'K-Means convergence guarantees that the globally optimal clustering has been discovered.',
        reality:
          'Lloyd algorithm is a local greedy coordinate descent. It converges to a local stationary point that depends heavily on initial centroid positions. Two runs with different seeds can yield drastically different cluster partitions.',
        whyLearnersConfuseIt:
          'Convergence sounds like global optimality, but only guarantees zero further membership swaps.',
      },
      recallQuestion: {
        id: 'recall-kmeans-1',
        question:
          'Why does standard K-Means fail to cluster two concentric circular rings (an inner dot surrounded by an outer ring)?',
        options: [
          'Because Voronoi boundaries are linear hyperplanes derived from Euclidean distance to point centroids.',
          'Because concentric rings have zero geometric variance.',
          'Because K-Means requires all data values to be strictly non-negative.',
          'Because inertia cannot be computed for circular shapes.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! The boundary between any two centroids μ_a and μ_b is the perpendicular bisector hyperplane {x: ||x - μ_a|| = ||x - μ_b||}. Linear hyperplanes can only form convex polyhedral cells, slicing rings into halves.',
      },
      nextConcept: {
        id: 'pca',
        title: 'Principal Component Analysis (PCA)',
        whyNext:
          'In high dimensions, Euclidean distance becomes uniform (curse of dimensionality). PCA projects high-dimensional data into low-dimensional orthogonal variance axes before clustering.',
      },
    },
  },

  // =========================================================================
  // 04 // LOGISTIC REGRESSION
  // =========================================================================
  'logistic-regression': {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    subtitle: 'Sigmoid activation, log-odds, binary cross-entropy, and decision thresholds.',
    eyebrow: '04 // CLASSIFICATION',
    category: 'Supervised Learning',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Linear Regression', 'Gradient Descent', 'Probability & Odds'],
    nextConceptId: 'decision-trees',
    labAlgorithmId: 'logistic-regression',
    colorAccent: 'plum',
    tags: ['Classification', 'Sigmoid', 'Cross-Entropy', 'Log-Odds', 'Probabilities'],
    nutshell: {
      definition:
        'A supervised classification model that predicts the probability of a binary categorical outcome by passing a linear combination of input features through the non-linear logistic sigmoid link function.',
      whyExists:
        'Standard linear regression predicts unbound continuous values from -∞ to +∞, which makes no mathematical sense for bounded probabilities [0, 1] and creates severe distortion when extreme outlier classes exist.',
      problemSolved:
        'Maps any linear score into a rigorously calibrated probability distribution P(Y=1|X) and establishes a clear decision boundary for binary and multiclass classification.',
      primaryFormula: {
        latex: 'P(Y=1|\\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}',
        label: 'SIGMOID LOGISTIC HYPOTHESIS',
        explanation: 'The sigmoid function σ(z) squashes any real value z into the strict probability range (0, 1).',
      },
      keyCharacteristics: [
        'Outputs well-calibrated posterior probabilities P(Y=1|X), not just raw labels',
        'Linear in log-odds space: log(p / (1 - p)) = w^T x + b',
        'Trained using convex Binary Cross-Entropy (Log-Loss) via gradient descent',
      ],
    },
    howItWorks: {
      headline: 'Transforming Linear Dot Products into Probabilities in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Compute Linear Logit Score',
          description:
            'Calculate the standard linear dot product z = w^T x + b. In logistic regression, z represents the log-odds (logit) of the positive class.',
          mathDetail: 'z = \\mathbf{w}^T \\mathbf{x} + b = \\ln\\left( \\frac{p}{1 - p} \\right)',
          diagramNote: 'Unbound real-valued line running from negative to positive infinity.',
        },
        {
          stepNumber: 2,
          title: 'Apply Sigmoid Squashing Function',
          description:
            'Pass the logit score z through the non-linear sigmoid curve σ(z). Large positive logits approach 1.0; large negative logits approach 0.0; z = 0 produces exactly 0.5.',
          mathDetail: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
          diagramNote: 'Smooth S-shaped curve bounded strictly between horizontal asymptotes 0 and 1.',
        },
        {
          stepNumber: 3,
          title: 'Evaluate Binary Cross-Entropy Loss',
          description:
            'Quantify model prediction error using Negative Log-Likelihood. Confident correct predictions yield near-zero loss; confident incorrect predictions receive near-infinite penalty.',
          mathDetail: 'J(\\mathbf{w}, b) = -\\frac{1}{m} \\sum_{i=1}^{m} \\left[ y^{(i)} \\ln(\\hat{p}_i) + (1 - y^{(i)}) \\ln(1 - \\hat{p}_i) \\right]',
          diagramNote: 'Convex loss landscape ensuring zero local minima during gradient descent.',
        },
        {
          stepNumber: 4,
          title: 'Apply Classification Decision Threshold',
          description:
            'Map the continuous probability p̂ to a binary label {0, 1} using decision threshold τ (default 0.5, or adjusted to balance precision vs recall).',
          mathDetail: '\\hat{y} = \\begin{cases} 1 & \\text{if } \\hat{p} \\ge \\tau \\\\ 0 & \\text{if } \\hat{p} < \\tau \\end{cases}',
          diagramNote: 'A vertical divider threshold slicing probabilities into Class 0 or Class 1.',
        },
      ],
      coreLoopSummary:
        'Line parameters are optimized via gradient descent on cross-entropy loss, creating a linear hyper-plane decision boundary where w^T x + b = 0.',
    },
    visualExample: {
      scenarioTitle: 'Medical Diagnostic Screening: Tumor Malignancy Risk',
      relatableScenario:
        'A pathology laboratory assesses biopsy samples to predict whether a cellular growth is malignant (1) or benign (0) based on cell nucleus perimeter and concave points.',
      inputsDescription: 'Normalized cellular feature scores x.',
      intermediateDescription:
        'Compute logit z, pass through sigmoid σ(z) to produce malignancy probability p.',
      outputDescription: 'Binary prediction with calibrated uncertainty percentage (e.g. 87% malignant).',
      interactiveType: 'logistic-regression',
    },
    variants: {
      summary: 'Variations support multi-class targets and regularized high-dimensional feature spaces.',
      variants: [
        {
          id: 'binary',
          name: 'Standard Binary Logistic Regression',
          tag: 'TWO-CLASS PROBABILITY',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Canonical sigmoid activation for mutually exclusive two-class problems.',
          idealUseCase: 'Default prediction, disease diagnosis, spam detection.',
          drawback: 'Cannot classify targets with three or more distinct category labels.',
        },
        {
          id: 'multinomial',
          name: 'Multinomial (Softmax) Regression',
          tag: 'K-CLASS PROBABILITY VECTOR',
          badgeVariant: 'amber',
          howItDiffers: 'Replaces sigmoid with Softmax activation function; outputs probability vector summing to 1.0 across K classes.',
          idealUseCase: 'Image classification, document topic categorization, sentiment analysis.',
          drawback: 'Requires learning K distinct weight vectors; assumes Independence of Irrelevant Alternatives.',
        },
        {
          id: 'regularized',
          name: 'L1/L2 Regularized Logistic Regression',
          tag: 'PENALIZED LOG-LOSS',
          badgeVariant: 'sage',
          howItDiffers: 'Appends L1 (Lasso) or L2 (Ridge) penalty to Cross-Entropy loss to prevent coefficient explosion.',
          idealUseCase: 'High-dimensional text classification or sparse feature vectors.',
          drawback: 'Requires tuning regularization inverse strength hyperparameter C.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Fintech Credit Card Fraud Detection',
      realWorldScenario:
        'A payments gateway flags transactions as fraudulent (1) or legitimate (0) in real time based on transaction velocity and geolocation deviations.',
      inputsSpecs: 'Standardized transaction numerical feature matrix X.',
      outputsSpecs: 'Probability vector p, binary class predictions, ROC-AUC score.',
      keyHyperparameters: [
        { name: 'C', type: 'float', defaultVal: '1.0', role: 'Inverse regularization strength; smaller C creates stronger penalty.' },
        { name: 'penalty', type: 'string', defaultVal: "'l2'", role: 'Norm used in the penalization term (l1, l2, elasticnet).' },
        { name: 'class_weight', type: 'string/dict', defaultVal: 'None', role: 'Balances weights inversely proportional to class frequencies for imbalanced data.' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix

# 1. Feature matrix: [Account Age (months), Login Velocity (attempts/hr)]
X = np.array([
    [2.0, 15.0], [4.0, 12.0], [6.0, 8.0], [1.0, 22.0],
    [24.0, 1.0], [36.0, 2.0], [48.0, 0.5], [60.0, 1.2]
])
# Labels: 1 = Fraudulent Takeover, 0 = Legitimate Customer
y = np.array([1, 1, 1, 1, 0, 0, 0, 0])

# 2. Fit Logistic Regression with L2 Regularization
clf = LogisticRegression(C=1.0, solver='lbfgs')
clf.fit(X, y)

# 3. Retrieve probabilities and evaluate
probs = clf.predict_proba(X)[:, 1] # Probability of Class 1
preds = (probs >= 0.5).astype(int)
auc = roc_auc_score(y, probs)

print(f"Model Intercept b: {clf.intercept_[0]:.3f}")
print(f"Feature Weights w: {clf.coef_[0].round(3)}")
print(f"Predicted Fraud Probabilities:\\n{probs.round(3)}")
print(f"ROC-AUC Score: {auc:.3f}")`,
      codeExplanation:
        'The predict_proba method outputs raw posterior probabilities. In production fraud detection, threshold τ is typically lowered to 0.15 to aggressively prioritize fraud recall over precision.',
    },
    tradeoffs: {
      advantages: [
        'Outputs well-calibrated probabilities rather than brittle black-box decisions.',
        'Extremely fast inference: requires only a dot product and scalar sigmoid lookup.',
        'Convex objective function guarantees unique global minimum during optimization.',
      ],
      limitations: [
        'Linear decision boundary: cannot separate classes with non-linear concentric relationships.',
        'Prone to severe coefficient explosion under complete linear separation.',
        'Vulnerable to extreme outliers in feature space influencing log-odds slopes.',
      ],
      fundamentalAssumptions: [
        'Linearity of independent variables and log-odds: log(p/(1-p)) is a linear function of X.',
        'Independence of observations: sample outcomes are independent.',
        'Absence of extreme multicollinearity between predictor features.',
      ],
      failureModes: [
        {
          symptom: 'Weights and log-loss explode to infinity during unregularized training.',
          underlyingReason: 'Complete separation: a line can divide classes with 100% accuracy, pushing weights to infinity to force probabilities to exactly 0 and 1.',
          fix: 'Apply L2 regularization (lower C in scikit-learn) or add a small Gaussian prior on weights.',
        },
        {
          symptom: 'Model predicts all samples as majority class in imbalanced dataset.',
          underlyingReason: 'When 99% of samples are Class 0, default 0.5 threshold optimizes naive accuracy.',
          fix: 'Set class_weight="balanced" or tune decision threshold τ using precision-recall curves.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Logistic Regression is a classification algorithm, not a continuous regression model.',
        'Sigmoid function maps real numbers to probabilities bounded strictly in (0, 1).',
        'Decision boundary is a linear hyperplane where logit z = w^T x + b = 0 (probability = 0.5).',
        'Cross-Entropy loss provides a strictly convex landscape for gradient optimization.',
      ],
      misconception: {
        myth: 'Because it has "Regression" in its name, Logistic Regression predicts continuous numerical numbers.',
        reality:
          'Logistic Regression is fundamentally a classification model. The name derives from its historical origin of regressing the continuous log-odds logit score before squashing it through the sigmoid.',
        whyLearnersConfuseIt:
          'The historical name confuses beginners who expect it to output continuous values like house prices.',
      },
      recallQuestion: {
        id: 'recall-logistic-1',
        question:
          'When the linear logit score z = w^T x + b equals exactly 0, what is the predicted probability P(Y=1|x)?',
        options: [
          'Exactly 0.50 (50% probability)',
          'Exactly 0.00 (0% probability)',
          'Exactly 1.00 (100% probability)',
          'Undefined (division by zero in sigmoid)',
        ],
        correctIndex: 0,
        explanation:
          'Correct! The sigmoid formula is σ(z) = 1 / (1 + e^-z). When z = 0, e^0 = 1, yielding σ(0) = 1 / (1 + 1) = 0.5. This point lies directly on the decision boundary.',
      },
      nextConcept: {
        id: 'decision-trees',
        title: 'Decision Trees & Partitioning',
        whyNext:
          'When data relationships are fundamentally non-linear or rule-based, linear hyperplanes fail. Decision Trees partition space using orthogonal threshold splits.',
      },
    },
  },

  // =========================================================================
  // 05 // DECISION TREES
  // =========================================================================
  'decision-trees': {
    id: 'decision-trees',
    title: 'Decision Trees',
    subtitle: 'Recursive feature space partitioning, Gini impurity, and hierarchical splits.',
    eyebrow: '05 // TREE-BASED LEARNING',
    category: 'Supervised Learning',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    prerequisites: ['Binary Classification', 'Entropy & Probability'],
    nextConceptId: 'ensemble-learning',
    labAlgorithmId: 'decision-trees',
    colorAccent: 'sage',
    tags: ['Decision Trees', 'Gini Impurity', 'Information Gain', 'Recursive Partitioning', 'CART'],
    nutshell: {
      definition:
        'A non-parametric supervised learning algorithm that makes predictions by recursively partitioning the feature space into orthogonal rectangular regions using a sequence of greedy if-then decision rules inferred from data.',
      whyExists:
        'Linear models assume linear relationships and require extensive feature normalization. Decision Trees handle non-linear relationships naturally, ingest mixed categorical/numerical features, and provide clear human-auditable logic.',
      problemSolved:
        'Captures complex multi-feature interactions and threshold rules without requiring feature scaling or linear assumptions.',
      primaryFormula: {
        latex: 'Gini(S) = 1 - \\sum_{k=1}^{K} p_k^2',
        label: 'GINI IMPURITY FORMULA',
        explanation: 'Measures the probability that a randomly chosen element from set S would be incorrectly labeled.',
      },
      keyCharacteristics: [
        'White-box interpretability: decisions map directly to hierarchical flowcharts',
        'Invariant to monotonic feature scaling (no standardization or normalization required)',
        'Highly expressive but notorious for high variance (overfitting) if unconstrained',
      ],
    },
    howItWorks: {
      headline: 'Recursive Greedy Partitioning in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Evaluate All Candidate Feature Splits',
          description:
            'For every continuous and categorical feature, evaluate all unique split thresholds t that partition dataset S into left and right child subsets S_L and S_R.',
          mathDetail: 'S_L = \\{x \\in S : x_j \\le t\\}, \\quad S_R = \\{x \\in S : x_j > t\\}',
          diagramNote: 'An orthogonal axis-aligned split dividing a 2D scatter space.',
        },
        {
          stepNumber: 2,
          title: 'Compute Purity Improvement (Gini / Gain)',
          description:
            'Calculate the weighted impurity of candidate child nodes and subtract from the parent impurity to find the split that maximizes purity gain.',
          mathDetail: '\\Delta Gini = Gini(S) - \\left( \\frac{|S_L|}{|S|} Gini(S_L) + \\frac{|S_R|}{|S|} Gini(S_R) \\right)',
          diagramNote: 'Two child leaf boxes displaying purified class proportion ratios.',
        },
        {
          stepNumber: 3,
          title: 'Execute Greedy Split',
          description:
            'Permanently partition the dataset along the feature and threshold that yielded the maximum impurity reduction. Create two child branch nodes.',
          mathDetail: '(j^*, t^*) = \\arg\\max_{j, t} \\Delta Gini(S, j, t)',
          diagramNote: 'Tree node forks into two subordinate branch pathways.',
        },
        {
          stepNumber: 4,
          title: 'Recurse Until Stopping Criteria',
          description:
            'Repeat the splitting procedure recursively on each child node until maximum depth is reached, leaf samples drop below threshold, or purity equals 100%.',
          mathDetail: '\\text{depth} \\ge \\text{max\\_depth} \\quad \\lor \\quad |S| \\le \\text{min\\_samples}',
          diagramNote: 'A multi-level hierarchical tree structure with terminal leaf predictions.',
        },
      ],
      coreLoopSummary:
        'Space is recursively divided into axis-parallel hyper-rectangles, with each terminal leaf node predicting the majority class or mean target value.',
    },
    visualExample: {
      scenarioTitle: 'Loan Underwriting Approval Logic',
      relatableScenario:
        'A bank evaluates loan applications based on Credit Score and Debt-to-Income ratio. The tree first checks "Credit Score > 680"; if yes, it evaluates "Debt-to-Income < 35%".',
      inputsDescription: 'Applicant financial metrics: Credit Score (300-850) and DTI (%).',
      intermediateDescription:
        'Root node splits on Credit Score; branch node refines on DTI threshold.',
      outputDescription: 'Deterministic binary decision: Approved vs Rejected.',
      interactiveType: 'decision-trees',
    },
    variants: {
      summary: 'Tree algorithms differ primarily in splitting criterion, branching factor, and pruning strategy.',
      variants: [
        {
          id: 'cart',
          name: 'CART (Classification & Regression Trees)',
          tag: 'BINARY SPLITS & GINI',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Strictly binary splits (two children per node). Uses Gini impurity for classification and MSE for regression. Standard in scikit-learn.',
          idealUseCase: 'General-purpose tabular modeling for both classification and regression.',
          drawback: 'Slightly biased toward selecting features with many distinct numerical split points.',
        },
        {
          id: 'c45',
          name: 'C4.5 / C5.0 Algorithm',
          tag: 'MULTI-WAY & GAIN RATIO',
          badgeVariant: 'amber',
          howItDiffers: 'Uses Information Gain Ratio (Shannon Entropy) and creates multi-way branches for categorical features.',
          idealUseCase: 'Datasets dominated by high-cardinality categorical features.',
          drawback: 'Multi-way splits fragment data quickly into tiny sample sizes.',
        },
        {
          id: 'pruned',
          name: 'Cost-Complexity Pruned Trees',
          tag: 'POST-PRUNING REGULARIZATION',
          badgeVariant: 'sage',
          howItDiffers: 'Grows a full deep tree, then prunes subtrees that add insufficient purity gain relative to a complexity penalty α.',
          idealUseCase: 'Preventing severe overfitting while maintaining human interpretability.',
          drawback: 'Requires cross-validation to select the optimal pruning hyperparameter ccp_alpha.',
        },
      ],
    },
    implementation: {
      industryTitle: 'Customer Churn Prediction & Risk Segmentation',
      realWorldScenario:
        'A telecommunications carrier trains a pruned decision tree to identify subscribers at imminent risk of cancelling service based on contract duration and support calls.',
      inputsSpecs: 'Tabular feature matrix X (numerical and categorical).',
      outputsSpecs: 'Class probabilities, terminal leaf predictions, decision rule path.',
      keyHyperparameters: [
        { name: 'max_depth', type: 'int', defaultVal: 'None', role: 'Limits tree vertical depth to prevent severe memorization.' },
        { name: 'min_samples_split', type: 'int', defaultVal: '2', role: 'Minimum samples required at an internal node to consider splitting.' },
        { name: 'criterion', type: 'string', defaultVal: "'gini'", role: 'Impurity metric: "gini" or "entropy".' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

# 1. Feature matrix: [Monthly Contract (1=Yes,0=No), Support Calls in Last 30 Days]
X = np.array([
    [1, 5], [1, 4], [1, 3], [1, 1],
    [0, 1], [0, 2], [0, 0], [0, 4]
])
# Target: Churned (1 = Left, 0 = Retained)
y = np.array([1, 1, 1, 0, 0, 0, 0, 1])

# 2. Fit CART Decision Tree with depth constraint
tree = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
tree.fit(X, y)

# 3. Inspect learned hierarchical decision rules
tree_rules = export_text(tree, feature_names=['MonthlyContract', 'SupportCalls'])
print("--- LEARNED DECISION LOGIC ---")
print(tree_rules)
print(f"Feature Importances: {tree.feature_importances_.round(3)}")`,
      codeExplanation:
        'Constraining max_depth prevents the tree from creating singleton leaves for every individual training observation, maintaining strong test generalization.',
    },
    tradeoffs: {
      advantages: [
        'Completely white-box: rules can be printed, verified, and audited by compliance officers.',
        'Requires zero feature scaling, z-score normalization, or categorical one-hot explosion.',
        'Seamlessly handles non-linear relationships and high-order feature interactions.',
      ],
      limitations: [
        'Extremely high variance: slight changes in training data produce completely different tree splits.',
        'Greedy heuristic: optimal local split does not guarantee global tree optimality.',
        'Axis-aligned boundaries struggle with diagonal decision boundaries (staircase approximation).',
      ],
      fundamentalAssumptions: [
        'Axis-aligned separability: decision boundaries are parallel to coordinate axes.',
        'Locality of decisions: splitting choices are evaluated greedily without backtracking.',
      ],
      failureModes: [
        {
          symptom: 'Training accuracy is 100%, but test accuracy collapses to 55%.',
          underlyingReason: 'Unconstrained tree depth memorized training noise down to singleton leaves.',
          fix: 'Set max_depth (e.g. 3 to 5), min_samples_leaf=10, or tune ccp_alpha cost-complexity pruning.',
        },
        {
          symptom: 'Tree splits 20 times to approximate a simple diagonal decision boundary.',
          underlyingReason: 'Axis-aligned orthogonal splits must create a jagged staircase to fit diagonal lines.',
          fix: 'Pre-rotate features using PCA or transition to Logistic Regression / Linear SVM.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Decision Trees recursively split data using orthogonal axis-aligned threshold queries.',
        'Splits are chosen greedily by maximizing Gini Impurity or Information Gain reduction.',
        'No feature normalization or scaling is ever required for tree-based algorithms.',
        'Single trees suffer from extreme high variance; they are the foundational weak learner for Random Forests and Boosting.',
      ],
      misconception: {
        myth: 'A deeper decision tree is always smarter and more capable of capturing real patterns.',
        reality:
          'Deep unconstrained decision trees simply memorize training noise and individual outlier coordinates. As depth increases, variance explodes and generalization performance drops precipitously.',
        whyLearnersConfuseIt:
          'Because training error drops to zero as depth expands, learners mistake memorization for understanding.',
      },
      recallQuestion: {
        id: 'recall-tree-1',
        question:
          'What is the Gini Impurity of a node where all 50 samples belong exclusively to Class 1 (a perfectly pure node)?',
        options: [
          '0.00 (Zero impurity)',
          '0.50 (Maximum impurity)',
          '1.00 (Complete disorder)',
          '-1.00 (Negative entropy)',
        ],
        correctIndex: 0,
        explanation:
          'Correct! The Gini formula is 1 - Σ p_k². For a pure node with only Class 1, p_1 = 1.0. Thus, Gini = 1 - (1.0)² = 0. Pure nodes have zero impurity.',
      },
      nextConcept: {
        id: 'ensemble-learning',
        title: 'Ensemble Learning: Forests & Boosting',
        whyNext:
          'Since individual decision trees suffer from high variance and greediness, Ensemble Learning combines hundreds of diverse trees (Random Forests & Gradient Boosting) to achieve state-of-the-art predictive power.',
      },
    },
  },

  // =========================================================================
  // 06 // PRINCIPAL COMPONENT ANALYSIS (PCA)
  // =========================================================================
  'pca': {
    id: 'pca',
    title: 'Principal Component Analysis (PCA)',
    subtitle: 'Data centering, covariance matrices, orthogonal eigenvectors, and variance retention.',
    eyebrow: '06 // DIMENSIONALITY REDUCTION',
    category: 'Dimensionality Reduction',
    difficulty: 'Advanced',
    estimatedMinutes: 10,
    prerequisites: ['Matrix Multiplication', 'Eigenvalues & Eigenvectors', 'Variance & Covariance'],
    nextConceptId: 'kmeans',
    labAlgorithmId: 'pca',
    colorAccent: 'amber',
    tags: ['Dimensionality Reduction', 'Eigenvectors', 'Covariance', 'SVD', 'Unsupervised'],
    nutshell: {
      definition:
        'An unsupervised linear transformation technique that projects high-dimensional data onto a lower-dimensional subspace defined by orthogonal axes (principal components) ordered by the amount of variance they preserve.',
      whyExists:
        'High-dimensional datasets suffer from the Curse of Dimensionality: distances become uniform, models overfit, computation slows, and humans cannot visualize spaces beyond 3 dimensions. We need to compress features while retaining maximum informational signal.',
      problemSolved:
        'Reduces feature dimensionality while preserving maximal geometric variance, eliminating multicollinear redundancy, and enabling 2D/3D visual inspection.',
      primaryFormula: {
        latex: '\\boldsymbol{\\Sigma} = \\frac{1}{n-1} \\mathbf{X}_c^T \\mathbf{X}_c, \\quad \\boldsymbol{\\Sigma} \\mathbf{v}_k = \\lambda_k \\mathbf{v}_k',
        label: 'COVARIANCE EIGENDECOMPOSITION',
        explanation: 'v_k represents orthogonal eigenvector loading directions; λ_k is the variance eigenvalue.',
      },
      keyCharacteristics: [
        'Strictly orthogonal axes: every principal component is mathematically uncorrelated with all others (cov = 0)',
        'Unsupervised: requires no target labels; operates solely on feature geometry',
        'Solved via eigendecomposition of the covariance matrix or Singular Value Decomposition (SVD)',
      ],
    },
    howItWorks: {
      headline: 'Orthogonal Subspace Projection in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Mean-Center the Feature Matrix',
          description:
            'Subtract the column mean from every feature so data is centered at the coordinate origin (0, 0). (Optionally standardize variance if feature scales differ).',
          mathDetail: '\\mathbf{X}_c = \\mathbf{X} - \\boldsymbol{\\mu}_{\\mathbf{x}}',
          diagramNote: 'Data point cloud translated so its geometric center of mass rests at (0, 0).',
        },
        {
          stepNumber: 2,
          title: 'Compute Sample Covariance Matrix',
          description:
            'Calculate the d × d covariance matrix Σ, which captures pairwise linear dependencies and variances across all feature dimensions.',
          mathDetail: '\\boldsymbol{\\Sigma} = \\frac{1}{n - 1} \\mathbf{X}_c^T \\mathbf{X}_c',
          diagramNote: 'A symmetric d × d matrix with variances on diagonal and covariances off-diagonal.',
        },
        {
          stepNumber: 3,
          title: 'Eigendecomposition / SVD',
          description:
            'Calculate the eigenvalues λ_k and corresponding orthogonal eigenvectors v_k of Σ. Eigenvectors indicate the directions of the axes; eigenvalues quantify variance magnitude.',
          mathDetail: '\\boldsymbol{\\Sigma} = \\mathbf{V} \\boldsymbol{\\Lambda} \\mathbf{V}^T, \\quad \\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_d',
          diagramNote: 'Primary eigenvector arrow aligned precisely with the longest spread of points.',
        },
        {
          stepNumber: 4,
          title: 'Project Data onto Top k Eigenvectors',
          description:
            'Select the top k eigenvectors (e.g. k=2) to form projection matrix W_k. Multiply centered data by W_k to produce compressed coordinates.',
          mathDetail: '\\mathbf{Z} = \\mathbf{X}_c \\mathbf{W}_k = \\mathbf{X}_c [\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k]',
          diagramNote: 'Orthogonal drop lines projecting 2D cloud onto a single 1D axis line.',
        },
      ],
      coreLoopSummary:
        'Rotates coordinate axes to align with directions of maximum variance, then drops low-variance orthogonal components to compress dimensionality.',
    },
    visualExample: {
      scenarioTitle: 'Genomic Expression Profiling: 20,000 Genes to 2D Map',
      relatableScenario:
        'A cancer research hospital analyzes expression levels across 20,000 human genes. PCA compresses the 20,000 dimensions down to 2 principal components, immediately revealing distinct tumor subtypes.',
      inputsDescription: 'High-dimensional feature matrix with correlated dimensions.',
      intermediateDescription:
        'Rotating candidate axis dial reveals angle where projected variance reaches maximum.',
      outputDescription: 'Low-dimensional orthogonal coordinates Z retaining 85%+ total variance.',
      interactiveType: 'pca',
    },
    variants: {
      summary: 'Variants address non-linear manifolds, streaming memory constraints, and sparse components.',
      variants: [
        {
          id: 'standard_svd',
          name: 'Standard SVD PCA',
          tag: 'CANONICAL LINEAR PCA',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Applies Singular Value Decomposition directly to X_c without explicitly computing X_c^T X_c.',
          idealUseCase: 'Standard tabular dimensionality reduction and data visualization.',
          drawback: 'Strictly linear; cannot unfold non-linear manifolds (e.g. Swiss Roll).',
        },
        {
          id: 'kernel_pca',
          name: 'Kernel PCA (KPCA)',
          tag: 'NON-LINEAR KERNEL TRICK',
          badgeVariant: 'vermilion',
          howItDiffers: 'Projects data into infinite-dimensional Hilbert space via RBF or Polynomial kernel before linear PCA.',
          idealUseCase: 'Non-linear circular or concentric manifold unwrapping.',
          drawback: 'High computational memory cost O(n²); difficult to invert back to original space.',
        },
        {
          id: 'incremental',
          name: 'Incremental PCA (IPCA)',
          tag: 'OUT-OF-CORE STREAMING',
          badgeVariant: 'amber',
          howItDiffers: 'Processes data in small mini-batches, updating singular vectors incrementally.',
          idealUseCase: 'Gigabyte-scale datasets that cannot fit inside host RAM.',
          drawback: 'Slightly lower numerical precision than full-dataset SVD factorization.',
        },
      ],
    },
    implementation: {
      industryTitle: 'High-Dimensional Facial Image Compression',
      realWorldScenario:
        'A computer vision system compresses 64×64 pixel face images (4,096 dimensions) down to 50 "Eigenface" components for ultra-fast biometric indexing.',
      inputsSpecs: 'High-dimensional feature matrix X (m × 4096 numerical pixel values).',
      outputsSpecs: 'Compressed matrix Z (m × 50), explained variance ratio vector.',
      keyHyperparameters: [
        { name: 'n_components', type: 'int/float', defaultVal: '0.95', role: 'Number of components or variance percentage ratio to retain (e.g. 0.95 = 95%).' },
        { name: 'whiten', type: 'bool', defaultVal: 'False', role: 'Divides components by singular values to enforce unit variance.' },
        { name: 'svd_solver', type: 'string', defaultVal: "'auto'", role: 'Algorithm driver: "full", "arpack", or "randomized".' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.decomposition import PCA

# 1. Synthetic 3D correlated data cloud
np.random.seed(42)
x1 = np.random.normal(0, 3, 100)
x2 = 0.8 * x1 + np.random.normal(0, 1, 100)
x3 = 0.4 * x1 - 0.5 * x2 + np.random.normal(0, 0.5, 100)
X = np.column_stack([x1, x2, x3])

# 2. Fit PCA retaining 2 principal components
pca = PCA(n_components=2)
Z = pca.fit_transform(X)

# 3. Inspect mathematical properties
eigenvalues = pca.explained_variance_
variance_ratio = pca.explained_variance_ratio_
components = pca.components_ # Eigenvectors (rows)

print(f"Original Shape: {X.shape} -> Reduced Shape: {Z.shape}")
print(f"Explained Variance Ratio: {variance_ratio.round(3)}")
print(f"Total Preserved Variance: {variance_ratio.sum()*100:.1f}%")
print(f"Principal Eigenvector (PC1): {components[0].round(3)}")`,
      codeExplanation:
        'Setting n_components=0.95 automatically selects the minimum integer count of eigenvectors required to retain 95% of total cumulative variance.',
    },
    tradeoffs: {
      advantages: [
        'Completely removes multicollinearity: all resulting components have zero correlation.',
        'Reduces storage and computational training footprint for downstream models.',
        'Enables high-dimensional clustering and 2D scatter visualization of complex datasets.',
      ],
      limitations: [
        'Loss of interpretability: principal components are linear cocktails of all original features.',
        'Strictly linear: completely misses non-linear manifold topologies.',
        'Sensitive to feature scaling: unstandardized high-variance features dominate all components.',
      ],
      fundamentalAssumptions: [
        'High variance implies high information content (signal dominates variance).',
        'Orthogonal linear subspaces adequately capture data structure.',
        'Features are centered and standardized prior to covariance computation.',
      ],
      failureModes: [
        {
          symptom: 'First principal component aligns 100% with a single feature.',
          underlyingReason: 'Features were not standardized; a feature measured in thousands dominated a feature measured in units.',
          fix: 'Always apply StandardScaler prior to running PCA.',
        },
        {
          symptom: 'PCA compresses a Swiss-roll spiral into a single flattened blob.',
          underlyingReason: 'PCA is linear; it projects through the folds rather than unrolling the 2D sheet.',
          fix: 'Transition to non-linear manifold methods such as t-SNE, UMAP, or Kernel PCA.',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'PCA projects data onto orthogonal axes that maximize retained geometric variance.',
        'Eigenvectors represent the orientation of the principal axes; eigenvalues represent variance.',
        'Always mean-center and standardize features before computing covariance matrices.',
        'Cumulative explained variance plots (scree plots) determine how many components to keep.',
      ],
      misconception: {
        myth: 'PCA is a feature selection method that picks the best original features and throws away the rest.',
        reality:
          'PCA is a feature transformation method, not feature selection. Every principal component is a linear weighted mixture of ALL original features. No original feature is individually kept or discarded.',
        whyLearnersConfuseIt:
          'Because both reduce feature count, learners conflate selecting columns with rotating coordinate space.',
      },
      recallQuestion: {
        id: 'recall-pca-1',
        question:
          'What is the correlation between Principal Component 1 (PC1) and Principal Component 2 (PC2)?',
        options: [
          'Exactly 0.0 (They are completely uncorrelated and orthogonal)',
          '1.0 (They are perfectly correlated)',
          'It depends on whether the data was normalized',
          '-1.0 (They point in opposite directions)',
        ],
        correctIndex: 0,
        explanation:
          'Correct! By mathematical definition, the eigenvectors of a symmetric covariance matrix are strictly mutually orthogonal. The projection of data onto orthogonal eigenvectors produces components with zero covariance and zero linear correlation.',
      },
      nextConcept: {
        id: 'kmeans',
        title: 'K-Means Clustering',
        whyNext:
          'PCA is frequently used as a preprocessing pipeline before K-Means to eliminate correlated noise and speed up Euclidean distance computations.',
      },
    },
  },

  // =========================================================================
  // 07 // ENSEMBLE LEARNING
  // =========================================================================
  'ensemble-learning': {
    id: 'ensemble-learning',
    title: 'Ensemble Learning',
    subtitle: 'Strategic model combinations: Voting, Bagging, Random Forests, Boosting, and Stacking.',
    eyebrow: '07 // ENSEMBLE LEARNING',
    category: 'Ensemble Learning',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    prerequisites: ['Decision Trees', 'Bias-Variance Tradeoff', 'Linear Models'],
    nextConceptId: 'linear-regression',
    labAlgorithmId: 'decision-trees',
    colorAccent: 'vermilion',
    tags: ['Ensemble', 'Random Forest', 'AdaBoost', 'Bagging', 'Boosting', 'Stacking'],
    nutshell: {
      definition:
        'A meta-learning paradigm that strategically trains and combines multiple individual machine learning models (base learners) to produce a composite predictive system with substantially lower variance, lower bias, or superior generalizability than any single component model.',
      whyExists:
        'Any single model is inherently constrained by its inductive biases: decision trees suffer from high variance, linear models suffer from high bias. By combining diverse models whose individual errors are uncorrelated, collective wisdom dramatically reduces total error.',
      problemSolved:
        'Overcomes individual model weaknesses (overfitting, greediness, sensitivity to noise) to produce production-grade, competition-winning predictive accuracy.',
      primaryFormula: {
        latex: 'P(\\text{Majority Error}) = \\sum_{k=\\lceil N/2 \\rceil}^{N} \\binom{N}{k} p^k (1 - p)^{N - k}',
        label: 'CONDORCET JURY THEOREM ENSEMBLE ERROR',
        explanation: 'If each of N independent base models has error rate p < 0.5, ensemble majority error approaches 0 as N increases.',
      },
      keyCharacteristics: [
        'Harnesses Condorcet Jury Theorem: collective decision-making outperforms individual experts',
        'Two foundational axes: Bagging (reduces variance in parallel) vs Boosting (reduces bias sequentially)',
        'Dominates competitive machine learning benchmarks (Kaggle) on tabular structured datasets',
      ],
    },
    howItWorks: {
      headline: 'The Ensemble Pipeline Architecture in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Generate Diverse Base Learners',
          description:
            'Diversity is mandatory. Introduce diversity by training different algorithms (e.g. SVM + Tree + Logistic), drawing bootstrap data subsets (Bagging), or subsampling feature columns.',
          mathDetail: '\\mathcal{H} = \\{h_1(\\mathbf{x}), h_2(\\mathbf{x}), \\dots, h_M(\\mathbf{x})\\}',
          diagramNote: 'Multiple independent model icons training on different data slices.',
        },
        {
          stepNumber: 2,
          title: 'Train Base Learners (Parallel vs Sequential)',
          description:
            'In Bagging (Random Forest), models train independently in parallel. In Boosting (AdaBoost, XGBoost), models train sequentially, where each learner focuses on correcting prior errors.',
          mathDetail: '\\text{Parallel: } h_m \\perp h_k, \\quad \\text{Sequential: } w_i^{(m)} \\propto \\exp(-y_i h_{m-1}(x_i))',
          diagramNote: 'Parallel branches for Bagging; sequential feedback loop arrows for Boosting.',
        },
        {
          stepNumber: 3,
          title: 'Aggregate Individual Predictions',
          description:
            'Combine base predictions using majority voting (classification), arithmetic/weighted averaging (regression), or training a meta-model on out-of-fold predictions (Stacking).',
          mathDetail: '\\hat{y}_{\\text{ensemble}} = \\arg\\max_{c} \\sum_{m=1}^{M} w_m \\cdot \\mathbb{I}(h_m(\\mathbf{x}) = c)',
          diagramNote: 'Votes funneling into an aggregation scale to determine the final consensus.',
        },
        {
          stepNumber: 4,
          title: 'Achieve Variance or Bias Reduction',
          description:
            'Independent errors cancel out mathematically: Var(X̄) = σ²/M. The composite model demonstrates smooth boundaries, lower generalization error, and high resilience to noise.',
          mathDetail: '\\text{Var}\\left( \\frac{1}{M} \\sum_{m=1}^M X_m \\right) = \\frac{\\sigma^2}{M} + \\frac{M - 1}{M} \\rho \\sigma^2',
          diagramNote: 'Jagged individual error boundaries merge into a smooth, robust consensus boundary.',
        },
      ],
      coreLoopSummary:
        'Trains a diverse committee of learners and synthesizes their predictions, converting uncorrelated individual mistakes into robust collective consensus.',
    },
    visualExample: {
      scenarioTitle: 'Medical Tumor Diagnostic Board vs Single Physician',
      relatableScenario:
        'Rather than relying on a single oncologist whose diagnosis might suffer from individual fatigue or specialty bias, a patient case is reviewed by a committee of 5 specialists (Radiologist, Pathologist, Surgeon, Oncologist, Geneticist) who vote.',
      inputsDescription: 'Complex diagnostic scan features with ambiguous edge boundaries.',
      intermediateDescription:
        '3 weak base classifiers predict individual boundaries; majority vote eliminates isolated errors.',
      outputDescription: 'Consensus diagnosis achieving 96% accuracy vs 78% for single physicians.',
      interactiveType: 'ensemble-learning',
    },
    variants: {
      summary: 'The four core ensemble families: Voting, Bagging, Boosting, and Stacking.',
      variants: [
        {
          id: 'voting',
          name: 'Voting Classifier / Regressor',
          tag: 'SIMPLE CONSENSUS',
          badgeVariant: 'neutral',
          howItDiffers: 'Combines fundamentally different algorithm architectures (e.g. Logistic + SVM + Tree) via hard vote or soft probability averaging.',
          idealUseCase: 'Quick performance baseline when multiple diverse model types are available.',
          drawback: 'Does not adaptively weight models based on sample difficulty.',
        },
        {
          id: 'bagging',
          name: 'Bagging & Random Forests',
          tag: 'BOOTSTRAP PARALLEL (VARIANCE REDUCTION)',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Trains deep unpruned trees in parallel on bootstrap sample replicates with random feature subspace sampling at each split.',
          idealUseCase: 'High-variance models (deep trees) on structured tabular datasets.',
          drawback: 'Cannot reduce inherent model bias; models must already be low-bias.',
        },
        {
          id: 'boosting',
          name: 'Boosting (AdaBoost / Gradient Boosting / XGBoost)',
          tag: 'SEQUENTIAL RESIDUALS (BIAS REDUCTION)',
          badgeVariant: 'vermilion',
          howItDiffers: 'Trains shallow weak learners (stumps) sequentially; each new model fits the pseudo-residuals of prior models.',
          idealUseCase: 'Structured tabular Kaggle competitions and production ranking/churn systems.',
          drawback: 'Prone to overfitting on noisy datasets; sequential training is harder to parallelize.',
        },
        {
          id: 'stacking',
          name: 'Stacking (Stacked Generalization)',
          tag: 'META-MODEL BLENDING',
          badgeVariant: 'sage',
          howItDiffers: 'Uses predictions of diverse base models as input features to train a second-level meta-learner (e.g. Ridge Regression).',
          idealUseCase: 'Maximizing final percentage points in competitive machine learning tournaments.',
          drawback: 'High engineering complexity; extreme risk of data leakage without strict K-fold out-of-fold splits.',
        },
      ],
    },
    implementation: {
      industryTitle: 'High-Stakes Credit Default Prediction',
      realWorldScenario:
        'A retail bank predicts whether a borrowing customer will default on a credit facility, comparing a Single Decision Tree vs Random Forest vs AdaBoost.',
      inputsSpecs: 'Customer demographic, credit bureau, and repayment velocity feature matrix X.',
      outputsSpecs: 'Calibrated default probability and binary decision score.',
      keyHyperparameters: [
        { name: 'n_estimators', type: 'int', defaultVal: '100', role: 'Number of base models in the ensemble committee.' },
        { name: 'max_features', type: 'string/float', defaultVal: "'sqrt'", role: 'Number of random features sampled at each split (Random Forest).' },
        { name: 'learning_rate', type: 'float', defaultVal: '0.1', role: 'Shrinkage factor scaling contribution of each tree (Boosting).' },
      ],
      codeLanguage: 'python',
      codeSnippet: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.metrics import accuracy_score

# 1. Synthetic structured classification problem
X, y = make_classification(n_samples=500, n_features=10, n_informative=6, random_state=42)

# 2. Benchmark Models
single_tree = DecisionTreeClassifier(max_depth=None, random_state=42)
random_forest = RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42)
adaboost = AdaBoostClassifier(n_estimators=100, learning_rate=0.1, random_state=42)

# 3. Fit and compare
models = [('Single Tree', single_tree), ('Random Forest (Bagging)', random_forest), ('AdaBoost (Boosting)', adaboost)]
print("--- MODEL BENCHMARK ACCURACY ---")
for name, clf in models:
    clf.fit(X, y)
    acc = accuracy_score(y, clf.predict(X))
    print(f"{name:25s}: Training Accuracy = {acc*100:.1f}%")`,
      codeExplanation:
        'Notice how Random Forest achieves variance reduction without increasing tree depth constraints, while AdaBoost sequentially focuses on hard boundary samples.',
    },
    tradeoffs: {
      advantages: [
        'Consistently higher accuracy and generalizability than single constituent models.',
        'Extremely robust against overfitting (Bagging/Random Forest) and high bias (Boosting).',
        'State-of-the-art gold standard on tabular tabular data, routinely beating deep neural networks.',
      ],
      limitations: [
        'Increased computational cost: training and maintaining 100+ models requires substantial CPU/RAM.',
        'Higher inference latency: real-time edge scoring requires querying every tree in the forest.',
        'Loss of human interpretability: no single equation or flowchart explains the entire committee.',
      ],
      fundamentalAssumptions: [
        'Base model diversity: individual model errors must be sufficiently uncorrelated.',
        'Base model competence: each individual base learner must perform better than random guessing (p > 0.5).',
      ],
      failureModes: [
        {
          symptom: 'Ensemble accuracy is identical to a single model despite training 100 models.',
          underlyingReason: 'Lack of diversity: all 100 models were trained on identical data with identical hyperparameters, producing correlated errors.',
          fix: 'Introduce bootstrap subsampling, random feature subspace splitting (max_features="sqrt"), or diverse model families.',
        },
        {
          symptom: 'Gradient Boosting accuracy collapses on a dataset with mislabeled label noise.',
          underlyingReason: 'Boosting sequentially forces models to focus heavily on outliers and mislabeled samples, causing severe overfitting to noise.',
          fix: 'Lower learning_rate (shrinkage), restrict max_depth to 2 or 3, or apply subsampling (Subsample=0.8).',
        },
      ],
    },
    takeaways: {
      takeaways: [
        'Ensembles combine diverse models to reduce variance (Bagging) or bias (Boosting).',
        'Random Forests train deep unpruned trees on bootstrap subsets with random feature sampling.',
        'Gradient Boosting trains shallow weak trees sequentially on pseudo-residuals.',
        'Base models MUST be diverse and perform better than random chance for ensembles to succeed.',
      ],
      misconception: {
        myth: 'Ensembling always improves model performance, regardless of which models you combine.',
        reality:
          'If base models make identical errors (high correlation) or perform worse than random guessing (p < 0.5), ensembling will actually AMPLIFY mistakes and worsen performance. Condorcet Jury Theorem requires diversity and individual competence.',
        whyLearnersConfuseIt:
          'Because ensembling is famous for Kaggle victories, learners assume simply combining any arbitrary models creates magic.',
      },
      recallQuestion: {
        id: 'recall-ensemble-1',
        question:
          'What is the primary difference in model training between Bagging (Random Forest) and Boosting (AdaBoost/XGBoost)?',
        options: [
          'Bagging trains models independently in parallel to reduce variance; Boosting trains models sequentially to reduce bias.',
          'Bagging only works on neural networks; Boosting only works on linear regression.',
          'Bagging uses gradient descent; Boosting uses closed-form normal equations.',
          'Bagging increases model bias; Boosting increases model variance.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! Bagging (Bootstrap Aggregating) trains high-capacity models in parallel on bootstrap samples to average out variance. Boosting trains shallow models sequentially, each fitting the residual errors of the previous model to reduce bias.',
      },
      nextConcept: {
        id: 'linear-regression',
        title: 'Linear Regression',
        whyNext:
          'Return to first principles to understand how linear hypotheses form the foundation of continuous forecasting and generalized additive models.',
      },
    },
  },
};

// Helper list of concept units
export const ALL_CONCEPT_CARDS: ConceptCardUnit[] = Object.values(CONCEPT_CARDS_REGISTRY);

export function getConceptCardById(id: string): ConceptCardUnit | undefined {
  return CONCEPT_CARDS_REGISTRY[id];
}
