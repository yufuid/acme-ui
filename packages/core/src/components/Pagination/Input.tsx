import { get, isFunction, isString } from 'lodash-es';
import React, { ForwardedRef } from 'react';
import { classNames } from './util/Pagination';
import './style/input.less';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const classNamePrefix = 'acme-pagination-input';

const Input: React.FC<InputProps> = React.forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { className, ...resetProps } = props;

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const change = get(resetProps, 'onChange');
      if (isFunction(change)) {
        change(e);
      }
    };

    const mergeClassNames = classNames({
      [`${classNamePrefix}`]: true,
      [`${className}`]: className ? isString(className) : false,
    });

    return <input {...resetProps} className={mergeClassNames} ref={ref} onChange={onChange} />;
  },
);

export default Input;
