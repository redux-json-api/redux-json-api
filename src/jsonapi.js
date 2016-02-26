import { createAction, handleActions } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import {
  removeEntityFromState,
  updateOrInsertEntitiesIntoState,
  setIsInvalidatingForExistingEntity
} from './state-mutation/state-mutation';

const apiHost = __API_HOST__ || global.__API_HOST__;
const apiEndpoint = __API_ENDPOINT__ || global.__API_ENDPOINT__;

const apiUrl = `${apiHost}${apiEndpoint}`;
const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

// Action names
const API_WILL_CREATE = 'API_WILL_CREATE';
const API_CREATED = 'API_CREATED';
const API_CREATE_FAILED = 'API_CREATE_FAILED';

const API_WILL_READ = 'API_WILL_READ';
const API_READ = 'API_READ';
const API_READ_FAILED = 'API_READ_FAILED';

const API_WILL_UPDATE = 'API_WILL_UPDATE';
const API_UPDATED = 'API_UPDATED';
const API_UPDATE_FAILED = 'API_UPDATE_FAILED';

const API_WILL_DELETE = 'API_WILL_DELETE';
const API_DELETED = 'API_DELETED';
const API_DELETE_FAILED = 'API_DELETE_FAILED';

// Entity isInvalidating values
const IS_DELETING = 'IS_DELETING';
const IS_UPDATING = 'IS_UPDATING';

// Action creators
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

// Utilities
const request = (url, accessToken, options = {}) => {
  const allOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.api+json'
    },
    ...options
  };

  return fetch(url, allOptions)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        if (jsonContentTypes.indexOf(res.headers.get('Content-Type')) > -1) {
          return res.json();
        }

        return res;
      }

      const e = new Error(res.statusText);
      e.response = res;
      throw e;
    });
};

const noop = () => {};

// Actions
export const uploadFile = (file, {
  companyId,
  fileableType: fileableType = null,
  fileableId: fileableId = null
}, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    const accessToken = getState().auth.user.access_token;
    const path = [companyId, fileableType, fileableId].filter(o => !!o).join('/');
    const url = `${__API_HOST__}/upload/${path}?access_token=${accessToken}`;

    const data = new FormData;
    data.append('file', file);

    const options = {
      method: 'POST',
      body: data
    };

    return fetch(url, options)
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          if (jsonContentTypes.indexOf(res.headers.get('Content-Type')) > -1) {
            return res.json();
          }

          return res;
        }

        const e = new Error(res.statusText);
        e.response = res;
        throw e;
      })
      .then(json => {
        onSuccess(json);
      })
      .catch(error => {
        onError(error);
      });
  };
};

export const createEntity = (entity, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillCreate(entity));

    const accessToken = getState().auth.user.access_token;
    const endpoint = `${apiUrl}/${entity.type}`;

    request(endpoint, accessToken, {
      method: 'POST',
      body: JSON.stringify({
        data: entity
      })
    }).then(json => {
      dispatch(apiCreated(json.data));
      onSuccess();
    }).catch((error) => {
      dispatch(apiCreateFailed(entity));
      onError(error);
    });
  };
};

export const readEndpoint = (endpoint, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillRead(endpoint));

    const accessToken = getState().auth.user.access_token;

    request(`${apiUrl}/${endpoint}`, accessToken)
      .then(json => {
        dispatch(apiRead({ endpoint, ...json }));
        onSuccess();
      })
      .catch((error) => {
        dispatch(apiReadFailed(endpoint));
        onError(error);
      });
  };
};

export const updateEntity = (entity, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillUpdate(entity));

    const accessToken = getState().auth.user.access_token;
    const endpoint = `${apiUrl}/${entity.type}/${entity.id}`;

    request(endpoint, accessToken, {
      method: 'PATCH',
      body: JSON.stringify({
        data: entity
      })
    }).then((response) => {
      dispatch(apiUpdated(response.data));
      onSuccess();
    }).catch((error) => {
      dispatch(apiUpdateFailed(entity));
      onError(error);
    });
  };
};

export const deleteEntity = (entity, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillDelete(entity));

    const accessToken = getState().auth.user.access_token;
    const endpoint = `${apiUrl}/${entity.type}/${entity.id}`;

    request(endpoint, accessToken, {
      method: 'DELETE'
    }).then(() => {
      dispatch(apiDeleted(entity));
      onSuccess();
    }).catch((error) => {
      dispatch(apiDeleteFailed(entity));
      onError(error);
    });
  };
};

export const requireEntity = (entityType, endpoint = entityType, {
  onSuccess: onSuccess = noop,
  onError: onError = noop
} = {}) => {
  return (dispatch, getState) => {
    const { api } = getState();
    if (api.hasOwnProperty(entityType)) {
      return onSuccess();
    }

    dispatch(readEndpoint(endpoint, { onSuccess, onError }));
  };
};

// Reducers
export const reducer = handleActions({

  [API_WILL_CREATE]: (state) => {
    return {
      ...state,
      isCreating: (state.isCreating + 1)
    };
  },

  [API_CREATED]: (state, { payload }) => {
    return {
      ...updateOrInsertEntitiesIntoState(state, payload),
      isCreating: (state.isCreating - 1)
    };
  },

  [API_CREATE_FAILED]: (state) => {
    return {
      ...state,
      isCreating: (state.isCreating - 1)
    };
  },

  [API_WILL_READ]: (state) => {
    return {
      ...state,
      isReading: (state.isReading + 1)
    };
  },

  [API_READ]: (state, action) => {
    const newState = updateOrInsertEntitiesIntoState(state, action.payload.data);

    if (action.payload.included) {
      return {
        ...updateOrInsertEntitiesIntoState(newState, action.payload.included),
        isReading: (state.isReading - 1)
      };
    }

    return {
      ...newState,
      isReading: (state.isReading - 1)
    };
  },

  [API_READ_FAILED]: (state) => {
    return {
      ...state,
      isReading: (state.isReading - 1)
    };
  },

  [API_WILL_UPDATE]: (state, { payload: entity }) => {
    const { type, id } = entity;

    return {
      ...setIsInvalidatingForExistingEntity(state, { type, id }, IS_UPDATING),
      isUpdating: (state.isUpdating + 1)
    };
  },

  [API_UPDATED]: (state, { payload: entity }) => {
    return {
      ...updateOrInsertEntitiesIntoState(state, entity),
      isUpdating: (state.isUpdating - 1)
    };
  },

  [API_UPDATE_FAILED]: (state, { payload: entity }) => {
    const { type, id } = entity;

    return {
      ...setIsInvalidatingForExistingEntity(state, { type, id }, null),
      isUpdating: (state.isUpdating - 1)
    };
  },

  [API_WILL_DELETE]: (state, { payload: entity }) => {
    const { type, id } = entity;

    return {
      ...setIsInvalidatingForExistingEntity(state, { type, id }, IS_DELETING),
      isDeleting: (state.isDeleting + 1)
    };
  },

  [API_DELETED]: (state, { payload }) => {
    return {
      ...removeEntityFromState(state, payload),
      isDeleting: (state.isDeleting - 1)
    };
  },

  [API_DELETE_FAILED]: (state, { payload: entity }) => {
    const { type, id } = entity;

    return {
      ...setIsInvalidatingForExistingEntity(state, { type, id }, null),
      isDeleting: (state.isDeleting - 1)
    };
  }

}, {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0
});
