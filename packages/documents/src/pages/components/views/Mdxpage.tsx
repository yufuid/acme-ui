import React from 'react';
import { Link } from 'react-router-dom';
import { TMDXHub } from '~docs/core/MdxHub';
import MdxPageLess from '../styles/MdxPage.less';

interface MdxPageProps {
  children: React.ReactNode;
  mdxHub: TMDXHub;
  tab: 'design' | 'code';
}

const MdxPage: React.FC<MdxPageProps> = (props: MdxPageProps) => {
  const { children, mdxHub, tab } = props;
  const { tagName, name, description, path: hubPath } = mdxHub;
  return (
    <div className={MdxPageLess.container}>
      <header className={`${MdxPageLess.centerContent} ${MdxPageLess.header}`}>
        <h1>
          <span>{tagName}</span>
          <span>{name}</span>
        </h1>
        <p>{description}</p>
      </header>
      <div className={MdxPageLess.tabs}>
        <div className={MdxPageLess.centerContent}>
          <div className={`${MdxPageLess.tab} ${tab === 'design' ? MdxPageLess.active : ''}`}>
            <Link to={hubPath || `/components/${tagName.toLowerCase()}/design`}>
              <span>
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 18 18"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="currentColor"
                >
                  <g stroke="none" strokeWidth="1" fillRule="evenodd">
                    <g transform="translate(-733.000000, -314.000000)">
                      <g transform="translate(726.000000, 309.000000)">
                        <g>
                          <g>
                            <path
                              d="M17.458271,20.1134252 C17.8831055,20.1134252 18.2275018,20.4540191 18.2275018,20.874163 C18.2275018,21.0167403 18.1869869,21.156448 18.1105774,21.2773533 L15.3261532,25.6832443 C15.2135723,25.8613849 14.9762837,25.9155392 14.7961543,25.8042013 C14.7466277,25.773589 14.7048009,25.732224 14.6738468,25.6832443 L11.8894226,21.2773533 C11.6642608,20.921072 11.7737786,20.4517345 12.1340375,20.2290587 C12.2562925,20.1534929 12.3975599,20.1134252 12.541729,20.1134252 L17.458271,20.1134252 Z M16.5384615,4.13793103 C17.3881304,4.13793103 18.0769231,4.81911888 18.0769231,5.65940667 L18.0769231,17.0704739 C18.0769231,17.9107617 17.3881304,18.5919496 16.5384615,18.5919496 L13.4615385,18.5919496 C12.6118696,18.5919496 11.9230769,17.9107617 11.9230769,17.0704739 L11.9230769,5.65940667 C11.9230769,4.81911888 12.6118696,4.13793103 13.4615385,4.13793103 L16.5384615,4.13793103 Z M23.4615385,10.9845714 C24.3112073,10.9845714 25,11.6657592 25,12.506047 L25,15.5489983 C25,16.3892861 24.3112073,17.0704739 23.4615385,17.0704739 L22.6923077,17.0704739 L22.6923077,13.2667849 L21.1538462,13.2667849 L21.1538462,17.0704739 L19.6153846,17.0704739 L19.6153846,10.9845714 L23.4615385,10.9845714 Z M10.3846154,10.9845714 L10.3846154,17.0697132 L8.84615385,17.0697132 L8.84615385,13.2667849 L7.30769231,13.2667849 L7.30769231,17.0697132 L6.53846154,17.0704739 C5.68879269,17.0704739 5,16.3892861 5,15.5489983 L5,12.506047 C5,11.6657592 5.68879269,10.9845714 6.53846154,10.9845714 L10.3846154,10.9845714 Z"
                              id="形状"
                              transform="translate(15.000000, 15.000000) rotate(-315.000000) translate(-15.000000, -15.000000) "
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span>设计</span>
            </Link>
          </div>
          <div className={`${MdxPageLess.tab} ${tab === 'code' ? MdxPageLess.active : ''}`}>
            <Link to={hubPath || `/components/${tagName.toLowerCase()}`}>
              <span>
                <svg
                  width="18px"
                  height="18px"
                  viewBox="0 0 18 18"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="currentColor"
                >
                  <g stroke="none" strokeWidth="1" fillRule="evenodd">
                    <g transform="translate(-1144.000000, -314.000000)">
                      <g transform="translate(1144.000000, 314.000000)">
                        <g>
                          <path
                            d="M1.5,0 L16.5,0 C17.3284271,-1.52179594e-16 18,0.671572875 18,1.5 L18,16.5 C18,17.3284271 17.3284271,18 16.5,18 L1.5,18 C0.671572875,18 1.01453063e-16,17.3284271 0,16.5 L0,1.5 C-1.01453063e-16,0.671572875 0.671572875,1.52179594e-16 1.5,0 Z M7.55330086,6.56566017 L6.49264069,5.505 L3,8.99764069 L6.49264069,12.4902814 L7.55330086,11.4296212 L5.12158551,8.99737552 L7.55330086,6.56566017 Z M10.4569805,6.56566017 L12.8886959,8.99737552 L10.4569805,11.4296212 L11.5176407,12.4902814 L15.0102814,8.99764069 L11.5176407,5.505 L10.4569805,6.56566017 Z"
                            id="形状结合备份"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span>代码</span>
            </Link>
          </div>
        </div>
      </div>
      <div className={MdxPageLess.centerContent}>{children}</div>
    </div>
  );
};

export default React.memo(MdxPage);
