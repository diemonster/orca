import { combineReducers } from 'redux';
import { namespaceReducer } from './namespaces';
import { rolebindingReducer } from './rolebindings';

// The keys in 'combineReducers({})' will be reflected in the state object,
// and any state a reducer sets will be namespaced under the reducer's key.
// For example, when the namespaceReducer sets state like this:
//
//     return { namespaceObjects: action.namespaceObjects };
//
// the state that gets produced actually looks like this:
//
//     {
//       namespace: {
//         namespaceCreateInput: '',
//         namespaceDeleteInput: '',
//         namespaceObjects: [ {..}, {..}, ... ]  <-- above reducer yields this line
//       },
//       rolebinding: {
//         rolebindingObjects: {
//           <namespace1>: [ {..}, {..}, ... ],
//           <namespace2>: [ {..}, {..}, ... ],
//           ...
//         }
//       }
//     }
//
// Thus, any 'mapStateToProps()' function will need to make sure that it's
// sourcing data from state appropriately:
//
//     return { nameOfProp: state.namespace.namespaceObjects };
//
const rootReducer = combineReducers({
  namespace: namespaceReducer,
  rolebinding: rolebindingReducer,
});

export default rootReducer;
