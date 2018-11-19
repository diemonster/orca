import { ROLEBINDING_LIST } from './actionTypes';

export function rolebindingList(namespace) {
  return {
    type: ROLEBINDING_LIST,
    namespace,
  };
}
