import { Automaton, AutomatonDefinition } from "./automaton.interface";
import { nfa1,dfa1, dfa2 } from "./example-automata";
import { EPSILON, NFA1ForConvert } from './Constant';
import { CheckFinteAutomaton } from "./CheckTypeAutomaton";
import { ConvertNFAToDFA } from './ConvertNFAToDFA';


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