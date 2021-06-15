/**
 * 单个 prop 的渲染
 * */
import React from 'react';
import PropsLess from './Props.less';
import { getDefaultValue, DocProp, getTypeStrWithoutUndefined } from './utils';

type PropItemProps = DocProp & {
  docDefaultProps: Record<string, unknown>;
};

const PropItem: React.FC<PropItemProps> = (props: PropItemProps) => {
  const { type, description, name, docDefaultProps, required } = props;
  const typeStr = getTypeStrWithoutUndefined({ type, required });
  const defaultValue = getDefaultValue(name, docDefaultProps);

  return (
    <tr className={PropsLess.item}>
      <td className={PropsLess.name}>
        {name}
        {required ? <span className={PropsLess.required}>*</span> : null}
      </td>
      <td className={PropsLess.description}>{description}</td>
      <td className={PropsLess.type}>{typeStr}</td>
      <td className={PropsLess.default}>{defaultValue}</td>
      {/* <td className={PropsLess.required}>{required ? 'required': ''}</td> */}
    </tr>
  );
};

export default React.memo(PropItem);
