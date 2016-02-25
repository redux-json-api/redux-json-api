/* global describe, it */
global.__API_HOST__ = 'example.com';
global.__API_ENDPOINT__ = '/api';

import { createAction } from 'redux-actions';
import expect from 'expect';
import { reducer } from '../src/jsonapi';

const apiCreated = createAction('API_CREATED');

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
          self: 'http://localhost/transactions/34'
        }
      }
    ]
  },
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0
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
    taskList: {
      data: {
        type: 'taskLists',
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
    self: 'http://localhost/tasks/43'
  }
};



describe('State mutation', () => {
  it('should automatically organize new entity in new key on state', () => {
    const updatedState = reducer(state, apiCreated(taskWithTransaction));
    expect(updatedState.tasks).toBeAn('object');
  });

  it('should add reverse relationship when inserting new entity', () => {
    const updatedState = reducer(state, apiCreated(taskWithTransaction));
    const { data: taskRelationship } = updatedState.transactions.data[0].relationships.task;

    expect(taskRelationship.type).toEqual(taskWithTransaction.type);
    expect(taskRelationship.id).toEqual(taskWithTransaction.id);
  });
});
