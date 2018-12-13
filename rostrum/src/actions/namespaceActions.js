import * as types from './actionTypes';

export function namespaceCreate(namespace, username) {
  return {
    type: types.NAMESPACE_CREATE,
    namespace,
    username,
  };
}

export function namespaceCreateError(error) {
  return {
    type: types.NAMESPACE_CREATE_ERROR,
    error,
  };
}

export function namespaceCreateChangeInput(namespaceCreateInput) {
  return {
    type: types.NAMESPACE_CREATE_CHANGE_INPUT,
    namespaceCreateInput,
  };
}

export function namespaceDelete(namespace) {
  return {
    type: types.NAMESPACE_DELETE,
    namespace,
  };
}

export function namespaceDeleteCheckWatch(namespace, stop) {
  return {
    type: types.NAMESPACE_DELETE_CHECK_WATCH,
    namespace,
    stop,
  };
}

export function namespaceDeleteError(error) {
  return {
    type: types.NAMESPACE_DELETE_ERROR,
    error,
  };
}

export function namespaceDeleteStartWatch(namespace, interval) {
  return {
    type: types.NAMESPACE_DELETE_START_WATCH,
    namespace,
    interval,
  };
}

export function namespaceDeleteStopWatch(stop) {
  return {
    type: types.NAMESPACE_DELETE_STOP_WATCH,
    stop,
  };
}

export function namespaceList() {
  return {
    type: types.NAMESPACE_LIST,
  };
}

export function namespaceListError(error) {
  return {
    type: types.NAMESPACE_LIST_ERROR,
    error,
  };
}

export function namespaceListSuccess(namespaceObjects) {
  return {
    type: types.NAMESPACE_LIST_SUCCESS,
    namespaceObjects,
  };
}

export function namespaceSelect(namespace) {
  return {
    type: types.NAMESPACE_SELECT,
    namespace,
  };
}
