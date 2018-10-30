function camelize(name) {
	return(name.replace(/-([a-z])/g, function(match) {
		return(match[1].toUpperCase());
	}));
}

function configure(pkg) {
	var names = {};
	var deps = Object.keys(pkg.dependencies || {}).concat(
		Object.keys(pkg.peerDependencies || {})
	);

	deps.map(function(name) {
		names[name] = camelize(name);
	});

	return({
		input: pkg.module,
		external: deps,
		output: [
			{
				file: pkg.main,
				format: 'cjs'
			}, {
				file: pkg.browser,
				name: camelize(pkg.name),
				globals: names,
				format: 'umd'
			}
		]
	});
};

module.exports = configure;
