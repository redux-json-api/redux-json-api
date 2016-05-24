import axios from 'axios';

export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};

export const apiRequest = (url, accessToken, options = {}) => {
  const allOptions = {
    ...options,
    url,
    headers: {
      ...options.headers,
      'Content-Type': 'application/vnd.api+json'
    }
  };

  return axios(allOptions)
    .then(res => {
      return res.data;
    })
    // For legacy catches
    .catch(res => {
      res.response = res;
      throw res;
    });
};

