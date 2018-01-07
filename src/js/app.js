'use strict';
import '../css/styles.less';
import $ from 'jquery';
import Raven from 'raven-js';
Raven.config('https://d581b40eda8a444a928b39d898380a05@sentry.io/212857').install();
import errorHandler from './modules/error-handler';

(function(){
/* main object containing app state */
let _ame = {
	options: {
		'unit': 'C',
		'loc': undefined
	},
	forecast: null,
	el: {
		main: {
			temp: $('.ame-main-temp'),
			icon: $('.main-icon'),
			location: $('.preferences .location'),
			info: $('.ame-main-info'),
			time: $('.main-forecast .update'),
		},
		hour: {
			'temp': $('.hour-panel .data-column .temprature'),
			'icon': $('.hour-panel .data-column img'),
			'time': $('.hour-panel .data-column .time'),
		},
		day: {
			'temp': {
				'min': $('.day-panel .data-column .min-temp'),
				'max': $('.day-panel .data-column .max-temp')
			},
			'icon': $('.day-panel .data-column img'),
			'time': $('.day-panel .data-column .time'),
		},
		update: () => {
			/* update main forecast */
			let forecast = _ame.forecast.main; // set forecast to main forecast data
			let panel = _ame.el.main; // panel to be updated = main forecast panel

			panel.temp.text(forecast.temp); // update temprature
			panel.icon.attr('src', 'img/icons/' + forecast.icon + '.svg'); // update icon
			panel.location.text('Location: ' + forecast.location); // update location
			panel.info.text(forecast.info); // update description
			//_ame.el.options.updateUnit();


			/* update hourly forecast */
			forecast = _ame.forecast.hourly;
			panel = _ame.el.hour;

			panel.temp.each(function (i, column) { // i = index, column = data column to be edited
				$(column).text(forecast[i].temp);
			});
			panel.icon.each(function (i, column) {
				$(column).attr('src', 'img/icons/' + forecast[i].icon + '.svg');
			});
			panel.time.each(function (i, column) {
				$(column).text(forecast[i].time);
			});


			/* update daily forecast */
			forecast = _ame.forecast.daily;
			panel = _ame.el.day;

			$.each(panel.temp, function (key, val) { // key = maximun or minimum temprature of the day
				val.each(function (i, column) {
					let t = forecast[i].temp[key];
					$(column).text(t);
					});
				});
			panel.icon.each(function (i, column) {
				$(column).attr('src', 'img/icons/' + forecast[i].icon + '.svg');
				});
			panel.time.each(function (i, column) {
				$(column).text(forecast[i].time);
				});
		},
		note: {
			main: $('.ame-note'),
			text: $('.ame-note-txt'),
			timeoutId: 0
		},
		options: {
			unit: $('.option.unit'),
			updateUnit: function _ameUpdateUnit() {
				_ame.el.options.unit.text('Unit: \u00b0' + _ame.options.unit);
			},
			location: $('.option.location')
		}
	},
	formatTemp: function(t) {
		return t + '\u00b0' + this.options.unit;
	},
	updateTemp: function() {
		this.el.main.temp.text(this.formatTemp(this.data.main.temp));
		_ame.updateOptions(); /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< here */
		this.el.hour.temp.each(function(i, el) {
			let t = _ame.data.hour[i].temp;
			$(el).text(_ame.formatTemp(t));
		});
		$.each(this.el.day.temp, function(key, val) {
			val.each(function(i, el) {
				let t = _ame.data.day[i].temp[key];
				$(el).text(_ame.formatTemp(t));
			});
		});
	},
	setTemp: function _ameSetTemp(t) {
		t = t - 273;
		return _ame.options.unit === 'C' ? Math.round(t) : _ame.toFahrenheit(t);
	},
	toCelsius: function _ameToCelsius(f) {
		return Math.round((5/9) * (f - 32));
	},
	toFahrenheit: function _ameToFahrenheit(c) {
		return Math.round((9/5) * c + 32);
	},
	toggleTemp: function _ameToggleTemp() {
		console.log('toggleTemp called');
		let u = 'fahrenheit';

		if (this.options.unit === 'C') {
			console.log('converting from celsius to fahrenheit');
			this.options.unit = 'F';
			this.el.main.temp.attr('data-label', 'switch to celsuis');
			this.data.main.temp = _ame.toFahrenheit(this.data.main.temp);
			$.each(this.data.hour, function(i, val) {
				val.temp = _ame.toFahrenheit(val.temp);
			});
			$.each(this.data.day, function(i, val) {
				val.temp.min = _ame.toFahrenheit(val.temp.min);
				val.temp.max = _ame.toFahrenheit(val.temp.max);
			});
			u = 'fahrenheit';
		}
		else if (this.options.unit === 'F') {
			console.log('converting from fahrenheit to celsius');
			this.options.unit = 'C';
			this.el.main.temp.attr('data-label', 'switch to fahrenheit');
			this.data.main.temp = _ame.toCelsius(this.data.main.temp);
			$.each(this.data.hour, function(i, val) {
				val.temp = _ame.toCelsius(val.temp);
			});
			$.each(this.data.day, function(i, val) {
				val.temp.min = _ame.toCelsius(val.temp.min);
				val.temp.max = _ame.toCelsius(val.temp.max);
			});
			u = 'celsuis';
		}
		this.updateTemp();
		this.el.options.updateUnit();
		_ame.storage.options();
		localStorage.setItem('data', JSON.stringify(_ame.data));
		this.notify('<strong>changed default unit to ' + u + '</strong><br>preferences saved!');
	},
	switchUnits: function() {
		_ame.toggleTemp();
	},
	notify: function _ameNotify(msg) {
		const note = _ame.el.note;
		clearTimeout(note.timeoutId);
		note.main.hide();
		note.text.html(msg);
		note.main.fadeIn(250, function() {
			note.timeoutId = setTimeout(function() {
				note.main.fadeOut(250);
			}, 1500);
		});
	},
	locationError: function _ameLocationError(e) {
		let m = 'location error';
		switch (e.code) {
			case 1:
				m = 'user denied permision, please allow app to access your location or enter your location manually.';
				break;
			case 2:
				m = 'location is unavailable, make sure you\'re connected to the internet. if the problem presists, enter your location manually or try again later.';
				break;
			case 3:
				m = 'browser is taking too long to respond, please enter your location manually or try again later.';
				break;
		}
		errorHandler('error: ' + m, true);
	},
	updateOptions: function ameUpdateOptions() {

	},
	interface: {
		main: $('.ame-main'),
		location: $('.ame-locator'),
		locationButton: $('.ame-auto-loc'),
		state: 'location',
		orientation: 'unknown',
		switch: function _ameInterfaceSwitch() {
			if (_ame.interface.state === 'location') {
				_ame.interface.main.removeClass('hidden');
				_ame.interface.location.addClass('hidden');
				_ame.interface.state = 'main';
			}
			else {
				_ame.interface.location.removeClass('hidden');
				_ame.interface.main.addClass('hidden');
				_ame.interface.state = 'location';
				_ame.options.loc = undefined;
				_ame.storage.options();
			}
			console.log('switched to ' + _ame.interface.state + ' ui.');
		},
		orient: function _ameInterfaceOrient() {
			const bod = $('html');
			const h = $(window).height();
			const w = $('body').prop('clientWidth');
			const p = bod.hasClass('portrait');
			const l = bod.hasClass('landscape');
			if (h > w || w <= 768) {
				if (!p) bod.addClass('portrait');
				if (l) bod.removeClass('landscape');
				_ame.interface.orientation = 'portrait';
			}
			else {
				if (!l) bod.addClass('landscape');
				if (p) bod.removeClass('portrait');
				_ame.interface.orientation = 'landscape';
			}
		},
		togglePreferences: function _ameInterfaceTogglePreferences() {
			const orient = _ame.interface.orientation;
			if (orient === 'portrait') {
				$('.ame-pref-wrap').slideToggle(200);
			}
		},
		toggleContacts: function _ameInterfaceToggleContacts() {
			const orient = _ame.interface.orientation;
			if (orient === 'portrait') {
				$('.ame-contacts').slideToggle(200);
			}
		}
	},
	manual: {
		form: $('.ame-manual'),
		label: $('.ame-manual label'),
		input: $('input[name=location]'),
		list: $('.ame-loc-match'),
		loader: $('.ame-manual-loader'),
		country: [],
		selectedCountry: 'none',
		city: [],
		initialSetup: function _ameManualInitialSetup() {
			_ame.manual.list.on('mouseenter', function () {
				console.log('hovering over this thing');
				_ame.manual.input.blur();
			})
			.on('mouseleave', function () {
				console.log('getting out of this thing');
				_ame.manual.input.focus();
			});
		},
		setup: function _ameManualSetup() {
			// set loader width to equal label + input
			console.log(_ame.manual.form.outerWidth());
			_ame.manual.loader.width(_ame.manual.form.outerWidth());
			_ame.manual.hide(); // hidden by default
			_ame.manual.list.hide(); // hide the list initially
		},
		listSetup: function _ameManualListSetup() {
			//const w = $('body').width();
			const el = _ame.manual.list;
			let elWidth, elLeft;
			const elHeight = Math.floor($('html').outerHeight() - _ame.manual.input.offset().top - _ame.manual.input.outerHeight());
			if ($('html').hasClass('landscape')) {
				elWidth = Math.floor(_ame.manual.input.outerWidth());
				elLeft = Math.floor( _ame.manual.input.offset().left - _ame.manual.form.offset().left - parseInt(_ame.manual.form.css('padding-left'), 10) );
				console.log(elHeight);
			}
			else {
				// const form = _ame.manual.form;
				elWidth = _ame.manual.input.outerWidth();
				elLeft = 0 /* parseInt(form.css('padding-left'), 10) */;
			}
			el.css({
				width: elWidth,
				height: elHeight,
				left: elLeft
			});
			el.html('');
		},
		show: function _ameManualShow() {
			_ame.manual.form.show();
			_ame.manual.loader.hide();
		},
		hide: function _ameManualHide() {
			_ame.manual.form.hide();
			_ame.manual.loader.show();
		},
		loadCountry: function _ameManualLoadCountry() {
			$.getJSON('/data/country.json', function (data) {
				_ame.manual.country = data;
				console.log('load country success', _ame.manual.country);
				_ame.manual.input.on('keyup change', _ame.manual.country, _ame.manual.populate);
				_ame.manual.show();
				_ame.manual.listSetup();
			})
			.fail(function (err) {
				errorHandler('loading country list error' + err, true);
			});
		},
		loadCity: function _ameManualLoadCity() {
			console.log('event fireeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed!');
			_ame.manual.hide();
			const el = $(this);
			const id = el.attr('data-id');
			_ame.manual.selectedCountry = el.text();
			console.log('selected country: ' + _ame.manual.selectedCountry);
			$.ajax('/cities', {
				type: 'POST',
				data: 'id=' + id,
				success: function _ameManualLoadCitySuccess(data) {
					_ame.manual.city = data;
					console.log('success for post request');
					console.log(_ame.manual.city);
					_ame.manual.input.val('').attr('placeholder', 'enter city, state or region');
					_ame.manual.label.text(_ame.manual.selectedCountry + ':');
					_ame.manual.setup();
					_ame.manual.list.off('click', 'a', _ame.manual.loadCity)
									.on('click', 'a', fromInput);
					_ame.manual.input	.off('keyup change')
										.on('keyup change', _ame.manual.city, _ame.manual.populate);
					_ame.manual.show();
					_ame.manual.listSetup();
					_ame.manual.input.focus();
				},
				error  : function _ameManualLoadCityError(jqXHR, status, error) {
					errorHandler('load city error\njqXHR: '+ jqXHR +'\nstatus: '+ status +'\nerror: '+ error, true);
				}
			});
		},
		filter: function _ameManualFilter(key, data) {
			return data.filter(function(place) {
				const regex = new RegExp(key, 'gi');
				return place[0].match(regex);
			});
		},
		populate: function _ameManualPopulate(ev) {
			const data = ev.data;
			const key = $(this).val();
			if (key) {
				let match = _ame.manual.filter(key, data);
				let matchHtml = $.map(match, place => {
					// const re = new RegExp(key, 'gi');
					// const hl = place[0].replace(re, `<span class="hl">${key}</span>`);
					return `<li><a data-id="${place[1]}">${place[0]}</a>`;
				})/*.slice(0, 50)*/;
				if (matchHtml.length === 0) {
					const noMatch = `<li>no match found!</li>`;
					_ame.manual.list.html(noMatch);
				}
				else {
					_ame.manual.list.html(matchHtml);
				}
				_ame.manual.list.show();
			}
			else {
				_ame.manual.list.hide();
			}
		}
	},
	storage: {
		save: function _ameStorageSave(key, data) {
			if (window.localStorage) {
				try {
					localStorage.setItem(key, data);
				}
				catch (err) {
					errorHandler(err);
					return false;
				}
				return true;
			}
			else {
				errorHandler('localStorage not supported');
				return false;
			}
		},
		load: function _ameStorageLoad(key) {
			if (window.localStorage) {
				try {
					const data = localStorage.loadItem(key);
					return data;
				}
				catch (e) {
					errorHandler(e);
					return false;
				}
			}
			else {
				errorHandler('localStorage not supported');
				return false;
			}
		},
		options: function _ameStorageOptions() {
			const o = JSON.stringify(_ame.options);
			_ame.storage.save('options', o);
		}
	}
};

const getLocation = function(e) {
	e.preventDefault();
	console.log('getLocation called');

	if (navigator.geolocation) {
		console.log('getLocation supported');
		let locationOptions = {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 0
		};
		navigator.geolocation.getCurrentPosition(getWeather, _ame.locationError, locationOptions);
	}
	else {
		errorHandler('getLocation not supported');
	}
};

const checkDifference = function() {
	let mnts = 10;

	if (localStorage.data && localStorage.lastCall) {
		let time = Date.now();
		let call = parseInt(localStorage.lastCall, 10);
		mnts = (time - call) / 60000;
	}

	console.log('last api call was ' + mnts + ' minutes ago');
	return (mnts >= 10) ? true : false;
};

const fromInput = function(event) {
	event.preventDefault();
	const loc = $(this).attr('data-id');
	console.log('location: ' + loc);
	getWeather(loc, true);
	_ame.manual.input.val('');
	_ame.manual.list.hide();
};

const getWeather = (location, noGeo) => {
	/* console.log('getWeather called');
	if (noGeo === undefined) {
		let lat = loc.coords.latitude;
		let lon = loc.coords.longitude;
		loc = '&lat=' + lat + '&lon=' + lon;
	}
	console.log('loc: ' + loc);
	let api = 'https://api.openweathermap.org/data/2.5/';
	let parameters = '?appid=b956d9bf2e3b92b3dd0354995602a3e6' + loc;
	let mainRequest = api + 'weather' + parameters;
	let hourRequest = api + 'forecast' + parameters;
	let dayRequest = api + 'forecast/daily' + parameters;
	console.log('requesting weather data from openweather.org');
	$.when(
		$.getJSON(mainRequest, setWeather),
		$.getJSON(hourRequest, setHourlyForecast),
		$.getJSON(dayRequest, setDailyForecast)
	)
	.done(function() {
		_ame.updateOptions();
		_ame.interface.switch();
		localStorage.setItem('data', JSON.stringify(_ame.data));
		localStorage.setItem('lastCall', Date.now());
	})
	.fail(function(result) {
		errorHandler('weather api error: ' + result.statusText, true);
	}); */
	if (noGeo === undefined) { /* location is a geolocation object */
		const lat = location.coords.latitude;
		const lon = location.coords.longitude;
		location = {
			loc: JSON.stringify( {lat, lon} )
		};
	}
	else if (noGeo === true) {
		const id = location;
		location = {
			loc: JSON.stringify({id})
		};
	}

	$.ajax({
		url: '/api',
		method: 'POST',
		data: location,
		success: (res, textStatus) => {
			if (textStatus === 'success') {
				_ame.forecast = res; // save response to forecast
				_ame.el.update(); // update forecast panels
				_ame.interface.switch(); // switch to forecast view
			}
			else {
				errorHandler('server responded with an error', true);
			}
		},
		error: (jqxhr, textStatus, error) => {
			const err = textStatus + ', ' + error;
			errorHandler('Request Failed: ' + err, true);
		}
	});
};

const setWeather = function(response) {
	console.log('set weather called');
	let assignLoc = function() {
		try {
			_ame.options.loc = response.id;
			return true;
		}
		catch(e) {
			errorHandler(e);
			return false;
		}
	}

	if (assignLoc()) {
		_ame.storage.options();
	}

	_ame.data.main = {
		temp: _ame.setTemp(response.main.temp),
		icon: response.weather[0].icon,
		location: response.name +', '+ response.sys.country,
		info: response.weather[0].description,
		time: new Date()
	}

	_ame.el.main.update();

	console.log('main weather data is set');
};

const setHourlyForecast = function(response) {
	console.log('hourly forecast called');

	for (let i = 0; i < _ame.el.hour.time.length; i++) {
		let forecast = response.list[i];
		_ame.data.hour[i] = {
			temp: _ame.setTemp(forecast.main.temp),
			icon: forecast.weather[0].icon,
			time: forecast.dt_txt.split(' ')[1].substr(0, 5)
		}
	}
	_ame.el.hour.update();
	console.log('hourly weather data is set');
};

const setDailyForecast = function(response) {
	console.log('daily forecast called');

	for (let i = 0; i < _ame.el.day.time.length; i++) {
		let daily = response.list[i+1];
		let date = new Date(daily.dt * 1000);
		_ame.data.day[i] = {
			temp: {
				min: _ame.setTemp(daily.temp.min),
				max: _ame.setTemp(daily.temp.max)
			},
			icon: daily.weather[0].icon,
			time: date.getDate() + '/' + (date.getMonth()+1)
		}
	}

	_ame.el.day.update();

	console.log('daily weather data is set');
};


$(function() {
	_ame.interface.orient();
	_ame.manual.initialSetup();
	_ame.manual.setup();
	_ame.manual.loadCountry();
	if (localStorage.options) {
		console.log('localStorage.options found!');
		_ame.options = JSON.parse(localStorage.options);
		if (typeof _ame.options.loc === 'number') {
			console.log('using locally saved location: ' + _ame.options.loc);
			if (checkDifference()) {
				const loc = '&id=' + _ame.options.loc;
				getWeather(loc, true);
			}
			else {
				console.log('loading weather from local storage');
				_ame.data = JSON.parse(localStorage.data);
				_ame.el.main.update();
				_ame.el.hour.update();
				_ame.el.day.update();
				_ame.interface.switch();
			}
		}
		/* else {
			console.warn('No localStorage location saved! waiting for user input');
		} */
	}
	/* else {
		console.warn('localStorage.options is not found! waiting for user input.');
	} */

	/* Event Listeners
	========================================= */
	/* core functionality */
		_ame.interface.locationButton.on('click', getLocation);

	/* manual location input start */
		_ame.manual.input.on('keypress', function(e) {
			if (e.keyCode === 13) e.preventDefault();
		});
		_ame.manual.list.on('click', 'a', _ame.manual.loadCity);
	/* manual location input end */

	/* options start */
		_ame.el.main.temp.on('click', _ame.switchUnits);
		_ame.el.options.unit.on('click', _ame.switchUnits);
		_ame.el.options.location.on('click', _ame.interface.switch);
	/* options end */

	/* ui start */
		$(window).on('resize', _ame.interface.orient);
		$('.ame-pref-toggle').on('click', _ame.interface.togglePreferences);
		$('.ame-contacts-toggle').on('click', _ame.interface.toggleContacts);
	/* ui end */

	/* const locito = '&id=361058';
	getWeather(locito, true); */
});

}());