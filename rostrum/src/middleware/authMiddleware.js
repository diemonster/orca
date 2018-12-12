import * as authMiddlewareActions from '../actions/authMiddlewareActions';
import * as types from '../actions/actionTypes';


const authMiddleware = store => next => (action) => {
  switch (action.type) {
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

    case types.AUTH_HANDLE_AUTHENTICATION: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.handleAuthentication(authClient));
      break;
    }

    case types.AUTH_GET_CURRENT_USER: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.getCurrentUser(authClient));
      break;
    }

    case types.AUTH_CHECK_AUTHENTICATION: {
      const state = store.getState();
      const { authClient } = state.auth;

      store.dispatch(authMiddlewareActions.isAuthenticated(authClient));
      break;
    }

    default:
      break;
  }

  next(action);
};

export default authMiddleware;
