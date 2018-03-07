### `deleteResource( resource: JsonApiResource ): Promise<JsonApiDocument>`

Dispatch this action to issue a `DELETE` request to your API.

### Endpoint

Endpoint calculation for `deleteResource` is the same as for [`updateResource`](./updateResource.md). It is resolved from `type` and `id` of the resource object passed to this action creator.

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
class DeleteTask extends Component {
  deleteTask() {
    const { dispatch, task } = this.props;
    dispatch(deleteResource(task));
  }

  render() {
    return <button onClick={this.deleteTask.bind(this)} />
  }
}

export default connect(mapStateToProps)(DeleteTask);
```

### Nested actions

#### API_WILL_DELETE

Immediately upon dispatching `deleteResource`, the `API_WILL_DELETE` action will be dispatched. This will increment `state.api.isDeleting` and set `isInvalidating` to "IS_DELETING" on the resource object passed to the action creator.

#### API_DELETED

When the API responds successfully, `API_DELETED` is dispatched to remove the resource object from state. `state.api.isDeleting` will be decremented.

We will also resolve the returned Promise when this action is dispatched.

#### API_DELETE_FAILED

Is the API returns an error during a DELETE request, this action will be dispatched. It will decrement `state.api.isDeleting` and throw an error in the returned Promise.
