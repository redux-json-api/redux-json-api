import axios from 'axios';

export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};

export const apiRequest = (url, accessToken, options = {}) => {
  const allOptions = {
    url,
    headers: {
      ...options.headers,
      'Content-Type': 'application/vnd.api+json'
    },
    ...options
  };

  return axios(allOptions)
    .then(res => {
      if (jsonContentTypes.indexOf(res.headers.get('Content-Type')) > -1) {
        return res.data;
      }

      return res;
    })
    // For legacy catches
    .catch(res => {
      res.response = res;
      throw e;
    });
};
