import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CONFIG_URL } from './Root';
import getConfig from '../actions/config';

import Sidebar from './sidebar/Sidebar';
import Namespace from './namespaces/Namespace';
import Pod from './pods/Pod';

class App extends React.Component {
  componentDidMount() {
    const { appIsConfigured, dispatchGetConfig } = this.props;

    if (!appIsConfigured) {
      dispatchGetConfig(CONFIG_URL);
    }
  }

  render() {
    return (
      <Router>
        <div className="app-container">
          <h1> Orca: the Kubernetes permissions manager</h1>
          <div className="kube-container">
            <Sidebar />
            <Switch>
              <Route exact path="/namespace/" component={Namespace} />
              <Route exact path="/pod/" component={Pod} />
              { /* default behavior: reroute to "/" */ }
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  appIsConfigured: PropTypes.bool.isRequired,
  dispatchGetConfig: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  appIsConfigured: state.config.appIsConfigured,
  CONFIG_URL: state.config.CONFIG_URL,
});

const mapDispatchToProps = dispatch => ({
  dispatchGetConfig: () => dispatch(getConfig()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
