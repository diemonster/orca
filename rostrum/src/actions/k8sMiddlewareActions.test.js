import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import k8sMiddleware from '../middleware/k8sMiddleware';
import * as k8sMiddlewareActions from './k8sMiddlewareActions';
import * as types from './actionTypes';
import * as k8sRoleOptions from '../middleware/k8sRoleOptions';


const middlewares = [thunk, k8sMiddleware];
const mockStore = configureMockStore(middlewares);

describe('k8s middleware actions', () => {
  describe('namespaceCreate', () => {
    const namespace = 'new-namespace';
    const username = 'some-username';
    let k8sClient;

    beforeEach(() => {
      k8sClient = {
        createNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        createRole: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        createRolebinding: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };
    });

    it('should create a namespace and an admin role & rolebinding', () => {
      const store = mockStore({ k8s: { k8sClient } });
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, namespace, username))
        .then(() => {
          expect(k8sClient.createNamespace).toHaveBeenCalledWith(namespace);
          expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, k8sRoleOptions.ADMIN);
          expect(k8sClient.createRolebinding).toHaveBeenCalledWith(
            namespace, k8sRoleOptions.ADMIN, username,
          );
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error when namespace or username are missing', () => {
      let store = mockStore({ k8s: { k8sClient } });
      const error = Error('Namespace or username missing!');
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_CREATE_ERROR, error },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, namespace, ''));
      expect(store.getActions()).toEqual(expectedActions);

      store = mockStore({ k8s: { k8sClient } });
      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, '', username));
      expect(store.getActions()).toEqual(expectedActions);

      expect(k8sClient.createNamespace).not.toHaveBeenCalled();
      expect(k8sClient.createRole).not.toHaveBeenCalled();
      expect(k8sClient.createRolebinding).not.toHaveBeenCalled();
    });

    it('should emit an error on createNamespace failure', () => {
      const error = Error();
      k8sClient.createNamespace = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ k8s: { k8sClient } });
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.NAMESPACE_CREATE_ERROR, error },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, namespace, username))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(k8sClient.createNamespace).toHaveBeenCalledWith(namespace);
          expect(k8sClient.createRole).not.toHaveBeenCalled();
          expect(k8sClient.createRolebinding).not.toHaveBeenCalled();
        });
    });

    it('should emit an error on createRole failure', () => {
      const error = Error();
      k8sClient.createRole = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ k8s: { k8sClient } });
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.ROLE_CREATE_ERROR, error },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, namespace, username))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(k8sClient.createNamespace).toHaveBeenCalledWith(namespace);
          expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, k8sRoleOptions.ADMIN);
          expect(k8sClient.createRolebinding).not.toHaveBeenCalled();
        });
    });

    it('should emit an error on createRolebinding failure', () => {
      const error = Error();
      k8sClient.createRolebinding = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ k8s: { k8sClient } });
      const expectedActions = [
        { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
        { type: types.ROLEBINDING_CREATE_ERROR, error },
        { type: types.NAMESPACE_LIST },
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceCreate(k8sClient, namespace, username))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(k8sClient.createNamespace).toHaveBeenCalledWith(namespace);
          expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, k8sRoleOptions.ADMIN);
          expect(k8sClient.createRolebinding).toHaveBeenCalledWith(
            namespace, k8sRoleOptions.ADMIN, username,
          );
        });
    });
  });

  describe('namespaceDelete', () => {
    const namespace = 'some-namespace';

    it('should start a watcher on success', () => {
      const k8sClient = {
        deleteNamespace: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const interval = 10;
      const expectedActions = [
        { type: types.NAMESPACE_DELETE_START_WATCH, namespace, interval },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceDelete(k8sClient, namespace, interval))
        .then(() => {
          expect(k8sClient.deleteNamespace).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      const k8sClient = {
        deleteNamespace: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.NAMESPACE_DELETE_ERROR, error },
      ];

      return store.dispatch(k8sMiddlewareActions.namespaceDelete(k8sClient, namespace))
        .then(() => {
          expect(k8sClient.deleteNamespace).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('namespaceDeleteCheckWatch', () => {
    const namespace = 'some-namespace';
    const phase = 'Active';
    let k8sClient;
    let stop;

    beforeEach(() => {
      k8sClient = {
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({
            data: {
              items: [
                {
                  metadata: { name: namespace },
                  status: { phase },
                },
              ],
            },
          });
        })),
      };

      stop = jest.fn();
    });

    it('should not stop the watcher if the namespace is found', () => {
      const store = mockStore({ k8s: { k8sClient } });

      const namespaceObjects = [{ name: namespace, status: phase }];
      const expectedActions = [
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects },
      ];

      store.dispatch(k8sMiddlewareActions.namespaceDeleteCheckWatch(k8sClient, namespace, stop))
        .then(() => {
          expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('if the namespace is found', () => {
      it('should clear the selected namespace if it matches the watched namespace, then stop the watcher', () => {
        k8sClient.listNamespaces = jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        }));
        k8sClient.listRolebindings = jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        }));

        const selectedNamespace = namespace;
        const store = mockStore({
          config: { k8sClient },
          namespace: { selectedNamespace },
        });

        const namespaceObjects = [];
        const expectedActions = [
          { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects },
          { type: types.NAMESPACE_SELECT, namespace: '' },
          { type: types.NAMESPACE_DELETE_STOP_WATCH, stop },
        ];

        store.dispatch(k8sMiddlewareActions.namespaceDeleteCheckWatch(
          k8sClient, namespace, selectedNamespace, stop,
        ))
          .then(() => {
            expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should not clear the selected namespace if it does not match the watched namespace, then stop the watcher', () => {
        k8sClient.listNamespaces = jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        }));
        k8sClient.listRolebindings = jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        }));

        const selectedNamespace = 'some-different-namespace';
        const store = mockStore({
          config: { k8sClient },
          namespace: { selectedNamespace },
        });

        const namespaceObjects = [];
        const expectedActions = [
          { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects },
          { type: types.NAMESPACE_DELETE_STOP_WATCH, stop },
        ];

        store.dispatch(k8sMiddlewareActions.namespaceDeleteCheckWatch(
          k8sClient, namespace, selectedNamespace, stop,
        ))
          .then(() => {
            expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    it('should emit an error on listNamespaces failure', () => {
      const error = Error();
      k8sClient.listNamespaces = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.NAMESPACE_LIST_ERROR, error },
      ];

      return store.dispatch(k8sMiddlewareActions.namespaceDeleteCheckWatch(
        k8sClient, namespace, stop,
      ))
        .then(() => {
          expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('namespaceList', () => {
    it('should list namespace on success', () => {
      const k8sClient = {
        listNamespaces: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
      ];

      return store.dispatch(k8sMiddlewareActions.namespaceList(k8sClient))
        .then(() => {
          expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      const k8sClient = {
        listNamespaces: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.NAMESPACE_LIST_ERROR, error },
      ];

      return store.dispatch(k8sMiddlewareActions.namespaceList(k8sClient))
        .then(() => {
          expect(k8sClient.listNamespaces).toHaveBeenCalledWith();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('rolebindingCreate', () => {
    let k8sClient;
    const namespace = 'some-namespace';
    const role = 'some-role';
    const subject = 'some-user';

    beforeEach(() => {
      k8sClient = {
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
        const store = mockStore({ k8s: { k8sClient } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
        ];

        return store.dispatch(k8sMiddlewareActions.rolebindingCreate(
          k8sClient, namespace, role, subject,
        ))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).not.toHaveBeenCalled();
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingList failure', () => {
        const error = Error();
        k8sClient.listRolebindings = jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        }));

        const store = mockStore({ k8s: { k8sClient } });
        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_ERROR, error },
        ];

        return store.dispatch(k8sMiddlewareActions.rolebindingCreate(
          k8sClient, namespace, role, subject,
        ))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).not.toHaveBeenCalled();
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingCreate failure', () => {
        const error = Error();
        k8sClient.createRolebinding = jest.fn(() => new Promise(
          (resolve, reject) => reject(error),
        ));

        const store = mockStore({ k8s: { k8sClient } });
        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_CREATE_ERROR, error },
        ];

        return store.dispatch(k8sMiddlewareActions.rolebindingCreate(
          k8sClient, namespace, role, subject,
        ))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).not.toHaveBeenCalled();
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(k8sClient.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    describe('if the role does not yet exist', () => {
      it('should create the role, then create the rolebinding and list them on success', () => {
        k8sClient.getRole = jest.fn(() => new Promise((resolve, reject) => {
          const error = new Error();
          error.response = { status: 404 };
          reject(error);
        }));

        const store = mockStore({ k8s: { k8sClient } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
        ];

        return store.dispatch(k8sMiddlewareActions.rolebindingCreate(
          k8sClient, namespace, role, subject,
        ))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on rolebindingList failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        k8sClient.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const listRolebindingsError = Error();
        k8sClient.listRolebindings = jest.fn(() => new Promise((resolve, reject) => {
          reject(listRolebindingsError);
        }));

        const store = mockStore({ k8s: { k8sClient } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_LIST, namespace },
          { type: types.ROLEBINDING_LIST_ERROR, error: listRolebindingsError },
        ];

        store.dispatch(k8sMiddlewareActions.rolebindingCreate(k8sClient, namespace, role, subject))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            // expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on createRolebinding failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        k8sClient.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const createRolebindingError = Error();
        k8sClient.createRolebinding = jest.fn(() => new Promise((resolve, reject) => {
          reject(createRolebindingError);
        }));

        const store = mockStore({ k8s: { k8sClient } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLEBINDING_CREATE_ERROR, error: createRolebindingError },
        ];

        store.dispatch(k8sMiddlewareActions.rolebindingCreate(k8sClient, namespace, role, subject))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRolebinding).toHaveBeenCalledWith(namespace, role, subject);
            expect(k8sClient.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('should emit an error on createRole failure', () => {
        const getRoleError = Error();
        getRoleError.response = { status: 404 };
        k8sClient.getRole = jest.fn(() => new Promise((resolve, reject) => reject(getRoleError)));

        const createRoleError = Error();
        k8sClient.createRole = jest.fn(() => new Promise((resolve, reject) => {
          reject(createRoleError);
        }));

        const store = mockStore({ k8s: { k8sClient } });

        const expectedActions = [
          { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
          { type: types.ROLE_CREATE_ERROR, error: createRoleError },
        ];

        store.dispatch(k8sMiddlewareActions.rolebindingCreate(k8sClient, namespace, role, subject))
          .then(() => {
            expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRole).toHaveBeenCalledWith(namespace, role);
            expect(k8sClient.createRolebinding).not.toHaveBeenCalled();
            expect(k8sClient.listRolebindings).not.toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    it('should emit an error on non-404 roleGet failure', () => {
      const error = Error();
      error.response = { status: 9001 };
      k8sClient.getRole = jest.fn(() => new Promise((resolve, reject) => reject(error)));

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.ROLEBINDING_CREATE_CHANGE_INPUT, inputType: 'subject', inputValue: '' },
        { type: types.ROLE_GET_ERROR, error },
      ];

      store.dispatch(k8sMiddlewareActions.rolebindingCreate(k8sClient, namespace, role, subject))
        .then(() => {
          expect(k8sClient.getRole).toHaveBeenCalledWith(namespace, role);
          expect(k8sClient.createRole).not.toHaveBeenCalled();
          expect(k8sClient.createRolebinding).not.toHaveBeenCalled();
          expect(k8sClient.listRolebindings).not.toHaveBeenCalled();
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('rolebindingDelete', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const interval = 10;
    let k8sClient;

    beforeEach(() => {
      k8sClient = {
        deleteRolebinding: jest.fn(() => new Promise((resolve) => {
          resolve();
        })),
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };
    });

    it('should start a watcher on success', () => {
      const store = mockStore({ k8s: { k8sClient } });
      const expectedActions = [
        {
          type: types.ROLEBINDING_DELETE_START_WATCH, namespace, rolebinding, interval,
        },
      ];

      store.dispatch(k8sMiddlewareActions.rolebindingDelete(
        k8sClient, namespace, rolebinding, interval,
      ))
        .then(() => {
          expect(k8sClient.deleteRolebinding).toHaveBeenCalledWith(namespace, rolebinding);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      k8sClient.deleteRolebinding = jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      }));

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.ROLEBINDING_DELETE_ERROR, error },
      ];

      return store.dispatch(k8sMiddlewareActions.rolebindingDelete(
        k8sClient, namespace, rolebinding,
      ))
        .then(() => {
          expect(k8sClient.deleteRolebinding).toHaveBeenCalledWith(namespace, rolebinding);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('rolebindingList', () => {
    const namespace = 'some-namespace';

    it('should list namespaces on success', () => {
      const k8sClient = {
        listRolebindings: jest.fn(() => new Promise((resolve) => {
          resolve({ data: { items: [] } });
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.ROLEBINDING_LIST_SUCCESS, namespace, rolebindings: [] },
      ];

      return store.dispatch(k8sMiddlewareActions.rolebindingList(k8sClient, namespace))
        .then(() => {
          expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should emit an error on failure', () => {
      const error = new Error();
      const k8sClient = {
        listRolebindings: jest.fn(() => new Promise((resolve, reject) => {
          reject(error);
        })),
      };

      const store = mockStore({ k8s: { k8sClient } });

      const expectedActions = [
        { type: types.ROLEBINDING_LIST_ERROR, error },
      ];

      return store.dispatch(k8sMiddlewareActions.rolebindingList(k8sClient, namespace))
        .then(() => {
          expect(k8sClient.listRolebindings).toHaveBeenCalledWith(namespace);
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });
});
