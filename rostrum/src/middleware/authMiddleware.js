import * as authMiddlewareActions from '../actions/authMiddlewareActions';
import * as types from '../actions/actionTypes';


const authMiddleware = store => next => (action) => {
  // Excepting actions used to manage authentication, we should check that
  // the user is still authenticated before each action.
  const exemptActions = [
    types.AUTH_ERROR,
    types.AUTH_CHECK_AUTHENTICATION,
    types.AUTH_HANDLE_AUTHENTICATION,
    types.AUTH_LOGIN,
    types.AUTH_LOGOUT,
    types.AUTH_SET_AUTHENTICATED,
    types.AUTH_SET_USERNAME,
  ];

  if (!exemptActions.includes(action.type)) {
    store.dispatch(authMiddlewareActions.checkAuthentication());
  }

  switch (action.type) {
    case types.AUTH_CHECK_AUTHENTICATION: {
      store.dispatch(authMiddlewareActions.checkAuthentication());
      break;
    }

    case types.AUTH_HANDLE_AUTHENTICATION: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.handleAuthentication(authClient, action.urlHash));
      break;
    }

    case types.AUTH_LOGIN: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.login(authClient));
      break;
    }

    case types.AUTH_LOGOUT: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.logout(authClient));
      break;
    }

    default:
      break;
  }

  next(action);
};

export default authMiddleware;
