/**
 * type 解析
 * */
import capitalize from 'capitalize';
import { has, isString } from 'lodash-es';

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
  defaultValue?: {
    value: string;
    computed: boolean;
  };
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

const getDefaultValue = (docProp: DocProp) => {
  const { defaultValue, type } = docProp;

  if (!defaultValue || !defaultValue.value) return null;
  if (defaultValue.value === "''") {
    return '[Empty string]';
  }
  if (type && type.name === 'string') {
    return defaultValue.value.replace(/\'/g, '"');
  }
  if (typeof defaultValue.value === 'object' && has(defaultValue, 'value.toString')) {
    return (defaultValue.value as { toString: () => string }).toString();
  }
  return defaultValue.value;
};

export { getTypeStr, getDefaultValue, getTypeStrWithoutUndefined };
