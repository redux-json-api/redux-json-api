### `readEndpoint( endpoint: string ): Promise<JsonApiDocument>`

To read resource object from your API, you simply dispatch the function returned by `readEndpoint`. It will automatically read all resources from `data` and `included` keys on the response body, and append these to state.

### Endpoint

This action is very simple, in that the endpoint passed to the action creator is simply appended to the configured root path and endpoint.

A dispatch of `readEndpoint('tasks?include=createe')`, where root path/endpoint is configured to "https://api.example.org/v1", will make a `GET` request to "https://api.example.org/v1/tasks?include=createe".

### Example

```js
import { connect } from 'react-redux';
import { readEndpoint } from 'redux-json-api';

const mapStateToProps = ({ api: { tasks = { data: [] } } }) => ({ tasks });
class Tasks extends Component {
  componentWillMount() {
    this.props.dispatch(readEndpoint('tasks?include=assignee'));
  }

  render() {
    return (
      <ul>
        {this.props.tasks.data.map(task => (
          <li>{task.title}</li>
        ))}
      </ul>
    )
  }

}

export default connect(mapStateToProps)(Tasks);
```

### Nested actions

#### API_WILL_READ

This action is dispatched immediately after dispatching `readEndpoint`. It will increment `state.api.isReading`.

#### API_READ

A successful API request will dispatch the `API_READ` action. For this action the reducer will take all resource objects from the response body (from `data` and `included` keys) and append these to state.

Resource objects are automatically mapped to `state.api.${resourceType}`, where `resourceType` is the value of `type` on the resource objects. It reads each resource object individually.

After appending resource objects to state, `state.api.isReading` is decremented.

This also triggers resolve on the returned Promise.

#### API_READ_FAILED

If the API responds with an error, `API_READ_FAILED` will be dispatched. The returned Promise throws an error and `state.api.isReading` is decremented.
