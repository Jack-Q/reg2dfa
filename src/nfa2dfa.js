import { trans, EPS } from './state';

const newState = (index, nfaStates, isTerminal) => ({
  index, nfaStates, isTerminal
});

const procNfa = ({ states, edges, terminals, dict }) => {
  const adjecent = ch => edges.filter(e => e.label === ch).reduce((p, c) =>
    (p[c.src].push(c.dest), p), states.reduce((p, i) => ((p[i] = []), p), {}));
  
  const merge = (a, b) => a.concat(b).sort().filter((v, i, a) => !i || a[i - 1] === v);

  const eClouser = adjecent(EPS);
  const trans = dict.map(adjecent);
  
  console.log(eClouser);
  console.log(trans);

  const clouser = {};

  return { clouser, dict };
}

const nfa2dfa = (nfa) => {
  const { clouser, dict } = procNfa(nfa);
  const states = [];

  return {edges: [], terminals: [], dict: {}, };
};

export { nfa2dfa };