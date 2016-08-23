API
---

_redux-json-api_ provides a simple API for all four CRUD actions.

- Read endpoints using [readEndpoint](#readendpoint-endpoint-string--function)
- Update entities using [updateEntity](#updateentity-resource-object--function)
- Delete resources using [deleteEntity](#deleteentity-resource-object--function)
- Create resource object using [createEntity](#createentity-resource-object--function)

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
The _redux-json-api_'s CRUD API methods will all return a single promise. Within this promise you will receive __`response: {object}`__ as first argument, in this `object` you will find key __`data: {object}`__ that contains all data.

_Note that `redux-json-api` by it self will reduce your data on your redux state._

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
