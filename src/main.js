import { exp2nfa } from './exp2nfa';
import { nfa2dfa } from './nfa2dfa';
import { obj2dot } from './obj2dot';

export default (expr) => {
  try {
    const nfa = exp2nfa(expr)
    console.log("NFA DOT GRAPH");
    console.log(obj2dot(nfa));

    console.log(nfa.dict);

    const dfa = nfa2dfa(nfa);
    // console.log("DFA DOT GRAPH");
    // console.log(obj2dot(dfa));
  } catch (e) {
    console.error(e.message);
  }
};

