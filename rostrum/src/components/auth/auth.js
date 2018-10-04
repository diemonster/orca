import history from './history';
import auth0 from 'auth0-js';
import axios from 'axios';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'iqvia.auth0.com',
    clientID: '0xiyV1vT2LY2zJUKTZvXAUsW6i0IY5Bm',
    redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://neworca.com/callback',
    responseType: 'token id_token',
    scope: 'openid profile',
  });


  login = () => {
    this.auth0.authorize();
  }

  user = () => {
    var accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('Access Token must exist to fetch profile');
    }

    this.auth0.client.userInfo(accessToken, function (err, profile) {
      if (profile) {
        localStorage.setItem('nickname', profile.nickname);
      }
    });
  }


  // parses the result after authentication from URL hash
  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err);
      }
    });
  }

  // Sets user details in localStorage
  setSession = (authResult) => {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    // navigate to the home route
    history.replace('/home');
  }

  // removes user details from localStorage
  logout = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/home');
  }

  // checks if the user is authenticated
  isAuthenticated = () => {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    let isAuthenticated =new Date().getTime() < expiresAt;
    if (isAuthenticated) {
      this.addAxiosHeader()
    }
    return isAuthenticated
  }

  // Adds auth to all headers
  addAxiosHeader = () =>{
    axios.defaults.headers.common['Authorization'] = "Bearer " +localStorage.getItem('access_token')
  }
}