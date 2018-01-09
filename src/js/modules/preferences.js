import $ from 'jquery';
import errorHandler from './error-handler';

class Preferences {
	constructor() {
		this.current = {
			unit: 'c',
			location: undefined
		};
		this.unitElement = $('.option.unit');
		this.locationElement = $('.option.location');
	}

	load() {
		if (window.localStorage) {
			try {
				let prefs = localStorage.loadItem('options');
				prefs = JSON.parse(prefs);
				Object.assign(this.current, prefs);
				console.log('successfully loaded preferences from localstorage');
				return true;
			}
			catch (e) {
				errorHandler(e);
				return false;
			}
		}
		else {
			// errorHandler('localStorage not supported');
			return false;
		}
	}

	switchUnits() {
		if (this.current.unit === 'c') {
			this.current.unit = 'f';
		}
		else if (this.current.unit === 'f') {
			this.current.unit === 'c';
		}
	}
}

const prefs = new Preferences();

export default prefs;