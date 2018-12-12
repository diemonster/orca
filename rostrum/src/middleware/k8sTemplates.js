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
  return {
    kind: 'Role',
    apiVersion: 'rbac.authorization.k8s.io/v1',
    metadata: {
      name: `${namespace}-namespace-admin-role`,
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
