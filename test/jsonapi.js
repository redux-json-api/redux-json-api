/* global describe, it */
global.__API_HOST__ = 'example.com';
global.__API_ENDPOINT__ = '/api';

import { createAction } from 'redux-actions';
import expect from 'expect';
import {
  reducer,
  setAxiosConfig,
  hydrateStore,
  IS_DELETING,
  IS_UPDATING
} from '../src/jsonapi';

const apiCreated = createAction('API_CREATED');
const apiRead = createAction('API_READ');
const apiUpdated = createAction('API_UPDATED');
const apiDeleted = createAction('API_DELETED');

const apiWillUpdate = createAction('API_WILL_UPDATE');
const apiWillDelete = createAction('API_WILL_DELETE');

const apiUpdateFailed = createAction('API_UPDATE_FAILED');
const apiDeleteFailed = createAction('API_DELETE_FAILED');

const state = {
  endpoint: {
    axiosConfig: {}
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

const stateWithoutUsersResource = {
  endpoint: {
    host: null,
    path: null,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    }
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
  data: {
    type: 'tasks',
    id: '43',
    attributes: {
      name: 'ABC',
      createdAt: '2016-02-19T11:52:43+0000',
      updatedAt: '2016-02-19T11:52:43+0000'
    }
  }
};

const taskWithTransaction = {
  data: {
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
  }
};

const taskWithTransactions = {
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
      data: [
        {
          type: 'transactions',
          id: '34'
        }
      ]
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
      links: {
        self: 'http://localhost/transactions/34/relationships/task',
      },
    }
  },
  links: {
    self: 'http://localhost/transactions/34'
  }
};

const transactionWithTask = {
  ... transactionToDelete,
  relationships: {
    task: {
      data: {
        type: 'tasks',
        id: '43'
      }
    }
  }
};

const updatedUser = {
  data: {
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
  }
};

const multipleResources = {
  data: [
    taskWithTransaction.data,
  ],
  relationships: [
    taskWithTransaction.relationships
  ]
};

