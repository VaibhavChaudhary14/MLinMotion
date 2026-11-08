/**
 * ML in Motion — Spaced Revision Planner Types
 */

export type RevisionUrgency = 'overdue' | 'due_now' | 'upcoming';

export interface RevisionItem {
  conceptId: string;
  conceptName: string;
  subject: string;
  dueDate: number;
  intervalDays: number;
  repetitionCount: number;
  reason: string;
  urgency: RevisionUrgency;
  recommendedAction: {
    label: string;
    url: string;
  };
}
