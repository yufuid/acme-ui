/**
 * 统一声明媒体资源的类型
 */

declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.less' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare global {
  const STORYBOOK_REACT_CLASSES: any;
}
