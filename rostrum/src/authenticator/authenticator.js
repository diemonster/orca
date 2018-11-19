import auth0 from 'auth0-js';
import history from './history';


export default class Authenticator {
  constructor(domain, clientID) {
    this.auth0 = new auth0.WebAuth({
      domain,
      clientID,
      redirectUri: `${window.location.origin}/callback`,
      responseType: 'token id_token',
      scope: 'openid profile',
    });

    this.accessToken = '';

    this.login = this.login.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  getProfile(cb) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) {
      return;
    }

    this.auth0.client.userInfo(accessToken, cb);
  }

  // parses the result after authentication from URL hash
  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        this.setSession(authResult);
        // navigate to the home route
        history.replace('/');
      } else if (err) {
        // navigate to the home route
        history.replace('/');

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
  }

  // removes user details from localStorage
  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('name');
    // navigate to the home route
    history.replace('/');
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
