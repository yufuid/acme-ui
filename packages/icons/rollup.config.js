/**
 * rollup 配置
 * */ 
import * as path from 'path';
import * as fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import eslint from '@rollup/plugin-eslint';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';

const entryFile = 'src/index.ts';
const BABEL_ENV = process.env.BABEL_ENV || 'umd';
const extensions = ['.js', '.ts', '.tsx'];
const globals = {react: 'React', 'react-dom': 'ReactDOM'};
const externalPkg = ['react', 'react-dom', 'lodash'];
BABEL_ENV !== 'umd' && externalPkg.push('@babel/runtime');
const external = id => externalPkg.some(e => id.indexOf(e) === 0);
const iconsDir = 'src/icons';
let componentEntryFiles = [];
try {
  const cModuleNames = fs.readdirSync(path.resolve(iconsDir));  
  componentEntryFiles = cModuleNames.map((name) => /^[A-Z]\w*/.test(name) ? `${iconsDir}/${name}` : undefined).filter(n => !!n);
} catch (error) {}

const commonPlugins = [
  image(),
  eslint({fix: true, exclude: ['*.less', '*.png', '*.svg']}),
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**', // 只编译源代码
    babelHelpers: 'runtime',
    extensions,
    skipPreflightCheck: true
  }),
  commonjs(),
];

const postcssConfig = {
  plugins: [autoprefixer({env: BABEL_ENV})],
  extract: true,
  extensions: ['.less', '.css'],
  use: {'less': {javascriptEnabled: true}}
};

const umdOutput = { 
  format: 'umd',
  name: 'acmeIcon',
  globals,
  assetFileNames: '[name].[ext]'
};
const esOutput = {
  globals,
  preserveModules: true,
  preserveModulesRoot: 'src',
  exports: 'named',
  assetFileNames: '[name].[ext]',
}

export default () => {
  switch (BABEL_ENV) {
    case 'umd':
      return [{
        input: entryFile,
        output: {...umdOutput, file: 'dist/umd/acme-icons.development.js'},
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins]
      }, {
        input: entryFile,
        output: {...umdOutput, file: 'dist/umd/acme-icons.production.min.js', plugins: [terser()]},
        external,
        plugins: [postcss({...postcssConfig, minimize: true}), ...commonPlugins]
      }];
    case 'esm':
      return {
        input: [entryFile, ...componentEntryFiles],
        output: { ...esOutput, dir: 'dist/es', format: 'es' },
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins],
      };
    case 'cjs':
      return {
        input: [entryFile, ...componentEntryFiles],
        output: { ...esOutput, dir: 'dist/cjs', format: 'cjs' },
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins],
      };
    default:
      return [];      
  }
};