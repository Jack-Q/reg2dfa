REG 2 DFA
=========

Convert regular expression to NFA, DFA and minimal DFA,
and check the result visually. 

Example
-------
* regular expression:
  
  `(1|0*11)*0*1*`

* NFA (Nondeterministic Finite Automata):

  ![nfa](doc/nfa.svg)

* DFA (Deterministic Finite Automata):

  ![dfa](doc/dfa.svg)

* MIN (Minimal Deterministic Finite Automata):

  ![min](doc/min.svg)


Web Page
--------

The in-browser version is accessible at GitHub Pages, which can 
render the DOT result to SVG.

Check it out at [https://jack-q.github.io/reg2dfa/](https://jack-q.github.io/reg2dfa/).

CLI
---

A CLI version is available to use in node.js environment.
The provided CLI interface can write the DOT file to working directory.
The result can be converted to other format with `dot` command.

```bash
# install dependencies
npm install

# start and convert the result
# this will create {nfa,dfa,min}.dot at working directory
npm start '101|1(01)*1|01'
dot nfa.dot -Tpng > nfa.png
dot dfa.dot -Tpng > dfa.png
dot min.dot -Tpng > min.png

# convert to a older syntax
npm convert

```

The `dot` command is part of the GraphViz package, which can be 
configured on Ubuntu by installing `graphviz` package. For more information about GraphViz, check out [http://www.graphviz.org/]().