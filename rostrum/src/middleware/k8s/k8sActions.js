import watch from '../../utils/watch';
import * as namespaceActions from '../../actions/namespaces';
import * as roleActions from '../../actions/roles';
import * as rolebindingActions from '../../actions/rolebindings';


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

export function namespaceCreate(client, name) {
  return (dispatch) => {
    dispatch(namespaceActions.namespaceCreateChangeInput(''));
    return client.createNamespace(name)
      .then(() => {
        dispatch(namespaceActions.namespaceList(client));
      })
      .catch((error) => {
        dispatch(namespaceActions.namespaceCreateError(error));
      });
  };
}

// TODO: fingure a good way to test this function
export function watchNamespaceDelete(client, name) {
  return (dispatch) => {
    watch(2000, (stop) => {
    // TODO: combine these two calls into one
      dispatch(namespaceList(client));
      client.listNamespaces()
        .then((response) => {
          for (let i = 0; i < response.data.items.length; i += 1) {
            if (response.data.items[i].metadata.name === name) {
              return;
            }
          }

          stop();
        });
    });
  };
}

export function namespaceDelete(client, name) {
  return dispatch => client.deleteNamespace(name)
    .then(() => {
      dispatch(namespaceActions.namespaceWatchForDeletion(name));
    })
    .catch((error) => {
      dispatch(namespaceActions.namespaceDeleteError(error));
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
