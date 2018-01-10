import $ from 'jquery';
import prefs from './preferences';
import * as storage from './storage';
import errorHandler from './error-handler';

class Forecast {
	constructor() {
		this.data = null;

		this.main = {
			temp: $('.ame-main-temp'),
			icon: $('.main-icon'),
			location: $('.preferences .location'),
			info: $('.ame-main-info'),
			time: $('.main-forecast .update'),
		};

		this.hourly = {
			temp: $('.hour-panel .data-column .temprature'),
			icon: $('.hour-panel .data-column img'),
			time: $('.hour-panel .data-column .time'),
		};

		this.daily = {
			temp: {
				min: $('.day-panel .data-column .min-temp'),
				max: $('.day-panel .data-column .max-temp')
			},
			icon: $('.day-panel .data-column img'),
			time: $('.day-panel .data-column .time'),
		};
	}

	static update() {
		const unit = prefs.current.unit;
		/* update main forecast */
		let forecast = this.data.main; // set forecast to main forecast data
		let panel = this.main; // panel to be updated = main forecast panel

		panel.temp.text(forecast.temp[unit]); // update temprature
		panel.icon.attr('src', 'img/icons/' + forecast.icon + '.svg'); // update icon
		panel.location.text('Location: ' + forecast.location); // update location
		panel.info.text(forecast.info); // update description


		/* update hourly forecast */
		forecast = this.data.hourly;
		panel = this.hourly;

		panel.temp.each(function (i, column) { // i = index, column = data column to be edited
			$(column).text(forecast[i].temp[unit]);
		});
		panel.icon.each(function (i, column) {
			$(column).attr('src', 'img/icons/' + forecast[i].icon + '.svg');
		});
		panel.time.each(function (i, column) {
			$(column).text(forecast[i].time);
		});


		/* update daily forecast */
		forecast = this.data.daily;
		panel = this.daily;

		$.each(panel.temp, function (key, val) { // key = maximun or minimum temprature of the day
			val.each(function (i, column) {
				let t = forecast[i].temp[key][unit];
				$(column).text(t);
			});
		});
		panel.icon.each(function (i, column) {
			$(column).attr('src', 'img/icons/' + forecast[i].icon + '.svg');
		});
		panel.time.each(function (i, column) {
			$(column).text(forecast[i].time);
		});
	}

	static save() {
		const forecast = JSON.stringify(this.data);
		storage.save('forecast', forecast);
	}

	static load() {
		let forecast = storage.load('forecast');
		if (forecast) {
			forecast = JSON.parse(forecast);
			this.data = forecast;
			console.log('successfully loaded forecast from localStorage');
			return true;
		}
		else {
			errorHandler('forecast wasn\'t loaded from localStorage');
			return false;
		}
	}
}

const forecast = new Forecast();

export default forecast;