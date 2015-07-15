import {inject} from 'aurelia-framework'
import $ from 'bootstrap'

@inject(Element)
export class FadeOutIfCustomAttribute {
	constructor(element) {
		this.element = element;
		this.prevDisplay = $(this.element).css("display");
		console.log("ASDAsdSADASDF")

	}

	valueChanged(newValue) {
		console.log("new value in fade-out-if", newValue)
		if (newValue) {
			$(this.element).css("display", this.prevDisplay);
		} else {
			$(this.element).css("display", "none");
		}
	}

	bind() {
		if (!this.value) $(this.element).css("display", "none");
	}

	attached() {
	}

	detached() {
		//this.element.removeEventListener('mousedown', this.mousedownListener);
	}
}
