/**
 * 提取 esm cjs 样式
 * */
const fs = require('fs');
const path = require('path');
const { src, dest, series, parallel } = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const syntax = require('postcss-less');
const url = require('postcss-url');

const dirMap = {esm: 'es'};
const BABEL_ENV = process.env.BABEL_ENV || 'cjs';
const componentDir = './src/components';
const outputDir = `./dist/${dirMap[BABEL_ENV] || BABEL_ENV}`;
const cModuleNames = fs.readdirSync(path.resolve(componentDir));
const componentDirs = cModuleNames.filter((name) => /^[A-Z]\w*/.test(name));
const postcssPlugins = [autoprefixer({ env: BABEL_ENV }), url({ url: 'inline' })];

// 批量编译 CSS Less 到目标文件夹
function extractStyle(componentName) {
  const extractCssFn = function () {
    return src([`${componentDir}/${componentName}/**/*.less`])
      .pipe(postcss(postcssPlugins, { syntax: syntax }))
      .pipe(less())
      .pipe(concat('index.css'))
      .pipe(dest(`${outputDir}/components/${componentName}/style`));
  };

  extractCssFn.displayName = `Extract-${componentName}-CSS`;

  return extractCssFn;
}

// less 文件拷贝（与 theme 主题实现相关 待定）
function copyLessFile() {
  return src(`./src/**/*.less`)
    .pipe(postcss(postcssPlugins, { syntax: syntax }))
    .pipe(dest(outputDir));
}

// 补全文件（与 theme 主题实现相关 待定）
function completeStyle(cb) {
  componentDirs.forEach((oModuleName) => {
    const mPath = path.resolve(`${outputDir}/components/${oModuleName}`);
    const mStylePath = path.join(mPath, 'style');
    let moduleFiles = [];
    try {
      moduleFiles = fs.readdirSync(mPath);
    } catch (error) {
      fs.mkdirSync(mPath);
    }

    const hasStyle = moduleFiles.includes('style') && fs.statSync(mStylePath).isDirectory();
    if (!hasStyle) {
      fs.mkdirSync(mStylePath);
      fs.writeFileSync(path.join(mStylePath, 'index.css'), '');
      fs.writeFileSync(path.join(mStylePath, 'index.js'), ''); // theme 专用
      fs.writeFileSync(path.join(mStylePath, 'css.js'), '');
    } else {
      // theme 专用
      let styleFiles = [];
      try {
        styleFiles = fs.readdirSync(mStylePath);
      } catch (error) {
        fs.mkdirSync(mStylePath);
      }
      fs.writeFileSync(
        path.join(mStylePath, 'index.js'),
        styleFiles
          .filter((f) => path.extname(f) === '.less')
          .map((f) => `import \'./${f}\'`)
          .join('\n'),
      );
      fs.writeFileSync(path.join(mStylePath, 'css.js'), "import './index.css'");
    }
  });
  cb();
}

// 执行工作流
exports.default = !Array.isArray(componentDirs) || componentDirs.length === 0 
  ? function (cb) { cb(); }
  : series(
    parallel(...componentDirs.map((name) => extractStyle(name))),
    copyLessFile,
    completeStyle,
  );
