import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'main.js',
  entry: 'main.js',
  dest: 'build.js',
  format: 'umd',
  plugins: [
    babel(),
    nodeResolve({
      // use "jsnext:main" if possible
      // see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true
    }),
    serve(),
    livereload()
  ],
  sourceMap: true,
  output: { file: 'bundle.js' }
};