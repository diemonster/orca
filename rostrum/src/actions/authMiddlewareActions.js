import { authError } from './authActions';


export function getCurrentUser(authClient) {
  return dispatch => authClient.getCurrentUser()
    .catch((err) => {
      dispatch(authError(err));
    });
}

export function handleAuthentication(authClient) {
  return dispatch => authClient.getCurrentUser()
    .catch((err) => {
      dispatch(authError(err));
    });
}

export function isAuthenticated(authClient) {
  return dispatch => authClient.getCurrentUser()
    .catch((err) => {
      dispatch(authError(err));
    });
}

export function login(authClient) {
  return dispatch => authClient.login()
    .catch((err) => {
      dispatch(authError(err));
    });
}

export function logout(authClient) {
  return dispatch => authClient.logout()
    .catch((err) => {
      dispatch(authError(err));
    });
}
