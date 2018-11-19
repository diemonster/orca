import K8sClient from './client';

import * as actions from './actions';
import {
  NAMESPACE_CREATE,
  NAMESPACE_DELETE,
  NAMESPACE_LIST,
  NAMESPACE_WATCH_FOR_DELETION,
  ROLEBINDING_LIST,
} from '../../actions/actionTypes';

const k8sMiddleware = store => next => (action) => {
  const state = store.getState();
  let { client } = state.config;

  if (!client) {
    const { proxyURL, getToken } = state.config;
    client = new K8sClient(proxyURL, getToken);
  }

  switch (action.type) {
    case NAMESPACE_CREATE:
      store.dispatch(actions.namespaceCreate(client, action.name));
      break;

    case NAMESPACE_DELETE:
      store.dispatch(actions.namespaceDelete(client, action.name));
      break;

    case NAMESPACE_LIST:
      store.dispatch(actions.namespaceList(client));
      break;

    case NAMESPACE_WATCH_FOR_DELETION:
      store.dispatch(actions.watchNamespaceDelete(client, action.name));
      break;

    case ROLEBINDING_LIST:
      store.dispatch(actions.rolebindingList(client, action.namespace));
      break;

    default:
      break;
  }

  next(action);
};

export default k8sMiddleware;
