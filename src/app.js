import 'bootstrap';
import 'jquery-ui';
import 'bootstrap/css/bootstrap.css!';
import d3 from 'd3'

export class App {
	constructor() {
		this.userScores = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
		this.scoreColorRamp = d3.scale.linear().domain([0,100]).range(["#5cb85c","#d9534f"]);
		console.log(this.recordingScore);
	}
	configureRouter(config, router) {
		config.title = "test";
		config.map([
			{ route: ["", "dashboard"], name: "dashboard", moduleId: "./dashboard", nav: true, title: "Dashboard"},
			{ route: 'flickr',       name: 'flickr',   moduleId: './flickr',  nav: true, title: "Flickr" },
			{ route: 'child-router', name: 'childRouter',  moduleId: './child-router', nav: true, title:'Child Router' }
		]);
		this.router = router;
	}

	registerDashboard(dashboard) {
		this.dashboard = dashboard;
	}

	recordScore(score) {
		this.recordingScore = score;
		$("#recordingScorePanel").css("display", "block");
		$("#recordingScorePanel").css("background", this.scoreColorRamp(score));
		$("#recordingScorePanel").fadeOut(2000, "linear", () => {
			console.log("Score", this.recordingScore);
			this.recordingScore = undefined;
			this.dashboard.advanceTime(5);
		});
	}

	cancelRecordScore() {
		$("#recordingScorePanel").stop(true);
		$("#recordingScorePanel").css("opacity", 1);
		$("#recordingScorePanel").css("display", "none");
	}
}
