import {inject} from 'aurelia-framework'
import $ from 'bootstrap'

@inject(Element)
export class ScrollShadowCustomAttribute {
	constructor(element) {
		this.element = element;

        $(window).scroll(() => {
            var y = $(window).scrollTop();
            $(this.element).css({'box-shadow': "0 4px 4px rgba(0, 0, 0, "+Math.min(y/40, 0.1)+")"});
            // if (y > 0) {
            //     $(this.element).css({'display':'block', 'opacity':y/20});
            // } else {
            //     $(this.element).css({'display':'block', 'opacity':y/20});
            // }
        });

		// this.mouseupListener = () => {
		// 	window.removeEventListener('mousemove', this.callback);
		// 	window.removeEventListener('mouseup', this.callback);
		// }
        //
		// this.mousedownListener = () => {
		// 	window.addEventListener('mousemove', this.callback);
		// 	window.addEventListener('mouseup', this.mouseupListener);
		// }
	}

	valueChanged(newValue) {
		//this.callback = newValue;
	}

	attached() {
		//this.element.addEventListener('mousedown', this.mousedownListener);
	}

	detached() {
		//this.element.removeEventListener('mousedown', this.mousedownListener);
	}
}
