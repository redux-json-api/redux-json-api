'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _handleActions;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.requireEntity = exports.deleteEntity = exports.updateEntity = exports.readEndpoint = exports.createEntity = exports.uploadFile = undefined;

var _reduxActions = require('redux-actions');

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _stateMutation = require('./state-mutation/state-mutation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiEndpoint = '' + __API_HOST__ + __API_ENDPOINT__;

// Action names
var API_WILL_CREATE = 'API_WILL_CREATE';
var API_CREATED = 'API_CREATED';
var API_CREATE_FAILED = 'API_CREATE_FAILED';

var API_WILL_READ = 'API_WILL_READ';
var API_READ = 'API_READ';
var API_READ_FAILED = 'API_READ_FAILED';

var API_WILL_UPDATE = 'API_WILL_UPDATE';
var API_UPDATED = 'API_UPDATED';
var API_UPDATE_FAILED = 'API_UPDATE_FAILED';

var API_WILL_DELETE = 'API_WILL_DELETE';
var API_DELETED = 'API_DELETED';
var API_DELETE_FAILED = 'API_DELETE_FAILED';

// Entity isInvalidating values
var IS_DELETING = 'IS_DELETING';
var IS_UPDATING = 'IS_UPDATING';

// Action creators
var apiWillCreate = (0, _reduxActions.createAction)(API_WILL_CREATE);
var apiCreated = (0, _reduxActions.createAction)(API_CREATED);
var apiCreateFailed = (0, _reduxActions.createAction)(API_CREATE_FAILED);

var apiWillRead = (0, _reduxActions.createAction)(API_WILL_READ);
var apiRead = (0, _reduxActions.createAction)(API_READ);
var apiReadFailed = (0, _reduxActions.createAction)(API_READ_FAILED);

var apiWillUpdate = (0, _reduxActions.createAction)(API_WILL_UPDATE);
var apiUpdated = (0, _reduxActions.createAction)(API_UPDATED);
var apiUpdateFailed = (0, _reduxActions.createAction)(API_UPDATE_FAILED);

var apiWillDelete = (0, _reduxActions.createAction)(API_WILL_DELETE);
var apiDeleted = (0, _reduxActions.createAction)(API_DELETED);
var apiDeleteFailed = (0, _reduxActions.createAction)(API_DELETE_FAILED);

// Utilities
var request = function request(url, accessToken) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var allOptions = (0, _extends3.default)({
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/vnd.api+json'
    }
  }, options);

  return (0, _isomorphicFetch2.default)(url, allOptions).then(function (res) {
    if (res.status !== 200) {
      return res;
    }

    return res.json();
  });
};

var noop = function noop() {};

// Actions
var uploadFile = exports.uploadFile = function uploadFile(file, _ref) {
  var companyId = _ref.companyId;
  var _ref$fileableType = _ref.fileableType;
  var fileableType = _ref$fileableType === undefined ? null : _ref$fileableType;
  var _ref$fileableId = _ref.fileableId;
  var fileableId = _ref$fileableId === undefined ? null : _ref$fileableId;

  var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref2$onSuccess = _ref2.onSuccess;
  var onSuccess = _ref2$onSuccess === undefined ? noop : _ref2$onSuccess;
  var _ref2$onError = _ref2.onError;
  var onError = _ref2$onError === undefined ? noop : _ref2$onError;

  return function (dispatch, getState) {
    var accessToken = getState().auth.user.access_token;
    var path = [companyId, fileableType, fileableId].filter(function (o) {
      return !!o;
    }).join('/');
    var url = __API_HOST__ + '/upload/' + path + '?access_token=' + accessToken;

    var data = new FormData();
    data.append('file', file);

    var options = {
      method: 'POST',
      body: data
    };

    return (0, _isomorphicFetch2.default)(url, options).then(function (res) {
      if (res.status !== 200) {
        return res;
      }

      return res.json();
    }).then(function (json) {
      onSuccess(json);
    }).catch(function (error) {
      onError(error);
    });
  };
};

var createEntity = exports.createEntity = function createEntity(entity) {
  var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref3$onSuccess = _ref3.onSuccess;
  var onSuccess = _ref3$onSuccess === undefined ? noop : _ref3$onSuccess;
  var _ref3$onError = _ref3.onError;
  var onError = _ref3$onError === undefined ? noop : _ref3$onError;

  return function (dispatch, getState) {
    dispatch(apiWillCreate(entity));

    var accessToken = getState().auth.user.access_token;
    var endpoint = apiEndpoint + '/' + entity.type;

    request(endpoint, accessToken, {
      method: 'POST',
      body: (0, _stringify2.default)({
        data: entity
      })
    }).then(function (json) {
      dispatch(apiCreated(json.data));
      onSuccess();
    }).catch(function (error) {
      dispatch(apiCreateFailed(entity));
      onError(error);
    });
  };
};

var readEndpoint = exports.readEndpoint = function readEndpoint(endpoint) {
  var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref4$onSuccess = _ref4.onSuccess;
  var onSuccess = _ref4$onSuccess === undefined ? noop : _ref4$onSuccess;
  var _ref4$onError = _ref4.onError;
  var onError = _ref4$onError === undefined ? noop : _ref4$onError;

  return function (dispatch, getState) {
    dispatch(apiWillRead(endpoint));

    var accessToken = getState().auth.user.access_token;

    request(apiEndpoint + '/' + endpoint, accessToken).then(function (json) {
      dispatch(apiRead((0, _extends3.default)({ endpoint: endpoint }, json)));
      onSuccess();
    }).catch(function (error) {
      dispatch(apiReadFailed(endpoint));
      onError(error);
    });
  };
};

