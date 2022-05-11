import { Automaton} from "./automaton.interface";
import { EPSILON, SMALL_PHI } from './Constant';
import { IsEpsilon } from '../utility/IsEpsilon';

export const NFA1ForConvert= {
    symbols: ["a", "b"],
    states: {
      q0: { on: { a: ["q0", "q1"], b: "q0" ,"ε":"q2"} },
      q1: { on: { b: "q2" ,"ε":"q3"}},
      q2: { on: { b: "q3","ε":"q1" } },
      q3: { on: {"":""} },
    },
    startState: "q0",
    finalStates: ["q3"],
  };

const NFAWithoutEpsilon = {
    symbols: ["0", "1"],
    states: {
      q0: { on: { 0: "q0", 1:"q1"} },
      q1: { on: { 0: ["q1","q2"] ,1:"q1"}},
      q2: { on: { 0: "q2",1:["q1","q2"] } },
    },
    startState: "q0",
    finalStates: ["q2"],
}

const NFAWithoutEpsilon1 = {
    symbols: ["0", "1"],
    states: {
      q0: { on: { 0: "q0", 1:"q1"} },
      q1: { on: { 0: ["q1","q2"] ,1:"q1"}},
      q2: { on: { 0: "q2",1:["q1","q2"] } },
    },
    startState: "q0",
    finalStates: ["q2"],
}

export const ConvertNFAToDFA =(automaton:Automaton):any=>{
    const automaton1 = NFAWithoutEpsilon
    
    if(IsEpsilon(automaton1)){
        console.log("with ε")
    }else{
        console.log("whithout ε")
    console.log("****Conversion NFA to DFA*****")
    const State = Object.values( automaton1.states)
    console.log("State:",State)
    const State_Transaction = Object.keys(automaton1.states)
    const State_Transaction1 = Object.values(automaton1.states)
    const State_Transaction_On_Symbol = State_Transaction
    const StartState=automaton1.startState
    console.log("State_Transaction_On_Symbol:",State_Transaction_On_Symbol)
    console.log("State_Transaction",State_Transaction)
    console.log("State_Transaction",State_Transaction1)
    const Lenght_State_Transaction = State_Transaction.length
    console.log("Lenght_State_Transaction",Lenght_State_Transaction)
    let new_state_prime_array =[]
    State.forEach((x,i)=>{
        // console.log("**x***:",x.on)
        const On_Symbol = Object.keys(x.on)
        const To_Next_State = Object.values(x.on)
        On_Symbol.forEach((symbol,index)=> {
            console.log("****element*****\n",`q${i}`,"=>",symbol?symbol:SMALL_PHI,"=>",To_Next_State.at(index))
            const new_state_prime = {"new_prime_state":To_Next_State.at(index)}
            let new_state_prime_array_tmp = new_state_prime
            new_state_prime_array.push(new_state_prime)
            if(new_state_prime_array.length !== 0){
                 
            }
        });
    })
    console.log("new_state_prime_array",new_state_prime_array)
    }
    return "ConvertNFAToDFA"
}



