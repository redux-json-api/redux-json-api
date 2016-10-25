import expect from 'expect';

import {
  makeUpdateReverseRelationship,
  setIsInvalidatingForExistingResource,
  updateOrInsertResource
} from '../src/state-mutation';

import { IS_UPDATING } from '../src/jsonapi';

const resource = {
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
const state = {
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
        id: '35',
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
      }, {
        type: 'transactions',
        id: '36',
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

describe(`[State Mutation] Update or Reverse relationships`, () => {
  it('Should update a resource relationship', () => {
    const updatedEnteties = makeUpdateReverseRelationship(
      resource,
      resource.relationships.transaction
    )(state.transactions.data);

    expect(updatedEnteties[0].relationships.task.data)
      .toEqual({ id: resource.id, type: resource.type });
  });

  it('Should nullify a resource relationship', () => {
    const updatedEnteties = makeUpdateReverseRelationship(
      resource,
      resource.relationships.transaction,
      null
    )(state.transactions.data);

    expect(updatedEnteties[0].relationships.task.data).toEqual(null);
  });
});


describe('[State Mutation]: Set is invalidating for existing resource', () => {
  it('Should set a ivalidating type for resource to IS_UPDATING', () => {
    const { id, type } = state.users.data[0];
    const updatedState = setIsInvalidatingForExistingResource(
      state,
      { type, id },
      IS_UPDATING
    ).value();
    expect(updatedState.users.data[0].isInvalidating).toEqual(IS_UPDATING);
  });
});

describe('[State Mutation]: Create new reference when Object is mutated', () => {
  it('Should keep proper refrences when setting isInvalidating', () => {
    const { id, type } = state.users.data[0];
    const updatedState = setIsInvalidatingForExistingResource(
      state,
      { type, id },
      IS_UPDATING
    ).value();

    expect(updatedState.users.data[0]).toNotBe(state.users.data[0]);
    expect(updatedState.users.data[1]).toBe(state.users.data[1]);
  });

  it('Should keep proper refrences when updating reverse relationships', () => {
    const updatedResources = makeUpdateReverseRelationship(
      resource,
      resource.relationships.transaction
    )(state.transactions.data);

    expect(updatedResources[0]).toNotBe(state.transactions.data[0]);
    expect(updatedResources[1]).toBe(state.transactions.data[1]);
  });

  it('Should only replace updated resource', () => {
    const updatedState = updateOrInsertResource(state, {
      type: 'users',
      id: '1',
      attributes: {
        name: 'Mr. John Doe'
      },
      relationships: {
        companies: {
          data: null
        }
      }
    });

    expect(updatedState.users.data[0]).toNotBe(state.users.data[0]);
    expect(updatedState.users.data[1]).toBe(state.users.data[1]);
  });

  it('Should keep object reference on update or insert when resource hasn\'t changed', () => {
    const updatedState = updateOrInsertResource(state, {
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
    });

    expect(updatedState.users.data[0]).toBe(state.users.data[0]);
  });
});
