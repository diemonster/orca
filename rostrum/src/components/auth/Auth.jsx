import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';

import './auth.css';
import Authenticator from '../../authenticator/authenticator';

import App from '../App';
import NavigationBar from '../navigationBar/NavigationBar';

class Auth extends React.Component {
  componentWillMount() {
    this.setState({ profile: {} });

    const cb = (err, profile) => {
      if (err) {
        toastr.error(err);
      } else {
        this.setState({ profile });
      }
    };

    const { authenticator } = this.props;
    authenticator.getProfile(cb);
  }

  render() {
    const { authenticator } = this.props;
    const { profile } = this.state;
    if (authenticator.isAuthenticated()) {
      return (
        <div className="home-container">
          <NavigationBar name={profile.name} logout={authenticator.logout} />
          <App />
        </div>
      );
    }

    return (
      <div className="login-container">
        <NavigationBar login={authenticator.login} />
        <h1>ORCA</h1>
      </div>
    );
  }
}

Auth.propTypes = {
  authenticator: PropTypes.instanceOf(Authenticator).isRequired,
};

export default Auth;
