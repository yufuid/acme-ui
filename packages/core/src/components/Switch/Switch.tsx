import React, { ChangeEvent, ForwardedRef } from 'react';
import './style/switch.less';
import { isFunction, omit, get, set } from 'lodash-es';
import { uniteClassNames } from '../../utils/tools';
import { PrimaryLoadingSvg } from '../Button/LoadingIcon';

const classNamePrefix = 'acme-switch';

export const classes = {
  root: classNamePrefix,
  size: (size: SwitchProps['size']) => `${classNamePrefix}-${size}`,
  input: `${classNamePrefix}-input`,
  content: `${classNamePrefix}-content`,
  btn: `${classNamePrefix}-btn`,
  disabled: `${classNamePrefix}-disabled`,
  loading: `${classNamePrefix}-loading`,
};

export enum SwitchSize {
  DEFAULT = 'default',
  SMALL = 'small',
}

type TSwitchSize = `${SwitchSize}`;

export interface SwitchProps {
  /**
   * Switch 样式
   */
  className?: string;
  /**
   * Switch 大小 'default' | 'small'
   * @default SwitchSize.DEFAULT
   */
  size?: TSwitchSize;
  /**
   * 当前是否选中
   */
  checked?: boolean;
  /**
   * 默认选中状态
   * @default true
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 真实的input元素
   * @default null
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * 是否处于加载状态
   * @default false
   */
  loading?: boolean;
  /**
   * 状态切换事件
   * @param checked
   * @param event
   */
  onChange?: (checked: boolean, event: ChangeEvent) => void;
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  (props: SwitchProps, ref: ForwardedRef<HTMLLabelElement>): React.ReactElement => {
    const {
      size,
      className,
      inputRef,
      onChange,
      disabled,
      loading,
      defaultChecked,
      checked,
    } = props;
    const inputCheckedProps = {
      defaultChecked,
    };
    if (checked) set(inputCheckedProps, 'checked', checked);
    const otherProps = omit(props, [
      'className',
      'inputRef',
      'onChange',
      'size',
      'loading',
      'disabled',
      'defaultChecked',
      'checked',
    ]);

    const checkboxChange = (e: ChangeEvent<HTMLInputElement>) => {
      const isCheck = get(e, 'target.checked');
      if (isFunction(onChange)) {
        onChange(isCheck, e);
      } else {
        console.warn('switch props onChange is not a function');
      }
    };

    return (
      <label
        ref={ref}
        className={uniteClassNames(
          classes.root,
          classes.size(size),
          disabled || loading ? classes.disabled : '',
          className,
        )}
        {...otherProps}
      >
        <input
          className={classes.input}
          type="checkbox"
          ref={inputRef}
          onChange={checkboxChange}
          disabled={loading || disabled}
          {...inputCheckedProps}
        />
        <div className={classes.content}>
          <div className={classes.btn}>
            {loading ? <PrimaryLoadingSvg className={classes.loading} /> : null}
          </div>
        </div>
      </label>
    );
  },
);

Switch.defaultProps = {
  size: SwitchSize.DEFAULT,
  defaultChecked: false,
  disabled: false,
  inputRef: null,
  loading: false,
};

export default Switch;
