import Imm from 'immutable';
import pluralize from 'pluralize';

const updateReverseRelationship = (
  entity,
  relationship,
  newRelation = {
    type: entity.get('type'),
    id: entity.get('id')
  }
) => {
  return (foreignEntities) => {
    return foreignEntities.update(
      foreignEntities.findIndex(
        item => item.get('id') === relationship.getIn(['data', 'id'])
      ),
      foreignEntity => {
        const relCase = [1, 2]
          .map(i => pluralize(entity.get('type'), i))
          .find(r => foreignEntity.hasIn(['relationships', r]));
        const relCount = foreignEntity.getIn(['relationships', relCase, 'data']);
        const isset = relCount &&
          relCount.getIn &&
          relCount.getIn([0]) &&
          relCount.getIn([0]).count();

        if (!relCase || isset) {
          return foreignEntity;
        }

        return foreignEntity.setIn(
          ['relationships', relCase, 'data'],
          newRelation
        );
      }
    );
  };
};

const updateOrInsertEntity = (state, entity) => {
  if (Imm.Map.isMap(entity) === false) {
    return state;
  }

  return state.withMutations(s => {
    s.updateIn(
      [entity.get('type'), 'data'],
      (list = new Imm.List()) => {
        return list.filter(
          e => e.get('id') !== entity.get('id')
        ).push(entity);
      }
    );

    const rels = entity.get('relationships');

    if (!rels) {
      return;
    }

    rels.forEach(relationship => {
      const entityPath = [
        relationship.getIn(['data', 'type']),
        'data'
      ];

      if (s.hasIn(entityPath) === false) {
        return;
      }

      s.updateIn(
        entityPath,
        updateReverseRelationship(entity, relationship)
      );
    });
  });
};

export const removeEntityFromState = (state, entity) => {
  return state.withMutations(newState => {
    newState.updateIn(
      [entity.get('type'), 'data'],
      curVal => curVal.filter(l => l.get('id') !== entity.get('id'))
    );

    entity.get('relationships').forEach(relationship => {
      const entityPath = [
        relationship.getIn(['data', 'type']),
        'data'
      ];

      if (newState.hasIn(entityPath) === false) {
        return;
      }

      newState.updateIn(
        entityPath,
        updateReverseRelationship(entity, relationship, null)
      );
    });
  });
};

export const updateOrInsertEntitiesIntoState = (state, entities) => {
  return entities.reduce(
    updateOrInsertEntity,
    state
  );
};

export const setIsInvalidatingForExistingEntity = (state, { type, id }, value) => {
  return state.updateIn(
    [type, 'data'],
    entities => {
      return entities.update(
        entities.findIndex(
          item => item.get('id') === id && item.get('type') === type
        ),
        entity => (
          value === null
          ? entity.delete('isInvalidating')
          : entity.set('isInvalidating', value)
        )
      );
    }
  );
};
