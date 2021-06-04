import React from 'react';
import { omit } from 'lodash-es';
import Button from './Button';
import './style/ButtonGroup.less';

export interface IButtonGroupProps {
  children: typeof Button | typeof Button[];
}

const ButtonGroup: React.FC<IButtonGroupProps> = (props: IButtonGroupProps) => {
  const { children } = props;
  const otherProps = omit(props, ['children']);
  return (
    <div className="acme-btn-group" {...otherProps}>
      {children}
    </div>
  );
};
export default ButtonGroup;
