import get from 'lodash/get';
import isObject from 'lodash/isObject';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { ComProps } from './CustomPreview';

export const transformCode = (code: string) => {
  if (
    code.startsWith('()') ||
    code.startsWith('class') ||
    code.startsWith('<React.Fragment>') ||
    code.startsWith('<>')
  )
    return code;
  return `<React.Fragment>${code}</React.Fragment>`;
};

const deleteSemi = (code: string) => {
  if (code.startsWith('class') || code.startsWith('<React.Fragment>') || code.startsWith('<>')) {
    return code.replace(/;\s*$/, '');
  }
  return code;
};

export const resetCodePlaceholder = (code: string, comProps: ComProps, placeholder: string) => {
  const comPropsArr: string[] = [];

  if (isObject(comProps)) {
    Object.keys(comProps).forEach((key) => {
      const val = get(comProps, key);
      if (typeof val === 'string') {
        comPropsArr.push(`${key}=\"${val}\"`);
      } else if (typeof val === 'boolean') {
        comPropsArr.push(val ? key : `${key}={false}`);
      } else if (typeof val === 'undefined') {
        comPropsArr.push(`${key}={undefined}`);
      } else if (typeof val === 'number') {
        comPropsArr.push(`${key}={${val}}`);
      } else if (val === null) {
        comPropsArr.push(`${key}={null}`);
      } else if (typeof val === 'object') {
        comPropsArr.push(`${key}={${JSON.stringify(val)}}`);
      }
    });
  }
  const replaceCode = transformCode(code.replaceAll(placeholder, comPropsArr.join(' ')));
  const result = prettier.format(replaceCode, {
    parser: 'babel',
    plugins: [parserBabel],
    printWidth: 75,
  });
  return deleteSemi(result);
};
