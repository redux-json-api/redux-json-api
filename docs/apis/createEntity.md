## createEntity(value: { object })
Dispatching the createEntity function will send a `POST` to the backend, providing it a JSON API compliant object.

```javascript
import { createEntity } from 'redux-json-api'
class CreateTask extends Component {
  handleSubmit() {
    const { dispatch } = this.props;
    const entity = {
      type: 'tasks',
      attributes: {
        task: 'New task name'
      },
      relationships: {
        taskList: {
          data: {
            id: '1',
            type: 'taskLists'
          }
        }
      }
    }

    dispatch(createEntity(entity));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text"/>
        <button type="submit">Submit Task</button>
      </form>
    );
  }

}

export default connect()(CreateTask);
```

When submitting the task the `redux-json-api` will dispatch the following actions:

__API_WILL_CREATE__
_This tells us what payload have been in the que for creation, and what the `redux-json-api` will ship to the backend_
```javascript
action: {
  payload: {
    type: 'tasks',
    attributes: {
      task: 'New task created'
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
_This tells us the response object that we get back from the sever, where the backend have stored it, given it a ID, and next time we want to call the `readEndpoint`this object will now show up with our tasks._
```javascript
action: {
  payload: {
    id: '1'
    type: 'tasks',
    attributes: {
      task: 'New task created',
      completed: false
    },
    relationships: {
      taskList: {
        data: {
          id: '1',
          type: 'taskLists'
        }
      }
    }
  }
}
```
