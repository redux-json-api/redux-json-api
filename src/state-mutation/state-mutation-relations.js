import R from 'ramda';
import pluralize from 'pluralize';

const findEntity = (state, entityType, entityId) => {
  if ((
    state.hasOwnProperty(entityType) &&
    state[entityType].hasOwnProperty('data') &&
    Array.isArray(state[entityType].data)
  ) === false) {
    return void 0;
  }

  return state[entityType].data.find(entity => entity.id === entityId);
};

const findForeignKeyInEntity = (entity, foreignKeyType) => {
  if (entity.hasOwnProperty('relationships') === false) {
    return void 0;
  }

  const plural = pluralize(foreignKeyType);
  const singular = pluralize(foreignKeyType, 1);

  let foreignKey = void 0;

  [plural, singular].forEach(key => {
    if (entity.relationships.hasOwnProperty(key)) {
      foreignKey = key;
    }
  });

  return foreignKey;
};

const iterateRelationships = (entity, callback) => {
  if (entity.hasOwnProperty('relationships') === false) {
    return;
  }

  let rel;

  for (rel in entity.relationships) {
    if (entity.relationships.hasOwnProperty(rel) === false) {
      continue;
    }

    const data = entity.relationships[rel].data;
    if (R.isNil(data)) {
      continue;
    }

    if (data instanceof Array === false) {
      callback(data);
    } else {
      data.forEach(callback);
    }
  }
};

const findRelatedEntity = (state, entity, relationship) => {
  const relatedEntity = findEntity(state, relationship.type, relationship.id);

  if (relatedEntity === void 0) {
    return void 0;
  }

  const foreignKey = findForeignKeyInEntity(relatedEntity, entity.type);

  if (foreignKey === void 0) {
    return void 0;
  }

  return relatedEntity.relationships[foreignKey];
};

export const insertRelationshipsForEntity = (state, entity) => {
  const insertRelationship = (relationship) => {
    const currentRelationships = findRelatedEntity(state, entity, relationship);
    if (R.isNil(currentRelationships)) {
      return;
    }

    const newRelation = { type: entity.type, id: entity.id };

    if (currentRelationships.data instanceof Array === false) {
      currentRelationships.data = newRelation;
    } else {
      const existingRelation = R.findIndex(o => {
        return (
          o.id === newRelation.id &&
          o.type === newRelation.type
        );
      })(currentRelationships.data);

      if (existingRelation > -1) {
        return;
      }

      currentRelationships.data.push(newRelation);
    }
  };

  iterateRelationships(entity, insertRelationship);
};

export const removeRelationshipsForEntity = (state, entity) => {
  const removeRelationship = (relationship) => {
    const currentRelationships = findRelatedEntity(state, entity, relationship);
    if (R.isNil(currentRelationships)) {
      return;
    }

    if (currentRelationships.data instanceof Array === false) {
      currentRelationships.data = null;
    } else {
      const existingRelation = R.findIndex(o => {
        return (
          o.id === entity.id &&
          o.type === entity.type
        );
      })(currentRelationships.data);

      if (existingRelation === -1) {
        return;
      }

      currentRelationships.data.splice(existingRelation, 1);
    }
  };

  iterateRelationships(entity, removeRelationship);
};
