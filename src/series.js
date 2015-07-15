import {inject, bindable, containerless} from 'aurelia-framework';
import d3 from 'd3'
import {SeriesPlot} from "./series-plot"

@inject(Element,SeriesPlot) // this injects the closest parent object of this type
@containerless
export class Series {
	@bindable data;
	@bindable label;
	@bindable symbol;
	@bindable color;

	constructor(element, seriesPlot) {
		this.element = element;
		this.symbol = "circle";
		this.hidden = false;
		this.seriesPlot = seriesPlot;
		this.seriesPlot.registerSeries(this);
		this.color = "#1b71f1";
		this.data = [];
		this.xextent = d3.extent(this.data, d => d[0]);
		this.yextent = d3.extent(this.data, d => d[1]);
		this.symbolScale = d3.scale.linear().range([0, 48]);
		this.symbolChanged();
		this.pathFunc = d3.svg.line()
            .x(d => this.seriesPlot.xaxis.scale(d[0]))
            .y(d => this.seriesPlot.yscale(d[1]))
            .interpolate("linear");
	}

	symbolChanged() {
		this.symbolGenerator = d3.svg.symbol().size(26).type(this.symbol); // size 36
		this.seriesPlot.updateLabels();
	}

	dataChanged() {
		this.draw();
	}

	labelChanged() {
		this.seriesPlot.updateLabels();
	}

	draw() {
		//this.data = this.data.filter(d => d[0] <= this.seriesPlot.now)
		var data = this.hidden ? [] : this.data;

		this.xextent = d3.extent(data, d => d[0]);
		this.yextent = d3.extent(data, d => d[1]);

		this.path = d3.select(this.group).select("path")
            .attr("stroke", this.color)
			.attr("fill", "none")
			.attr("stroke-width", 1)
			//.attr("stroke-dasharray", "2,5,5,5")
            .attr("opacity", 0.4);

		this.symbolScale.domain(this.yextent);
		//this.symbolGenerator.size(d => this.symbolScale(d === undefined ? 0 : d[1]))
		this.symbols = d3.select(this.group).selectAll(".symbol").data(data);
		this.symbols.enter()
			.append("path")
			.attr("class", "symbol")
		    .attr("transform", d => "translate(" + this.seriesPlot.xaxis.scale(d[0]) + "," + this.seriesPlot.yscale(d[1]) + ")")
		    .attr("d", this.symbolGenerator)
		  	.attr("fill", this.color);
		this.symbols.exit()
			.remove();
		this.scaleUpdated();
		this.seriesPlot.dataUpdated();
	}

	attached() {
		var el = $(this.element.previousElementSibling.childNodes).unwrap();
		this.group = el[1];
		this.draw();
	}

	toggleHidden() {
		console.log("toggleHidden")
		this.hidden = !this.hidden;
		this.draw();
	}

	scaleUpdated() {
		if (this.symbols && !this.hidden) {
			this.path.attr("d", this.pathFunc(this.data));
			this.symbols
				.attr("transform", d => "translate(" + this.seriesPlot.xaxis.scale(d[0]) + "," + this.seriesPlot.yscale(d[1]) + ")");
		}
	}
}
