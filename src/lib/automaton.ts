import { coalesce } from "../utils/array.utils";
import { isEqual } from "../utils/set.utils";
import {
  Automaton,
  AutomatonDefinition,
  State,
  Symbol,
} from "./automaton.interface";

/**
 * The function to create an automaton that will be used by other functions in this library.
 * @throws if any component in the provided automaton definition references an unspecified state or symbol.
 * @returns a readonly object that describes the automaton.
 */
export function create(definition: AutomatonDefinition): Automaton {
  const {
    symbols: specifedSymbols,
    states,
    startState,
    finalStates,
  } = definition;
  // The empty string is also a symbol that we may encouter, so we’re adding it
  // to our `symbols` array
  const symbols = [...specifedSymbols, ""];

  if (!startState) {
    throw new Error("`startState` must be defined.");
  }

  // The given automaton definition cannot reference an unspecified symbol,
  // we’ll throw an error if it does.
  const symbolReferences = Object.keys(states).flatMap((state) =>
    Object.keys(states[state].on)
  );
  symbolReferences.forEach((symbol) => {
    if (!symbols.includes(symbol)) {
      throw new Error(
        `The symbol \`${symbol}\` was not specified in the automaton’s definition.`
      );
    }
  });

  // The given automaton definition cannot reference an unspecified state,
  // we’ll throw an error if it does.
  const stateReferences: State[] = [startState, ...finalStates];
  for (const state of Object.values(states)) {
    for (const transition of Object.values(state)) {
      for (const resultingStates of Object.values(transition)) {
        if (Array.isArray(resultingStates)) {
          resultingStates.forEach((state) => stateReferences.push(state));
        } else {
          stateReferences.push(resultingStates);
        }
      }
    }
  }

  const stateNames = Object.keys(states);
  stateReferences.forEach((state) => {
    if (!stateNames.includes(state)) {
      throw new Error(
        `The state \`${state}\` was not specified in the automaton’s definition.`
      );
    }
  });

  // We’ll freeze the definition before returning it to avoid mutation.
  Object.freeze(definition);
  Object.freeze(definition.states);
  Object.keys(definition.states).forEach((state) => {
    Object.freeze(definition.states[state]);
  });
  return definition;
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

/**
 * The function to determinize an automaton, i.e. convert a non-deterministic
 * automaton to a deterministic one.
 * @returns the new determinized automaton
 */
export function determinize(automaton: Automaton): Automaton {
  function transition(from: State, symbol: Symbol): State | State[] {
    return automaton.states[from].on[symbol];
  }

  function epsilonClose(states: Iterable<State>): Set<State> {
    const resultStates = new Set(states);

    function findEpsilonTransition(state: State) {
      const nextStates = transition(state, "");
      if (!nextStates) return;

      for (const state of coalesce(nextStates)) {
        if (!resultStates.has(state)) {
          resultStates.add(state);
          findEpsilonTransition(state);
        }
      }
    }

    for (const state of states) {
      findEpsilonTransition(state);
    }

    return resultStates;
  }

  function processStates(states: Iterable<State>, symbol: Symbol) {
    const resultStates = new Set<State>();

    for (const state of states) {
      for (const nextState of coalesce(transition(state, symbol))) {
        nextState && resultStates.add(nextState);
      }
    }

    return epsilonClose(resultStates);
  }

  function getNewStateName(index: number) {
    return `q${index}'`;
  }

  const newStates: Set<State>[] = [epsilonClose([automaton.startState])];
  const newStatesDefinition: AutomatonDefinition["states"] = {};

  for (let i = 0; i < newStates.length; i++) {
    const setToProcess = newStates[i];

    for (const symbol of automaton.symbols) {
      const resultStates = processStates(setToProcess, symbol);
      const sameSetIndex = newStates.findIndex((stateSet) =>
        isEqual(stateSet, resultStates)
      );
      if (sameSetIndex === -1) {
        newStates.push(resultStates);
      }

      const from = getNewStateName(i);
      if (!newStatesDefinition[from]) {
        newStatesDefinition[from] = { on: {} };
      }
      const to = getNewStateName(
        sameSetIndex === -1 ? newStates.length - 1 : sameSetIndex
      );
      newStatesDefinition[from].on[symbol] = to;
    }
  }

  const finalStates: State[] = [];
  automaton.finalStates.forEach((finalState) => {
    newStates.forEach((stateSet, index) => {
      if (stateSet.has(finalState)) {
        finalStates.push(getNewStateName(index));
      }
    });
  });

  return create({
    symbols: automaton.symbols,
    states: newStatesDefinition,
    startState: "q0'",
    finalStates,
  });
}
