import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import K8sClient from '../k8s/client';

import Sidebar from './sidebar/Sidebar';
import Namespace from './namespaces/Namespace';
import Pod from './pods/Pod';

function App(props) {
  const { client } = props;

  const NamespaceWithProps = p => (
    <Namespace client={client} {...p} />
  );

  return (
    <Router>
      <div className="app-container">
        <h1> Orca: the Kubernetes permissions manager</h1>
        <div className="kube-container">
          <Sidebar />
          <Switch>
            <Route exact path="/namespace/" render={NamespaceWithProps} />
            <Route exact path="/pod/" component={Pod} />
            { /* default behavior: reroute to "/" */ }
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

App.propTypes = {
  client: PropTypes.instanceOf(K8sClient).isRequired,
};

export default App;
