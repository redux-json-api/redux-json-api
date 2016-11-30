'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Action types of the library
var actionTypes = {};

// Format the elements
['API_SET_ENDPOINT_HOST', 'API_SET_ENDPOINT_PATH', 'API_SET_HEADERS', 'API_SET_HEADER', 'API_WILL_CREATE', 'API_CREATED', 'API_CREATE_FAILED', 'API_WILL_READ', 'API_READ', 'API_READ_FAILED', 'API_WILL_UPDATE', 'API_UPDATED', 'API_UPDATE_FAILED', 'API_WILL_DELETE', 'API_DELETED', 'API_DELETE_FAILED'].forEach(function (action) {
  actionTypes[action] = action;
});

exports.default = actionTypes;
module.exports = exports['default'];