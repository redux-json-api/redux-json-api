import { getResourceTree, getResourceData, getResource } from '../src/selectors';

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
