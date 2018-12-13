import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { handleAuthentication } from '../actions/authActions';
import NavigationBar from './NavigationBar';
import Namespaces from './Namespaces';
import Rolebindings from './Rolebindings';


export class App extends React.Component {
  componentWillMount() {
    this.handleAuthentication();
  }

  // If the URL has been populated with information from logging in through
  // Auth0, then call the authenticator's handleAuthentication method to
  // set session information
  handleAuthentication() {
    const { dispatchHandleAuthentication, location } = this.props;
    if (/access_token|id_token|error/.test(location.hash)) {
      dispatchHandleAuthentication(location.hash);
    }
  }

  render() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return (
        <div className="app-container">
          <NavigationBar />
          <h1>Orca: the Kubernetes permissions manager</h1>
          <div className="kube-container">
            <Namespaces />
            <Rolebindings />
          </div>
        </div>
      );
    }

    return (
      <div className="app-container">
        <NavigationBar />
        <h1>Orca: the Kubernetes permissions manager</h1>
      </div>
    );
  }
}

App.propTypes = {
  dispatchHandleAuthentication: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  dispatchHandleAuthentication: urlHash => dispatch(handleAuthentication(urlHash)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
