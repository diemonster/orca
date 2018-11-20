import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import k8sMiddleware from './middleware';
import * as actions from './actions';
import * as types from '../../actions/actionTypes';

describe('middleware actions', () => {
  it('should create an action to indicate a namespace creation error', () => {
    const error = new Error();
    const expectedAction = {
      type: types.NAMESPACE_CREATE_ERROR,
      error,
    };

    expect(actions.namespaceCreateError(error)).toEqual(expectedAction);
  });

  it('should create an action to indicate a namespace deletion error', () => {
    const error = new Error();
    const expectedAction = {
      type: types.NAMESPACE_DELETE_ERROR,
      error,
    };

    expect(actions.namespaceDeleteError(error)).toEqual(expectedAction);
  });

  it('should create an action to indicate a namespace list error', () => {
    const error = new Error();
    const expectedAction = {
      type: types.NAMESPACE_LIST_ERROR,
      error,
    };

    expect(actions.namespaceListError(error)).toEqual(expectedAction);
  });

  it('should create an action to indicate a namespace list success', () => {
    const namespaceObjects = [{ namespace: 'any' }];
    const expectedAction = {
      type: types.NAMESPACE_LIST_SUCCESS,
      namespaceObjects,
    };

    expect(actions.namespaceListSuccess(namespaceObjects)).toEqual(expectedAction);
  });

  it('should create an action to watch a namespace as it\'s being deleted', () => {
    const name = 'some-namespace';
    const expectedAction = {
      type: types.NAMESPACE_WATCH_FOR_DELETION,
      name,
    };

    expect(actions.namespaceWatchForDeletion(name)).toEqual(expectedAction);
  });

  it('should create an action to indicate a rolebinding list error', () => {
    const error = new Error();
    const expectedAction = {
      type: types.ROLEBINDING_LIST_ERROR,
      error,
    };

    expect(actions.rolebindingListError(error)).toEqual(expectedAction);
  });

  it('should create an action to indicate a rolebinding list success', () => {
    const namespace = 'some-namespace';
    const rolebindings = ['rolebinding1', 'rolebinding2'];
    const expectedAction = {
      type: types.ROLEBINDING_LIST_SUCCESS,
      namespace,
      rolebindings,
    };

    expect(actions.rolebindingListSuccess(namespace, rolebindings)).toEqual(expectedAction);
  });
});

// TODO: figure out how to test watchNamepsaceDelete

// consts for async middleware tests
const middlewares = [thunk, k8sMiddleware];
const mockStore = configureMockStore(middlewares);

describe('middleware async actions', () => {
  it('on namespaceCreate success, should emit namespaceCreateChangeInput, namespaceList, and namespaceListSuccess actions', () => {
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

    return store.dispatch(actions.namespaceCreate(client, name))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on namespaceCreate failure, should emit namespaceCreateError and namespaceCreateChangeInput actions', () => {
    const error = new Error('failed as intended');
    const client = {
      createNamespace: jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      })),
    };

    const store = mockStore({ config: { client } });

    const name = 'new-namespace';
    const expectedActions = [
      { type: types.NAMESPACE_CREATE_ERROR, error },
      { type: types.NAMESPACE_CREATE_CHANGE_INPUT, namespaceCreateInput: '' },
    ];

    return store.dispatch(actions.namespaceCreate(client, name))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on namespaceDelete success, should emit namespaceWatchForDeletion action', () => {
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

    const watchNamespaceDelete = jest.spyOn(actions, 'watchNamespaceDelete');

    return store.dispatch(actions.namespaceDelete(client, name))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(watchNamespaceDelete).toHaveBeenCalledWith(client, name);
      });
  });

  it('on namespaceDelete failure, should emit namespaceDeleteError action', () => {
    const error = new Error('failed as intended');
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

    return store.dispatch(actions.namespaceDelete(client, name))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on namespaceList success, should emit namespaceListSuccess action', () => {
    const client = {
      listNamespaces: jest.fn(() => new Promise((resolve) => {
        resolve({ data: { items: [] } });
      })),
    };

    const store = mockStore({ config: { client } });

    const expectedActions = [
      { type: types.NAMESPACE_LIST_SUCCESS, namespaceObjects: [] },
    ];

    return store.dispatch(actions.namespaceList(client))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on namespaceList failure, should emit namespaceListError action', () => {
    const error = new Error('failed as intended');
    const client = {
      listNamespaces: jest.fn(() => new Promise((resolve, reject) => {
        reject(error);
      })),
    };

    const store = mockStore({ config: { client } });

    const expectedActions = [
      { type: types.NAMESPACE_LIST_ERROR, error },
    ];

    return store.dispatch(actions.namespaceList(client))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on rolebindingList success, should emit rolebindingListSuccess action', () => {
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

    return store.dispatch(actions.rolebindingList(client, namespace))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });

  it('on rolebindingList failure, should emit rolebindingListError action', () => {
    const error = new Error('failed as intended');
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

    return store.dispatch(actions.rolebindingList(client, namespace))
      .then(() => { expect(store.getActions()).toEqual(expectedActions); });
  });
});
