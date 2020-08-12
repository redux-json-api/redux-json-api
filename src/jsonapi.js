import { createAction, handleActions } from 'redux-actions';
import imm from 'object-path-immutable';

import {
  addLinksToState, ensureRelationshipInState,
  ensureResourceTypeInState,
  removeResourceFromState, setIsInvalidatingForExistingRelationship,
  setIsInvalidatingForExistingResource,
  updateOrInsertResourcesIntoState,
  updateRelationship
} from './state-mutation';

import { apiRequest, getPaginationUrl, hasOwnProperties } from './utils';
import actionTypes from './constants';

const {
  API_SET_AXIOS_CONFIG, API_HYDRATE, API_WILL_CREATE, API_CREATED, API_CREATE_FAILED, API_WILL_READ, API_RELATIONSHIP_READ, API_READ, API_READ_FAILED, API_WILL_UPDATE, API_UPDATED, API_UPDATE_FAILED, API_WILL_DELETE, API_DELETED, API_DELETE_FAILED, API_RELATIONSHIP_WILL_UPDATE, API_RELATIONSHIP_UPDATED, API_RELATIONSHIP_UPDATE_FAILED, API_RELATIONSHIP_WILL_DELETE, API_RELATIONSHIP_DELETED, API_RELATIONSHIP_DELETE_FAILED
} = actionTypes;

// Resource isInvalidating values
export const IS_DELETING = 'IS_DELETING';
export const IS_UPDATING = 'IS_UPDATING';

// Action creators
export const setAxiosConfig = createAction(API_SET_AXIOS_CONFIG);

export const hydrateStore = createAction(API_HYDRATE);

const apiWillCreate = createAction(API_WILL_CREATE);
const apiCreated = createAction(API_CREATED);
const apiCreateFailed = createAction(API_CREATE_FAILED);

const apiWillRead = createAction(API_WILL_READ);
const apiRead = createAction(API_READ);
const apiRelationshipRead = createAction(API_RELATIONSHIP_READ);
const apiReadFailed = createAction(API_READ_FAILED);

const apiWillUpdate = createAction(API_WILL_UPDATE);
const apiUpdated = createAction(API_UPDATED);
const apiUpdateFailed = createAction(API_UPDATE_FAILED);

const apiWillDelete = createAction(API_WILL_DELETE);
const apiDeleted = createAction(API_DELETED);
const apiDeleteFailed = createAction(API_DELETE_FAILED);

const apiRelationshipWillUpdate = createAction(API_RELATIONSHIP_WILL_UPDATE);
const apiRelationshipUpdated = createAction(API_RELATIONSHIP_UPDATED);
const apiRelationshipUpdateFailed = createAction(API_RELATIONSHIP_UPDATE_FAILED);

const apiRelationshipWillDelete = createAction(API_RELATIONSHIP_WILL_DELETE);
const apiRelationshipDeleted = createAction(API_RELATIONSHIP_DELETED);
const apiRelationshipDeleteFailed = createAction(API_RELATIONSHIP_DELETE_FAILED);

export const createResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillCreate(resource));

    const { axiosConfig } = getState().api.endpoint;
    const options = {
      ...axiosConfig,
      method: 'POST',
      data: JSON.stringify({
        data: resource
      })
    };

    return new Promise((resolve, reject) => {
      apiRequest(resource.type, options).then((json) => {
        dispatch(apiCreated(json));
        resolve(json);
      }).catch((error) => {
        const err = error;
        err.resource = resource;

        dispatch(apiCreateFailed(err));
        reject(err);
      });
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

export const readEndpoint = (endpoint, {
  options = {
    indexLinks: undefined,
  }
} = {}) => {
  return (dispatch, getState) => {
    let finalEndpoint = endpoint;
    if ('type' in endpoint) {
      finalEndpoint = `${endpoint.type}/${endpoint.id}`;
    }

    dispatch(apiWillRead(finalEndpoint));

    const { axiosConfig } = getState().api.endpoint;

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, axiosConfig)
        .then((json) => {
          dispatch(apiRead({ finalEndpoint, options, ...json }));

          const nextUrl = getPaginationUrl(json, 'next', axiosConfig.baseURL);
          const prevUrl = getPaginationUrl(json, 'prev', axiosConfig.baseURL);

          resolve(new ApiResponse(json, dispatch, nextUrl, prevUrl));
        })
        .catch((error) => {
          const err = error;
          err.endpoint = finalEndpoint;

          dispatch(apiReadFailed(err));
          reject(err);
        });
    });
  };
};

