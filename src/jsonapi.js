import { createAction, handleActions } from 'redux-actions';
import imm from 'object-path-immutable';
import uniqueId from 'lodash.uniqueid';

import {
  addLinksToState,
  removeResourceFromState,
  updateOrInsertResourcesIntoState,
  setIsInvalidatingForExistingResource,
  ensureResourceTypeInState
} from './state-mutation';

import { apiRequest, getPaginationUrl } from './utils';
import {
  API_SET_AXIOS_CONFIG, API_HYDRATE, API_WILL_REQUEST, API_DID_REQUEST, API_WILL_CREATE, API_CREATED, API_CREATE_FAILED, API_WILL_READ, API_READ, API_READ_FAILED, API_WILL_UPDATE, API_UPDATED, API_UPDATE_FAILED, API_WILL_DELETE, API_DELETED, API_DELETE_FAILED
} from './constants';

const DEFAULT_STATE_KEY = 'api';

// Resource isInvalidating values
export const IS_DELETING = 'IS_DELETING';
export const IS_UPDATING = 'IS_UPDATING';

// Action creators
export const setAxiosConfig = createAction(API_SET_AXIOS_CONFIG);
export const hydrateStore = createAction(API_HYDRATE);

const apiWillRequest = createAction(API_WILL_REQUEST);
const apiDidRequest = createAction(API_DID_REQUEST);

const apiWillCreate = createAction(API_WILL_CREATE);
const apiCreated = createAction(API_CREATED);
const apiCreateFailed = createAction(API_CREATE_FAILED);

const apiWillRead = createAction(API_WILL_READ);
const apiRead = createAction(API_READ);
const apiReadFailed = createAction(API_READ_FAILED);

const apiWillUpdate = createAction(API_WILL_UPDATE);
const apiUpdated = createAction(API_UPDATED);
const apiUpdateFailed = createAction(API_UPDATE_FAILED);

const apiWillDelete = createAction(API_WILL_DELETE);
const apiDeleted = createAction(API_DELETED);
const apiDeleteFailed = createAction(API_DELETE_FAILED);

export const createResource = (resource, options = {}) => {
  return (dispatch, getState) => {
    const stateKey = options.stateKey || DEFAULT_STATE_KEY;
    const state = getState()[stateKey];
    const { endpoint: { axiosConfig } } = state;
    const requestId = uniqueId();
    const requestType = 'createResource';
    const requestOptions = {
      requestId,
      requestType,
      stateKey,
      endpoint: resource.type,
      axiosConfig: {
        method: 'POST',
        data: JSON.stringify({
          data: resource
        }),
        ...axiosConfig,
        ...(options.axiosConfig ? options.axiosConfig : {})
      },
      ...options
    };

    dispatch(apiWillCreate(resource));
    dispatch(apiWillRequest(requestOptions));

    const {
      requestOptions: {
        [requestType]: {
          [requestId]: {
            endpoint: finalEndpoint,
            axiosConfig: finalAxiosConfig
          }
        }
      }
    } = state;

    return new Promise((resolve, reject) => {
      apiRequest(finalEndpoint, finalAxiosConfig).then(json => {
        dispatch(apiCreated(json));
        resolve(json);
      }).catch(error => {
        const err = error;
        err.resource = resource;

        dispatch(apiCreateFailed(err));
        reject(err);
      }).finally(() => dispatch(apiDidRequest(requestOptions)));
    });
  };
};

class ApiResponse {
  constructor(response, dispatch, nextUrl, prevUrl) {
    this.body = response;
    this.dispatch = dispatch;
    this.nextUrl = nextUrl;
    this.prevUrl = prevUrl;
  }

  /* eslint-disable */
  loadNext = () => this.dispatch(readEndpoint(this.nextUrl));

  loadPrev = () => this.dispatch(readEndpoint(this.prevUrl));
  /* eslint-enable */
}

