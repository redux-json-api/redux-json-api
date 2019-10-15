'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaginationUrl = exports.hasOwnProperties = exports.apiRequest = exports.noop = exports.jsonContentTypes = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _createError = require('axios/lib/core/createError');

var _createError2 = _interopRequireDefault(_createError);

var _objectPathImmutable = require('object-path-immutable');

var _objectPathImmutable2 = _interopRequireDefault(_objectPathImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonContentTypes = exports.jsonContentTypes = ['application/json', 'application/vnd.api+json'];

var hasValidContentType = function hasValidContentType(response) {
  return jsonContentTypes.some(function (contentType) {
    return response.headers['content-type'].indexOf(contentType) > -1;
  });
};

var noop = exports.noop = function noop() {};

var apiRequest = exports.apiRequest = function apiRequest(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var allOptions = (0, _objectPathImmutable2.default)(options).set('url', url).set(['headers', 'Accept'], 'application/vnd.api+json').set(['headers', 'Content-Type'], 'application/vnd.api+json').value();

  return (0, _axios2.default)(allOptions).then(function (res) {
    if (res.status === 204) {
      return res;
    }

    if (hasValidContentType(res) === false) {
      throw (0, _createError2.default)('Invalid Content-Type in response', res.config, null, res);
    }

    return res.data;
  });
};

var hasOwnProperties = exports.hasOwnProperties = function hasOwnProperties(obj, propertyTree) {
  if (obj instanceof Object === false) {
    return false;
  }
  var property = propertyTree[0];
  var hasProperty = obj.hasOwnProperty(property);
  if (hasProperty) {
    if (propertyTree.length === 1) {
      return hasProperty;
    }
    return hasOwnProperties(obj[property], propertyTree.slice(1));
  }
  return false;
};

var getPaginationUrl = exports.getPaginationUrl = function getPaginationUrl(response, direction, path) {
  if (!response.links || !hasOwnProperties(response, ['links', direction])) {
    return null;
  }

  var paginationUrl = response.links[direction];
  if (!paginationUrl) {
    return null;
  }

  if (hasOwnProperties(response.links[direction], ['href'])) {
    paginationUrl = response.links[direction].href;
  }
  return paginationUrl.replace(path + '/', '');
};