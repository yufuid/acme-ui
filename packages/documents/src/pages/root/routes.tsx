import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RootLess from './root.less';
import Home from '../home';
import Components from '../components';

const RouteEntry: React.FC = () => {
  return (
    <main className={RootLess.container} id="document-scroll-container">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/components" component={Components} />
      </Switch>
    </main>
  );
};

export default RouteEntry;
