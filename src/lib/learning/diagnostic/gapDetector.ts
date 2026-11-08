/**
 * ML in Motion — Explainable Concept Gap Detector & Remediation Generator
 * 
 * Rules:
 * - Evidence-based: gaps derive strictly from incorrect diagnostic responses and verified historical mistakes.
 * - ZERO inference from time spent, bounce rate, or page views.
 * - Prerequisite-aware: traces downstream struggles to upstream foundational root causes.
 * - Non-destructive: a single diagnostic mistake does NOT revoke pre-existing MASTERED status.
 */

import type {
  DiagnosticQuestionEvaluation,
  ConceptGap,
  RemediationAction,
} from './types.ts';
import { CONCEPT_GRAPH } from '../concepts/conceptGraph.ts';
import type { ConceptMasteryState, PracticeAttemptRecord } from '../types.ts';

export interface GapDetectionInput {
  evaluations: DiagnosticQuestionEvaluation[];
  conceptScores: Record<string, { total: number; correct: number; percentage: number }>;
  historicalPractice?: PracticeAttemptRecord[];
  currentMasteryStates?: Record<string, ConceptMasteryState>;
}

/**
 * Detects prerequisite and conceptual gaps from diagnostic evaluations.
 */
export function detectConceptGaps(input: GapDetectionInput): ConceptGap[] {
  const { evaluations, conceptScores, historicalPractice = [], currentMasteryStates = {} } = input;
  const gaps: ConceptGap[] = [];

  // Group evaluations by concept
  const evaluationsByConcept: Record<string, DiagnosticQuestionEvaluation[]> = {};
  for (const ev of evaluations) {
    if (!evaluationsByConcept[ev.conceptId]) {
      evaluationsByConcept[ev.conceptId] = [];
    }
    evaluationsByConcept[ev.conceptId].push(ev);
  }

  // Iterate over tested concepts
  for (const [conceptId, evList] of Object.entries(evaluationsByConcept)) {
    const concept = CONCEPT_GRAPH[conceptId];
    if (!concept) continue;

    const mistakes = evList.filter((e) => !e.isCorrect);
    if (mistakes.length === 0) continue; // All questions for this concept were correct!

    const scoreData = conceptScores[conceptId] || { total: evList.length, correct: evList.length - mistakes.length, percentage: 0 };
    const mistakeCount = mistakes.length;

    // Check historical practice failures for this concept
    const priorFailures = historicalPractice.filter((p) => p.conceptId === conceptId && !p.isCorrect).length;
    const isRepeated = priorFailures > 0;

    // Determine confidence and severity thresholds
    let confidence: 'preliminary' | 'confirmed' | 'critical' = 'preliminary';
    let severity: 'low' | 'medium' | 'high' = 'medium';

    if (mistakeCount >= 2 || (mistakeCount >= 1 && isRepeated)) {
      confidence = isRepeated ? 'critical' : 'confirmed';
      severity = 'high';
    } else if (concept.difficulty === 'foundational') {
      confidence = 'confirmed';
      severity = 'high';
    } else {
      confidence = 'preliminary';
      severity = 'medium';
    }

    // Trace upstream prerequisite root cause
    let rootCausePrereqId: string | undefined;
    for (const prereqId of concept.prerequisites) {
      // Check if prerequisite was also tested and missed
      const prereqEvs = evaluationsByConcept[prereqId];
      if (prereqEvs && prereqEvs.some((e) => !e.isCorrect)) {
        rootCausePrereqId = prereqId;
        break;
      }
      // Or check if prerequisite is currently unattempted or NOT_STARTED
      if (currentMasteryStates[prereqId] === 'NOT_STARTED') {
        rootCausePrereqId = prereqId;
        break;
      }
    }

    // Synthesize explainable pedagogical recommendation
    let recommendation = '';
    const rootConcept = rootCausePrereqId ? CONCEPT_GRAPH[rootCausePrereqId] : undefined;

    if (rootConcept) {
      recommendation = `Review prerequisite ${rootConcept.name} (${rootConcept.id}) before continuing with ${concept.name}. Your diagnostic results indicate that fundamental difficulties with ${rootConcept.name} are impacting your mastery of ${concept.name}.`;
    } else if (confidence === 'critical') {
      recommendation = `Recurring difficulty detected in ${concept.name}. Multiple attempts on ${concept.name} have encountered common misconceptions. Review the worked examples and run targeted simulation experiments.`;
    } else if (confidence === 'confirmed') {
      recommendation = `Targeted review recommended for ${concept.name}. Your diagnostic responses indicate misconceptions with its analytical properties.`;
    } else {
      recommendation = `Preliminary review suggestion for ${concept.name}. Re-check the core definition and test with a practice problem to consolidate understanding.`;
    }

    // Assemble actionable remediation items
    const remediationActions: RemediationAction[] = [];

    // 1. Concept Card action
    remediationActions.push({
      id: `rem-card-${conceptId}`,
      type: 'read_card',
      title: `Study Concept Card: ${concept.name}`,
      description: `Read the formal definition, worked numerical example, and common misconceptions for ${concept.name}.`,
      url: `/concepts/${conceptId}`,
      conceptId,
      priority: 'high',
    });

    // 2. Prerequisite review action (if root cause found)
    if (rootConcept) {
      remediationActions.push({
        id: `rem-prereq-${rootConcept.id}`,
        type: 'review_prereq',
        title: `Bridge Prerequisite: ${rootConcept.name}`,
        description: `Consolidate ${rootConcept.name} to ensure the mathematical foundation for ${concept.name} is secure.`,
        url: `/concepts/${rootConcept.id}`,
        conceptId: rootConcept.id,
        priority: 'high',
      });
    }

    // 3. Simulation workbench action (if implemented)
    if (concept.relatedSimulationUrl) {
      remediationActions.push({
        id: `rem-sim-${conceptId}`,
        type: 'simulation',
        title: `Explore Interactive Simulation`,
        description: `Interact with dynamic parameter adjustments and visual manifolds for ${concept.name}.`,
        url: concept.relatedSimulationUrl,
        conceptId,
        priority: 'medium',
      });
    }

    // 4. Practice question action
    remediationActions.push({
      id: `rem-prac-${conceptId}`,
      type: 'practice',
      title: `Attempt Practice Question`,
      description: `Verify your understanding with a targeted mathematical problem for ${concept.name}.`,
      url: `/dashboard?practice=${conceptId}`,
      conceptId,
      priority: 'medium',
    });

    gaps.push({
      conceptId,
      conceptName: concept.name,
      subject: concept.subject,
      confidence,
      severity,
      score: scoreData.percentage,
      mistakeCount,
      rootCausePrerequisiteId: rootCausePrereqId,
      explainableRecommendation: recommendation,
      remediationActions,
    });
  }

  // Sort gaps: critical first, then confirmed, then preliminary
  const priorityWeight = { critical: 3, confirmed: 2, preliminary: 1 };
  gaps.sort((a, b) => priorityWeight[b.confidence] - priorityWeight[a.confidence]);

  return gaps;
}
