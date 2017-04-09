import { trans, EPS } from './state';

const createTerm = head => ({ h: head, t: head, p: [] });

const mergeSub = (subterms, h, t, store) => subterms.map(subterm => {
  store.push(trans(h, subterm.h, EPS));
  store.push.apply(store, subterm.p);
  store.push(trans(subterm.t, t, EPS));
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
        if (state.exp[state.pos] == '*') {
          state.pos++;
          term.p.push(trans(term.t, i, EPS));
          mergeSub(subterms, term.t, term.t, term.p);
        } else {
          mergeSub(subterms, term.t, i, term.p);
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
        if (state.exp[state.pos] == '*') {
          state.pos++;
          term.p.push(trans(term.t, i, EPS));
          term.p.push(trans(term.t, term.t, c));
        } else {
          term.p.push(trans(term.t, i, c));
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
  
  return { states: new Array(state.stateCount + 1).fill(0).map((_,i)=>i), edges, terminals: [state.stateCount], dict: Object.keys(state.dict) };
}

export {exp2nfa};