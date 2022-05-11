// This symbol "ε" use for empty string mean that: A state(q1) can make transaction to other state with "ε" symbol
export const EPSILON = "ε" 
// This symbol "φ" use for non transaction mean that: states do not make transaction throught symbols 
export const SMALL_PHI = "φ"

export const NFA1ForConvert= {
  symbols: ["0", "1"],
  states: {
    q0: { on: { 0: "q0", 1: "q1" } },
    q1: { on: { 0: ["q1", "q2"], 1: "q1" } },
    q2: { on: { 0: "q2", 1: ["q1", "q2"] } },
    q3: { on: { 0: "", 1: ["q1", "q3"] } },
  },
  startState: "q0",
  finalStates: ["q2"],
};
