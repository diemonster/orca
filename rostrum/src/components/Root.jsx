import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from '../store/configureStore';
import Authenticator from '../authenticator/authenticator';
import History from '../authenticator/history';
import K8sClient from '../k8s/client';

import Auth from './auth/Auth';
import Callback from './callback/Callback';

const initialState = {
  config: {},
  namespace: {
    namespaceObjects: [],
    namespaceCreateInput: '',
    namespaceDeleteInput: '',
  },
  rolebinding: {
    namespacedRolebindings: {},
  },
};

function setConfigFromWindow() {
  if (window.config) {
    initialState.config = window.config;
  }
}

setConfigFromWindow();
const store = configureStore(initialState);
const client = new K8sClient(initialState.config.proxyURL);
const authenticator = new Authenticator(initialState.config.auth0Domain, initialState.config.auth0ClientID);

const handleAuthentication = (props) => {
  const { location } = props;
  if (/access_token|id_token|error/.test(location.hash)) {
    authenticator.handleAuthentication();
  }

  return <Callback {...props} />;
};

const AuthWithProps = props => (
  <Auth authenticator={authenticator} client={client} {...props} />
);

function Root() {
  return (
    <Provider store={store}>
      <Router history={History} render={AuthWithProps}>
        <Switch>
          <Route exact path="/callback" render={handleAuthentication} />
          {/* if no above route matches (in this case, just /callback), <Auth> will be rendered */}
          <Route render={AuthWithProps} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default Root;
