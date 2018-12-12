import * as k8sMiddlewareActions from '../actions/k8sMiddlewareActions';
import * as namespaceActions from '../actions/namespaceActions';
import * as rolebindingActions from '../actions/rolebindingActions';
import * as types from '../actions/actionTypes';
import watch from '../utils/watch';


const k8sMiddleware = store => next => (action) => {
  switch (action.type) {
    case types.NAMESPACE_CREATE: {
      const state = store.getState();
      const { k8sClient } = state.k8s;
      const { authClient } = state.auth;
      const currentUser = authClient.getCurrentUser();

      store.dispatch(k8sMiddlewareActions.namespaceCreate(
        k8sClient, action.namespace, currentUser,
      ));

      break;
    }

    case types.NAMESPACE_DELETE: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.namespaceDelete(
        k8sClient, action.namespace,
      ));

      break;
    }

    case types.NAMESPACE_DELETE_CHECK_WATCH: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.namespaceDeleteCheckWatch(
        k8sClient, action.namespace, state.namespace.selectedNamespace, action.stop,
      ));

      break;
    }

    case types.NAMESPACE_DELETE_START_WATCH: {
      watch(action.interval, (stop) => {
        store.dispatch(namespaceActions.namespaceDeleteCheckWatch(
          action.namespace, stop,
        ));
      });

      break;
    }

    case types.NAMESPACE_DELETE_STOP_WATCH: {
      action.stop();
      break;
    }

    case types.NAMESPACE_LIST: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.namespaceList(k8sClient));
      break;
    }

    case types.NAMESPACE_SELECT: {
      if (action.namespace !== '') {
        store.dispatch(rolebindingActions.rolebindingList(action.namespace));
      }

      break;
    }

    case types.ROLEBINDING_CREATE: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.rolebindingCreate(
        k8sClient, action.namespace, action.role, action.subject,
      ));

      break;
    }

    case types.ROLEBINDING_DELETE: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.rolebindingDelete(
        k8sClient, action.namespace, action.rolebinding,
      ));

      break;
    }

    case types.ROLEBINDING_DELETE_CHECK_WATCH: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.rolebindingDeleteCheckWatch(
        k8sClient, action.namespace, action.rolebinding, action.stop,
      ));

      break;
    }

    case types.ROLEBINDING_DELETE_START_WATCH: {
      watch(action.interval, (stop) => {
        store.dispatch(rolebindingActions.rolebindingDeleteCheckWatch(
          action.namespace, action.rolebinding, stop,
        ));
      });

      break;
    }

    case types.ROLEBINDING_DELETE_STOP_WATCH: {
      action.stop();
      break;
    }

    case types.ROLEBINDING_LIST: {
      const state = store.getState();
      const { k8sClient } = state.k8s;

      store.dispatch(k8sMiddlewareActions.rolebindingList(k8sClient, action.namespace));
      break;
    }

    default:
      break;
  }

  next(action);
};

export default k8sMiddleware;
