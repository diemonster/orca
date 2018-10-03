import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import KubeNav from './components/KubeNav';
import Namespace from './components/namespaces/Namespace';
import Pod from './components/pods/Pod';

const initialState = {
  namespace: {
    namespaceObjects: [],
    namespaceCreateInput: '',
    namespaceDeleteInput: '',
  },
  rolebinding: {
    rolebindingObjects: {},
  },
};

const store = configureStore(initialState);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <h1>
            Orca: The Kubernetes Permissions Manager
          </h1>
          <div className='kube-container'>
            <KubeNav />
            <Switch>
              <Route exact path='/namespace/' component={Namespace} />
              <Route exact path='/pod/' component={Pod} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
