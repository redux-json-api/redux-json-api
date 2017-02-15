import expect from 'expect';
import { createAction } from 'redux-actions';

import usersPayloadInitial from './payloads/users_primary.json';
import usersPayloadFollowup from './payloads/users_secondary.json';

import { reducer } from '../src/jsonapi';

const apiRead = createAction('API_READ');

describe('[State mutation] Testing ClearType', () => {
  it('should append user resources to state on subsequent api reads', () => {
    const state = {};

    const updatedState = reducer(state, apiRead(usersPayloadInitial));
    expect(updatedState.users.data.length).toEqual(usersPayloadInitial.data.length);
    expect(updatedState.users.data[0].attributes.name).toEqual("John Doe");

    const tertiaryState = reducer(updatedState, apiRead(usersPayloadFollowup));
    expect(tertiaryState.users.data.length).toEqual(4);
    expect(tertiaryState.users.data[2].attributes.github).toEqual("chrisjowen");
  });

  it('should replace user resources in state on subsequent api reads when clearType is set', () => {
  });
});
