## `createEntity( resource: object ): Promise`

Dispatch function returned from `createEntity` to issue a `POST` request to your API.

### Example

```js
import { connect } from 'react-redux';
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
    return <button onClick={this.handleSubmit.bind(this)} />;
  }
}

export default connect()(CreateTask);
```

### Nested actions

#### API_WILL_CREATE

This action will be dispatched immediately after dispatching `createEntity`. It will increment `state.api.isCreating`.

#### API_CREATED

When the API returns the request successfully, `API_CREATED` is dispatched to append the newly created resource object to state.

Based on the example above, a new resource object is appended to `state.api.tasks.data`.

After appending the object to state, `state.api.isCreating` is decremented.

This is also the state at which the returned Promise is resolved.

#### API_CREATE_FAILED

If the API returns the request with an error, `API_CREATE_FAILED` is dispatched. `state.api.isCreating` is decremented and the returned Promise will throw an error.
