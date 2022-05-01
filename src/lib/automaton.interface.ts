export type Symbol = string;
export type State = string;

export interface AutomatonDefinition {
  symbols: Symbol[];
  states: Record<State, { on: Record<Symbol, State | State[]> }>;
  startState: State;
  finalStates: State[];
}

export type Automaton = Readonly<AutomatonDefinition>;
