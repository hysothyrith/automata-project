import { Automaton} from "./automaton.interface";
import { EPSILON } from './Constant';
import { IsEpsilon } from '../utility/IsEpsilon';

export const NFA1ForConvert= {
    symbols: ["0", "1"],
    states: {
      q0: { on: { 0: "q0", "1": "q1" } },
      q1: { on: { "0": ["q1", "q2"], 1: "q1" } },
      q2: { on: { 0: "q2", "1": ["q1", "q2"] } },
      q3: { on: { "0": "", 1: ["q1", "q3"] } },
    },
    startState: "q0",
    finalStates: ["q2","q3"],
  };

export const ConvertNFAToDFA =(automaton:Automaton):any=>{
    const automaton1 = automaton 
    const isEpsilon = IsEpsilon(NFA1ForConvert)
    if(isEpsilon){
        console.log("This method will process when Epsilon is exist")
    }else{
        ConvertWithoutEpsilon(automaton1)
    }    
    return "ConvertNFAToDFA"
}

const ConvertWithoutEpsilon = (automaton:Automaton):any=>{
    console.log("*********Convert without EPSILON ε  ***********")
    
    return "lkajsdf"
}


