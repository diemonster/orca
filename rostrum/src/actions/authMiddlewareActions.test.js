import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';

import { authStorageItems } from '../middleware/authConsts';
import authMiddleware from '../middleware/authMiddleware';
import history from '../middleware/history';
import * as authMiddlewareActions from './authMiddlewareActions';
import * as types from './actionTypes';


jest.mock('toastr');

const middlewares = [thunk, authMiddleware];
const mockStore = configureMockStore(middlewares);

describe('auth middleware actions', () => {
  describe('checkAuthentication', () => {
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    it('does nothing when the user is authenticated', () => {
      global.localStorage = {
        getItem: jest.fn(() => new Date().getTime() + 1000),
        removeItem: jest.fn(),
      };

      store.dispatch(authMiddlewareActions.checkAuthentication());
      expect(store.getActions()).toEqual([]);
    });

    it('dispatches actions to log the user out when the user is not authenticated', () => {
      global.localStorage.getItem = jest.fn(() => new Date().getTime() - 1000);
      const expectedActions = [
        { type: types.AUTH_CLEAR_LOCAL_STORAGE },
        { type: types.AUTH_SET_AUTHENTICATED, authenticated: false },
        { type: types.AUTH_SET_USERNAME, username: '' },
      ];

      store.dispatch(authMiddlewareActions.checkAuthentication());
      expect(toastr.warning).toHaveBeenCalled();
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('clearLocalStorage', () => {
    it('calls localStorage.removeItem for each item in authStorageItems', () => {
      const store = mockStore();
      global.localStorage = {
        removeItem: jest.fn(),
      };

      store.dispatch(authMiddlewareActions.clearLocalStorage());
      Object.values(authStorageItems).forEach((item) => {
        expect(localStorage.removeItem).toHaveBeenCalledWith(item);
      });
    });
  });

  describe('handleAuthentication', () => {
    const accessToken = 'some access token';
    const username = 'some username';
    const urlHash = 'some hash';
    const authResult = { accessToken };
    const profile = { name: username };
    let authClient;
    let store;

    beforeEach(() => {
      global.localStorage = {
        getItem: jest.fn((arg) => {
          if (arg === authStorageItems.EXPIRES_AT) {
            return new Date().getTime() + 1000;
          }

          if (arg === authStorageItems.USERNAME) {
            return username;
          }

          return '';
        }),
        setItem: jest.fn(),
      };

      authClient = {
        parseHash: jest.fn((object, fn) => {
          fn(null, authResult);
        }),
        client: {
          userInfo: jest.fn((acessToken, fn) => {
            fn(null, profile);
          }),
        },
      };

      store = mockStore({ auth: { authClient } });
    });

    it('dispatches actions to repopulate redux store when user is authenticated in localStorage', () => {
      const expectedActions = [
        { type: types.AUTH_SET_AUTHENTICATED, authenticated: true },
        { type: types.AUTH_SET_USERNAME, username },
      ];

      store.dispatch(authMiddlewareActions.handleAuthentication(authClient, urlHash));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('populates localStorage and redux store when an auth hash is found in the URL', () => {
      localStorage.getItem = jest.fn((arg) => {
        if (arg === authStorageItems.EXPIRES_AT) {
          return new Date().getTime() - 1000;
        }

        if (arg === authStorageItems.USERNAME) {
          return username;
        }

        return '';
      });

      const expectedActions = [
        { type: types.AUTH_SET_USERNAME, username },
        { type: types.AUTH_SET_AUTHENTICATED, authenticated: true },
      ];

      store.dispatch(authMiddlewareActions.handleAuthentication(authClient, urlHash));
      expect(authClient.parseHash).toHaveBeenCalledWith({ hash: urlHash }, expect.anything());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('login', () => {
    it('calls authClient.authorize', () => {
      const authorize = jest.fn();
      const authClient = { authorize };
      const store = mockStore({ auth: { authClient } });

      store.dispatch(authMiddlewareActions.login(authClient));
      expect(authorize).toHaveBeenCalledWith();
    });
  });

  describe('logout', () => {
    it('dispatches actions to log the user out, then directs the user to the / route', () => {
      history.replace = jest.fn();
      global.localStorage = { removeItem: jest.fn() };
      const store = mockStore();
      const expectedActions = [
        { type: types.AUTH_CLEAR_LOCAL_STORAGE },
        { type: types.AUTH_SET_USERNAME, username: '' },
        { type: types.AUTH_SET_AUTHENTICATED, authenticated: false },
      ];

      store.dispatch(authMiddlewareActions.logout());
      expect(store.getActions()).toEqual(expectedActions);
      expect(history.replace).toHaveBeenCalledWith('/');
    });
  });
});
