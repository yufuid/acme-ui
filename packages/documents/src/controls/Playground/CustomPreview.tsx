/**
 * MDX Playground 代码操作区域
 * */

import React from 'react';
import { LivePreview } from 'react-live';
import PlaygroundLess from './Playground.less';

export type ResetComProps = (newComProps: { [key: string]: any }) => void;

export type ComProps = { [key: string]: any };

interface Props {
  reset: ResetComProps;
  /** 替换 组件属性的占位符, 同时需要传入的组件代码中包含占位符 */
  comProps: ComProps;
  headWrapper?: (comProps: ComProps, reset: ResetComProps) => React.ReactNode;
  asideWrapper?: (comProps: ComProps, reset: ResetComProps) => React.ReactNode;
}

class CustomPreview extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { headWrapper, asideWrapper, comProps, reset } = this.props;
    const previewClass = headWrapper || asideWrapper ? PlaygroundLess.demoArea : '';
    return (
      <div className={PlaygroundLess.previewWrapper}>
        {headWrapper ? (
          <div className={PlaygroundLess.previewHeader}>{headWrapper(comProps, reset)}</div>
        ) : null}
        <div className={PlaygroundLess.previewContent}>
          <LivePreview className={`${PlaygroundLess.preview} ${previewClass}`} />
          {asideWrapper ? (
            <div className={PlaygroundLess.aside}>{asideWrapper(comProps, reset)}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CustomPreview;
