import R from 'ramda';

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
  if (state.hasOwnProperty(relationship.type) === false) {
    // Abandon if we have not loaded any entities of this type
    return void 0;
  }

  const relatedEntity = R.find(R.propEq('id', relationship.id))(state[relationship.type].data);

  if ((
    !R.isNil(relatedEntity) &&
    relatedEntity.hasOwnProperty('relationships') &&
    relatedEntity.relationships.hasOwnProperty(entity.type)
  ) === false) {
    // Abandon if we don't keep relationships or `entity.type`
    // in relationships, because we wont know which type of
    // relationship it is. We probably don't use it in the
    // application in this cause either.
    return void 0;
  }

  return relatedEntity.relationships[entity.type];
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
