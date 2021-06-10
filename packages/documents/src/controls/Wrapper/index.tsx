/**
 * MDX 解析后组件的渲染容器
 * */
import React from 'react';
import get from 'lodash/get';
import Anchor from '../../compositions/Anchor';
import WrapperLess from './Wrapper.less';

interface WrapperProps {
  children: React.ReactChildren;
}

class Wrapper extends React.PureComponent<WrapperProps> {
  private getAnchors = (originChildren: React.ReactChildren) => {
    const children = React.Children.toArray(originChildren);
    const anchors: { id: string; text: string }[] = [];

    children.forEach((child) => {
      const mdxType = get(child, 'props.mdxType');
      const id = get(child, 'props.id');
      const text = get(child, 'props.children');
      // 规定以 h2 标签或者 markdown '##' 作为锚点
      if (mdxType === 'h2' && id) anchors.push({ id, text });
    });

    return anchors;
  };

  render(): React.ReactNode {
    const { children } = this.props;
    const anchors = this.getAnchors(children);
    return (
      <div className={WrapperLess.container} id="document-mdx-wrapper-content">
        <Anchor anchors={anchors} />
        <div className={WrapperLess.content}>{children}</div>
      </div>
    );
  }
}

export default Wrapper;
