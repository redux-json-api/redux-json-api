import expect from 'expect';
import { createAction } from 'redux-actions';

import linkedPayload from './payloads/linked_payload.json';
import { reducer } from '../src/jsonapi';

const state = {};
const apiRead = createAction('API_READ');

describe('[State mutation] Insertion of links', () => {
  it('should read and insert links into state', () => {
    const updatedState = reducer(state, apiRead(linkedPayload));

    expect(updatedState.posts.data.length).toEqual(linkedPayload.data.length);
    expect(updatedState.comments.data.length).toEqual(linkedPayload.included.length);
    expect(updatedState.links.length).toEqual(linkedPayload.links.length);
    expect(updatedState.links.self).toEqual('http://api-host/api_path/api_endpoint?page%5Bnumber%5D=1&page%5Bsize%5D=100');
    expect(updatedState.links.next).toEqual('http://api-host/api_path/api_endpoint?page%5Bnumber%5D=2&page%5Bsize%5D=100');
  });
});
