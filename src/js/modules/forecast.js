import $ from 'jquery';
import prefs from './preferences';
import * as storage from './storage';
import errorHandler from './error-handler';
import view from './view';

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

	get(location, noGeo) {
		if (noGeo === undefined) { /* location is a geolocation object */
			const lat = location.coords.latitude;
			const lon = location.coords.longitude;
			location = {
				loc: JSON.stringify({ lat, lon })
			};
		}
		else if (noGeo === true) {
			const id = location;
			location = {
				loc: JSON.stringify({ id })
			};
		}

		$.ajax({
			url: '/api',
			method: 'POST',
			data: location,
			success: (res, textStatus) => {
				if (textStatus === 'success') {
					forecast.data = res; // save response to forecast
					forecast.update(); // update forecast panels
					view.switch(); // switch to forecast view

					prefs.updateLocation(res.id); // update location id and save locally
					forecast.save(); // save new forecast data locally
					storage.save('lastCall', Date.now());	// update lastCall
				}
				else {
					errorHandler('server responded with an error', true);
				}
			},
			error: (jqxhr, textStatus, error) => {
				const err = textStatus + ', ' + error;
				errorHandler(`Request Failed: ${err}`, true);
			}
		});
	}

	update() {
		const unit = prefs.current.unit;
		/* update main forecast */
		let forecastData = this.data.main; // set forecast to main forecast data
		let panel = this.main; // panel to be updated = main forecast panel

		panel.temp.text(forecastData.temp[unit]); // update temprature
		panel.icon.attr('src', 'img/icons/' + forecastData.icon + '.svg'); // update icon
		panel.location.text('Location: ' + forecastData.location); // update location
		panel.info.text(forecastData.info); // update description


		/* update hourly forecast */
		forecastData = this.data.hourly;
		panel = this.hourly;

		panel.temp.each(function (i, column) { // i = index, column = data column to be edited
			$(column).text(forecastData[i].temp[unit]);
		});
		panel.icon.each(function (i, column) {
			$(column).attr('src', 'img/icons/' + forecastData[i].icon + '.svg');
		});
		panel.time.each(function (i, column) {
			$(column).text(forecastData[i].time);
		});


		/* update daily forecast */
		forecastData = this.data.daily;
		panel = this.daily;

		$.each(panel.temp, function (key, val) { // key = maximun or minimum temprature of the day
			val.each(function (i, column) {
				let t = forecastData[i].temp[key][unit];
				$(column).text(t);
			});
		});
		panel.icon.each(function (i, column) {
			$(column).attr('src', 'img/icons/' + forecastData[i].icon + '.svg');
		});
		panel.time.each(function (i, column) {
			$(column).text(forecastData[i].time);
		});
	}

	save() {
		const forecastData = JSON.stringify(this.data);
		storage.save('forecast', forecastData);
	}

	load() {
		let forecastData = storage.load('forecast');
		if (forecastData) {
			forecastData = JSON.parse(forecastData);
			this.data = forecastData;
			console.log('successfully loaded forecast from localStorage');
			return true;
		}
		else {
			errorHandler('forecast wasn\'t loaded from localStorage');
			return false;
		}
	}

	geo(event) {
		event.preventDefault();
		console.log('forecast.geo called');

		if (navigator.geolocation) {
			console.log('geolocation supported');

			const locationError = error => {
				const errorMessege = {
					0: 'user denied permision, please allow app to access your location or enter your location manually.',
					1: 'location is unavailable, make sure you\'re connected to the internet. if the problem presists, enter your location manually or try again later.',
					2: 'browser is taking too long to respond, please enter your location manually or try again later.'
				};
				errorHandler(`error: ${errorMessege[error.code]}`, true);
			};

			const locationOptions = {
				enableHighAccuracy: true,
				timeout: 30000,
				maximumAge: 0
			};

			navigator.geolocation.getCurrentPosition(forecast.get, locationError, locationOptions);
		}
		else {
			errorHandler('geolocation not supported');
		}
	}
}

const forecast = new Forecast();

export default forecast;