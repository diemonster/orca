export const initialState = {
  auth0ClientID: '',
  auth0Domain: '',
  authClient: null,
  k8sClient: null,
};

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return { ...state };
  }
}
