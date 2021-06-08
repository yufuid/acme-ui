import React from 'react';
import { omit } from 'lodash-es';
import { uniteClassNames } from '../../utils/tools';
import ButtonGroup from './ButtonGroup';
import { WhiteLoadingSvg, PrimaryLoadingSvg } from '../Icon/LoadingIcon';
import { ButtonMode, ButtonColor, ButtonSize } from './types';
import './style/Button.less';

type ButtonModeType = `${ButtonMode}`;
type ButtonColorType = `${ButtonColor}`;
type ButtonSizeType = `${ButtonSize}`;

export interface IButtonProps {
  className?: string;
  children: React.ReactNode;
  /**
   * 按钮形态 - 实心按钮、线框按钮、无底色按钮
   * @default contained
   */
  mode?: ButtonModeType;
  /**
   * 按钮颜色 - 主色、红色
   * @default primary
   */
  color?: ButtonColorType;
  /**
   * 按钮大小
   * @default default
   */
  size?: ButtonSizeType;
  /**
   * 是否为幽灵按钮
   * @default false
   */
  ghost?: boolean;
  /**
   * 按钮是否不可用
   * @default false
   */
  disabled?: boolean;
  /**
   * 按钮是否正在加载...
   * @default false
   */
  loading?: boolean;
  /**
   * 按钮是否与父元素同宽
   * @default false
   */
  fullWidth?: boolean;
  /**
   * 按钮前端的展示元素
   * @default null
   */
  startElement?: React.ReactNode;
  /**
   * 按钮后端的展示元素
   * @default null
   */
  endElement?: React.ReactNode;
  /**
   * 按钮点击事件
   * @default () => {}
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const classNamePrefix = 'acme-btn';

export const classes = {
  base: classNamePrefix,
  appearance: (mode: IButtonProps['mode'], color: IButtonProps['color']): string =>
    `${classNamePrefix}-${mode}-${color}`,
  size: (size: IButtonProps['size']): string => `${classNamePrefix}-${size}`,
  ghost: (mode: IButtonProps['mode']): string => `${classNamePrefix}-${mode}-ghost`,
  loading: `${classNamePrefix}-loading`,
  disabled: `${classNamePrefix}-disabled`,
  full: `${classNamePrefix}-full`,
};

const Button = React.forwardRef((props: IButtonProps, ref: any) => {
  const {
    children,
    startElement,
    endElement,
    loading,
    mode,
    color,
    size,
    disabled,
    ghost,
    fullWidth,
    className,
  } = props;

  const LoadingSvg = mode === ButtonMode.CONTAINED ? WhiteLoadingSvg : PrimaryLoadingSvg;

  const otherProps = omit(props, [
    'className',
    'children',
    'mode',
    'color',
    'size',
    'ghost',
    'disabled',
    'loading',
    'fullWidth',
    'startElement',
    'endElement',
  ]);

  return (
    <button
      className={uniteClassNames(
        classes.base,
        classes.appearance(mode, color),
        classes.size(size),
        ghost ? classes.ghost(mode) : '',
        loading ? classes.loading : '',
        disabled ? classes.disabled : '',
        fullWidth ? classes.full : '',
        className,
      )}
      ref={ref}
      type="button"
      disabled={disabled || loading}
      {...otherProps}
    >
      {loading ? <LoadingSvg className={`${classNamePrefix}-loading-svg`} /> : null}
      {startElement}
      {children}
      {endElement}
    </button>
  );
}) as React.ForwardRefExoticComponent<IButtonProps & React.RefAttributes<unknown>> & {
  Group: typeof ButtonGroup;
};

Button.Group = ButtonGroup;
Button.defaultProps = {
  className: '',
  children: null,
  mode: ButtonMode.CONTAINED,
  color: ButtonColor.PRIMARY,
  size: ButtonSize.DEFAULT,
  ghost: false,
  disabled: false,
  loading: false,
  fullWidth: false,
  startElement: null,
  endElement: null,
  onClick: () => {},
};
export default Button;
