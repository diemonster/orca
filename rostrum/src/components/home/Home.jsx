import React, { Component } from 'react';
import App from '../../App';
import NavigationBar from '../navigationBar/NavigationBar';
import './home.css';

class Home extends Component {
  componentWillMount() {
    this.setState({ profile: {} });

    this.props.auth.getProfile((err, profile) => {
      this.setState({ profile });
    });
  }

  login = () =>  {
    this.props.auth.login();
  }

  logout = () =>   {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {
          isAuthenticated() && (
            <div>
              <NavigationBar name={this.state.profile.name} logout={this.logout}/>
              <App />
            </div>
          )
        }
        {
          !isAuthenticated() && (
            <div className="home-container">
              <NavigationBar login={this.login} />
              <h1>ORCA</h1>
            </div>
          )
        }
      </div>
    );
  }
}

export default Home;
