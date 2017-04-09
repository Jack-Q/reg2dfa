(function () {
'use strict';

Set.prototype.addSet = function (s) {
  for (var _iterator = s, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var ele = _ref;
    this.add(ele);
  }return this;
};

Set.prototype.eq = function (s) {
  if (!s || this.size !== s.size) return false;
  for (var _iterator2 = this, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var ele = _ref2;

    if (!s.has(ele)) return false;
  }return true;
};

Set.prototype.diff = function (s) {
  for (var _iterator3 = s, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var ele = _ref3;

    if (this.has(ele)) this.delete(ele);
  }
  return this;
};

Set.prototype.subset = function (pred) {
  var s = new Set();
  for (var _iterator4 = this, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    var ele = _ref4;

    if (pred(ele)) s.add(ele);
  }return s;
};

Set.prototype.subsetOf = function (s) {
  for (var _iterator5 = this, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
    var _ref5;

    if (_isArray5) {
      if (_i5 >= _iterator5.length) break;
      _ref5 = _iterator5[_i5++];
    } else {
      _i5 = _iterator5.next();
      if (_i5.done) break;
      _ref5 = _i5.value;
    }

    var ele = _ref5;

    if (!s.has(ele)) return false;
  }return true;
};

var EPS = -1;

var trans = function trans(src, dest, label) {
  return { src: src, dest: dest, label: label };
};

var createTerm = function createTerm(head) {
  return { h: head, t: head, p: [] };
};

var mergeSub = function mergeSub(subterms, h, t, store) {
  return subterms.map(function (subterm) {
    store.push(trans(h, subterm.h, EPS));
    store.push.apply(store, subterm.p);
    store.push(trans(subterm.t, t, EPS));
  });
};

var constNfa = function constNfa(state) {
  var terms = [];
  var term = createTerm(state.stateCount++);
  var i = void 0,
      subterms = void 0;

  while (true) {
    var c = state.exp[state.pos++];
    switch (c) {
      case '*':
        throw new Error("unspecified asterisk at position " + state.pos);
        break;
      case '|':
        if (term.p.length) terms.push(term);
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
      default:
        // character
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
};

var exp2nfa = function exp2nfa(exp) {
  var state = {
    exp: exp,
    dict: {},
    pos: 0,
    stateCount: 1 };
  var edges = [];
  var nfa = constNfa(state);
  if (state.stateCount > 1) {
    mergeSub(nfa, 0, state.stateCount, edges);
  } else {
    console.warn("empty expression");
  }

  if (state.pos - exp.length != 1) console.warn("# unmatched langth, may caused by one unclosed left parenthesis or extra right parenthesis");

  return { states: new Array(state.stateCount + 1).fill(0).map(function (_, i) {
      return i;
    }), edges: edges, terminals: [state.stateCount], dict: Object.keys(state.dict) };
};

var procNfa = function procNfa(_ref) {
  var states = _ref.states,
      edges = _ref.edges,
      terminals = _ref.terminals,
      dict = _ref.dict;

  var adjecent = function adjecent(ch) {
    return edges.filter(function (e) {
      return e.label === ch;
    }).reduce(function (p, c) {
      return p[c.src].add(c.dest), p;
    }, states.reduce(function (p, i) {
      return p[i] = new Set(), p;
    }, {}));
  };

  var eClosure = adjecent(EPS);

  var _loop = function _loop(i, _change) {
    _change = false;
    states.map(function (st) {
      var s = eClosure[st];
      var size = s.size;
      s.add(st);
      s.forEach(function (e) {
        return s.addSet(eClosure[e]);
      });
      _change = _change || s.size > size;
    });
    change = _change;
  };

  for (var i = 0, change = true; i < states.length && change; i++) {
    _loop(i, change);
  }

  var trans$$1 = dict.map(adjecent).map(function (trans$$1) {
    states.map(function (st) {
      var s = new Set();
      eClosure[st].forEach(function (ele) {
        return s.addSet(trans$$1[ele]);
      });
      s.forEach(function (ele) {
        return s.addSet(eClosure[ele]);
      });
      trans$$1[st] = s;
    });
    return trans$$1;
  });

  var closure = dict.reduce(function (cl, ch, i) {
    return cl[ch] = trans$$1[i], cl;
  }, {});
  closure[EPS] = eClosure;

  return { closure: closure, dict: dict, terminals: terminals };
};

var nfa2dfa = function nfa2dfa(nfa) {
  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _procNfa = procNfa(nfa),
      closure = _procNfa.closure,
      dict = _procNfa.dict,
      terminals = _procNfa.terminals;

  var states = [closure[EPS][0]],
      newState = [closure[EPS][0]];
  var edges = [];

  var _loop2 = function _loop2() {
    var curState = newState.shift();
    var src = states.indexOf(curState);
    dict.map(function (ch) {
      var nxtState = new Set();
      curState.forEach(function (s) {
        return nxtState.addSet(closure[ch][s]);
      });
      if (!nxtState.size) return; // no feasible path
      var dest = states.findIndex(function (s) {
        return s.eq(nxtState);
      });
      if (dest < 0) newState.push(nxtState), dest = states.push(nxtState) - 1;
      edges.push(trans(src, dest, ch));
    });
  };

  while (newState.length) {
    _loop2();
  }

  // DOT label for node
  var nodeFmt = function nodeFmt(s, i) {
    return {
      id: i,
      label: i + '\n(' + Array.from(s).join() + ')',
      terminal: terminals.some(function (t) {
        return s.has(t);
      })
    };
  };

  return {
    edges: edges,
    nodes: detail ? states.map(nodeFmt) : null,
    terminals: states.map(function (s, i) {
      return { s: s, i: i };
    }).filter(function (_ref2) {
      var s = _ref2.s;
      return terminals.some(function (t) {
        return s.has(t);
      });
    }).map(function (_ref3) {
      var i = _ref3.i;
      return i;
    }),
    dict: dict
  };
};

var e = '&epsilon;';

var obj2dot = function obj2dot(_ref) {
    var edges = _ref.edges,
        terminals = _ref.terminals,
        nodes = _ref.nodes;
    return '\ndigraph G {\n    rankdir="LR";\n    node [shape="circle"];\n    ' + edges.map(function (_ref2) {
        var src = _ref2.src,
            dest = _ref2.dest,
            label = _ref2.label;
        return '\n    ' + src + ' -> ' + dest + ' [ label="' + (label == EPS ? e : label) + '" ];';
    }).join('') + '\n    ' + (nodes ? nodes.map(function (_ref3) {
        var id = _ref3.id,
            label = _ref3.label,
            terminal = _ref3.terminal;
        return '\n    ' + id + ' [ label="' + label + '" shape="' + (terminal ? 'doublecircle' : 'circle') + '" ];';
    }).join('') : terminals.map(function (t) {
        return '\n    ' + t + ' [shape="doublecircle"];';
    }).join('')) + '\n}\n';
};

var enumerateNodes = function enumerateNodes(edges) {
  var s = new Set();
  edges.map(function (_ref) {
    var src = _ref.src,
        dest = _ref.dest;
    return s.add(src), s.add(dest);
  });
  return Array.from(s);
};

var procDfa = function procDfa(_ref2) {
  var dict = _ref2.dict,
      nodes = _ref2.nodes,
      edges = _ref2.edges,
      terminals = _ref2.terminals;

  var states = nodes ? nodes.map(function (_ref3) {
    var id = _ref3.id;
    return id;
  }) : enumerateNodes(edges);
  var closure = states.reduce(function (p, id) {
    return p[id] = dict.reduce(function (p, ch) {
      p[ch] = new Set(edges.filter(function (e) {
        return e.src === id && e.label === ch;
      }).map(function (_ref4) {
        var dest = _ref4.dest;
        return dest;
      }));
      return p;
    }, {}), p;
  }, {});
  return { dict: dict, closure: closure, states: states, terminals: terminals };
};

var dfa2min = function dfa2min(dfa) {
  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _procDfa = procDfa(dfa),
      dict = _procDfa.dict,
      closure = _procDfa.closure,
      states = _procDfa.states,
      terminals = _procDfa.terminals;

  var stateSet = new Set(states);

  // Init state sets and split to two sets
  var stateSets = [stateSet.subset(function (s) {
    return terminals.indexOf(s) >= 0;
  })];

  // if all nodes are terminal, ignore the other set
  stateSets[0].size < stateSet.size && stateSets.unshift(stateSet.diff(stateSets[0]));

  var _loop = function _loop(i, _change) {
    _change = false;
    dict.map(function (ch) {
      return _change || stateSets.map(function (stateSet) {
        if (_change) return;
        var s = new Set();
        var hasEmpty = false;
        for (var _iterator = stateSet, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref7;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref7 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref7 = _i.value;
          }

          var ele = _ref7;

          closure[ele][ch].size == 0 ? hasEmpty = true : s.addSet(closure[ele][ch]);
        }if (!s.size) return;else if (!hasEmpty) {
          for (var _iterator2 = stateSets, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref8;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref8 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref8 = _i2.value;
            }

            var curSet = _ref8;

            // no need to split
            if (s.subsetOf(curSet)) {
              return;
            }
          }
        }

        var splitSet = function () {
          for (var _iterator3 = stateSet, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref9;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref9 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref9 = _i3.value;
            }

            var splitState = _ref9;

            var clo = closure[splitState][ch];
            if (!clo.size) continue;

            var _ele = Array.from(clo)[0];

            for (var _iterator4 = stateSets, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              var _ref10;

              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref10 = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref10 = _i4.value;
              }

              var splitStateSet = _ref10;

              if (splitStateSet.has(_ele)) return splitStateSet;
            }
          }
        }();
        // Cannot split
        if (splitSet === undefined) {
          console.log("cannot split, then quit");
          return;
        }

        var newSubset = stateSet.subset(function (state) {
          return closure[state][ch].size && closure[state][ch].subsetOf(splitSet);
        });
        stateSet.diff(newSubset);
        stateSets.push(newSubset);
        _change = true;
      });
    });
    change = _change;
  };

  for (var i = 0, change = true; i <= states.length && change; i++) {
    _loop(i, change);
  }

  var newStates = stateSets.filter(function (s) {
    return s.size;
  }).map(function (s) {
    return Array.from(s);
  }).sort(function (a, b) {
    if (a.indexOf(0) >= 0) {
      return b.indexOf(0) >= 0 ? a.length - b.length : -1;
    }
    if (b.indexOf(0) >= 0) {
      return 1;
    }
    return a.reduce(function (s, i) {
      return s + i;
    }, 0) / a.length - b.reduce(function (s, i) {
      return s + i;
    }, 0) / b.length;
  });

  var stateMap = newStates.reduce(function (map, newState, i) {
    newState.map(function (p) {
      return map[p] = i;
    });
    return map;
  }, {});

  var edgeComp = function edgeComp(a, b) {
    return a.src - b.src || a.dest - b.dest || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
  };

  var edges = dfa.edges.map(function (e) {
    return trans(stateMap[e.src], stateMap[e.dest], e.label);
  }).sort(edgeComp).reduce(function (a, e, i, arr) {
    if (!i || edgeComp(e, arr[i - 1])) a.push(e);
    return a;
  }, []);

  var nodeFmt = function nodeFmt(s, i) {
    return {
      id: i,
      label: i + "\n(" + s.join() + ")",
      terminal: terminals.some(function (t) {
        return s.indexOf(t) >= 0;
      })
    };
  };

  return {
    edges: edges,
    nodes: detail ? newStates.map(nodeFmt) : null,
    terminals: newStates.map(function (s, i) {
      return { s: s, i: i };
    }).filter(function (_ref5) {
      var s = _ref5.s;
      return terminals.some(function (t) {
        return s.indexOf(t) >= 0;
      });
    }).map(function (_ref6) {
      var i = _ref6.i;
      return i;
    }),
    dict: dict
  };
};

importScripts('./viz-lite.js');

var workerProcess = function workerProcess(exp) {
  var nfa = exp2nfa(exp);
  var dfa = nfa2dfa(nfa);
  var min = dfa2min(dfa);
  var dot = [nfa, dfa, min].map(obj2dot);
  return dot;
};

var onmessage = function onmessage(e) {
  console.log('Received message');
  try {
    postMessage({
      status: true,
      dot: workerProcess(e.data).map(function (dot) {
        return Viz(dot);
      })
    });
  } catch (e) {
    postMessage({
      status: false,
      message: e.message
    });
    console.error(e);
  }
};

self.addEventListener('message', onmessage);

}());
