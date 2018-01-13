import $ from 'jquery';
import errorHandler from './error-handler';
import * as storage from './storage';
import forecast from './forecast';
import note from './notification';

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

	save() {
		const currentPrefs = JSON.stringify(this.current);
		storage.save('prefs', currentPrefs);
	}

	switchUnits() {
		if (this.current.unit === 'c') {
			this.current.unit = 'f';
		}
		else if (this.current.unit === 'f') {
			this.current.unit = 'c';
		}

		this.updateUnit();

		// update temprature units
		const unit = this.current.unit;
		forecast.main.temp.text(forecast.data.main.temp[unit]);
		forecast.hourly.temp.each(function (i, column) {
			$(column).text(forecast.data.hourly[i].temp[unit]);
		});
		$.each(forecast.daily.temp, function (key, val) {
			val.each(function (i, column) {
				let t = forecast.data.daily[i].temp[key][unit];
				$(column).text(t);
			});
		});
	}

	updateLocation(id) {
		this.current.location = id;
		this.save();
	}

	updateUnit() {
		this.unitElement.text(`Unit: \u00b0${this.current.unit}`);
		this.save();
		note.send(`<strong>changed default unit to &deg;${this.current.unit}</strong><br>prefereces saved`);
	}
}

const prefs = new Preferences();

export default prefs;