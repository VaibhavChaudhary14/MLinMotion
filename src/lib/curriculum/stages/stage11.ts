import { Lesson } from '@/types';

export const stage11Lesson: Lesson = {
  id: 'model-evaluation',
  stageNumber: 11,
  stageCode: '11',
  layer: 'evaluation',
  algorithmId: 'model-evaluation',
  title: 'Stage 11: Model Evaluation & Generalization',
  subtitle: 'Cross-Validation, The Generalization Gap, Data Leakage, and Rigorous Metrics.',
  durationMinutes: 22,
  prerequisites: ['linear-regression', 'logistic-regression'],
  learningObjectives: [
    'Implement K-Fold Stratified Cross-Validation without data leakage.',
    'Quantify the Generalization Gap and identify overfitting boundaries.',
    'Evaluate regression models using MSE, RMSE, MAE, and understand R² constraints.',
    'Compute Confusion Matrix metrics: Precision, Recall, F1 Score, and ROC-AUC under class imbalance.',
    'Establish baseline naive benchmarks before declaring algorithmic success.',
  ],
  steps: [
    {
      id: 's11-1-hook',
      title: 'The Illusion of Accuracy',
      eyebrow: '01 // EVALUATION INTEGRITY',
      phase: 'hook',
      contentMarkdown:
        'Imagine a rare disease testing model that predicts "Healthy" for 100% of patients. In a population where 99.9% of people are healthy, this naive model achieves a staggering 99.9% accuracy, while failing to detect a single sick individual. Accuracy without context is fatal. Scientific machine learning requires evaluation metrics aligned with domain cost asymmetries.',
    },
    {
      id: 's11-2-intuition',
      title: 'K-Fold Stratified Cross-Validation',
      eyebrow: '02 // RESAMPLING TECHNIQUES',
      phase: 'intuition',
      contentMarkdown:
        'A single train/test split can suffer from high variance depending on how random samples fell. In K-Fold Cross-Validation, the training dataset is partitioned into K equal folds. The model is trained on K - 1 folds and tested on the remaining fold, repeating K times so every sample serves as validation once. Stratified K-Fold ensures every fold contains identical class proportions.',
      equation: '\\text{CV}_{(K)} = \\frac{1}{K} \\sum_{k=1}^K \\text{Score}_k',
    },
    {
      id: 's11-3-explore',
      title: 'The Confusion Matrix & Threshold Tradeoffs',
      eyebrow: '03 // METRIC EXPLORATION',
      phase: 'explore',
      interactiveComponent: 'confusion-matrix-simulator',
      contentMarkdown:
        'Binary predictions partition into four quadrants: True Positives (TP), False Positives (FP), False Negatives (FN), and True Negatives (TN). Precision measures how many predicted positives were actually positive (TP / (TP + FP)). Recall (Sensitivity) measures how many actual positives were successfully found (TP / (TP + FN)). The F1 score computes their harmonic mean.',
      equation: '\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}, \\quad F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    },
    {
      id: 's11-4-predict',
      title: 'The Metric Selection Challenge',
      eyebrow: '04 // PREDICTION CHALLENGE',
      phase: 'predict',
      contentMarkdown:
        'You are designing a security camera alarm system for a high-security bank vault. If an intruder is present, missing them (False Negative) is catastrophic. However, a false alarm (False Positive) merely causes a guard to check the monitor.',
      predictionOptions: {
        question:
          'Which metric must you prioritize optimizing when calibrating the decision threshold?',
        options: [
          'High Precision (minimize false alarms even if intruders are missed).',
          'High Recall (Sensitivity) (maximize intruder detection, tolerating false alarms).',
          'R² coefficient.',
          'Inertia within-cluster sum of squares.',
        ],
        correctIndex: 1,
        explanation:
          'When missing a positive case carries catastrophic cost (cancer screening, fraud detection, intruders), you must maximize Recall, shifting the decision threshold lower.',
      },
    },
    {
      id: 's11-5-reveal',
      title: 'Regression Metrics: MSE vs RMSE vs MAE',
      eyebrow: '05 // CONTINUOUS METRICS',
      phase: 'reveal',
      contentMarkdown:
        'For continuous regression, metrics penalize errors differently: Mean Squared Error (MSE) squares residuals, penalizing large outliers quadratically. Root Mean Squared Error (RMSE) brings units back to the original target scale. Mean Absolute Error (MAE) treats all error magnitudes linearly, remaining robust against isolated extreme outliers.',
      equation: '\\text{MAE} = \\frac{1}{N} \\sum_{i=1}^N |y_i - \\hat{y}_i|, \\quad \\text{RMSE} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2}',
    },
    {
      id: 's11-6-under-the-hood',
      title: 'ROC-AUC: Threshold-Free Discrimination',
      eyebrow: '06 // CURVE INTEGRATION',
      phase: 'under-the-hood',
      contentMarkdown:
        'The Receiver Operating Characteristic (ROC) curve plots True Positive Rate (Recall) against False Positive Rate across all possible decision thresholds tau from 0 to 1. The Area Under the Curve (AUC) measures the probability that the model ranks a randomly chosen positive observation higher than a randomly chosen negative observation. AUC = 0.5 is random guessing; AUC = 1.0 is perfect discrimination.',
    },
    {
      id: 's11-7-break-it',
      title: 'The Danger of No Baseline Comparison',
      eyebrow: '07 // SCIENTIFIC SANITY CHECK',
      phase: 'break-it',
      contentMarkdown:
        'Before claiming an algorithm is successful, always benchmark against a trivial Baseline Model (Dummy Classifier / Dummy Regressor): 1) In classification: predict the majority class. 2) In regression: predict the sample mean y_bar. If a complex deep learning model achieves 82% accuracy, but the majority class baseline achieves 85%, the model has learned nothing useful.',
      equation: '\\hat{y}_{\\text{baseline}} = \\bar{y} \\quad \\text{(Mean Regressor)}, \\quad \\hat{y}_{\\text{baseline}} = \\arg\\max_c P(y = c) \\quad \\text{(Majority Classifier)}',
    },
    {
      id: 's11-8-code-it',
      title: 'Stratified Cross-Validation & Reports in Python',
      eyebrow: '08 // IMPLEMENTATION',
      phase: 'code-it',
      contentMarkdown:
        'Inspect how scikit-learn computes cross-validation scores and comprehensive precision/recall/F1 reports.',
      codeSnippet: {
        python: `import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression

# 5-Fold Stratified Cross-Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = LogisticRegression()

# Compute unbiased cross-validation F1 scores across 5 folds
f1_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='f1')

print("5-Fold Mean F1:", np.round(f1_scores.mean(), 3))
print("Fold Standard Deviation:", np.round(f1_scores.std(), 3))`,
        sklearn: 'from sklearn.model_selection import cross_val_score',
        explanation:
          'StratifiedKFold ensures that every validation fold preserves identical class ratios, preventing split bias.',
      },
    },
    {
      id: 's11-9-assessment',
      title: 'Diagnostic Knowledge Check',
      eyebrow: '09 // DIAGNOSTIC ASSESSMENT',
      phase: 'assessment',
      contentMarkdown:
        'Verify your evaluation rigor across classification, regression, and cross-validation.',
      questions: [
        {
          id: 's11-q1',
          prompt: 'Why is Accuracy an invalid metric on heavily imbalanced datasets (e.g. 99% negative, 1% positive)?',
          options: [
            'Accuracy calculations cause floating point overflow.',
            'A naive dummy model predicting negative 100% of the time achieves 99% accuracy while detecting zero positives.',
            'Accuracy cannot be calculated when class labels are integers.',
            'Accuracy is only defined for unsupervised clustering.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'overflow-accuracy',
            2: 'integer-accuracy-myth',
            3: 'unsupervised-accuracy',
          },
          explanation:
            'Accuracy rewards predicting the majority class and hides complete failure on the critical minority class.',
          difficulty: 'beginner',
        },
        {
          id: 's11-q2',
          prompt: 'What does the F1 score mathematically represent?',
          options: [
            'The arithmetic mean of accuracy and loss.',
            'The harmonic mean of precision and recall: 2 * (P * R) / (P + R).',
            'The area under the ROC curve.',
            'The variance of the residuals.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'f1-arithmetic-mean',
            2: 'f1-is-auc',
            3: 'f1-is-variance',
          },
          explanation:
            'The harmonic mean penalizes extreme imbalances between Precision and Recall more heavily than an arithmetic average.',
          difficulty: 'intermediate',
        },
        {
          id: 's11-q3',
          prompt: 'How does Mean Absolute Error (MAE) behave differently than Mean Squared Error (MSE)?',
          options: [
            'MAE squares errors, heavily penalizing large outliers.',
            'MAE treats errors linearly, remaining much more robust against isolated extreme outliers than MSE.',
            'MAE is always negative.',
            'MAE requires calculating matrix inverses.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'mae-squares-myth',
            2: 'negative-mae-myth',
            3: 'matrix-mae-myth',
          },
          explanation:
            'MSE squares deviations, causing single extreme outliers to dominate the loss. MAE grows linearly with error magnitude.',
          difficulty: 'intermediate',
        },
        {
          id: 's11-q4',
          prompt: 'What does an ROC-AUC score of 0.5 indicate?',
          options: [
            'The model has 50% training error.',
            'The model has zero discrimination ability, performing no better than random guessing.',
            'The model is perfectly calibrated.',
            'The model requires 2 clusters.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'auc-is-error',
            2: 'auc-calibration',
            3: 'auc-clustering',
          },
          explanation:
            'An ROC curve along the diagonal line with AUC = 0.5 represents a completely uninformative random coin-toss classifier.',
          difficulty: 'beginner',
        },
        {
          id: 's11-q5',
          prompt: 'Why should preprocessing transformers (e.g. StandardScaler) be fit inside each cross-validation fold?',
          options: [
            'To make the code run faster.',
            'To prevent test/validation fold statistics from leaking into the training pipeline.',
            'Because scikit-learn throws an error if fit outside.',
            'To double the sample size.',
          ],
          correctIndex: 1,
          misconceptionMap: {
            0: 'cv-speed-myth',
            2: 'crash-myth',
            3: 'sample-multiplier-myth',
          },
          explanation:
            'Fitting scalers outside cross-validation folds leaks validation distribution parameters into training.',
          difficulty: 'intermediate',
        },
      ],
    },
    {
      id: 's11-10-mastery',
      title: 'Synthesis & Path Ahead',
      eyebrow: '10 // MASTERY & SYNTHESIS',
      phase: 'mastery',
      contentMarkdown:
        'You have mastered cross-validation, confusion matrices, asymmetric cost trade-offs, and leak-free metric computation. Next, advance into Stage 12: Model Comparison & Scientific Experimentation to put competing algorithmic philosophies head-to-head on controlled benchmarks.',
    },
  ],
};
