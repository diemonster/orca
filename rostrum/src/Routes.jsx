import React from 'react';
import { Route, Router } from 'react-router-dom';
import Home from './components/home/Home';
import Callback from './components/callback/Callback';
import Auth from './components/auth/auth';
import History from './components/auth/history';

const auth = new Auth();

const handleAuthentication = (nextState) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const Routes = () => (
  <Router history={History} component={Home}>
    <div>
      <Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
      <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
      <Route path="/namespace" render={(props) => <Home auth={auth} {...props} />} />
      <Route path="/pod" render={(props) => <Home auth={auth} {...props} />} />

      <Route
        path="/callback"
        render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
    </div>
  </Router>
);

export default Routes;