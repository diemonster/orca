import React, { Component } from 'react';
import Profile from '../profile/Profile'
import App from '../../App';
import "./home.css"

class Home extends Component {
  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }

  username = () => {
    this.props.auth.user();
    return localStorage.getItem('nickname');
  }

  render() {
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