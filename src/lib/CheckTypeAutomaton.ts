
import { dfa1, dfa2, nfa1 } from './example-automata';
import { AutomatonDefinition,Automaton } from './automaton.interface';
import { EPSILON, NFA1ForConvert } from './Constant';

export const isNonDeterministic=(automaton: Automaton)=>{
    let checkFinteAutomatonIs =false
    const states = Object.values(automaton.states) // base state transaction to 

    states.forEach(element => {
      const on = Object.values(element)
      on.forEach(each =>{
        if(Object.keys(each).length === 0){// Final state don't have any transaction
          return checkFinteAutomatonIs =true
        }else{
          const TransactionThroughSymbol = Object.keys(each)// ['a','b']
          const TransactionToState = Object.values(each)//['q2', 'q2', 'q2'],['q0', Array(2)]
          TransactionThroughSymbol.forEach(key=>{
            if(key === EPSILON || key === ""){ // each state transaction through symbol or epsilon
              return checkFinteAutomatonIs =true
            }
          })
          TransactionToState.forEach(ToState =>{
          if(Array.isArray(ToState)){ // many symbol transaction to one state
            return checkFinteAutomatonIs =true
          } 
          })
        }
      })
    });
    return checkFinteAutomatonIs
  }
  
  export const CheckFinteAutomaton = (automaton:Automaton):String=>{
    let checkFinteAutomatonIs =""
    if(isNonDeterministic(automaton)){
      return checkFinteAutomatonIs ="NFA"
    }else{
      return checkFinteAutomatonIs= "DFA"
    }
  }
  const checkFinteAutomaton = CheckFinteAutomaton(dfa2) 

console.log("CheckFinteAutomaton:",checkFinteAutomaton)