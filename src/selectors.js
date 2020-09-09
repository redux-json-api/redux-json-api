import { createCachedSelector } from 're-reselect';

export const getResourceTree = (state, resourceType) => (state.api[resourceType] || { data: [] });
export const getResourceData = (state, resourceType) => getResourceTree(state, resourceType)?.data || [];

export const getResource = createCachedSelector(
  (state, identifier) => getResourceData(state, identifier.type),
  (_state, identifier) => identifier.id,
  (resources, id) => resources.find((resource) => resource.id === id) || null
)((_state, identifier) => `${identifier.type}/${identifier.id}`);
