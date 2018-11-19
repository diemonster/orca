import {
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_DELETE_CHANGE_INPUT,
  NAMESPACE_LIST_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  namespaceObjects: [],
  namespaceCreateInput: '',
  namespaceDeleteInput: '',
};

export default function namespaceReducer(state = initialState, action) {
  switch (action.type) {
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

    case NAMESPACE_LIST_SUCCESS:
      return {
        ...state,
        namespaceObjects: action.namespaceObjects,
      };

    default:
      return state;
  }
}
