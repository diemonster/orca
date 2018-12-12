import * as namespaceActions from './namespaceActions';
import * as roleActions from './roleActions';
import * as rolebindingActions from './rolebindingActions';
import { DEFAULT_INTERVAL } from '../utils/watch';


export function namespaceCreate(client, namespace, currentUser) {
  return (dispatch) => {
    dispatch(namespaceActions.namespaceCreateChangeInput(''));
    return client.createNamespace(namespace)
      .then(() => client.createRole(namespace, 'admin')
        .then(() => client.createRolebinding(namespace, 'admin', currentUser)
          .catch((rolebindingCreateError) => {
            dispatch(rolebindingActions.rolebindingCreateError(rolebindingCreateError));
          }))
        .catch((roleCreateError) => {
          dispatch(roleActions.roleCreateError(roleCreateError));
        }))
      .catch((namespaceCreateError) => {
        dispatch(namespaceActions.namespaceCreateError(namespaceCreateError));
      })
      .then(() => {
        dispatch(namespaceActions.namespaceList());
      });
  };
}

export function namespaceDelete(client, namespace, interval = DEFAULT_INTERVAL) {
  return dispatch => client.deleteNamespace(namespace)
    .then(() => {
      dispatch(namespaceActions.namespaceDeleteStartWatch(namespace, interval));
    })
    .catch((error) => {
      dispatch(namespaceActions.namespaceDeleteError(error));
    });
}

export function namespaceDeleteCheckWatch(client, namespace, selectedNamespace, stop) {
  return dispatch => client.listNamespaces()
    .then((response) => {
      const { items } = response.data;
      const namespaceObjects = items.map(item => ({
        name: item.metadata.name,
        status: item.status.phase,
      }));

      dispatch(namespaceActions.namespaceListSuccess(namespaceObjects));
      const namespaces = namespaceObjects.map(namespaceObject => namespaceObject.name);
      for (let i = 0; i < namespaces.length; i += 1) {
        if (namespace === namespaces[i]) {
          return;
        }
      }

      if (namespace === selectedNamespace) {
        dispatch(namespaceActions.namespaceSelect(''));
      }

      dispatch(namespaceActions.namespaceDeleteStopWatch(stop));
    })
    .catch((error) => {
      dispatch(namespaceActions.namespaceListError(error));
    });
}

export function namespaceList(client) {
  return dispatch => client.listNamespaces()
    .then((response) => {
      const { items } = response.data;
      const namespaceObjects = items.map(namespace => ({
        name: namespace.metadata.name,
        status: namespace.status.phase,
      }));

      return dispatch(namespaceActions.namespaceListSuccess(namespaceObjects));
    })
    .catch((error) => {
      dispatch(namespaceActions.namespaceListError(error));
    });
}

export function rolebindingCreate(client, namespace, role, subject) {
  // check if the role exists
  return (dispatch) => {
    dispatch(rolebindingActions.rolebindingCreateChangeInput('subject', ''));
    return client.getRole(namespace, role)
    // if it does, create the rolebinding
      .then(() => client.createRolebinding(namespace, role, subject)
        .then(() => {
          dispatch(rolebindingActions.rolebindingList(namespace));
        })
        .catch((createRolebindingError) => {
          dispatch(rolebindingActions.rolebindingCreateError(createRolebindingError));
        }))
    // if it doesn't, create the role first, _then_ create the rolebinding
      .catch((getRoleError) => {
        if (getRoleError.response.status === 404) {
          return client.createRole(namespace, role)
            .then(() => client.createRolebinding(namespace, role, subject)
              .then(() => {
                dispatch(rolebindingActions.rolebindingList(namespace));
              })
              .catch((createRolebindingError) => {
                dispatch(rolebindingActions.rolebindingCreateError(createRolebindingError));
              }))
            .catch((createRoleError) => {
              dispatch(roleActions.roleCreateError(createRoleError));
            });
        }

        return dispatch(roleActions.roleGetError(getRoleError));
      });
  };
}

export function rolebindingDelete(client, namespace, rolebinding, interval = DEFAULT_INTERVAL) {
  return dispatch => client.deleteRolebinding(namespace, rolebinding)
    .then(() => {
      dispatch(rolebindingActions.rolebindingDeleteStartWatch(namespace, rolebinding, interval));
    })
    .catch((error) => {
      dispatch(rolebindingActions.rolebindingDeleteError(error));
    });
}

export function rolebindingDeleteCheckWatch(client, namespace, rolebinding, stop) {
  return dispatch => client.listRolebindings(namespace)
    .then((response) => {
      const { items } = response.data;
      const rolebindings = items.map(item => item.metadata.name);

      dispatch(rolebindingActions.rolebindingListSuccess(namespace, rolebindings));
      for (let i = 0; i < rolebindings.length; i += 1) {
        if (rolebinding === rolebindings[i]) {
          return;
        }
      }

      dispatch(rolebindingActions.rolebindingDeleteStopWatch(stop));
    })
    .catch((error) => {
      dispatch(rolebindingActions.rolebindingListError(error));
    });
}

export function rolebindingList(client, namespace) {
  return dispatch => client.listRolebindings(namespace)
    .then((response) => {
      const { items } = response.data;
      const rolebindings = items.map(item => item.metadata.name);
      return dispatch(rolebindingActions.rolebindingListSuccess(namespace, rolebindings));
    })
    .catch((error) => {
      dispatch(rolebindingActions.rolebindingListError(error));
    });
}
