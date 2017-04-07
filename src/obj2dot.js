import { EPS } from './state';

const e = '&epsilon;';

const obj2dot = ({ edges, terminals }) => `
digraph G {
    rankdir="LR";
    node [shape="circle"];
    ${edges.map(({src, dest, label}) => `
    ${src} -> ${dest} [ label="${label == EPS ? e : label}" ];`).join('')}
    ${terminals.map(t => `
    ${t} [shape="doublecircle"];`)}
}
`;

export { obj2dot };