/**
 * Playground Header 或者 sider 多选框封装
 * */

import React from 'react';
import isBoolean from 'lodash/isBoolean';
import { ResetComProps, ComProps } from './CustomPreview';
import PlaygroundLess from './Playground.less';

interface Props {
  currentProps: ComProps;
  reset: ResetComProps;
  direction?: 'horizontal' | 'vertical';
  options: {
    label: string;
    onClick: (currentProps: ComProps) => ComProps;
    isChecked: (currentProps: ComProps) => boolean;
    isDisabled?: boolean | ((currentProps: ComProps) => boolean);
  }[];
}

const Checkbox: React.FC<Props> = (props: Props) => {
  const { options, currentProps, direction } = props;
  function onOptClick(opt: Props['options'][number]) {
    const { reset } = props;
    const { onClick } = opt;
    reset(onClick(currentProps));
  }

  const wrapperClass = [
    PlaygroundLess.headerCheckbox,
    direction === 'vertical' ? PlaygroundLess.vertical : PlaygroundLess.horizontal,
  ];
  return (
    <div className={wrapperClass.join(' ')}>
      {options.map((opt) => {
        const isChecked = opt.isChecked(currentProps);
        let isDisabled = false;
        if (isBoolean(opt.isDisabled)) isDisabled = opt.isDisabled;
        if (typeof opt.isDisabled === 'function') isDisabled = opt.isDisabled(currentProps);

        return (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label
            key={opt.label}
            className={`${PlaygroundLess.label} ${isDisabled ? PlaygroundLess.labelDisabled : ''}`}
          >
            <input
              onChange={() => onOptClick(opt)}
              type="checkbox"
              value="Bike"
              checked={isChecked}
              disabled={isDisabled}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

Checkbox.defaultProps = {
  direction: 'vertical',
};

// 再次封装，方便使用
export const renderCheckbox = (options: Props['options'], direction: 'horizontal' | 'vertical') => {
  return (currentProps: ComProps, reset: ResetComProps) => {
    return (
      <Checkbox reset={reset} currentProps={currentProps} options={options} direction={direction} />
    );
  };
};

export default Checkbox;
