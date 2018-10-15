import auth0 from 'auth0-js';
import history from './history';

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_DOMAIN,
      clientID: process.env.REACT_APP_CLIENT_ID,
      redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://neworca.com/callback',
      responseType: 'token id_token',
      scope: 'openid profile',
    });

    this.accessToken = '';
  }

  login() {
    this.auth0.authorize();
  }

  getProfile(cb) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) {
      return;
    }

    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }

      // TODO: Add proper error handling
      cb(err, profile);
    });
  }

  // parses the result after authentication from URL hash
  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');

        // TODO: Add proper error handling
      }
    });
  }

  // Sets user details in localStorage
  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);

    this.accessToken = authResult.accessToken;
    // navigate to the home route
    history.replace('/home');
  }

  // removes user details from localStorage
  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('name');
    // navigate to the home route
    history.replace('/home');
  }

  // checks if the user is authenticated
  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuthenticated = new Date().getTime() < expiresAt;

    return isAuthenticated;
  }
}
