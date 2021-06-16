import * as React from 'react';
import { uniteClassNames } from '../../utils/tools';
import './style/formDescription.less';

const classNamePrefix = 'acme-form-description';

export const classes = {
  root: classNamePrefix,
  error: `${classNamePrefix}-error`,
  disabled: `${classNamePrefix}-disabled`,
};

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 错误状态
   */
  error?: boolean;
  /**
   * 禁用状态
   */
  disabled?: boolean;
}

const FormGroup = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  (props: FormDescriptionProps, ref: React.ForwardedRef<HTMLParagraphElement>) => {
    const { className, children, error, disabled, ...otherProps } = props || {};
    return (
      <p
        className={uniteClassNames(
          classes.root,
          error ? classes.error : '',
          disabled ? classes.disabled : '',
          className,
        )}
        {...otherProps}
        ref={ref}
      >
        {children}
      </p>
    );
  },
);

FormGroup.defaultProps = {
  className: '',
  error: false,
  disabled: false,
};

export default FormGroup;
