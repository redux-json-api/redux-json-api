## deleteEntity(value: { object })
Dispatching the deleteEntity function will send a `DELETE` to the backend, providing it a JSON API compliant object (not sure what this is? head to our "Good reads section").

```javascript
import { deleteEntity } from 'redux-json-api'
class TasksOverview extends Component {
  deleteTask(task) {
    const { dispatch } = this.props;
    dispatch(deleteEntity(task));
  }

  render() {
    return (
      <div>
        <div className="left-col">
          <p>This tasks should be deleted</p>
        </div>
        <div className="right-col">
          <button onClick={deleteTask(this.props.task)}
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(TasksOverview);
```

When submitting the task the `redux-json-api` will dispatch the following actions:

__API_WILL_DELETE__
_This tells us what payload have been in the que for deletion, and what the `redux-json-api` will ship to the backend_
```javascript
action: {
  payload: {
    type: 'tasks',
    attributes: {
      task: 'New task created',
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

__API_CREATED__
_This tells us the response object that we deleted from the server._
```javascript
action: {
  payload: {
    type: 'tasks',
    attributes: {
      task: 'New task created',
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
