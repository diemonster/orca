import React from 'react';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import auth0 from 'auth0-js';
import configureStore from '../store/configureStore';
import History from '../middleware/history';

import K8sClient from '../middleware/k8sClient';
import { initialState as authInitialState } from '../reducers/authReducer';
import { initialState as configInitialState } from '../reducers/configReducer';
import { initialState as k8sInitialState } from '../reducers/k8sReducer';

import App from './App';


class Root extends React.Component {
  componentWillMount() {
    // by spreading both the initial state and another object, we make
    // sure that the initial state is fully initialized and then allow
    // for any values that might be passed in externally to overwrite
    // or add values as needed
    const config = { ...configInitialState, ...window.config };

    const authClient = (
      config.authClient
        ? config.authClient
        : new auth0.WebAuth({
          domain: config.auth0Domain,
          clientID: config.auth0ClientID,
          redirectUri: window.location.origin,
          responseType: 'token id_token',
          scope: 'openid profile',
        })
    );

    const auth = { ...authInitialState, authClient };

    const k8sClient = (
      config.k8sClient
        ? config.k8sClient
        : new K8sClient(config.proxyURL)
    );

    const k8s = { ...k8sInitialState, k8sClient };

    const initialState = { auth, config, k8s };
    this.store = configureStore(initialState);
  }

  render() {
    return (
      <Provider store={this.store}>
        <Router history={History}>
          <Route component={App} />
        </Router>
      </Provider>
    );
  }
}

export default Root;
