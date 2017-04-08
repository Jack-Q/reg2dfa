import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry : 'src/webworker.js',
  format : 'iife',
  dest : "web/worker.js",
  plugins : [resolve(), babel({
      exclude: 'node_modules/**' // only transpile our source code
    })]
};