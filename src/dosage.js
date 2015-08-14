import {inject, bindable, containerless} from 'aurelia-framework';
import d3 from 'd3'
import {DosagePlot} from "./dosage-plot"

@inject(Element,DosagePlot) // this injects the closest parent object of this type
@containerless
export class Dosage {
	@bindable data;
	@bindable label;
	@bindable color;

	constructor(element, dosagePlot) {
		this.element = element;
		this.symbol = "circle";
		this.dosagePlot = dosagePlot;
		this.dosagePlot.registerDosageType(this);
		this.color = "#1b71f1";
		this.data = [];
		this.xextent = d3.extent(this.data, d => d[0]);
        this.symbolScale = d3.scale.linear().range([0, 48]);
        this.symbolGenerator = d3.svg.symbol().size(36).type(this.symbol);
	}

	symbolChanged() {
		this.symbolGenerator = d3.svg.symbol().size(36).type(this.symbol);
		this.dosagePlot.updateLabels();
	}

	dataChanged() {
        //this.data = this.data.sort((a,b) => a[0] > b[0]);
        //console.log("this.data", this.data);
		this.draw();
	}

	labelChanged() {
		this.dosagePlot.updateLabels();
	}

	draw() {
		var data = this.hidden ? [] : this.data;

		this.xextent = d3.extent(data, d => d[0]);
        this.yextent = d3.extent(data, d => d[1]);
        this.symbolScale.domain([0, this.yextent[1]]);
        this.symbolGenerator.size(d => this.symbolScale(d === undefined ? 0 : d[1]))

		this.symbols = d3.select(this.group).selectAll("path").data(data);
		this.symbols.enter()
			.append("path")
		    //.attr("transform", d => "translate(" + this.dosagePlot.xaxis.scale(d[0]) + "," + this.ypos + ")")
		    .attr("d", this.symbolGenerator)
		    .attr("fill", this.color);
		this.symbols.exit()
			.remove();

        // Build the text labels
        this.labels = d3.select(this.group).selectAll("text").data(data);
		this.labels.enter()
			.append("text")
		    //.attr("transform", d => "translate(" + this.dosagePlot.xaxis.scale(d[0]) + "," + this.ypos + ")")
            //.text(d => d[1] + " " + d[2] + " a" + this.label)
            .attr("text-anchor", "start")
            .attr("font-size", "11px")
            .attr("alignment-baseline", "middle")
            .attr("fill", "#000")
            .attr("opacity", 0.7);
		this.labels.exit()
			.remove();

		this.scaleUpdated();
		this.dosagePlot.dataUpdated();
	}

	attached() {
		var el = $(this.element.previousElementSibling.childNodes).unwrap();
		this.group = el[1];
		this.draw();
	}

    setYPos(ypos) {
        this.ypos = ypos;
    }

	scaleUpdated(translateOnly) {
		if (this.symbols && this.labels) {
			var s = this.dosagePlot.xaxis.scale;

			// Mark regions of data label overlap
            if (!translateOnly) {
                for (var i = 0; i < this.data.length; ++i) {
                    this.data[i].labelOverlaps = i !== this.data.length-1 && s(this.data[i+1][0]) - s(this.data[i][0]) < 100;
                    if (i !== this.data.length-1) this.data[i].nextDist = s(this.data[i+1][0]) - s(this.data[i][0]);
                    this.data[i].overlapValueTotal = this.data[i][1];
                }
                for (var i = 0; i < this.data.length; ++i) {
                    // We are the first label overlap near us
                    if (this.data[i].labelOverlaps) {
                        if (i === 0 || !this.data[i-1].labelOverlaps) {
                            this.data[i].labelText = "(";
                        } else {
                            this.data[i].labelText = "";
                            this.data[i].overlapValueTotal += this.data[i-1].overlapValueTotal;
                        }
                    } else if (i !== 0 && this.data[i-1].labelOverlaps)  {
                        this.data[i].overlapValueTotal += this.data[i-1].overlapValueTotal;
                        this.data[i].labelText = ") "+(+this.data[i].overlapValueTotal.toFixed(4)) + " " + this.data[i][2] + " total" + " " + this.label;
                    } else {
                        this.data[i].labelText = (+this.data[i].overlapValueTotal.toFixed(4)) + " " + this.data[i][2] + " " + this.label;
                    }
                }

                this.labels.text(d => d.labelText);
            }

			this.symbols.attr("transform", d => "translate(" + s(d[0]) + "," + this.ypos + ")");
            this.labels
                .attr("transform", d => {
                    if (d.labelText === "(") {
                        return "translate(" + (s(d[0])-10) + "," + (this.ypos+1) + ")";
                    } else {
                        return "translate(" + (s(d[0])+7) + "," + (this.ypos+1) + ")";
                    }
                });
		}
	}
}
