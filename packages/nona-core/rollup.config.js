import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  output: [
    {
      file: 'cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'es/index.js',
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
