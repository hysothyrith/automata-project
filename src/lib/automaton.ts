import { Automaton, AutomatonDefinition, State } from "./automaton.interface";

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
  let symbols = automaton.symbols;
  let startState = automaton.startState;
  let finalStates = automaton.finalStates;
  let states = Object.keys(automaton.states);
  let transition = automaton.states;
  let p0 = findP0(finalStates, states);
  console.log(calculatePK(p0, symbols, transition));
}

export function findP0(finalStates, states) {
  let nonFinalStates = []
  states.forEach(element => {
    if (!finalStates.includes(element)) {
      nonFinalStates.push(element);
    }
  });
  return [finalStates, nonFinalStates];
}

export function calculatePK(pK, symbols, transition) {
  let pKAdd1 = findPk(pK, symbols, transition);
}

export function findPk(pk, symbols, transition) {
  let newPk = [];
  pk.forEach(element => {
    let result = findDistinguishOfSet(element, pk, symbols, transition);
    if (result != element) {
    }
  });
}

export function pairTransition(state1, state2, symbol, transition) {
  let outputTransition1 = transition[state1]['on'][symbol];
  let outputTransition2 = transition[state2]['on'][symbol];
  return [outputTransition1, outputTransition2];
}

export function findDistinguishOfSet(setOfStates, pk, symbols, transition) {
  let setOfDistinguish = [];
  for (let i = 0; i < setOfStates.length; i++) {
    for (let j = i + 1; j < setOfStates.length; j++) {
      for (let symbol of symbols) {
        let result = pairTransition(setOfStates[i], setOfStates[j], symbol, transition)
        let isInTheSameSet = false;
        for (let checkState of pk) {
          if (checkState.includes(result[0]) && checkState.includes(result[1])) {
            isInTheSameSet = true;
          }
        }
        if (!isInTheSameSet) {
          setOfDistinguish.push(setOfStates[i]);
          setOfDistinguish.push(setOfStates[j]);
        }
      }
    }
  }
  if (setOfDistinguish.length > 0) {
    if (setOfDistinguish.length == 2) {
      return [[setOfDistinguish[0]], [setOfDistinguish[1]]];
    } else {
      let distinguishState = [];
      setOfDistinguish.forEach((element, index) => {
        if (index != setOfDistinguish.indexOf(element)) {
          distinguishState.push(element);
        }
      });
      let newSetToReturn = [];
      setOfStates.forEach(element => {
        if (!distinguishState.includes(element)) {
          newSetToReturn.push(element);
        }
      });
      return [newSetToReturn, distinguishState];
    }
  } else {
    return setOfStates;
  }
}

export function determinize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}
