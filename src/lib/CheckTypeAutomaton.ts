import { dfa1, dfa2, nfa1 } from './example-automata';
import { AutomatonDefinition,Automaton } from './automaton.interface';
import { EPSILON, NFA1ForConvert } from './Constant';

export const isNonDeterministic=(automaton: Automaton)=>{
    let checkFinteAutomatonIs = false
    const states = Object.values(automaton.states) // base state transaction to 
    states.forEach(element => {
      const on = Object.values(element)
      on.forEach(each =>{   
        if(Object.keys(each).length === 0){// Final state don't have any transaction "on:{}"
          return checkFinteAutomatonIs =true
        }else{
          const TransactionThroughSymbol = Object.keys(each)// ['a','b']
          const TransactionToState = Object.values(each)//['q2', 'q2', 'q2'],['q0', Array(2)]
          const nextState = Object.values(each)
          nextState.forEach(ns=>{
            if(ns.length === 0){
              
                return checkFinteAutomatonIs =true
            }
          })
          TransactionThroughSymbol.forEach(key=>{
            if(key === EPSILON){ // each state transaction through symbol or epsilon
              console.log("j")
              return checkFinteAutomatonIs =true
            }
          })
          TransactionToState.forEach(ToState =>{
          if(ToState.length >1 ){ // many symbol transaction to one state
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
    const test = isNonDeterministic(automaton)
    if(isNonDeterministic(automaton)){
      console.log("CheckFinteAutomaton:","NFA")
      return checkFinteAutomatonIs ="NFA"
    }else{
      console.log("CheckFinteAutomaton:","DFA")
      return checkFinteAutomatonIs= "DFA"
    }
  }