export function configure(aurelia) {
	aurelia.use
		.standardConfiguration()
		.developmentLogging();
		//.plugin("./d3-watch");

	aurelia.start().then(a => a.setRoot());
}