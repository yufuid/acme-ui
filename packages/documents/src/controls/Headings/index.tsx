/**
 * MDX h1 ~ h6
 * */
import React from 'react';
import HeadingsLess from './Headings.less';

type Tags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const heading = (Tag: Tags) => {
  type Props = React.ComponentProps<Tags>;
  const Component: React.FC<Props> = (props: Props) => {
    const { className } = props;
    return <Tag {...props} className={`${HeadingsLess.tag} ${className}`} />;
  };

  Component.displayName = Tag;
  return Component;
};

export const h2 = heading('h2');
export const h3 = heading('h3');
export const h4 = heading('h4');
export const h5 = heading('h5');
export const h6 = heading('h6');
