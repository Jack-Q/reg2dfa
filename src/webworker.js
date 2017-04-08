import { dfa2min, exp2nfa, nfa2dfa, obj2dot } from './main';
importScripts('./viz-lite.js');

const workerProcess = (exp) => {
  const nfa = exp2nfa(exp);
  const dfa = nfa2dfa(nfa);
  const min = dfa2min(dfa);
  const dot = [nfa, dfa, min].map(obj2dot);
  return dot;
}

const onmessage = function(e) {
  console.log('Received message');
  try {
    postMessage({
      status: true,
      dot: workerProcess(e.data).map(dot => Viz(dot))
    }); 
  } catch (e) {
    postMessage({
      status: false,
      message: e.message
    })
    console.error(e);
  }
}

self.addEventListener('message', onmessage)