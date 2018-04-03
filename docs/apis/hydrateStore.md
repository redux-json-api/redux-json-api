### `hydrateStore( payload: JsonApiDocument ): Action`

"Hydration" is a term for filling an object with data. In this case, we are
"hydrating" the store on startup of an application using the `hydrateStore`
action.

Dispatch function returned from `hydrateStore` to add a JSON-API payload to the
store.

### Example

```js
import { createStore, combineReducers } from 'redux';
import { reducer as api, hydrateStore } from 'redux-json-api';

const store = createStore(
  combineReducers(api)
);

const jsonBlob = {
  "data": [{
    "type": "tasks",
    "id": "1",
    "attributes": {
      "task": "Deliver presents"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "1" }
      }
    }
  }],
  "included": [{
    "type": "users",
    "id": "1",
    "attributes": {
      "username": "santa"
    }
  }]
};

store.dispatch(hydrateStore(jsonBlob));

export default store;
```

### Nested actions

#### API_HYDRATE

This action parse the JSON-API provided and adds the contained objects to the
state. In this case, the task is added to `state.api.tasks.data` and the author
is added to `state.api.users.data`.
