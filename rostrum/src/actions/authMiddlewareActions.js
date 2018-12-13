import toastr from 'toastr';
import * as authActions from './authActions';
import history from '../middleware/history';


export function checkAuthentication() {
  return (dispatch) => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuthenticated = new Date().getTime() < expiresAt;

    if (!isAuthenticated) {
      toastr.warning('Auth0 token has expired; clearing session and logging out.');
      dispatch(authActions.logout());
    }
  };
}

export function handleAuthentication(authClient, urlHash) {
  return (dispatch) => {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuthenticated = new Date().getTime() < expiresAt;

    // This handles the case where a user has refreshed the page (which resets
    // the Redux state), but the token in local storage is still valid. We just
    // need to repopulate the auth fields in the state.
    if (isAuthenticated) {
      dispatch(authActions.setAuthenticated(true));
      dispatch(authActions.setUsername(localStorage.getItem('username')));
    }

    if (!isAuthenticated) {
      authClient.parseHash({ hash: urlHash }, (parseHashErr, authResult) => {
        if (authResult && authResult.accessToken) {
          expiresAt = JSON.stringify(
            (authResult.expiresIn * 1000) + new Date().getTime(),
          );

          authClient.client.userInfo(authResult.accessToken, (userInfoErr, profile) => {
            if (profile) {
              localStorage.setItem('username', profile.name);
              dispatch(authActions.setUsername(profile.name));
            }
          });

          localStorage.setItem('access_token', authResult.accessToken);
          localStorage.setItem('expires_at', expiresAt);
          dispatch(authActions.setAuthenticated(true));
        }
      });
    }

    history.replace('/');
  };
}

export function login(authClient) {
  return () => authClient.authorize();
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');
    localStorage.removeItem('username');

    dispatch(authActions.setUsername(''));
    dispatch(authActions.setAuthenticated(false));

    history.replace('/');
  };
}
