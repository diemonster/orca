import axios from 'axios';

const namespaceListSuccess = (namespaceObjects) => {
  return {
    type: "NAMESPACE_LIST_SUCCESS",
    namespaceObjects: namespaceObjects
  };
}

export const namespaceList = () => {
  return (dispatch) => {
    axios.get("http://localhost:8080/api/v1/namespaces")
      .then(response => {
        dispatch(namespaceListSuccess(response.data.items))
      })
      .catch(error => { console.log("namespaceList action error:", error) });
  };
}

export const namespaceCreateChangeInput = (namespaceCreateInput) => {
  return {
    type: "NAMESPACE_CREATE_CHANGE_INPUT",
    namespaceCreateInput: namespaceCreateInput
  };
}

export const namespaceCreate = (name) => {
  return (dispatch) => {
    axios.post("http://localhost:8080/api/v1/namespaces", {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name: name,
        labels: {
          name: name,
        },
      },
    })
      .catch(error => { console.log("namespaceCreate action error:", error) });
  }
}

export const namespaceDelete = (name) => {
  return dispatch => {
    axios.delete("http://localhost:8080/api/v1/namespaces/"+name)
      .catch(error => { console.log("namespaceDelete action error:", error) })
  };
}

export const namespaceDeleteChangeInput = (namespaceDeleteInput) => {
  return {
    type: "NAMESPACE_DELETE_CHANGE_INPUT",
    namespaceDeleteInput: namespaceDeleteInput
  };
}
