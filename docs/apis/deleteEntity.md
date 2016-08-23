## `deleteEntity( resource: object ): Promise`
Dispatching the deleteEntity function will send a `DELETE` to the backend, providing it a JSON API compliant object.

```javascript
import { deleteEntity } from 'redux-json-api'
class TasksOverview extends Component {
  deleteTask(task) {
    const { dispatch } = this.props;
    dispatch(deleteEntity(task));
  }

  render() {
    // render view
  }

}

export default TasksOverview;
```
When submitting the deleation the `redux-json-api` will dispatch the following actions:

__API_WILL_DELETE__
_This tells us what payload have been in the que for deletion, and what the `redux-json-api` will ship to the backend_
```javascript
action: {
  payload: {
    type: 'tasks',
    attributes: {
      task: 'Task should be deleted',
      completed: false
    },
    relationships: {
      taskList: {
        data: {
          id: 1
          type: 'taskLists'
        }
      }
    }
  }
}
```

__API_DELETED__
_This tells us the response object that we deleted from the server._
```javascript
action: {
  payload: {
    type: 'tasks',
    attributes: {
      task: 'Task should be deleted',
      completed: false
    },
    relationships: {
      taskList: {
        data: {
          id: 1
          type: 'taskLists'
        }
      }
    }
  }
}
```
