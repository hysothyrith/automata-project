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

/**
 * When given an automaton, this function returns a new equivalent automaton but
 * with the minimum number of states.
 * @throws if the passed `automaton` is non-deterministic.
 * @returns the new minimal automaton.
 */
export function minimize(automaton: Automaton): Automaton {
  function transition(from: State, symbol: Symbol): State {
    const nextState = automaton.states[from].on[symbol];
    return Array.isArray(nextState) ? nextState[0] : nextState;
  }

  function getAccessibleStates(): State[] {
    const accessibleStates = [automaton.startState];
    for (
      let indexToCheck = 0;
      indexToCheck < accessibleStates.length;
      indexToCheck++
    ) {
      const possibleNextStates = Object.values(
        automaton.states[accessibleStates[indexToCheck]].on
      ).map((state) => (Array.isArray(state) ? state[0] : state));

      possibleNextStates.forEach((state) => {
        if (!accessibleStates.includes(state)) {
          accessibleStates.push(state);
        }
      });
    }
    return accessibleStates.sort();
  }

  function isDistinguishable(stateA: State, stateB: State): boolean {
    const finalStates = new Set(automaton.finalStates);
    if (
      (finalStates.has(stateA) && !finalStates.has(stateB)) ||
      (finalStates.has(stateB) && !finalStates.has(stateA))
    ) {
      return true;
    }
    if (stateA === stateB) {
      return false;
    }

    return automaton.symbols.some((symbol) =>
      isDistinguishable(transition(stateA, symbol), transition(stateB, symbol))
    );
  }

  function getNewStateName(index: number) {
    return `q${index}'`;
  }

  const accessibleStates = getAccessibleStates();
  const statePairs: State[][] = [];
  for (let i = 0; i < accessibleStates.length - 1; i++) {
    for (let j = i + 1; j < accessibleStates.length; j++) {
      statePairs.push([accessibleStates[i], accessibleStates[j]]);
    }
  }

  const equivalentStates = statePairs.filter(
    ([stateA, stateB]) => !isDistinguishable(stateA, stateB)
  );

  const minimalStates: Set<State>[] = [
    ...equivalentStates.map((pair) => new Set(pair)),
    ...accessibleStates
      .filter((state) => !equivalentStates.some((pair) => pair.includes(state)))
      .map((state) => new Set([state])),
  ];

  const minimalDefinition: AutomatonDefinition = {
    symbols: automaton.symbols,
    states: {},
    startState: getNewStateName(
      minimalStates.findIndex((stateSet) => stateSet.has(automaton.startState))
    ),
    finalStates: [],
  };

  automaton.finalStates.forEach((finalState) => {
    const finalStateIndex = minimalStates.findIndex((stateSet) =>
      stateSet.has(finalState)
    );
    if (finalStateIndex !== -1) {
      minimalDefinition.finalStates.push(getNewStateName(finalStateIndex));
    }
  });

  minimalStates.forEach((stateSet, index) => {
    const newStateName = getNewStateName(index);
    minimalDefinition.states[newStateName] = { on: {} };

    for (const symbol of automaton.symbols) {
      const [first] = stateSet;
      const nextState = transition(first, symbol);
      const nextStateIndex = minimalStates.findIndex((stateSet) =>
        stateSet.has(nextState)
      );
      minimalDefinition.states[newStateName].on[symbol] =
        getNewStateName(nextStateIndex);
    }
  });

  return create(minimalDefinition);
}

export function determinize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}
