import {trans, EPS} from './state';

Set.prototype.addSet = function (s) {
  for (let ele of s) this.add(ele);
  return this;
}

Set.prototype.eq = function (s) {
  if (!s || this.size !== s.size) 
    return false;
  for (let ele of this) 
    if (!s.has(ele)) 
      return false;
  return true;
}

const newState = (index, nfaStates, isTerminal) => ({index, nfaStates, isTerminal});

// DOT label for node
const nodeFmt = (s, i) => ({
  id: i,
  label: `${i}\n(${Array.from(s).join()})`,
  terminal: terminals.some(t => s.has(t))
});

const procNfa = ({states, edges, terminals, dict}) => {
  const adjecent = ch => edges.filter(e => e.label === ch)
    .reduce((p, c) => (p[c.src].add(c.dest), p), states.reduce((p, i) => ((p[i] = new Set()), p), {}));

  const eClosure = adjecent(EPS);
  for (let i = 0, change = true; i < states.length && change; i++) {
    change = false;
    states.map(st => {
      const s = eClosure[st];
      const size = s.size;
      s.add(st);
      s.forEach(e => s.addSet(eClosure[e]));
      change = change || s.size > size;
    });
  }

  const trans = dict.map(adjecent).map(trans => {
      states.map(st => {
        const s = new Set();
        eClosure[st].forEach(ele => s.addSet(trans[ele]));
        s.forEach(ele => s.addSet(eClosure[ele]));
        trans[st] = s;
      })
      return trans;
    });

  const closure = dict.reduce((cl, ch, i) => (cl[ch] = trans[i], cl), {});
  closure[EPS] = eClosure;

  return {closure, dict, terminals};
}

const nfa2dfa = (nfa, detail = false) => {
  const { closure, dict, terminals } = procNfa(nfa);
  const states = [closure[EPS][0]],
    newState = [closure[EPS][0]];
  const edges = [];

  while (newState.length) {
    const curState = newState.shift();
    // if (states.some(s => s.eq(curState))) continue;
    const src = states.indexOf(curState);
    dict.map(ch => {
      let nxtState = new Set();
      curState.forEach(s => nxtState.addSet(closure[ch][s]));
      if (!nxtState.size)
        return; // no feasible path
      let dest = states.findIndex(s => s.eq(nxtState));
      if (dest < 0)
        newState.push(nxtState),
          dest = states.push(nxtState) - 1;
      edges.push(trans(src, dest, ch));
    });
  }

  return {
    edges,
    nodes: detail ? states.map(nodeFmt) : null,
    terminals: states.map((s, i) => ({s, i})).filter(({s}) => terminals.some(t => s.has(t))).map(({i}) => i),
    dict,
  };
};

export {nfa2dfa};