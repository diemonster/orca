import * as types from './actionTypes';

export function namespaceCreate(name) {
  return {
    type: types.NAMESPACE_CREATE,
    name,
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

export function namespaceDelete(name) {
  return {
    type: types.NAMESPACE_DELETE,
    name,
  };
}

export function namespaceDeleteError(error) {
  return {
    type: types.NAMESPACE_DELETE_ERROR,
    error,
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

export function namespaceWatchForDeletion(name) {
  return {
    type: types.NAMESPACE_WATCH_FOR_DELETION,
    name,
  };
}
