import axios from 'axios';
import Imm from 'immutable';

export const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

export const noop = () => {};

export const apiRequest = (url, options = {}) => {
  const allOptions = Imm.fromJS(options)
    .set('url', url)
    .setIn(['headers', 'Content-Type'], 'application/vnd.api+json')
    .toJS();

  return axios(allOptions)
    .then(res => {
      return res.data;
    });
};
