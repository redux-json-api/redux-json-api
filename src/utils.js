import pluralize from 'pluralize';

export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};
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

export const apiRequest = (url, accessToken, options = {}) => {
  const allOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.api+json'
    },
    ...options
  };

  return fetch(url, allOptions)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        if (jsonContentTypes.indexOf(res.headers.get('Content-Type')) > -1) {
          return res.json();
        }

        return res;
      }

      const e = new Error(res.statusText);
      e.response = res;
      throw e;
    });
};
