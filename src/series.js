import {inject, bindable, containerless} from 'aurelia-framework';
import d3 from 'd3'
import {SeriesPlot} from "./series-plot"
import $ from 'bootstrap'
import _ from 'lodash'

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
		// this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
		// this.element.parentNode.insertBefore(this.group, this.element);
		//console.log(svgRoot);
		//this.element.parentNode.insertBefore(this.group, this.element);

		
		

		// console.log("element", this.element.parentNode);
		// console.log("this.element.childNodes", this.element.childNodes)
		// _.map(this.element.childNodes, c => {
		// 	if (c.nodeName === "SVG") {
		// 		console.log("SVG", c);
		// 	} else console.log("other", c);
		// });
		// var svg = d3.select(this.element).select("svg");
		// //var svg = $(this.element).children("svg");

		//this.d3group = d3.select(this.group);

		
		
		// console.log("svg", svg);
		//console.log("svg.children()", svg.children())

		//$(this.element).append(svg.children());
		//svg.remove();
		this.seriesPlot = seriesPlot;
		this.seriesPlot.registerSeries(this);
		this.color = "#1b71f1";
		this.data = [];
		this.xextent = d3.extent(this.data, d => d[0]);
		this.yextent = d3.extent(this.data, d => d[1]);
		this.pointCoords = [];
		this.testData = 1;

	}

	symbolChanged() {
		this.symbolGenerator = d3.svg.symbol().size(36).type(this.symbol);
	}

	dataChanged() {
		this.draw();
	}

	draw() {
		var data = this.hidden ? [] : this.data;

		this.xextent = d3.extent(data, d => d[0]);
		this.yextent = d3.extent(data, d => d[1]);

		this.symbols = d3.select(this.group).selectAll("path").data(data);
		this.symbols.enter()
			.append("path")
		    .attr("transform", d => {return "translate(" + this.seriesPlot.xaxis.scale(d[0]) + "," + this.seriesPlot.yscale(d[1]) + ")"})
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
		
		// draw the data
		this.draw();

		// this.group = document.createElement("g");
		// //this.element.parentNode.insertBefore();
		// this.element.parentNode.insertBefore(this.group, this.element);

		// console.log("this.element.childNodes2", this.element.childNodes);
		// console.log($(this.element).children("svg"))
		// console.log($(this.element).children("svg").children())
		//$(this.element).children("svg").children().insertAfter(this.element);
		//$(this.element).append($(this.element).children("svg").children());
	}

	toggleHidden() {
		console.log("toggleHidden")
		this.hidden = !this.hidden;
		this.draw();
	}

	scaleUpdated() {
		
		//this.pointCoords = this.data.map(d=>[this.seriesPlot.xaxis.scale(d[0]), this.seriesPlot.yscale(d[1])]);
		//console.log("scaleUpdated", this.data, this.pointCoords);
		if (this.symbols && !this.hidden) {
			window.xaxis3 = this.seriesPlot.xaxis;
			this.symbols
				.attr("transform", d => {console.log(d[0], this.seriesPlot.xaxis.scale(d[0])); return "translate(" + this.seriesPlot.xaxis.scale(d[0]) + "," + this.seriesPlot.yscale(d[1]) + ")"});
				// .attr("cx", d => this.seriesPlot.xaxis.scale(d[0]))
			 //  	.attr("cy", d => this.seriesPlot.yscale(d[1]));
		}
	}
}