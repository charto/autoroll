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

If you have dependencies, to avoid bloat they don't get bundled.

# License

[The MIT License](https://raw.githubusercontent.com/charto/autoroll/master/LICENSE)

Copyright (c) 2018- BusFaster Ltd
