import {dfa2min, exp2nfa, nfa2dfa, obj2dot} from './main';
import fs from 'fs';

const main = expr => {
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

// Expecting one command line parameter that feeds the 
// regular expression into the main procedure
main(...process.argv.slice(2));