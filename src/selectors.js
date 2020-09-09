import { createCachedSelector } from 're-reselect';
import { hasOwnProperties } from './utils';

export const getResourceTree = (state, resourceType) => (state.api[resourceType] || { data: [] });
export const getResourceData = (state, resourceType) => getResourceTree(state, resourceType)?.data || [];

// Usage getResource(state, {type: 'users, id: '1'}) or getResource(state, 'users', '1')
export const getResource = createCachedSelector(
  (state, identifier) => getResourceData(state, typeof identifier === 'string' ? identifier : identifier.type),
  (_state, identifier, id) => id || identifier.id,
  (resources, id) => resources.find((resource) => resource.id === id) || null
)((_state, identifier, id) => typeof identifier === 'string' ? `${identifier}/${id}` : `${identifier.type}/${identifier.id}`);

const getType = (identifiers) => {
  let type = identifiers;

  if (Array.isArray(identifiers)) {
    [{ type }] = identifiers;
  }

  return type;
};

const getIdList = (identifiers, idList) => idList || identifiers.map((identifier) => identifier.id);

// Usage getResources(state, [{type: 'users', id: '1'}, {type: 'users', id: '2'}]) or getResources(state, 'users', ['1', '2'])
export const getResources = createCachedSelector(
  (state, identifiers) => getResourceData(state, getType(identifiers)),
  (_state, identifiers, idList) => getIdList(identifiers, idList),
  (resources, idList) => resources.filter((resource) => idList.includes(resource.id))
)((_state, identifiers, idList) => {
  const type = getType(identifiers);
  const useIdList = getIdList(identifiers, idList);

  return `${type}/${useIdList.join(':')}`;
});

// Usage getRelatedResources(state, {type: 'users', id: '1'}, 'transactions')
export const getRelatedResources = (state, identifier, relationship) => {
  const resource = getResource(state, identifier);

  if (!hasOwnProperties(resource, ['relationships', relationship, 'data'])) {
    return null;
  }
  const relationshipData = resource.relationships[relationship].data;

  return Array.isArray(relationshipData) ? getResources(state, relationshipData) : getResource(state, relationshipData);
};
