/**
 * Playground Header 或者 sider 选中处理封装
 * */

import React from 'react';
import { ResetComProps, ComProps } from './CustomPreview';
import PlaygroundLess from './Playground.less';

interface Props {
  currentProps: ComProps;
  reset: ResetComProps;
  options: {
    label: string;
    onClick: (currentProps: ComProps) => ComProps;
    highlight: (currentProps: ComProps) => boolean;
  }[];
}

const Checker: React.FC<Props> = (props: Props) => {
  const { options, currentProps } = props;
  function onOptClick(opt: Props['options'][number]) {
    const { reset } = props;
    const { onClick } = opt;
    reset(onClick(currentProps));
  }

  return (
    <div className={PlaygroundLess.headerChecker}>
      {options.map((opt) => {
        const isHighlight = opt.highlight(currentProps);
        const spanCls = `${PlaygroundLess.checkerItem} ${
          isHighlight ? PlaygroundLess.headerCheckerSelected : ''
        }`;
        return (
          <span key={opt.label} className={spanCls} onClick={() => onOptClick(opt)}>
            {opt.label}
          </span>
        );
      })}
    </div>
  );
};

// 再次封装，方便使用
export const renderChecker = (options: Props['options']) => {
  return (currentProps: ComProps, reset: ResetComProps) => {
    return <Checker reset={reset} currentProps={currentProps} options={options} />;
  };
};

export default Checker;
