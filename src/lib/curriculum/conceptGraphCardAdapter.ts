/**
 * ML in Motion — Concept Graph Card Adapter
 * Bridges the 20-node Concept Knowledge Graph into ConceptCardUnit representations
 * for the Concept Deck View and Library.
 */

import type { ConceptCardUnit, ConceptCategory, ColorAccent, ConceptDifficulty } from '../../types/conceptCards.ts';
import { CONCEPT_CARDS_MAP, ConceptCardData } from '../learning/concepts/conceptCardsData.ts';

function mapSubjectToCategory(subject: string): ConceptCategory {
  switch (subject) {
    case 'mathematics':
      return 'ML Foundations';
    case 'optimization':
      return 'Optimization';
    case 'clustering':
      return 'Unsupervised Learning';
    default:
      return 'ML Foundations';
  }
}

function mapDifficulty(diff: string): ConceptDifficulty {
  switch (diff) {
    case 'foundational':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Intermediate';
  }
}

function mapColorAccent(subject: string): ColorAccent {
  switch (subject) {
    case 'mathematics':
      return 'amber';
    case 'optimization':
      return 'vermilion';
    case 'clustering':
      return 'ultramarine';
    default:
      return 'sage';
  }
}

export function adaptConceptDataToCardUnit(data: ConceptCardData): ConceptCardUnit {
  const category = mapSubjectToCategory(data.subject);
  const difficulty = mapDifficulty(data.difficulty);
  const colorAccent = mapColorAccent(data.subject);

  return {
    id: data.id,
    title: data.name,
    subtitle: data.plainLanguageDefinition,
    eyebrow: `${data.difficulty.toUpperCase()} // ${data.categoryTitle.toUpperCase()}`,
    category,
    difficulty,
    estimatedMinutes: data.difficulty === 'advanced' ? 12 : data.difficulty === 'intermediate' ? 8 : 5,
    prerequisites: data.prerequisites,
    nextConceptId: data.downstreamConcepts[0],
    cinemaStepId: data.linkedSimulation.isImplemented ? data.linkedSimulation.url : undefined,
    colorAccent,
    tags: [data.subject, data.difficulty, ...data.downstreamConcepts.slice(0, 3)],

    // 1. Nutshell
    nutshell: {
      definition: data.plainLanguageDefinition,
      whyExists: data.intuitiveExplanation,
      problemSolved: `Provides the mathematical foundation for ${data.name} in modern machine learning.`,
      primaryFormula: {
        latex: data.mathematicalFormulation.latex,
        label: data.mathematicalFormulation.formulaLabel,
        explanation: data.mathematicalFormulation.explanation,
      },
      keyCharacteristics: [
        `Subject: ${data.subject.toUpperCase()}`,
        `Difficulty tier: ${data.difficulty}`,
        `Downstream prerequisites supported: ${data.downstreamConcepts.length}`,
      ],
    },

    // 2. How it works
    howItWorks: {
      headline: `Step-by-Step Mathematical Mechanics of ${data.name}`,
      steps: data.workedExample.steps.map((st, idx) => ({
        stepNumber: idx + 1,
        title: `Operation ${idx + 1}`,
        description: st,
        mathDetail: idx === 0 ? data.mathematicalFormulation.latex : undefined,
      })),
      coreLoopSummary: data.workedExample.numericalOutcome,
    },

    // 3. Visual Example
    visualExample: {
      scenarioTitle: data.workedExample.title,
      relatableScenario: data.intuitiveExplanation,
      inputsDescription: `Input parameter configuration: ${data.workedExample.steps[0] || 'Initial state'}`,
      intermediateDescription: data.workedExample.steps[1] || 'Intermediate computation',
      outputDescription: data.workedExample.numericalOutcome,
      interactiveType: data.subject === 'clustering' ? 'kmeans' : 'gradient-descent',
    },

    // 4. Variants
    variants: {
      summary: `Associated theoretical regimes and related algorithms for ${data.name}.`,
      variants: [
        {
          id: `${data.id}-core`,
          name: 'Standard Formulation',
          tag: 'Analytical',
          badgeVariant: 'ultramarine',
          howItDiffers: 'Canonical formulation as defined in foundational machine learning textbooks.',
          idealUseCase: 'Rigorous analytical proofs and deterministic gradient stepping.',
        },
        {
          id: `${data.id}-practical`,
          name: 'Applied Numerical Implementation',
          tag: 'Numerical',
          badgeVariant: 'amber',
          howItDiffers: 'Floating-point numerical approximation evaluated within continuous tolerances.',
          idealUseCase: 'Interactive simulations, vector engines, and unit tests.',
        },
      ],
    },

    // 5. Implementation
    implementation: {
      industryTitle: `Production NumPy Implementation: ${data.name}`,
      realWorldScenario: `How ${data.name} is calculated in vector-accelerated machine learning libraries.`,
      inputsSpecs: 'NumPy array or floating point scalar parameters.',
      outputsSpecs: 'Evaluated scalar loss, gradient array, or updated parameter state.',
      keyHyperparameters: [
        {
          name: 'alpha / step_size',
          type: 'float',
          defaultVal: '0.01',
          role: 'Step magnitude scale hyperparameter.',
        },
      ],
      codeLanguage: 'python',
      codeSnippet: `# Analytical implementation for ${data.name}\nimport numpy as np\n\n# Mathematical formula:\n# ${data.mathematicalFormulation.latex}\nprint("Evaluated ${data.name}: ${data.workedExample.numericalOutcome}")`,
      codeExplanation: `Evaluates ${data.mathematicalFormulation.formulaLabel} deterministically.`,
    },

    // 6. Tradeoffs
    tradeoffs: {
      advantages: [
        'Deterministic, reproducible mathematical behavior',
        'Directly observable in interactive simulation workbenches',
        'Proven foundation for higher-order learning algorithms',
      ],
      limitations: [
        'Requires continuous domain differentiability or metric space assumptions',
        'Sensitive to ill-conditioned coordinate scales or learning rate extremes',
      ],
      fundamentalAssumptions: [
        'Euclidean distance metric or differentiable loss surface',
        'Finite, well-behaved floating-point coordinates',
      ],
      failureModes: [
        {
          symptom: 'Instability or divergence',
          underlyingReason: 'Exceeding critical learning rate or ill-conditioned Hessian curvature.',
          fix: 'Tune learning rate below 2/lambda_max or apply feature standardization.',
        },
      ],
    },

    // 7. Takeaways
    takeaways: {
      takeaways: [
        data.plainLanguageDefinition,
        `Key formula: ${data.mathematicalFormulation.latex}`,
        data.workedExample.numericalOutcome,
      ],
      misconception: {
        myth: data.commonMisconception.misconception,
        reality: data.commonMisconception.correction,
        whyLearnersConfuseIt: 'Learners often confuse local slope behavior with global function properties.',
      },
      recallQuestion: {
        id: `recall-${data.id}`,
        question: `What is the key governing principle of ${data.name}?`,
        options: [
          data.plainLanguageDefinition,
          data.commonMisconception.misconception,
          'Parameters must strictly converge to zero in all iterations',
          'Coordinate scales never affect convergence rates',
        ],
        correctIndex: 0,
        explanation: `Correct! ${data.plainLanguageDefinition}`,
      },
      nextConcept: data.downstreamConcepts[0]
        ? {
            id: data.downstreamConcepts[0],
            title: data.downstreamConcepts[0],
            whyNext: `Direct mathematical descendant in the concept knowledge graph.`,
          }
        : undefined,
    },
  };
}

export function getAllAdaptedConceptCards(): Record<string, ConceptCardUnit> {
  const result: Record<string, ConceptCardUnit> = {};
  for (const [id, data] of Object.entries(CONCEPT_CARDS_MAP)) {
    result[id] = adaptConceptDataToCardUnit(data);
  }
  return result;
}
