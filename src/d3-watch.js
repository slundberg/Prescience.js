import {ObjectObservationAdapter} from 'aurelia-binding';

export function configure(aurelia) {

  // provide aurelia with a way to observe breeze properties.
  aurelia.withInstance(ObjectObservationAdapter, new D3WatchObservationAdapter());
}

export class D3WatchObservationAdapter {
	handlesProperty(object, propertyName) {
		console.log("can watch?", object, propertyName);
		// var type = object.entityType
		// return type ? !!(type.__canObserve__ || createCanObserveLookup(type))[propertyName] : false;
		return false;
	}

	getObserver(object, propertyName) {
		// var observerLookup;

		// if (!this.handlesProperty(object, propertyName))
		// 	throw new Error(`BreezeBindingAdapter does not support observing the ${propertyName} property.  Check the handlesProperty method before calling createObserver.`);

		// observerLookup = object.__breezeObserver__ || createObserverLookup(object);
		// return observerLookup.getObserver(propertyName);
	}
}