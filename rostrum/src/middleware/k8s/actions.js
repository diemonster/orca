import watch from '../../utils/watch';
import {
  NAMESPACE_CREATE_ERROR,
  NAMESPACE_DELETE_ERROR,
  NAMESPACE_LIST,
  NAMESPACE_LIST_ERROR,
  NAMESPACE_LIST_SUCCESS,
  NAMESPACE_WATCH_FOR_DELETION,
  ROLEBINDING_LIST_ERROR,
  ROLEBINDING_LIST_SUCCESS,
} from '../../actions/actionTypes';

import {
  namespaceCreateChangeInput,
  namespaceDeleteChangeInput,
} from '../../actions/namespaces';

export function namespaceCreateError(error) {
  return {
    type: NAMESPACE_CREATE_ERROR,
    error,
  };
}

export function namespaceCreate(client, name) {
  return dispatch => client.createNamespace(name)
    .then(() => {
      dispatch(namespaceCreateChangeInput(''));

      // I could also call dispatch(namespaceList(client)) here,
      // but I think that it's cleaner and more explicit to emit
      // the action that will kick off the list process. I think
      // it's better for logging, debug, etc. if we use actions
      // to control flow as much as possible.
      dispatch({ type: NAMESPACE_LIST });
    })
    .catch((error) => {
      dispatch(namespaceCreateError(error));
      dispatch(namespaceCreateChangeInput(''));
    });
}

export function namespaceDeleteError(error) {
  return {
    type: NAMESPACE_DELETE_ERROR,
    error,
  };
}

export function namespaceWatchForDeletion(name) {
  return {
    type: NAMESPACE_WATCH_FOR_DELETION,
    name,
  };
}

export function watchNamespaceDelete(client, name) {
  return (dispatch) => {
    watch(2000, (stop) => {
    // todo: combine these two calls into one
      dispatch({ type: NAMESPACE_LIST });
      client.listNamespaces()
        .then((response) => {
          for (let i = 0; i < response.data.items.length; i += 1) {
            if (response.data.items[i].metadata.name === name) {
              return;
            }
          }

          stop();
        });
    });
  };
}

export function namespaceDelete(client, name) {
  return dispatch => client.deleteNamespace(name)
    .then(() => {
      dispatch(namespaceDeleteChangeInput(''));
      dispatch(namespaceWatchForDeletion(name));
      // watchNamespaceDelete(name, dispatch, client);
    })
    .catch((error) => {
      dispatch(namespaceDeleteError(error));
      dispatch(namespaceDeleteChangeInput(''));
    });
}

export function namespaceListError(error) {
  return {
    type: NAMESPACE_LIST_ERROR,
    error,
  };
}

export function namespaceListSuccess(namespaceObjects) {
  return {
    type: NAMESPACE_LIST_SUCCESS,
    namespaceObjects,
  };
}

export function namespaceList(client) {
  return dispatch => client.listNamespaces()
    .then((response) => {
      const { items } = response.data;
      const namespaceObjects = items.map(namespace => ({
        name: namespace.metadata.name,
        status: namespace.status.phase,
      }));
      dispatch(namespaceListSuccess(namespaceObjects));
    })
    .catch((error) => {
      dispatch(namespaceListError(error));
    });
}

export function rolebindingListError(error) {
  return {
    type: ROLEBINDING_LIST_ERROR,
    error,
  };
}

export function rolebindingListSuccess(namespace, rolebindings) {
  return {
    type: ROLEBINDING_LIST_SUCCESS,
    namespace,
    rolebindings,
  };
}

export function rolebindingList(client, namespace) {
  return dispatch => client.listRolebindings(namespace)
    .then((response) => {
      const { items } = response.data;
      const rolebindings = items.map(item => item.metadata.name);
      dispatch(rolebindingListSuccess(namespace, rolebindings));
    })
    .catch((error) => {
      dispatch(rolebindingListError(error));
    });
}
