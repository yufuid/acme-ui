/**
 * MDX 组件 Props 展示
 * */
import React, { ComponentType } from 'react';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import PropItem from './PropItem';
import { DocProp } from './utils';
import PropsLess from './Props.less';

export type ComponentWithDocGenInfo = ComponentType & {
  __docgenInfo: {
    description?: string;
    props?: Record<string, DocProp>;
  };
};

interface PropsProps {
  of: ComponentWithDocGenInfo;
}

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const ReactMemoSymbol = hasSymbol
  ? Symbol.for('react.memo')
  : typeof React.memo === 'function' && React.memo(() => null).$$typeof;

class Props extends React.PureComponent<PropsProps> {
  getDocProps() {
    const { of } = this.props;
    const commonProps = get(of, '__docgenInfo.props');
    const memoProps = get(of, 'type.__docgenInfo.props');

    if (ReactMemoSymbol && get(of, '$$typeof') === ReactMemoSymbol) {
      if (!isObject(memoProps) && !isObject(commonProps)) return [];
      return isObject(memoProps) ? Object.values(memoProps) : Object.values(commonProps);
    }

    return isObject(commonProps) ? Object.values(commonProps) : [];
  }

  getDocDefaultProps() {
    const { of } = this.props;
    const commonDef = get(of, 'defaultProps');
    const memoDef = get(of, 'type.defaultProps');

    if (ReactMemoSymbol && get(of, '$$typeof') === ReactMemoSymbol) {
      if (!isObject(memoDef) && !isObject(commonDef)) return {};
      return isObject(memoDef) ? memoDef : commonDef;
    }

    return isObject(commonDef) ? commonDef : {};
  }

  render(): React.ReactNode {
    const docProps = this.getDocProps();
    const docDefaultProps = this.getDocDefaultProps();

    return (
      <table className={PropsLess.table}>
        <thead>
          <tr>
            <th>
              参数
              <span className={PropsLess.thRequired}>
                (<span className={PropsLess.required}>*</span>为必填)
              </span>
            </th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody>
          {docProps.map((docProp) => {
            return <PropItem {...docProp} key={docProp.name} docDefaultProps={docDefaultProps} />;
          })}
        </tbody>
      </table>
    );
  }
}

export default Props;
