/**
 * 顶部导航
 * */
import get from 'lodash/get';
import React from 'react';
import { Link, matchPath, RouteComponentProps } from 'react-router-dom';
import HeaderLess from './Header.less';
import WhiteLogo from '../../static/logo-white.svg';
import PrimaryLogo from '../../static/logo-primary.svg';

interface HeaderProps {
  transparent?: boolean;
  menus: { label: string; link: string }[];
  className?: string;
  location?: RouteComponentProps['location'];
}

export const defaultMenus = [
  { link: '/design', label: '设计' },
  { link: '/components', label: '组件' },
  { link: '/develop', label: '开发' },
  { link: '/resource', label: '资源' },
  { link: '/about', label: '关于我们' },
];

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { transparent, menus, className, location } = props;
  const containerClass = [HeaderLess.headerContainer];
  if (transparent) containerClass.push(HeaderLess.transparent);
  if (className) containerClass.push(className);
  const result = location ? matchPath(location.pathname, { path: '/:page' }) : {};
  const activePage = get(result, 'params.page') || '';

  return (
    <header className={containerClass.join(' ')}>
      <Link to="/" className={HeaderLess.img}>
        <img src={transparent ? WhiteLogo : PrimaryLogo} alt="acme-ui-logo" />
      </Link>
      <ul className={HeaderLess.menu}>
        {menus.map((menu) => {
          const current = matchPath(menu.link, { path: '/:page' });
          const currentPage = get(current, 'params.page');
          return (
            <li key={menu.link} className={activePage === currentPage ? HeaderLess.active : ''}>
              <Link to={menu.link}>{menu.label}</Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
