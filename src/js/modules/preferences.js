import $ from 'jquery';
import errorHandler from './error-handler';
import * as storage from './storage';

class Preferences {
	constructor() {
		this.current = {
			unit: 'c',
			location: undefined
		};
		this.unitElement = $('.option.unit');
		this.locationElement = $('.option.location');
	}

	static load() {
		let localPrefs = storage.load('prefs');
		if (localPrefs) {
			localPrefs = JSON.parse(localPrefs);
			Object.assign(this.current, localPrefs);
			console.log('successfully loaded preferences from localstorage');
			return true;
		}
		else {
			errorHandler('prefs were not loaded from localStorage');
			return false;
		}
	}

	static save() {
		const currentPrefs = JSON.stringify(this.current);
		storage.save('prefs', currentPrefs);
	}

	static switchUnits() {
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