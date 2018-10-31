var path = require('path');

function camelize(name) {
	return(name.replace(/-([a-z])/g, function(match) {
		return(match[1].toUpperCase());
	}));
}

function configure(pkg, config) {
	var names = {};
	var bundle = {};

	config = config || {};
	(config.include || []).map(function(name) { bundle[name] = true; });

	var deps = Object.keys(pkg.dependencies || {}).concat(
		Object.keys(pkg.peerDependencies || {})
	);

	deps.map(function(name) {
		names[name] = camelize(name);
	});

	function resolve(name, parent) {
		try {
			var pkgName = name.split('/')[0];

			if(bundle[pkgName]) {
				var pkg = require(path.resolve('node_modules', name, 'package.json'));

				return(require('path').resolve('node_modules', name, pkg.module || pkg.main));
			}
		} catch(err) {}
	}

	return([
		{
			input: pkg.module,
			external: deps,
			output: [
				{
					file: pkg.main,
					format: 'cjs'
				}
			]
		}, {
			input: pkg.module,
			external: deps.filter(function(name) { return(!bundle[name]) }),
			output: [
				{
					file: pkg.browser,
					name: camelize(pkg.name),
					globals: names,
					format: 'umd'
				}
			],
			plugins: [
				{
					resolveId: resolve
				}
			]
		}
	]);
};

module.exports = configure;
