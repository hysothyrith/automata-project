export type Symbol = string;
export type State = string;

export interface AutomatonDefinition {
  symbols: Symbol[];
  states: Record<State, { on: Record<Symbol, State | State[]> }>;
  startState: State;
  finalStates: State[];
}

type Modify<T, R> = Omit<T, keyof R> & R;

export type Automaton = Readonly<
  Modify<
    AutomatonDefinition,
    { states: Readonly<AutomatonDefinition["states"]> }
  >
>;
