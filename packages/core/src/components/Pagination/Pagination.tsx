import React from 'react';
import { get, isFunction, isNumber } from 'lodash-es';
import { getPages, IPageItem, PageItemType } from './paginationUtil';
import Arrow from './Arrow';
import DoubleArrow from './DoubleArrow';
import Input from './Input';
import Select from './Select';
import './style/pagination.less';

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
enum PaginationType {
  DEFAULT = 'default',
  MINI = 'mini',
  SIMPLE = 'simple',
}

type TPaginationType = `${PaginationType}`;

export interface PaginationProps {
  /**
   *  分页器的类型
   * @default default
   *  */
  type: TPaginationType;
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
   * */
  current?: number;
  /**
   * 默认的当前页
   * @default 1
   * */
  defaultCurrent: number;
  /**
   * 每页的条数
   * */
  pageSize?: number;
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
  showPageSize: boolean;
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

interface PaginationState {
  totalPage: number;
  jumpPage: string;
  defaultPage: number;
  defaultSize: number;
}

class Pagination extends React.PureComponent<PaginationProps, PaginationState> {
  static defaultProps = {
    type: 'default',
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
    defaultCurrent: 1,
    defaultPageSize: 10,
    showPageSize: false,
    showTotal: false,
    showJump: false,
  };

  constructor(props: PaginationProps) {
    super(props);
    const { total, pageSize, defaultCurrent, current, defaultPageSize } = props;
    const totalPage = Math.ceil(total / (pageSize || defaultPageSize));
    this.state = {
      totalPage,
      jumpPage: '',
      defaultPage: current || defaultCurrent,
      defaultSize: pageSize || defaultPageSize,
    };
  }

  componentDidMount() {
    const { current, onChange, pageSize, onPageSizeChange } = this.props;
    if (current && !onChange) {
      console.warn(
        `The component is currently a controlled component. Current should be modified using onChange props`,
      );
    }
    if (pageSize && !onPageSizeChange) {
      console.warn(
        `The component is currently a controlled component. pageSize should be modified using onPageSizeChange props`,
      );
    }
  }

  componentDidUpdate(prevProps: PaginationProps) {
    const { total, current, pageSize } = this.props;
    if (total !== get(prevProps, 'total')) {
      this.updateTotalPage();
    }
    if (current !== get(prevProps, 'current')) {
      this.updateDefaultPage();
    }
    if (pageSize !== get(prevProps, 'pageSize')) {
      this.updateDefaultSize();
    }
  }

  private updateDefaultSize = () => {
    const { pageSize } = this.props;
    const size = Number(pageSize);
    if (pageSize && isNumber(size)) {
      this.setState(
        {
          defaultSize: size,
        },
        this.updateTotalPage,
      );
    } else {
      console.error(pageSize, `pageSize value is not number ${isNumber(pageSize)}`);
    }
  };

  private updateDefaultPage = () => {
    const { current } = this.props;
    const page = Number(current);
    if (current && isNumber(page)) {
      this.setState({
        defaultPage: page,
      });
    } else {
      console.error(current, `current value is not number`);
    }
  };

  private updateTotalPage = () => {
    const { total } = this.props;
    const { defaultPage, defaultSize } = this.state;
    const totalPage = Math.ceil(total / defaultSize);
    const newCurrent = defaultPage > totalPage ? totalPage : defaultPage;
    this.setState({
      totalPage,
    });
    this.pageChange(newCurrent);
  };

  private decreasePage = () => {
    const { defaultPage } = this.state;
    if (defaultPage <= 1) return;
    const page = defaultPage - 1;
    this.pageChange(page);
  };

  private increasePage = () => {
    const { defaultPage } = this.state;
    const { totalPage } = this.state;
    if (defaultPage >= totalPage) return;
    const page = defaultPage + 1;
    this.pageChange(page);
  };

  private pageChange = (page: number) => {
    const { onChange, current } = this.props;
    if (!current) {
      this.setState({
        defaultPage: page,
      });
    }
    if (isFunction(onChange)) {
      onChange(page);
    }
  };

  private stepPage = (type: string) => {
    const { defaultPage } = this.state;
    const page = type === PageItemType.LEFTMORE ? defaultPage - 3 : defaultPage + 3;
    this.pageChange(page);
  };

