import Imm from 'immutable';
import ImmOP from 'object-path-immutable';
import pluralize from 'pluralize';
import { hasOwnProperties } from './utils';

const updateReverseRelationship = (
  entity,
  relationship,
  newRelation = {
    type: entity.get('type'),
    id: entity.get('id')
  }
) => {
  return (foreignEntities) => {
    const idx = foreignEntities.findIndex(
      item => item.get('id') === relationship.getIn(['data', 'id'])
    );

    if (idx === -1) {
      return foreignEntities;
    }

    return foreignEntities.update(
      idx,
      foreignEntity => {
        const [singular, plural] = [1, 2].map(i => pluralize(entity.get('type'), i));
        const relCase = [singular, plural].find(r => foreignEntity.hasIn(['relationships', r]));

        if (!relCase) {
          return foreignEntity;
        }

        return foreignEntity.updateIn(
          ['relationships', relCase, 'data'],
          relation => {
            if (relCase === singular) {
              return newRelation;
            }

            if (!relation) {
              return new Imm.List([newRelation]);
            }

            return relation.push(newRelation);
          }
        );
      }
    );
  };
};

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

const updateOrInsertEntity = (state, entity) => {
  if (Imm.Map.isMap(entity) === false) {
    return state;
  }

  return state.withMutations(s => {
    s.updateIn(
      [entity.get('type'), 'data'],
      (list = new Imm.List()) => {
        const index = list.find(e => e.get('id') === entity.get('id'));
        return list.filter(e => e.get('id') !== entity.get('id')).insert(index, entity);
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
