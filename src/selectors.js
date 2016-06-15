import { createSelector } from 'reselect';

export const createSelectorsForType = (type, apiRoot = 'api') => {
  const typeState = state => state[apiRoot][type]);
  
  const data = createSelector(typeState, state => state.data);
  
  const index = createSelector(
      data, 
      _data => _data.reduce((_index, entity) => {
        _index[entity.id] = entity;
        return _index;
      }, {}));
      
  return { type, typeState, data, index };  
};

export const createResolver = (typeSelectors = {}) => state => refs => {
  const getSelectorsForType = 
      type => typeSelectors[type] || (typeSelectors[type] = createSelectorsForType(type));
  
  const resolveSingle = ref => getSelectorsForType(ref.type).index(state)[ref.id];
  
  return Array.isArray(refs) ? refs.map(resolveSingle) : resolveSingle(refs);
};
