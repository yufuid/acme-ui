import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';
import { uniteClassNames } from '../../utils/tools';
import { InputMode, InputSize } from './types';
import './styles/Input.less';

type InputModeType = `${InputMode}`;
type InputSizeType = `${InputSize}`;

export interface IInputProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * input 类型
   */
  mode?: InputModeType;
  /**
   * 输入框大小
   */
  size?: InputSizeType;
  /**
   * 输入框值
   */
  value?: string;
  /**
   * 输入框默认值 非受控
   */
  defaultValue?: string;
  /**
   * 输入框内容提示
   */
  placeholder?: string;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 错误状态
   */
  error?: boolean;
  /**
   * 成功态
   */
  success?: boolean;
  /**
   * 输入框内是否展示loading状态
   */
  loading?: boolean;
  /**
   * 是否撑满父元素
   */
  fullWidth?: boolean;
  /**
   * input内部最前面的元素
   */
  startElement?: React.ReactNode;
  /**
   * input内部最后面的元素
   */
  endElement?: React.ReactNode;
  /**
   * 输入框内容变化时的回调
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 输入框字数限制
   */
  limit?: number;
  /**
   * 是否展示清空按钮
   */
  clear?: boolean;
  /**
   * 输入框获得焦点的回调
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * 输入框失去焦点的回调
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * 输入框类型
   */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /**
   * 输入框最外层样式
   */
  style?: React.HtmlHTMLAttributes<HTMLDivElement>['style'];
}

const classNamePrefix = 'acme-input';

export const classes = {
  root: `${classNamePrefix}-root`,
  input: `${classNamePrefix}`,
  active: `${classNamePrefix}-active`,
  size: (size: IInputProps['size']) => `${classNamePrefix}-${size}`,
  error: `${classNamePrefix}-error`,
  success: `${classNamePrefix}-success`,
  disabled: `${classNamePrefix}-disabled`,
  full: `${classNamePrefix}-full`,
  number: `${classNamePrefix}-number`,
  loading: `${classNamePrefix}-loading-icon`,
};

const Input = React.forwardRef((props: IInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    placeholder,
    size,
    limit,
    error,
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    fullWidth,
    type,
    success,
    style,
    loading,
    startElement,
    endElement,
    ...otherProps
  } = props;

  const [currentValue, setCurrentValue] = React.useState(0);
  const propValueLength = isString(value) ? value.length : 0;
  const [limitError, setLimitError] = React.useState(limit ? propValueLength > limit : false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const internalValue = get(e, 'target.value');
    const valueLength = isString(internalValue) ? internalValue.length : 0;
    setCurrentValue(valueLength);
    if (limit) {
      setLimitError(valueLength > limit);
    }
    if (isFunction(onChange)) {
      onChange(e);
    }
  };

  const [isFocus, setIsFocus] = React.useState(false);
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isFunction(onFocus)) {
      onFocus(e);
    }
    setIsFocus(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isFunction(onBlur)) {
      onBlur(e);
    }
    setIsFocus(false);
  };

  const [isPassword, setIsPassword] = React.useState(!!(type === 'password'));
  const handlePasswordVisible = () => {
    setIsPassword(!isPassword);
  };
  const passwordType = isPassword ? 'password' : 'text';

  return (
    <div
      className={uniteClassNames(
        classes.root,
        isFocus ? classes.active : '',
        success ? classes.success : '',
        error || limitError ? classes.error : '',
        disabled ? classes.disabled : '',
        fullWidth ? classes.full : '',
        type === 'number' ? classes.number : '',
        className,
      )}
      style={style}
      data-testid="input-root"
    >
      {startElement ? <div className={`${className}-start-element`}>{startElement}</div> : null}
      <input
        className={uniteClassNames(classes.input, classes.size(size))}
        ref={ref}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        value={value}
        type={type === 'password' ? passwordType : type}
        {...otherProps}
        data-testid="input"
      />
      {limit ? (
        <div className={`${classNamePrefix}-limit`}>{`${currentValue}/${limit}`}</div>
      ) : null}
      {success ? <div className={`${classNamePrefix}-success-icon`}>V</div> : null}
      {loading ? <PrimaryLoadingSvg className={`${classNamePrefix}-loading-icon`} /> : null}
      {type === 'password' ? (
        <div className={`${classNamePrefix}-password-icon`} onClick={handlePasswordVisible}>
          {/** 需要替换文案为icon */}
          {isPassword ? '睁眼' : '不睁眼'}
        </div>
      ) : null}
      {endElement ? <div className={`${className}-end-element`}>{endElement}</div> : null}
    </div>
  );
});

Input.defaultProps = {
  size: 'default',
  type: 'text',
};
export default Input;
