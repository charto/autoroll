var path = require('path');
var fs = require('fs');

/** Map kebab-case module names to camelCase exported variable names. */

function camelize(name) {
	return(name.replace(/-([a-z])/g, function(match) {
		return(match[1].toUpperCase());
	}));
}

/** Generate internal npm package descriptor. */

function newPackage(name, root, json) {
	return({
		pkgName: name,
		varName: camelize(name),
		// Package root path containing package.json.
		root: root,
		json: json || require(path.resolve(root, 'package.json')),
		bundle: false
	});
}

/** Generate rollup config object. */

function configure(config) {
	config = config || {};

	var root = config.root || '.';
	var json = require(path.resolve(root, 'package.json'));
	var packages = [];

	// Add all external packages as possible dependencies.

	var registry = {};
	var names = {};

	[].concat(
		Object.keys(json.dependencies || {}),
		Object.keys(json.peerDependencies || {})
	).map(function(name) {
		if((config.map || {})[name]) return;
		try {
			var spec = newPackage(name, path.resolve(root, 'node_modules', name));

			registry[name] = spec;
			names[name] = spec.varName;
		} catch(err) {}
	});

	if(config.alle) {
		// Find all packages under packages/node_modules or similar.
		fs.readdirSync(path.resolve(config.alle, 'node_modules')).map(function(name) {
			try {
				var spec = newPackage(name, path.resolve(config.alle, 'node_modules', name));

				registry[name] = spec;
				names[name] = spec.varName;

				packages.push(spec);
			} catch(err) {}
		});
	} else {
		// Add this package.
		packages.push(newPackage(json.name, root, json));
	}

	// Note packages configured for inclusion in bundles.

	(config.include || []).map(function(name) {
		(registry[name] || {}).bundle = true;
	});

	// Resolve a package name for rollup.

	function resolve(name, parent) {
		var result = (config.map || {})[name];
		if(result) return(path.resolve(result));

		var parts = name.split('/');
		var spec = registry[parts[0]];

		if(spec) {
			var json = spec.json;
			return(path.resolve(spec.root, parts.slice(1).join('/') || json.module || json.main));
		}
	}

	// Generate rollup config to bundle each internal package separately.

	var rollupConfig = packages.map(function(spec) {
		// Read internal package config.
		var json = spec.json;

		return({
			// Start from ES module or main entry point.
			input: path.resolve(spec.root, json.module || json.main),
			// Treat all dependencies as external, not bundled in.
			external: Object.keys(registry).filter(function(name) { return(!registry[name].bundle); }),
			output: [
				{
					// Generate browser entry point script.
					file: path.resolve(spec.root, json.browser),
					// Use module name in camelCase as the variable to export.
					name: camelize(json.name),
					// Guess variable names exported by other packages.
					globals: names,
					format: 'umd'
				}
			],
			plugins: [
				{
					resolveId: resolve
				}
			]
		});
	});

	if((!module.parent || !module.parent.parent) && !config.silent) {
		// If rollup config script was called directly, print generated config.
		process.stdout.write(JSON.stringify(rollupConfig, null, '  '));
	}

	return(rollupConfig);
};

module.exports = configure;
