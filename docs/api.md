API
---

_redux-json-api_ provides a simple API for all four CRUD actions.

- Create resource object using [createEntity](#createentity-resource-object--function)
- Read endpoints through [readEndpoint](#readendpoint-endpoint-string--function)
- Update resource with [updateEntity](#updateentity-resource-object--function)
- Delete resource using [deleteEntity](#deleteentity-resource-object--function)

## Resource objects

Whenever there's referred to a resource object or entity, it must conform to [JSON API specifications](http://jsonapi.org/format/#document-resource-objects).

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


## API Promises
The _redux-json-api_'s CRUD API methods will all return a single promise. The fulfillment handler will receive one argument with the response body. One exception to this is the fulfillment handler from a `deleteEntity` promise, which will not receive any arguments.


## API Methods

#### `createEntity( resource: object ): function`

Use this action creator to trigger a POST request to your API with the given resource.

[Examples and details here.](apis/createEntity.md)

#### `readEndpoint( endpoint: string ): function`

This action creator will trigger a GET request to the specified endpoint.

[Read more.](apis/readEndpoint.md)

#### `updateEntity( resource: object ): function`

Update entities using this action creator. It will make a PATCH request to your API.

[Details and examples.](apis/updateEntity.md)

#### `deleteEntity( resource: object ): function`

Use this action creator to issue a DELETE request to your API.

[More details on _deleteEntity_](apis/deleteEntity.md)
