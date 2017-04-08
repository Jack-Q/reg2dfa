import { exp2nfa } from './exp2nfa';
import { nfa2dfa } from './nfa2dfa';
import { obj2dot } from './obj2dot';
import { dfa2min } from './dfa2min';
import fs from 'fs';

export default (expr) => {
  try {
    // NFA
    const nfa = exp2nfa(expr)
    fs.writeFileSync('nfa.dot', obj2dot(nfa));

    // DFA 
    const dfa = nfa2dfa(nfa);
    fs.writeFileSync('dfa.dot', obj2dot(dfa));

    // MIN
    const min = dfa2min(dfa);
    fs.writeFileSync('min.dot', obj2dot(min));
  } catch (e) {
    console.error(e.message);
    console.error(e)
  }
};

