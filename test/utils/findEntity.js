/* global describe, it */
import expect from 'expect';
import {
  findEntity
} from '../../src/utils';

const state = {
  users: {
    data: [{ type: 'users', id: 1, attributes: { name: 'John' } }]
  }
};

describe('Entity querying', () => {
  it('returns undefined when there are no entities of given type', () => {
    const result = findEntity(state, { type: 'tasks', id: 1 });
    expect(result).toBe(void 0);
  });

  it('returns undefined when entity of specified id was not found', () => {
    const result = findEntity(state, { type: 'users', id: 2 });
    expect(result).toBe(void 0);
  });

  it('returns entity of given type and id', () => {
    const result = findEntity(state, { type: 'users', id: 1 });
    expect(result.id).toEqual(1);
    expect(result.attributes.name).toEqual('John');
  });
});
