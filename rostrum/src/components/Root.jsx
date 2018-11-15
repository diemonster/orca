import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from '../store/configureStore';
import Authenticator from '../authenticator/authenticator';
import History from '../authenticator/history';

import Auth from './auth/Auth';
import Callback from './callback/Callback';

class Root extends React.Component {
  componentWillMount() {
    this.config = (window.config ? window.config : {});
    this.store = configureStore({ config: this.config });
    this.authenticator = new Authenticator(this.config.auth0Domain, this.config.auth0ClientID);

    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.authWithProps = this.authWithProps.bind(this);
  }

  handleAuthentication() {
    return (props) => {
      const { location } = props;
      if (/access_token|id_token|error/.test(location.hash)) {
        this.authenticator.handleAuthentication();
      }

      return <Callback {...props} />;
    };
  }

  authWithProps() {
    return props => (
      <Auth authenticator={this.authenticator} {...props} />
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <Router history={History}>
          <Switch>
            <Route exact path="/callback" render={this.handleAuthentication} />
            {/* if no above route matches (in this case, just /callback), <Auth> will be rendered */}
            <Route render={this.authWithProps()} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Root;
