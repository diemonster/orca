import * as types from '../../actions/actionTypes';
import * as k8sActions from './k8sActions';
import k8sMiddleware from './middleware';


const create = () => {
  const client = {
    createNamespace: jest.fn(),
    deleteNamespace: jest.fn(),
    listNamespaces: jest.fn(),
    listRolebindings: jest.fn(),
  };

  const config = { client };

  const store = {
    getState: jest.fn(() => ({ config })),
    dispatch: jest.fn(),
  };

  const next = jest.fn();
  const invoke = action => k8sMiddleware(store)(next)(action);

  return {
    store, next, invoke, client,
  };
};

describe('kubernetes middleware', () => {
  it('passes along any irrelevant action', () => {
    const { next, invoke } = create();
    const action = { type: 'IRRELEVANT' };

    const namespaceCreate = jest.spyOn(k8sActions, 'namespaceCreate');
    const namespaceDelete = jest.spyOn(k8sActions, 'namespaceDelete');
    const namespaceList = jest.spyOn(k8sActions, 'namespaceList');
    const rolebindingList = jest.spyOn(k8sActions, 'rolebindingList');

    invoke(action);

    expect(namespaceCreate).not.toHaveBeenCalled();
    expect(namespaceDelete).not.toHaveBeenCalled();
    expect(namespaceList).not.toHaveBeenCalled();
    expect(rolebindingList).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('correctly dispatches an action to create a namespace', () => {
    const { next, invoke, client } = create();
    const name = 'new-namespace';
    const action = { type: types.NAMESPACE_CREATE, name };

    const namespaceCreate = jest.spyOn(k8sActions, 'namespaceCreate');

    invoke(action);

    expect(namespaceCreate).toHaveBeenCalledWith(client, name);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('correctly dispatches an action to delete a namespace', () => {
    const { next, invoke, client } = create();
    const name = 'some-namespace';
    const action = { type: types.NAMESPACE_DELETE, name };

    const namespaceDelete = jest.spyOn(k8sActions, 'namespaceDelete');

    invoke(action);

    expect(namespaceDelete).toHaveBeenCalledWith(client, name);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('correctly dispatches an action to list namespaces', () => {
    const { next, invoke, client } = create();
    const action = { type: types.NAMESPACE_LIST };

    const namespaceList = jest.spyOn(k8sActions, 'namespaceList');

    invoke(action);

    expect(namespaceList).toHaveBeenCalledWith(client);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('correctly dispatches an action to watch a namespace for deletion', () => {
    const { next, invoke, client } = create();
    const name = 'some-namespace';
    const action = { type: types.NAMESPACE_WATCH_FOR_DELETION, name };

    const watchNamespaceDelete = jest.spyOn(k8sActions, 'watchNamespaceDelete');

    invoke(action);

    expect(watchNamespaceDelete).toHaveBeenCalledWith(client, name);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('correctly dispatches an action to list rolebindings', () => {
    const { next, invoke, client } = create();
    const namespace = 'some-namespace';
    const action = { type: types.ROLEBINDING_LIST, namespace };

    const rolebindingList = jest.spyOn(k8sActions, 'rolebindingList');

    invoke(action);

    expect(rolebindingList).toHaveBeenCalledWith(client, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });
});
