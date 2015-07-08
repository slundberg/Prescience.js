import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import d3 from 'd3'

@inject(HttpClient)
export class Welcome {
	heading = "Welcome to the Nav app!";
	firstName = "John";
	lastName = "Doe";
	width = window.innerWidth;

	constructor(http) {
		this.http = http;
		this.dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S.%L");
		//r = new RegExp("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9].000")
		this.http.get("data/merged.validation.subsample5050.doctortest.realtime.json").then(response => {
			
			
			this.data = response.content[2];
			this.replaceDates(this.data);
			// parse all the dates in this procedure
			// for (let key of ["monitor", "medication", "fluid"]) {
			// 	for (let dataType in this.data[key]) {
			// 		for (let d of this.data[key][dataType]) {
			// 			d[0] = this.dateFormat.parse(d[0]);
			// 		}
			// 	}
			// }
			// d[0] = this.dateFormat.parse(d[0]);
			console.log(response.content);
		});
		this.colors = ["color: #f00", "color: #0f0", "color: #00f"];


	}

	attached() {
		window.addEventListener('resize', this.onWindowResize);
	}

	detached() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}

	onWindowResize() {
		this.width = window.innerWidth;
	}

	// recursively replace all string dates in the object with data objects
	replaceDates(obj) {
		for (var key in obj) {
			if (typeof(obj[key]) === "string") {
				var date = this.dateFormat.parse(obj[key]);
				if (date !== null) obj[key] = date;
			} else if (typeof(obj[key]) === "object" || typeof(obj[key]) === "array") {
				this.replaceDates(obj[key]);
			}
		}
	}


	// removeNulls(obj) {
	// 	for (var key in obj) {
	// 		if (typeof(obj[key]) === "array") {
	// 			for (var i in obj[key]) {
					
	// 			}
	// 			var date = this.dateFormat.parse(obj[key]);
	// 			if (date !== null) obj[key] = date;
	// 		} else if (typeof(obj[key]) === "object" || typeof(obj[key]) === "array") {
	// 			this.replaceDates(obj[key]);
	// 		}
	// 	}
	// }
}