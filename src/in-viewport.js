import {inject, customAttribute, bindingMode} from 'aurelia-framework'
import $ from 'bootstrap'

@customAttribute('in-viewport', bindingMode.twoWay)
@inject(Element)
export class InViewport {
	constructor(element) {
		this.element = element;
        this.value = false;

        $(window).on('DOMContentLoaded load resize scroll', () => {
			var rect = this.element.getBoundingClientRect();

		    if (
		        rect.top >= 0 &&
		        rect.left >= 0 &&
		        rect.bottom <= $(window).height() &&
		        rect.right <= $(window).width()
		    ) {
                this.value = true;
			} else {
                this.value = false;
            }
		});
	}
}
