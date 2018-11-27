import axios from 'axios';
import K8sClient, { METHODS, DEFAULT_ENDPOINT, getTokenFromSession } from './client';


describe('kubernetes client', () => {
  it('initializes correctly with default values', () => {
    const k8sClient = new K8sClient();

    expect(k8sClient.endpoint).toBe(DEFAULT_ENDPOINT);
    expect(k8sClient.getToken).toBe(getTokenFromSession);
  });

  it('initializes correctly with non-default values', () => {
    const endpoint = 'endpoint';
    const getToken = jest.fn();
    const k8sClient = new K8sClient(endpoint, getToken);

    expect(k8sClient.endpoint).toBe(endpoint);
    expect(k8sClient.getToken).toBe(getToken);
  });

  it('calls do() with correct args on createNamespace()', () => {
    const k8sClient = new K8sClient('', jest.fn());
    const mockDo = jest.fn();
    k8sClient.do = mockDo;
    const expectedBody = {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {
        name: 'new-namespace',
        labels: {
          name: 'new-namespace',
        },
      },
    };

    k8sClient.createNamespace('new-namespace');

    expect(mockDo).toHaveBeenCalledWith(METHODS.POST, '/api/v1/namespaces', expectedBody);
  });

  it('calls do() with correct args on deleteNamespace()', () => {
    const k8sClient = new K8sClient('', jest.fn());
    const mockDo = jest.fn();
    k8sClient.do = mockDo;

    k8sClient.deleteNamespace('some-namespace');

    expect(mockDo).toHaveBeenCalledWith(METHODS.DELETE, '/api/v1/namespaces/some-namespace');
  });

  it('calls do() with correct args on getNamespace()', () => {
    const k8sClient = new K8sClient('', jest.fn());
    const mockDo = jest.fn();
    k8sClient.do = mockDo;

    k8sClient.getNamespace('some-namespace');

    expect(mockDo).toHaveBeenCalledWith(METHODS.GET, '/api/v1/namespaces/some-namespace');
  });

  it('calls do() with correct args on listNamespaces()', () => {
    const k8sClient = new K8sClient('', jest.fn());
    const mockDo = jest.fn();
    k8sClient.do = mockDo;

    k8sClient.listNamespaces();

    expect(mockDo).toHaveBeenCalledWith(METHODS.GET, '/api/v1/namespaces');
  });

  it('calls do() with correct args on listRolebindings()', () => {
    const k8sClient = new K8sClient('', jest.fn());
    const mockDo = jest.fn();
    k8sClient.do = mockDo;

    k8sClient.listRolebindings('some-namespace');

    expect(mockDo).toHaveBeenCalledWith(METHODS.GET, '/apis/rbac.authorization.k8s.io/v1/namespaces/some-namespace/rolebindings/');
  });

  describe('do() method', () => {
    it('calls axios.delete() correctly on DELETE method', () => {
      const token = 'TOKEN';
      const mockGetToken = jest.fn(() => token);

      const endpoint = 'endpoint';
      const k8sClient = new K8sClient(endpoint, mockGetToken);

      const expectedHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const axiosDelete = jest.fn();
      axios.delete = axiosDelete;

      const path = '/path';
      const body = { test: 'body' };
      k8sClient.do(METHODS.DELETE, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosDelete).toHaveBeenCalledWith(endpoint + path, expectedHeaders);
    });

    it('calls axios.get() correctly on GET method', () => {
      const token = 'TOKEN';
      const mockGetToken = jest.fn(() => token);

      const endpoint = 'endpoint';
      const k8sClient = new K8sClient(endpoint, mockGetToken);

      const expectedHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const axiosGet = jest.fn();
      axios.get = axiosGet;

      const path = '/path';
      const body = { test: 'body' };
      k8sClient.do(METHODS.GET, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosGet).toHaveBeenCalledWith(endpoint + path, expectedHeaders);
    });

    it('calls axios.post() correctly on POST method', () => {
      const token = 'TOKEN';
      const mockGetToken = jest.fn(() => token);

      const endpoint = 'endpoint';
      const k8sClient = new K8sClient(endpoint, mockGetToken);

      const expectedHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const axiosPost = jest.fn();
      axios.post = axiosPost;

      const path = '/path';
      const body = { test: 'body' };
      k8sClient.do(METHODS.POST, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosPost).toHaveBeenCalledWith(endpoint + path, body, expectedHeaders);
    });

    it('calls axios.put() correctly on PUT method', () => {
      const token = 'TOKEN';
      const mockGetToken = jest.fn(() => token);

      const endpoint = 'endpoint';
      const k8sClient = new K8sClient(endpoint, mockGetToken);

      const expectedHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const axiosPut = jest.fn();
      axios.put = axiosPut;

      const path = '/path';
      const body = { test: 'body' };
      k8sClient.do(METHODS.PUT, path, body);

      expect(mockGetToken).toHaveBeenCalled();
      expect(axiosPut).toHaveBeenCalledWith(endpoint + path, body, expectedHeaders);
    });

    it('throws an error on an unrecognized method', () => {
      const token = 'TOKEN';
      const mockGetToken = jest.fn(() => token);

      const endpoint = 'endpoint';
      const k8sClient = new K8sClient(endpoint, mockGetToken);

      const path = '/path';
      const body = { test: 'body' };
      const method = 'UNEXPECTED';

      expect(() => k8sClient.do(method, path, body)).toThrow(Error(`method ${method} not recognized`));
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
