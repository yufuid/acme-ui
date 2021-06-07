/**
 * 组件 MDX 文件路由及 Title 配置
 * */
import React from 'react';
import ButtonCode from './Button/Code.mdx';
import ButtonDesign from './Button/Design.mdx';
import PaginationCode from './Pagination/Code.mdx';
import PaginationDesign from './Pagination/Design.mdx';

export type TMDXHub = {
  /** 标签名 */
  tagName: string;
  /** 中文名 */
  name: string;
  /** 描述 */
  description: React.ReactNode;
  /** 路由地址，默认 /components/{tagName.toLowerCase()} */
  path?: string;
  /** 设计相关的 mdx import */
  designMdx?: null | ((props: any) => JSX.Element);
  /** 代码相关的 mdx import */
  codeMdx?: null | ((props: any) => JSX.Element);
};

const MdxHub: TMDXHub[] = [
  {
    tagName: 'Button',
    name: '按钮',
    description: '使用按钮，用户只需单击一下，即可采取行动并做出选择。',
    designMdx: ButtonDesign,
    codeMdx: ButtonCode,
  },
  {
    tagName: 'Pagination',
    name: '分页',
    description: '当数据量过多时，使用分页分解数据。',
    designMdx: PaginationDesign,
    codeMdx: PaginationCode,
  },
];

export default MdxHub;