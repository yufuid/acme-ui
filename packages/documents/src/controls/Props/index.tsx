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
      if (isObject(memoProps)) return Object.values(memoProps);
      return Object.values(commonProps);
    }

    if (!isObject(commonProps)) return [];
    return Object.values(commonProps);
  }

  render(): React.ReactNode {
    const docProps = this.getDocProps();

    return (
      <table className={PropsLess.table}>
        <thead>
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
            {/* <th>是否必填</th> */}
          </tr>
        </thead>
        <tbody>
          {docProps.map((docProp) => {
            return <PropItem {...docProp} key={docProp.name} />;
          })}
        </tbody>
      </table>
    );
  }
}

export default Props;
