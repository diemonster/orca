import * as types from '../actions/actionTypes';
import * as k8sMiddlewareActions from '../actions/k8sMiddlewareActions';
import * as rolebindingActions from '../actions/rolebindingActions';
import { initialState as namespaceInitialState } from '../reducers/namespaceReducer';
import { initialState as rolebindingInitialState } from '../reducers/rolebindingReducer';
import k8sMiddleware from './k8sMiddleware';
import watch from '../utils/watch';


jest.mock('../actions/k8sMiddlewareActions');
jest.mock('../actions/rolebindingActions');
jest.mock('../utils/watch');

describe('kubernetes middleware', () => {
  const k8sClient = {};
  const state = {
    k8s: { k8sClient },
    namespace: namespaceInitialState,
    rolebinding: rolebindingInitialState,
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
    invoke = action => k8sMiddleware(store)(next)(action);
  });

  it('dispatches a k8s action to create a namespace', () => {
    const namespace = 'new-namespace';
    const username = 'username';
    const action = { type: types.NAMESPACE_CREATE, namespace, username };

    invoke(action);

    expect(k8sMiddlewareActions.namespaceCreate)
      .toHaveBeenCalledWith(k8sClient, namespace, username);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to delete a namespace', () => {
    const namespace = 'some-namespace';
    const action = { type: types.NAMESPACE_DELETE, namespace };

    invoke(action);

    expect(k8sMiddlewareActions.namespaceDelete).toHaveBeenCalledWith(k8sClient, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to check for namespace deletion', () => {
    const namespace = 'some-namespace';
    const { selectedNamespace } = store.getState().namespace;
    const stop = jest.fn();
    const action = {
      type: types.NAMESPACE_DELETE_CHECK_WATCH, namespace, selectedNamespace, stop,
    };

    invoke(action);

    expect(k8sMiddlewareActions.namespaceDeleteCheckWatch).toHaveBeenCalledWith(
      k8sClient, namespace, selectedNamespace, stop,
    );

    expect(next).toHaveBeenCalledWith(action);
  });

  it('starts a watcher for namespace deletion', () => {
    const namespace = 'some-namespace';
    const interval = 10;
    const action = { type: types.NAMESPACE_DELETE_START_WATCH, namespace, interval };

    invoke(action);

    expect(watch).toHaveBeenCalledWith(interval, expect.any(Function));
    expect(next).toHaveBeenCalledWith(action);
  });

  it('calls a namespace deletion watcher\'s stop function', () => {
    const stop = jest.fn();
    const action = { type: types.NAMESPACE_DELETE_STOP_WATCH, stop };

    invoke(action);

    expect(stop).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to list namespaces', () => {
    const action = { type: types.NAMESPACE_LIST };

    invoke(action);

    expect(k8sMiddlewareActions.namespaceList).toHaveBeenCalledWith(k8sClient);
  });

  it('dispatches an action to list rolebindings on non-empty NAMESPACE_SELECT', () => {
    const namespace = 'some-namespace';
    const action = { type: types.NAMESPACE_SELECT, namespace };

    invoke(action);

    expect(rolebindingActions.rolebindingList).toHaveBeenCalledWith(namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not dispatch an action to list rolebindings on empty NAMESPACE_SELECT', () => {
    const namespace = '';
    const action = { type: types.NAMESPACE_SELECT, namespace };

    invoke(action);

    expect(rolebindingActions.rolebindingList).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to create a rolebinding', () => {
    const namespace = 'some-namespace';
    const role = 'some-role';
    const subject = 'some-subject';
    const action = {
      type: types.ROLEBINDING_CREATE, namespace, role, subject,
    };

    invoke(action);

    expect(k8sMiddlewareActions.rolebindingCreate)
      .toHaveBeenCalledWith(k8sClient, namespace, role, subject);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to delete a rolebinding', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const action = { type: types.ROLEBINDING_DELETE, namespace, rolebinding };

    invoke(action);

    expect(k8sMiddlewareActions.rolebindingDelete)
      .toHaveBeenCalledWith(k8sClient, namespace, rolebinding);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to check for rolebinding deletion', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const stop = jest.fn();
    const action = {
      type: types.ROLEBINDING_DELETE_CHECK_WATCH, namespace, rolebinding, stop,
    };

    invoke(action);

    expect(
      k8sMiddlewareActions.rolebindingDeleteCheckWatch,
    ).toHaveBeenCalledWith(
      k8sClient, namespace, rolebinding, stop,
    );

    expect(next).toHaveBeenCalledWith(action);
  });

  it('starts a watcher for rolebinding deletion', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const interval = 10;
    const action = {
      type: types.ROLEBINDING_DELETE_START_WATCH, namespace, rolebinding, interval,
    };

    invoke(action);

    expect(watch).toHaveBeenCalledWith(interval, expect.any(Function));
    expect(next).toHaveBeenCalledWith(action);
  });

  it('calls a rolebinding deletion watcher\'s stop function', () => {
    const stop = jest.fn();
    const action = { type: types.ROLEBINDING_DELETE_STOP_WATCH, stop };

    invoke(action);

    expect(stop).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to list rolebindings on ROLEBINDING_LIST', () => {
    const namespace = 'some-namespace';
    const action = { type: types.ROLEBINDING_LIST, namespace };

    invoke(action);

    expect(k8sMiddlewareActions.rolebindingList).toHaveBeenCalledWith(k8sClient, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes along any irrelevant action', () => {
    const action = { type: 'IRRELEVANT' };

    invoke(action);

    Object.keys(k8sMiddlewareActions).forEach((k8sMiddlewareAction) => {
      if (typeof k8sMiddlewareAction === 'function') {
        expect(k8sMiddlewareAction).not.toHaveBeenCalled();
      }
    });

    expect(next).toHaveBeenCalledWith(action);
  });
});
