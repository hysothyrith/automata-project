import { describe, expect, it } from "vitest";
import { create, minimize } from "./automaton";
import { AutomatonDefinition } from "./automaton.interface";

describe("Automaton functions", () => {
  describe("`create` function", () => {
    const BASE_DEFINITION: AutomatonDefinition = {
      symbols: ["a", "b"],
      states: {
        q0: { on: { a: "q0", b: "q1" } },
        q1: { on: { a: "q2", b: "q2" } },
        q2: { on: { a: "q2", b: "q2" } },
      },
      startState: "q0",
      finalStates: ["q1"],
    };

    it("throws error when `states` references an unspecified symbol", () => {
      expect(() => {
        create({
          ...BASE_DEFINITION,
          states: {
            ...BASE_DEFINITION.states,
            q0: { on: { UNSPECIFIED_SYMBOL: "q0" } },
          },
        });
      }).toThrowError();
    });

    it("does not throw error when `states` contains a transition on epsilon", () => {
      expect(() => {
        create({
          ...BASE_DEFINITION,
          states: {
            ...BASE_DEFINITION.states,
            q0: { on: { "": "q0" } },
          },
        });
      }).not.toThrowError();
    });

    it("throws error when any component references an unspecified state", () => {
      expect(() => {
        create({ ...BASE_DEFINITION, startState: "UNSPECIFIED_STATE" });
      }).toThrowError();

      expect(() => {
        create({
          ...BASE_DEFINITION,
          finalStates: ["q0", "UNSPECIFIED_STATE"],
        });
      }).toThrowError();

      expect(() => {
        create({
          ...BASE_DEFINITION,
          states: {
            ...BASE_DEFINITION.states,
            q0: { on: { a: "q0", b: "UNSPECIFIED_STATE" } },
          },
        });
      }).toThrowError();

      expect(() => {
        create({
          ...BASE_DEFINITION,
          states: {
            ...BASE_DEFINITION.states,
            q0: { on: { a: "q0", b: ["q0", "UNSPECIFIED_STATE"] } },
          },
        });
      }).toThrowError();
    });

    it("throws error when `startState` is not defined", () => {
      expect(() => {
        create({ ...BASE_DEFINITION, startState: "" });
      }).toThrowError();
    });
  });
});

describe("`minimize` function", () => {
  it("minimizes automata", () => {
    const dfa = create({
      symbols: ["a", "b"],
      states: {
        q0: { on: { a: "q1", b: "q5" } },
        q1: { on: { a: "q6", b: "q2" } },
        q2: { on: { a: ["q0"], b: ["q2"] } },
        q3: { on: { a: ["q2"], b: ["q6"] } },
        q4: { on: { a: ["q7"], b: ["q5"] } },
        q5: { on: { a: ["q2"], b: ["q6"] } },
        q6: { on: { a: ["q6"], b: ["q4"] } },
        q7: { on: { a: ["q6"], b: ["q2"] } },
      },
      startState: "q0",
      finalStates: ["q2"],
    });

    const minimalDfa = minimize(dfa);

    expect(minimalDfa.symbols).toEqual(dfa.symbols);
    expect(minimalDfa.startState).toBe("q0'");
    expect(minimalDfa.finalStates).toEqual(["q2'"]);

    const statesCount = Object.keys(minimalDfa.states).length;
    expect(statesCount).toBe(5);
    expect(minimalDfa.states).toEqual({
      "q0'": { on: { a: "q1'", b: "q3'" } },
      "q1'": { on: { a: "q4'", b: "q2'" } },
      "q2'": { on: { a: "q0'", b: "q2'" } },
      "q3'": { on: { a: "q2'", b: "q4'" } },
      "q4'": { on: { a: "q4'", b: "q0'" } },
    });
  });
});
