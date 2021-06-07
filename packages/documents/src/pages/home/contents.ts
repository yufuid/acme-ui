import ComponentsSVG from './styles/components.svg';
import DesignSVG from './styles/design-principles.svg';
import DocsSVG from './styles/documents.svg';
import ResourceSVG from './styles/resource.svg';

const sourcesCards = [
  {
    title: '设计原则',
    description: '基础性设计指南，样式及最佳实践',
    img: DesignSVG,
    link: '/design',
    color: '#3333FF',
  },
  {
    title: '组件',
    description: '交互式UI构建模块的设计指南和开发实践',
    img: ComponentsSVG,
    link: '/components',
    color: '#00C357',
  },
  {
    title: '资源',
    description: '下载资源来简化您的工作流程，快速搭建页面原型',
    img: ResourceSVG,
    link: '/resource',
    color: '#534947',
  },
  {
    title: '开发文档',
    description: '组件的开发人员文档和指南',
    img: DocsSVG,
    link: '/develop',
    color: '#8A40FC',
  },
];

export default sourcesCards;
