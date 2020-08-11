import imm from 'object-path-immutable';
import pluralize from 'pluralize';
import equal from 'deep-equal';
import { hasOwnProperties } from './utils';

export const makeUpdateReverseRelationship = (
  resource,
  relationship,
  newRelation = {
    type: resource.type,
    id: resource.id
  }
) => {
  return (foreignResources) => {
    const idx = foreignResources.findIndex((item) => (
      item.id === relationship.data.id
    ));

    if (idx === -1) {
      return foreignResources;
    }

    const [singular, plural] = [1, 2].map((i) => pluralize(resource.type, i));
    const relCase = [singular, plural]
      .find((r) => (
        hasOwnProperties(foreignResources[idx], ['relationships', r])
      ));

    if (!relCase) {
      return foreignResources;
    }

    const relPath = ['relationships', relCase, 'data'];
    const idxRelPath = [idx].concat(relPath);

    const immutableForeingResources = imm.wrap(foreignResources);

    if (!hasOwnProperties(foreignResources[idx], relPath)) {
      return immutableForeingResources
        .push(idxRelPath, newRelation)
        .value();
    }

    const foreignResourceRel = foreignResources[idx].relationships[relCase].data;

    if (
      (
        newRelation
        && Array.isArray(foreignResourceRel)
        && ~foreignResourceRel.findIndex( // eslint-disable-line
          (rel) => rel.id === newRelation.id && rel.type === newRelation.type
        )
      )
      || (
        newRelation
        && foreignResourceRel
        && foreignResourceRel.id === newRelation.id
        && foreignResourceRel.type === newRelation.type
      )
    ) {
      return foreignResources;
    } if (Array.isArray(foreignResourceRel) && !newRelation) {
      const relIdx = foreignResourceRel.findIndex((item) => (
        item.id === resource.id
      ));

      if (foreignResourceRel[relIdx]) {
        const deletePath = [idx, 'relationships', singular, 'data', relIdx];
        return imm.wrap(foreignResources).del(deletePath).value();
      }

      return foreignResources;
    }

    if (relCase === singular) {
      return immutableForeingResources
        .set(idxRelPath, newRelation)
        .value();
    }

    return immutableForeingResources
      .push(idxRelPath, newRelation)
      .value();
  };
};

const stateContainsResource = (state, resource) => {
  const updatePath = [resource.type, 'data'];

  if (hasOwnProperties(state, updatePath)) {
    return state[resource.type].data.findIndex(
      (item) => item.id === resource.id
    ) > -1;
  }

  return false;
};

const ensureUpdatedReverseRelationships = (state, resource) => {
  let newState = state;
  const rels = resource.relationships;

  if (!rels) {
    return newState;
  }

  Object.keys(rels).forEach((relKey) => {
    if (!hasOwnProperties(rels[relKey], ['data', 'type'])) {
      return;
    }

    const entityPath = [rels[relKey].data.type, 'data'];

    if (!hasOwnProperties(newState, entityPath)) {
      return;
    }

    const updateReverseRelationship = makeUpdateReverseRelationship(resource, rels[relKey]);

    newState = imm.set(
      newState,
      entityPath,
      updateReverseRelationship(newState[rels[relKey].data.type].data)
    );
  });

  return newState;
};

export const addLinksToState = (state, links, options) => {
  if (options === undefined || options.indexLinks === undefined) {
    return state;
  }

  const indexLinkName = options.indexLinks;
  return imm.set(state, `links.${indexLinkName}`, links);
};

export const updateRelationship = (state, resourceIdentifier, relationshipName, relationship) => {
  if (typeof resourceIdentifier !== 'object') {
    return state;
  }

  if (!stateContainsResource(state, resourceIdentifier)) {
    return state;
  }

  let newState = state;
  const updatePath = [resourceIdentifier.type, 'data'];

  const resources = state[resourceIdentifier.type].data;
  const idx = resources.findIndex((item) => item.id === resourceIdentifier.id);

  newState = imm.set(newState, updatePath.concat(...[idx, 'relationships', relationshipName]), relationship);

  return newState;
};

export const updateOrInsertResource = (state, resource) => {
  if (typeof resource !== 'object') {
    return state;
  }

  let newState = state;
  const updatePath = [resource.type, 'data'];

  if (stateContainsResource(state, resource)) {
    const resources = state[resource.type].data;
    const idx = resources.findIndex((item) => item.id === resource.id);

    const relationships = {};
    Object.keys(resources[idx].relationships).forEach((relationship) => {
      if (!hasOwnProperties(resource, ['relationships', relationship, 'data'])) {
        relationships[relationship] = resources[idx].relationships[relationship];
      }
    });
    if (!resource.hasOwnProperty('relationships')) {
      Object.assign(resource, { relationships });
    } else {
      Object.assign(resource.relationships, relationships);
    }

    if (!equal(resources[idx], resource)) {
      newState = imm.set(newState, updatePath.concat(idx), resource);
    }
  } else {
    newState = imm.push(newState, updatePath, resource);
  }

  return ensureUpdatedReverseRelationships(newState, resource);
};

export const removeResourceFromState = (state, resource) => {
  const index = state[resource.type].data.findIndex((e) => e.id === resource.id);
  const path = [resource.type, 'data', index];
  const entityRelationships = resource.relationships || {};

  return Object.keys(entityRelationships).reduce((newState, key) => {
    if (!resource.relationships[key].data) {
      return newState;
    }

    const entityPath = [resource.relationships[key].data.type, 'data'];

    if (hasOwnProperties(state, entityPath)) {
      const updateReverseRelationship = makeUpdateReverseRelationship(
        resource,
        resource.relationships[key],
        null
      );

      return newState.set(
        entityPath,
        updateReverseRelationship(
          state[resource.relationships[key].data.type].data
        )
      );
    }

    return newState;
  }, imm.wrap(state).del(path));
};

export const updateOrInsertResourcesIntoState = (state, resources) => (
  resources.reduce(updateOrInsertResource, state)
);

export const setIsInvalidatingForExistingResource = (state, { type, id }, value = null) => {
  const idx = state[type].data.findIndex((e) => e.id === id && e.type === type);
  const updatePath = [type, 'data', idx, 'isInvalidating'];

  return value === null
    ? imm.wrap(state).del(updatePath)
    : imm.wrap(state).set(updatePath, value);
};

export const ensureResourceTypeInState = (state, type) => {
  const path = [type, 'data'];
  return hasOwnProperties(state, [type])
    ? state
    : imm.wrap(state).set(path, []).value();
};
