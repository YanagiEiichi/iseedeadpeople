import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true, compact: true },
      { file: pkg.module, format: 'esm', sourcemap: true, compact: true },
      { file: pkg.umd, format: 'umd', sourcemap: true, compact: true, name: pkg.name },
    ],
    plugins: [
      typescript({ declarationDir: path.dirname(pkg.types), declaration: true, exclude: 'src/iife.ts' }),
      terser(),
    ],
  },
  {
    input: 'src/iife.ts',
    output: { file: pkg.iife, format: 'iife', sourcemap: true, compact: true },
    plugins: [typescript(), terser()],
  },
];
