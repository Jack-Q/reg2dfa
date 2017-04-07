const obj2dot = o => `
digraph G {
    rankdir="LR";
    node [shape="circle"];
    ${o.edges.map(e => `
    ${e[0]} -> ${e[1]} [ label="${e[2] == -1 ? '&epsilon;' : e[2]}" ];`).join('')}
    ${o.terminals.map(t => `
    ${t} [shape="doublecircle"];`)}
}
`;

export { obj2dot };