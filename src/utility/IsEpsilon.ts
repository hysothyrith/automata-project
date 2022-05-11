import { AutomatonDefinition} from "../lib/automaton.interface";
import { EPSILON} from '../lib/Constant';
export function IsEpsilon  (automaton:AutomatonDefinition){
    let checkFinteAutomatonIs =false
    const states = Object.values(automaton.states)
    states.forEach(element => {
      const on = Object.values(element)
      on.forEach(each =>{
        const TransactionThroughSymbol = Object.keys(each)// ['a','b']
        TransactionThroughSymbol.forEach(key=>{
          if(key === EPSILON){ // each state transaction through symbol or epsilon
            return checkFinteAutomatonIs =true
          }
        })
      })
    });
    return checkFinteAutomatonIs
}