var updateEntity = exports.updateEntity = function updateEntity(entity) {
  var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref5$onSuccess = _ref5.onSuccess;
  var onSuccess = _ref5$onSuccess === undefined ? noop : _ref5$onSuccess;
  var _ref5$onError = _ref5.onError;
  var onError = _ref5$onError === undefined ? noop : _ref5$onError;

  return function (dispatch, getState) {
    dispatch(apiWillUpdate(entity));

    var accessToken = getState().auth.user.access_token;
    var endpoint = apiEndpoint + '/' + entity.type + '/' + entity.id;

    request(endpoint, accessToken, {
      method: 'PATCH',
      body: (0, _stringify2.default)({
        data: entity
      })
    }).then(function (response) {
      dispatch(apiUpdated(response.data));
      onSuccess();
    }).catch(function (error) {
      dispatch(apiUpdateFailed(entity));
      onError(error);
    });
  };
};

var deleteEntity = exports.deleteEntity = function deleteEntity(entity) {
  var _ref6 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref6$onSuccess = _ref6.onSuccess;
  var onSuccess = _ref6$onSuccess === undefined ? noop : _ref6$onSuccess;
  var _ref6$onError = _ref6.onError;
  var onError = _ref6$onError === undefined ? noop : _ref6$onError;

  return function (dispatch, getState) {
    dispatch(apiWillDelete(entity));

    var accessToken = getState().auth.user.access_token;
    var endpoint = apiEndpoint + '/' + entity.type + '/' + entity.id;

    request(endpoint, accessToken, {
      method: 'DELETE'
    }).then(function () {
      dispatch(apiDeleted(entity));
      onSuccess();
    }).catch(function (error) {
      dispatch(apiDeleteFailed(entity));
      onError(error);
    });
  };
};

var requireEntity = exports.requireEntity = function requireEntity(entityType) {
  var endpoint = arguments.length <= 1 || arguments[1] === undefined ? entityType : arguments[1];

  var _ref7 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref7$onSuccess = _ref7.onSuccess;
  var onSuccess = _ref7$onSuccess === undefined ? noop : _ref7$onSuccess;
  var _ref7$onError = _ref7.onError;
  var onError = _ref7$onError === undefined ? noop : _ref7$onError;

  return function (dispatch, getState) {
    var _getState = getState();

    var api = _getState.api;

    if (api.hasOwnProperty(entityType)) {
      return onSuccess();
    }

    dispatch(readEndpoint(endpoint, { onSuccess: onSuccess, onError: onError }));
  };
};

// Reducers
var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, (0, _defineProperty3.default)(_handleActions, API_WILL_CREATE, function (state) {
  return (0, _extends3.default)({}, state, {
    isCreating: state.isCreating + 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_CREATED, function (state, _ref8) {
  var payload = _ref8.payload;

  return (0, _extends3.default)({}, (0, _stateMutation.updateOrInsertEntitiesIntoState)(state, payload), {
    isCreating: state.isCreating - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_CREATE_FAILED, function (state) {
  return (0, _extends3.default)({}, state, {
    isCreating: state.isCreating - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_WILL_READ, function (state) {
  return (0, _extends3.default)({}, state, {
    isReading: state.isReading + 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_READ, function (state, action) {
  var newState = (0, _stateMutation.updateOrInsertEntitiesIntoState)(state, action.payload.data);

  if (action.payload.included) {
    return (0, _extends3.default)({}, (0, _stateMutation.updateOrInsertEntitiesIntoState)(newState, action.payload.included), {
      isReading: state.isReading - 1
    });
  }

  return (0, _extends3.default)({}, newState, {
    isReading: state.isReading - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_READ_FAILED, function (state) {
  return (0, _extends3.default)({}, state, {
    isReading: state.isReading - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_WILL_UPDATE, function (state, _ref9) {
  var entity = _ref9.payload;
  var type = entity.type;
  var id = entity.id;

  return (0, _extends3.default)({}, (0, _stateMutation.setIsInvalidatingForExistingEntity)(state, { type: type, id: id }, IS_UPDATING), {
    isUpdating: state.isUpdating + 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_UPDATED, function (state, _ref10) {
  var entity = _ref10.payload;

  return (0, _extends3.default)({}, (0, _stateMutation.updateOrInsertEntitiesIntoState)(state, entity), {
    isUpdating: state.isUpdating - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_UPDATE_FAILED, function (state, _ref11) {
  var entity = _ref11.payload;
  var type = entity.type;
  var id = entity.id;

  return (0, _extends3.default)({}, (0, _stateMutation.setIsInvalidatingForExistingEntity)(state, { type: type, id: id }, null), {
    isUpdating: state.isUpdating - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_WILL_DELETE, function (state, _ref12) {
  var entity = _ref12.payload;
  var type = entity.type;
  var id = entity.id;

  return (0, _extends3.default)({}, (0, _stateMutation.setIsInvalidatingForExistingEntity)(state, { type: type, id: id }, IS_DELETING), {
    isDeleting: state.isDeleting + 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_DELETED, function (state, _ref13) {
  var payload = _ref13.payload;

  return (0, _extends3.default)({}, (0, _stateMutation.removeEntityFromState)(state, payload), {
    isDeleting: state.isDeleting - 1
  });
}), (0, _defineProperty3.default)(_handleActions, API_DELETE_FAILED, function (state, _ref14) {
  var entity = _ref14.payload;
  var type = entity.type;
  var id = entity.id;

  return (0, _extends3.default)({}, (0, _stateMutation.setIsInvalidatingForExistingEntity)(state, { type: type, id: id }, null), {
    isDeleting: state.isDeleting - 1
  });
}), _handleActions), {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0
});
