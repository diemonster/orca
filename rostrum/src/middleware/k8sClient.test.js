import axios from 'axios';
import * as templates from './k8sTemplates';
import K8sClient, {
  METHODS,
  DEFAULT_ENDPOINT,
  getTokenFromSession,
} from './k8sClient';


describe('kubernetes client', () => {
  describe('initialization', () => {
    it('initializes correctly with default values', () => {
      const k8sClient = new K8sClient();
      expect(k8sClient.endpoint).toBe(DEFAULT_ENDPOINT);
      expect(k8sClient.getToken).toBe(getTokenFromSession);
    });

    it('initializes correctly with non-default values', () => {
      const getToken = jest.fn();
      const k8sClient = new K8sClient('endpoint', getToken);
      expect(k8sClient.endpoint).toEqual('endpoint');
      expect(k8sClient.getToken).toBe(getToken);
    });
  });

  describe('API methods', () => {
    let k8sClient;
    let mockDo;

    beforeEach(() => {
      k8sClient = new K8sClient('', jest.fn());
      mockDo = jest.fn();
      k8sClient.do = mockDo;
    });

    it('calls do() with correct args on createNamespace()', () => {
      const expectedBody = templates.createNamespace('new-namespace');

      k8sClient.createNamespace('new-namespace');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.POST,
        '/api/v1/namespaces',
        expectedBody,
      );
    });

    it('calls do() with correct args on deleteNamespace()', () => {
      k8sClient.deleteNamespace('some-namespace');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.DELETE,
        '/api/v1/namespaces/some-namespace',
      );
    });

    it('calls do() with correct args on getNamespace()', () => {
      k8sClient.getNamespace('some-namespace');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.GET,
        '/api/v1/namespaces/some-namespace',
      );
    });

    it('calls do() with correct args on listNamespaces()', () => {
      k8sClient.listNamespaces();

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.GET,
        '/api/v1/namespaces',
      );
    });

    describe('createRole()', () => {
      it('calls do() with correct args on when creating an admin role', () => {
        const expectedBody = templates.createAdminRole('some-namespace');

        k8sClient.createRole('some-namespace', 'admin');

        expect(mockDo).toHaveBeenCalledWith(
          METHODS.POST,
          '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/roles/',
          expectedBody,
        );
      });

      it('throws an error if a non-templated role is provided', () => {
        k8sClient.createRole('some-namespace', 'unsupported-role')
          .catch((error) => {
            expect(error.message).toEqual(
              'No template implemented for role \'unsupported-role\'',
            );
          });
      });
    });

    it('calls do() with correct args on getRole()', () => {
      k8sClient.getRole('some-namespace', 'some-role');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.GET,
        '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/roles/some-namespace-namespace-some-role-role',
      );
    });

    it('calls do() with correct args on listRoles()', () => {
      k8sClient.listRoles('some-namespace');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.GET,
        '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/roles/',
      );
    });

    it('calls do() with correct args on createRolebinding()', () => {
      const expectedBody = templates.createRolebinding(
        'some-namespace',
        'some-role',
        'some-subject',
      );

      k8sClient.createRolebinding('some-namespace', 'some-role', 'some-subject');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.POST,
        '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/rolebindings/',
        expectedBody,
      );
    });

    it('calls do() with correct args on deleteRolebinding()', () => {
      k8sClient.deleteRolebinding('some-namespace', 'some-rolebinding');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.DELETE,
        '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/rolebindings/some-rolebinding',
      );
    });

    it('calls do() with correct args on listRolebindings()', () => {
      k8sClient.listRolebindings('some-namespace');

      expect(mockDo).toHaveBeenCalledWith(
        METHODS.GET,
        '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/rolebindings/',
      );
    });
  });

  describe('do() method', () => {
    const token = 'TOKEN';
    const endpoint = 'endpoint';
    const path = '/path';
    const body = { test: 'body' };
    const expectedHeaders = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let mockGetToken;
    let k8sClient;

    beforeEach(() => {
      mockGetToken = jest.fn(() => token);
      k8sClient = new K8sClient(endpoint, mockGetToken);
    });

    it('calls axios.delete() correctly on DELETE method', () => {
      const axiosDelete = jest.fn();
      axios.delete = axiosDelete;

      k8sClient.do(METHODS.DELETE, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosDelete).toHaveBeenCalledWith(endpoint + path, expectedHeaders);
    });

    it('calls axios.get() correctly on GET method', () => {
      const axiosGet = jest.fn();
      axios.get = axiosGet;

      k8sClient.do(METHODS.GET, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosGet).toHaveBeenCalledWith(endpoint + path, expectedHeaders);
    });

    it('calls axios.post() correctly on POST method', () => {
      const axiosPost = jest.fn();
      axios.post = axiosPost;

      k8sClient.do(METHODS.POST, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosPost).toHaveBeenCalledWith(endpoint + path, body, expectedHeaders);
    });

    it('calls axios.put() correctly on PUT method', () => {
      const axiosPut = jest.fn();
      axios.put = axiosPut;

      k8sClient.do(METHODS.PUT, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosPut).toHaveBeenCalledWith(endpoint + path, body, expectedHeaders);
    });

    it('throws an error on an unrecognized method', () => {
      const method = 'UNEXPECTED';

      k8sClient.do(method, path, body).catch((error) => {
        expect(error.message).toEqual(`method ${method} not recognized`);
      });

      expect(mockGetToken).toHaveBeenCalled();
    });
  });
});

describe('getTokenFromSession()', () => {
  it('calls localStorage.getItem() correctly', () => {
    const mockGetItem = jest.fn();
    global.localStorage = {
      getItem: mockGetItem,
    };

    getTokenFromSession();
    expect(mockGetItem).toHaveBeenCalledWith('access_token');
  });
});
