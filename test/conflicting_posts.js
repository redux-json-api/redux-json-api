import expect from 'expect';
import { createAction } from 'redux-actions';
import { reducer } from '../src/jsonapi';
import posts from './payloads/posts.json';
import extendedPost from './payloads/extendedPost.json';

const state = {};
const apiRead = createAction('API_READ');

describe('[State mutation] Duplicating primary data', () => {
  it('should read and insert data from 2 endpoints into state', () => {
    const stateAfterFirstApiRead = reducer(state, apiRead(posts));
    console.log(stateAfterFirstApiRead.posts);

    const stateAfterSecondApiRead = reducer(state, apiRead(extendedPost));
    console.log(stateAfterSecondApiRead.posts);

    expect(stateAfterSecondApiRead.posts.data.length).toEqual(posts.data.length);
  });
});
