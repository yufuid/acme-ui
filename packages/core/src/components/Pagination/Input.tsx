import { get, isFunction } from 'lodash-es';
import React from 'react';
import { classNames } from './paginationUtil';
import './style/input.less';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  defaultValue?: string | number;
  value?: string | number;
}

const classNamePrefix = 'acme-pagination-input';

const Input: React.FC<InputProps> = React.forwardRef((props: InputProps, ref: any) => {
  const { className, defaultValue, value, type, onKeyDown, onBlur, ...resetProps } = props;

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const change = get(resetProps, 'onChange');
    if (isFunction(change)) {
      change(e);
    }
  };

  const mergeClassNames = classNames({
    [`${className}`]: true,
    [`${classNamePrefix}`]: true,
  });

  return (
    <input
      defaultValue={defaultValue}
      value={value}
      ref={ref}
      className={mergeClassNames}
      type={type}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
});

Input.defaultProps = {
  type: 'text',
};

export default Input;
