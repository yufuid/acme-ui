import React from 'react';
import { omit, toArray, isString, isArray } from 'lodash-es';
import ButtonGroup from './ButtonGroup';
import './style/Button.less';

export enum ButtonMode {
  CONTAINED = 'contained',
  OUTLINED = 'outlined',
  MINIMAL = 'minimal',
}

export enum ButtonColor {
  PRIMARY = 'primary',
  DANGER = 'danger',
}

export enum ButtonSize {
  DEFAULT = 'default',
  LARGE = 'large',
  SMALL = 'small',
}

export interface IButtonProps {
  className?: string;
  children: React.ReactNode;
  mode?: ButtonMode;
  color?: ButtonColor;
  size?: ButtonSize;
  ghost?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface ISvgProps {
  size?: number;
}

// 当前loading的svg是个渐变色，所以不好直接使用fill来填充色值，所以判断类型吧
const PrimaryLoadingSvg = (props: ISvgProps) => {
  const { size } = props;
  const svgSize = size || 16;
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.96942 15.9999C7.97961 16 7.98981 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0V2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14V15.9999H7.96942Z"
        fill="url(#paint0_linear_primary)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16V14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2V0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
        fill="url(#paint1_linear_primary)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_primary"
          x1="8"
          y1="16"
          x2="8"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9D9DF8" />
          <stop offset="1" stopColor="#3939FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_primary"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3A3AFF" />
          <stop offset="1" stopColor="#A8A8F7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const WhiteLoadingSvg = (props: ISvgProps) => {
  const { size } = props;
  const svgSize = size || 16;
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.96973 15.9999C7.97992 16 7.99012 16 8.00031 16C12.4186 16 16.0003 12.4183 16.0003 8C16.0003 3.58172 12.4186 0 8.00031 0V2C11.314 2 14.0003 4.68629 14.0003 8C14.0003 11.3137 11.314 14 8.00031 14V15.9999H7.96973Z"
          fill="url(#paint0_linear)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 16V14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2V0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
          fill="url(#paint1_linear)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="8.00031"
          y1="16"
          x2="8.00031"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const classNamePrefix = 'acme-btn';

export const uniteClassNames = (...args: (string | undefined)[]): string => {
  const classNames = toArray(args).filter((className) => {
    return isString(className) && !!className;
  });
  return isArray(classNames) ? classNames.join(' ').trim() : '';
};

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
    startIcon,
    endIcon,
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
    'startIcon',
    'endIcon',
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
      {loading ? (
        <div className={`${classNamePrefix}-loading-svg`}>
          <LoadingSvg />
        </div>
      ) : null}
      {startIcon}
      {children}
      {endIcon}
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
  startIcon: null,
  endIcon: null,
  onClick: () => {},
};
export default Button;
