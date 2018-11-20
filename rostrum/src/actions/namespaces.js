import {
  NAMESPACE_CREATE,
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_DELETE,
  NAMESPACE_LIST,
  NAMESPACE_SELECT,
} from './actionTypes';

export function namespaceCreate(name) {
  return {
    type: NAMESPACE_CREATE,
    name,
  };
}

export function namespaceCreateChangeInput(namespaceCreateInput) {
  return {
    type: NAMESPACE_CREATE_CHANGE_INPUT,
    namespaceCreateInput,
  };
}

export function namespaceDelete(name) {
  return {
    type: NAMESPACE_DELETE,
    name,
  };
}

export function namespaceList() {
  return {
    type: NAMESPACE_LIST,
  };
}

export function namespaceSelect(namespace) {
  return {
    type: NAMESPACE_SELECT,
    namespace,
  };
}
