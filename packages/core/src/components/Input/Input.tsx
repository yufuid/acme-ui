import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';
import { SuccessSvg } from '../Icon/SuccessIcon';
import { PasswordOpenEyeSvg, PasswordCloseEyeSvg } from '../Icon/PasswordEyeIcon';
import { ClearSvg } from '../Icon/ClearIcon';
import { uniteClassNames } from '../../utils/tools';
import { InputMode, InputSize } from './types';
import './styles/Input.less';

type InputModeType = `${InputMode}`;
type InputSizeType = `${InputSize}`;

/** TODO 数字类型的input 待设计给出详细设计和样式 */

export interface IInputProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * input 类型 TODO 暂时没有样式变化
   */
  mode?: InputModeType;
  /**
   * 输入框大小
   */
  size?: InputSizeType;
  /**
   * 输入框值
   */
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  /**
   * 输入框默认值 非受控
   */
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>['defaultValue'];
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
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 输入框清空的回调
   */
  onClear?: () => void;
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
  loading: `${classNamePrefix}-loading`,
  loadingIcon: `${classNamePrefix}-loading-icon`,
  clear: `${classNamePrefix}-clear-icon`,
};

const Input: React.ForwardRefExoticComponent<IInputProps & React.RefAttributes<HTMLInputElement>> =
  React.forwardRef((props: IInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      className,
      placeholder,
      size,
      limit,
      error,
      defaultValue,
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
      clear,
      onClear,
      startElement,
      endElement,
      ...otherProps
    } = props;

    const [currentValue, setCurrentValue] = React.useState(defaultValue);
    React.useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    const [currentValueLen, setCurrentValueLen] = React.useState(0);
    const propValueLength = isString(value) ? value.length : 0;
    const [limitError, setLimitError] = React.useState(limit ? propValueLength > limit : false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const internalValue = get(e, 'target.value');
      const valueLength = isString(internalValue) ? internalValue.length : 0;
      setCurrentValueLen(valueLength);
      setCurrentValue(internalValue);
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

    const handleInputClear = () => {
      setCurrentValue('');
      if (isFunction(onChange)) {
        onChange();
      }
      if (isFunction(onClear)) {
        onClear();
      }
    };

    return (
      <div
        className={uniteClassNames(
          classes.root,
          isFocus ? classes.active : '',
          success ? classes.success : '',
          error || limitError ? classes.error : '',
          loading ? classes.loading : '',
          disabled ? classes.disabled : '',
          fullWidth ? classes.full : '',
          type === 'number' ? classes.number : '',
          className,
        )}
        style={style}
        data-testid="acme-input-root"
      >
        {startElement ? (
          <div className={`${classNamePrefix}-start-element`}>{startElement}</div>
        ) : null}
        <input
          className={uniteClassNames(classes.input, classes.size(size))}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          value={currentValue}
          type={type === 'password' ? passwordType : type}
          {...otherProps}
          ref={ref}
        />
        {clear ? (
          <ClearSvg
            className={uniteClassNames(
              classes.clear,
              currentValue ? `${classNamePrefix}-clear-appear` : '',
            )}
            onClick={handleInputClear}
          />
        ) : null}
        {limit ? (
          <div
            className={uniteClassNames(
              `${classNamePrefix}-limit`,
              limitError ? `${classNamePrefix}-limit-error` : '',
            )}
          >{`${currentValueLen}/${limit}`}</div>
        ) : null}
        {success ? <SuccessSvg /> : null}
        {loading ? <PrimaryLoadingSvg className={classes.loadingIcon} /> : null}
        {type === 'password' ? (
          <span className={`${classNamePrefix}-password-icon`} onClick={handlePasswordVisible}>
            {isPassword ? <PasswordOpenEyeSvg /> : <PasswordCloseEyeSvg />}
          </span>
        ) : null}
        {endElement ? <div className={`${classNamePrefix}-end-element`}>{endElement}</div> : null}
      </div>
    );
  });

Input.defaultProps = {
  defaultValue: '',
  value: '',
  size: 'default',
  type: 'text',
};
export default Input;
