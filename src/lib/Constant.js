export const EPSILON = "ε";
export const SMALL_PHI = "φ"

export const NFA1ForConvert= {
  symbols: ["0", "1"],
  states: {
    q0: { on: { 0: "q0", 1: "q1" } },
    q1: { on: { 0: ["q1", "q2"], 1: "q1" } },
    q2: { on: { 0: "q2", 1: ["q1", "q2"] } },
    q2: { on: { 0: "", 1: ["q1", "q2"] } },
  },
  startState: "q0",
  finalStates: ["q2"],
};
