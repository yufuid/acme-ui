import 'react-hot-loader/patch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { HashRouter } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
// eslint-disable-next-line import/no-unresolved
import '@acme-ui/core/styles/cover/index.less';
import './static/main.less';
import { Wrapper, Paragraph, headings, UL, OL, Code } from './controls';
import Root from './pages/root/routes';

const components = {
  ...headings,
  p: Paragraph,
  ol: OL,
  ul: UL,
  pre: Code,
  wrapper: Wrapper,
};

const render = (Component: React.ComponentType) => {
  ReactDOM.render(
    <AppContainer>
      <React.Suspense fallback={<div>loading...</div>}>
        <MDXProvider components={components}>
          <HashRouter>
            <Component />
          </HashRouter>
        </MDXProvider>
      </React.Suspense>
    </AppContainer>,
    document.getElementById('root'),
  );
};
render(Root);

if (module.hot) {
  module.hot.accept('./pages/root/routes', () => {
    render(Root);
  });
}
