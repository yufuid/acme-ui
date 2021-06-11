import React, { ForwardedRef } from 'react';
import get from 'lodash/get';
import { uniteClassNames } from '../../utils/tools';
import './style/formLabel.less';

const classNamePrefix = 'acme-form-label';

export const classes = {
  root: classNamePrefix,
  placement: (placement: FormLabelProps['labelPlacement']): string =>
    `${classNamePrefix}-${placement}`,
  control: `${classNamePrefix}-control`,
  required: `${classNamePrefix}-required`,
  error: `${classNamePrefix}-error`,
};

export enum FormLabelPlacement {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}

type TFormLabelPlacement = `${FormLabelPlacement}`;

export interface FormLabelProps {
  /**
   * 样式
   */
  className?: string;
  /**
   * label内容
   */
  children?: React.ReactNode;
  /**
   * 是否必填
   * @default false
   */
  required?: boolean;
  /**
   * 是否处于错误状态
   * @default false
   */
  error?: boolean;
  /**
   * 所在位置
   * @default right
   */
  labelPlacement?: TFormLabelPlacement;
  /**
   * 控件元素
   */
  control?: React.ReactElement;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props: FormLabelProps, ref: ForwardedRef<HTMLLabelElement>) => {
    const { className, children, control, required, error, labelPlacement, ...otherProps } =
      props || {};
    const controlProps = {
      error,
      className: uniteClassNames(classes.control, get(control, 'props.className')),
    };
    return (
      <label
        className={uniteClassNames(
          classes.root,
          classes.placement(labelPlacement),
          error ? classes.error : '',
          className,
        )}
        ref={ref}
        {...otherProps}
      >
        {control ? React.cloneElement(control, controlProps) : null}
        <span>
          {children}
          {required ? (
            <span aria-hidden className={classes.required}>
              *
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

FormLabel.defaultProps = {
  className: '',
  labelPlacement: 'right',
};

export default FormLabel;
