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
    let client;
    const name = 'new-namespace';

    beforeEach(() => {
      client = {
        createNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };
    });

    it('should reset input and list namespaces on success', () => {
      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      return store.dispatch(k8sActions.namespaceCreate(client, name))
        .then(() => {
          expect(client.createNamespace).toHaveBeenCalledWith(name);
          expect(client.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should reset input and emit an error on failure', () => {
      const error = new Error();
      client.createNamespace = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_CREATE_ERROR, error },
      ];

      return store.dispatch(k8sActions.namespaceCreate(client, name))
        .then(() => {
          expect(client.createNamespace).toHaveBeenCalledWith(name);
          expect(client.listNamespaces).not.toHaveBeenCalled();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('namespaceDelete', () => {
    const name = 'some-namespace';

    it('should kick off the watcher on success', () => {
      const client = {
        deleteNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_WATCH_FOR_DELETION, name },
      ];

      const watchNamespaceDelete = jest.spyOn(k8sActions, 'watchNamespaceDelete');

      return store.dispatch(k8sActions.namespaceDelete(client, name))
        .then(() => {
          expect(client.deleteNamespace).toHaveBeenCalledWith(name);
          expect(watchNamespaceDelete).toHaveBeenCalledWith(client, name);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      const client = {
        deleteNamespace: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.NAMESPACE_DELETE_ERROR, error },
      ];

      return store.dispatch(k8sActions.namespaceDelete(client, name))
        .then(() => {
          expect(client.deleteNamespace).toHaveBeenCalledWith(name);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('namespaceList', () => {
    it('should list namespace on success', () => {
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
        .then(() => {
          expect(client.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
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
        .then(() => {
          expect(client.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('rolebindingCreate', () => {
    let client;
    const namespace = 'some-namespace';
    const role = 'some-role';
    const subject = 'some-user';

    beforeEach(() => {
      client = {
        getRole: jest.fn(() => new Promise((resolve) => {
          resolve();
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
    });

    describe('if the role exists', () => {
      it('should create the rolebinding and then list them on success', () => {
        const store = mockStore({ config: { client } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
        ];

        return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).not.toHaveBeenCalled();
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingList failure', () => {
        const error = Error();
        client.listRolebindings = jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        }));

        const store = mockStore({ config: { client } });
        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_ERROR, error },
        ];

        return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).not.toHaveBeenCalled();
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingCreate failure', () => {
        const error = Error();
        client.createRolebinding = jest.fn(() => new Promise((resolve, reject) => reject(error)));

        const store = mockStore({ config: { client } });
        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_CREATE_ERROR, error },
        ];

        return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).not.toHaveBeenCalled();
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    describe('if the role does not yet exist', () => {
      it('should create the role, then create the rolebinding and list them on success', () => {
        client.getRole = jest.fn(() => new Promise((resolve, reject) => {
          const error = new Error();
          error.response = { status: 404 };
          reject(error);
        }));

        const store = mockStore({ config: { client } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
        ];

        return store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingList failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        client.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const listRolebindingsError = Error();
        client.listRolebindings = jest.fn(() => new Promise((resolve, reject) => {
          reject(listRolebindingsError);
        }));

        const store = mockStore({ config: { client } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_ERROR, error: listRolebindingsError },
        ];

        store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on createRolebinding failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        client.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const createRolebindingError = Error();
        client.createRolebinding = jest.fn(() => new Promise((resolve, reject) => {
          reject(createRolebindingError);
        }));

        const store = mockStore({ config: { client } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_CREATE_ERROR, error: createRolebindingError },
        ];

        store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(client.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on createRole failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        client.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const createRoleError = Error();
        client.createRole = jest.fn(() => new Promise((resolve, reject) => {
          reject(createRoleError);
        }));

        const store = mockStore({ config: { client } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLE_CREATE_ERROR, error: createRoleError },
        ];

        store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
          .then(() => {
            expect(client.getRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRole).toHaveBeenCalledWith(namespace, role);
            expect(client.createRolebinding).not.toHaveBeenCalled();
            expect(client.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    it('should emit an error on non-404 roleGet failure', () => {
      const error = Error();
      error.response = { status: 9001 };
      client.getRole = jest.fn(() => new Promise((resolve, reject) => reject(error)));

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
        { type: types.ROLE_GET_ERROR, error },
      ];

      store.dispatch(k8sActions.rolebindingCreate(client, namespace, role, subject))
        .then(() => {
          expect(client.getRole).toHaveBeenCalledWith(namespace, role);
          expect(client.createRole).not.toHaveBeenCalled();
          expect(client.createRolebinding).not.toHaveBeenCalled();
          expect(client.listRolebindings).not.toHaveBeenCalled();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('rolebindingList', () => {
    const namespace = 'some-namespace';

    it('should list namespaces on success', () => {
      const client = {
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
      ];

      return store.dispatch(k8sActions.rolebindingList(client, namespace))
        .then(() => {
          expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      const client = {
        listRolebindings: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ config: { client } });

      const expectedActions = [
        { type: types.ROLEBINDING_LIST_ERROR, error },
      ];

      return store.dispatch(k8sActions.rolebindingList(client, namespace))
        .then(() => {
          expect(client.listRolebindings).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });
});
