import { Automaton, AutomatonDefinition } from "./automaton.interface";
import { omit } from 'lodash';

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

export function determinize(automaton: Automaton): Automaton {
  throw new Error("TODO");
}
