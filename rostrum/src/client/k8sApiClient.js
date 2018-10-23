import axios from 'axios';
import toastr from 'toastr';

const baseURL = process.env.REACT_APP_K8S_API_CLIENT_BASE_URL || 'http://localhost:8080';

function getTokenFromSession() {
  return localStorage.getItem('access_token');
}

class K8sApiClient {
  constructor(getToken = getTokenFromSession) {
    this.getToken = getToken;
    this.handleError = (err) => {
      toastr.error(err);
    };
  }

  listNamespaces() {
    const token = this.getToken();
    return axios.get(`${baseURL}/api/v1/namespaces`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .catch((err) => {
        this.handleError(err);
      });
  }

  createNamespace(name) {
    const token = this.getToken();
    return axios.post(
      `${baseURL}/api/v1/namespaces`,
      {
        kind: 'Namespace',
        apiVersion: 'v1',
        metadata: {
          name,
          labels: {
            name,
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .catch((err) => {
        this.handleError(err);
      });
  }

  deleteNamespace(name) {
    const token = this.getToken();
    return axios.delete(`${baseURL}/api/v1/namespaces/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .catch((err) => {
        this.handleError(err);
      });
  }

  listRolebindingsForNamespace(namespace) {
    const token = this.getToken();
    return axios.get(`${baseURL}/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .catch((err) => {
        this.handleErr(err);
      });
  }
}


export default K8sApiClient;
