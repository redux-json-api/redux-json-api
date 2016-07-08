Make Redux 💜 JSON API
----------------------
[![Build Status](https://travis-ci.org/dixieio/redux-json-api.svg?branch=master)](https://travis-ci.org/dixieio/redux-json-api)

This library is intended for use in web applications build on Redux, which consumes data from a [JSON API](http://jsonapi.org/).

Use _redux-json-api_ to have one simple way of storing resource objects in Redux state along with the CRUD API, which provides easy ways to create, read, update and delete resources.

Please raise any questions as an [Issue](issues) or submit your contributions as a [Pull Request](pulls). Remember to review our [contributions guidelines](CONTRIBUTING.md).

# Table of contents
1. [Set-Up & Configure](docs/set-up-configure.md)
1. [How To Use](#how-to-use)
1. [API Overview](#api-overview)
1. [Good reads](#good-reads)
1. [Contribute](#contribute)
1. [Contributors](#contributors)

## [How to use](docs/HowToUse.md)
## API overview
- [Read __createEntity()__](docs/apis/createEntity.md) - Creating new entities
- [Read __readEndpoint()__](docs/apis/readEndpoint.md) - Retrive data from your database
- [Read __updateEntity()__](docs/apis/updateEntity.md) - Update a given entity's values
- [Read __deleteEntity()__](docs/apis/deleteEntity.md) - Remove entity from your database

## Good reads
- [__Redux__](http://www.github.com) - Read about redux and core principles.
- [__JSON API__](http://www.jsonapi.org/) - Read about the specifications for JSON API.

## Contribute
The reason for this repository is to keep on a good and healty & simple api for _JSON API_, for Redux applications weahter you use it in _react_ or any other framework of choise. Feel like getting envolved into to this, then get cloning and follow our simple guide lines, if you just want to give feedback or report bug click that [issues](https://github.com/dixieio/redux-json-api/issues) button and lets talk about it.

### Development Guidelines
We have a few simple guidelines for how to develop on the tool, and how to build and test it locally.
#### Test the code
Beside writing the cases that you might create, there is also a need for you to test the code localy in your project, this can be set up using the `npm link` [How to use npmn link](https://docs.npmjs.com/cli/link), before creating the link you would need to build the code.

#### Build the code
To build the code for local testing purposed run `npm run build`, this will dist the code make it able to be a part of the node_modules packages in your applications repo.

#### Create a PR
You have done really cool work, __KUDOS__! 🎉, now you want to contrubute the code and you create a _PR_, we will then review the pull request.

## Contributors
Made with 💜 from the [Dixie](http://www.dixie.io) team, and our lovely [contributers](graphs/contributors)!
