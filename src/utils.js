export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};

export const apiRequest = (url, options = {}) => {
  return fetch(url, options)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        if (res.status === 204) {
          return res;
        } else if (jsonContentTypes.some(contentType => res.headers.get('Content-Type').indexOf(contentType) > -1)) {
          return res.json();
        }
      }

      const e = new Error(res.statusText);
      e.response = res;
      throw e;
    });
};

export const hasOwnProperties = (obj, propertyTree) => {
  if ((obj instanceof Object) === false) {
    return false;
  }
  const property = propertyTree[0];
  const hasProperty = obj.hasOwnProperty(property);
  if (hasProperty) {
    if (propertyTree.length === 1) {
      return hasProperty;
    }
    return hasOwnProperties(obj[property], propertyTree.slice(1));
  }
  return false;
};

export const getPaginationUrl = (response, direction, host, path) => {
  if (!response.links || !hasOwnProperties(response, ['links', direction])) {
    return null;
  }

  return response.links[direction]
    .replace(host, '')
    .replace(`${path}/`, '');
};
