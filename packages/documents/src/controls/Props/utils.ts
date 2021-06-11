/**
 * type 解析
 * */
import capitalize from 'capitalize';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import isRegExp from 'lodash/isRegExp';
import isString from 'lodash/isString';

export interface DocProp {
  required: boolean;
  description?: string;
  name: string;
  type: {
    name: string;
    value?: any;
    raw?: any;
    computed?: boolean;
  };
  // defaultValue?: any;
}

const RE_OBJECTOF = /(?:React\.)?(?:PropTypes\.)?objectOf\((?:React\.)?(?:PropTypes\.)?(\w+)\)/;

const getTypeStr = (propType: DocProp['type']): string => {
  const type = propType || {};

  switch (type.name.toLowerCase()) {
    case 'instanceof':
      return `Class(${type.value})`;
    case 'enum':
      if (type.computed) return type.value;
      return type.value ? type.value.map((v: any) => `${v.value}`).join(' | ') : type.raw;
    case 'union':
      return type.value ? type.value.map((t: any) => `${getTypeStr(t)}`).join(' | ') : type.raw;
    case 'array':
      return type.raw;
    case 'arrayof':
      return `Array<${getTypeStr(type.value)}>`;
    case 'custom':
      if (type.raw.indexOf('function') !== -1 || type.raw.indexOf('=>') !== -1)
        return 'Custom(Function)';
      if (type.raw.toLowerCase().indexOf('objectof') !== -1) {
        const m = type.raw.match(RE_OBJECTOF);
        if (m && m[1]) return `ObjectOf(${capitalize(m[1])})`;
        return 'ObjectOf';
      }
      return 'Custom';
    case 'bool':
      return 'Boolean';
    case 'func':
      return 'Function';
    case 'shape': {
      const shape = type.value;
      const rst: any = {};
      Object.keys(shape).forEach((key) => {
        rst[key] = getTypeStr(shape[key]);
      });

      return JSON.stringify(rst, null, 2);
    }
    default:
      return type.name;
  }
};

const getTypeStrWithoutUndefined = (docProp: Pick<DocProp, 'type' | 'required'>): string => {
  const { required, type } = docProp;
  const tempStr = getTypeStr(type);

  if (required || !isString(tempStr)) return tempStr;
  return tempStr.replace(/\|\sundefined$/, '').replace(/^undefined\s\|/, '');
};

const getDefaultValue = (
  name: string,
  docDefaultProps: Record<string, unknown>,
): React.ReactNode => {
  const defaultValue = get(docDefaultProps, name);

  if (defaultValue === undefined) return null;

  if (defaultValue === null) return 'null';

  switch (typeof defaultValue) {
    case 'string':
      return defaultValue === '' ? '[Empty string]' : defaultValue;
    case 'number':
      return isNaN(defaultValue) ? 'NaN' : defaultValue;
    case 'boolean':
      return defaultValue.toString();
    case 'function':
      return defaultValue.toString();
    case 'object': {
      if (isRegExp(defaultValue)) return defaultValue.toString();
      let result = '';
      try {
        result = JSON.stringify(
          defaultValue,
          (key, value) => {
            return typeof value === 'function' || isRegExp(value) ? value.toString() : value;
          },
          2,
        );
      } catch (e) {
        result = '';
      }
      return result;
    }
    default:
      return defaultValue as React.ReactNode;
  }
};

export { getTypeStr, getDefaultValue, getTypeStrWithoutUndefined };
