import * as types from '../../actions/actionTypes';
import * as k8sActions from './k8sActions';
import * as rolebindingActions from '../../actions/rolebindings';
import k8sMiddleware from './middleware';
import watch from '../../utils/watch';

jest.mock('./k8sActions');
jest.mock('../../actions/rolebindings');
jest.mock('../../utils/watch');

describe('kubernetes middleware', () => {
  const client = {};
  let store;
  let next;
  let invoke;

  beforeEach(() => {
    jest.resetAllMocks();
    store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        config: {
          client,
        },
      })),
    };

    next = jest.fn();
    invoke = action => k8sMiddleware(store)(next)(action);
  });

  it('dispatches a k8s action to create a namespace', () => {
    const namespace = 'new-namespace';
    const action = { type: types.NAMESPACE_CREATE, namespace };

    invoke(action);

    expect(k8sActions.namespaceCreate).toHaveBeenCalledWith(client, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to delete a namespace', () => {
    const namespace = 'some-namespace';
    const action = { type: types.NAMESPACE_DELETE, namespace };

    invoke(action);

    expect(k8sActions.namespaceDelete).toHaveBeenCalledWith(client, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatchs a k8s action to check for namespace deletion', () => {
    const namespace = 'some-namespace';
    const stop = jest.fn();
    const action = { type: types.NAMESPACE_DELETE_CHECK_WATCH, namespace, stop };

    invoke(action);

    expect(k8sActions.namespaceDeleteCheckWatch).toHaveBeenCalledWith(client, namespace, stop);
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

    expect(k8sActions.namespaceList).toHaveBeenCalledWith(client);
  });

  it('dispatches an action to list rolebindings on NAMESPACE_SELECT', () => {
    const namespace = 'some-namespace';
    const action = { type: types.NAMESPACE_SELECT, namespace };

    invoke(action);

    expect(rolebindingActions.rolebindingList).toHaveBeenCalledWith(namespace);
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

    expect(k8sActions.rolebindingCreate).toHaveBeenCalledWith(client, namespace, role, subject);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatches a k8s action to delete a rolebinding', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const action = { type: types.ROLEBINDING_DELETE, namespace, rolebinding };

    invoke(action);

    expect(k8sActions.rolebindingDelete).toHaveBeenCalledWith(client, namespace, rolebinding);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dispatchs a k8s action to check for rolebinding deletion', () => {
    const namespace = 'some-namespace';
    const rolebinding = 'some-rolebinding';
    const stop = jest.fn();
    const action = {
      type: types.ROLEBINDING_DELETE_CHECK_WATCH, namespace, rolebinding, stop,
    };

    invoke(action);

    expect(
      k8sActions.rolebindingDeleteCheckWatch,
    ).toHaveBeenCalledWith(
      client, namespace, rolebinding, stop,
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

    expect(k8sActions.rolebindingList).toHaveBeenCalledWith(client, namespace);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes along any irrelevant action', () => {
    const action = { type: 'IRRELEVANT' };

    invoke(action);

    Object.keys(k8sActions).forEach((k8sAction) => {
      if (typeof k8sAction === 'function') {
        expect(k8sAction).not.toHaveBeenCalled();
      }
    });

    expect(next).toHaveBeenCalledWith(action);
  });
});