export const readEndpoint = (endpoint, options = {}) => {
  return (dispatch, getState) => {
    const stateKey = options.stateKey || DEFAULT_STATE_KEY;
    const requestId = uniqueId();
    const requestType = 'readEndpoint';
    const requestOptions = {
      requestType,
      requestId,
      stateKey,
      endpoint,
      axiosConfig: {
        ...(getState()[stateKey].endpoint && getState()[stateKey].endpoint.axiosConfig || {}),
        ...(options.axiosConfig ? options.axiosConfig : {})
      },
      ...options
    };

    dispatch(apiWillRead(endpoint, requestOptions));
    dispatch(apiWillRequest(requestOptions));

    const {
      requestOptions: {
        [requestType]: {
          [requestId]: finalRequestOptions
        }
      }
    } = getState()[stateKey];
    const {
      endpoint: finalEndpoint,
      axiosConfig: finalAxiosConfig
    } = finalRequestOptions;

    return new Promise((resolve, reject) => {
      apiRequest(finalEndpoint, finalAxiosConfig)
        .then(json => {
          dispatch(apiRead({ finalEndpoint, finalRequestOptions, ...json }));

          const nextUrl = getPaginationUrl(json, 'next', finalAxiosConfig.baseURL);
          const prevUrl = getPaginationUrl(json, 'prev', finalAxiosConfig.baseURL);

          resolve(new ApiResponse(json, dispatch, nextUrl, prevUrl));
        })
        .catch(error => {
          const err = error;
          err.endpoint = endpoint;

          dispatch(apiReadFailed(err));
          reject(err);
        })
        .finally(() => dispatch(apiDidRequest(requestOptions)));
    });
  };
};

export const updateResource = (resource, options = {}) => {
  return (dispatch, getState) => {
    const stateKey = options.stateKey || DEFAULT_STATE_KEY;
    const { endpoint: { axiosConfig } } = getState()[stateKey];
    const requestId = uniqueId();
    const requestType = 'updateResource';
    const requestOptions = {
      requestType,
      requestId,
      stateKey,
      endpoint: `${resource.type}/${resource.id}`,
      axiosConfig: {
        method: 'PATCH',
        data: {
          data: resource
        },
        ...axiosConfig,
        ...(options.axiosConfig ? options.axiosConfig : {})
      },
      ...options
    };

    dispatch(apiWillUpdate(resource));
    dispatch(apiWillRequest(requestOptions));

    const {
      requestOptions: {
        [requestType]: {
          [requestId]: finalRequestOptions
        }
      }
    } = getState()[stateKey];
    const {
      endpoint: finalEndpoint,
      axiosConfig: finalAxiosConfig
    } = finalRequestOptions;

    return new Promise((resolve, reject) => {
      apiRequest(finalEndpoint, finalAxiosConfig)
        .then(json => {
          dispatch(apiUpdated(json));
          resolve(json);
        })
        .catch(error => {
          const err = error;
          err.resource = resource;

          dispatch(apiUpdateFailed(err));
          reject(err);
        })
        .finally(() => dispatch(apiDidRequest(requestOptions)));
    });
  };
};

export const deleteResource = (resource, options = {}) => {
  return (dispatch, getState) => {
    const stateKey = options.stateKey || DEFAULT_STATE_KEY;
    const { endpoint: { axiosConfig } } = getState()[stateKey];
    const requestId = uniqueId();
    const requestType = 'deleteResource';
    const requestOptions = {
      requestType,
      requestId,
      stateKey,
      endpoint: `${resource.type}/${resource.id}`,
      axiosConfig: {
        method: 'DELETE',
        ...axiosConfig,
        ...(options.axiosConfig ? options.axiosConfig : {})
      },
      ...options
    };

    dispatch(apiWillDelete(resource));
    dispatch(apiWillRequest(requestOptions));

    const {
      requestOptions: {
        [requestType]: {
          [requestId]: finalRequestOptions
        }
      }
    } = getState()[stateKey];
    const {
      endpoint: finalEndpoint,
      axiosConfig: finalAxiosConfig
    } = finalRequestOptions;

    return new Promise((resolve, reject) => {
      apiRequest(finalEndpoint, finalAxiosConfig)
        .then(() => {
          dispatch(apiDeleted(resource));
          resolve();
        })
        .catch(error => {
          const err = error;
          err.resource = resource;

          dispatch(apiDeleteFailed(err));
          reject(err);
        })
        .finally(() => dispatch(apiDidRequest(requestOptions)));
    });
  };
};

export const requireResource = (resourceType, endpoint = resourceType) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { api } = getState();
      if (api.hasOwnProperty(resourceType)) {
        resolve();
      }

      dispatch(readEndpoint(endpoint))
        .then(resolve)
        .catch(reject);
    });
  };
};

