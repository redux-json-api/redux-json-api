import expect from 'expect';
import { createAction } from 'redux-actions';

import postsPayload from './payloads/linked_payload.json';

import { reducer } from '../src/jsonapi';

const apiRead = createAction('API_READ');

describe('[State mutation] Insertion of links', () => {
  it('should not insert links into state when indexLinks is blank', () => {
    const state = {};

    apiRead(postsPayload);

    const updatedState = reducer(state, apiRead(postsPayload));

    expect(updatedState.posts.data.length).toEqual(postsPayload.data.length);
    expect(updatedState.links).toEqual(undefined);
  });

  it('should read and insert links into state when indexLinks string is present', () => {
    const state = {};

    const indexPayload = postsPayload;
    indexPayload.indexLinks = 'posts';

    apiRead(indexPayload);

    const updatedState = reducer(state, apiRead(postsPayload));

    expect(updatedState.posts.data.length).toEqual(postsPayload.data.length);
    expect(updatedState.links.posts.length).toEqual(postsPayload.links.length);
    expect(updatedState.links.posts.self).toEqual('http://api-host/api_path/posts?page%5Bnumber%5D=1&page%5Bsize%5D=2');
    expect(updatedState.links.posts.next).toEqual('http://api-host/api_path/posts?page%5Bnumber%5D=2&page%5Bsize%5D=2');
  });
});
