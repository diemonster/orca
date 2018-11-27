import {
  ROLEBINDING_CREATE_CHANGE_INPUT,
  ROLEBINDING_LIST_SUCCESS,
} from '../actions/actionTypes';

const roleOptions = ['admin'];
const roleInput = roleOptions[0];
export const initialState = {
  rolebindings: [],
  roleInput,
  roleOptions,
  subjectInput: '',
};

export default function rolebindingReducer(state = initialState, action) {
  switch (action.type) {
    case ROLEBINDING_CREATE_CHANGE_INPUT:
      if (action.inputType === 'subject') {
        return {
          ...state,
          subjectInput: action.inputValue,
        };
      }

      if (action.inputType === 'role') {
        return {
          ...state,
          roleInput: action.inputValue,
        };
      }

      return state;

    case ROLEBINDING_LIST_SUCCESS:
      return {
        ...state,
        rolebindings: action.rolebindings,
      };

    default:
      return state;
  }
}
