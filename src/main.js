import { exp2nfa } from './exp2nfa';
import { nfa2dfa } from './nfa2dfa';
import { obj2dot } from './obj2dot';
import fs from 'fs';

export default (expr) => {
  try {
    const nfa = exp2nfa(expr)
    fs.writeFileSync('nfa.dot', obj2dot(nfa));

    console.log(nfa.dict);

    const dfa = nfa2dfa(nfa);
    fs.writeFileSync('dfa.dot', obj2dot(dfa));
  } catch (e) {
    console.error(e.message);
  }
};

