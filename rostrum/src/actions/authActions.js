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

export function getCurrentUser() {
  return {
    type: types.AUTH_GET_CURRENT_USER,
  };
}

export function handleAuthentication() {
  return {
    type: types.AUTH_HANDLE_AUTHENTICATION,
  };
}

export function isAuthenticated() {
  return {
    type: types.AUTH_CHECK_AUTHENTICATION,
  };
}

export function login() {
  console.log('creating login action');
  return {
    type: types.AUTH_LOGIN,
  };
}

export function logout() {
  return {
    type: types.AUTH_LOGOUT,
  };
}

export function setUsername(username) {
  return {
    type: types.SET_USERNAME,
    username,
  };
}
