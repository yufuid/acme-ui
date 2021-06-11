import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import React, { ForwardedRef } from 'react';
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

    const mergeClassNames = `${classNamePrefix} ${className}`;

    return <input {...resetProps} className={mergeClassNames} ref={ref} onChange={onChange} />;
  },
);

export default Input;
