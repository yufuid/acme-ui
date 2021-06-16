import * as React from 'react';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import set from 'lodash/set';
import { uniteClassNames } from '../../utils/tools';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';

import './style/switch.less';

const classNamePrefix = 'acme-switch';

export const classes = {
  root: classNamePrefix,
  size: (size: SwitchProps['size']): string => `${classNamePrefix}-${size}`,
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
   * Switch 大小
   */
  size?: TSwitchSize;
  /**
   * 当前是否选中
   */
  checked?: boolean;
  /**
   * 默认选中状态
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 真实的input元素
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * 是否处于加载状态
   */
  loading?: boolean;
  /**
   * 状态切换事件
   * @param checked
   * @param event
   */
  onChange?: (event: React.ChangeEvent) => void;
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  (props: SwitchProps, ref: React.ForwardedRef<HTMLLabelElement>): React.ReactElement => {
    const { size, className, inputRef, onChange, disabled, loading, defaultChecked, checked } =
      props;
    const inputCheckedProps = {
      defaultChecked,
    };
    if (checked) {
      set(inputCheckedProps, 'checked', checked);
      delete inputCheckedProps.defaultChecked;
    }
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isFunction(onChange)) {
        onChange(e);
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
          onChange={handleInputChange}
          disabled={loading || disabled}
          {...inputCheckedProps}
        />
        <span className={classes.content}>
          <span className={classes.btn}>
            {loading ? <PrimaryLoadingSvg className={classes.loading} /> : null}
          </span>
        </span>
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
