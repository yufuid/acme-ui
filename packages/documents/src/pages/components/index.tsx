import * as React from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';
import MdxHub from '~docs/core/MdxHub';
import Layout from './views/Layout';
import MdxPage from './views/Mdxpage';

interface Props {
  location: RouteComponentProps['location'];
}

class Components extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { location } = this.props;
    return (
      <Layout mdxHub={MdxHub} location={location}>
        <Switch>
          <Route
            exact
            path="/components"
            render={() => {
              const firstMdx = MdxHub[0];
              if (!firstMdx) return null;
              return (
                <Redirect to={firstMdx.path || `/components/${firstMdx.tagName.toLowerCase()}/`} />
              );
            }}
          />
          {MdxHub.map((hub) => {
            const { tagName, designMdx, codeMdx, path: hubPath } = hub;
            const path = hubPath || `/components/${tagName.toLowerCase()}/:tab?`;
            return (
              <Route
                key={path}
                exact
                path={path}
                render={({ match }) => {
                  const tab = get(match, 'params.tab');
                  const MdxCom = tab === 'design' ? designMdx : codeMdx;
                  if (!MdxCom) return null;
                  return (
                    <MdxPage mdxHub={hub} tab={tab || 'code'}>
                      <MdxCom />
                    </MdxPage>
                  );
                }}
              />
            );
          })}
        </Switch>
      </Layout>
    );
  }
}

export default Components;
