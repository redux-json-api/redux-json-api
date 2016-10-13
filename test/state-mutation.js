import expect from 'expect';

import {
  _updateReverseRelationship,
  setIsInvalidatingForExistingEntity
} from '../src/state-mutation';

import { IS_UPDATING } from '../src/jsonapi';

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

const isInvalidatingState = {
  endpoint: {
    host: null,
    path: null,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    }
  },
  users: {
    data: [
      {
        type: 'users',
        id: '1',
        attributes: {
          name: 'John Doe'
        },
        relationships: {
          companies: {
            data: null
          }
        }
      },
      {
        type: 'users',
        id: '2',
        attributes: {
          name: 'Emily Jane'
        },
        relationships: {
          companies: {
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

describe('[State Mutation]: Set is invalidating for existing entity', () => {
  it('Should set a ivalidating type for entity to IS_UPDATING', () => {
    const { id, type } = isInvalidatingState.users.data[0];
    const updatedState = setIsInvalidatingForExistingEntity(
      isInvalidatingState,
      { type, id }
      , IS_UPDATING).value();
    expect(updatedState.users.data[0].isInvalidating).toEqual(IS_UPDATING);
  });
});
