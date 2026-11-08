/**
 * ML in Motion — Concept Knowledge Graph Validator
 * Mathematical verification of DAG properties, cycle detection, topological sorting,
 * and transitive prerequisite resolution.
 */

import type { ConceptNode } from './types.ts';
import { CONCEPT_GRAPH } from './conceptGraph.ts';

/**
 * Detects circular dependencies within the concept graph using DFS cycle detection.
 * Returns an array of cycles found (each cycle is an array of concept IDs).
 * An empty array indicates a valid Directed Acyclic Graph (DAG).
 */
export function detectCircularDependencies(
  nodes: Record<string, ConceptNode> = CONCEPT_GRAPH
): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const currentPath: string[] = [];

  function dfs(nodeId: string) {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    currentPath.push(nodeId);

    const node = nodes[nodeId];
    if (node && Array.isArray(node.prerequisites)) {
      for (const prereqId of node.prerequisites) {
        if (!nodes[prereqId]) {
          // Dangling prerequisite - not a cycle, but invalid reference
          continue;
        }

        if (!visited.has(prereqId)) {
          dfs(prereqId);
        } else if (recursionStack.has(prereqId)) {
          // Cycle detected!
          const cycleStartIdx = currentPath.indexOf(prereqId);
          if (cycleStartIdx !== -1) {
            cycles.push([...currentPath.slice(cycleStartIdx), prereqId]);
          }
        }
      }
    }

    currentPath.pop();
    recursionStack.delete(nodeId);
  }

  for (const nodeId of Object.keys(nodes)) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return cycles;
}

/**
 * Returns a topologically sorted array of concept IDs.
 * Prerequisites are guaranteed to appear before their dependent concepts.
 */
export function getTopologicalOrder(
  nodes: Record<string, ConceptNode> = CONCEPT_GRAPH
): string[] {
  const cycles = detectCircularDependencies(nodes);
  if (cycles.length > 0) {
    throw new Error(
      `Cannot compute topological order: Concept graph contains circular dependencies: ${JSON.stringify(cycles)}`
    );
  }

  const result: string[] = [];
  const visited = new Set<string>();

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes[nodeId];
    if (node && Array.isArray(node.prerequisites)) {
      for (const prereqId of node.prerequisites) {
        if (nodes[prereqId]) {
          visit(prereqId);
        }
      }
    }
    result.push(nodeId);
  }

  for (const nodeId of Object.keys(nodes)) {
    visit(nodeId);
  }

  return result;
}

/**
 * Validates whether a concept's prerequisites are all satisfied by the given set of mastered concepts.
 */
export function validatePrerequisites(
  conceptId: string,
  masteredConceptIds: Set<string>,
  nodes: Record<string, ConceptNode> = CONCEPT_GRAPH
): { satisfied: boolean; missingPrerequisites: string[] } {
  const node = nodes[conceptId];
  if (!node) {
    return { satisfied: false, missingPrerequisites: [conceptId] };
  }

  const missingPrerequisites = node.prerequisites.filter(
    (pId) => !masteredConceptIds.has(pId)
  );

  return {
    satisfied: missingPrerequisites.length === 0,
    missingPrerequisites,
  };
}

/**
 * Computes all transitive prerequisites for a concept (all ancestors in the DAG).
 */
export function getTransitivePrerequisites(
  conceptId: string,
  nodes: Record<string, ConceptNode> = CONCEPT_GRAPH
): string[] {
  const result = new Set<string>();
  const queue = [...(nodes[conceptId]?.prerequisites || [])];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!result.has(current)) {
      result.add(current);
      const parent = nodes[current];
      if (parent && Array.isArray(parent.prerequisites)) {
        for (const p of parent.prerequisites) {
          if (!result.has(p)) queue.push(p);
        }
      }
    }
  }

  return Array.from(result);
}

/**
 * Returns all direct child concepts that list `conceptId` as a prerequisite.
 */
export function getDirectDependents(
  conceptId: string,
  nodes: Record<string, ConceptNode> = CONCEPT_GRAPH
): string[] {
  const dependents: string[] = [];
  for (const [id, node] of Object.entries(nodes)) {
    if (node.prerequisites.includes(conceptId)) {
      dependents.push(id);
    }
  }
  return dependents;
}
