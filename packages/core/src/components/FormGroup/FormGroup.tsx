import React, { ForwardedRef } from 'react';
import { uniteClassNames } from '../../utils/tools';
import './style/formGroup.less';

const classNamePrefix = 'acme-form-group';

export const classes = {
  root: classNamePrefix,
  layout: (layout: FormGroupProps['layout']): string => `${classNamePrefix}-${layout}`,
};

export enum FormGroupLayout {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

type TFormGroupLayout = `${FormGroupLayout}`;

export interface FormGroupProps {
  /**
   * 样式
   */
  className?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 垂直/水平布局
   * @default
   */
  layout?: TFormGroupLayout;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  (props: FormGroupProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { className, children, layout, ...otherProps } = props || {};
    return (
      <div
        className={uniteClassNames(classes.root, classes.layout(layout), className)}
        ref={ref}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);

FormGroup.defaultProps = {
  className: '',
  layout: 'vertical',
};

export default FormGroup;
