# Getting Started
Getting into using Redux JSON API is fairly simple and requires __3 Steps__ witch we will cover here.

If you have already setup `redux-json-api` please go to the "How to use Redux JSON API", since this will strictly get the libiary set up.

## 1. Instalation
To install `redux-json-api` go to your projects root (where your package.json is located) and run:

`$ npm install redux-json-api --save`

## 2. Combine reducers
To get data from `redux-json-api` you must reduce our reducer on to your own reducer, by using the `combineReducers` from `redux`.

```javascript
// rootReducer.js
import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';

export default combineReducers({
  api
});
```

For sanity we have removed all other reducers from the `combineReducers` combined reducers will take an object of reducers, you are able to apply more reducers, such as your own.

__NB:__ For this to work, its important that your store is setup with the `redux-thunk` middleware, not sure how to set up your store see this guide: "Setting up redux store with redux-thunk middleware" -

Thanks to [__@justaskz__](https://github.com/justaskz) for pointing this out to us.

## 3. Initialize redux-json-api
The last step you need to define is using the `setEndpointPath()` & `setEndpointHost()` this will set the `api.endpoint` that `redux-json-api` will use for when dispatchig various call's through the api.

Its important to note, to do this as early as possible perfable in container that initializes your application so you are ready to call you endpoints when initial bootstrap is done.

```javascript
// CoreLayout.js
import { setEndpointPath, setEndpointHost } from 'redux-json-api';

class CoreLayout extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(setEndpointHost('my.app/'));
    dispatch(setEndpointPath('api/v1/'));
  }

  render() {
    return (
      <div />
    );
  }

}

export default connect()(CoreLayout);
```

In this example are we using the CoreLayout witch is the first component to be rendered, we will before the component mount dispatch our `setEndpointHost` and `setEndpointPath` with strings that defines our api's path.

__NB:__ A good practise would be to store these as a process enviromental variable.
