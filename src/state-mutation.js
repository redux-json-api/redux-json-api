import imm from 'object-path-immutable';
import pluralize from 'pluralize';
import { hasOwnProperties } from './utils';
import equal from 'deep-equal';

export const makeUpdateReverseRelationship = (
  resource,
  relationship,
  newRelation = {
    type: resource.type,
    id: resource.id
  }
) => {
  return (foreignResources) => {
    const idx = foreignResources.findIndex(item => (
      item.id === relationship.data.id
    ));

    if (idx === -1) {
      return foreignResources;
    }

    const [singular, plural] = [1, 2].map(i => pluralize(resource.type, i));
    const relCase = [singular, plural]
      .find(r => (
        hasOwnProperties(foreignResources[idx], ['relationships', r])
      )
    );

    if (!relCase) {
      return foreignResources;
    }

    const relPath = ['relationships', relCase, 'data'];
    const idxRelPath = [idx].concat(relPath);

    const immutableForeingResources = imm(foreignResources);

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
        && ~foreignResourceRel.findIndex(
          rel => rel.id === newRelation.id && rel.type === newRelation.type
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
    } else if (Array.isArray(foreignResourceRel) && !newRelation) {
      const relIdx = foreignResourceRel.findIndex(item => (
        item.id === resource.id
      ));

      if (foreignResourceRel[relIdx]) {
        const deletePath = [idx, 'relationships', singular, 'data', relIdx];
        return imm(foreignResources).del(deletePath).value();
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
      item => item.id === resource.id
    ) > -1;
  }

  return false;
};

export const addLinksToState = (state, links, options) => {
  if (options === undefined || options.indexLinks === undefined) {
    return state;
  }

  const indexLinkName = options.indexLinks;
  const newState = imm.set(state, `links.${indexLinkName}`, links);

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
    const idx = resources.findIndex(item => item.id === resource.id);

    const relationships = {};
    for (const relationship in resources[idx].relationships) {
      if (!hasOwnProperties(resource, ['relationships', relationship, 'data'])) {
        relationships[relationship] = resources[idx].relationships[relationship];
      }
    }
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

  const rels = resource.relationships;

  if (!rels) {
    return newState;
  }

  Object.keys(rels).forEach(relKey => {
    if (!hasOwnProperties(rels[relKey], ['data', 'type'])) {
      return;
    }

    const entityPath = [rels[relKey].data.type, 'data'];

    if (!hasOwnProperties(newState, entityPath)) {
      return;
    }

    const updateReverseRelationship = makeUpdateReverseRelationship(
      resource, rels[relKey]
    );

    newState = imm.set(
      newState,
      entityPath,
      updateReverseRelationship(newState[rels[relKey].data.type].data)
    );
  });

  return newState;
};

export const removeResourceFromState = (state, resource) => {
  const index = state[resource.type].data.findIndex(e => e.id === resource.id);
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
  }, imm(state).del(path));
};

export const updateOrInsertResourcesIntoState = (state, resources) => (
  resources.reduce(updateOrInsertResource, state)
);

export const setIsInvalidatingForExistingResource = (state, { type, id }, value = null) => {
  const idx = state[type].data.findIndex(e => e.id === id && e.type === type);
  const updatePath = [type, 'data', idx, 'isInvalidating'];

  return value === null
    ? imm(state).del(updatePath)
    : imm(state).set(updatePath, value);
};

export const ensureResourceTypeInState = (state, type) => {
  const path = [type, 'data'];
  return hasOwnProperties(state, [type])
    ? state
    : imm(state).set(path, []).value();
};
