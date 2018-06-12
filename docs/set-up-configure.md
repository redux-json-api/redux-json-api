Set-Up & Configure
------------------

Getting _redux-json-api_ set up requires __4 steps__ which we will cover here.

1. Install
1. Add _redux-json-api_ reducer to _api_ namespace
1. Add required middleware to store
1. Configure API endpoints and access token

## Install with npm/yarn

`$ npm install redux-json-api --save`

or

`$ yarn add redux-json-api`

## Add reducer to _api_ namespace

The current version of _redux-json-api_ assumes that it's reducer reduced on to your root reducer under the namespace _api_.

You can achieve this by using [combineReducers](http://redux.js.org/docs/api/combineReducers.html) from Redux:

```js
// rootReducer.js
import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';

export default combineReducers({
  api
});
```

## Add required middleware to store

Since most of _redux-json-api_'s are async it is required to configure your store with the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware. Please see their docs for installation instructions.

## Configure API endpoints and access token

As _redux-json-api_ will automatically make requests to your API, it requires to know about API host, root path and any headers, such as an access token.

#### Defaults

By default, without the host and root path being set, all requests will be made to the current host at root (example: `/tasks`) with the following headers:

```js
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json'
  }
```

To change any of the defaults, the appropriate `set` methods should be dispatched before dispatching any CRUD actions.

#### `setEndpointHost( hostWithProtocol: string ): object`

Dispatch the returned action to set endpoint hostname. It requires one argument, which is a full hostname including protocol.

```js
dispatch(setEndpointHost('https://api.my-server'));
```

#### `setEndpointPath( rootPath: string ): object`

Dispatch the returned action to configure endpoint root path. It requires one argument.

```js
dispatch(setEndpointPath('/v1'));
```

Host and path will be concatenated without any validation. Be aware of missing slashes. This will cause an error, due to a missing forward slash:

```js
dispatch(setEndpointHost('https://api.my-server'));
dispatch(setEndpointPath('v1'));
// => https://api.my-serverv1
```

#### `setAccessToken( accessToken: string ): object`

Dispatch this action to configure an access token to include in all requests.
This will in turn dispatch a setHeader request, setting the header up as
`Authorization: Bearer <accessToken>`.

#### `setHeader( headers: object ): object`

Dispatch this action to configure any headers to be included in all requests.
The singular 'setHeader' action will merge in the given header(s).

#### `setHeaders( headers: object ): object`

Dispatch this action to completely reset the headers, removing all defaults.
The equivalent of ```dispatch(setAccessToken('myToken123'))``` is:

```js
dispatch(setHeaders({
  Authorization: `Bearer myToken123`,
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json'
}));
```
