import {inject, bindable} from 'aurelia-framework';
import d3 from 'd3'

@inject(Element)
export class SeriesPlot {
	@bindable width;
	@bindable height;
	@bindable xaxis;
	@bindable ylabel;
	@bindable yunits;
	@bindable color;

	constructor(element) {
		this.element = element;
		window.this6 = this;
		this.series = [];
		this.yscale = d3.scale.linear();
	}

	bind() {
		this.xaxisChanged();
		this.heightChanged();
	}

	attached() {
		this.svg = d3.select(this.element).select("svg");
		this.zoomable = this.svg.select(".zoomable");
		var test = () => this.zoomUpdated();
		this.svg.call(this.xaxis.zoom)
			.on("wheel.zoom",null)
	  		.on("mousewheel.zoom", null)
	  		.on("DOMMouseScroll.zoom", null);

	  	this.updateLabels();
	}

	heightChanged() {
		this.yscale.range([this.height-10, 10]);
		this.updateTicks();
		this.scaleUpdated();
	}

	xaxisChanged() {
		this.xaxis.register(this);
	}

	// nowChanged() {
	// 	console.log("now", this.now)
	// 	this.dataUpdated();
	// }

	dataUpdated() {
		this.yscale.domain(d3.extent(d3.merge(this.series.map(s => s.yextent))));
		this.updateTicks();
		this.scaleUpdated();
	}

	updateTicks() {
		this.ytickFormat = this.yscale.tickFormat(3, ".0");
		this.ytickMarks = this.yscale.ticks(3).map(x => [
			Math.floor(this.yscale(x)),
			(+parseFloat(this.ytickFormat(x)).toFixed(4))
		]);
		this.ytickLines = this.ytickMarks.map(x => {
			return "M20,"+x[0]+"V0H"+this.width;
		});
	}

	registerSeries(series) {
		this.series.push(series);
		this.updateLabels();
	}

	labelClick(index) {
		this.series[index].toggleHidden();
		this.updateLabels();
	}

	updateLabels() {
		this.labels = this.series.map(x => [
			x.label, x.symbolGenerator ? x.symbolGenerator() : "",
			x.hidden,
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
		if (this.zoomable && d3.event) {
			if (d3.event.scale === this.lastScale) {
				this.zoomable.attr("transform", d => "translate(" + (d3.event.translate[0]-this.lastTranslate) + ")");
			} else {
				this.lastTranslate = d3.event.translate[0];
				this.lastScale = d3.event.scale;
				this.zoomable.attr("transform", d => "translate(0)");
				for (let s of this.series) s.scaleUpdated();
			}
		}
	}

	buildColorSet(numColors) {

        var colors = [d3.rgb(27, 113, 241), d3.rgb(83, 191, 15), d3.rgb(219, 139, 0), d3.rgb(204, 24, 24), d3.rgb(161, 117, 191)];
        if (numColors === 1) return [colors[0].toString()];

        // Create a polylinear color scale that interpolates between all the given colors when we run out
        var numUniqueColors = Math.min(numColors, colors.length);

        // This fits all the type indexes into the possibly smaller color indexes
        var q = d3.scale.quantize().domain(_.range(numColors)).range(_.range(numUniqueColors-1));
        var tmp = _.map(_.range(numColors), q);

        // Now we see how many of each type index fell in between each color
        var backMap = _.map(_.range(numUniqueColors-1), d => tmp.indexOf(d));
        backMap.push(numColors-1);

        // Build the poly linear scale
        var color = d3.scale.linear()
            .domain(backMap)
            .range(colors)
            .interpolate(d3.interpolateHcl);

        return _.map(_.range(numColors), color);
    };
}
