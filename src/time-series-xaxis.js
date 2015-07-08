import {bindable} from 'aurelia-framework';

export class TimeSeriesXaxis {
	@bindable width;
	@bindable height;

	constructor() {
		this.scale = d3.time.scale();
		this.tickFormat = this.scale.tickFormat(2); // we use the default tick format
		this.registeredPlots = [];
	}

	attached() {
		this.scale.range([0, this.width]);
		this.scaleUpdated(); // our scale changed
	}

	// allow plots to register themselves to be called
	register(plot) {
		this.registeredPlots.push(plot);
	}

	scaleUpdated() {
		this.tickMarks = this.scale.ticks(2);
		
		// All attached plots need to know
		for (let i = 0; i < this.registeredPlots.length; ++i) {
			this.registeredPlots[i].scaleUpdated();
		}
	}

	domain(newDomain) {
		this.scale.domain(newDomain);
		this.scaleUpdated();
	}
}