import React, { ChangeEvent, ForwardedRef, useContext, useEffect, useState } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import indexOf from 'lodash/indexOf';
import { uniteClassNames } from '../../utils/tools';
import FormLabel from '../FormLabel';
import CheckboxGroup, { CheckGroupContext } from './CheckboxGroup';
import { FormLabelProps } from '../FormLabel/FormLabel';
import './style/Checkbox.less';

export interface CheckboxProps {
  /**
   * 最外层元素样式
   */
  className?: string;
  /**
   * input name
   */
  name?: string;
  /**
   * checkbox 值
   */
  value?: string | number;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 初始是否选中
   */
  defaultChecked?: boolean;
  /**
   * 半选状态，只控制样式
   */
  indeterminate?: boolean;
  /**
   * checkbox 状态改变
   */
  onChange?: (e: ChangeEvent) => void;
  /**
   * label内容
   */
  children?: FormLabelProps['children'];
  /**
   * 是否必填
   */
  required?: FormLabelProps['required'];
  /**
   * 是否处于错误状态
   */
  error?: boolean;
  /**
   * 所在位置
   */
  labelPlacement?: FormLabelProps['labelPlacement'];
}

export const classNamePrefix = 'acme-checkbox';

export const classes = {
  root: classNamePrefix,
  indeterminate: `${classNamePrefix}-indeterminate`,
  input: `${classNamePrefix}-input`,
  default: `${classNamePrefix}-default`,
  disabled: `${classNamePrefix}-disabled`,
  content: `${classNamePrefix}-content`,
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props: CheckboxProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      className,
      disabled,
      onChange,
      indeterminate,
      checked,
      defaultChecked,
      value,
      name,
      ...labelProps
    } = props;

    const checkboxGroup = useContext(CheckGroupContext);

    const [currChecked, setCurrChecked] = useState(defaultChecked);

    useEffect(() => {
      setCurrChecked(checked);
    }, [checked]);

    const inputProps = {
      checked: !!currChecked,
      ref,
      disabled: !!disabled,
      value,
      name,
    };
    if (checkboxGroup) {
      set(inputProps, 'checked', indexOf(get(checkboxGroup, 'values'), value) > -1);
      set(inputProps, 'disabled', !!get(checkboxGroup, 'disabled'));
      set(inputProps, 'name', get(checkboxGroup, 'name'));
    }

    const groupChange = get(checkboxGroup, 'onChange');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = get(e, 'target.checked');
      if (checked === undefined) {
        setCurrChecked(isChecked);
      }
      if (isFunction(onChange)) {
        onChange(e);
      }
      if (isFunction(groupChange)) {
        checkboxGroup?.onChange(value as string);
      }
    };

    return (
      <FormLabel
        className={uniteClassNames(classes.root, disabled ? classes.disabled : '', className)}
        control={
          <span className={classes.content}>
            <input
              className={classes.input}
              onChange={handleInputChange}
              {...inputProps}
              type="checkbox"
            />
            <span
              className={uniteClassNames(
                classes.default,
                indeterminate ? classes.indeterminate : '',
              )}
            />
          </span>
        }
        {...labelProps}
      />
    );
  },
) as React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> & {
  Group: typeof CheckboxGroup;
};

Checkbox.defaultProps = {
  className: '',
  value: '',
  disabled: false,
  defaultChecked: false,
  indeterminate: false,
};

export default Checkbox;
