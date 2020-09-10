Selectors
---

_redux-json-api_ provides a set of simple selectors.

#### `getResourceTree( state, resourceType: string ): JsonApiDocument`

Returns the state tree for the given resource type.

#### `getResourceData( state, resourceType: string ): array<JsonApiResource>`

Returns the data (i.e. array of resources) for a given resource type

#### `getResource( state, resourceIdentifier: JsonApiResourceIdentifier ): JsonApiResource`
#### `getResource( state, resourceType: string, resourceId: string ): JsonApiResource`

Returns a specific resource based on the identifier, if that resource exists in the store.

##### Example

```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getResource } from 'redux-json-api';

// Where taskId is the ID for a specific task.
const Task = ({ taskId }) => {
  const task = useSelector((state) => getResource(state, 'tasks', taskId));

  return <li>{task.title}</li>
};

export default Task;
```

#### `getResources( state, resourceIdentifiers: array<JsonApiResourceIdentifier> ): array<JsonApiResource>`
#### `getResources( state, resourceType: string, resourceId: array<string> ): array<JsonApiResource>`

Returns an array of resources based on the given identifiers.

##### Example

```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getResources } from 'redux-json-api';

// Where taskIds is an array of ids
const Tasks = ({ taskIds }) => {
  const tasks = useSelector((state) => getResources(state, 'tasks', taskIds));

  return <ul>
    {tasks.map(task => (
      <li>{task.title}</li>
    ))}
  </ul>
};

export default Tasks;
```

#### `getRelatedResources( state, resource: JsonApiResourceIdentifier, relationship: string ): JsonApiResource | array<JsonApiResource>`

Returns the related resources for the given resource.

##### Example

```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getRelatedResources } from 'redux-json-api';

// Where user is a JsonApiResource with a "tasks" relationship
const Tasks = ({ user }) => {
  const tasks = useSelector((state) => getRelatedResources(state, user, 'tasks'));

  return <ul>
    {tasks.map(task => (
      <li>{task.title}</li>
    ))}
  </ul>
};

export default Tasks;
```
