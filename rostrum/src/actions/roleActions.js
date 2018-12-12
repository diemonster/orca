import * as types from './actionTypes';

export function roleCreate(namespace, role) {
  return {
    type: types.ROLE_CREATE,
    namespace,
    role,
  };
}

export function roleCreateError(error) {
  return {
    type: types.ROLE_CREATE_ERROR,
    error,
  };
}

export function roleGet(role) {
  return {
    type: types.ROLE_GET,
    role,
  };
}

export function roleGetError(error) {
  return {
    type: types.ROLE_GET_ERROR,
    error,
  };
}
