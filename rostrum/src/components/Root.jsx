import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from '../store/configureStore';
import Authenticator from '../authenticator/authenticator';
import History from '../authenticator/history';

import Auth from './auth/Auth';
import Callback from './callback/Callback';

// TODO: Investigate possibility of getting config here instead of when App
// mounts. Maybe this could be a synchronous call to the go server? That should
// be fast. The config could be obtained right here at the start, and then
// passed into configureStore() as part of initialState{}. We wouldn't even
// need the 'appIsConfigured' check, probably.

// TODO: Get K8sApiClient config from state, not an env var. It seems like
// exporting the store from this file doesn't work like I had hoped. Inspection
// reveals that the store is as expected at time of export here, but is
// undefined at time of import by the client.

// TODO: Investigate possibility of moving either or both of config management
// and the api client into redux middleware.

const CONFIG_URL = '/config'; // in theory, this is reaching out to the /config endpoint on the backend server
const initialState = {
  config: {
    appIsConfigured: false,
    proxyUrl: '',
  },
  namespace: {
    namespaceObjects: [],
    namespaceCreateInput: '',
    namespaceDeleteInput: '',
  },
  rolebinding: {
    namespacedRolebindings: {},
  },
};

const store = configureStore(initialState);

const auth = new Authenticator();
const handleAuthentication = (props) => {
  const { location } = props;
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }

  return <Callback {...props} />;
};

function Root() {
  return (
    <Provider store={store}>
      <Router history={History} component={Auth}>
        <Switch>
          <Route exact path="/callback" render={handleAuthentication} />
          {/* if no above route matches (in this case, just /callback), <Auth> will be rendered */}
          <Route component={Auth} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default Root;
export { auth, CONFIG_URL };
