import React from 'react';
import { get, isFunction, isNumber } from 'lodash-es';
import { getPages, IPageItem, PageItemType } from './paginationUtil';
import Arrow from './Arrow';
import DoubleArrow from './DoubleArrow';

import './style/pagination.less';
import Input from './Input';
import Select from './Select';

const classNamePrefix = 'acme-pagination';

export const classes = {
  root: classNamePrefix,
  text: `${classNamePrefix}-text`,
  pageContent: `${classNamePrefix}-content`,
  pageItem: `${classNamePrefix}-item`,
  dotGroup: `${classNamePrefix}-dot-group`,
  doubleArrow: `${classNamePrefix}-doubleArrow`,
  leftDoubleArrow: `${classNamePrefix}-left-doubleArrow`,
  rightDoubleArrow: `${classNamePrefix}-right-doubleArrow`,
  jumpInput: `${classNamePrefix}-jumpInput`,
  default: {
    item: `${classNamePrefix}-item-default`,
    active: `${classNamePrefix}-item-default-active`,
    disabled: `${classNamePrefix}-item-default-disabled`,
    more: `${classNamePrefix}-item-default-more`,
    arrow: `${classNamePrefix}-default-arrow`,
    leftBtn: `${classNamePrefix}-default-left-button`,
    rightBtn: `${classNamePrefix}-default-right-button`,
    arrowDisabled: `${classNamePrefix}-default-arrow-disabled`,
    dot: `${classNamePrefix}-default-dot`,
    total: `${classNamePrefix}-default-total`,
  },
  mini: {
    item: `${classNamePrefix}-item-mini`,
    active: `${classNamePrefix}-item-mini-active`,
    disabled: `${classNamePrefix}-item-mini-disabled`,
    more: `${classNamePrefix}-item-mini-more`,
    arrow: `${classNamePrefix}-mini-arrow`,
    leftBtn: `${classNamePrefix}-mini-left-button`,
    rightBtn: `${classNamePrefix}-mini-right-button`,
    arrowDisabled: `${classNamePrefix}-mini-arrow-disabled`,
    dot: `${classNamePrefix}-mini-dot`,
    total: `${classNamePrefix}-mini-total`,
  },
  simple: {
    container: `${classNamePrefix}-simple-container`,
    text: `${classNamePrefix}-simple-text`,
    active: `${classNamePrefix}-simple-active`,
  },
};

const PAGE_ITEM_SIZE = 7;

export interface PaginationProps {
  /**
   *  分页器的类型
   * @default default
   *  */
  type: 'default' | 'mini' | 'simple';
  /**
   * 总数
   * @default 0
   * */
  total: number;
  /**
   * 是否展示 总数
   * @default false
   * */
  showTotal: boolean;
  /**
   * 当前页
   * @default 1
   * */
  current: number;
  /**
   * 默认的当前页
   * @default 1
   * */
  defaultCurrent: number;
  /**
   * 每页的条数
   * @default 10
   * */
  pageSize: number;
  /**
   * 默认的每页的条数
   * @default 10
   */
  defaultPageSize: number;
  /**
   * 每页条数的选择范围
   * @default [10, 20, 50, 100]
   * */
  pageSizeOptions: number[];
  /** page 发生变化 */
  onChange?: (page: number) => void;
  /**
   * 是否展示 pageSize 选择器
   * @default false
   * */
  showPageSize?: boolean;
  /** 切换 pageSize */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * 是否展示快速跳转
   * @default false
   * */
  showJump: boolean;
  /** 最外层容器的 className */
  className?: string;
}

interface IPaginationProps extends PaginationProps {
  forwardedRef: any;
}

interface PaginationState {
  totalPage: number;
  jumpPage: string;
}

class Pagination extends React.PureComponent<IPaginationProps, PaginationState> {
  static defaultProps = {
    type: 'default',
    total: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    current: 1,
    showPageSize: false,
    showTotal: false,
    showJump: false,
  };

