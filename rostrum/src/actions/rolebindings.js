import { ROLEBINDING_LIST } from './actionTypes';

function rolebindingListSuccess(namespace, rolebindings) {
  return {
    type: ROLEBINDING_LIST,
    namespace,
    rolebindings,
  };
}

export function rolebindingList(namespace, client) {
  return (dispatch) => {
    client.listRolebindings(namespace)
      .then((response) => {
        const { items } = response.data;
        const rolebindings = items.map(item => item.metadata.name);
        dispatch(rolebindingListSuccess(namespace, rolebindings));
      });
  };
}
