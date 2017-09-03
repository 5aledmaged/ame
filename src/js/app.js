import '../css/styles.less';
import $ from 'jquery';

(function(){
'use strict';
// global letiables
const $locPan = $('.ame-selector');
const $mainPan = $('.ame-main');

let _ame = {
	'options': {
		'unit': 'C',
		'loc': undefined
	},
	'data': {
		'main': {
			'temp': 0,
			'icon': '01d',
			'location': 'unknown',
			'info': 'unknown',
			'time': 'unknown'
		},
		'hour': [
			{
				'temp': 0,
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': 0,
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': 0,
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': 0,
				'icon': '01d',
				'time': 'unknown'
			}
		],
		'day': [
			{
				'temp': {
					'min': 0,
					'max': 0
				},
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': {
					'min': 0,
					'max': 0
				},
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': {
					'min': 0,
					'max': 0
				},
				'icon': '01d',
				'time': 'unknown'
			},
			{
				'temp': {
					'min': 0,
					'max': 0
				},
				'icon': '01d',
				'time': 'unknown'
			}
		]
	},
	'el': {
		'main': {
			'temp': $('.ame-main-temp'),
			'icon': $('.main-icon'),
			'location': $('.preferences .location'),
			'info': $('.ame-main-info'),
			'time': $('.main-forecast .update'),
			'update': function () {
				console.log('main weather update');
				let data = _ame.data.main;
				this.temp.text(_ame.formatTemp(data.temp));
				_ame.el.options.updateUnit();
				this.icon.attr('src', 'img/icons/'+ data.icon + '.svg');
				this.location.text('Location: ' + data.location);
				this.info.text(data.info);
				let mainTime = typeof data.time === 'object' ? data.time : new Date(data.time); // Date object if not local
				this.time.text('updated ' + _ame.day[mainTime.getDay()] + ', '+ mainTime.getDate() + ' '
										+ _ame.month[mainTime.getMonth()] + ' ' + ('0' + mainTime.getHours()).slice(-2)
										+ ':' + ('0' + mainTime.getMinutes()).slice(-2));
			}
		},
		'hour': {
			'temp': $('.hour-panel .data-column .temprature'),
			'icon': $('.hour-panel .data-column img'),
			'time': $('.hour-panel .data-column .time'),
			'update': function () {
				console.log('hourly weather update');
				let data = _ame.data.hour
				this.temp.each(function(i, el) {
					$(el).text(_ame.formatTemp(data[i].temp));
				});
				this.icon.each(function(i, el) {
					$(el).attr('src', 'img/icons/'+ data[i].icon +'.svg');
				});
				this.time.each(function(i, el) {
					$(el).text(data[i].time);
				});
			}
		},
		'day': {
			'temp': {
				'min': $('.day-panel .data-column .min-temp'),
				'max': $('.day-panel .data-column .max-temp')
			},
			'icon': $('.day-panel .data-column img'),
			'time': $('.day-panel .data-column .time'),
			'update': function () {
				console.log('daily weather update');
				let data = _ame.data.day;
				$.each(this.temp, function(key, val) {
					val.each(function(i, el) {
						let t = data[i].temp[key];
						$(el).text(_ame.formatTemp(t));
					});
				});
				this.icon.each(function(i, el) {
					$(el).attr('src', 'img/icons/'+ data[i].icon +'.svg');
				});
				this.time.each(function(i, el) {
					$(el).text(data[i].time);
				});
			}
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
	'day': ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
	'month': ['January','February','March','April','May','June','July','August','September','October','November','December'],
	'formatTemp': function(t) {
		return t + '\u00b0' + this.options.unit;
	},
	'updateTemp': function() {
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
	'toggleTemp': function _ameToggleTemp() {
		console.info('toggleTemp called');
		let u = 'fahrenheit';

		if (this.options.unit === 'C') {
			console.info('converting from celsius to fahrenheit');
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
			console.info('converting from fahrenheit to celsius');
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
		_ame.store.options();
		localStorage.setItem('data', JSON.stringify(_ame.data));
		this.notify('<strong>changed default unit to ' + u + '</strong><br>preferences saved!');
	},
	switchUnits: function() {
		_ame.toggleTemp();
	},
	'notify': function _ameNotify(msg) {
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
	error: {
		loc: $('#loc-err'),
		show: function _ameShowError(e) {
			_ame.error.loc.text(e).removeClass('hidden');
		},
		log: function _ameLogError(e) {
			console.error(e);
		},
	},
	locationError: function _ameLocationError(e) {
		let m = 'lovation error';
		switch (e.code) {
			case 1:
				m = 'user denied permision, please allow app to access your location or enter your location manually.';
				break;
			case 2:
				console.log('POSITION_UNAVAILABLE');
				m = 'location is unavailable, make sure you\'re connected to the internet. if the problem presists, enter your location manually or try again later.';
				break;
			case 3:
				m = 'browser is taking too long to respond, please enter your location manually or try again later.';
				break;
		}
		_ame.error.loc.text('error: ' + m).removeClass('hidden');
		console.error(e);
	},
	updateOptions: function ameUpdateOptions() {

	},
	ui: {
		state: 'location',
		switch: function _ameUISwitch() {
			if (_ame.ui.state === 'location') {
				$mainPan.removeClass('hidden');
				$locPan.addClass('hidden');
				_ame.ui.state = 'forecast';
			}
			else {
				$locPan.removeClass('hidden');
				$mainPan.addClass('hidden');
				_ame.ui.state = 'location';
				_ame.options.loc = undefined;
				_ame.store.options();
			}
			console.log('switched to ' + _ame.ui.state + ' ui.');
		},
		orient: function _ameUIOrient() {
			const bod = $('html');
			const h = $(window).height();
			const w = $('body').prop('clientWidth');
			const p = bod.hasClass('portrait');
			const l = bod.hasClass('landscape');
			if (h > w || w <= 480) {
				if (!p) bod.addClass('portrait');
				if (l) bod.removeClass('landscape');
			}
			else {
				if (!l) bod.addClass('landscape');
				if (p) bod.removeClass('portrait');
			}
		},
		pref: function _ameUIPref() {
			$('.ame-pref-wrap').slideToggle(200);
		}
	},
	input: {
		el: $('input[type=text]'),
		match: $('.ame-loc-match'),
		alignMatch: function _ameAlignMatch() {
			const w = $('body').width();
			if (w > 768) {
				const el = _ame.input.match;
				const labelWidth = $('.ame-selector label').outerWidth();
				const elHeight = Math.floor($('html').outerHeight() - el.offset().top - 10);
				console.log(elHeight);
				el.css({
					left: labelWidth,
					height: elHeight
				});
			}
			_ame.input.match.hide();
		},
		cities: [],
		matched: [],
		load: function _ameInputLoad() {
			$.ajax({
				url: 'js/sorted.json',
				dataType: 'json',
				success: _ame.input.save,
				error: _ame.input.error
			});
		},
		save: function(d) {
			_ame.input.cities = d;
		},
		error: function(e) {
			console.log(e);
		},
		filter: function _ameInputFilter(exp, list) {
			return list.filter(function(place) {
				const regex = new RegExp('^' + exp, 'i');
				return place.city.match(regex);
			});
		},
		populate: function _ameInputPopulate() {
			const key = $(this).val();
			/*let t0 = performance.now();
			let linear = _ame.input.filter(key, _ame.input.cities);
			console.log(linear);
			let t1 = performance.now();
			console.log('linear runtime: ' + (t1 - t0) + 'ms');
			let t2 = performance.now();
			let binary = _ame.input.binaryFilter(key);
			console.log(binary);
			let t3 = performance.now();
			console.log('binary runtime: ' + (t3 - t2) + 'ms');*/
			if (key) {
				let t1 = performance.now();
				let match = _ame.input.binaryFilter(key);
				let t2 = performance.now();
				console.log('binary runtime: ' + (t2 - t1) + 'ms');
				let matchHtml = $.map(match, place => {
					const re = new RegExp(key, 'gi');
					const city = place.city.replace(re, `<span class="hl">${key}</span>`);
					return `<li><a data-city-id="${place.id}">${city}</a>`;
				}).slice(0, 50);
				if (matchHtml.length === 0) {
					const noMatch = `<li>no match found!</li>`;
					_ame.input.match.html(noMatch);
				}
				else {
					_ame.input.match.html(matchHtml);
				}
				_ame.input.match.show();
			}
			else {
				_ame.input.match.hide();
			}
		},
		binaryFilter: function _ameInputBinaryFilter(key) {
			let db = _ame.input.cities;
			let lowerBound = function _ameLowerBound(key) {
				let low = 0,
					high = db.length - 1;
				let mid, midCity;
				let re = new RegExp('^' + key, 'i');
				while (low <= high) {
					mid = Math.floor(low + (high - low) / 2);
					midCity = db[mid].city.toUpperCase();
					if (re.test(midCity) || midCity > key) {
						high = mid - 1;
					}
					else {
						low = mid + 1;
					}
				}
				return low;
			};

			let upperBound = function _ameUpperBound(key) {
				let low = 0,
					high = db.length - 1;
				let mid, midCity;
				let re = new RegExp('^' + key, 'i');
				while (low <= high) {
					mid = Math.floor(low + (high - low) / 2);
					midCity = db[mid].city.toUpperCase();
					if (re.test(midCity) || midCity < key) {
						low = mid + 1;
					}
					else {
						high = mid - 1;
					}
				}
				return low;
			};

			key = key.toUpperCase();
			let lBound = lowerBound(key);
			let uBound = upperBound(key);

			console.log('lBound: ' + lBound + ', uBound: ' + uBound + '.');

			return db.slice(lBound, uBound);
		}
	},
	store: {
		save: function _ameStorageSave(data, key) {
			if (window.localStorage) {
				data = JSON.stringify(data);
				try {
					localStorage.setItem(key, data);
				}
				catch (e) {
					_ame.error.log(e);
					return false;
				}
				return true;
			}
			else {
				_ame.error.log('localStorage not supported');
				return false;
			}
		},
		/* load:  function _ameStorageLoad(key) {
			if (window.localStorage) {
				data = JSON.stringify(data);
				try {
					localStorage.setItem(key, data);
				}
				catch (e) {
					_ame.error.log(e);
					return false;
				}
				return true;
			}
			else {
				_ame.error.log('localStorage not supported');
				return false;
			}
		}, */
		options: function _ameOptionsStore() {
			const o = JSON.stringify(_ame.options);
			localStorage.setItem('options', o);
		}
	}
};

const getLocation = function(e) {
	e.preventDefault();
	console.info('getLocation called');

	if (navigator.geolocation) {
		console.info('getLocation supported');
		let locationOptions = {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 0
		};
		navigator.geolocation.getCurrentPosition(getWeather, _ame.locationError, locationOptions);
	}
	else {
		_ame.error.log('getLocation not supported');
	}
};

const checkDifference = function() {
	let mnts = 10;

	if (localStorage.data && localStorage.lastCall) {
		let time = Date.now();
		let call = parseInt(localStorage.lastCall, 10);
		mnts = (time - call) / 60000;
	}

	console.info('last api call was ' + mnts + ' minutes ago');
	return (mnts >= 10) ? true : false;
};

const fromInput = function(e) {
	e.preventDefault();
	console.log('hi ihi ihihihihi ');
	const loc = '&id=' + $(this).attr('data-city-id');
	console.log('location: ' + loc);
	getWeather(loc, true);
	_ame.input.el.val('');
	_ame.input.match.hide();
};

const getWeather = function(loc, noGeo) {
	console.info('getWeather called');
	if (noGeo === undefined) {
		let lat = loc.coords.latitude;
		let lon = loc.coords.longitude;
		loc = '&lat=' + lat + '&lon=' + lon;
	}
	console.log('loc: ' + loc);
	let api = 'http://api.openweathermap.org/data/2.5/';
	let parameters = '?appid=b956d9bf2e3b92b3dd0354995602a3e6' + loc;
	let mainRequest = api + 'weather' + parameters;
	let hourRequest = api + 'forecast' + parameters;
	let dayRequest = api + 'forecast/daily' + parameters;
	console.info('requesting weather data from openweather.org');
	$.when(
		$.get(mainRequest, setWeather, 'json'),
		$.get(hourRequest, setHourlyForecast, 'json'),
		$.get(dayRequest, setDailyForecast, 'json')
	)
	.done(function() {
		_ame.updateOptions();
		_ame.ui.switch();
		localStorage.setItem('data', JSON.stringify(_ame.data));
		localStorage.setItem('lastCall', Date.now());
	})
	.fail(function(result) {
		_ame.error.show('promises error: ' + result.statusText);
	});
};

const setWeather = function(response) {
	console.info('set weather called');
	let assignLoc = function() {
		try {
			_ame.options.loc = response.id;
			return true;
		}
		catch(e) {
			_ame.error.log(e);
			return false;
		}
	}

	if (assignLoc()) {
		_ame.store.options();
	}


	_ame.data.main = {
		temp: _ame.setTemp(response.main.temp),
		icon: response.weather[0].icon,
		location: response.name +', '+ response.sys.country,
		info: response.weather[0].description,
		time: new Date()
	}

	_ame.el.main.update();

	console.info('main weather data is set');
};

const setHourlyForecast = function(response) {
	console.info('hourly forecast called');

	for (let i = 0; i < _ame.el.hour.time.length; i++) {
		let forecast = response.list[i];
		_ame.data.hour[i] = {
			temp: _ame.setTemp(forecast.main.temp),
			icon: forecast.weather[0].icon,
			time: forecast.dt_txt.split(' ')[1].substr(0, 5)
		}
	}
	_ame.el.hour.update();
	console.info('hourly weather data is set');
};

const setDailyForecast = function(response) {
	console.info('daily forecast called');

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

	console.info('daily weather data is set');
};


$(function() {
	_ame.ui.orient();
	$(window).on('resize', _ame.ui.orient);
	_ame.input.load();
	if (localStorage.options) {
		console.info('localStorage.options found!');
		_ame.options = JSON.parse(localStorage.options);
		if (typeof _ame.options.loc === 'number') {
			console.info('using locally saved location: ' + _ame.options.loc);
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
				_ame.updateOptions();
				_ame.ui.switch();
			}
		}
		else {
			console.warn('No localStorage location saved! waiting for user input');
		}
	}
	else {
		console.warn('localStorage.options is not found! waiting for user input.');
	}

	let $locDetect = $('.ame-auto-loc');
	// let $locInput = $('.ame-selector form');
	$locDetect.on('click', getLocation);
	_ame.input.el.on('keyup change', _ame.input.populate);
	_ame.input.el.on('keypress', function(e) {
		if (e.keyCode === 13) e.preventDefault();
	});
	_ame.input.match.on('click', 'a', fromInput);
	_ame.el.main.temp.on('click', _ame.switchUnits);
	_ame.el.options.unit.on('click', _ame.switchUnits);
	_ame.el.options.location.on('click', _ame.ui.switch);
	_ame.input.alignMatch();
	$('h3').on('click', _ame.ui.pref);
});

}());