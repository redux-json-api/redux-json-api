const actionTypes = {};

// Action types of the library
[
  'API_SET_AXIOS_CONFIG',
  'API_HYDRATE',
  'API_WILL_CREATE',
  'API_CREATED',
  'API_CREATE_FAILED',
  'API_WILL_READ',
  'API_READ',
  'API_READ_FAILED',
  'API_WILL_UPDATE',
  'API_UPDATED',
  'API_UPDATE_FAILED',
  'API_WILL_DELETE',
  'API_DELETED',
  'API_DELETE_FAILED'
].forEach((action) => {
  actionTypes[action] = action;
});

export default actionTypes;
