import {inject, bindable} from 'aurelia-framework';
import d3 from 'd3'

@inject(Element)
export class DosagePlot {
	@bindable width;
	@bindable height;
	@bindable xaxis;

	constructor(element) {
		this.element = element;
		window.this7 = this;
		this.dosageTypes = [];
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

	  	this.updateLabels();
	}

	heightChanged() {
		//this.updateTicks();
		this.scaleUpdated();
	}

	xaxisChanged() {
		this.xaxis.register(this);
	}

	dataUpdated() {
		//this.updateTicks();
		this.scaleUpdated();
	}

	// updateTicks() {
	// 	this.ytickFormat = this.yscale.tickFormat(3, ".0");
	// 	this.ytickMarks = this.yscale.ticks(3).map(x => [
	// 		Math.floor(this.yscale(x)),
	// 		this.ytickFormat(x)
	// 	]);
	// 	this.ytickLines = this.ytickMarks.map(x => {
	// 		return "M20,"+x[0]+"V0H"+this.width;
	// 	});
	// }

	registerDosageType(dosageType) {
        dosageType.setYPos(this.height*this.dosageTypes.length + this.height/2);
		this.dosageTypes.push(dosageType);
		this.updateLabels();
	}

	// labelClick(index) {
	// 	this.series[index].toggleHidden();
	// 	this.updateLabels();
	// }

	updateLabels() {
		this.labels = this.dosageTypes.map(x => [
			x.label,
			x.color
		]);
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
		for (let dt of this.dosageTypes) dt.scaleUpdated(d3.event && d3.event.scale === this.lastScale);
		if (d3.event) this.lastScale = d3.event.scale;
	}
}