  private jumpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = get(e, 'target.value');
    this.setState({
      jumpPage: value,
    });
  };

  private quickJumpPage = () => {
    const { totalPage, jumpPage } = this.state;
    const value = Number(jumpPage);
    if (isNumber(value) && value > 0 && value <= totalPage) {
      this.pageChange(value);
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
    const { onPageSizeChange, pageSize } = this.props;
    const size: number = value;
    if (!pageSize) {
      this.setState(
        {
          defaultSize: size,
        },
        this.updateTotalPage,
      );
    }
    if (isFunction(onPageSizeChange)) {
      onPageSizeChange(value);
    }
  };

  private renderTotal = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
    const { total } = this.props;
    const totalClassNames = classes[type];
    return (
      <li className={`${classes.pageItem} ${totalClassNames.total}`}>
        <span className={classes.text}>共{total}条</span>
      </li>
    );
  };

  private renderSizeOptions = (): React.ReactNode => {
    const { pageSizeOptions } = this.props;
    const { defaultSize } = this.state;
    const selectOptions = pageSizeOptions.map((item: number) => ({
      label: `${item}条/页`,
      value: item,
    }));
    return (
      <li className={classes.pageItem}>
        <Select value={defaultSize} options={selectOptions} onChange={this.pageSizeChange} />
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

  private renderLeftArrow = (
    type: PaginationType.MINI | PaginationType.DEFAULT,
  ): React.ReactNode => {
    const { defaultPage } = this.state;
    const contentClasses = classes[type];
    return (
      <div
        className={`${contentClasses.item} ${defaultPage <= 1 ? contentClasses.disabled : ''}`}
        onClick={() => {
          this.decreasePage();
        }}
      >
        <Arrow
          className={`${contentClasses.arrow} ${contentClasses.leftBtn} ${
            defaultPage <= 1 ? contentClasses.arrowDisabled : ''
          }`}
        />
      </div>
    );
  };

  private renderRightArrow = (
    type: PaginationType.MINI | PaginationType.DEFAULT,
  ): React.ReactNode => {
    const { totalPage, defaultPage } = this.state;
    const contentClasses = classes[type];
    return (
      <div
        className={`${contentClasses.item} ${
          defaultPage >= totalPage ? contentClasses.disabled : ''
        }`}
        onClick={() => {
          this.increasePage();
        }}
      >
        <Arrow
          className={`${contentClasses.arrow} ${contentClasses.rightBtn} ${
            defaultPage >= totalPage ? contentClasses.arrowDisabled : ''
          }`}
        />
      </div>
    );
  };

  private renderContent = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
    const { totalPage, defaultPage } = this.state;
    const contentClasses = classes[type];
    const paginationItems = getPages(totalPage, defaultPage, PAGE_ITEM_SIZE);
    return (
      <>
        <li className={classes.pageItem}>{this.renderLeftArrow(type)}</li>
        {paginationItems.map((item: IPageItem, index: number) => {
          const key = `acme-page-item-${index}`;
          return (
            <li className={classes.pageItem} key={key}>
              {item.type === PageItemType.PAGE ? (
                <div
                  className={`${contentClasses.item} ${
                    item.val === defaultPage ? contentClasses.active : ''
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
                      this.stepPage(item.type);
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
        <li className={classes.pageItem}>{this.renderRightArrow(type)}</li>
      </>
    );
  };

  private renderDefault = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
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
    const { totalPage, defaultPage } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.pageItem}>{this.renderLeftArrow(PaginationType.MINI)}</div>
        <span className={classes.simple.container}>
          <span className={`${classes.simple.text} ${classes.simple.active}`}>{defaultPage}</span>/
          <span className={classes.simple.text}>{totalPage}</span>
        </span>
        <div className={classes.pageItem}>{this.renderRightArrow(PaginationType.MINI)}</div>
      </div>
    );
  };

  private renderPagination = (): React.ReactNode => {
    const { type } = this.props;
    switch (type) {
      case 'default':
        return this.renderDefault(PaginationType.DEFAULT);
      case 'mini':
        return this.renderDefault(PaginationType.MINI);
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

export default Pagination;
