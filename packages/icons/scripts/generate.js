'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { template } = require('lodash');

const args = process.argv.splice(2);
const fileDirRootPath = args[0] || '';
const error = chalk.bold.red;
const success = chalk.bold.green;

const renderSvgIcon = template(`import BaseIcon, { IconProps, SvgProps } from '../components/BaseIcon';

const  <%= FileName %>Svg = (props: SvgProps) => <svg {...props}><%= content %>;

const <%= FileName %> = (props: IconProps) => <BaseIcon component={<%= FileName %>Svg} {...props} />;

export default <%= FileName %>;
`);

const indexExport = template(`export { default as <%= FileName %>Icon } from './icons/<%= FileName %>';
`);

const iconPath = path.resolve(__dirname, '../src/icons');

const currentTSXFiles = fs.readdirSync(iconPath);

function readFileDir(fileDirPath) {
  fs.readdir(fileDirPath, { encoding: 'utf-8' }, (err, files) => {
    if (err) {
      console.error(error('error'), err);
      return;
    }
    files.forEach((fullFilename) => {
      const filePath = path.join(fileDirPath, fullFilename);
      const stats = fs.statSync(filePath);
      const isDir = stats.isDirectory();
      const isFile = stats.isFile();
      if (isDir) {
        readFileDir(filePath);
      }
      if (isFile) {
        if (!/\.(svg)$/.test(fullFilename)) {
          console.error(error(fullFilename + " is't svg"));
          return;
        }
        const FileName = fullFilename.replace('.svg', '');
        fs.readFile(filePath, (readErr, data) => {
          if (readErr) {
            console.error(error(`${FileName}.svg read failed`, readErr));
            return;
          }
          SVGToReact(data, FileName);
        });
        appendIndexTS(FileName);
      }
    });
  });
}

function SVGToReact(data, FileName) {
  if (!data || !FileName) return;
  const svgData = data.toString('utf-8').match(/<svg([\S\s]*)svg>/) || [];
  if (svgData.length == 0) {
    return null;
  }
  const content = svgData[0].replace(/<svg([\s\S]*?)>/, '');
  fs.writeFile(
    path.join(iconPath, FileName + '.tsx'),
    renderSvgIcon({ FileName, content }),
    (writeErr) => {
      if (writeErr) {
        console.error(error(`${FileName}.tsx is failed`), writeErr);
      } else {
        console.info(success(`${FileName}.tsx is saved`));
      }
    },
  );
}

function appendIndexTS(fileName) {
  if (currentTSXFiles.includes(`${fileName}.tsx`)) return;
  fs.appendFile(
    path.join(__dirname, '../src/index.ts'),
    indexExport({ fileName }),
    () => {},
  );
}
readFileDir(fileDirRootPath);
