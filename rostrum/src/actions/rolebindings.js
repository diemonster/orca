import {
  ROLEBINDING_LIST,
  ROLEBINDING_CREATE,
  ROLEBINDING_CREATE_CHANGE_INPUT,
} from './actionTypes';

export function rolebindingCreate(namespace, role, subject) {
  return {
    type: ROLEBINDING_CREATE,
    namespace,
    role,
    subject,
  };
}

export function rolebindingCreateChangeInput(inputType, inputValue) {
  return {
    type: ROLEBINDING_CREATE_CHANGE_INPUT,
    inputType,
    inputValue,
  };
}

export function rolebindingList(namespace) {
  return {
    type: ROLEBINDING_LIST,
    namespace,
  };
}
