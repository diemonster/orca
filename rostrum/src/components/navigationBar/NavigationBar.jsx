import React from 'react';
import './navigation-bar.css';
import PropTypes from 'prop-types';

function NavigationBar(props) {
  const { name, logout, login } = props;
  if (logout) {
    return (
      <div className="navigation-bar">
        <ul>
          <li className="home"><a href="/">Home</a></li>
          <li className="profile">
            <button type="button" onClick={logout}>
              {name}
              , Log Out
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
            Login
          </button>
        </li>
      </ul>
    </div>
  );
}

NavigationBar.propTypes = {
  name: PropTypes.string,
  logout: PropTypes.func,
  login: PropTypes.func,
};

export default NavigationBar;
