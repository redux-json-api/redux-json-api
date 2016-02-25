import R from 'ramda';
import {
  insertRelationshipsForEntity,
  removeRelationshipsForEntity
} from './state-mutation-relations';
import { findEntity } from '../utils';

const ensureEntityTypeInState = (state, entityType) => {
  if (state.hasOwnProperty(entityType) === false) {
    state[entityType] = { data: [] };
  }
  return state;
};

const updateOrInsertEntity = (entities, entity) => {
  const existingEntityIdx = R.findIndex(R.propEq('id', entity.id))(entities);

  if (existingEntityIdx === -1) {
    entities.push(entity);
  } else {
    entities[existingEntityIdx] = entity;
  }

  return entities;
};

export const removeEntityFromState = (state, entity) => {
  const newState = JSON.parse(JSON.stringify(state));

  Object.assign(newState, {
    [entity.type]: {
      data: state[entity.type].data.filter(localEntity => {
        return localEntity.id !== entity.id;
      })
    }
  });

  removeRelationshipsForEntity(newState, entity);

  return newState;
};

export const updateOrInsertEntitiesIntoState = (state, data) => {
  // @TODO: This should be done much prettier
  const newState = JSON.parse(JSON.stringify(state));
  const updateEntity = entity => {
    ensureEntityTypeInState(newState, entity.type);
    updateOrInsertEntity(newState[entity.type].data, entity);
    insertRelationshipsForEntity(newState, entity);
  };

  if (Array.isArray(data)) {
    data.forEach(updateEntity);
  } else {
    updateEntity(data);
  }

  return newState;
};

export const setIsInvalidatingForExistingEntity = (state, { type, id }, value) => {
  const mutatedEntity = {
    ... findEntity(state, { type, id }),
    isInvalidating: value
  };

  if (R.isNil(value)) {
    delete mutatedEntity.isInvalidating;
  }

  return updateOrInsertEntitiesIntoState(state, mutatedEntity);
};
