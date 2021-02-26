const path = require("path");

exports.onCreateWebpackConfig = (args) => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        "@acme-ui/core": path.resolve(__dirname, "../../../packages/core/src"), // 配置去获取源文件
        "@acme-ui/icons": path.resolve(__dirname, "../../../packages/icons/src"),
      },
    },
  });
};