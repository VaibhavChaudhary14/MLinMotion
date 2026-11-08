/**
 * ML in Motion — Deterministic Local-First Spaced Revision Scheduler
 *
 * Implements an explainable interval policy:
 * - Successful retrieval exponentially expands the revision interval (1d -> 2d -> 5d -> 12d -> 30d).
 * - Incorrect answers reset the interval to 1 day for prompt reinforcement.
 * - Concepts in NEEDS_REVISION state are automatically prioritized to the top of the queue.
 */

import type { RevisionItem, RevisionUrgency } from './types.ts';
import type { ConceptMasteryRecord, RevisionScheduleRecord } from '../types.ts';
import { CONCEPT_GRAPH } from '../concepts/conceptGraph.ts';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const INTERVAL_LADDER = [1, 2, 5, 12, 30]; // Deterministic day intervals

/**
 * Computes next revision schedule after an assessment or practice attempt.
 */
export function computeNextRevisionSchedule(
  conceptId: string,
  wasCorrect: boolean,
  currentRecord?: RevisionScheduleRecord,
  now: number = Date.now()
): RevisionScheduleRecord {
  const currentCount = currentRecord?.repetitionCount || 0;

  if (wasCorrect) {
    const nextLadderIdx = Math.min(INTERVAL_LADDER.length - 1, currentCount);
    const intervalDays = INTERVAL_LADDER[nextLadderIdx];
    return {
      conceptId,
      nextRevisionDate: now + intervalDays * ONE_DAY_MS,
      intervalDays,
      repetitionCount: currentCount + 1,
      lastReviewedAt: now,
      reason: `Successful retrieval: Interval expanded to ${intervalDays} day${intervalDays > 1 ? 's' : ''} to reinforce long-term memory retention.`,
    };
  }

  // Failed retrieval: reset to 1 day
  return {
    conceptId,
    nextRevisionDate: now + 1 * ONE_DAY_MS,
    intervalDays: 1,
    repetitionCount: 0,
    lastReviewedAt: now,
    reason: 'Incorrect retrieval: Reset to 1-day interval for immediate reinforcement.',
  };
}

/**
 * Scans the learner profile and concept mastery states to construct an active revision queue.
 */
export function getActiveRevisionQueue(
  schedules: Record<string, RevisionScheduleRecord>,
  masteryRecords: Record<string, ConceptMasteryRecord>,
  now: number = Date.now()
): RevisionItem[] {
  const items: RevisionItem[] = [];

  // 1. First add any concepts whose mastery state is explicitly NEEDS_REVISION
  for (const [cId, mRecord] of Object.entries(masteryRecords)) {
    if (mRecord.state === 'NEEDS_REVISION') {
      const concept = CONCEPT_GRAPH[cId];
      if (!concept) continue;
      const sched = schedules[cId];
      items.push({
        conceptId: cId,
        conceptName: concept.name,
        subject: concept.subject,
        dueDate: now,
        intervalDays: sched?.intervalDays || 1,
        repetitionCount: sched?.repetitionCount || 0,
        reason: 'Priority Review: Misconception or diagnostic failure detected in recent attempt.',
        urgency: 'overdue',
        recommendedAction: {
          label: concept.relatedSimulationUrl ? 'LAUNCH SIMULATION' : 'REVIEW CONCEPT',
          url: concept.relatedSimulationUrl || `/concepts/${cId}`,
        },
      });
    }
  }

  // 2. Add scheduled revisions that are due or upcoming
  for (const [cId, sched] of Object.entries(schedules)) {
    // Avoid duplicate if already added via NEEDS_REVISION
    if (items.some((it) => it.conceptId === cId)) continue;

    const concept = CONCEPT_GRAPH[cId];
    if (!concept) continue;

    const diffMs = sched.nextRevisionDate - now;
    let urgency: RevisionUrgency = 'upcoming';

    if (diffMs <= -ONE_DAY_MS) {
      urgency = 'overdue';
    } else if (diffMs <= ONE_DAY_MS) {
      urgency = 'due_now';
    }

    // Only include if due or upcoming within 3 days
    if (diffMs <= 3 * ONE_DAY_MS) {
      items.push({
        conceptId: cId,
        conceptName: concept.name,
        subject: concept.subject,
        dueDate: sched.nextRevisionDate,
        intervalDays: sched.intervalDays,
        repetitionCount: sched.repetitionCount,
        reason: sched.reason,
        urgency,
        recommendedAction: {
          label: concept.relatedSimulationUrl ? 'PRACTICE WORKBENCH' : 'PRACTICE QUESTIONS',
          url: concept.relatedSimulationUrl || `/concepts/${cId}`,
        },
      });
    }
  }

  // Sort: overdue first, then due_now, then upcoming
  const urgencyWeight: Record<RevisionUrgency, number> = {
    overdue: 0,
    due_now: 1,
    upcoming: 2,
  };

  items.sort((a, b) => {
    if (urgencyWeight[a.urgency] !== urgencyWeight[b.urgency]) {
      return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
    }
    return a.dueDate - b.dueDate;
  });

  return items;
}
