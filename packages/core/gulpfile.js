/**
 * 提取 esm cjs 样式
 * */
const fs = require('fs');
const path = require('path');
const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const syntax = require('postcss-less');
const url = require('postcss-url');
const less = require('./scripts/gulp-less');

const dirMap = {esm: 'es'};
const BABEL_ENV = process.env.BABEL_ENV || 'cjs';
const componentDir = './src/components';
const outputDir = `./dist/${dirMap[BABEL_ENV] || BABEL_ENV}`;
let componentDirs = [];
try {
  const cModuleNames = fs.readdirSync(path.resolve(componentDir));
  componentDirs = cModuleNames.filter((name) => /^[A-Z]\w*/.test(name));
} catch (error) {}
const postcssPlugins = [autoprefixer({ env: BABEL_ENV }), url({ url: 'inline' })];
const importStr = (str) => BABEL_ENV === 'esm' ? `import \'${str}\';` : `require(\"${str}\");`;
const cleanCssFormat = {
  breaks: {
    afterAtRule: true,
    afterBlockBegins: true,
    afterBlockEnds: true,
    afterComment: true,
    afterProperty: true,
    afterRuleBegins: true,
    afterRuleEnds: true,
    beforeBlockEnds: true,
    betweenSelectors: true
  },
  breakWith: '\n',
  indentBy: 2,
  indentWith: 'space',
  spaces: {
    aroundSelectorRelation: true,
    beforeBlockBegins: true,
    beforeValue: true
  },
  wrapAt: false,
  semicolonAfterLastProperty: false
}

// 批量编译 CSS Less 到目标文件夹
function extractStyle(componentName) {
  const extractCssFn = function () {
    return src([`${componentDir}/${componentName}/**/*.less`])
      .pipe(postcss(postcssPlugins, { syntax: syntax }))
      .pipe(less())
      .pipe(concat('index.css'))
      .pipe(cleanCss({format: cleanCssFormat}))
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

// 组件库全局样式编译 /styles/cover/index.css
function coverLess() {
  return src('./src/styles/cover/index.less')
    .pipe(postcss(postcssPlugins, { syntax: syntax }))
    .pipe(less())
    .pipe(cleanCss({format: cleanCssFormat}))
    .pipe(dest(`${outputDir}/styles/cover/`));
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

      const lessFiles = styleFiles
        .filter((f) => path.extname(f) === '.less')
        .map((f) => importStr(`./${f}`));
      fs.writeFileSync(
        path.join(mStylePath, 'index.js'),
        [importStr('../../../styles/cover/index.less'), ...lessFiles].join('\n'),
      );
      fs.writeFileSync(
        path.join(mStylePath, 'css.js'),
        [importStr('../../../styles/cover/index.css'), importStr('./index.css')].join('\n')
      );
    }
  });
  cb();
}

// 执行工作流
exports.default = !Array.isArray(componentDirs) || componentDirs.length === 0
  ? function (cb) { cb(); }
  : series(
    parallel(...componentDirs.map((name) => extractStyle(name))),
    coverLess,
    copyLessFile,
    completeStyle,
  );
