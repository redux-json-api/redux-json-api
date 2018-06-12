### `createResource( resource: JsonApiResource ): Promise<JsonApiDocument>`

Dispatch function returned from `createResource` to issue a `POST` request to your API.

### Endpoint

The endpoint to which the request is issued is resolved from `type` off the resource object in the request body.

This resource object will resolve to "/tasks":

```json
{
  "type": "tasks",
  "attributes": {
    "task": "New task name"
  }
}
```

### Example

```js
import { connect } from 'react-redux';
import { createResource } from 'redux-json-api'

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

    dispatch(createResource(entity));
  }

  render() {
    return <button onClick={this.handleSubmit.bind(this)} />;
  }
}

export default connect()(CreateTask);
```

### Nested actions

#### API_WILL_CREATE

This action will be dispatched immediately after dispatching `createResource`. It will increment `state.api.isCreating`.

#### API_CREATED

When the API returns the request successfully, `API_CREATED` is dispatched to append the newly created resource object to state.

Based on the example above, a new resource object is appended to `state.api.tasks.data`.

After appending the object to state, `state.api.isCreating` is decremented.

This is also the state at which the returned Promise is resolved.

#### API_CREATE_FAILED

If the API returns the request with an error, `API_CREATE_FAILED` is dispatched. `state.api.isCreating` is decremented and the returned Promise will throw an error.
