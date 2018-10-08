import k8sApiClient from '../client/k8sApiClient';

function rolebindingListSuccess(namespace, rolebindings) {
  return {
    type: 'ROLEBINDING_LIST_SUCCESS',
    namespace,
    rolebindings,
  };
}

export function rolebindingList(namespace, apiClient = k8sApiClient) {
  return (dispatch) => {
    apiClient.listRolebindingsForNamespace(namespace)
      .then((response) => {
        const { items } = response.data;
        const rolebindings = items.map(item => item.metadata.name);

        dispatch(rolebindingListSuccess(namespace, rolebindings));
      })
      .catch((error) => { console.log('rolebindingList action error:', error); });
  };
}
