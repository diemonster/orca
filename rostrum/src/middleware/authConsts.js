import * as types from '../actions/actionTypes';


// Excepting actions used to manage authentication, we should check that
// the user is still authenticated before each action.
export const authExemptActions = [
  types.AUTH_ERROR,
  types.AUTH_CHECK_AUTHENTICATION,
  types.AUTH_CLEAR_LOCAL_STORAGE,
  types.AUTH_HANDLE_AUTHENTICATION,
  types.AUTH_LOGIN,
  types.AUTH_LOGOUT,
  types.AUTH_SET_AUTHENTICATED,
  types.AUTH_SET_USERNAME,
];

export const authStorageItems = {
  ACCESS_TOKEN: 'access_token',
  EXPIRES_AT: 'expires_at',
  USERNAME: 'username',
};
