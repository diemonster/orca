import K8sApiClient from '../client/k8sApiClient';
import { ROLEBINDING_LIST } from './actionTypes';

const client = new K8sApiClient();

function rolebindingListSuccess(namespace, rolebindings) {
  return {
    type: ROLEBINDING_LIST,
    namespace,
    rolebindings,
  };
}

export function rolebindingList(namespace, apiClient = client) {
  return (dispatch) => {
    apiClient.listRolebindingsForNamespace(namespace)
      .then((response) => {
        const { items } = response.data;
        const rolebindings = items.map(item => item.metadata.name);

        dispatch(rolebindingListSuccess(namespace, rolebindings));
      });
  };
}
