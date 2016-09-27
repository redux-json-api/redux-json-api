import axios from 'axios';
import createError from 'axios/lib/core/createError';
import Imm from 'immutable';

export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

const hasValidContentType = response => jsonContentTypes.some(
  contentType => response.headers['content-type'].indexOf(contentType) > -1
);

export const noop = () => {};

export const apiRequest = (url, options = {}) => {
  const allOptions = Imm.fromJS(options)
    .set('url', url)
    .setIn(['headers', 'Accept'], 'application/vnd.api+json')
    .setIn(['headers', 'Content-Type'], 'application/vnd.api+json')
    .toJS();

  return axios(allOptions)
    .then(res => {
      if (res.status === 204) {
        return res;
      }

      if (hasValidContentType(res) === false) {
        throw createError(
          'Invalid Content-Type in response',
          res.config,
          null,
          res
        );
      }

      return res.data;
    });
};
