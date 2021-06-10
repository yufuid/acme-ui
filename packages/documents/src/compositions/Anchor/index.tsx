/**
 * MDX 页面锚点
 * */
import React from 'react';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import AnchorLess from './Anchor.less';

interface AnchorProps {
  anchors: { id: string; text: string }[];
}

interface AnchorState {
  right: null | number;
  isFixed: boolean;
  activeId: string;
}

class Anchor extends React.PureComponent<AnchorProps, AnchorState> {
  static scrollContainerId = 'document-scroll-container';

  static mdxWrapperId = 'document-mdx-wrapper-content';

  private fixedTop = 64;

  private scrollContainer: HTMLElement | null | undefined;

  private mdxWrapper: HTMLElement | null | undefined;

  private anchorPoint: HTMLElement | undefined;

  private isIE: boolean;

  private anchorPointers: (HTMLElement | null)[] = [];

  private toggleFixedWhenScroll = debounce(
    () => {
      // 只有IE 才有的操作
      const { top = 0 } = this.mdxWrapper?.getBoundingClientRect() || {};
      if (top < this.fixedTop) {
        this.setState({ isFixed: true });
      } else {
        this.setState({ isFixed: false });
      }
    },
    10,
    { trailing: true, leading: false },
  );

  private judgeWhichIsActive = throttle(() => {
    if (this.anchorPointers.length <= 0) return;
    const chHalf = document.body.clientHeight / 2;
    const anchorsTop: { id: string; top: number }[] = [];
    this.anchorPointers.forEach((dom) => {
      if (!dom) return;
      const { top } = dom.getBoundingClientRect();
      const id = dom.getAttribute('id');
      if (id) anchorsTop.push({ id, top });
    });

    // 取距离中间位置绝对值最小的
    let absMin: { id?: string; top?: number } = {};
    anchorsTop.forEach((a) => {
      if (absMin.top === undefined) absMin = a;
      if ((absMin.top as number) < 0 && a.top >= chHalf * 2) {
        return;
      }
      if (Math.abs(chHalf - a.top) < Math.abs(chHalf - (absMin.top as number))) {
        absMin = a;
      }
    });

    this.setState({
      activeId: absMin.id as string,
    });
  }, 200);

  public constructor(props: AnchorProps) {
    super(props);
    this.isIE = !!get(window, 'ActiveXObject') || 'ActiveXObject' in window;
    this.state = {
      right: null,
      isFixed: false,
      activeId: '',
    };
  }

  public componentDidMount() {
    this.scrollContainer = document.getElementById(Anchor.scrollContainerId);
    this.mdxWrapper = document.getElementById(Anchor.mdxWrapperId);

    const { anchors } = this.props;
    this.anchorPointers = anchors.map((anchor) => document.getElementById(anchor.id));
    if (!this.scrollContainer) return;
    this.judgeWhichIsActive();
    this.scrollContainer.addEventListener('scroll', this.judgeWhichIsActive);

    if (!this.mdxWrapper || !this.isIE) return;

    this.resizeRightWhenResize();
    this.toggleFixedWhenScroll();
    window.addEventListener('resize', this.resizeRightWhenResize);
    this.scrollContainer.addEventListener('scroll', this.toggleFixedWhenScroll);
  }

  public componentDidUpdate() {
    const { anchors } = this.props;
    this.anchorPointers = anchors.map((anchor) => document.getElementById(anchor.id));
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeRightWhenResize);
    this.scrollContainer?.removeEventListener('scroll', this.toggleFixedWhenScroll);
    this.scrollContainer?.removeEventListener('scroll', this.judgeWhichIsActive);
  }

  private resizeRightWhenResize = () => {
    const { right: contentRight = 0 } = this.mdxWrapper?.getBoundingClientRect() || {};
    const { right: wrapperRight = 0 } = this.scrollContainer?.getBoundingClientRect() || {};

    this.setState({ right: Math.max(wrapperRight - contentRight, 0) });
  };

  private redirectAnchor = (id: string) => {
    const point = document.getElementById(id);
    if (point) {
      this.setState({ activeId: id });
      point.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  };

  render(): React.ReactNode {
    const { anchors } = this.props;
    const { isFixed, right, activeId } = this.state;
    return (
      <aside
        ref={(ref: HTMLElement) => {
          this.anchorPoint = ref;
        }}
        className={`${AnchorLess.container} ${this.isIE ? AnchorLess.ie : ''}`}
        style={
          this.isIE && isFixed
            ? {
                position: 'fixed',
                top: this.fixedTop + 64,
                right: right || 0,
              }
            : {}
        }
      >
        <ul className={AnchorLess.inner}>
          {anchors.map((anchor) => {
            return (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                className={activeId === anchor.id ? AnchorLess.active : ''}
                key={anchor.id}
                onClick={() => this.redirectAnchor(anchor.id)}
              >
                {anchor.text}
              </li>
            );
          })}
        </ul>
      </aside>
    );
  }
}

export default Anchor;