const readResponse = {
  data: [
    taskWithTransaction.data
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

const responseDataWithSingleResource = {
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

describe('Hydration of store', () => {
  it('should automatically organize new resource in new key on state', () => {
    const updatedState = reducer(state, hydrateStore(taskWithoutRelationship));
    expect(updatedState.tasks).toBeAn('object');
  });

  it('should add reverse relationship when inserting new resource', () => {
    const updatedState = reducer(state, hydrateStore(taskWithTransaction));

    const { data: taskRelationship } = updatedState.transactions.data[0].relationships.task;

    expect(taskRelationship.type).toEqual(taskWithTransaction.data.type);
    expect(taskRelationship.id).toEqual(taskWithTransaction.data.id);
  });

  it('should handle multiple resources', () => {
    const updatedState = reducer(state, hydrateStore(multipleResources));
    expect(updatedState.tasks).toBeAn('object');
  });
});

describe('Creation of new resources', () => {
  it('should automatically organize new resource in new key on state', () => {
    const updatedState = reducer(state, apiCreated(taskWithoutRelationship));
    expect(updatedState.tasks).toBeAn('object');
  });

  it('should add reverse relationship when inserting new resource', () => {
    const updatedState = reducer(state, apiCreated(taskWithTransaction));

    const { data: taskRelationship } = updatedState.transactions.data[0].relationships.task;

    expect(taskRelationship.type).toEqual(taskWithTransaction.data.type);
    expect(taskRelationship.id).toEqual(taskWithTransaction.data.id);
    expect(updatedState.isCreating).toEqual(state.isCreating - 1);
  });

  it('should handle multiple resources', () => {
    const updatedState = reducer(state, apiCreated(multipleResources));
    expect(updatedState.tasks).toBeAn('object');
  });
});

describe('Reading resources', () => {
  it('should append read resources to state', () => {
    const updatedState = reducer(state, apiRead(readResponse));
    expect(updatedState.tasks).toBeAn('object');
    expect(updatedState.tasks.data.length).toEqual(1);
  });

  it('should append included resources in state', () => {
    const updatedState = reducer(state, apiRead(readResponseWithIncluded));
    expect(
      updatedState.transactions.data.length
    ).toEqual(
      state.transactions.data.length + 1
    );
  });

  it('should handle response where data is an object', () => {
    const updatedState = reducer(undefined, apiRead(responseDataWithSingleResource));
    expect(updatedState.users).toBeAn('object');
    expect(updatedState.companies).toBeAn('object');
  });

  it('should handle response with a one to many relationship', () => {
    const updatedState = reducer(state, apiRead(responseDataWithOneToManyRelationship));
    expect(updatedState.users).toBeAn('object');
    expect(updatedState.companies).toBeAn('object');
    expect(updatedState.users.data[0].relationships.companies.data).toBeAn('array');
  });

  it('should ignore reverse relationship with no matching resource', () => {
    const updatedState = reducer(state, apiRead(payloadWithNonMatchingReverseRelationships));

    payloadWithNonMatchingReverseRelationships.included
      .filter(resource => resource.type === 'reports')
      .forEach(
        payloadReport => {
          const stateReport = updatedState.reports.data.find(r => payloadReport.id === r.id);
          expect(stateReport.relationships.file.data.id).toEqual(payloadReport.relationships.file.data.id);
        }
      );
  });
});

const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));

describe('Updating resources', () => {
  it('should update a resource', () => {
    const updatedState = reducer(state, apiUpdated({
      data: [{
        type: 'users',
        id: '2',
        attributes: {
          name: 'Jane Doe'
        },
        relationships: {
          companies: {
            data: null
          }
        }
      }]
    }));
    expect(updatedState.users.data[1].attributes.name).toEqual('Jane Doe');
  });

  it('should persist in state and preserve order', () => {
    const updatedState = reducer(state, apiUpdated(updatedUser));
    expect(state.users.data[0].attributes.name).toNotEqual(updatedUser.data.attributes.name);
    expect(updatedState.users.data[0].attributes.name).toEqual(updatedUser.data.attributes.name);
    zip([updatedState.users.data, state.users.data]).forEach((a, b) => expect(a.id).toEqual(b.id));
  });

  it('should be able to update a resource before type is in state', () => {
    const userToUpdate = state.users.data[0];
    const stateWithResourceType = reducer(stateWithoutUsersResource, apiWillUpdate(userToUpdate));
    const updatedState = reducer(stateWithResourceType, apiUpdated(updatedUser));
    expect(updatedState.users.data[0]).toEqual(updatedUser.data);
  });
});

describe('Delete resources', () => {
  it('should remove resource from state', () => {
    const updatedState = reducer(state, apiDeleted(transactionToDelete));
    expect(updatedState.transactions.data.length).toEqual(0);
  });

  it('should remove reverse relationship', () => {
    const stateWithTask = reducer(state, apiCreated(taskWithTransaction));
    expect(stateWithTask.transactions.data[0].relationships.task.data.type).toEqual(taskWithTransaction.data.type);
    const stateWithoutTask = reducer(stateWithTask, apiDeleted(taskWithTransaction.data));
    const { data: relationship } = stateWithoutTask.transactions.data[0].relationships.task;
    expect(relationship).toEqual(null);
  });

  describe('when one-to-many relationship', () => {
    it('should update reverse relationship for transaction', () => {
      // Add task with transactions to state
      const stateWithTask = reducer(state, apiCreated({ data: taskWithTransactions }));
      expect(stateWithTask.tasks).toEqual({ data: [taskWithTransactions] });

      // Update relation between transaction and task
      const stateWithTaskWithTransaction = reducer(stateWithTask, apiUpdated({ data: transactionWithTask }));

      expect(stateWithTaskWithTransaction.transactions.data[0].relationships.task.data.type).toEqual(taskWithTransactions.type);

      const stateWithoutTask = reducer(stateWithTask, apiDeleted(taskWithTransactions));
      const { data: relationship } = stateWithoutTask.transactions.data[0].relationships.task;
      expect(relationship).toEqual(null);
    });

    it('should update reverse relationship for task', () => {
      // Add task with transactions to state
      const stateWithTask = reducer(state, apiCreated({ data: taskWithTransactions }));
      // Update relation between transaction and task
      // TODO: check relationshiphs on create resource
      const stateWithTaskWithTransaction = reducer(stateWithTask, apiUpdated({ data: transactionWithTask }));

      expect(stateWithTaskWithTransaction.transactions.data[0].id).toEqual(taskWithTransactions.relationships.transaction.data[0].id);

      const stateWithoutTransaction = reducer(stateWithTask, apiDeleted(transactionWithTask));
      const { data: relationship } = stateWithoutTransaction.tasks.data[0].relationships.transaction;
      expect(relationship).toEqual([]);
    });
  });
});

describe('Endpoint values', () => {
  it('should update to provided axiosConfig', () => {
    const config = {
      headers: {
        Authorization: 'Bearer abcdef0123456789'
      }
    };
    expect(state.endpoint.axiosConfig).toNotEqual(config);
    const updatedState = reducer(state, setAxiosConfig(config));
    expect(updatedState.endpoint.axiosConfig).toEqual(config);
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
      apiUpdated(state.users)
    );
    expect(updatedState.users.data[0].isInvalidating).toNotExist();
  });
});

