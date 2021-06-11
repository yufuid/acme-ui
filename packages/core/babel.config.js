// babel 配置文件
module.exports = function (api) {
  // umd esm cjs
  const useEsModules = api.env(['umd', 'esm']);
  const presets = [
    [
      '@babel/preset-env',
      {
        // es 模块要关闭模块转换, cjs 模块同样要关闭转化
        // jest 需要模块是 commonjs https://jestjs.io/docs/en/ecmascript-modules
        modules: process.env.BABEL_ENV === 'test' ? 'commonjs' : false,
        browserslistEnv: process.env.BABEL_ENV || 'umd',
        loose: true,
        bugfixes: true,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ];
  const plugins = [
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-classes', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: useEsModules,
      },
    ],
  ];

  return { presets, plugins, ignore: [/@babel[\\|/]runtime/, /node_modules\/(?!lodash)/] };
};
