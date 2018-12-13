import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login, logout } from '../actions/authActions';
import './navigation-bar.css';


export class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    const { dispatchLogin } = this.props;
    dispatchLogin();
  }

  handleLogout() {
    const { dispatchLogout } = this.props;
    dispatchLogout();
  }

  render() {
    const { isAuthenticated, username } = this.props;

    if (isAuthenticated) {
      return (
        <div className="navigation-bar">
          <ul>
            <li className="profile">
              {username}
            </li>
            <li className="auth">
              <button type="button" onClick={this.handleLogout}>
              Log Out
              </button>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div className="navigation-bar">
        <ul>
          <li className="auth">
            <button type="button" onClick={this.handleLogin}>
            Log In
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

NavigationBar.propTypes = {
  dispatchLogin: PropTypes.func.isRequired,
  dispatchLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  username: state.auth.username,
});

const mapDispatchToProps = dispatch => ({
  dispatchLogin: () => dispatch(login()),
  dispatchLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
