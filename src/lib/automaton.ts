import { Automaton, AutomatonDefinition } from "./automaton.interface";

export function create(defition: AutomatonDefinition): Automaton {
  return Object.freeze(defition);
}

export function accepts(
  automaton: Automaton,
  input: string | string[]
): boolean {
  throw new Error("TODO");
}

export function rejects(
  automaton: Automaton,
  input: string | string[]
): boolean {
  throw new Error("TODO");
}

export function isDeterministic(automaton: Automaton): boolean {
  throw new Error("TODO");
}

export function isNonDeterministic(automaton: Automaton): boolean {
  throw new Error("TODO");
}

export function minimize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}

export function determinize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}