export const updateResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillUpdate(resource));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = `${resource.type}/${resource.id}`;

    const options = {
      ...axiosConfig,
      method: 'PATCH',
      data: {
        data: resource
      }
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then((json) => {
          dispatch(apiUpdated(json));
          resolve(json);
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiUpdateFailed(err));
          reject(err);
        });
    });
  };
};

export const deleteResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillDelete(resource));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = `${resource.type}/${resource.id}`;

    const options = {
      ...axiosConfig,
      method: 'DELETE'
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then(() => {
          dispatch(apiDeleted(resource));
          resolve();
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiDeleteFailed(err));
          reject(err);
        });
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

export const readRelated = (resource, relationship) => {
  return (dispatch) => {
    let endpoint;

    if (hasOwnProperties(resource, ['relationships', relationship, 'links', 'related'])) {
      endpoint = resource.relationships[relationship].links.related;
    }

    if (!endpoint) {
      endpoint = `${resource.type}/${resource.id}/${relationship}`;
    }

    return dispatch(readEndpoint(endpoint));
  };
};

const getRelationshipEndpoint = (resource, relationship) => {
  if (hasOwnProperties(resource, ['relationships', relationship, 'links', 'self'])) {
    return resource.relationships[relationship].links.self;
  }

  return `${resource.type}/${resource.id}/relationships/${relationship}`;
};

export const readRelationship = (resource, relationship) => {
  return (dispatch, getState) => {
    const { axiosConfig } = getState().api.endpoint;
    const endpoint = getRelationshipEndpoint(resource, relationship);

    dispatch(apiWillRead(endpoint));

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, axiosConfig)
        .then((json) => {
          dispatch(apiRelationshipRead({ resource, relationship, data: json }));
          resolve(json);
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiReadFailed(err));
          reject(err);
        });
    });
  };
};

export const replaceRelationship = (resource, relationship, data) => {
  return (dispatch, getState) => {
    dispatch(apiRelationshipWillUpdate({ resource, relationship }));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = getRelationshipEndpoint(resource, relationship);

    const options = {
      ...axiosConfig,
      method: 'PATCH',
      data: {
        data
      }
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then((json) => {
          dispatch(apiRelationshipUpdated(json));
          resolve(json);
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiRelationshipUpdateFailed(err));
          reject(err);
        });
    });
  };
};

export const addRelationship = (resource, relationship, data) => {
  return (dispatch, getState) => {
    dispatch(apiRelationshipWillUpdate({
      resource,
      relationship
    }));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = getRelationshipEndpoint(resource, relationship);

    const options = {
      ...axiosConfig,
      method: 'POST',
      data: {
        data
      }
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then((json) => {
          dispatch(apiRelationshipUpdated(json));
          resolve(json);
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiRelationshipUpdateFailed(err));
          reject(err);
        });
    });
  };
};

export const deleteRelationship = (resource, relationship, data) => {
  return (dispatch, getState) => {
    dispatch(apiRelationshipWillDelete({
      resource,
      relationship
    }));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = getRelationshipEndpoint(resource, relationship);

    const options = {
      ...axiosConfig,
      method: 'DELETE',
      data: {
        data
      }
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then((json) => {
          dispatch(apiRelationshipDeleted(json));
          resolve(json);
        })
        .catch((error) => {
          const err = error;
          err.resource = resource;

          dispatch(apiRelationshipDeleteFailed(err));
          reject(err);
        });
    });
  };
};

