/**
 * 布局
 * */

import get from 'lodash/get';
import React from 'react';
import { matchPath, RouteComponentProps } from 'react-router-dom';
import { TMDXHub } from '~docs/core/MdxHub';
import Header, { defaultMenus } from '../../../compositions/Header';
import SideBar from './SideBar';
import Footer from './Footer';
import LayoutLess from '../styles/Layout.less';

interface LayoutProps {
  children: React.ReactNode;
  mdxHub: TMDXHub[];
  location: RouteComponentProps['location'];
}

class Layout extends React.PureComponent<LayoutProps> {
  computeComPath = () => {
    const { location } = this.props;
    const result = matchPath(location.pathname, {
      path: '/components/:comName/:tag?',
    });

    return get(result, 'params.comName') || '';
  };

  render(): React.ReactNode {
    const { children, mdxHub, location } = this.props;
    const activeComName = this.computeComPath();
    return (
      <div className={LayoutLess.layoutContainer}>
        <Header menus={defaultMenus} className={LayoutLess.header} location={location} />
        <main className={LayoutLess.main}>
          <aside className={LayoutLess.sidebar}>
            <SideBar mdxHub={mdxHub} activeComName={activeComName} />
          </aside>
          <div className={LayoutLess.content}>
            {children}
            <Footer mdxHub={mdxHub} activeComName={activeComName} />
          </div>
        </main>
      </div>
    );
  }
}

export default Layout;