  constructor(props: IPaginationProps) {
    super(props);
    const { total, pageSize } = props;
    this.state = {
      totalPage: Math.ceil(total / pageSize),
      jumpPage: '',
    };
  }

  componentDidUpdate(prevProps: PaginationProps) {
    const { total, pageSize } = this.props;
    if (total !== get(prevProps, 'total') || pageSize !== get(prevProps, 'pageSize')) {
      this.updateTotalPage();
    }
  }

  private decreasePage = () => {
    const { current } = this.props;
    if (current === 1) return;
    const page = current - 1;
    this.pageChange(page);
  };

  private increasePage = () => {
    const { current } = this.props;
    const { totalPage } = this.state;
    if (current === totalPage) return;
    const page = current + 1;
    this.pageChange(page);
  };

  private updateTotalPage = () => {
    const { total, pageSize, current, onChange } = this.props;
    const totalPage = Math.ceil(total / pageSize);
    const newCurrent = current > totalPage ? totalPage : current;
    this.setState({
      totalPage,
    });
    if (isFunction(onChange)) {
      onChange(newCurrent);
    }
  };

  private pageChange = (page: number) => {
    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange(page);
    }
  };

  private jumpPage = (type: string) => {
    const { onChange, current } = this.props;
    const page = type === PageItemType.LEFTMORE ? current - 3 : current + 3;
    if (isFunction(onChange)) {
      onChange(page);
    }
  };

  private jumpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = get(e, 'target.value');
    this.setState({
      jumpPage: value,
    });
  };

  private quickJumpPage = () => {
    const { onChange } = this.props;
    const { totalPage, jumpPage } = this.state;
    const value = Number(jumpPage);
    if (isFunction(onChange) && isNumber(value) && value > 0 && value <= totalPage) {
      onChange(value);
    }
    this.setState({
      jumpPage: '',
    });
  };

  private quickJumpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = get(e, 'keyCode');
    if (keyCode === 13) {
      this.quickJumpPage();
    }
  };

  private pageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>, value: any) => {
    const { onPageSizeChange } = this.props;
    if (isFunction(onPageSizeChange)) {
      onPageSizeChange(value);
    }
  };

  private renderTotal = (type: 'mini' | 'default'): React.ReactNode => {
    const { total } = this.props;
    const totalClassNames = classes[type];
    return (
      <li className={`${classes.pageItem} ${totalClassNames.total}`}>
        <span className={classes.text}>共{total}条</span>
      </li>
    );
  };

  private renderSizeOptions = (): React.ReactNode => {
    const { pageSizeOptions, pageSize } = this.props;
    const selectOptions = pageSizeOptions.map((item: number) => ({
      label: `${item}条/页`,
      value: item,
    }));
    return (
      <li className={classes.pageItem}>
        <Select value={pageSize} options={selectOptions} onChange={this.pageSizeChange} />
      </li>
    );
  };

  private renderJumpBtn = (): React.ReactNode => {
    const { jumpPage } = this.state;
    return (
      <li className={classes.pageItem}>
        <div>
          跳转
          <Input
            value={jumpPage}
            onBlur={this.quickJumpPage}
            onKeyDown={this.quickJumpKeyDown}
            className={classes.jumpInput}
            onChange={this.jumpInputChange}
          />
          页
        </div>
      </li>
    );
  };

  private renderContent = (type: 'mini' | 'default'): React.ReactNode => {
    const { current } = this.props;
    const { totalPage } = this.state;
    const contentClasses = classes[type];
    const paginationItems = getPages(totalPage, current, PAGE_ITEM_SIZE);
    return (
      <>
        <li className={classes.pageItem}>
          <div
            className={`${contentClasses.item} ${current === 1 ? contentClasses.disabled : ''}`}
            onClick={() => {
              this.decreasePage();
            }}
          >
            <Arrow
              className={`${contentClasses.arrow} ${contentClasses.leftBtn} ${
                current === 1 ? contentClasses.arrowDisabled : ''
              }`}
            />
          </div>
        </li>
        {paginationItems.map((item: IPageItem, index: number) => {
          const key = `acme-page-item-${index}`;
          return (
            <li className={classes.pageItem} key={key}>
              {item.type === PageItemType.PAGE ? (
                <div
                  className={`${contentClasses.item} ${
                    item.val === current ? contentClasses.active : ''
                  }`}
                  onClick={() => {
                    if (item.type === PageItemType.PAGE) this.pageChange(item.val as number);
                  }}
                >
                  {item.val}
                </div>
              ) : (
                <div className={`${contentClasses.item} ${contentClasses.more}`}>
                  <span className={classes.dotGroup}>
                    <span className={contentClasses.dot} />
                    <span className={contentClasses.dot} />
                    <span className={contentClasses.dot} />
                  </span>
                  <div
                    className={classes.doubleArrow}
                    onClick={() => {
                      this.jumpPage(item.type);
                    }}
                  >
                    <DoubleArrow
                      className={
                        item.type === PageItemType.LEFTMORE
                          ? classes.leftDoubleArrow
                          : classes.rightDoubleArrow
                      }
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
        <li className={classes.pageItem}>
          <div
            className={`${contentClasses.item} ${
              current === totalPage ? contentClasses.disabled : ''
            }`}
            onClick={() => {
              this.increasePage();
            }}
          >
            <Arrow
              className={`${contentClasses.arrow} ${contentClasses.rightBtn} ${
                current === totalPage ? contentClasses.arrowDisabled : ''
              }`}
            />
          </div>
        </li>
      </>
    );
  };

  private renderDefault = (type: 'mini' | 'default'): React.ReactNode => {
    const { showPageSize, showTotal, showJump } = this.props;
    return (
      <div className={classes.root}>
        <ul className={classes.pageContent}>
          {showTotal ? this.renderTotal(type) : null}
          {this.renderContent(type)}
          {showPageSize ? this.renderSizeOptions() : null}
          {showJump ? this.renderJumpBtn() : null}
        </ul>
      </div>
    );
  };

  private renderSimple = (): React.ReactNode => {
    const { current } = this.props;
    const { totalPage } = this.state;
    return (
      <div className={classes.root}>
        <div
          className={`${classes.pageItem} ${classes.mini.item} ${
            current === 1 ? classes.mini.disabled : ''
          }`}
          onClick={() => {
            this.decreasePage();
          }}
        >
          <Arrow
            className={`${classes.mini.leftBtn} ${
              current === 1 ? classes.mini.arrowDisabled : classes.mini.arrow
            }`}
          />
        </div>
        <span className={classes.simple.container}>
          <span className={`${classes.simple.text} ${classes.simple.active}`}>{current}</span>/
          <span className={classes.simple.text}>{totalPage}</span>
        </span>
        <div
          className={`${classes.pageItem} ${classes.mini.item} ${
            current === totalPage ? classes.mini.disabled : ''
          }`}
          onClick={() => {
            this.increasePage();
          }}
        >
          <Arrow
            className={`${classes.mini.rightBtn} ${
              current === totalPage ? classes.mini.arrowDisabled : classes.mini.arrow
            }
            `}
          />
        </div>
      </div>
    );
  };

  private renderPagination = (): React.ReactNode => {
    const { type } = this.props;
    switch (type) {
      case 'default':
        return this.renderDefault('default');
      case 'mini':
        return this.renderDefault('mini');
      case 'simple':
        return this.renderSimple();
      default:
        return null;
    }
  };

  public render(): React.ReactNode {
    return this.renderPagination();
  }
}

export default React.forwardRef((props: PaginationProps, ref) => {
  return <Pagination {...props} forwardedRef={ref} />;
});
