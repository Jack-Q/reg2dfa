import babel from 'rollup-plugin-babel';

export default {
  entry : 'src/webworker.js',
  format : 'iife',
  dest : "web/worker.js",
  plugins : [babel({
      "presets": [
        [
          "env", {
            "modules": false,
            "loose": true
          }
        ]
      ]
    })]
};