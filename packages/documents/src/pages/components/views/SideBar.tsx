import React from 'react';
import { Link } from 'react-router-dom';
import { TMDXHub } from '~docs/core/MdxHub';
import SidebarLess from '../styles/SideBar.less';

interface SideBarProps {
  mdxHub: TMDXHub[];
  activeComName: string;
}

class SideBar extends React.PureComponent<SideBarProps> {
  render(): React.ReactNode {
    const { mdxHub, activeComName } = this.props;
    return (
      <div className={SidebarLess.menus}>
        {mdxHub.map((hub) => {
          const { tagName, name, path: hubPath } = hub;
          const path = hubPath || `/components/${tagName.toLowerCase()}`;
          const linkClass = [
            SidebarLess.menuItem,
            activeComName === tagName.toLowerCase() ? SidebarLess.active : '',
          ];
          return (
            <Link key={path} className={linkClass.join(' ')} to={path}>
              <span>{tagName}</span>
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default SideBar;
