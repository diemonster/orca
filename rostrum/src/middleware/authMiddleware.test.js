import * as types from '../actions/actionTypes';
import * as authMiddlewareActions from '../actions/authMiddlewareActions';
import authMiddleware from './authMiddleware';


jest.mock('../actions/authMiddlewareActions');

describe('auth middleware', () => {
  const authClient = {};
  const state = {
    auth: { authClient },
  };

  let store;
  let next;
  let invoke;

  beforeEach(() => {
    jest.resetAllMocks();
    store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => state),
    };

    next = jest.fn();
    invoke = action => authMiddleware(store)(next)(action);
  });

  it('dispatches an auth action to check authentication', () => {
    const action = { type: types.AUTH_CHECK_AUTHENTICATION };

    invoke(action);

    expect(authMiddlewareActions.checkAuthentication).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches an auth action to handle authentication', () => {
    const urlHash = 'some hash';
    const action = { type: types.AUTH_HANDLE_AUTHENTICATION, urlHash };

    invoke(action);

    expect(authMiddlewareActions.handleAuthentication).toHaveBeenCalledWith(authClient, urlHash);
    expect(authMiddlewareActions.checkAuthentication).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches an auth action to log in', () => {
    const action = { type: types.AUTH_LOGIN };

    invoke(action);

    expect(authMiddlewareActions.login).toHaveBeenCalledWith(authClient);
    expect(authMiddlewareActions.checkAuthentication).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches an auth action to log out', () => {
    const action = { type: types.AUTH_LOGOUT };

    invoke(action);

    expect(authMiddlewareActions.logout).toHaveBeenCalledWith(authClient);
    expect(authMiddlewareActions.checkAuthentication).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('checks authentication, then passes along any non-auth action', () => {
    const action = { type: 'IRRELEVANT' };

    invoke(action);

    Object.keys(authMiddlewareActions).forEach((authMiddlewareAction) => {
      if (typeof authMiddlewareAction === 'function') {
        expect(authMiddlewareAction).not.toHaveBeenCalled();
      }
    });

    expect(authMiddlewareActions.checkAuthentication).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledWith(action);
  });
});
