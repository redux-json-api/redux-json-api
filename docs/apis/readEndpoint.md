## readEndpoint(value: { object })
Great now we just created a new entity in our database using the `createEntity` method, now we would like to display this to our users.


```javascript
import { readEndpoint } from 'redux-json-api';
class Tasks extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(readEndpoint('tasks')); //<--
  }

  render() {
    return (
      {this.props.tasks}
    );
  }

}

export default connect()(Tasks);
```

When you have dispatched the `readEndpoint`method the reducer will run following actions:

__API_WILL_READ__
_This tells us that the `redux-json-api` will now call your backend with the payload given in this case a simple call to `/tasks´._
```javascript
action: {
  payload: '/tasks'
}
```

__API_READ__
_This tells us what respond the server gave us, and what is being mapped to your `api` key in your redux store, it will tell you what `[data]` is fetched, what `[includes]` and what `endpoint` it came from, and will reduce it all down for you to simple query of your redux store._
```javascript
action: {
  payload: {
    endpoint: '/tasks',
    data: [{...}, {...}, {...}]
  }
}
```

__NB:__ In this test case we dont get includes, but in the case where you are including data, they way we will store this in the redux store would be on the entity type key eg: `[{type: 'comments'}]` would be reduced on to your `api.comments` and the tasks that we fetched would be reduced to `api.tasks`
