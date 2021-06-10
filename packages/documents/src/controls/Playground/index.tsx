/**
 * MDX Playground 代码操作区域
 * */

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, react/no-did-update-set-state */

import React from 'react';
import { Language, PrismTheme } from 'prism-react-renderer';
import { LiveProvider, LiveError } from 'react-live';
import { mdx } from '@mdx-js/react';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import isEqual from 'lodash/isEqual';
import copy from 'copy-text-to-clipboard';
import CustomLiveEditor from './CustomLiveEditor';
import CustomPreview, { ResetComProps, ComProps } from './CustomPreview';
import { theme } from '../Code';
import { resetCodePlaceholder } from './utils';
import PlaygroundLess from './Playground.less';
import { renderChecker } from './Checker';
import { renderCheckbox } from './Checkbox';

interface Props {
  hideCode?: boolean;
  __code: string;
  __scope: Record<string, any>;
  __position: number;
  language?: Language;
  links: Partial<{
    codeSandbox: string;
    codePen: string;
    stackblitz: string;
  }>;
  /** 替换 组件属性的占位符, 同时需要传入的组件代码中包含占位符 */
  placeholder: string;
  /** 组件占位符默认会替换为的属性 */
  defaultComProps: ComProps;
  headWrapper?: (comProps: ComProps, reset: ResetComProps) => React.ReactNode;
  asideWrapper?: (comProps: ComProps, reset: ResetComProps) => React.ReactNode;
}

interface State {
  expand: boolean;
  currentComProps: ComProps;
  displayCode: string;
}

const transformCode = (code: string) => {
  if (code.startsWith('()') || code.startsWith('class')) return code;
  return `<React.Fragment>${code}</React.Fragment>`;
};

class Playground extends React.PureComponent<Props, State> {
  static renderChecker = renderChecker;

  static renderCheckbox = renderCheckbox;

  static defaultProps = {
    language: 'jsx',
    __code: '',
    __scope: {},
    __position: 0,
    links: {},
    placeholder: 'data-mark',
  };

  private editContainer: HTMLDivElement | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      expand: false,
      displayCode: props.__code,
      currentComProps: props.defaultComProps,
    };
  }

  public componentDidMount() {
    const { __code, placeholder } = this.props;
    const { currentComProps } = this.state;
    const code = resetCodePlaceholder(__code, currentComProps, placeholder);

    this.setState({ displayCode: code });
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const props = this.props;
    const state = this.state;
    const isPropsEqual = isEqual(state.currentComProps, prevState.currentComProps);

    if (props.__code !== prevProps.__code || !isPropsEqual) {
      const code = resetCodePlaceholder(props.__code, state.currentComProps, props.placeholder);
      this.setState({ displayCode: code });
    }
    if (!isEqual(prevProps.defaultComProps, props.defaultComProps))
      this.setState({ currentComProps: props.defaultComProps });
  }

  private toCopy = () => {
    const textAreas = this.editContainer?.getElementsByTagName('textarea');
    if (textAreas && textAreas[0]) {
      const text = textAreas[0].value;
      copy(text);
    }
  };

  private toggleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  private reset = (nextComProps: ComProps) => {
    this.setState({ currentComProps: nextComProps });
  };

  render(): React.ReactNode {
    const props = this.props;
    const { __scope, language, hideCode, links } = this.props;
    const { expand, currentComProps, displayCode } = this.state;

    return (
      <div className={PlaygroundLess.container}>
        <LiveProvider
          className={PlaygroundLess.provider}
          code={displayCode}
          transformCode={transformCode}
          language={language}
          theme={theme as PrismTheme}
          scope={{ mdx, ...__scope }}
        >
          <CustomPreview
            comProps={currentComProps}
            reset={this.reset}
            asideWrapper={props.asideWrapper}
            headWrapper={props.headWrapper}
          />
          {hideCode ? null : (
            <div className={PlaygroundLess.center}>
              <div className={PlaygroundLess.controller}>
                <div className={PlaygroundLess.links}>
                  {Object.keys(links).map((name, idx) => {
                    const link = get(links, name);
                    if (!link) return null;
                    const key = `link-${idx}`;
                    return (
                      <a href={link} key={key}>
                        <span>{capitalize(name)}</span>
                        <span>{`>`}</span>
                      </a>
                    );
                  })}
                </div>
                <div className={PlaygroundLess.btns}>
                  <span onClick={this.toCopy}>复制</span>
                </div>
              </div>
              <div
                className={`${PlaygroundLess.editorWrapper} ${
                  !expand ? PlaygroundLess.constraint : ''
                }`}
                ref={(ref: HTMLDivElement) => {
                  this.editContainer = ref;
                }}
              >
                <CustomLiveEditor className={PlaygroundLess.editor} />
              </div>
              {expand ? null : (
                <div className={PlaygroundLess.expand} onClick={this.toggleExpand}>
                  <span>{'>'}</span>
                </div>
              )}
            </div>
          )}
          <LiveError className={PlaygroundLess.error} />
        </LiveProvider>
      </div>
    );
  }
}

export default Playground;
