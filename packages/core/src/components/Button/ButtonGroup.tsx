import React from 'react';
import Button, { classNamePrefix } from './Button';
import { ButtonSize } from './types';
import './style/ButtonGroup.less';

type ButtonSizeType = `${ButtonSize}`;
export interface IButtonGroupProps {
  className?: string;
  children: typeof Button | typeof Button[];
  size?: ButtonSizeType;
}

const ButtonGroup: React.ForwardRefExoticComponent<
  IButtonGroupProps & React.RefAttributes<unknown>
> = React.forwardRef((props: IButtonGroupProps, ref: any) => {
  const { children, className = '', size, ...otherProps } = props;
  return (
    <div className={`${classNamePrefix}-group ${className}`} ref={ref} {...otherProps}>
      {React.Children.map(children, (child: any) => {
        const newChild = React.cloneElement(child, { size });
        return newChild;
      })}
    </div>
  );
});
ButtonGroup.defaultProps = {
  size: ButtonSize.DEFAULT,
};
export default ButtonGroup;
