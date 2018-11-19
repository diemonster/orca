import React from 'react';
import './navigation-bar.css';
import PropTypes from 'prop-types';

function NavigationBar(props) {
  const { login, logout, name } = props;
  if (logout) {
    return (
      <div className="navigation-bar">
        <ul>
          <li className="home"><a href="/">Home</a></li>
          <li className="profile">
            <button type="button" onClick={logout}>
              {name ? `${name}, Log Out` : 'Log Out'}
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="navigation-bar">
      <ul>
        <li className="profile">
          <button type="button" onClick={login}>
            Log In
          </button>
        </li>
      </ul>
    </div>
  );
}

NavigationBar.propTypes = {
  login: PropTypes.func,
  logout: PropTypes.func,
  name: PropTypes.string,
};

NavigationBar.defaultProps = {
  login: null,
  logout: null,
  name: null,
};

export default NavigationBar;
