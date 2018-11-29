import K8sClient from './client';
import * as k8sActions from './k8sActions';
import * as namespaceActions from '../../actions/namespaces';
import * as types from '../../actions/actionTypes';
import watch from '../../utils/watch';


const k8sMiddleware = store => next => (action) => {
  const state = store.getState();
  let { client } = state.config;

  if (!client) {
    const { proxyURL, getToken } = state.config;
    client = new K8sClient(proxyURL, getToken);
  }

  switch (action.type) {
    case types.NAMESPACE_CREATE:
      store.dispatch(k8sActions.namespaceCreate(client, action.namespace));
      break;

    case types.NAMESPACE_DELETE:
      store.dispatch(k8sActions.namespaceDelete(client, action.namespace));
      break;

    case types.NAMESPACE_DELETE_CHECK_WATCH:
      store.dispatch(k8sActions.namespaceDeleteCheckWatch(client, action.namespace, action.stop));
      break;

    case types.NAMESPACE_DELETE_START_WATCH:
      watch(action.interval, (stop) => {
        store.dispatch(namespaceActions.namespaceDeleteCheckWatch(action.namespace, stop));
      });

      break;

    case types.NAMESPACE_DELETE_STOP_WATCH:
      action.stop();
      break;

    case types.NAMESPACE_LIST:
      store.dispatch(k8sActions.namespaceList(client));
      break;

    case types.NAMESPACE_SELECT:
      store.dispatch(k8sActions.rolebindingList(client, action.namespace));
      break;

    case types.ROLEBINDING_CREATE:
      store.dispatch(k8sActions.rolebindingCreate(
        client,
        action.namespace,
        action.role,
        action.subject,
      ));

      break;

    case types.ROLEBINDING_LIST:
      store.dispatch(k8sActions.rolebindingList(client, action.namespace));
      break;

    default:
      break;
  }

  next(action);
};

export default k8sMiddleware;
