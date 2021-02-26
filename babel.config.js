/**
 * babel 配置文件
 * 参考 babel 在 monorepo 项目中的应用 https://babeljs.io/docs/en/config-files#monorepos
 * */

module.exports = function(api) {
  api.cache(true);
  return { 
    presets: ["@babel/preset-env"], 
    babelrcRoots: [".", "packages/*"] 
  };
};
