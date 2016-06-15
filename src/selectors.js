/**
 * // Usage Example - my-app/selectors.js:
 * 
 * import { createSelector } from 'reselect';
 * import { createEntityResolver } from 'redux-json-api';
 * 
 * export const entityResolver = createEntityResolver();
 * 
 * export const currentArticleId = state => state.currentArticleId;
 * 
 * // Selector for current article.
 * export const currentArticle = createSelector(
 *    [entityResolver, currentArticleId],
 *    (resolve, id) => resolve({ type: 'article', id });
 * 
 * // Selector for comments of current article.
 * export const currentComments = createSelector(
 *    [entityResolver, currentArticle],
 *    (resolve, article) => article.relationships.comments.data.map(resolve);
 */ 

import { createSelector } from 'reselect';

const defaultRoot = 'api';

export const createSelectorsForType = (type, apiRoot = defaultRoot) => {
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

export const createEntityResolver = (typeSelectors = {}, apiRoot = defaultRoot) => {
  const getSelectorsForType = type => 
      typeSelectors[type] || (typeSelectors[type] = createSelectorsForType(type, apiRoot));
  
  return state => ref => getSelectorsForType(ref.type).index(state)[ref.id];
};
