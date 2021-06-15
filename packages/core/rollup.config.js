/**
 * rollup 配置
 * */
import * as path from 'path';
import * as fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import eslint from '@rollup/plugin-eslint';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import comments from 'postcss-discard-comments';
import url from 'postcss-url';

const entryFile = 'src/index.ts';
const BABEL_ENV = process.env.BABEL_ENV || 'umd';
const extensions = ['.js', '.ts', '.tsx'];
const globals = {react: 'React', 'react-dom': 'ReactDOM'};
const externalPkg = ['react', 'react-dom'];
BABEL_ENV !== 'umd' && externalPkg.push('@babel/runtime', 'lodash');
const external = id => externalPkg.some(e => id.indexOf(e) === 0);
const componentDir = 'src/components';
const componentEntryFiles = [];
try {
  const cModuleNames = fs.readdirSync(path.resolve(componentDir));
  cModuleNames.forEach((name) => {
    if (!/^[A-Z]\w*/.test(name)) return;
    try {
      fs.readFileSync(`${componentDir}/${name}/index.tsx`);
      componentEntryFiles.push(`${componentDir}/${name}/index.tsx`);
    } catch (error) {
      try {
        fs.readFileSync(`${componentDir}/${name}/index.ts`);
        componentEntryFiles.push(`${componentDir}/${name}/index.ts`);
      } catch (e) {}
    }
  });
} catch (error) {}

// 通用配置
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
  // 全局变量替换
  replace({
    preventAssignment: true, // https://github.com/rollup/plugins/tree/master/packages/replace
    exclude: 'node_modules/**',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BABEL_ENV': JSON.stringify(BABEL_ENV || 'umd'),
  }),
  commonjs(),
];

const postcssConfig = {
  plugins: [
    autoprefixer({env: BABEL_ENV}),
    url({ url: 'inline' }),
    comments({removeAll: true})
  ],
  extract: true,
  extensions: ['.less', '.css'],
  use: {'less': {javascriptEnabled: true}}
};

const umdOutput = {
  format: 'umd',
  name: 'acme',
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
        output: {...umdOutput, file: 'dist/umd/acme-ui.development.js'},
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins]
      }, {
        input: entryFile,
        output: {...umdOutput, file: 'dist/umd/acme-ui.production.min.js', plugins: [terser()]},
        external,
        plugins: [postcss({...postcssConfig, minimize: true}), ...commonPlugins]
      }];
    case 'esm':
      return {
        input: [entryFile, ...componentEntryFiles],
        output: { ...esOutput, dir: 'dist/es', format: 'es'},
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins]
      };
    case 'cjs':
      return {
        input: [entryFile, ...componentEntryFiles],
        output: { ...esOutput, dir: 'dist/cjs', format: 'cjs'},
        external,
        plugins: [postcss(postcssConfig), ...commonPlugins]
      };
    default:
      return [];
  }
};
