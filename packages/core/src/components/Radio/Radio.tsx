import React, { useState, useEffect } from 'react';
import { isFunction } from 'lodash-es';
import { uniteClassNames } from '../../utils/tools';
import { RadioLabelPlacement, RadioSize } from './types';
import './style/Radio.less';

type RadioLabelPlacementType = `${RadioLabelPlacement}`;
type RadioSizeType = `${RadioSize}`;

export const classNamePrefix = 'acme-radio';

export const classes = {
  base: classNamePrefix,
  inline: `${classNamePrefix}-inline`,
  disabled: `${classNamePrefix}-disabled`,
};

export interface IRadioProps {
  /**
   * 是否选中
   * @default false
   */
  checked?: boolean;
  /**
   * 是否选中，非受控属性
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 错误样式展示，一般在表单中用
   * @default false
   */
  error?: boolean;
  /**
   * 事件变化方法
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 当前Radio是否为行内元素
   * @default false
   */
  inline?: boolean;
  /**
   * 单选按钮大小，仅在Radio.Button生效
   */
  size?: RadioSizeType;
  [key: string]: any;
}

const Radio: React.ForwardRefExoticComponent<
  IRadioProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef((props: IRadioProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const { checked, inline, disabled, defaultChecked, error, onChange, ...otherProps } = props;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  useEffect(() => {
    setInternalChecked(checked);
  });

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(onChange)) {
      onChange(e);
    }
  };

  return (
    <input
      className={uniteClassNames(
        classes.base,
        inline ? classes.inline : '',
        disabled ? classes.disabled : '',
      )}
      type="radio"
      checked={!!internalChecked}
      disabled={!!disabled}
      onChange={onRadioChange}
      ref={ref}
      {...otherProps}
    />
  );
});

Radio.defaultProps = {
  checked: false,
  defaultChecked: false,
  disabled: false,
  error: false,
  onChange: undefined,
  inline: false,
  size: 'default',
};

export default Radio;
