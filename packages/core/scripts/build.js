'use strict';

process.env.NODE_ENV = 'production';

const argv = process.argv.slice(2);

const babelEnv = argv[0];
if (!babelEnv) {
  console.error('🚫 Must pass babel env!');
  process.exit(1);
}

if (!['cjs', 'esm', 'umd'].includes(babelEnv)) {
  console.error(`🚫 Babel env must be one of cjs, esm, umd, your babel env is ${babelEnv}!`);
  process.exit(1);
}

process.env.BABEL_ENV = babelEnv;

const dirMap = { cjs: 'dist/cjs', esm: 'dist/es', umd: 'dist/umd' };
const outputDir = dirMap[babelEnv];
let script = `rimraf ${outputDir} && rollup -c`;

switch (babelEnv) {
  case 'cjs':
  case 'esm':
    script += ` && yarn build:style && yarn build:typed --outDir ${outputDir}`;
    break;
  case 'umd':
  default:
    break;
}

const child_process = require('child_process');
try {
  child_process.execSync(script, { stdio: 'inherit', encoding: 'utf-8' });
} catch (error) {
  console.log(error);
}
