import 'bootstrap';
import 'jquery-ui';
import 'bootstrap/css/bootstrap.css!';

export class App {
	constructor() {
		
	}
	configureRouter(config, router) {
		config.title = "test";
		config.map([
			{ route: ["", "welcome"], name: "welcome", moduleId: "./welcome", nav: true, title: "Welcome"},
			{ route: 'flickr',       name: 'flickr',   moduleId: './flickr',  nav: true, title: "Flickr" },
			{ route: 'child-router', name: 'childRouter',  moduleId: './child-router', nav: true, title:'Child Router' }
		]);
		this.router = router;
	}
}