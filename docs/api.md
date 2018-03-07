API
---

_redux-json-api_ provides a simple API for all four CRUD actions.

- Create resource object using [createResource](#createresource-resource-object--promise)
- Read endpoints through [readEndpoint](#readendpoint-endpoint-string--promise)
- Update resource with [updateResource](#updateresource-resource-object--promise)
- Delete resource using [deleteResource](#deleteresource-resource-object--promise)
- Add a resource to the store using [hydrateStore](#hydratestore-resource-object--action)

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
The _redux-json-api_'s CRUD API methods will all return a single promise. The fulfillment handler will receive one argument with the response body. One exception to this is the fulfillment handler from a `deleteResource` promise, which will not receive any arguments.


## API Methods

Note: Return values noted below are after dispatch, i.e. `dispatch(createResource({ ... }))`.

#### `createResource( resource: JsonApiResource ): Promise<JsonApiDocument>`

Use this action creator to trigger a POST request to your API with the given resource.

[Examples and details here.](apis/createResource.md)

#### `readEndpoint( endpoint: string ): Promise<JsonApiDocument>`

This action creator will trigger a GET request to the specified endpoint.

[Read more.](apis/readEndpoint.md)

#### `updateResource( resource: JsonApiResource ): Promise<JsonApiDocument>`

Update entities using this action creator. It will make a PATCH request to your API.

[Details and examples.](apis/updateResource.md)

#### `deleteResource( resource: JsonApiResource ): Promise<void>`

Use this action creator to issue a DELETE request to your API.

[More details on _deleteResource_](apis/deleteResource.md)

#### `hydrateStore( payload: JsonApiDocument ): Action`

Use this action to hydrate the store with e.g. bootstrapped data.

[More details on _hydrateStore_](apis/hydrateStore.md)
