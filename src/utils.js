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
