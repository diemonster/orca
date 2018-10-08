import axios from 'axios';

const baseURL = process.env.REACT_APP_K8S_API_CLIENT_BASE_URL || 'http://localhost:8080';

class K8sApiClient {
  static listNamespaces() {
    return axios.get(`${baseURL}/api/v1/namespaces`);
  }

  static createNamespace(name) {
    return axios.post(`${baseURL}/api/v1/namespaces`, {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name,
        labels: {
          name,
        },
      },
    });
  }

  static deleteNamespace(name) {
    return axios.delete(`${baseURL}/api/v1/namespaces/${name}`);
  }

  static listRolebindingsForNamespace(namespace) {
    return axios.get(`${baseURL}/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/`);
  }
}

export default K8sApiClient;
