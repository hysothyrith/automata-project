import { nfa1,dfa1, dfa2 } from "./example-automata";
import { EPSILON, NFA1ForConvert } from './Constant';
import { CheckFinteAutomaton } from "./CheckTypeAutomaton";
import { ConvertNFAToDFA } from './ConvertNFAToDFA';
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

export const checkFinteAutomaton = (automaton: Automaton)=>{
  return CheckFinteAutomaton(automaton)
}
checkFinteAutomaton(dfa1)
export function minimize(automaton: Automaton): Automaton {
  let startState = automaton.startState;
  let minimizeAutomaton = automaton;

  //Step 1
  //remove non accesible
  let wantedState = Array(startState);
  let states = Array();
  Object.keys(automaton.states).forEach(state => {
    if (startState == state || !wantedState.includes(state)) {
      Object.keys(automaton.states[state]['on']).forEach(symbol => {
        if (!wantedState.includes(automaton.states[state]['on'][symbol])) {
          wantedState.push(automaton.states[state]['on'][symbol])
        }
      });
    }
    states.push(state);
  });
  Object.keys(minimizeAutomaton.states).forEach(key => {
    if (!wantedState.includes(key)) delete minimizeAutomaton.states[key]
  });

  //Step 2

}


export const Conversion = (automaton: Automaton):Automaton=>{
  return ConvertNFAToDFA(automaton) 
}

Conversion(NFA1ForConvert)

export function determinize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}