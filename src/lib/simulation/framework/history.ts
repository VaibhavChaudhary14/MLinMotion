/**
 * ML in Motion — Shared Algorithm Simulation Framework
 * History & Snapshot Management Utilities (Phase 04)
 *
 * Implements immutable snapshot cloning, stack operations, and reversibility safeguards.
 */

import type { BaseSimulationSnapshot } from './types.ts';

/**
 * Deep clones an arbitrary simulation snapshot to prevent accidental reference mutation.
 */
export function cloneSnapshot<T extends BaseSimulationSnapshot>(snapshot: T): T {
  // Use structuredClone if available, with JSON fallback for environments lacking it
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(snapshot);
    } catch {
      // fallback
    }
  }
  return JSON.parse(JSON.stringify(snapshot));
}

/**
 * Immutably appends a new snapshot onto a history stack, enforcing optional maximum depth ceilings.
 */
export function appendSnapshot<T extends BaseSimulationSnapshot>(
  historyStack: ReadonlyArray<T>,
  newSnapshot: T,
  maxStackDepth: number = 200
): T[] {
  const cloned = cloneSnapshot(newSnapshot);
  const nextStack = [...historyStack, cloned];
  if (nextStack.length > maxStackDepth) {
    // Retain initial snapshot (index 0) and slide the window for subsequent steps
    return [nextStack[0], ...nextStack.slice(nextStack.length - maxStackDepth + 1)];
  }
  return nextStack;
}

/**
 * Pops the top snapshot and restores the immediately preceding snapshot.
 * If only the root snapshot remains (length <= 1), returns the stack unchanged.
 */
export function popHistoricalSnapshot<T extends BaseSimulationSnapshot>(
  historyStack: ReadonlyArray<T>
): {
  newStack: T[];
  restoredSnapshot: T;
  hasReverted: boolean;
} {
  if (historyStack.length <= 1) {
    return {
      newStack: [...historyStack],
      restoredSnapshot: historyStack[0],
      hasReverted: false,
    };
  }

  const newStack = historyStack.slice(0, -1);
  const restoredSnapshot = cloneSnapshot(newStack[newStack.length - 1]);

  return {
    newStack,
    restoredSnapshot,
    hasReverted: true,
  };
}

/**
 * Validates that all numeric fields in a snapshot are finite numbers (not NaN, null, or Infinity).
 */
export function validateSnapshotFiniteness(value: unknown, path = 'root'): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return false;
    }
    return true;
  }
  if (Array.isArray(value)) {
    return value.every((item, idx) => validateSnapshotFiniteness(item, `${path}[${idx}]`));
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).every(([k, v]) =>
      validateSnapshotFiniteness(v, `${path}.${k}`)
    );
  }
  return true;
}
