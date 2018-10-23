import React from 'react';

import './auth.css';
import { auth } from '../Root';

import App from '../App';
import NavigationBar from '../navigationBar/NavigationBar';

class Auth extends React.Component {
  componentWillMount() {
    this.setState({ profile: {} });

    auth.getProfile((err, profile) => {
      this.setState({ profile });
    });
  }

  login = () =>  {
    auth.login();
  }

  logout = () =>   {
    auth.logout();
  }

  render() {
    const { isAuthenticated } = auth;
    if ( isAuthenticated() ) {
      return (
        <div className="home-container">
          <NavigationBar name={this.state.profile.name} logout={this.logout}/>
          <App />
        </div>
      )
    } else {
      return (
        <div className="login-container">
          <NavigationBar login={this.login} />
          <h1>ORCA</h1>
        </div>
      )
    }
  }
}

export default Auth;
