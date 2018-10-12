//
// The ROLEBINDING_LIST_SUCCESS action yields an object like so:
//
//     { <name of namespace>: [ <array of rolebinding objects> ] }
//
// where <name of namespace> is a unique key. This key is a dynamic
// "computed property name", which is achieved by evaluating an
// expression inside of square brackets. For example:
//
//     { [evaluateThis()]: "value to be stored" }
//
// or
//
//     { [someObject.someProperty]: "value to be stored" }
//
// Further, in order to add one of these objects to the state
// instead of overwriting the whole state, we can use object spreading
//
//     ...someObject
//
// to dump in whatever other rolebinding objects may already exist
// in the state, and then add the entry that the action has given us.
//
//
// The shape of the rolebinding object in state should look as such:
//
//     {
//       rolebinding: {
//         namespacedRolebindings: {
//           <namespace name>: [ <rolebinding names> ],
//           <namespace name>: [ <rolebinding names> ],
//           ...
//         }
//       }
//     }
//
export function rolebindingReducer(state = {}, action) {
  switch (action.type) {
    case 'ROLEBINDING_LIST_SUCCESS':
      return {
        ...state,
        namespacedRolebindings: {
          ...state.namespacedRolebindings,
          [action.namespace]: action.rolebindings,
        },
      };

    default:
      return state;
  }
}
