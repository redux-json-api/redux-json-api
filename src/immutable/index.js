import {
  createResource as baseCreateResource,
  readEndpoint as baseReadEndpoint,
  updateResource as baseUpdateResource,
  deleteResource as baseDeleteResource,
  requireResource as baseRequireResource,
} from '../jsonapi';

export const createResource = resource => baseCreateResource(resource, state => state.get('api'));
export const readEndpoint = (endpoint, options) => baseReadEndpoint(endpoint, options, state => state.get('api'));
export const updateResource = resource => baseUpdateResource(resource, state => state.get('api'));
export const deleteResource = resource => baseDeleteResource(resource, state => state.get('api'));
export const requireResource = (resourceType, endpoint) => baseRequireResource(resourceType, endpoint, state => state.get('api'));
