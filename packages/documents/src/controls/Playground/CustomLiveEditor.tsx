/**
 * 增加对 Editor 编辑区域的自定义
 * */
import React from 'react';
import { LiveContext, ContextProps } from 'react-live';
import PlaygroundLess from './Playground.less';
import CustomCodeEditor from './CustomCodeEditor';

const CustomLiveEditor: React.FC<any> = (props: any) => {
  return (
    <div className={PlaygroundLess.customEditor}>
      <LiveContext.Consumer>
        {(options: ContextProps) => {
          const { code, language, theme, disabled, onChange } = options as ContextProps & {
            onChange: () => any;
          };

          return (
            <CustomCodeEditor
              theme={theme}
              code={code}
              language={language}
              disabled={disabled}
              onChange={onChange}
              {...props}
            />
          );
        }}
      </LiveContext.Consumer>
    </div>
  );
};

export default CustomLiveEditor;
