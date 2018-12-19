import * as authMiddlewareActions from '../actions/authMiddlewareActions';
import * as types from '../actions/actionTypes';
import { authExemptActions } from './authConsts';


const authMiddleware = store => next => (action) => {
  if (!authExemptActions.includes(action.type)) {
    store.dispatch(authMiddlewareActions.checkAuthentication());
  }

  switch (action.type) {
    case types.AUTH_CHECK_AUTHENTICATION: {
      store.dispatch(authMiddlewareActions.checkAuthentication());
      break;
    }

    case types.AUTH_CLEAR_LOCAL_STORAGE: {
      store.dispatch(authMiddlewareActions.clearLocalStorage());
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
