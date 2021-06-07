/**
 * MDX p 段落
 * */
import React from 'react';
import ParagraphLess from './Paragraph.less';

type Props = React.ComponentProps<'p'>;

const Paragraph: React.FC<Props> = (props: Props) => {
  const { className } = props;
  return <p {...props} className={`${ParagraphLess.p} ${className}`} />;
};

export default Paragraph;
