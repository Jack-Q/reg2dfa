import {trans, EPS} from './state';

const enumerateNodes = edges => {
  const s = new Set();
  edges.map(({src, dest}) => (s.add(src), s.add(dest)));
  return Array.from(s);
}

const procDfa = ({ dict, nodes, edges, terminals }) => {
  const states = nodes ? nodes.map(({ id }) => id) : enumerateNodes(edges);
  const closure = states.reduce((p, id) => ((p[id] = dict.reduce((p, ch) => {
      p[ch] = new Set(edges.filter(e => e.src === id && e.label === ch).map(({dest}) => dest));
      return p;
    }, {})), p), {});
  return {dict, closure, states, terminals};
};



const dfa2min = (dfa, detail = false) => {
  const { dict, closure, states, terminals } = procDfa(dfa);
  const stateSet = new Set(states);
  
  // Init state sets and split to two sets
  const stateSets = [stateSet.subset(s => terminals.indexOf(s) >= 0)];
  stateSets.unshift(stateSet.diff(stateSets[0]));

  for (let i = 0, change = true; i <= states.length && change; i++){
    change = false;
    dict.map(ch => change || stateSets.map(stateSet => {
      if (change) return;
      const s = new Set();
      let hasEmpty = false;
      for (let ele of stateSet)
        closure[ele][ch].size == 0 ? hasEmpty = true : s.addSet(closure[ele][ch]);

      if (!s.size)
        return;
      else if (!hasEmpty) {
        for (let curSet of stateSets) {
          // no need to split
          if (s.subsetOf(curSet)) {
            return;
          }
        }
      }

      const splitSet = (() => {
        for (let splitState of stateSet) {
          let clo = closure[splitState][ch];
          if (!clo.size) continue;

          let ele = Array.from(clo)[0];

          for (let splitStateSet of stateSets)
            if (splitStateSet.has(ele))
              return splitStateSet;
        }
      })();
      // Cannot split
      if (splitSet === undefined) {
        console.log("cannot split, then quit")
        return;  
      }
        
      const newSubset = stateSet.subset(state => closure[state][ch].size &&closure[state][ch].subsetOf(splitSet));
      stateSet.diff(newSubset);
      stateSets.push(newSubset);
      change = true;
    }));
  }

  const newStates = stateSets.map(s => Array.from(s)).sort((a, b) =>
    a.reduce((s, i) => s + i, 0) / a.length - b.reduce((s, i) => s + i, 0) / b.length);
  
  const stateMap = newStates.reduce((map, newState, i) => { 
    newState.map(p => map[p] = i);
    return map;
  }, {})
  
  const edgeComp = (a, b) => a.src - b.src || a.dest - b.dest || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0);

  const edges = dfa.edges.map(e => trans(stateMap[e.src], stateMap[e.dest], e.label))
    .sort(edgeComp)
    .reduce((a, e, i, arr) => {
      if(!i || edgeComp(e, arr[i -1])) a.push(e);
      return a;
    },[]);

  const nodeFmt = (s, i) => ({
    id: i,
    label: `${i}\n(${s.join()})`,
    terminal: terminals.some(t => s.indexOf(t) >= 0)
  });

  return {
    edges,
    nodes: detail ? newStates.map(nodeFmt) : null,
    terminals: newStates.map((s, i) => ({s, i})).filter(({s}) => terminals.some(t => s.indexOf(t) >= 0)).map(({i}) => i),
    dict
  }
}

export {dfa2min};