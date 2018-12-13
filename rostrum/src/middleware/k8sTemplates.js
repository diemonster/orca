import * as k8sRoleOptions from './k8sRoleOptions';


export function createNamespace(name) {
  return {
    kind: 'Namespace',
    apiVersion: 'v1',
    metadata: {
      name,
      labels: {
        name,
      },
    },
  };
}

// createNamespace() and createRolebinding() are fairly one-size-fits-all, but
// here I'm laying the groundwork for roles to be broken up into individual
// functions because the rules will need to be different for each preset role
// we support.
export function createAdminRole(namespace) {
  const role = k8sRoleOptions.ADMIN;
  return {
    kind: 'Role',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    metadata: {
      name: `${namespace}-namespace-${role}-role`,
      namespace,
    },
    rules: [
      {
        apiGroups: ['*'],
        resources: ['*'],
        verbs: ['*'],
      },
    ],
  };
}

export function createReadOnlyRole(namespace) {
  const role = k8sRoleOptions.READONLY;
  return {
    kind: 'Role',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    metadata: {
      name: `${namespace}-namespace-${role}-role`,
      namespace,
    },
    rules: [
      {
        apiGroups: ['*'],
        resources: ['*'],
        verbs: ['get', 'list', 'watch'],
      },
    ],
  };
}

export function createRolebinding(namespace, role, subject) {
  return {
    kind: 'RoleBinding',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    metadata: {
      name: `${namespace}-namespace-${role}-role-${subject}`,
      namespace,
    },
    subjects: [
      {
        kind: 'User',
        name: subject,
      },
    ],
    roleRef: {
      kind: 'Role',
      name: role,
      apiGroup: 'rbac.authorization.k8s.io',
    },
  };
}
