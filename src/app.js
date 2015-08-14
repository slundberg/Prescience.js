import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import 'bootstrap';
import 'jquery-ui';
import 'bootstrap/css/bootstrap.css!';
import d3 from 'd3'
import moment from 'moment-timezone';

@inject(HttpClient)
export class App {
	constructor(http) {
		this.http = http;
		this.user = sessionStorage.user;
		this.userScores = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
		//this.scoreColorRamp = d3.scale.linear().domain([0,100]).range(["#5cb85c","#d9534f"]);
		this.scoreColorRamp = d3.scale.linear().domain([0,100]).range(["#3983f1","#3983f1"]);
		this.recordingScore = -1;
		this.testCaseIndex = -1;
		this.nextTestCaseIndex = 0;
		this.testPoints = [{}];
		this.testCaseTimeIndex = -1;
		this.nextTestCaseTimeIndex = -1;
		window.this8 = this;
		this.version = 1; // this is used to keep different versions from conflicting when saving state (1 = test, 2 = live)
		this.testPointsUrl = "/db/prescience/scratch/sample-test-points-5";
		//this.testPointsUrl = "/db/prescience/scratch/test-points-100";
		//http://localhost:9200/prescience/scratch/sample-test-points-5
		//NProgress.start();
		//$(window).css("background: #fff;")
	}
	configureRouter(config, router) {
		config.title = "test";
		config.map([
			{ route: ["", "welcome"], name: "welcome", moduleId: "./welcome", nav: true, title: "Welcome" },
			{ route: "dashboard", name: "dashboard", nav: true, title: "Dashboard", moduleId: './dashboard' },
			{ route: 'flickr',       name: 'flickr',   moduleId: './flickr',  nav: true, title: "Flickr" },
			{ route: 'child-router', name: 'childRouter',  moduleId: './child-router', nav: true, title:'Child Router' }
		]);
		this.router = router;
	}

	logout() {
		sessionStorage.token = undefined;
		
		// do a full refresh to clear any state from the current user
		window.location.href = "/";
	}

	help() {
		$("#helpPanel").css("display", "block");
	}
	closeHelp() {
		$("#helpPanel").css("display", "none");
	}

	registerDashboard(dashboard) {
		this.dashboard = dashboard;
		this.startTesting();
	}

	doneLoading() {
		NProgress.done();
		$("#loadingPanel").fadeOut(2000, "linear", () => {
		});
	}

	startTesting() {

		this.http.createRequest(this.testPointsUrl)
			.withHeader('Prescience-User', sessionStorage.user)
            .withHeader('Prescience-Token', sessionStorage.token)
			.asGet().send().then((response,tmp) => {
				console.log("response TT", response.content);
				this.testPoints = response.content._source.data;

				// convert the strings to date objects
				for (let c of this.testPoints) {
					for (let p of c.times) {
						p[0] = new Date(p[0]);
					}
				}

				this.http.createRequest("/db/prescience/user-state/"+sessionStorage.user+"_v"+this.version)
					.withHeader('Prescience-User', sessionStorage.user)
					.withHeader('Prescience-Token', sessionStorage.token)
					.asGet().send().then((response,tmp) => {
						this.testCaseIndex = response.content._source.testCaseIndex;
						this.testCaseTimeIndex = response.content._source.testCaseTimeIndex;
						this.computeNextTimePoint();
						this.doneLoading();

					// an error means this user has never made a prediction
					}).catch(() => {
						this.testCaseIndex = -1;
						this.testCaseTimeIndex = -1;
						this.computeNextTimePoint();
						this.doneLoading();
					});
					//this.doneLoading();
			}).catch(() => this.requestFailed());
	}

	setTestPoint(caseIndex, timeIndex) {
		var id = this.testPoints[caseIndex].id;
		this.dashboard.loadProc(id, () => {
			if (timeIndex !== -1) {
				this.dashboard.setTime(this.testPoints[caseIndex].times[timeIndex][0]);
			}
			this.inPreop = this.testCaseTimeIndex === -1;
		});
	}

	computeNextTimePoint() {
		this.nextTestCaseIndex = this.testCaseIndex;
		this.nextTestCaseTimeIndex = this.testCaseTimeIndex+1;

		if (this.testCaseIndex === -1 || this.nextTestCaseTimeIndex === this.testPoints[this.testCaseIndex].times.length) {
			this.nextTestCaseIndex += 1;
			this.nextTestCaseTimeIndex = -1;
		} else if (this.testCaseTimeIndex !== -1) {
			this.nextTestCaseTimeDiff = moment.duration(this.testPoints[this.testCaseIndex].times[this.nextTestCaseTimeIndex][0]
				- this.testPoints[this.testCaseIndex].times[this.testCaseTimeIndex][0]).humanize();
		}
	}

	recordScore(score) {
		this.recordingScore = score;
		this.computeNextTimePoint();
		$("#recordingScorePanel").css("display", "block");
	}

	finishRecordScore() {
		$("#recordingScorePanel").fadeOut(1000, "linear", () => {
			NProgress.start();

			// If we are just starting and not actually recording a score
			// then just move and don't touch the server
			if (this.recordingScore === -1) {
				console.log("skip recording")
				this.testCaseIndex = this.nextTestCaseIndex;
				this.testCaseTimeIndex = this.nextTestCaseTimeIndex;
				this.setTestPoint(this.testCaseIndex, this.testCaseTimeIndex);
				return;
			}

			// record the score
			this.http.createRequest("/db/prescience/recorded-scores/")
				.withHeader('Prescience-User', sessionStorage.user)
	            .withHeader('Prescience-Token', sessionStorage.token)
				.asPost().withContent({
					user: sessionStorage.user,
					score: this.recordingScore,
					testCaseIndex: this.testCaseIndex,
					testCaseTimeIndex: this.testCaseTimeIndex,
					time: this.dashboard.currentTime.toISOString(),
					procId: this.dashboard.procId,
					version: this.version,
					'@timestamp': (new Date()).toISOString()
				}).send().then((response,tmp) => {

					// save the current position for the user
					this.http.createRequest("/db/prescience/user-state/"+sessionStorage.user+"_v"+this.version)
						.withHeader('Prescience-User', sessionStorage.user)
			            .withHeader('Prescience-Token', sessionStorage.token)
						.asPut().withContent({
							testCaseIndex: this.testCaseIndex,
							testCaseTimeIndex: this.testCaseTimeIndex,
							'@timestamp': (new Date()).toISOString()
						}).send().then((response,tmp) => {

							// we can now move to the next position
							this.recordingScore = -1;
							this.testCaseIndex = this.nextTestCaseIndex;
							this.testCaseTimeIndex = this.nextTestCaseTimeIndex;
							this.setTestPoint(this.testCaseIndex, this.testCaseTimeIndex);

						}).catch(() => this.requestFailed());
				}).catch(() => this.requestFailed());
		});
	}

	requestFailed() {
		alert("Failed to communicate with server! Returning to login screen to refresh credentials...");
		this.router.navigateToRoute("welcome");
	}

	cancelRecordScore() {
		$("#recordingScorePanel").stop(true);
		$("#recordingScorePanel").css("opacity", 1);
		$("#recordingScorePanel").css("display", "none");
	}
}
