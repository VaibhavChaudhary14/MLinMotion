export type ConceptCategory =
  | 'Supervised Learning'
  | 'Unsupervised Learning'
  | 'Optimization'
  | 'Ensemble Learning'
  | 'Dimensionality Reduction'
  | 'ML Foundations';

export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ColorAccent = 'vermilion' | 'ultramarine' | 'amber' | 'sage' | 'plum';

// -------------------------------------------------------------
// CARD 1: Concept in a Nutshell
// -------------------------------------------------------------
export interface ConceptNutshellCard {
  definition: string;
  whyExists: string;
  problemSolved: string;
  primaryFormula?: {
    latex: string;
    label: string;
    explanation?: string;
  };
  keyCharacteristics: string[];
}

// -------------------------------------------------------------
// CARD 2: How Does It Work?
// -------------------------------------------------------------
export interface ConceptStep {
  stepNumber: number;
  title: string;
  description: string;
  mathDetail?: string; // LaTeX expression
  diagramNote?: string;
}

export interface ConceptHowItWorksCard {
  headline: string;
  steps: ConceptStep[];
  coreLoopSummary: string;
}

// -------------------------------------------------------------
// CARD 3: Visual Example
// -------------------------------------------------------------
export interface VisualExampleCard {
  scenarioTitle: string;
  relatableScenario: string;
  inputsDescription: string;
  intermediateDescription: string;
  outputDescription: string;
  interactiveType:
    | 'linear-regression'
    | 'gradient-descent'
    | 'kmeans'
    | 'logistic-regression'
    | 'decision-trees'
    | 'pca'
    | 'ensemble-learning';
}

// -------------------------------------------------------------
// CARD 4: Types / Methods / Variants
// -------------------------------------------------------------
export interface ConceptVariant {
  id: string;
  name: string;
  tag: string;
  badgeVariant: 'vermilion' | 'ultramarine' | 'amber' | 'sage' | 'neutral';
  howItDiffers: string;
  idealUseCase: string;
  drawback?: string;
}

export interface ConceptVariantsCard {
  summary: string;
  variants: ConceptVariant[];
}

// -------------------------------------------------------------
// CARD 5: Real-Life Implementation
// -------------------------------------------------------------
export interface HyperparameterSpec {
  name: string;
  type: string;
  defaultVal: string;
  role: string;
}

export interface ConceptImplementationCard {
  industryTitle: string;
  realWorldScenario: string;
  inputsSpecs: string;
  outputsSpecs: string;
  keyHyperparameters: HyperparameterSpec[];
  codeLanguage: 'python';
  codeSnippet: string;
  codeExplanation: string;
}

// -------------------------------------------------------------
// CARD 6: Advantages & Limitations
// -------------------------------------------------------------
export interface FailureModeItem {
  symptom: string;
  underlyingReason: string;
  fix: string;
}

export interface ConceptTradeoffsCard {
  advantages: string[];
  limitations: string[];
  fundamentalAssumptions: string[];
  failureModes: FailureModeItem[];
}

// -------------------------------------------------------------
// CARD 7: Key Takeaways & Recall
// -------------------------------------------------------------
export interface MisconceptionSpec {
  myth: string;
  reality: string;
  whyLearnersConfuseIt: string;
}

export interface RecallQuestionSpec {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NextConceptRef {
  id: string;
  title: string;
  whyNext: string;
}

export interface ConceptTakeawaysCard {
  takeaways: string[];
  misconception: MisconceptionSpec;
  recallQuestion: RecallQuestionSpec;
  nextConcept?: NextConceptRef;
}

// -------------------------------------------------------------
// Full Concept Unit Specification
// -------------------------------------------------------------
export interface ConceptCardUnit {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string; // e.g. "01 // SUPERVISED LEARNING"
  category: ConceptCategory;
  difficulty: ConceptDifficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  nextConceptId?: string;
  labAlgorithmId?: string;
  cinemaStepId?: string;
  colorAccent: ColorAccent;
  tags: string[];

  // The 7 Standard Cards
  nutshell: ConceptNutshellCard;
  howItWorks: ConceptHowItWorksCard;
  visualExample: VisualExampleCard;
  variants: ConceptVariantsCard;
  implementation: ConceptImplementationCard;
  tradeoffs: ConceptTradeoffsCard;
  takeaways: ConceptTakeawaysCard;
}