describe('progress flags', () => {
  it('should update isUpdating flag properly when update fails', () => {
    let updatedState = reducer(state, apiWillUpdate(state.users.data[0]));
    expect(updatedState.isUpdating).toEqual(1);
    updatedState = reducer(updatedState, apiUpdateFailed({ resource: state.users.data[0] }));
    expect(updatedState.isUpdating).toEqual(0);
  });

  it('should update isDeleting flag properly when delete fails', () => {
    let updatedState = reducer(state, apiWillDelete(state.users.data[0]));
    expect(updatedState.isDeleting).toEqual(1);
    updatedState = reducer(updatedState, apiDeleteFailed({ resource: state.users.data[0] }));
    expect(updatedState.isDeleting).toEqual(0);
  });
});

const request1 = {
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON API paints my bikeshed!',
        body: 'The shortest article. Ever.',
        created: '2015-05-22T14:56:29.000Z',
        updated: '2015-05-22T14:56:28.000Z'
      },
      relationships: {
        author: {
          data: {
            id: '42',
            type: 'people'
          }
        }
      }
    }
  ],
  included: [
    {
      type: 'people',
      id: '42',
      attributes: {
        name: 'John',
        age: 80,
        gender: 'male'
      },
      relationships: {
        articles: {},
        comments: {}
      }
    }
  ]
};

const request2 = {
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON API paints my bikeshed!',
        body: 'The shortest article. Ever.',
        created: '2015-05-22T14:56:29.000Z',
        updated: '2015-05-22T14:56:28.000Z'
      },
      relationships: {
        author: {}
      }
    }
  ]
};

describe('Relationships without data key should not be reset', () => {
  it('should append read resources to state', () => {
    const updatedState = reducer(state, apiRead(request1));
    expect(updatedState.articles).toBeAn('object');
    expect(updatedState.articles.data.length).toEqual(1);
    expect(updatedState.articles.data[0].relationships.author).toEqual({ data: { id: '42', type: 'people' } });

    const updatedState2 = reducer(updatedState, apiRead(request2));
    expect(updatedState2.articles).toBeAn('object');
    expect(updatedState2.articles.data.length).toEqual(1);
    expect(updatedState2.articles.data[0].relationships.author).toEqual({ data: { id: '42', type: 'people' } });
  });
});
