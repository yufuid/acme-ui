/**
 * 单个 prop 的渲染
 * */
import React from "react";
import PropsLess from './Props.less';
import {getTypeStr, getDefaultValue, DocProp} from './utils';

type PropItemProps = DocProp & {};

const PropItem: React.FC<PropItemProps> = (props: PropItemProps) => {
  const {type, description, name} = props;
  const typeStr = getTypeStr(type);
  const defaultValue = getDefaultValue(props);

  return (
    <tr className={PropsLess.item}>
      <td className={PropsLess.name}>{name}</td>
      <td className={PropsLess.description}>{description}</td>
      <td className={PropsLess.type}>{typeStr}</td>
      <td className={PropsLess.default}>{defaultValue}</td>
      {/*<td className={PropsLess.required}>{required ? 'required': ''}</td>*/}
    </tr>
  );
}

export default React.memo(PropItem);
