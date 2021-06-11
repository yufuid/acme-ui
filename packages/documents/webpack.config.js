const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const slug = require('remark-slug');
const rehypePlugin = require('./scripts/rehype');
const docConfig = require('./docrc');

module.exports = function (env) {
  const isDev = !env.prod;
  const isReport = !isDev && env.report;
  const lessOptions = {sourceMap: isDev, lessOptions: {javascriptEnabled: true}};
  const postcssOptions = {postcssOptions: {plugins: ['postcss-import', 'autoprefixer']}};
  const vendor = ['react', 'react-dom'];
  const staticDir = 'static';

  return {
    context: path.resolve(__dirname),
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
    target: 'web',
    entry: {
      main: path.resolve(__dirname, './src/index.tsx')
    },
    output: {
      pathinfo: isDev,
      clean: true,
      path: path.resolve(__dirname, isDev ? 'dev': docConfig.outputPath),
      publicPath: isDev ? '/' : docConfig.publicPath,
      filename: path.join(staticDir, isDev ? 'js/[name].js' : 'js/[name].[contenthash:6].js'),
      chunkFilename: path.join( staticDir, isDev ? 'chunk/[name].js' : 'chunk/[name].[contenthash:6].js'),
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        forOf: false
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.less', '.mdx'],
      modules: ['node_modules', path.resolve(__dirname, '../'), path.resolve(__dirname, "../core"), path.resolve(__dirname, "../icons")],
      alias: {
        ...(isDev ? {'react-dom': '@hot-loader/react-dom'} : {}),
        '~controls': path.resolve(__dirname, './src/controls'),
        '~docs': path.resolve(__dirname, './docs'),
        "@acme-ui/core": path.resolve(__dirname, "../core/src"), // 配置去获取源文件
        "@acme-ui/icons": path.resolve(__dirname, "../icons/src"),
      },
    },
    performance: {
      hints: false,
    },
    // cache: isDev ? {
    //   type: 'filesystem', // filesystem 缓存在文件系统，这样下次编译会有缓存的性能加成
    //   cacheDirectory: path.join(__dirname, 'node_modules/.cache/webpack'), // cache 存放地址
    //   store: 'pack', // 设置编译器闲置时存放
    //   buildDependencies: {
    //     config: [__dirname] // 依赖项地址
    //   }
    // } : false,
    optimization: {
      splitChunks: {
        cacheGroups: {
          mainJS: {
            chunks: 'initial',
            minChunks: 2,
            name: 'main',
            maxInitialRequests: 5,
            minSize: 0,
          },
          vendor: {
            test: new RegExp(`[\\\\/]node_modules[\\\\/](${vendor.join('|')})[\\\\/]`),
            priority: 1,
            chunks: 'all',
            name: 'vendor',
            enforce: true,
          },
          styles: {
            name: 'main-style',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
          },
          default: {
            minSize: 100000,
            minChunks: 2,
          },
        },
      },
      runtimeChunk: true,
      minimize: !isDev,
      minimizer: [
        `...`, // 不可删，webpack 5 提供，代表集成默认的 minimizer 配置
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', {discardComments: { removeAll: true }}],
          },
        }),
      ]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'docs'),
            path.resolve(__dirname, '../core'),
            path.resolve(__dirname, '../icons')
          ],
          exclude: /node_modules/,
          use: [
            {loader: 'react-hot-loader/webpack'},
            {loader: 'babel-loader', options: {
                exclude: [
                  // \\ for Windows, / for macOS and Linux 排除不需要转义的包
                  /node_modules[\\/]core-js/,
                  /node_modules[\\/]webpack[\\/]buildin/,
                ],
                cacheDirectory: isDev ? path.join(__dirname, 'node_modules/.cache/babel-loader') : false
              }},
            {
              loader: 'react-docgen-typescript-loader',
              options: {
                tsconfigPath: path.resolve(__dirname, "./tsconfig.json"),
                shouldExtractLiteralValuesFromEnum: true,
                propFilter: (prop) => {
                  // HTML 原生标签属性都是从 @types/react 继承出来的, 通过以下操作排除打包
                  if (prop.declarations !== undefined && prop.declarations.length > 0) {
                    const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
                      return !declaration.fileName.includes("node_modules");
                    });
                    return Boolean(hasPropAdditionalDescription);
                  }

                  return true;
                }
              }
            }
          ],
        },
        {
          test: /\.mdx$/,
          use: [
            'react-hot-loader/webpack',
            'babel-loader',
            {
              loader: '@mdx-js/loader', options: {
                rehypePlugins: [rehypePlugin],
                remarkPlugins: [slug]
              }
            }
          ]
        },
        {
          test: /\.(less|css)$/,
          include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'docs'),],
          exclude: /node_modules/,
          use: [
            {loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader},
            {loader: 'css-loader', options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              }},
            {loader: 'postcss-loader', options: postcssOptions},
            {loader: 'less-loader', options: lessOptions},
          ],
        },
        {
          test: /\.(less|css)$/,
          include:  [
            /node_modules/,
            path.resolve(__dirname, '../core/src'),
            path.resolve(__dirname, '../icons/src')
          ],
          use: [
            {loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader},
            {loader: 'css-loader'},
            {loader: 'postcss-loader', options: postcssOptions},
            {loader: 'less-loader', options: lessOptions},
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
          type: 'asset/resource',
          generator: {
            filename: path.join(staticDir, isDev ? 'media/[name].[ext]' : 'media/[name].[hash:8].[ext]')
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: path.join(staticDir, isDev ? 'fonts/[name].[ext]' : 'fonts/[name].[hash:8].[ext]')
          }
        },
      ]
    },
    plugins: [
      // 全局常量配置
      new webpack.DefinePlugin({
        RUNTIME_NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      // 自动加载模块而不必导出 import
      new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom',
        _: 'lodash',
      }),
      // 忽略对某些模块的打包
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        templateParameters: {},
        inject: true,
        xhtml: true,
        cache: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new ESLintWebpackPlugin({
        lintDirtyModulesOnly: isDev, // 仅检查变更文件，首次 start 不校验
        threads: true, // 开启多线程
        formatter: 'stylish', // 报错输出格式化
      }),
      ...(isDev ? [] : [
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: path.join(staticDir, 'css/[name].[contenthash:6].css'),
          chunkFilename: path.join(staticDir, 'css/[name].[contenthash:6].css'),
          // insert: '#some-element' // 表示将生成的 link 标签插入到id=some-element 的元素后边
        }),
      ]),
      ...(isReport ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          analyzerHost: '127.0.0.1',
          analyzerPort: 8888,
          reportFilename: path.join('report', isDev ? 'dev' : 'prod', 'report.html'),
          defaultSizes: 'parsed',
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: path.join('report', isDev ? 'dev' : 'prod', 'stats.json'),
          statsOptions: null,
          logLevel: 'info',
        }),
      ]: []),
    ],
    devServer: {
      contentBase: path.resolve(__dirname, 'dev'),
      publicPath: isDev ? '/' : docConfig.publicPath,
      clientLogLevel: 'silent',
      hot: true,
      inline: true,
      compress: true,
      open: true,
      openPage: '.',
      port: env.port || 3010,
      host: env.host || '0.0.0.0',
      https: !!env.https,
      watchOptions: {
        ignored: /node_modules/,
      },
      stats: {
        colors: true,
        errors: true,
        warnings: true,
        modules: false,
        chunks: false,
      },
      disableHostCheck: true,
    }
  }
}
