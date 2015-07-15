import {inject, bindable} from 'aurelia-framework';
import d3 from 'd3'

@inject(Element)
export class EventsPlot {
	@bindable width;
	@bindable height;
	@bindable xaxis;
	@bindable data;

	constructor(element) {
		this.element = element;
	}

	bind() {
		this.xaxisChanged();
		this.heightChanged();
	}

	attached() {
		this.svg = d3.select(this.element).select("svg");
		this.zoomable = this.svg.select(".zoomable");
		this.svg.call(this.xaxis.zoom)
			.on("wheel.zoom",null)
	  		.on("mousewheel.zoom", null)
	  		.on("DOMMouseScroll.zoom", null);
			this.draw();
	}

	heightChanged() {
		this.scaleUpdated();
	}

	xaxisChanged() {
		this.xaxis.register(this);
	}

	dataChanged() {
		this.draw();
	}

	draw() {
		if (this.data === null) return;

        // Build the text labels
        this.labels = this.zoomable.selectAll("text").data(this.data);
		this.labels.enter()
			.append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("alignment-baseline", "middle")
            .attr("fill", "#000");
		this.labels.exit()
			.remove();
		this.labels.text(d => d[1]);

		this.scaleUpdated();
	}

	dragMove(e) {
		if (e.movementX !== 0) {
			this.xaxis.domain([
				this.xaxis.scale.invert(-e.movementX),
				this.xaxis.scale.invert(this.width-e.movementX)
			]);
		}
	}

	scaleUpdated() {
		if (this.labels) {
            this.labels.attr("transform", (d,i) => {
				return "translate(" + (this.xaxis.scale(d[0])) + "," + ((i%2===0 ? parseFloat(this.height) : 0) + Math.floor(this.height/2)+1) + ")"
			});
		}
	}
}
