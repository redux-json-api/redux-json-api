import pluralize from 'pluralize';

export const copyState = state => JSON.parse(JSON.stringify(state));

export const findEntity = (state, { type, id }) => {
  if ((
    state.hasOwnProperty(type) &&
    state[type].hasOwnProperty('data') &&
    Array.isArray(state[type].data)
  ) === false) {
    return void 0;
  }

  return state[type].data.find(entity => entity.type === type && entity.id === id);
};

export const findForeignKeyInEntity = (entity, foreignKeyType) => {
  if (entity.hasOwnProperty('relationships') === false) {
    return void 0;
  }

  const plural = pluralize(foreignKeyType, 2);
  const singular = pluralize(foreignKeyType, 1);

  let foreignKey = void 0;

  [plural, singular].forEach(key => {
    if (entity.relationships.hasOwnProperty(key)) {
      foreignKey = key;
    }
  });

  return foreignKey;
};
