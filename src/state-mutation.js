import ImmOP from 'object-path-immutable';
import pluralize from 'pluralize';
import { hasOwnProperties } from './utils';

export const _updateReverseRelationship = (
  entity,
  relationship,
  newRelation = {
    type: entity.type,
    id: entity.id
  }
) => {
  return (foreignEntities) => {
    const idx = foreignEntities.findIndex(item => (
      item.id === relationship.data.id
    ));

    if (idx === -1) {
      return foreignEntities;
    }

    const [singular, plural] = [1, 2].map(i => pluralize(entity.type, i));
    const relCase = [singular, plural]
      .find(r => (
        hasOwnProperties(foreignEntities[idx], ['relationships', r])
      )
    );

    if (!relCase) {
      return foreignEntities;
    }

    const relPath = ['relationships', relCase, 'data'];
    const idxRelPath = [idx].concat(relPath);

    const immutableForeingEntities = ImmOP(foreignEntities);

    if (!hasOwnProperties(foreignEntities[idx], relPath)) {
      return immutableForeingEntities
      .push(idxRelPath, newRelation)
      .value();
    }

    if (relCase === singular) {
      return immutableForeingEntities
        .set(idxRelPath, newRelation)
        .value();
    }

    return immutableForeingEntities
      .push(idxRelPath, newRelation)
      .value();
  };
};

const _updateOrInsertEntity = (state, entity) => {
  if (typeof entity !== 'object') {
    return state;
  }

  const newState = ImmOP(state);

  const updatePath = [entity.type, 'data'];

  if (!hasOwnProperties(state, updatePath)) {
    newState
      .push(updatePath, entity);
  } else {
    const idx = state[entity.type].data.findIndex(item => item.id === entity.id);

    if (idx === -1) {
      newState
        .push(updatePath, entity);
    } else {
      newState
        .set(updatePath.concat(idx), entity);
    }
  }

  const rels = entity.relationships;

  if (!rels) {
    return newState.value();
  }

  Object.keys(rels).forEach(relKey => {
    if (!hasOwnProperties(rels[relKey], ['data', 'type'])) {
      return;
    }

    const entityPath = [
      rels[relKey].data.type,
      'data',
    ];

    if (!hasOwnProperties(state, entityPath)) {
      return;
    }

    newState
      .set(
        entityPath,
        _updateReverseRelationship(entity, rels[relKey])(state[rels[relKey].data.type].data)
      );
  });

  return newState.value();
};

export const removeEntityFromState = (state, entity) => {
  const index = state[entity.type].data.findIndex(e => e.id === entity.id);
  const path = [entity.type, 'data', index];
  const entityRelationships = entity.relationships;

  return Object.keys(entityRelationships).reduce((newState, key) => {
    if (entity.relationships[key].data === null) {
      return newState;
    }

    const entityPath = [entity.relationships[key].data.type, 'data'];

    if (hasOwnProperties(state, entityPath)) {
      return newState.set(
        entityPath,
        _updateReverseRelationship(
          entity,
          entity.relationships[key],
          null
        )(state[entity.relationships[key].data.type].data)
      );
    }

    return newState;
  }, ImmOP(state).del(path));
};

export const updateOrInsertEntitiesIntoState = (state, entities) => {
  return entities.reduce(
    _updateOrInsertEntity,
    state
  );
};

export const setIsInvalidatingForExistingEntity = (state, { type, id }, value = null) => {
  const idx = state[type].data
    .findIndex(e => e.id === id && e.type === type);

  const updatePath = [type, 'data', idx, 'isInvalidating'];

  const newState = ImmOP(state);

  return (value === null
    ? newState.del(updatePath)
    : newState.set(updatePath, value)
  );
};
