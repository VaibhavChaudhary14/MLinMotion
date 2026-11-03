import { Lesson } from '@/types';

export const stage12Lesson: Lesson = {
  id: 'model-comparison',
  stageNumber: 12,
  stageCode: '12',
  layer: 'evaluation',
  algorithmId: 'model-comparison',
  title: 'Stage 12: Model Comparison & Scientific Experimentation',
  subtitle: 'Benchmarking Competing Inductive Biases, Controlled Experiments, and Reproducibility.',
  durationMinutes: 24,
  prerequisites: ['kmeans', 'pca', 'model-evaluation'],
  learningObjectives: [
    'Articulate the Inductive Bias of K-Means, DBSCAN, and Agglomerative clustering.',
    'Design controlled machine learning experiments with fixed random seeds and identical splits.',
    'Execute ablation and hyperparameter sensitivity studies.',
    'Understand the No Free Lunch Theorem and why no single algorithm dominates all data distributions.',
    'Synthesize complete experiment audit logs with reproducible metrics and hyperparameter records.',
  ],
  steps: [
    {
      id: 's12-1-hook',
      title: 'Same Data, Divergent Realities',
      eyebrow: '01 // INDUCTIVE BIAS',
      phase: 'hook',
      contentMarkdown:
        'When you feed the exact same coordinate points to K-Means, DBSCAN, and Agglomerative Hierarchical clustering, you get three completely different segmentations. Why? Because algorithms are not objective mirrors of reality; each algorithm carries an Inductive Bias—a set of built-in mathematical assumptions about what a "cluster" or "pattern" is allowed to look like.',
    },
    {
      id: 's12-2-intuition',
      title: 'The Inductive Bias Comparison Matrix',
      eyebrow: '02 // GEOMETRIC ASSUMPTIONS',
      phase: 'intuition',
      contentMarkdown:
        '1) K-Means assumes clusters are convex, isotropic (spherical) Gaussians of equal variance, slicing geometry with linear hyperplanes. 2) DBSCAN assumes clusters are continuous chains of high density separated by low-density valleys, completely agnostic to geometric shape. 3) Agglomerative Hierarchical builds a tree of pairwise distances, sensitive to linkage criteria (Ward variance vs Single chaining).',
    },
    {
      id: 's12-3-explore',
      title: 'The Multi-Model Benchmark Canvas',
      eyebrow: '03 // EXPERIMENT STUDIO',
      phase: 'explore',
      interactiveComponent: 'inductive-bias-comparator',
      contentMarkdown:
        'Observe how K-Means bisects non-convex concentric rings into unnatural half-moon wedges because its centroid objective forces planar Voronoi boundaries. Meanwhile, DBSCAN follows the density perimeter and isolates the inner and outer circles effortlessly.',
    },
    {
      id: 's12-4-predict',
      title: 'The Pathological Manifold Challenge',
      eyebrow: '04 // PREDICTION CHALLENGE',
      phase: 'predict',
      contentMarkdown:
        'You have two intertwined concentric rings of data with uniform point density. You execute K-Means with K=2 and DBSCAN with appropriate epsilon and MinPts.',
      predictionOptions: {
        question:
          'What will K-Means and DBSCAN produce on the concentric rings?',
        options: [
          'Both algorithms will perfectly separate the inner circle from the outer ring.',
          'K-Means will slice across both rings with a straight Voronoi boundary; DBSCAN will separate the two rings cleanly.',
          'DBSCAN will fail because it only works on straight lines.',
          'K-Means will converge to zero inertia.',
        ],
        correctIndex: 1,
        explanation:
          'K-Means relies on Euclidean distance to spatial centers, which forces linear decision boundaries bisecting both rings. DBSCAN relies on density reachability, traversing arbitrary topological curves.',
      },
    },
    {
      id: 's12-5-reveal',
      title: 'Controlled Experiments & Reproducibility',
      eyebrow: '05 // EXPERIMENTAL RIGOR',
      phase: 'reveal',
      contentMarkdown:
        'A comparison is scientifically meaningless unless experimental controls are strictly enforced: 1) Identical Data Splits: All competing models must be trained and evaluated on the exact same coordinate observations. 2) Fixed Pseudo-Random Seeds: Algorithms with stochastic initialization (like K-means or SGD) must use fixed seeds (e.g. random_state=42) to isolate algorithmic differences from random noise.',
      equation: '\\text{Seed} = 42 \\implies \\mathbf{w}^{(0)}_{\\text{run 1}} = \\mathbf{w}^{(0)}_{\\text{run 2}}',
    },
    {
      id: 's12-6-under-the-hood',
      title: 'The No Free Lunch Theorem',
      eyebrow: '06 // THEORETICAL BOUNDS',
      phase: 'under-the-hood',
      contentMarkdown:
        'The No Free Lunch (NFL) Theorem, formulated by Wolpert and Macready, states that averaged across all possible data-generating distributions, every machine learning algorithm has the exact same expected performance. There is no universally superior algorithm. A model achieves superior performance on a specific problem only because its inductive bias happens to align with the underlying geometry of that problem.',
    },
    {
      id: 's12-7-break-it',
      title: 'Ablation Studies: Testing What Actually Matters',
      eyebrow: '07 // SCIENTIFIC ABLATION',
      phase: 'break-it',
      contentMarkdown:
        'An Ablation Study systematically removes individual components of an ML pipeline (e.g. removing feature scaling, removing regularization, or changing distance metrics) while holding all other parameters constant. This isolates which component actually drove performance improvements, eliminating false superstitious complexity.',
    },
    {
      id: 's12-8-code-it',
      title: 'Multi-Model Benchmark Suite in Python',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Inspect a reproducible Python benchmark evaluating K-Means, DBSCAN, and Agglomerative clustering on identical coordinate inputs.',
      codeSnippet: {
        python: `import time
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score

models = {
    'K-Means': KMeans(n_clusters=2, random_state=42, n_init=10),
    'DBSCAN': DBSCAN(eps=0.3, min_samples=5),
    'Agglomerative': AgglomerativeClustering(n_clusters=2)
}

results = {}
for name, model in models.items():
    start = time.perf_counter()
    labels = model.fit_predict(X_concentric)
    elapsed = (time.perf_counter() - start) * 1000
    
    # Compute silhouette only if more than 1 cluster found
    sil = silhouette_score(X_concentric, labels) if len(set(labels) - {-1}) > 1 else 0.0
    results[name] = {'silhouette': round(sil, 3), 'time_ms': round(elapsed, 2)}

for name, res in results.items():
    print(f"{name:15} | Silhouette: {res['silhouette']:0.3f} | Time: {res['time_ms']}ms")`,
        sklearn: 'from sklearn.metrics import silhouette_score',
        explanation:
          'Benchmarking multiple models on identical inputs with standardized evaluation criteria provides unbiased algorithm selection.',
      },
    },
    {
      id: 's12-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Validate your scientific thinking, inductive bias reasoning, and experimental rigor.',
      questions: [
        {
          id: 's12-q1',
          prompt: 'What does the term "Inductive Bias" refer to in machine learning?',
          options: [
            'Systematic human prejudice against minority groups in datasets.',
            'The set of prior assumptions an algorithm uses to predict outputs on unseen inputs.',
            'The learning rate multiplier in neural networks.',
            'A bug causing matrix inversion failure.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'societal-bias-confusion',
            2: 'lr-bias-myth',
            3: 'bug-bias-myth',
          },
          explanation:
            'Inductive bias represents the geometric and mathematical assumptions built into an algorithm (e.g. linear separability, spherical clusters).',
          difficulty: 'intermediate',
        },
        {
          id: 's12-q2',
          prompt: 'Why does DBSCAN succeed on concentric rings where K-means fails?',
          options: [
            'DBSCAN runs for more iterations than K-means.',
            'DBSCAN clusters by density reachability along contiguous points, while K-means assumes spherical clusters around Euclidean centroids.',
            'DBSCAN is a deep convolutional network.',
            'DBSCAN scales the coordinates automatically.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'iterations-myth',
            2: 'dbscan-nn-myth',
            3: 'auto-scale-myth',
          },
          explanation:
            'DBSCAN links points that are density-connected, preserving arbitrary non-convex topological shapes.',
          difficulty: 'intermediate',
        },
        {
          id: 's12-q3',
          prompt: 'What is the primary conclusion of the No Free Lunch (NFL) Theorem?',
          options: [
            'Deep learning is mathematically proven to outperform all classical ML models on every dataset.',
            'No single learning algorithm is universally superior to all others across all possible data distributions.',
            'Free software libraries have worse performance than proprietary software.',
            'Models with zero training error always achieve zero test error.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'deep-learning-supremacy-myth',
            2: 'open-source-myth',
            3: 'zero-error-myth',
          },
          explanation:
            'The No Free Lunch Theorem proves that algorithm superiority is conditional on whether the algorithm’s inductive bias matches the specific problem geometry.',
          difficulty: 'intermediate',
        },
        {
          id: 's12-q4',
          prompt: 'What is the primary purpose of conducting an Ablation Study?',
          options: [
            'To increase the number of parameters until training loss reaches zero.',
            'To isolate the individual contribution of specific pipeline components by removing them one at a time under controlled conditions.',
            'To encrypt model weights for secure deployment.',
            'To convert continuous features into categorical features.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'parameter-growth',
            2: 'security-ablation',
            3: 'categorical-ablation',
          },
          explanation:
            'Ablation verifies whether a specific preprocessing step, layer, or hyperparameter actually caused the observed performance improvement.',
          difficulty: 'advanced',
        },
        {
          id: 's12-q5',
          prompt: 'Why is setting a fixed pseudo-random seed (e.g. random_state=42) essential in controlled benchmark experiments?',
          options: [
            'It makes the model run twice as fast.',
            'It guarantees scientific reproducibility, ensuring that performance differences are due to algorithmic design rather than random initialization variance.',
            'It forces gradient descent to bypass saddle points.',
            'It eliminates the need for cross-validation.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'seed-speed-myth',
            2: 'saddle-bypass-myth',
            3: 'cv-elimination-myth',
          },
          explanation:
            'Fixed seeds ensure deterministic reproduction of stochastic operations (initialization, data shuffling), making benchmarks scientifically valid.',
          difficulty: 'beginner',
        },
      ],
    },
    {
      id: 's12-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have completed the entire 12-Stage Essential Curriculum: from fundamental paradigms and data literacy, through core algorithms and optimization, to rigorous evaluation and multi-model scientific benchmarks. Your laboratory experiments and mastery scores are preserved in your Personal Experiment Notebook.',
    },
  ],
};
