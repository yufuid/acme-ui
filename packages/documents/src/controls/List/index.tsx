/**
 * MDX ul、ol 有序或者无序列表
 * */
import React from 'react';
import ListLess from './List.less';

type ULProps = React.ComponentProps<'ul'>;
export const UL: React.FC<ULProps> = (props: ULProps) => {
  const { className } = props;
  return <ul {...props} className={`${ListLess.ul} ${className}`} />;
};

type OLProps = React.ComponentProps<'ol'>;
export const OL: React.FC<OLProps> = (props: OLProps) => {
  const { className } = props;
  return <ol {...props} className={`${ListLess.ol} ${className}`} />;
};
