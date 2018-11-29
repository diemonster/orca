import * as types from './actionTypes';


export function rolebindingCreate(namespace, role, subject) {
  return {
    type: types.ROLEBINDING_CREATE,
    namespace,
    role,
    subject,
  };
}

export function rolebindingCreateError(error) {
  return {
    type: types.ROLEBINDING_CREATE_ERROR,
    error,
  };
}

export function rolebindingCreateChangeInput(inputType, inputValue) {
  return {
    type: types.ROLEBINDING_CREATE_CHANGE_INPUT,
    inputType,
    inputValue,
  };
}

export function rolebindingList(namespace) {
  return {
    type: types.ROLEBINDING_LIST,
    namespace,
  };
}

export function rolebindingListError(error) {
  return {
    type: types.ROLEBINDING_LIST_ERROR,
    error,
  };
}

export function rolebindingListSuccess(namespace, rolebindings) {
  return {
    type: types.ROLEBINDING_LIST_SUCCESS,
    namespace,
    rolebindings,
  };
}
