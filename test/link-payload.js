import expect from 'expect';
import { createAction } from 'redux-actions';

import linked_payload from './payloads/linked_payload.json';
import { reducer } from '../src/jsonapi';

const state = {};
const apiRead = createAction('API_READ');

describe('[State mutation] Insertion of links', () => {
  it('should read and insert links into state', () => {
    const updatedState = reducer(state, apiRead(linked_payload));

    expect(updatedState.posts.data.length).toEqual(linked_payload.data.length);
    expect(updatedState.comments.data.length).toEqual(linked_payload.included.length);
    expect(updatedState.links.length).toEqual(linked_payload.links.length);
    expect(updatedState.links.self).toEqual("http://api-host/api_path/api_endpoint?page%5Bnumber%5D=1&page%5Bsize%5D=100");
    expect(updatedState.links.next).toEqual("http://api-host/api_path/api_endpoint?page%5Bnumber%5D=2&page%5Bsize%5D=100");
  });
});