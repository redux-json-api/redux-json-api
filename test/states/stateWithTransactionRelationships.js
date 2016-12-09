export const stateWithTransactionRelationships = {
  endpoint: {
    host: null,
    path: null,
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json'
    }
  },
  tasks: {
    data: [
      {
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
              },
              {
                type: 'transactions',
                id: '35'
              }
            ]
          }
        },
        links: {
          self: 'http://localhost/tasks/43'
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
      },
      {
        type: 'transactions',
        id: '35',
        attributes: {
          description: '123',
          createdAt: '2016-02-12T13:34:01+0000',
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
  },
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0
};
