import {
  getRelatedResources, getResource, getResourceData, getResources, getResourceTree
} from '../src/jsonapi';

const state = {
  api: {
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
            transactions: {
              data: [
                {
                  type: 'transactions',
                  id: '34'
                }
              ]
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
  }
};

describe('Resource tree selector', () => {
  it('should return the full resource tree', () => {
    const resourceTree = getResourceTree(state, 'transactions');

    expect(resourceTree).toEqual(state.api.transactions);
  });

  it('should not break if resource does not exist', () => {
    const resourceTree = getResourceTree(state, 'unicorns');

    expect(resourceTree)
      .toEqual({ data: [] });
  });
});

describe('Resource data selector', () => {
  it('should return the full resource data', () => {
    const resourceTree = getResourceData(state, 'transactions');

    expect(resourceTree)
      .toEqual(state.api.transactions.data);
  });

  it('should not break if resource tree does not have a data attribute', () => {
    state.types = {};
    const resourceTree = getResourceData(state, 'types');

    expect(resourceTree)
      .toEqual([]);
  });

  it('should not break if resource does not exist', () => {
    const resourceTree = getResourceData(state, 'unicorns');

    expect(resourceTree)
      .toEqual([]);
  });
});

describe('Resource selector', () => {
  it('should return the correct resource', () => {
    const resourceTree = getResource(state, { type: 'users', id: '1' });

    expect(resourceTree)
      .toEqual(state.api.users.data[0]);
  });

  it('should support alternative inputs and the correct resource', () => {
    const resourceTree = getResource(state, 'users', '1');

    expect(resourceTree)
      .toEqual(state.api.users.data[0]);
  });

  it('should support passing an integer as an id', () => {
    const resourceTree = getResource(state, 'users', 1);

    expect(resourceTree)
      .toEqual(state.api.users.data[0]);
  });

  it('should not break if resource does not have exist', () => {
    state.types = {};
    const resourceTree = getResource(state, {
      type: 'users',
      id: '10'
    });

    expect(resourceTree)
      .toEqual(null);
  });

  it('should not break if resource type does not have exist', () => {
    state.types = {};
    const resourceTree = getResource(state, {
      type: 'unicorns',
      id: '10'
    });

    expect(resourceTree)
      .toEqual(null);
  });
});

describe('Resources selector', () => {
  it('should return the correct resources', () => {
    const resourceTree = getResources(state, 'users', ['1', '2']);

    expect(resourceTree)
      .toEqual(state.api.users.data);
  });

  it('should return the correct resources with an array of identifiers', () => {
    const resourceTree = getResources(state, [
      {
        type: 'users',
        id: '1',
      },
      {
        type: 'users',
        id: '2',
      }
    ]);

    expect(resourceTree)
      .toEqual(state.api.users.data);
  });

  it('should support passing an integer as an id', () => {
    const resourceTree = getResources(state, 'users', [1, 2]);

    expect(resourceTree)
      .toEqual(state.api.users.data);
  });

  it('should not break if a resource does not have exist', () => {
    const resourceTree = getResources(state, 'users', ['1', '2', '3']);

    expect(resourceTree)
      .toEqual(state.api.users.data);
  });

  it('should not break if resource type does not have exist', () => {
    state.types = {};
    const resourceTree = getResources(state, 'unicorns', ['1']);

    expect(resourceTree)
      .toEqual([]);
  });
});

describe('Relationship selector', () => {
  it('should return the correct relationships', () => {
    const relationshipResources = getRelatedResources(state, state.api.users.data[0], 'transactions');

    expect(relationshipResources)
      .toEqual([state.api.transactions.data[0]]);
  });
});
