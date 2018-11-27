import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import k8sMiddleware from './middleware';
import * as k8sActions from './k8sActions';
import * as types from '../../actions/actionTypes';


// TODO: figure out how to test watchNamespaceDelete

const middlewares = [thunk, k8sMiddleware];
const mockStore = configureMockStore(middlewares);

describe('k8s middleware actions', () => {
  describe('namespaceCreate', () => {
    it('should emit namespaceCreateChangeInput, namespaceList, and namespaceListSuccess actions on success', () => {
      const client = {
        createNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const name = 'new-namespace';
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      return store.dispatch(k8sActions.namespaceCreate(client, name))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });

    it('should emit namespaceCreateChangeInput and namespaceCreateError actions on failure', () => {
      const error = new Error();
      const client = {
        createNamespace: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const name = 'new-namespace';
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_CREATE_ERROR, error },
      ];

      return store.dispatch(k8sActions.namespaceCreate(client, name))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });
  });

  describe('namespaceDelete', () => {
    it('should emit namespaceWatchForDeletion action on success', () => {
      const client = {
        deleteNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
      };

      const store = mockStore({ config: { client } });

      const name = 'some-namespace';
      const expectedActions = [
        { type: types.NAMESPACE_WATCH_FOR_DELETION, name },
      ];

      const watchNamespaceDelete = jest.spyOn(k8sActions, 'watchNamespaceDelete');

      return store.dispatch(k8sActions.namespaceDelete(client, name))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(watchNamespaceDelete).toHaveBeenCalledWith(client, name);
        });
    });

    it('should emit namespaceDeleteError action on failure', () => {
      const error = new Error();
      const client = {
        deleteNamespace: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const name = 'some-namespace';
      const expectedActions = [
        { type: types.NAMESPACE_DELETE_ERROR, error },
      ];

      return store.dispatch(k8sActions.namespaceDelete(client, name))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });
  });

  describe('namespaceList', () => {
    it('should emit namespaceListSuccess action on success', () => {
      const client = {
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      return store.dispatch(k8sActions.namespaceList(client))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });

    it('should emit namespaceListError action on failure', () => {
      const error = new Error();
      const client = {
        listNamespaces: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_LIST_ERROR, error },
      ];

      return store.dispatch(k8sActions.namespaceList(client))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });
  });

  describe('rolebindingCreate', () => {
    // getRole: success, createRolebinding: success, listRolebindings: success,
    //   rolebindingListSuccess
    it('should create and then list rolebindings when getRole succeeds', () => {
      const client = {
        getRole: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        createRolebinding: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const namespace = 'some-namespace';
      const role = 'some-role';
      const subject = 'some-user';
      const expectedActions = [
        { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
        { type: types.ROLEBINDING_LIST, namespace },
        { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
      ];

      return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });

    // getRole: success, createRolebinding: success, listRolebindings: failure, rolebindingListError
    it('should emit ROLEBINDING_LIST_ERROR when listRolebindings fails after createRolebinding and getRole succeed', () => {});

    // getRole: success,  createRolebinding: failure, rolebindingCreateError
    it('should emit ROLEBINDING_CREATE_ERROR when createRolebinding fails after getRole succeeds', () => {});

    // getRole: 404, createRole: success, createRolebinding: success,
    //   listRolebindings: success, rolebindingListSuccess
    it('should create and then list rolebindings when createRole succeeds after getRole fails with 404', () => {
      const client = {
        getRole: jest.fn(() => new Promise((resolve, reject) => {
          const error = new Error();
          error.response = { status: 404 };
          reject(error);
        })),
        createRole: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        createRolebinding: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const namespace = 'some-namespace';
      const role = 'some-role';
      const subject = 'some-user';
      const expectedActions = [
        { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
        { type: types.ROLEBINDING_LIST, namespace },
        { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
      ];

      return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });

    // getRole: 404, createRole: success, createRolebinding: success,
    //   listRolebindings: failure, rolebindingListError
    it('should emit ROLEBINDING_LIST_ERROR when listRolebindings fails after createRolebinding and createRole succeed and getRole fails with 404', () => {});

    // getRole: 404, createRole: success, createRolebinding: failure, rolebindingCreateError
    it('should emit ROLEBINDING_CREATE_ERROR when createRolebinding fails after createRole succeeds and getRole fails with 404', () => {});

    // getRole: 404, createRole: failure, roleCreateError
    it('should emit ROLE_CREATE_ERROR when createRole fails and getRole fails with 404', () => {
    });

    // getRole: failure, roleGetError
    it('should emit ROLE_GET_ERROR when getRole fails with not 404', () => {
    });
  });

  describe('rolebindingList', () => {
    it('should emit rolebindingListSuccess action on success', () => {
      const client = {
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const namespace = 'some-namespace';
      const expectedActions = [
        { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
      ];

      return store.dispatch(k8sActions.rolebindingList(client, namespace))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });

    it('should emit rolebindingListError action on failure', () => {
      const error = new Error();
      const client = {
        listRolebindings: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const namespace = 'some-namespace';
      const expectedActions = [
        { type: types.ROLEBINDING_LIST_ERROR, error },
      ];

      return store.dispatch(k8sActions.rolebindingList(client, namespace))
        .then(() => { expect(store.getActions()).toEqual(expectedActions); });
    });
  });
});
