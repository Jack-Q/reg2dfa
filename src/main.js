import { exp2nfa } from './exp2nfa';
import { obj2dot } from './obj2dot';

export default (expr) => {
  try {
    console.log(obj2dot(exp2nfa(expr)));
  } catch (e) {
    console.error(e.message);
  }
};

