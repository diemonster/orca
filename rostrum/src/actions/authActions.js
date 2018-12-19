import * as types from './actionTypes';


export function authError(error) {
  return {
    type: types.AUTH_ERROR,
    error,
  };
}

export function checkAuthentication() {
  return {
    type: types.AUTH_CHECK_AUTHENTICATION,
  };
}

export function clearLocalStorage() {
  return {
    type: types.AUTH_CLEAR_LOCAL_STORAGE,
  };
}

export function handleAuthentication(urlHash) {
  return {
    type: types.AUTH_HANDLE_AUTHENTICATION,
    urlHash,
  };
}

export function login() {
  return {
    type: types.AUTH_LOGIN,
  };
}

export function logout() {
  return {
    type: types.AUTH_LOGOUT,
  };
}

export function setAuthenticated(authenticated) {
  return {
    type: types.AUTH_SET_AUTHENTICATED,
    authenticated,
  };
}

export function setUsername(username) {
  return {
    type: types.AUTH_SET_USERNAME,
    username,
  };
}
