# browserify-node-config

Browserify transform for [node-config][] library.


## Install

```sh
npm install browserify-node-config
```


## Example

### Grunt

```js
var configify = require('browserify-node-config');
// ...
{
  // ...
  browserify: {
    options: {
      transform: [configify]
    }
  }
  // ...
}
```

### package.json

```js
{
  "name": "mymodule",
  "browserify": {
    "transform": "config-browserify"
  }
}
```


### Usage

**ClientSide.js** (which will be bundled by browserify)
```js
var config = require('config');
global.window && console.log(config.get('Client.testProperty')); // prints `hello!`
```

**config/default.json**
```json
{
  "ip": "0.0.0.0",
  "port": 80,
  "Client": {
    "testProperty": "hi"
  }
}
```


#### Important

- For support for server-side rendering frameworks, there is no support for
  `watchify` at the moment. The entire app must be restarted in order to get
  config properties which were modified since the server started.


[node-config]: https://github.com/lorenwest/node-config
