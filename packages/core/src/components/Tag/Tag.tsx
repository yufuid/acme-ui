import React, { ForwardedRef, useState } from 'react';
import isFunction from 'lodash/isFunction';
import { TagMode } from './types';

import './sytle/tag.less';
import { uniteClassNames } from '../../utils/tools';
import DeleteSvg from '../Icon/Delete';

const classNamePrefix = 'acme-tag';

export const classes = {
  root: `${classNamePrefix}`,
  appearance: (mode: TagProps['mode']) => `${classNamePrefix}-${mode}`,
  closeIcon: `${classNamePrefix}-close-icon`,
  visible: `${classNamePrefix}-visible`,
};

type TTagMode = `${TagMode}`;

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * tag 文字颜色
   */
  color?: string;
  /**
   * tag 背景颜色
   */
  backgroundColor?: string;
  /**
   * tag 的模式 圆角或方形
   */
  mode?: TTagMode;
  /**
   * 标签是否可以关闭
   */
  closable?: boolean;
  /**
   * 关闭事件
   */
  onClose?: (e: React.MouseEvent) => void;
  /**
   * 组件样式
   */
  className?: string;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (props: TagProps, ref: ForwardedRef<HTMLSpanElement>) => {
    const { color, backgroundColor, mode, closable, style, children, className, ...resetProps } =
      props;

    const [visible, setVisible] = useState(false);

    const onCloseClick = (e: React.MouseEvent) => {
      const { onClose } = props;
      if (isFunction(onClose)) {
        onClose(e);
      }
      setVisible(true);
      e.stopPropagation();
    };

    const closeIcon = (): React.ReactNode => {
      return (
        <span className={classes.closeIcon} onClick={onCloseClick}>
          <DeleteSvg />
        </span>
      );
    };

    return (
      <span
        ref={ref}
        className={uniteClassNames(
          classes.root,
          classes.appearance(mode),
          visible ? classes.visible : '',
          className,
        )}
        style={{
          color,
          backgroundColor,
          ...style,
        }}
        {...resetProps}
      >
        {children || null}
        {closable ? closeIcon() : null}
      </span>
    );
  },
);

Tag.defaultProps = {
  color: '#0043CE',
  backgroundColor: '#D0E2FF',
  mode: TagMode.DEFAULT,
  closable: false,
};

export default Tag;
