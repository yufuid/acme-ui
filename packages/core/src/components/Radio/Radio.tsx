import React, { useContext, useState, useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import FormLabel, { FormLabelProps } from '../FormLabel/index';
import RadioGroup from './RadioGroup';
import RadioButton from './RadioButton';
import RadioGroupContext from './RadioGroupContext';
import { uniteClassNames } from '../../utils/tools';
import './style/Radio.less';

export const classNamePrefix = 'acme-radio';

export const classes = {
  root: `${classNamePrefix}-root`,
  radio: classNamePrefix,
  inline: `${classNamePrefix}-inline`,
  error: `${classNamePrefix}-error`,
  disabled: `${classNamePrefix}-disabled`,
};

export interface IRadioProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 当前值
   */
  value?: string | number;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 单选标签
   */
  label?: FormLabelProps['children'];
  /**
   * 标签位置
   */
  labelPlacement?: FormLabelProps['labelPlacement'];
  /**
   * 是否选中，非受控属性
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 错误样式展示，一般在表单中用
   */
  error?: boolean;
  /**
   * 事件变化方法
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 当前Radio是否为行内元素
   */
  inline?: boolean;
  /**
   * 同input的name属性
   */
  name?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Radio = React.forwardRef((props: IRadioProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    checked,
    label,
    inline,
    disabled,
    defaultChecked,
    error,
    value,
    onChange,
    name,
    ...otherProps
  } = props;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  let currentChecked = internalChecked;
  let radioGroupChange: IRadioProps['onChange'] | null = null;
  let internalName = name;
  const radioGroup = useContext(RadioGroupContext);

  if (radioGroup) {
    const radioGroupValue = get(radioGroup, 'value');
    if (!('checked' in props) && radioGroupValue) {
      currentChecked = radioGroupValue === value;
    }

    const radioGroupChangeFunc = get(radioGroup, 'onChange');
    if (isFunction(radioGroupChangeFunc)) {
      radioGroupChange = radioGroupChangeFunc;
    }

    const radioGroupName = get(radioGroup, 'name');
    if (!('name' in props) && radioGroupName) {
      internalName = radioGroupName;
    }
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(onChange)) {
      onChange(e);
    }
    if (isFunction(radioGroupChange)) {
      radioGroupChange(e);
    }
  };

  return (
    <FormLabel
      className={uniteClassNames(
        classes.root,
        inline ? classes.inline : '',
        error ? classes.error : '',
        disabled ? classes.disabled : '',
        className,
      )}
      control={
        <input
          className={classes.radio}
          type="radio"
          value={value}
          checked={!!currentChecked}
          disabled={!!disabled}
          onChange={handleRadioChange}
          name={internalName}
          ref={ref}
        />
      }
      {...otherProps}
    >
      {label}
    </FormLabel>
  );
}) as React.ForwardRefExoticComponent<IRadioProps & React.RefAttributes<HTMLInputElement>> & {
  Group: typeof RadioGroup;
  Button: typeof RadioButton;
};

Radio.defaultProps = {
  labelPlacement: 'right',
  onChange: undefined,
};

export default Radio;
