/**
 * 顶部导航
 * */
import React from 'react';
import FooterLess from './Footer.less';

const Footer = () => {
  return (
    <footer className={FooterLess.container}>
      京ICP备11018762号 Copyright 2016-{new Date().getUTCFullYear()} 北京玉符科技服务有限公司
    </footer>
  );
};

export default Footer;
