
import { nfa1,dfa1, dfa2 } from "./example-automata";
import { EPSILON, NFA1ForConvert } from './Constant';
import { CheckFinteAutomaton } from "./CheckTypeAutomaton";
import { ConvertNFAToDFA } from './ConvertNFAToDFA';
import {
  Automaton,
  AutomatonDefinition,
  State,
  Symbol,
} from "./automaton.interface";
import { coalesce } from "../utils/array.utils";
import { isEqual } from "../utils/set.utils";


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

export const checkFinteAutomaton = (automaton: Automaton)=>{
  return CheckFinteAutomaton(automaton)
}

export function testString(
  automata: Automaton,
  input: string | string[]
) : boolean {
  const FiniteType = checkFinteAutomaton(automata);

  if(FiniteType === "DFA"){
    return testStringDFA(automata, input);
  } else {
    const dfa = determinize(automata);
    return testStringDFA(dfa, input);
  }

}

export function testStringDFA(
  automaton: Automaton,
  input: string | string[]
) : boolean {

  const dfa = automaton;
  console.log(dfa)
  const inputString = input;
  const startState = dfa.startState;
  const finalStates = dfa.finalStates;
  const states = dfa.states;
  const symbols = dfa.symbols;
  const inputStringArray = inputString.split("");
  let currentState = startState;
  let currentSymbol = "";
  let currentIndex = 0;

  while (currentIndex < inputStringArray.length) {
    currentSymbol = inputStringArray[currentIndex];
    if (states[currentState].on[currentSymbol]) {
      currentState = states[currentState].on[currentSymbol];
      currentIndex++;
    } else {
      return false;
    }
  }

  if (finalStates.includes(currentState)) {
    console.log("Accepeted")
    return true;
  } else {
    console.log("Rejected")
    return false;
  }
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
