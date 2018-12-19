import toastr from 'toastr';
import * as authActions from './authActions';
import history from '../middleware/history';
import { authStorageItems } from '../middleware/authConsts';


export function checkAuthentication() {
  return (dispatch) => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isAuthenticated = new Date().getTime() < expiresAt;

    if (!isAuthenticated) {
      toastr.warning('Auth0 token has expired; clearing session and logging out.');
      dispatch(authActions.clearLocalStorage());
      dispatch(authActions.setAuthenticated(false));
      dispatch(authActions.setUsername(''));
    }
  };
}

export function clearLocalStorage() {
  return () => {
    Object.values(authStorageItems).forEach(item => localStorage.removeItem(item));
  };
}

export function handleAuthentication(authClient, urlHash) {
  return (dispatch) => {
    let expiresAt = JSON.parse(localStorage.getItem(authStorageItems.EXPIRES_AT));
    const isAuthenticated = new Date().getTime() < expiresAt;

    // This handles the case where a user has refreshed the page (which resets
    // the Redux state), but the token in local storage is still valid. We just
    // need to repopulate the auth fields in the state.
    if (isAuthenticated) {
      dispatch(authActions.setAuthenticated(true));
      dispatch(authActions.setUsername(localStorage.getItem(authStorageItems.USERNAME)));
    }

    if (!isAuthenticated) {
      authClient.parseHash({ hash: urlHash }, (parseHashErr, authResult) => {
        if (authResult && authResult.accessToken) {
          expiresAt = JSON.stringify(
            (authResult.expiresIn * 1000) + new Date().getTime(),
          );

          authClient.client.userInfo(authResult.accessToken, (userInfoErr, profile) => {
            if (profile) {
              localStorage.setItem(authStorageItems.USERNAME, profile.name);
              dispatch(authActions.setUsername(profile.name));
            }
          });

          localStorage.setItem(authStorageItems.ACCESS_TOKEN, authResult.accessToken);
          localStorage.setItem(authStorageItems.EXPIRES_AT, expiresAt);
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
    dispatch(authActions.clearLocalStorage());
    dispatch(authActions.setUsername(''));
    dispatch(authActions.setAuthenticated(false));

    history.replace('/');
  };
}
