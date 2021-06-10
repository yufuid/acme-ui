/**
 * MDX code 代码块展示
 * */

import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
import theme from './theme';
import CodeLess from './Code.less';

const toHundreds = (num: number) => {
  if (num < 10) return `  ${num}`;
  if (num < 99) return ` ${num}`;
  return `${num}`;
};

interface Props {
  children: React.ReactNode;
}

const Code: React.FC<Props> = (props: Props) => {
  const { children } = props;
  const code = get(children, 'props.children');
  const preLang = get(children, 'props.className');
  if (!code) return null;
  const language = isString(preLang) ? preLang.replace(/language-/, '') : 'text';

  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language as Language}
      theme={theme as PrismTheme}
    >
      {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${cls} ${CodeLess.wrapper}`} style={{ ...style }}>
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
        </pre>
      )}
    </Highlight>
  );
};

export { theme, toHundreds };

export default Code;
