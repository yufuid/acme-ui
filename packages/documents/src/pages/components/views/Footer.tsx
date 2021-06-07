import React from 'react';
import { Link } from 'react-router-dom';
import { TMDXHub } from '~docs/core/MdxHub';
import FooterLess from '../styles/Footer.less';

interface FooterProps {
  mdxHub: TMDXHub[];
  activeComName: string;
}

class Footer extends React.PureComponent<FooterProps> {
  render(): React.ReactNode {
    const { mdxHub, activeComName } = this.props;
    const currentIdx = mdxHub.findIndex((hub) => {
      return activeComName === hub.tagName.toLowerCase();
    });
    const prev = currentIdx > 0 ? mdxHub[currentIdx - 1] : null;
    const next = currentIdx < mdxHub.length - 1 ? mdxHub[currentIdx + 1] : null;

    return (
      <div className={FooterLess.container}>
        <div className={FooterLess.centerContent}>
          <div className={FooterLess.centerInner}>
            {prev ? (
              <Link
                key={prev.path || `/components/${prev.tagName.toLowerCase()}`}
                className={FooterLess.link}
                to={prev.path || `/components/${prev.tagName.toLowerCase()}`}
              >
                <span>{prev.tagName}</span>
                <span>{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                key={next.path || `/components/${next.tagName.toLowerCase()}`}
                className={FooterLess.link}
                to={next.path || `/components/${next.tagName.toLowerCase()}`}
              >
                <span>{next.tagName}</span>
                <span>{next.name}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
