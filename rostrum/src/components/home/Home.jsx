import React, { Component } from 'react';
import Profile from '../profile/Profile'
import App from '../../App';
import "./home.css"

class Home extends Component {
  // calls the login method in authentication service
  login = () => {
    this.props.auth.login();
  }
  // calls the logout method in authentication service
  logout = () => {
    this.props.auth.logout();
  }

  username = () => {
    this.props.auth.user();
    return localStorage.getItem('nickname');
  }

  render() {
    // calls the isAuthenticated method in authentication service
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {
          isAuthenticated() &&
          <div>
            <App />
            <div className="container column">
              <Profile name={this.username()}/>
              <button onClick={this.logout}>Log Out</button>
            </div>
          </div>
        }
        {
          !isAuthenticated() && (
            <div className="container column">
              <h1>ORCA</h1>
              <button onClick={this.login}>Log In</button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Home;