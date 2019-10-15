'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureResourceTypeInState = exports.setIsInvalidatingForExistingResource = exports.updateOrInsertResourcesIntoState = exports.removeResourceFromState = exports.updateOrInsertResource = exports.addLinksToState = exports.makeUpdateReverseRelationship = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _objectPathImmutable = require('object-path-immutable');

var _objectPathImmutable2 = _interopRequireDefault(_objectPathImmutable);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _utils = require('./utils');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeUpdateReverseRelationship = exports.makeUpdateReverseRelationship = function makeUpdateReverseRelationship(resource, relationship) {
  var newRelation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    type: resource.type,
    id: resource.id
  };

  return function (foreignResources) {
    var idx = foreignResources.findIndex(function (item) {
      return item.id === relationship.data.id;
    });

    if (idx === -1) {
      return foreignResources;
    }

    var _map = [1, 2].map(function (i) {
      return (0, _pluralize2.default)(resource.type, i);
    }),
        _map2 = (0, _slicedToArray3.default)(_map, 2),
        singular = _map2[0],
        plural = _map2[1];

    var relCase = [singular, plural].find(function (r) {
      return (0, _utils.hasOwnProperties)(foreignResources[idx], ['relationships', r]);
    });

    if (!relCase) {
      return foreignResources;
    }

    var relPath = ['relationships', relCase, 'data'];
    var idxRelPath = [idx].concat(relPath);

    var immutableForeingResources = (0, _objectPathImmutable2.default)(foreignResources);

    if (!(0, _utils.hasOwnProperties)(foreignResources[idx], relPath)) {
      return immutableForeingResources.push(idxRelPath, newRelation).value();
    }

    var foreignResourceRel = foreignResources[idx].relationships[relCase].data;

    if (newRelation && Array.isArray(foreignResourceRel) && ~foreignResourceRel.findIndex(function (rel) {
      return rel.id === newRelation.id && rel.type === newRelation.type;
    }) || newRelation && foreignResourceRel && foreignResourceRel.id === newRelation.id && foreignResourceRel.type === newRelation.type) {
      return foreignResources;
    } else if (Array.isArray(foreignResourceRel) && !newRelation) {
      var relIdx = foreignResourceRel.findIndex(function (item) {
        return item.id === resource.id;
      });

      if (foreignResourceRel[relIdx]) {
        var deletePath = [idx, 'relationships', singular, 'data', relIdx];
        return (0, _objectPathImmutable2.default)(foreignResources).del(deletePath).value();
      }

      return foreignResources;
    }

    if (relCase === singular) {
      return immutableForeingResources.set(idxRelPath, newRelation).value();
    }

    return immutableForeingResources.push(idxRelPath, newRelation).value();
  };
};

var stateContainsResource = function stateContainsResource(state, resource) {
  var updatePath = [resource.type, 'data'];

  if ((0, _utils.hasOwnProperties)(state, updatePath)) {
    return state[resource.type].data.findIndex(function (item) {
      return item.id === resource.id;
    }) > -1;
  }

  return false;
};

var addLinksToState = exports.addLinksToState = function addLinksToState(state, links, options) {
  if (options === undefined || options.indexLinks === undefined) {
    return state;
  }

  var indexLinkName = options.indexLinks;
  var newState = _objectPathImmutable2.default.set(state, 'links.' + indexLinkName, links);

  return newState;
};

var updateOrInsertResource = exports.updateOrInsertResource = function updateOrInsertResource(state, resource) {
  if ((typeof resource === 'undefined' ? 'undefined' : (0, _typeof3.default)(resource)) !== 'object') {
    return state;
  }

  var newState = state;
  var updatePath = [resource.type, 'data'];

  if (stateContainsResource(state, resource)) {
    var resources = state[resource.type].data;
    var idx = resources.findIndex(function (item) {
      return item.id === resource.id;
    });

    var relationships = {};
    for (var relationship in resources[idx].relationships) {
      if (!(0, _utils.hasOwnProperties)(resource, ['relationships', relationship, 'data'])) {
        relationships[relationship] = resources[idx].relationships[relationship];
      }
    }
    if (!resource.hasOwnProperty('relationships')) {
      (0, _assign2.default)(resource, { relationships: relationships });
    } else {
      (0, _assign2.default)(resource.relationships, relationships);
    }

    if (!(0, _deepEqual2.default)(resources[idx], resource)) {
      newState = _objectPathImmutable2.default.set(newState, updatePath.concat(idx), resource);
    }
  } else {
    newState = _objectPathImmutable2.default.push(newState, updatePath, resource);
  }

  var rels = resource.relationships;

  if (!rels) {
    return newState;
  }

  (0, _keys2.default)(rels).forEach(function (relKey) {
    if (!(0, _utils.hasOwnProperties)(rels[relKey], ['data', 'type'])) {
      return;
    }

    var entityPath = [rels[relKey].data.type, 'data'];

    if (!(0, _utils.hasOwnProperties)(newState, entityPath)) {
      return;
    }

    var updateReverseRelationship = makeUpdateReverseRelationship(resource, rels[relKey]);

    newState = _objectPathImmutable2.default.set(newState, entityPath, updateReverseRelationship(newState[rels[relKey].data.type].data));
  });

  return newState;
};

var removeResourceFromState = exports.removeResourceFromState = function removeResourceFromState(state, resource) {
  var index = state[resource.type].data.findIndex(function (e) {
    return e.id === resource.id;
  });
  var path = [resource.type, 'data', index];
  var entityRelationships = resource.relationships || {};

  return (0, _keys2.default)(entityRelationships).reduce(function (newState, key) {
    if (!resource.relationships[key].data) {
      return newState;
    }

    var entityPath = [resource.relationships[key].data.type, 'data'];

    if ((0, _utils.hasOwnProperties)(state, entityPath)) {
      var updateReverseRelationship = makeUpdateReverseRelationship(resource, resource.relationships[key], null);

      return newState.set(entityPath, updateReverseRelationship(state[resource.relationships[key].data.type].data));
    }

    return newState;
  }, (0, _objectPathImmutable2.default)(state).del(path));
};

var updateOrInsertResourcesIntoState = exports.updateOrInsertResourcesIntoState = function updateOrInsertResourcesIntoState(state, resources) {
  return resources.reduce(updateOrInsertResource, state);
};

var setIsInvalidatingForExistingResource = exports.setIsInvalidatingForExistingResource = function setIsInvalidatingForExistingResource(state, _ref) {
  var type = _ref.type,
      id = _ref.id;
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var idx = state[type].data.findIndex(function (e) {
    return e.id === id && e.type === type;
  });
  var updatePath = [type, 'data', idx, 'isInvalidating'];

  return value === null ? (0, _objectPathImmutable2.default)(state).del(updatePath) : (0, _objectPathImmutable2.default)(state).set(updatePath, value);
};

var ensureResourceTypeInState = exports.ensureResourceTypeInState = function ensureResourceTypeInState(state, type) {
  var path = [type, 'data'];
  return (0, _utils.hasOwnProperties)(state, [type]) ? state : (0, _objectPathImmutable2.default)(state).set(path, []).value();
};