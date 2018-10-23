import K8sClient from '../k8s/client';
import watch from '../utils/watch';
import {
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_DELETE_CHANGE_INPUT,
  NAMESPACE_LIST,
} from './actionTypes';


function namespaceListSuccess(namespaceObjects) {
  return {
    type: NAMESPACE_LIST,
    namespaceObjects,
  };
}

export function namespaceList(client = K8sClient) {
  return (dispatch) => {
    client.listNamespaces()
      .then((response) => {
        const { items } = response.data;
        const namespaceObjects = items.map(namespace => ({
          name: namespace.metadata.name,
          status: namespace.status.phase,
        }));

        dispatch(namespaceListSuccess(namespaceObjects));
      });
  };
}

export function namespaceCreateChangeInput(namespaceCreateInput) {
  return {
    type: NAMESPACE_CREATE_CHANGE_INPUT,
    namespaceCreateInput,
  };
}

export function namespaceCreate(name, client = K8sClient) {
  return (dispatch) => {
    client.createNamespace(name)
      .then(() => {
        dispatch(namespaceCreateChangeInput(''));
        dispatch(namespaceList()); 
      });
  };
}

export function namespaceDeleteChangeInput(namespaceDeleteInput) {
  return {
    type: NAMESPACE_DELETE_CHANGE_INPUT,
    namespaceDeleteInput,
  };
}

function watchNamespaceDelete(name, dispatch, client = K8sClient) {
  watch(2000, (stop) => {
    // todo: combine these two calls into one
    dispatch(namespaceList(client));
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
}

export function namespaceDelete(name, client = K8sClient) {
  return (dispatch) => {
    client.deleteNamespace(name)
      .then(dispatch(namespaceDeleteChangeInput('')), watchNamespaceDelete(name, dispatch, client));
  };
}
