import k8sApiClient from '../client/k8sApiClient';

function namespaceListSuccess(namespaceObjects) {
  return {
    type: 'NAMESPACE_LIST_SUCCESS',
    namespaceObjects,
  };
}

export function namespaceList(apiClient = k8sApiClient) {
  return (dispatch) => {
    apiClient.listNamespaces()
      .then((response) => {
        const { items } = response.data;
        const namespaceObjects = items.map(namespace => ({
          name: namespace.metadata.name,
          status: namespace.status.phase,
        }));

        dispatch(namespaceListSuccess(namespaceObjects));
      })
      .catch((error) => { console.log('namespaceList action error:', error); });
  };
}

export function namespaceCreateChangeInput(namespaceCreateInput) {
  return {
    type: 'NAMESPACE_CREATE_CHANGE_INPUT',
    namespaceCreateInput,
  };
}

export function namespaceCreate(name, apiClient = k8sApiClient) {
  return (dispatch) => {
    apiClient.createNamespace(name)
      .then(dispatch(namespaceCreateChangeInput('')))
      .catch((error) => { console.log('namespaceCreate action error:', error); });
  };
}

export function namespaceDeleteChangeInput(namespaceDeleteInput) {
  return {
    type: 'NAMESPACE_DELETE_CHANGE_INPUT',
    namespaceDeleteInput,
  };
}

export function namespaceDelete(name, apiClient = k8sApiClient) {
  return (dispatch) => {
    apiClient.deleteNamespace(name)
      .then(dispatch(namespaceDeleteChangeInput('')))
      .catch((error) => { console.log('namespaceDelete action error:', error); });
  };
}
