### `updateResource( resource: JsonApiResource ): Promise<JsonApiDocument>`

This action creator facilitates `PATCH` requests.

### Endpoint

Endpoint path for `updateResource` is resolved from `type` and `id` of the resource object passed to this action creator.

The following resource object will resolve to "/tasks/1":

```json
{
  "type": "tasks",
  "id": "1",
  "attributes": {
    "task": "New task name"
  }
}
```

### Example

```js
import { connect } from 'react-redux';
import { updateResource } from 'redux-json-api'

const mapStateToProps = ({
  api: { tasks = { data: [] } }
}, { taskId }) => ({
  task: tasks.data.find(task.id === taskId)
});
class UpdateTask extends Component {
  completeTask() {
    const { dispatch, task: { id, type } } = this.props;
    const completedTask = {
      type,
      id,
      attributes: {
        completed: true
      }
    };

    dispatch(updateResource(completedTask));
  }

  render() {
    return <button onClick={this.completeTask.bind(this)} />
  }
}

export default connect(mapStateToProps)(UpdateTask);
```

### Nested actions

#### API_WILL_UPDATE

This action will be dispatched immediately after dispatching `updateResource`. It will increment `state.api.isUpdating`. _redux-json-api_ will also add a flag to the resource object being updated, to flag it as being invalidated:

```json
{
  "type": "tasks",
  "id": "1",
  "attributes": {
    "title": "Task title"
  },
  "isInvalidating": "IS_UPDATING"
}
```

#### API_UPDATED

Upon successful patch of resource, `API_UPDATED` will be dispatched to replace the resource object in the state. Upon update, _redux-json-api_ will first remove the old resource object, then append the updated object to state.

This action will resolve the returned Promise.

State example before update:

```json
{
  "tasks": {
    "data": [
      {
        "type": "tasks",
        "id": "1",
        "attributes": {
          "title": "Integer posuere erat"
        },
        "isInvalidating": "IS_UPDATING"
      },
      {
        "type": "tasks",
        "id": "2",
        "attributes": {
          "title": "Cras justo odio"
        }
      },
      {
        "type": "tasks",
        "id": "3",
        "attributes": {
          "title": "Egestas eget quam"
        }
      }
    ]
  }
}
```

After successful update:

```json
{
  "tasks": {
    "data": [
      {
        "type": "tasks",
        "id": "2",
        "attributes": {
          "title": "Cras justo odio"
        }
      },
      {
        "type": "tasks",
        "id": "3",
        "attributes": {
          "title": "Egestas eget quam"
        }
      },
      {
        "type": "tasks",
        "id": "1",
        "attributes": {
          "title": "Lorem ipsum"
        }
      }
    ]
  }
}
```

#### API_UPDATE_FAILED

If the PATCH request responds with an error, we dispatch `API_UPDATE_FAILED`. This will remove any `isInvalidating` flag and decrement `state.api.isUpdating`.

The returned promise will throw an error when this action is dispatched.
