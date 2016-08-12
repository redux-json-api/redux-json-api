Set-Up & Configure
------------------

Getting _redux-json-api_ set up requires __4 steps__ which we will cover here.

1. Install through npm
1. Add _redux-json-api_ reducer to _api_ namespace
1. Add required middleware to store
1. Configure API endpoints and access token

## Install through npm

`$ npm install redux-json-api --save`

## Add reducer to _api_ namespace

The current version of _redux-json-api_ assumes that it's reducer will be attached to the api namespace of your Redux state.

You can achieve this by using [combineReducers](http://redux.js.org/docs/api/combineReducers.html) from Redux:

```js
import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';

export default combineReducers({
  api
});
```

## Add required middleware to store

Since most of _redux-json-api_'s are async it is required to configure your store with the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware. Please see their docs for installation instructions.

## Configure API endpoints and access token

As _redux-json-api_ will automatically make request to your API, it requires to know about API host, root path and access token.

There are one method for each of these, and they should be dispatched before dispatching any CRUD actions.

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

Dispatch this action to configure an access token to include in all requests. At the moment, _redux-json-api_ only supports authorizing requests through the `Authorization: Bearer <accessToken>` header.
