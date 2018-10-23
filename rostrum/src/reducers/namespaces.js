import {
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_DELETE_CHANGE_INPUT,
  NAMESPACE_LIST,
} from '../actions/actionTypes';

export default function namespaceReducer(state = {}, action) {
  switch (action.type) {
    case NAMESPACE_LIST:
      return {
        ...state,
        namespaceObjects: action.namespaceObjects,
      };

    case NAMESPACE_CREATE_CHANGE_INPUT:
      return {
        ...state,
        namespaceCreateInput: action.namespaceCreateInput,
      };

    case NAMESPACE_DELETE_CHANGE_INPUT:
      return {
        ...state,
        namespaceDeleteInput: action.namespaceDeleteInput,
      };

    default:
      return state;
  }
}
