import { ROLEBINDING_LIST, ROLEBINDING_CREATE } from './actionTypes';

export function rolebindingList(namespace) {
  return {
    type: ROLEBINDING_LIST,
    namespace,
  };
}

export function rolebindingCreate() {
  return {
    type: ROLEBINDING_CREATE,
  };
}
