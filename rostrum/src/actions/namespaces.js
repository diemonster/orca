import K8sApiClient from '../client/k8sApiClient';
import {
  NAMESPACE_CREATE_CHANGE_INPUT,
  NAMESPACE_DELETE_CHANGE_INPUT,
  NAMESPACE_LIST,
} from './actionTypes';


const client = new K8sApiClient();

function namespaceListSuccess(namespaceObjects) {
  return {
    type: NAMESPACE_LIST,
    namespaceObjects,
  };
}

export function namespaceList(apiClient = client) {
  return (dispatch) => {
    apiClient.listNamespaces()
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

export function namespaceCreate(name, apiClient = client) {
  return (dispatch) => {
    apiClient.createNamespace(name)
      .then(() => {
        dispatch(namespaceCreateChangeInput(''));
      });
  };
}

export function namespaceDeleteChangeInput(namespaceDeleteInput) {
  return {
    type: NAMESPACE_DELETE_CHANGE_INPUT,
    namespaceDeleteInput,
  };
}

export function namespaceDelete(name, apiClient = client) {
  return (dispatch) => {
    apiClient.deleteNamespace(name)
      .then(() => {
        dispatch(namespaceDeleteChangeInput(''));
      });
  };
}
