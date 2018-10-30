import { CONFIG_SET } from '../actions/actionTypes';

export default function configReducer(state = {}, action) {
  switch (action.type) {
    case CONFIG_SET:
      return {
        ...state,
        proxyUrl: action.config.proxyUrl,
      };

    default:
      return state;
  }
}
