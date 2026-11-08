export interface DiagnosticQuestion {
  id: string;
  category: 'Optimization' | 'Supervised' | 'Unsupervised' | 'Foundations' | 'Evaluation';
  conceptId: string;
  conceptTitle: string;
  conceptUrl: string;
  question: string;
  latexFormula?: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  misconceptionId: string;
  misconceptionMyth: string;
  detailedRationale: string;
  mathematicalProof?: string;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-gd-alpha',
    category: 'Optimization',
    conceptId: 'gradient-descent',
    conceptTitle: 'Gradient Descent & Learning Rate Dynamics',
    conceptUrl: '/concepts/gradient-descent',
    question:
      'For a 1D quadratic objective J(θ) = 0.5(θ - 3.5)² + 1 with gradient J\'(θ) = θ - 3.5, what is the exact range of constant learning rate α that guarantees convergence to the global minimum θ* = 3.5 from any initial point θ₀?',
    latexFormula: 'J(\\theta) = \\frac{1}{2}(\\theta - 3.5)^2 + 1 \\implies \\theta_{t+1} - 3.5 = (1 - \\alpha)(\\theta_t - 3.5)',
    options: [
      {
        label: 'A',
        text: '0 < α < 1 (any α ≥ 1 strictly causes divergent unbounded oscillation)',
        isCorrect: false,
      },
      {
        label: 'B',
        text: '0 < α < 2 (at α = 1 it converges in 1 step; between 1 < α < 2 it oscillates but converges)',
        isCorrect: true,
      },
      {
        label: 'C',
        text: 'α can be any positive value because quadratic functions are globally convex',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'α must strictly decay asymptotically as O(1/√t) to prevent gradient explosion',
        isCorrect: false,
      },
    ],
    misconceptionId: 'gd-divergence-bound',
    misconceptionMyth: 'Believing that learning rates α ≥ 1 always diverge for all loss functions.',
    detailedRationale:
      'The update equation yields the error contraction recurrence: (θ_{t+1} - 3.5) = (1 - α)(θ_t - 3.5). The error magnitude contracts if and only if |1 - α| < 1, which strictly bounds α to the open interval (0, 2). At α = 1, it hits the exact minimum in a single update. Between 1 < α < 2, it overshoots and oscillates with alternating signs, but geometric decay still guarantees convergence. Divergence occurs strictly when α ≥ 2.',
    mathematicalProof: '|1 - \\alpha| < 1 \\iff -1 < 1 - \\alpha < 1 \\iff 0 < \\alpha < 2',
  },
  {
    id: 'diag-reg-lasso',
    category: 'Supervised',
    conceptId: 'regularization',
    conceptTitle: 'L1 Lasso vs. L2 Ridge Regularization Geometry',
    conceptUrl: '/concepts/regularization',
    question:
      'Geometrically, why does L1 Lasso regularization produce exact zero coefficients (feature selection / sparsity), whereas L2 Ridge regularization only shrinks weights asymptotically toward zero without zeroing them?',
    latexFormula: '\\min_w \\frac{1}{2n} \\|y - Xw\\|_2^2 + \\lambda \\|w\\|_1 \\quad \\text{vs.} \\quad \\min_w \\frac{1}{2n} \\|y - Xw\\|_2^2 + \\frac{\\lambda}{2} \\|w\\|_2^2',
    options: [
      {
        label: 'A',
        text: 'L1 norm level curves form a diamond with sharp non-differentiable corners situated exactly on the coordinate axes, where expanding MSE error ellipses make first tangential contact.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'L1 regularization computes an analytical closed-form normal equation containing singular zero diagonals.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'L2 Ridge regularization utilizes a non-convex objective function that traps optimization in non-zero local minima.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'L1 assigns zero gradient to features whose empirical Pearson correlation is below threshold λ.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'reg-sparsity-geometry',
    misconceptionMyth: 'Thinking L1 sets features to zero because of numerical underflow or thresholding heuristics.',
    detailedRationale:
      'Under constrained optimization (KKT conditions), the solution occurs at the tangent point between the expanding elliptical contours of the unconstrained OLS loss and the norm constraint ball. The L1 constraint |w₁| + |w₂| ≤ C is a polytope with sharp vertices located on the axes (where w_j = 0). Because corners point outward along coordinate axes, the elliptical contours are far more likely to intersect a corner first. The L2 ball w₁² + w₂² ≤ C is a smooth sphere with no corners, so tangent contact almost never aligns with an axis.',
    mathematicalProof: '\\partial |w_j| = \\text{sgn}(w_j) \\text{ for } w_j \\neq 0, \\quad \\partial |w_j| \\in [-1, 1] \\text{ for } w_j = 0',
  },
  {
    id: 'diag-bias-variance',
    category: 'Foundations',
    conceptId: 'bias-variance-tradeoff',
    conceptTitle: 'Bias-Variance Decomposition & Irreducible Noise',
    conceptUrl: '/concepts/bias-variance-tradeoff',
    question:
      'In the canonical bias-variance decomposition of expected test error for an estimator f̂(x) predicting y = f(x) + ε where ε ~ N(0, σ²): E[(y - f̂(x))²] = Bias²(f̂(x)) + Var(f̂(x)) + σ², what does the term σ² represent?',
    latexFormula: '\\mathbb{E}[(y - \\hat{f}(x))^2] = \\underbrace{(\\mathbb{E}[\\hat{f}(x)] - f(x))^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}[(\\hat{f}(x) - \\mathbb{E}[\\hat{f}(x)])^2]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Irreducible Error}}',
    options: [
      {
        label: 'A',
        text: 'The variance of the model predictions across different random training sample realizations.',
        isCorrect: false,
      },
      {
        label: 'B',
        text: 'The irreducible measurement noise in the data-generating process that cannot be eliminated by any model, regardless of parameter complexity or sample size.',
        isCorrect: true,
      },
      {
        label: 'C',
        text: 'The systematic underfitting error resulting from restricting the hypothesis class to linear hyperplanes.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'The numerical floating-point precision error incurred during gradient backpropagation.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'bv-irreducible-noise',
    misconceptionMyth: 'Believing that with an infinitely complex deep neural net and infinite data, expected test error can reach absolute 0.',
    detailedRationale:
      'The term σ² = Var(ε) represents stochasticity intrinsic to the physical system being measured, unmeasured latent confounding features, and sensor noise. Because ε is independent of the model parameters and training split, Var(ε) cannot be reduced by any learning algorithm. It establishes the absolute theoretical Bayes lower bound on generalization error.',
    mathematicalProof: '\\mathbb{E}[\\epsilon \\cdot (f(x) - \\hat{f}(x))] = 0 \\implies \\text{Cross-terms vanish, leaving strictly } \\sigma^2',
  },
  {
    id: 'diag-tree-split',
    category: 'Supervised',
    conceptId: 'decision-trees',
    conceptTitle: 'Decision Tree Split Selection: Gini Impurity vs. Shannon Entropy',
    conceptUrl: '/concepts/decision-trees',
    question:
      'Which statement mathematically distinguishes Gini Impurity from Shannon Entropy in classification decision tree split optimization?',
    latexFormula: 'I_G(p) = 1 - \\sum_{k=1}^K p_k^2 \\quad \\text{vs.} \\quad H(p) = -\\sum_{k=1}^K p_k \\log_2(p_k)',
    options: [
      {
        label: 'A',
        text: 'Gini impurity uses quadratic probability sums 1 - ∑ p_k² (measuring misclassification probability under random assignment) avoiding expensive transcendental logarithms, while Shannon Entropy measures bits of information uncertainty.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'Gini impurity requires calculating matrix eigenvalues, whereas Entropy requires computing Euclidean distance trees.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'Gini impurity is exclusively used for continuous regression, whereas Entropy is exclusively used for categorical classification.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'Gini always produces strictly deeper binary trees with twice as many leaf nodes compared to Information Gain.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'tree-gini-entropy-confusion',
    misconceptionMyth: 'Confusing Gini Impurity with Information Gain or calling Gini minimization "entropy reduction".',
    detailedRationale:
      'Gini Impurity I_G(p) = 1 - ∑ p_k² = ∑_{i ≠ j} p_i p_j represents the probability that a randomly chosen element from the set would be incorrectly labeled if randomly labeled according to the class distribution. It relies purely on multiplication and subtraction, making it computationally faster. Shannon Entropy H(p) = -∑ p_k log₂(p_k) derives from information theory and measures information disorder in bits. Both reach 0 at pure nodes and maximum at uniform distributions, typically selecting identical splits in 98%+ of cases.',
    mathematicalProof: 'I_G(p) = \\sum_{k=1}^K p_k(1 - p_k) = 1 - \\sum_{k=1}^K p_k^2',
  },
  {
    id: 'diag-kmeans-geometry',
    category: 'Unsupervised',
    conceptId: 'kmeans',
    conceptTitle: 'K-Means Structural Assumptions & Manifold Failure Modes',
    conceptUrl: '/concepts/kmeans',
    question:
      'A data scientist applies standard Lloyd K-Means clustering (K = 2) to two nested concentric circles. Why is K-Means mathematically incapable of separating the inner circle from the outer ring?',
    latexFormula: '\\arg\\min_S \\sum_{k=1}^K \\sum_{x \\in S_k} \\|x - \\mu_k\\|_2^2 \\implies \\text{Voronoi Cells: } V_k = \\{x : \\|x - \\mu_k\\| \\le \\|x - \\mu_j\\|\\}',
    options: [
      {
        label: 'A',
        text: 'K-Means optimizes squared Euclidean distance to centroids, which strictly partitions feature space into convex polyhedral Voronoi cells bounded by linear hyperplanes. It cannot partition non-convex nested geometries.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'Concentric circles cause the centroid covariance matrix to become negative definite, resulting in NaN coordinates.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'K-Means only works when the number of clusters K is greater than or equal to the dimension of the space (K ≥ d + 1).',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'The Lloyd algorithm requires all clusters to possess unequal sample cardinalities.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'kmeans-convexity-assumption',
    misconceptionMyth: 'Believing that K-Means can learn arbitrary arbitrary non-linear cluster shapes given enough iterations.',
    detailedRationale:
      'The decision boundary between any two centroids μ_i and μ_j in K-Means is defined by ||x - μ_i||² = ||x - μ_j||², which simplifies algebraically to 2(μ_j - μ_i)ᵀx + (||μ_i||² - ||μ_j||²) = 0. This is the equation of a straight linear hyperplane. As a result, all cluster assignment regions are convex polyhedra. A concentric outer ring is inherently non-convex (it surrounds the inner circle); no single linear boundary or combination of convex Voronoi cells can isolate an outer shell from an inner core without slicing both.',
    mathematicalProof: '\\|x - \\mu_i\\|^2 = \\|x - \\mu_j\\|^2 \\iff 2(\\mu_j - \\mu_i)^T x = \\|\\mu_j\\|^2 - \\|\\mu_i\\|^2 \\quad (\\text{Linear Hyperplane})',
  },
  {
    id: 'diag-data-leakage',
    category: 'Foundations',
    conceptId: 'train-test-validation',
    conceptTitle: 'Data Leakage & Preprocessing Sequence',
    conceptUrl: '/concepts/train-test-validation',
    question:
      'Which preprocessing workflow introduces subtle data leakage, producing optimistically inflated validation and test scores?',
    latexFormula: 'z = \\frac{x - \\mu}{\\sigma} \\quad \\text{where } \\mu = \\frac{1}{N}\\sum_{i=1}^N x_i, \\quad \\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2}',
    options: [
      {
        label: 'A',
        text: 'Fitting a StandardScaler (computing mean μ and variance σ²) on the combined dataset before performing the train/test split.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'Fitting the scaler exclusively on the training partition and calling transform() on the test partition.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'Stratifying the train/test split based on the target class distribution for an imbalanced classification task.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'Performing 5-fold cross-validation by fitting all feature selectors inside each cross-validation fold loop.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'leakage-global-preprocessing',
    misconceptionMyth: 'Thinking that feature scaling is a harmless global operation that does not transmit label or distribution information.',
    detailedRationale:
      'Computing global summary statistics (mean, variance, minimum, maximum, imputation medians) across all rows before splitting violates the core assumption that the test partition represents completely unseen future data. The resulting scaled training features absorb information about the test set distribution, artificially lowering generalization error estimates.',
    mathematicalProof: '\\mu_{\\text{leak}} = \\frac{n_{\\text{train}}\\mu_{\\text{train}} + n_{\\text{test}}\\mu_{\\text{test}}}{n_{\\text{train}} + n_{\\text{test}}} \\neq \\mu_{\\text{train}}',
  },
  {
    id: 'diag-eval-imbalance',
    category: 'Evaluation',
    conceptId: 'evaluation-metrics',
    conceptTitle: 'The Accuracy Paradox & Class Imbalance Metrics',
    conceptUrl: '/concepts/evaluation-metrics',
    question:
      'In a cancer diagnostic dataset containing 1,000 patients, exactly 5 patients have malignant tumors (0.5% positive prevalence). A trivial model predicts "Benign" (negative) for all 1,000 patients. What are the Accuracy and Recall of this model?',
    latexFormula: '\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}',
    options: [
      {
        label: 'A',
        text: 'Accuracy = 99.5%, Recall = 0.0%',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'Accuracy = 50.0%, Recall = 50.0%',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'Accuracy = 0.5%, Recall = 99.5%',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'Accuracy = 99.5%, Recall = 99.5%',
        isCorrect: false,
      },
    ],
    misconceptionId: 'eval-accuracy-imbalance-paradox',
    misconceptionMyth: 'Relying on high classification accuracy as evidence of strong predictive utility in heavily skewed distributions.',
    detailedRationale:
      'Here: TP = 0, FP = 0, TN = 995, FN = 5. Accuracy is (0 + 995) / 1000 = 99.5%, which looks outstanding on paper. However, Recall (Sensitivity) is 0 / (0 + 5) = 0.0%, meaning the model failed to detect 100% of the life-threatening cancers. This mathematical disparity is the classic Accuracy Paradox.',
    mathematicalProof: '\\text{Recall} = \\frac{0}{0 + 5} = 0.00 \\quad (0\\% \\text{ detection rate})',
  },
  {
    id: 'diag-pca-variance',
    category: 'Unsupervised',
    conceptId: 'pca',
    conceptTitle: 'PCA Covariance Diagonalization & Variance Maximization',
    conceptUrl: '/concepts/pca',
    question:
      'In Principal Component Analysis on zero-centered data X, what mathematical entities determine the orthogonal directions of maximum variance and the fraction of total variance explained by each principal component?',
    latexFormula: '\\Sigma = \\frac{1}{n} X^T X = V \\Lambda V^T \\quad \\text{where } \\Lambda = \\text{diag}(\\lambda_1, \\lambda_2, \\dots, \\lambda_d)',
    options: [
      {
        label: 'A',
        text: 'The eigenvectors of the sample covariance matrix Σ define the orthogonal principal axes; their corresponding eigenvalues λ_j quantify the variance captured along each axis.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'The row sums of the inverse Hessian matrix define directions; Cholesky L diagonals quantify variance.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'The centroid coordinates of K-Means clusters define directions; Voronoi radii quantify variance.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'The regression coefficients w define directions; the sum of squared residuals quantify variance.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'pca-eigen-meaning',
    misconceptionMyth: 'Confusing eigenvectors (directional projection vectors) with eigenvalues (scalar variance magnitudes).',
    detailedRationale:
      'The sample covariance matrix Σ is symmetric and positive semi-definite, so it admits spectral decomposition V Λ Vᵀ. Each column v_j of V is a unit eigenvector satisfying Σ v_j = λ_j v_j. Projecting data onto v_j produces a 1D coordinate with sample variance Var(X v_j) = v_jᵀ Σ v_j = λ_j. The proportion of total variance explained by component j is λ_j / ∑_{k=1}^d λ_k.',
    mathematicalProof: '\\text{Var}(X v_j) = v_j^T \\left(\\frac{1}{n} X^T X\\right) v_j = v_j^T \\Sigma v_j = v_j^T (\\lambda_j v_j) = \\lambda_j \\|v_j\\|^2 = \\lambda_j',
  },
  {
    id: 'diag-knn-curse',
    category: 'Supervised',
    conceptId: 'knn',
    conceptTitle: 'K-Nearest Neighbors & The Curse of Dimensionality',
    conceptUrl: '/concepts/knn',
    question:
      'How does the "curse of dimensionality" geometrically degrade the performance of K-Nearest Neighbors (KNN) when feature dimension d becomes large?',
    latexFormula: '\\lim_{d \\to \\infty} \\frac{D_{\\max}^{(d)} - D_{\\min}^{(d)}}{D_{\\min}^{(d)}} \\to 0',
    options: [
      {
        label: 'A',
        text: 'High-dimensional volume grows exponentially, scattering points so sparsely that the distance to the nearest neighbor approaches the distance to the farthest neighbor, destroying the notion of local neighborhood.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'The Euclidean distance metric becomes mathematically undefined for dimensions d > 128 due to floating-point overflow.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'KNN is forced to set K = 1 because distance ties become mathematically impossible to break.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'Higher dimensions force the decision boundary to become strictly linear.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'knn-dimensional-sparsity',
    misconceptionMyth: 'Assuming adding more features always improves KNN accuracy even without dimensionality reduction or feature selection.',
    detailedRationale:
      'In high-dimensional spaces (e.g. d > 50), the volume of a hypercube grows as Lᵈ. Almost all volume concentrates in a thin shell near the boundaries and corners. Under mild assumptions on data distributions, the relative difference between the distance to the nearest neighbor D_min and farthest neighbor D_max converges to zero. Because all points become roughly equidistant from the query point, the nearest neighbors are no longer genuinely "close" or representative.',
    mathematicalProof: '\\frac{\\text{Vol}(\\text{Sphere}_{d}(r))}{\\text{Vol}(\\text{Cube}_{d}(2r))} = \\frac{\\pi^{d/2}}{2^d \\Gamma(d/2 + 1)} \\xrightarrow[d \\to \\infty]{} 0',
  },
  {
    id: 'diag-loss-huber',
    category: 'Optimization',
    conceptId: 'loss-functions',
    conceptTitle: 'Loss Functions: Huber vs. Mean Squared Error Outlier Sensitivity',
    conceptUrl: '/concepts/loss-functions',
    question:
      'Why is Huber Loss preferred over Ordinary Least Squares Mean Squared Error (MSE) when training continuous regression models on noisy sensor telemetry prone to extreme outlier corruption?',
    latexFormula: 'L_\\delta(e) = \\begin{cases} \\frac{1}{2} e^2 & \\text{for } |e| \\le \\delta \\\\ \\delta(|e| - \\frac{1}{2}\\delta) & \\text{for } |e| > \\delta \\end{cases}',
    options: [
      {
        label: 'A',
        text: 'Huber loss transitions from quadratic growth (for small errors |e| ≤ δ) to linear growth (for large errors |e| > δ), bounding gradient updates to ±δ so extreme outliers cannot dominate model parameter updates.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'Huber loss guarantees a strictly zero training error on all non-outlier data points.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'Huber loss eliminates the bias intercept term b from the regression equation.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'Huber loss transforms non-linear relationships into strictly linear polynomial equations.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'loss-robustness-huber',
    misconceptionMyth: 'Believing MSE is robust because squaring errors treats positive and negative residuals symmetrically.',
    detailedRationale:
      'With MSE, the loss grows quadratically e² and the gradient magnitude |∂L/∂e| = |e| grows linearly without bound. A single corrupted outlier with e = 100 exerts a gradient force 100 times stronger than an inlier with e = 1, dragging the regression line off the true signal. Huber loss caps the gradient at ±δ for |e| > δ, combining the differentiability and smoothness of MSE near zero with the robust, bounded influence of Mean Absolute Error (MAE) for large deviations.',
    mathematicalProof: '\\frac{\\partial L_\\delta(e)}{\\partial e} = \\begin{cases} e & \\text{if } |e| \\le \\delta \\\\ \\delta \\cdot \\text{sgn}(e) & \\text{if } |e| > \\delta \\end{cases} \\implies \\left|\\frac{\\partial L_\\delta}{\\partial e}\\right| \\le \\delta',
  },
  {
    id: 'diag-ensemble-diversity',
    category: 'Supervised',
    conceptId: 'ensemble-learning',
    conceptTitle: 'Ensemble Learning: Error Decorrelation & Condorcet Jury Theorem',
    conceptUrl: '/concepts/ensemble-learning',
    question:
      'Under Condorcet\'s Jury Theorem and ensemble learning theory, what fundamental mathematical condition is required for a majority-voting ensemble of M classifiers to achieve an error rate strictly lower than any individual base learner?',
    latexFormula: 'P(\\text{Ensemble Error}) = \\sum_{k=\\lfloor M/2 \\rfloor + 1}^M \\binom{M}{k} p^k (1 - p)^{M - k} \\xrightarrow[M \\to \\infty]{} 0 \\quad (\\text{if } p < 0.5)',
    options: [
      {
        label: 'A',
        text: 'The individual base classifiers must be more accurate than random guessing (error rate p < 0.5) and their prediction errors must be mutually independent (uncorrelated).',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'All base classifiers must be trained on the exact identical dataset using identical random seeds.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'The ensemble must achieve 100% consensus agreement across all validation examples.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'The base models must all be linear logistic regressors with identical feature weights.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'ensemble-diversity-necessity',
    misconceptionMyth: 'Assuming simply combining multiple models always guarantees improved accuracy, even if the models are identical or make perfectly correlated errors.',
    detailedRationale:
      'If M base classifiers make identical, perfectly correlated errors, taking a majority vote produces zero error reduction. The variance reduction mechanism in Bagging (Bootstrap Aggregation) and Random Forests depends critically on diversity: Var(∑ X_i / M) = ρ σ² + (1 - ρ) σ² / M. As M → ∞, the ensemble variance converges to ρ σ², where ρ is the pairwise correlation between base model errors. Injecting randomness (bootstrap rows, random feature subsets) minimizes ρ, driving variance toward zero.',
    mathematicalProof: '\\lim_{M \\to \\infty} \\left[ \\rho \\sigma^2 + \\frac{1 - \\rho}{M}\\sigma^2 \\right] = \\rho \\sigma^2 \\implies \\text{Variance reduction is bounded by error correlation } \\rho',
  },
  {
    id: 'diag-logreg-odds',
    category: 'Supervised',
    conceptId: 'logistic-regression',
    conceptTitle: 'Logistic Regression: Log-Odds Linearity & The Logit Function',
    conceptUrl: '/concepts/logistic-regression',
    question:
      'In binary logistic regression p̂ = σ(wᵀx + b) = 1 / (1 + e^{-(wᵀx + b)}), what is the exact mathematical interpretation of the logit transformation ln(p̂ / (1 - p̂))?',
    latexFormula: '\\text{logit}(\\hat{p}) = \\ln\\left(\\frac{\\hat{p}}{1 - \\hat{p}}\\right) = \\mathbf{w}^T \\mathbf{x} + b',
    options: [
      {
        label: 'A',
        text: 'It is the log-odds of the positive class event, which is modeled as a strictly linear combination of the input features wᵀx + b.',
        isCorrect: true,
      },
      {
        label: 'B',
        text: 'It is the Mean Squared Error between the predicted probability and the binary ground-truth label.',
        isCorrect: false,
      },
      {
        label: 'C',
        text: 'It measures the Gini Impurity of the positive class decision boundary in n-dimensional space.',
        isCorrect: false,
      },
      {
        label: 'D',
        text: 'It calculates the learning rate momentum decay schedule for stochastic gradient descent.',
        isCorrect: false,
      },
    ],
    misconceptionId: 'logreg-logit-odds',
    misconceptionMyth: 'Believing logistic regression is non-linear in its parameters because its predicted output probability p̂ is an S-shaped curve.',
    detailedRationale:
      'While the output probability p̂ is non-linearly squashed between (0, 1) via the sigmoid function σ(z), the link function logit(p̂) = ln(p̂ / (1 - p̂)) maps probabilities back to (-∞, +∞) where the relationship with feature parameters w is strictly linear: ln(odds) = w₁x₁ + w₂x₂ + ... + b. This is why logistic regression is classified as a Generalized Linear Model (GLM). Each coefficient w_j represents the change in log-odds of the positive class per unit increase in feature x_j, holding other features constant.',
    mathematicalProof: 'e^{\\mathbf{w}^T \\mathbf{x} + b} = \\frac{\\hat{p}}{1 - \\hat{p}} = \\text{Odds} \\implies \\ln(\\text{Odds}) = \\mathbf{w}^T \\mathbf{x} + b',
  },
];
