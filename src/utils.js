export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};

export const apiRequest = (url, accessToken, options = {}) => {
  const allOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    },
    ...options
  };

  return fetch(url, allOptions)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        if (jsonContentTypes.some(contentType => res.headers.get('Content-Type').indexOf(contentType) > -1)) {
          return res.json();
        }

        return res;
      }

      const e = new Error(res.statusText);
      e.response = res;
      throw e;
    });
};

export const getPaginationUrl = (json, direction, host, path) => {
  if (!json.links) {
    return null;
  }

  if (direction === 'next') {
    if (!json.links.next) {
      return null;
    }

    return json.links.next
      .replace(host, '')
      .replace(`${path}/`, '');
  }

  if (direction === 'prev') {
    if (!json.links.prev) {
      return null;
    }

    return json.links.prev
      .replace(host, '')
      .replace(`${path}/`, '');
  }
};
