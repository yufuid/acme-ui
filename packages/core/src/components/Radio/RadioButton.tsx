import React, { ForwardRefExoticComponent, RefAttributes, useContext } from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';
import RadioGroupContext from './RadioGroupContext';
import { RadioSize } from './types';
import './style/RadioButton.less';

type RadioSizeType = `${RadioSize}`;

export interface IRadioButtonProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 标签展示
   */
  label?: React.ReactNode;
  /**
   * value值
   */
  value?: string | number;
  /**
   * 单选按钮大小
   */
  size?: RadioSizeType;
  /**
   * 点击方法
   */
  onChange?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | null;
}

export const classNamePrefix = 'acme-radio-button';

const classes = {
  root: classNamePrefix,
  size: (size: IRadioButtonProps['size']) => `${classNamePrefix}-${size}`,
  checked: `${classNamePrefix}-checked`,
};

const RadioButton: ForwardRefExoticComponent<IRadioButtonProps & RefAttributes<HTMLButtonElement>> =
  React.forwardRef((props: IRadioButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { className, label, checked, size, value, ...otherProps } = props;

    let internalSize = size;
    let internalChecked = checked;
    let radioGroupChange: IRadioButtonProps['onChange'];
    let internalName = '';
    const radioGroup = useContext(RadioGroupContext);

    if (radioGroup) {
      const radioGroupValue = get(radioGroup, 'value');
      const radioGroupName = get(radioGroup, 'name');
      const radioGroupSize = get(radioGroup, 'size');
      const radioGroupChangeFunc = get(radioGroup, 'onChange');
      if (!('checked' in props) && radioGroupValue) {
        internalChecked = radioGroupValue === value;
      }
      if (isFunction(radioGroupChangeFunc)) {
        radioGroupChange = radioGroupChangeFunc;
      }
      if (!('name' in props) && radioGroupName) {
        internalName = radioGroupName;
      }
      if (radioGroupSize) {
        internalSize = radioGroupSize;
      }
    }

    return (
      <button
        className={uniteClassNames(
          classes.root,
          classes.size(internalSize),
          internalChecked ? classes.checked : '',
          className,
        )}
        value={value}
        name={internalName}
        onClick={radioGroupChange}
        ref={ref}
        {...otherProps}
        type="button"
      >
        {label}
      </button>
    );
  });

RadioButton.defaultProps = {
  size: 'default',
};

export default RadioButton;
