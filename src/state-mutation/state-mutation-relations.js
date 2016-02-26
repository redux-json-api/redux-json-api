import R from 'ramda';
import {
  findEntity,
  findForeignKeyInEntity
} from '../utils';

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

    if (Array.isArray(data)) {
      data.forEach(callback);
    } else {
      callback(data);
    }
  }
};

const findRelatedEntity = (state, entity, relationship) => {
  const relatedEntity = findEntity(state, relationship);

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

    if (Array.isArray(currentRelationships.data)) {
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
    } else {
      currentRelationships.data = newRelation;
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

    if (Array.isArray(currentRelationships.data)) {
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
    } else {
      currentRelationships.data = null;
    }
  };

  iterateRelationships(entity, removeRelationship);
};
