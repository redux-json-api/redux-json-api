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

#### `getResources( state, resourceIdentifiers: array<JsonApiResourceIdentifier> ): array<JsonApiResource>`
#### `getResources( state, resourceType: string, resourceId: array<string> ): array<JsonApiResource>`

Returns an array of resources based on the given identifiers.

#### `getResources( state, resource: JsonApiResourceIdentifier, relationship: string ): JsonApiResource | array<JsonApiResource>`

Returns the related resources for the given url
