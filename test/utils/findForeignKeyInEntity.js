/* global describe, it */
import expect from 'expect';
import {
  findForeignKeyInEntity
} from '../../src/utils';

const objWithSingularRelationship = {
  relationships: {
    task: null
  }
};
const objWithPluralRelationship = {
  relationships: {
    tasks: null
  }
};

describe('Reverse relationship key', () => {
  it('should find foreign key on entity from both plural/singular entity type', () => {
    const singularForeignKeyFromSingular = findForeignKeyInEntity(objWithSingularRelationship, 'task');
    const singularForeignKeyFromPlural = findForeignKeyInEntity(objWithSingularRelationship, 'tasks');

    expect(singularForeignKeyFromSingular).toEqual('task');
    expect(singularForeignKeyFromPlural).toEqual('task');

    const pluralForeignKeyFromSingular = findForeignKeyInEntity(objWithPluralRelationship, 'task');
    const pluralForeignKeyFromPlural = findForeignKeyInEntity(objWithPluralRelationship, 'tasks');

    expect(pluralForeignKeyFromSingular).toEqual('tasks');
    expect(pluralForeignKeyFromPlural).toEqual('tasks');
  });

  it('should return undefined for entity with no relationship keys', () => {
    expect(findForeignKeyInEntity({}, 'user')).toBe(void 0);
    expect(findForeignKeyInEntity({}, 'users')).toBe(void 0);
  });

  it('should return undefined when foreign key is not found', () => {
    expect(findForeignKeyInEntity({
      relationships: {
        users: {
          id: 1,
          type: 'users'
        }
      }
    }, 'tasks')).toBe(void 0);
  });
});
