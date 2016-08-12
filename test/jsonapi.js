/* global describe, it */
global.__API_HOST__ = 'example.com';
global.__API_ENDPOINT__ = '/api';

import { createAction } from 'redux-actions';
import expect from 'expect';
import {
  reducer,
  setAccessToken,
  setEndpointHost,
  setEndpointPath,
  IS_DELETING,
  IS_UPDATING
} from '../src/jsonapi';

const apiCreated = createAction('API_CREATED');
const apiRead = createAction('API_READ');
const apiUpdated = createAction('API_UPDATED');
const apiDeleted = createAction('API_DELETED');

const apiWillUpdate = createAction('API_WILL_UPDATE');
const apiWillDelete = createAction('API_WILL_DELETE');

const state = {
  endpoint: {
    host: null,
    path: null,
    accessToken: null
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

const taskWithoutRelationship = {
  type: 'tasks',
  id: '43',
  attributes: {
    name: 'ABC',
    createdAt: '2016-02-19T11:52:43+0000',
    updatedAt: '2016-02-19T11:52:43+0000'
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

const transactionToDelete = {
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
};

const updatedUser = {
  type: 'users',
  id: '1',
  attributes: {
    name: 'Sir John Doe'
  },
  relationships: {
    tasks: {
      data: null
    }
  }
};

const multipleEntities = [
  {
    ... taskWithTransaction
  }
];

const readResponse = {
  data: [
    taskWithTransaction
  ]
};

const readResponseWithIncluded = {
  ... readResponse,
  included: [
    {
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
    }
  ]
};

const responseDataWithSingleEntity = {
  data: {
    type: 'companies',
    id: '1',
    attributes: {
      name: 'Dixie.io',
      slug: 'dixie.io',
      createdAt: '2016-04-08T08:42:45+0000',
      updatedAt: '2016-04-08T08:42:45+0000',
      role: 'bookkeeper'
    },
    relationships: {
      users: {
        data: [{
          type: 'users',
          id: '1'
        }]
      },
      employees: {
        data: [{
          type: 'users',
          id: '1'
        }]
      },
      bookkeepers: {
        data: [{
          type: 'users',
          id: '4'
        }]
      },
      bookkeeper_state: {
        data: {
          type: 'bookkeeper_state',
          id: '2'
        }
      }
    },
    links: {
      self: 'http:\/\/gronk.app\/api\/v1\/companies\/1'
    }
  },
  included: [{
    type: 'users',
    id: '1',
    attributes: {
      name: 'Ron Star',
      email: 'stefan+stefan+ronni-dixie.io-dixie.io@dixie.io',
      createdAt: '2016-04-08T08:42:45+0000',
      updatedAt: '2016-04-13T08:28:58+0000'
    },
    relationships: {
      companies: {
        data: [{
          type: 'companies',
          id: '1'
        }]
      }
    }
  }]
};

const responseDataWithOneToManyRelationship = {
  data: [
    {
      type: 'companies',
      id: '1',
      attributes: {
        name: 'Dixie.io',
        slug: 'dixie.io',
        createdAt: '2016-04-08T08:42:45+0000',
        updatedAt: '2016-04-08T08:42:45+0000'
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: '1'
          }
        }
      },
      links: {
        self: 'http:\/\/gronk.app\/api\/v1\/companies\/1'
      }
    },
    {
      type: 'companies',
      id: '2',
      attributes: {
        name: 'Dixie.io',
        slug: 'dixie.io',
        createdAt: '2016-04-08T08:42:45+0000',
        updatedAt: '2016-04-08T08:42:45+0000'
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: '1'
          }
        }
      },
      links: {
        self: 'http:\/\/gronk.app\/api\/v1\/companies\/2'
      }
    }
  ]
};

const payloadWithNonMatchingReverseRelationships = require('./payloads/withNonMatchingReverseRelationships.json');

describe('Creation of new entities', () => {
  it('should automatically organize new entity in new key on state', () => {
    const updatedState = reducer(state, apiCreated(taskWithoutRelationship));
    expect(updatedState.tasks).toBeAn('object');
  });

  it('should add reverse relationship when inserting new entity', () => {
    const updatedState = reducer(state, apiCreated(taskWithTransaction));

    const { data: taskRelationship } = updatedState.transactions.data[0].relationships.task;

    expect(taskRelationship.type).toEqual(taskWithTransaction.type);
    expect(taskRelationship.id).toEqual(taskWithTransaction.id);
    expect(updatedState.isCreating).toEqual(state.isCreating - 1);
  });

  it('should handle multiple entities', () => {
    const updatedState = reducer(state, apiCreated(multipleEntities));
    expect(updatedState.tasks).toBeAn('object');
  });
});

