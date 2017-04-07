const createTerm = head => ({h: head, t: head, p: []});

const mergeSub = (subterms, h, t, store) => subterms.map(subterm => {
  store.push([h, subterm.h, -1]);
  store.push.apply(store, subterm.p);
  store.push([subterm.t, t, -1]);
});

const constNfa = (state) => {
  let terms = [];
  let term = createTerm(state.stateCount++);
  let i, subterms;

  while (true) {
    let c = state.exp[state.pos++];
    switch (c) {
      case '*':
        throw new Error("unspecified asterisk at position " + state.pos);
        break;
      case '|':
        if(term.p.length)  
          terms.push(term);
        term = createTerm(state.stateCount++);
        break;
      case '(':
        subterms = constNfa(state);
        i = state.stateCount++;
        mergeSub(subterms, term.t, i, term.p);
        if (state.exp[state.pos] == '*') {
          state.pos++;
          term.p.push([i, term.t, -1]);
        }
        term.t = i;
        break;
      case ')':
      case undefined:
        terms.push(term);
        return terms;
      default: // character
        state.dict[c] = true;
        i = state.stateCount++;
        term.p.push([term.t, i, c]);
        if (state.exp[state.pos] == '*') {
          state.pos++;
          term.p.push([i, i, c]);
        }
        term.t = i;
    }
  }
}

const exp2nfa = (exp) => {
  const state = {
    exp,
    dict: {},
    pos: 0,
    stateCount: 1, // 0 is preserved for initiator
  }
  const edges = [];
  const nfa = constNfa(state);
  if (state.stateCount > 1) {
    mergeSub(nfa, 0, state.stateCount, edges);
  } else {
    console.warn("empty expression");
  }

  if (state.pos - exp.length != 1) 
    console.warn("# unmatched langth, may caused by one unclosed left parenthesis or extra right parenthesis");
  
  return { edges, terminals: [state.stateCount], dict: state.dict };
}

export {exp2nfa};