// Reducers
const reducerDefaultState = {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0,
  endpoint: {
    axiosConfig: {}
  },
  stateKey: null,
  requestOptions: {}
};

const reducerActionsMap = {
  [API_SET_AXIOS_CONFIG]: (state, { payload: { stateKey, ...axiosConfig } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['endpoint', 'axiosConfig'], axiosConfig).value();
  },

  [API_HYDRATE]: (state, { payload: { stateKey, ...resources } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState).value();
  },

  [API_WILL_REQUEST]: (state, { payload: requestOptions }) => {
    const { stateKey, requestType, requestId } = requestOptions;
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['requestOptions', requestType, requestId], requestOptions).value();
  },

  [API_DID_REQUEST]: (state, { payload: requestOptions }) => {
    const { stateKey, requestType, requestId } = requestOptions;
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }

    // Delete the whole requestType property if this is the only requestOption
    // in it.
    const delPath = Object.keys(state.requestOptions[requestType]).length === 1
      ? ['requestOptions', requestType]
      : ['requestOptions', requestType, requestId];

    return imm(state).del(delPath).value();
  },

  [API_WILL_CREATE]: (state, { stateKey }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['isCreating'], state.isCreating + 1).value();
  },

  [API_CREATED]: (state, { payload: { stateKey, ...resources } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState)
      .set('isCreating', state.isCreating - 1)
      .value();
  },

  [API_CREATE_FAILED]: (state, { stateKey }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['isCreating'], state.isCreating - 1).value();
  },

  [API_WILL_READ]: (state, { stateKey }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['isReading'], state.isReading + 1).value();
  },

  [API_READ]: (state, { payload: { stateKey, ...payload } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const resources = (
      Array.isArray(payload.data)
        ? payload.data
        : [payload.data]
    ).concat(payload.included || []);

    const newState = updateOrInsertResourcesIntoState(state, resources);
    const finalState = addLinksToState(newState, payload.links, payload.options);

    return imm(finalState)
      .set('isReading', state.isReading - 1)
      .value();
  },

  [API_READ_FAILED]: (state, { stateKey }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return imm(state).set(['isReading'], state.isReading - 1).value();
  },

  [API_WILL_UPDATE]: (state, { payload: { stateKey, ...resource } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const { type, id } = resource;

    const newState = ensureResourceTypeInState(state, type);

    return setIsInvalidatingForExistingResource(newState, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating + 1)
      .value();
  },

  [API_UPDATED]: (state, { payload: { stateKey, ...resources } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_UPDATE_FAILED]: (state, { payload: { stateKey, resource } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_WILL_DELETE]: (state, { payload: { stateKey, ...resource } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting + 1)
      .value();
  },

  [API_DELETED]: (state, { payload: { stateKey, ...resource } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    return removeResourceFromState(state, resource)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  },

  [API_DELETE_FAILED]: (state, { payload: { stateKey, resource } }) => {
    if (state.stateKey && stateKey && stateKey !== state.stateKey) {
      return state;
    }
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  }
};

export const reducer = handleActions(reducerActionsMap, reducerDefaultState);

// Returns binder functions which can be used to tie apiActions or "normal" FSA
// compliant (createAction) actions to an instance.
const bindActionsToInstanceFactory = stateKey => ({
  bindApiAction: fn => (arg1, arg2, ...moreArgs) =>
    fn(arg1, { ...arg2, stateKey }, ...moreArgs),
  bindAction: fn => (payload) => fn({ stateKey, ...payload })
});

// Create an instance of redux-json-api. Returns the reducer and actions which
// are bound to this instance. (Meaning they don't affect other instances)
export const createInstance = (stateKey = 'api', axiosConfig = {}) => {
  const { bindApiAction, bindAction } = bindActionsToInstanceFactory(stateKey);
  return {
    reducer: handleActions(reducerActionsMap, {
      ...reducerDefaultState,
      stateKey,
      endpoint: {
        ...reducerDefaultState.endpoint,
        axiosConfig
      }
    }),
    createResource: bindApiAction(createResource),
    readEndpoint: bindApiAction(readEndpoint),
    updateResource: bindApiAction(updateResource),
    deleteResource: bindApiAction(deleteResource),
    setAxiosConfig: bindAction(setAxiosConfig),
    hydrateStore: bindAction(hydrateStore)
  };
};
