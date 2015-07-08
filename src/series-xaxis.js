import {inject, bindable} from 'aurelia-framework';

@inject(Element)
export class SeriesXaxis {
	@bindable width;
	@bindable height;

	constructor(element) {
		this.element = element;
		this.scale = d3.time.scale();
		this.registeredPlots = [];
		window.this_xaxis = this;
		this.zoom = d3.behavior.zoom().on("zoom", () => this.scaleUpdated());
	}

	attached() {
		this.svg = d3.select(this.element).select("svg");

		this.scaleUpdated();
	}

	widthChanged() {
		this.scale.range([0, this.width]);
		this.zoom.x(this.scale);
		this.scaleUpdated();
	}

	// allow plots to register themselves to be called
	register(plot) {
		this.registeredPlots.push(plot);
	}

	zoomUpdated() {
		// All attached plots need to know
		for (let i = 0; i < this.registeredPlots.length; ++i) {
			this.registeredPlots[i].zoomUpdated(d3.event.translate[0], d3.event.scale);
		}
	}

	scaleUpdated() {
		if (this.svg === undefined) return; // make sure we have been attached

		// draw with D3 (I would like to make this a reat.for but that is to slow right now in Aurelia)
		var numTicks = Math.floor(this.width/200);
		this.tickFormat = this.scale.tickFormat(numTicks); // we use the default tick format
		var ticks = this.svg.selectAll("text").data(this.scale.ticks());
		ticks.enter()
		  	.append("svg:text")
		  	.attr("text-anchor", "middle");
		ticks.exit()
			.remove();
		ticks
			.attr("x", this.scale)
		  	.attr("y", this.height)
		  	.text(this.tickFormat);
		
		// All attached plots need to know
		for (let i = 0; i < this.registeredPlots.length; ++i) {
			this.registeredPlots[i].scaleUpdated();
		}
	}

	domain(newDomain) {
		this.scale.domain(newDomain);
		this.zoom.x(this.scale);
		this.scaleUpdated();
	}
}