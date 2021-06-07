/**
 * 编辑器创建
 * */

import React from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { Language, Prism, PrismTheme } from "prism-react-renderer";
import CodeLess from "../Code/Code.less";
import { theme, toHundreds } from "../Code";

interface Props {
  code: string;
  onChange: (code: string) => void;
  language: Language;
  theme: PrismTheme;
  style: any;
}

interface State {
  code: string
  prevCodeProp: string;
}

class CodeEditor extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.code !== state.prevCodeProp) {
      return { code: props.code, prevCodeProp: props.code };
    }

    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      code: '',
      prevCodeProp: '',
    }
  }

  private updateContent = (code: string) => {
    this.setState({ code }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.code);
      }
    });
  };

  private highlightCode = (code: string) => {
    return (
      <Highlight
        Prism={Prism}
        code={code}
        language={this.props.language as Language}
        theme={this.props.theme || theme as PrismTheme}
      >
        {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
          <>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div {...lineProps} className={`${CodeLess.line} ${lineProps.className}`}>
                  <span className={CodeLess.nov}>{toHundreds(i + 1)}</span>
                  {line.map((token, key) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              );
            })}
          </>
        )}
      </Highlight>
    );
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      style,
      code: _code,
      onChange,
      language,
      theme,
      ...rest
    } = this.props;
    const { code } = this.state;

    const baseTheme =
      theme && typeof theme.plain === 'object' ? theme.plain : {};

    return (
      <Editor
        value={code}
        padding={10}
        highlight={this.highlightCode}
        onValueChange={this.updateContent}
        style={{
          whiteSpace: 'pre',
          fontFamily: 'Monaco',
          ...baseTheme,
          ...style
        }}
        {...rest}
      />
    );
  }
}

export default CodeEditor;
