import {inject, dynamicOptions} from 'aurelia-framework';
import d3 from 'd3'
import $ from 'bootstrap'


@inject(Element)
@dynamicOptions
export class TimeSeries {
	// @bindable width;
	// @bindable height;
	// @bindable xaxis;
	// @bindable data;

	constructor(element) {
		this.element = element;
		//this.data = [1,2,3,4,5];
		//var baseDate = new Date(2015, 5, 2, 0, 0, 0, 0);
		this.data = [];
		// for (let i = 0; i < 10; i++) {
		// 	this.data.push({'x': d3.time.minute.offset(baseDate, i),  'y': Math.random() });
		// }
		
				  
		
			
		this.yscale = d3.scale.linear();
		this.ytickFormat = this.yscale.tickFormat();


		// and a function to produce line data points from these scales
		// this.line = d3.svg.line()
		//   .x(d => this.xscale(d.x))
		//   .y(d => this.yscale(d.y));
	}

	dynamicPropertyChanged(name, newValue) {
		console.log("here2", newValue, this);
		// if (name === "data") {
		// 	this.data = newValue;
		// 	if (this.xaxis) {
		// 		this.xaxis.domain(d3.extent(this.data, d => d[0]));
		// 	}
		// 	this.yscale.range([this.height, 0]).domain(d3.extent(this.data, d => d[1]));
		// 	this.ytickMarks = this.yscale.ticks(2);
		// } else if (name === "xaxis") {
		// 	this.xaxis.register(this);
		// 	this.xaxis.domain(d3.extent(this.data, d => d[0]));
		// }
	}

	// xaxisChanged() {
	// 	this.xaxis.register(this);
	// 	this.xaxis.domain(d3.extent(this.data, d => d[0]));
	// 	console.log(d3.extent(this.data, d => d[0]));
	// }

	// // implementing this causes all the initial binding to happen once after everything is bound
	// bind(context) {
	// 	console.log("here1", context, this);
	// 	//this = context;
	// 	this.dynamicPropertyChanged("data");
	// 	this.dynamicPropertyChanged("xaxis");
	// }

	dragMove(e) {
		if (e.movementX !== 0) {
			this.xaxis.domain([
				this.xaxis.scale.invert(-e.movementX),
				this.xaxis.scale.invert(this.width-e.movementX)
			]);
		}
	}

	// This does all the d3 drawing, I wish we could just databind in aurelia but it seems to slow right now.
	scaleUpdated() {
		this.pointCoords = this.data.map(d=>[this.xaxis.scale(d[0]), this.yscale(d[1])]);
	}

	

	// attached() {
	// 	this.xaxis.register(this);
	// 	this.xaxis.domain(d3.extent(this.data, d => d[0]));
		
		

	// 	console.log("this.data", this.data)
	// }
}