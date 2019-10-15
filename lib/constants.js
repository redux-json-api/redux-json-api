'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keykey = require('keykey');

var _keykey2 = _interopRequireDefault(_keykey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Action types of the library
exports.default = (0, _keykey2.default)(['API_SET_AXIOS_CONFIG', 'API_HYDRATE', 'API_WILL_CREATE', 'API_CREATED', 'API_CREATE_FAILED', 'API_WILL_READ', 'API_READ', 'API_READ_FAILED', 'API_WILL_UPDATE', 'API_UPDATED', 'API_UPDATE_FAILED', 'API_WILL_DELETE', 'API_DELETED', 'API_DELETE_FAILED']);
module.exports = exports['default'];