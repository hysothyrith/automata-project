
import { dfa1, dfa2, nfa1 } from './example-automata';
import { AutomatonDefinition,Automaton } from './automaton.interface';
import { EPSILON, NFA1ForConvert } from './Constant';

export const isNonDeterministic=(automaton: Automaton)=>{
    let checkFinteAutomatonIs = false
    const states = Object.values(automaton.states) // base state transaction to 
    states.forEach(element => {
      // console.log("element:",element)
      // export const dfa2: AutomatonDefinition = { // this is nfa 
      //   symbols: ["0", "1"],
      //   states: {
      //     A: { on: { "0": "C", "1": "B" } },
      //     B: { on: { "0": "","1":"C" } },
      //     C: { on: { "0": "C","1": "C" } },
      //   },
      //   startState: "A",
      //   finalStates: ["B","C"],
      // };
      const on = Object.values(element)
      on.forEach(each =>{
        // console.log("each:",each)
        // console.log("Object.keys(each).length:",Object.keys(each).length)
        // console.log(" Object.values(each):", Object.values(each))        
        if(Object.keys(each).length === 0){// Final state don't have any transaction "on:{}"
          return checkFinteAutomatonIs =true
        }else{
          const TransactionThroughSymbol = Object.keys(each)// ['a','b']
          const TransactionToState = Object.values(each)//['q2', 'q2', 'q2'],['q0', Array(2)]
          const nextState = Object.values(each)
          nextState.forEach(ns=>{
            console.log("ns.length",ns.length === 0)
            if(ns.length === 0){
              console.log("haha:",ns)///not 
                return checkFinteAutomatonIs =true
            }
          })
          TransactionThroughSymbol.forEach(key=>{
            if(key === EPSILON){ // each state transaction through symbol or epsilon
              console.log("haha:")//not
              return checkFinteAutomatonIs =true
            }
          })
          TransactionToState.forEach(ToState =>{
          if(Array.isArray(ToState)){ // many symbol transaction to one state
            console.log("haha:")//not
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
    // console.log("test:",test)
    if(isNonDeterministic(automaton)){
      console.log("CheckFinteAutomaton:","NFA")
      return checkFinteAutomatonIs ="NFA"
    }else{
      console.log("CheckFinteAutomaton:","DFA")
      return checkFinteAutomatonIs= "DFA"
    }
  }