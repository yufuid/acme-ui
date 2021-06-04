import { toArray, isString, isArray } from 'lodash-es';

export const uniteClassNames = (...args: (string | undefined)[]): string => {
  const classNames = toArray(args).filter((className) => {
    return isString(className) && !!className;
  });
  return isArray(classNames) ? classNames.join(' ').trim() : '';
};

// TODO 临时hack一下eslint规则 Prefer default export  import/prefer-default-export
export default {};
