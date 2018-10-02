export function namespaceReducer(state={}, action) {
  switch (action.type) {
    case "NAMESPACE_LIST_SUCCESS":
      return {
        ...state,
        namespaceObjects: action.namespaceObjects
      };

    case "NAMESPACE_CREATE_CHANGE_INPUT":
      return {
        ...state,
        namespaceCreateInput: action.namespaceCreateInput
      };

    case "NAMESPACE_DELETE_CHANGE_INPUT":
      return {
        ...state,
        namespaceDeleteInput: action.namespaceDeleteInput
      };

    default:
      return state;
  }
}
