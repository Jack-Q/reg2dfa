import { EPS } from './state';

const e = '&epsilon;';

const obj2dot = ({ edges, terminals, nodes }) => `
digraph G {
    rankdir="LR";
    node [shape="circle"];
    ${edges.map(({src, dest, label}) => `
    ${src} -> ${dest} [ label="${label == EPS ? e : label}" ];`).join('')}
    ${nodes ? nodes.map(({ id, label, terminal}) => `
    ${id} [ label="${label}" shape="${terminal?'doublecircle':'circle'}" ];`).join('') : terminals.map(t => `
    ${t} [shape="doublecircle"];`).join('')}
}
`;

export { obj2dot };