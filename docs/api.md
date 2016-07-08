API
---

_redux-json-api_ provides a simple API for all four CRUD actions.

- Create resource objects using [createEntity](#createentity-resource-object--function)
- Read endpoints using [readEndpoint](#readendpoint-endpoint-string--function)
- Update using [updateEntity](#updateentity-resource-object--function)
- Delete resources using [deleteEntity](#deleteentity-resource-object--function)

## Resource objects

Whenever there's referred to a resource object or entity, it must conform to JSON API specifications.

## Resource endpoints

_redux-json-api_ resolves resource objects to endpoints based on their specified type. The following resource will update and delete to _/tasks/1_:

```json
{
  "id": 1,
  "type": "tasks",
  "attributes": {
    "title": "Lorem ipsum"
  }
}
```

While dispatching a create action for the following resource will make a request to _/tasks_:

```json
{
  "type": "tasks",
  "attributes": {
    "title": "Lorem ipsum"
  }
}
```

## API Methods

#### `createEntity( resource: object ): function`

Use this action creator to trigger a POST request to your API with the given resource.

[Examples and details here.](docs/apis/createEntity.md)

#### `readEndpoint( endpoint: string ): function`

This action creator will trigger a GET request to the specified endpoint.

[Read more.](docs/apis/readEndpoint.md)

#### `updateEntity( resource: object ): function`

Update entities using this action creator. It will make a PATCH request to your API.

[Details and examples.](docs/apis/updateEntity.md)

#### `deleteEntity( resource: object ): function`

Use this action creator to issue a DELETE request to your API.

[More details on _deleteEntity_](docs/apis/deleteEntity.md)
