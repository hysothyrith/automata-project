import { AutomatonDefinition } from "./automaton.interface";

/**
 * This DFA should accept all strings containing a sequence of `a` zero or more times and ending in `b`
 */
export const dfa1: AutomatonDefinition = {
  symbols: ["a", "b"],
  states: {
    q0: { on: { a: "q0", b: "q1" } },
    q1: { on: { a: "q2", b: "q2" } },
    q2: { on: { a: "q2", b: "q2" } },
  },
  startState: "q0",
  finalStates: ["q1"],
};

/**
 * This NFA should accept all strings containing `b` at either the second or
 * third position from the end.
 */
export const nfa1: AutomatonDefinition = {
  symbols: ["a", "b"],
  states: {
    q0: { on: { a: "q0", b: ["q0", "q1"] } },
    q1: { on: { a: "q2", b: "q2", "": "q2" } },
    q2: { on: { a: "q3", b: "q3" } },
    q3: { on: {} },
  },
  startState: "q0",
  finalStates: ["q3"],
};

/**
 * This NFA should accept all strings ending in `abb`.
 */
export const nfa2: AutomatonDefinition = {
  symbols: ["a", "b"],
  states: {
    q0: { on: { a: ["q0", "q1"], b: "q0" } },
    q1: { on: { b: "q2" } },
    q2: { on: { b: "q3" } },
    q3: { on: {} },
  },
  startState: "q0",
  finalStates: ["q3"],
};
