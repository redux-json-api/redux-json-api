import expect from 'expect';

import {
  _updateReverseRelationship
} from '../src/state-mutation';

const initState = {
  transactions: {
    data: [{
      type: 'transactions',
      id: '35',
      attributes: {
        description: 'DEF',
        createdAt: '2016-02-12T13:35:01+0000',
        updatedAt: '2016-02-19T11:52:43+0000',
      },
      relationships: {
        task: {
          data: null
        }
      },
      links: {
        self: 'http://localhost/transactions/35'
      }
    }]
  }
};

const entity = {
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
        id: '35'
      }
    }
  },
  links: {
    self: 'http://localhost/tasks/43'
  }
};

const expectedState = [{
  type: 'transactions',
  id: '35',
  attributes: {
    description: 'DEF',
    createdAt: '2016-02-12T13:35:01+0000',
    updatedAt: '2016-02-19T11:52:43+0000',
  },
  relationships: {
    task: {
      data: {
        id: '43',
        type: 'tasks'
      }
    }
  },
  links: {
    self: 'http://localhost/transactions/35'
  }
}];

describe(`[State Mutation] Update or Reverse relationships`, () => {
  it('Should update a entity relationship', () => {
    const updatedEnteties = _updateReverseRelationship(
      entity,
      entity.relationships.transaction
    )(initState.transactions.data);

    expect(updatedEnteties[0].relationships.task.data)
      .toEqual({ id: entity.id, type: entity.type });
  });

  it('Should nullify a entity relationship', () => {
    const updatedEnteties = _updateReverseRelationship(
      entity,
      entity.relationships.transaction,
      null
    )(initState.transactions.data);

    expect(updatedEnteties[0].relationships.task.data).toEqual(null);
  });
});