describe('Reading entities', () => {
  it('should append read entities to state', () => {
    const updatedState = reducer(state, apiRead(readResponse));
    expect(updatedState.tasks).toBeAn('object');
    expect(updatedState.tasks.data.length).toEqual(1);
  });

  it('should append included entities in state', () => {
    const updatedState = reducer(state, apiRead(readResponseWithIncluded));
    expect(
      updatedState.transactions.data.length
    ).toEqual(
      state.transactions.data.length + 1
    );
  });

  it('should handle response where data is an object', () => {
    const updatedState = reducer(undefined, apiRead(responseDataWithSingleEntity));
    expect(updatedState.users).toBeAn('object');
    expect(updatedState.companies).toBeAn('object');
  });

  it('should handle response with a one to many relationship', () => {
    const updatedState = reducer(state, apiRead(responseDataWithOneToManyRelationship));
    expect(updatedState.users).toBeAn('object');
    expect(updatedState.companies).toBeAn('object');
    expect(updatedState.users.data[0].relationships.companies.data).toBeAn('array');
  });

  it('should ignore reverse relationship with no matching entity', () => {
    const updatedState = reducer(state, apiRead(payloadWithNonMatchingReverseRelationships));

    payloadWithNonMatchingReverseRelationships.included
      .filter(entity => entity.type === 'reports')
      .forEach(
        payloadReport => {
          const stateReport = updatedState.reports.data.find(r => payloadReport.id === r.id);
          expect(stateReport.relationships.file.data.id).toEqual(payloadReport.relationships.file.data.id);
        }
      );
  });
});

describe('Updating entities', () => {
  it('should persist in state', () => {
    const updatedState = reducer(state, apiUpdated(updatedUser));
    expect(state.users.data[0].attributes.name).toNotEqual(updatedUser.attributes.name);
    expect(updatedState.users.data[0].attributes.name).toEqual(updatedUser.attributes.name);
  });
});

describe('Delete entities', () => {
  it('should remove entity from state', () => {
    const updatedState = reducer(state, apiDeleted(transactionToDelete));
    expect(updatedState.transactions.data.length).toEqual(0);
  });

  it('should remove reverse relationship', () => {
    const stateWithTask = reducer(state, apiCreated(taskWithTransaction));

    expect(stateWithTask.transactions.data[0].relationships.task.data.type).toEqual(taskWithTransaction.type);

    const stateWithoutTask = reducer(stateWithTask, apiDeleted(taskWithTransaction));

    const { data: relationship } = stateWithoutTask.transactions.data[0].relationships.task;

    expect(relationship).toEqual(null);
  });
});

describe('Endpoint values', () => {
  it('should update to provided access token', () => {
    const at = 'abcdef0123456789';
    expect(state.endpoint.accessToken).toNotEqual(at);
    const updatedState = reducer(state, setAccessToken(at));
    expect(updatedState.endpoint.accessToken).toEqual(at);
  });

  it('should update to provided endpoint host and path', () => {
    const host = 'https://api.example.com';
    const path = '/api/v1';

    expect(state.endpoint.host).toNotEqual(host);
    const stateWithHost = reducer(state, setEndpointHost(host));
    expect(stateWithHost.endpoint.host).toEqual(host);

    expect(state.endpoint.path).toNotEqual(path);
    const stateWithPath = reducer(state, setEndpointPath(path));
    expect(stateWithPath.endpoint.path).toEqual(path);
  });
});

describe('Invalidating flag', () => {
  it('should set before delete', () => {
    const updatedState = reducer(state, apiWillDelete(state.users.data[0]));
    expect(updatedState.users.data[0].isInvalidating).toEqual(IS_DELETING);
  });

  it('should set before update', () => {
    const updatedState = reducer(state, apiWillUpdate(state.users.data[0]));
    expect(updatedState.users.data[0].isInvalidating).toEqual(IS_UPDATING);
  });

  it('should be removed after update', () => {
    const updatedState = reducer(
      reducer(state, apiWillUpdate(state.users.data[0])),
      apiUpdated(state.users.data[0])
    );
    expect(updatedState.users.data[0].isInvalidating).toNotExist();
  });
});
