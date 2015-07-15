import {inject, bindable, containerless} from 'aurelia-framework';
import d3 from 'd3'
import {BarAreaPlot} from "./bar-area-plot"

@inject(Element,BarAreaPlot) // this injects the closest parent object of this type
@containerless
export class BarArea {
	@bindable data;
	@bindable label;
	@bindable color;

	constructor(element, barAreaPlot) {
		this.element = element;
		this.symbol = "circle";
		this.barAreaPlot = barAreaPlot;
		this.barAreaPlot.registerTrack(this);
		this.color = "#1b71f1";
		this.data = [];
		this.xextent = d3.extent(this.data, d => d[0]);
        this.yscale = d3.scale.linear().range([0, this.height]);
        this.symbolGenerator = d3.svg.symbol().size(36).type(this.symbol);
        this.pathFunc = d3.svg.line()
            .x(d => this.barAreaPlot.xaxis.scale(d[0]))
            .y(d => this.ypos-this.yscale(d[1]))
            .interpolate("linear");
	}

	symbolChanged() {
		this.symbolGenerator = d3.svg.symbol().size(36).type(this.symbol);
		this.barAreaPlot.updateLabels();
	}

	dataChanged() {
        var yextent = d3.extent(this.data, d => d[1]);
        this.yscale.domain(yextent);
        this.paddedData = [[this.data[0][0], yextent[0]]];
        Array.prototype.push.apply(this.paddedData,this.data);
        this.paddedData.push([this.data[this.data.length-1][0], yextent[0]]);
        //this.data = this.data.sort((a,b) => a[0] > b[0]);
        console.log("this.paddedData", this.paddedData);
		this.draw();
	}

    heightChanged() {
        //this.yscale.range([0, this.height]);
    }

	labelChanged() {
		this.barAreaPlot.updateLabels();
	}

	draw() {

        //this.symbolGenerator.size(d => this.symbolScale(d === undefined ? 0 : d[1]))
        this.path = d3.select(this.group)
            .append("path")
            .attr("fill", this.color)
            .attr("opacity", 1.0);

		this.bars = d3.select(this.group).selectAll("line").data(this.data);
		// this.bars.enter()
		// 	.append("circle")
		//     //.attr("transform", d => "translate(" + this.barAreaPlot.xaxis.scale(d[0]) + "," + this.ypos + ")")
		//     //.attr("d", this.symbolGenerator)
		//     .attr("fill", this.color)
        //     //.attr("stroke-width", 1)
        //     .attr("r", 2)
        //     .attr("cy", d => this.ypos-this.yscale(d[1]));

        // this.bars.enter()
		// 	.append("line")
		//     //.attr("transform", d => "translate(" + this.barAreaPlot.xaxis.scale(d[0]) + "," + this.ypos + ")")
		//     //.attr("d", this.symbolGenerator)
		//     .attr("stroke", this.color)
        //     .attr("stroke-width", 1)
        //     .attr("y1", this.ypos)
        //     .attr("y2", d => { console.log(this.ypos, this.yscale(d[1])); return this.ypos-this.yscale(d[1])});
        console.log("this.ypos", this.ypos)
        window.scale22 = this.yscale;
		this.bars.exit()
			.remove();



        // Build the text labels
        // this.labels = d3.select(this.group).selectAll("text").data(this.data);
		// this.labels.enter()
		// 	.append("text")
		//     //.attr("transform", d => "translate(" + this.barAreaPlot.xaxis.scale(d[0]) + "," + this.ypos + ")")
        //     .text(d => d[1] + " " + d[2])
        //     .attr("text-anchor", "start")
        //     .attr("font-size", "11px")
        //     .attr("alignment-baseline", "middle")
        //     .attr("fill", "#000")
        //     .attr("opacity", 0.7);
		// this.labels.exit()
		// 	.remove();

		this.scaleUpdated();
		this.barAreaPlot.dataUpdated();
	}

	attached() {
		var el = $(this.element.previousElementSibling.childNodes).unwrap();
		this.group = el[1];
		this.draw();
	}

    setYPos(ypos) {
        this.ypos = ypos;
    }

    setHeight(height) {
        this.height = height;
    }

	scaleUpdated(translateOnly) {
		if (this.bars && this.path) {
            var s = this.barAreaPlot.xaxis.scale;
			//this.bars.attr("x1", d => s(d[0]));
            this.bars.attr("cx", d => s(d[0]));

            this.path.attr("d", this.pathFunc(this.paddedData) + "Z");
            // this.labels
            //     .attr("transform", d => {
            //         if (d.labelText === "(") {
            //             return "translate(" + (s(d[0])-10) + "," + (this.ypos+1) + ")";
            //         } else {
            //             return "translate(" + (s(d[0])+7) + "," + (this.ypos+1) + ")";
            //         }
            //     });
		}
	}
}
