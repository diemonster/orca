export const initialState = {
  k8sClient: null,
};

export default function k8sReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return { ...state };
  }
}
