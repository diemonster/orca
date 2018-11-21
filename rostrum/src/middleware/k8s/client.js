import axios from 'axios';

export const DEFAULT_ENDPOINT = 'http://localhost:8080';

export const METHODS = {
  DELETE: 'delete',
  GET: 'get',
  POST: 'post',
  PUT: 'put',
};

// todo: place in shared location
export function getTokenFromSession() {
  // todo: throw exception when token is expired/does not exist
  // this exception can be caught by a higher-level component which will re-trigger
  // the auth0 lock workflow.
  return localStorage.getItem('access_token');
}

class K8sClient {
  constructor(endpoint = DEFAULT_ENDPOINT, getToken = getTokenFromSession) {
    this.endpoint = endpoint;
    this.getToken = getToken;
  }

  do(method, path, body) {
    const headers = {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    };

    switch (method) {
      case METHODS.DELETE:
        return axios.delete(this.endpoint + path, headers);
      case METHODS.GET:
        return axios.get(this.endpoint + path, headers);
      case METHODS.POST:
        return axios.post(this.endpoint + path, body, headers);
      case METHODS.PUT:
        return axios.put(this.endpoint + path, body, headers);
      default:
        throw Error(`method ${method} not recognized`);
    }
  }

  createNamespace(name) {
    const body = {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name,
        labels: {
          name,
        },
      },
    };

    return this.do(METHODS.POST, '/api/v1/namespaces', body);
  }

  deleteNamespace(name) {
    return this.do(METHODS.DELETE, `/api/v1/namespaces/${name}`);
  }

  getNamespace(name) {
    return this.do(METHODS.GET, `/api/v1/namespaces/${name}`);
  }

  listNamespaces() {
    return this.do(METHODS.GET, '/api/v1/namespaces');
  }

  createRolebinding(namespace, role, subject) {
    const body = {
      role,
      subject,
    };

    return this.do(
      METHODS.POST,
      `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/`,
      body,
    );
  }

  listRolebindings(namespace) {
    return this.do(
      METHODS.GET,
      `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/`,
    );
  }
}

export default K8sClient;
