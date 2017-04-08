import bundleWorker from 'rollup-plugin-bundle-worker';
import babel from 'rollup-plugin-babel';

export default {
  entry : 'src/webworker.js',
  format : 'iife',
  dest : "web/worker.js",
  plugins : [babel({
      exclude: 'node_modules/**' // only transpile our source code
    })]
};