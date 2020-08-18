Relationship API
---

_redux-json-api_ provides a simple API for managing relationships.

- Read related resources through [readRelated](#readrelated-resource-object-relationship--promise)
- Read relationship data through [readRelationship](#readrelationship-resource-object-relationship--promise)
- Replace relationship data with [replaceRelationship](#replacerelationship-resource-object-relationship--promise)
- Add a relationship using [addRelationship](#addrelationship-resource-object-relationship--promise)
- Delete a relationship with [deleteRelationship](#deleterelationship-resource-object-relationship--promise)

## API Methods

Note: Return values noted below are after dispatch, i.e. `dispatch(readRelated({ ... }))`.

#### `readRelated( resource: JsonApiResource, relationship: string ): Promise<JsonApiDocument>`

Use this action creator to trigger a GET request to your API with the given resource and relationship.
This will use the `related` link in the relationship by default, if there is no `related` link, the endpoint used
will be `{resourceType}/{resourceId}/{relationship}`.

Expects a [JSON API resource](https://jsonapi.org/format/#document-resource-objects) in the response.

#### `readRelationship( resource: JsonApiResource, relationship: string ): Promise<JsonApiDocument>`

Use this action creator to trigger a GET request to your API with the given resource and relationship.
This will use the `self` link in the relationship by default, if there is no `self` link, the endpoint used
will be `{resourceType}/{resourceId}/relationships/{relationship}`.

Expects a [JSON API relationship](https://jsonapi.org/format/#document-resource-object-relationships) in the response.

#### `replaceRelationship( resource: JsonApiResource, relationship: string, data: JsonApiRelationship ): Promise<JsonApiDocument>`

Use this action creator to trigger a PATCH request to your API with the given resource and relationship.
This will use the `self` link in the relationship by default, if there is no `self` link, the endpoint used
will be `{resourceType}/{resourceId}/relationships/{relationship}`.

The expected behaviour of the server is to replace the existing relationship with the `data` argument.

#### `addRelationship( resource: JsonApiResource, relationship: string, data: JsonApiResource ): Promise<void>`

Use this action creator to trigger a POST request to your API with the given resource and relationship.
This will use the `self` link in the relationship by default, if there is no `self` link, the endpoint used
will be `{resourceType}/{resourceId}/relationships/{relationship}`.

The expected behaviour of the server is to add relationship specified in the `data` argument. Only `to-many`
relationships should action this request.

#### `deleteRelationship( resource: JsonApiResource, relationship: string, data: JsonApiResource ): Action`

Use this action creator to trigger a DELETE request to your API with the given resource and relationship.
This will use the `self` link in the relationship by default, if there is no `self` link, the endpoint used
will be `{resourceType}/{resourceId}/relationships/{relationship}`.

The expected behaviour of the server is to remove the relationship specified in the `data` argument, without affecting
the underlying resource. Only `to-many` relationships should action this request.
