import auth0 from 'auth0-js';
import history from './history';


export default class AuthClient {
  constructor(domain, clientID) {
    this.webAuth = new auth0.WebAuth({
      domain,
      clientID,
      redirectUri: `${window.location.origin}`,
      responseType: 'token id_token',
      scope: 'openid profile',
    });

    this.accessToken = '';

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    // Check whether the current time is past the access token's expiry time
    this.isAuthenticated = () => {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      const isAuthenticated = new Date().getTime() < expiresAt;
      return isAuthenticated;
    };

    this.getCurrentUser = () => new Promise((resolve) => {
      const username = localStorage.getItem('username');
      resolve(username);
    });
  }

  login() {
    this.webAuth.authorize();
  }

  // parses the result after authentication from URL hash
  handleAuthentication() {
    this.webAuth.parseHash({}, (parseHashErr, authResult) => {
      if (authResult && authResult.accessToken) {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

        this.webAuth.client.userInfo(authResult.accessToken, (userInfoErr, profile) => {
          if (profile) {
            localStorage.setItem('username', profile.name);
          }
        });

        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('expires_at', expiresAt);

        this.accessToken = authResult.accessToken;
        // navigate to the home route
        history.replace('/');
      } else if (parseHashErr) {
        // navigate to the home route
        history.replace('/');

        // TODO: Add proper error handling
      }
    });
  }

  // removes user details from localStorage
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');
    localStorage.removeItem('username');

    this.accessToken = '';

    // navigate to the home route
    history.replace('/');
  }
}
