# autoroll

[![npm version](https://img.shields.io/npm/v/autoroll.svg)](https://www.npmjs.com/package/autoroll)
[![dependency status](https://david-dm.org/charto/autoroll.svg)](https://david-dm.org/charto/autoroll)
[![install size](https://packagephobia.now.sh/badge?p=autoroll)](https://packagephobia.now.sh/result?p=autoroll)
[![license](https://img.shields.io/npm/l/autoroll.svg)](https://raw.githubusercontent.com/charto/autoroll/master/LICENSE)

This is a multipurpose configuration file for [rollup](https://rollupjs.org/).
It reads your `package.json` file and automatically extracts relevant information.

## Usage

Put this in your `rollup.config.js`:

```JavaScript
module.exports = require('autoroll')(require('./package.json'));
```

That's all. Now it generates CommonJS and UMD bundles from ES6 sources.
Entry point paths are configured in de facto standard `package.json` fields which you should set up anyway:

- `browser`
- `main`
- `module`

If you have dependencies, to avoid bloat they don't get bundled by default.
You can include specific dependencies in the UMD bundle by listing them in `rollup.config.js`:

```JavaScript
module.exports = require('autoroll')(
  require('./package.json'),
  {
    include: [
      'some',
      'dependencies'
    ]
  }
);
```

They are looked up from the current working directory (package root in npm scripts), under `node_modules`.
Each package should have a `package.json` file with a `module` or `main` field defining an ES6 entry point.
Any more complicated setup should use a traditional rollup config file with plugins like
[rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) and
[rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs).
This package is for avoiding build system bloat in simpler cases.

# License

[The MIT License](https://raw.githubusercontent.com/charto/autoroll/master/LICENSE)

Copyright (c) 2018- BusFaster Ltd
