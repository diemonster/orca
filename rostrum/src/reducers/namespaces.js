import {
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_LIST_SUCCESS,
  NAMESPACE_SELECT,
} from '../actions/actionTypes';

const initialState = {
  namespaceObjects: [],
  namespaceCreateInput: '',
  selectedNamespace: '',
};

export default function namespaceReducer(state = initialState, action) {
  switch (action.type) {
    case NAMESPACE_CREATE_CHANGE_INPUT:
      return {
        ...state,
        namespaceCreateInput: action.namespaceCreateInput,
      };

    case NAMESPACE_LIST_SUCCESS:
      return {
        ...state,
        namespaceObjects: action.namespaceObjects,
      };

    case NAMESPACE_SELECT:
      return {
        ...state,
        selectedNamespace: action.namespace,
      };

    default:
      return state;
  }
}
