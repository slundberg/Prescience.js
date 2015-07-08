import {inject} from 'aurelia-framework'
import $ from 'bootstrap'

@inject(Element)
export class DragWatchCustomAttribute {
	constructor(element) {
		this.element = element;

		this.mouseupListener = () => {
			window.removeEventListener('mousemove', this.callback);
			window.removeEventListener('mouseup', this.callback);
		}

		this.mousedownListener = () => {
			window.addEventListener('mousemove', this.callback);
			window.addEventListener('mouseup', this.mouseupListener);
		}
	}

	valueChanged(newValue) {
		this.callback = newValue;
	}

	attached() {
		this.element.addEventListener('mousedown', this.mousedownListener);
	}

	detached() {
		this.element.removeEventListener('mousedown', this.mousedownListener);
	}
}