// Reducers
export const reducer = handleActions({
  [API_SET_AXIOS_CONFIG]: (state, { payload: axiosConfig }) => {
    return imm.wrap(state).set(['endpoint', 'axiosConfig'], axiosConfig).value();
  },

  [API_HYDRATE]: (state, { payload: resources }) => {
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm.wrap(newState).value();
  },

  [API_WILL_CREATE]: (state) => {
    return imm.wrap(state).set(['isCreating'], state.isCreating + 1).value();
  },

  [API_CREATED]: (state, { payload: resources }) => {
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm.wrap(newState)
      .set('isCreating', state.isCreating - 1)
      .value();
  },

  [API_CREATE_FAILED]: (state) => {
    return imm.wrap(state).set(['isCreating'], state.isCreating - 1).value();
  },

  [API_WILL_READ]: (state) => {
    return imm.wrap(state).set(['isReading'], state.isReading + 1).value();
  },

  [API_READ]: (state, { payload }) => {
    const resources = (
      Array.isArray(payload.data)
        ? payload.data
        : [payload.data]
    ).concat(payload.included || []);

    const newState = updateOrInsertResourcesIntoState(state, resources);
    const finalState = addLinksToState(newState, payload.links, payload.options);

    return imm.wrap(finalState)
      .set('isReading', state.isReading - 1)
      .value();
  },

  [API_RELATIONSHIP_READ]: (state, { payload: { resource, relationship, data } }) => {
    const newState = updateRelationship(state, resource, relationship, data);

    return imm.wrap(newState)
      .set('isReading', state.isReading - 1)
      .value();
  },

  [API_READ_FAILED]: (state) => {
    return imm.wrap(state).set(['isReading'], state.isReading - 1).value();
  },

  [API_WILL_UPDATE]: (state, { payload: resource }) => {
    const { type, id } = resource;

    const newState = ensureResourceTypeInState(state, type);

    return setIsInvalidatingForExistingResource(newState, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating + 1)
      .value();
  },

  [API_UPDATED]: (state, { payload: resources }) => {
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm.wrap(newState)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_UPDATE_FAILED]: (state, { payload: { resource } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_WILL_DELETE]: (state, { payload: resource }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting + 1)
      .value();
  },

  [API_DELETED]: (state, { payload: resource }) => {
    return removeResourceFromState(state, resource)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  },

  [API_DELETE_FAILED]: (state, { payload: { resource } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  },

  [API_RELATIONSHIP_WILL_UPDATE]: (state, { payload: { resource, relationship } }) => {
    const { type, id } = resource;

    const newState = ensureRelationshipInState(state, {
      type,
      id
    }, relationship);

    return setIsInvalidatingForExistingRelationship(
      newState,
      {
        type,
        id
      },
      relationship,
      IS_UPDATING
    )
      .set('isUpdating', state.isUpdating + 1)
      .value();
  },

  [API_RELATIONSHIP_UPDATED]: (state, { payload: { resource, relationship, data } }) => {
    const newState = updateRelationship(state, resource, relationship, data);

    return imm.wrap(newState)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_RELATIONSHIP_UPDATE_FAILED]: (state, { payload: { resource, relationship } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingRelationship(
      state,
      {
        type,
        id
      },
      relationship,
      IS_UPDATING
    )
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [API_RELATIONSHIP_WILL_DELETE]: (state, { payload: { resource, relationship } }) => {
    const { type, id } = resource;

    const newState = ensureRelationshipInState(state, {
      type,
      id
    }, relationship);

    return setIsInvalidatingForExistingRelationship(
      newState,
      {
        type,
        id
      },
      relationship,
      IS_DELETING
    )
      .set('isDeleting', state.isDeleting + 1)
      .value();
  },

  [API_RELATIONSHIP_DELETED]: (state, { payload: { resource, relationship, data } }) => {
    const newState = updateRelationship(state, resource, relationship, data);

    return imm.wrap(newState)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  },

  [API_RELATIONSHIP_DELETE_FAILED]: (state, { payload: { resource, relationship } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingRelationship(
      state,
      {
        type,
        id
      },
      relationship,
      IS_DELETING
    )
      .set('isDeleting', state.isDeleting - 1)
      .value();
  }

}, {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0,
  endpoint: {
    axiosConfig: {}
  }
});
