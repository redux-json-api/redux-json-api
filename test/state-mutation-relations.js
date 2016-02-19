/* global describe, it */
import expect from 'expect';
import {
  insertRelationshipsForEntity,
  removeRelationshipsForEntity
} from '../src/state-mutation/state-mutation-relations';

const state = {
  users: {
    data: [
      {
        type: 'users',
        id: 1,
        attributes: {
          name: 'John Doe'
        },
        relationships: {
          tasks: {
            data: null
          }
        }
      }
    ]
  },
  transactions: {
    data: [
      {
        type: 'transactions',
        id: '34',
        attributes: {
          description: 'ABC',
          createdAt: '2016-02-12T13:34:01+0000',
          updatedAt: '2016-02-19T11:52:43+0000',
        },
        relationships: {
          task: {
            data: null
          }
        },
        links: {
          self: 'http://gronk.app/api/v1/transactions/34'
        }
      }
    ]
  }
};

const taskWithUser = {
  type: 'tasks',
  id: 1,
  attributes: {
    title: 'Test'
  },
  relationships: {
    user: {
      data: {
        type: 'users',
        id: 1
      }
    }
  }
};

const taskWithTransaction = {
  type: 'tasks',
  id: '43',
  attributes: {
    name: 'ABC',
    createdAt: '2016-02-19T11:52:43+0000',
    updatedAt: '2016-02-19T11:52:43+0000'
  },
  relationships: {
    task_list: {
      data: {
        type: 'task_lists',
        id: '1'
      }
    },
    transaction: {
      data: {
        type: 'transactions',
        id: '34'
      }
    }
  },
  links: {
    self: 'http://gronk.app/api/v1/tasks/43'
  }
};

describe('Relationship updates', () => {
  it('should register reverse relationship on related entity', () => {
    insertRelationshipsForEntity(state, taskWithUser);
    expect(state.users.data[0].relationships.tasks.data.id).toEqual(taskWithUser.id);
  });

  it('should remove reverse relationship on related entity', () => {
    removeRelationshipsForEntity(state, taskWithUser);
    expect(state.users.data[0].relationships.tasks.data).toEqual(null);
  });

  it('should register reverse relationship for one-to-one relationships', () => {
    insertRelationshipsForEntity(state, taskWithTransaction);
    expect(state.transactions.data[0].relationships.task.data.id).toEqual(taskWithTransaction.id);
  });
});
