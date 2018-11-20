import { ROLEBINDING_LIST_SUCCESS } from '../actions/actionTypes';

const initialState = {
  rolebindings: [],
};

export default function rolebindingReducer(state = initialState, action) {
  switch (action.type) {
    case ROLEBINDING_LIST_SUCCESS:
      return {
        ...state,
        rolebindings: action.rolebindings,
      };

    default:
      return state;
  }
}
