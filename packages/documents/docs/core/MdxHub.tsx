/**
 * 组件 MDX 文件路由及 Title 配置
 * */
import React from 'react';
import ButtonCode from './Button/Code.mdx';
import ButtonDesign from './Button/Design.mdx';
import PaginationCode from './Pagination/Code.mdx';
import PaginationDesign from './Pagination/Design.mdx';
import SwitchCode from './Switch/Code.mdx';
import SwitchDesign from './Switch/Design.mdx';
import RadioCode from './Radio/Code.mdx';
import RadioDesign from './Radio/Design.mdx';
import FormLabelCode from './FormLabel/Code.mdx';
import FormLabelDesign from './FormLabel/Design.mdx';
import FormGroupCode from './FormGroup/Code.mdx';
import FormGroupDesign from './FormGroup/Design.mdx';
import InputCode from './Input/Code.mdx';
import InputDesign from './Input/Design.mdx';
import CheckboxCode from './Checkbox/Code.mdx';
import CheckboxDesign from './Checkbox/Design.mdx';
import FormDescriptionCode from './FormDescription/Code.mdx';
import FormDescriptionDesign from './FormDescription/Design.mdx';
import TagCode from './Tag/Code.mdx';
import TagDesign from './Tag/Design.mdx';

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
  {
    tagName: 'Switch',
    name: '开关',
    description: '在两种状态间切换时用到的开关选择器。',
    designMdx: SwitchDesign,
    codeMdx: SwitchCode,
  },
  {
    tagName: 'Radio',
    name: '单选框',
    description: '单选按钮允许用户从一组中选择一个选项。',
    designMdx: RadioDesign,
    codeMdx: RadioCode,
  },
  {
    tagName: 'Form Label',
    name: '表单标题',
    description: '',
    designMdx: FormLabelDesign,
    codeMdx: FormLabelCode,
  },
  {
    tagName: 'Form Group',
    name: '表单组',
    description: '',
    designMdx: FormGroupDesign,
    codeMdx: FormGroupCode,
  },
  {
    tagName: 'Input',
    name: '输入框',
    description: '',
    designMdx: InputDesign,
    codeMdx: InputCode,
  },
  {
    tagName: 'Checkbox',
    name: '复选框',
    description: '复选框允许用户从一组中选择一个或多个项目。复选框可以打开或关闭一个选项。',
    designMdx: CheckboxDesign,
    codeMdx: CheckboxCode,
  },
  {
    tagName: 'FormDescription',
    name: '表单描述',
    description: '',
    designMdx: FormDescriptionDesign,
    codeMdx: FormDescriptionCode,
  },
  {
    tagName: 'Tag',
    name: '标签',
    description: '标签用于进行标记和分类。',
    designMdx: TagDesign,
    codeMdx: TagCode,
  },
];

export default MdxHub;
