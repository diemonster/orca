import axios from 'axios';

const rolebindingListSuccess = (namespace, rolebindingObjects) => {
  return {
    type: "ROLEBINDING_LIST_SUCCESS",
    namespace: namespace,
    rolebindingObjects: rolebindingObjects
  };
}

export const rolebindingList = (namespace) => {
  return (dispatch) => {
    axios.get("http://localhost:8080/apis/rbac.authorization.k8s.io/v1/namespaces/"+namespace+"/rolebindings/")
      .then(response => {
        dispatch(rolebindingListSuccess(namespace, response.data.items))
      })
      .catch(error => { console.log("rolebindingList action error:", error) });
  };
}
