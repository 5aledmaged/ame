(function(){
// 'use strict';
// global variables
var $ = function () {
	return document.querySelector.apply(document, arguments);
};

var $locPan = $('aside');
var $mainPan = $('main');
var $locErr = $('#loc-err');

_ame = {
	options: {
		unit: 'C'
	},
	data: {
		main: {
			temp: 0,
			icon: '01d',
			location: 'unknown',
			info: 'unknown',
			time: 'unknown'
		},
		hour: [
			{
				temp: 0,
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: 0,
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: 0,
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: 0,
				icon: '01d',
				time: 'unknown'
			}
		],
		day: [
			{
				temp: {
					min: 0,
					max: 0
				},
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: {
					min: 0,
					max: 0
				},
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: {
					min: 0,
					max: 0
				},
				icon: '01d',
				time: 'unknown'
			},
			{
				temp: {
					min: 0,
					max: 0
				},
				icon: '01d',
				time: 'unknown'
			}
		]
	},
	el: {
		main: {
			temp: $('.main-weather-info .temperature'),
			icon: $('.main-weather-icon img'),
			location: $('.main-weather-info .location'),
			info: $('.main-weather-icon figcaption p'),
			time: $('.main-weather-info .update'),
			update: function () {
				this.temp.textContent = _ame.data.main.temp + '\u00b0' + _ame.options.unit;
				this.icon.src = 'img/icons/'+ _ame.data.main.icon +'.svg';
				this.location.textContent = _ame.data.main.location;
				this.info.textContent = _ame.data.main.info;
				var time = _ame.data.main.time;
				this.time.textContent = 'updated ' + _ame.day[time.getDay()] + ', '+ time.getDate() + ' '
										+ _ame.month[time.getMonth()] + ' ' + ('0' + time.getHours()).slice(-2) + ':'
										+ ('0' + time.getMinutes()).slice(-2);
			}
		},
		hour: {
			temp: document.querySelectorAll('#hourly-forecast .data-column .temprature'),
			icon: document.querySelectorAll('#hourly-forecast .data-column img'),
			time: document.querySelectorAll('#hourly-forecast .data-column .time'),
			update: function () {
				for (var i = 0; i < this.time.length; i++) {
					this.temp[i].textContent = _ame.data.hour[i].temp + ' \u00b0' + _ame.options.unit;
					this.icon[i].src = 'img/icons/'+ _ame.data.hour[i].icon +'.svg';
					this.time[i].textContent = _ame.data.hour[i].time;
				}
			}
		},
		day: {
			temp: {
				min: document.querySelectorAll('#daily-forecast .data-column .min-temp'),
				max: document.querySelectorAll('#daily-forecast .data-column .max-temp')
			},
			icon: document.querySelectorAll('#daily-forecast .data-column img'),
			time: document.querySelectorAll('#daily-forecast .data-column .time'),
			update: function () {
				for (var i = 0; i < this.time.length; i++) {
					this.temp.min[i].textContent = _ame.data.day[i].temp.min + ' \u00b0' + _ame.options.unit;
					this.temp.max[i].textContent = _ame.data.day[i].temp.max + ' \u00b0' + _ame.options.unit;
					this.icon[i].src = 'img/icons/'+ _ame.data.day[i].icon +'.svg';
					this.time[i].textContent = _ame.data.day[i].time;
				}
			}
		}
	},
	day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
	month: ['January','February','March','April','May','June','July','August','September','October','November','December'],
	updateTemp: function () {
		this.el.main.temp.textContent = this.data.main.temp + '\u00b0' + this.options.unit;
	},
	toggleTemp: function () {
		console.info('toggleTemp called');
		if (this.options.unit === 'C') {
			console.info('converting from celsius to fahrenheit');
			this.options.unit = 'F';
			this.data.main.temp = Math.round((9/5) * this.data.main.temp + 32);
		}
		else {
			console.info('converting from fahrenheit to celsius');
			this.options.unit = 'C';
			this.data.main.temp = Math.round((5/9) * (this.data.main.temp - 32));
		}
		this.updateTemp();
	}
};

Element.prototype.$ = function() {
	return this.querySelector.apply(this, arguments);
};

Element.prototype.addClass = function (c) {
	if (this.classList) {
		if (!this.classList.contains(c)) {
			this.classList.add(c);
		}
		else {
			console.warn('Element already has a ' + c + ' class!');
		}
	}
	else if (this.className) {
		var cs = this.className.split(' ');
		var ix = cs.indexOf(c);
		if (ix === -1) {
			cs.push(c);
			this.className = cs.join(' ');
		}
		else {
			console.warn('Element already has a ' + c + ' class!');
		}
	}
	else {
		console.error('Neither classList nor className are supported!');
	}
};

Element.prototype.removeClass = function (c) {
	if (this.classList) {
		if (this.classList.contains(c)) {
			this.classList.remove(c);
		}
		else {
			console.warn('Element doesn\'t have a ' + c + ' class!');
		}
	}
	else if (this.className) {
		var cs = this.className.split(' ');
		var ix = cs.indexOf(c);
		if (ix !== -1) {
			cs.splice(ix, 1);
			this.className = cs.join(' ');
		}
		else {
			console.warn('Element doesn\'t have a ' + c + ' class!');
		}
	}
	else {
		console.error('Neither classList nor className are supported!');
	}
};

Element.prototype.toggleClass = function (c) {
	if (this.classList) {
		this.classList.toggle(c);
	}
	else if (this.className) {
		var cs = this.className.split(' ');
		var ix = cs.indexOf(c);
		if (ix === -1) {
			cs.push(c);
		}
		else {
			cs.splice(ix, 1);
		}
		this.className = cs.join(' ');
	}
	else {
		console.error('Neither classList nor className are supported!');
	}
};

// function definations
function getData(call) {
	var xhr = new XMLHttpRequest();
	var data;

	xhr.open('get', call.url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log('response headers:\n' + xhr.getAllResponseHeaders());
				data = JSON.parse(xhr.responseText);
				call.successHandler && call.successHandler({data: data});
			} else {
				console.error('server error please try again');
			}
		}
	};
	xhr.send();
}

function getLocation(e) {
	e.preventDefault();
	console.info('getLocation called');
	
	//$locationTrigger.style.display = 'none';
	
	if (navigator.geolocation) {
		console.info('getLocation supported');
		navigator.geolocation.getCurrentPosition(getWeather, console.error);
	}
	else {
		$locErr.textContent = 'error! your browser doesn\'t support the Geolocation API.';
		$locErr.removeClass('hidden');
		console.error('getLocation not supported');
	}
}

function checkDifference() {
	var mnts = 10;

	if (localStorage.weather && localStorage.lastCall) {
		var time = Date.now();
		var call = parseInt(localStorage.lastCall);
		mnts = (time - call) / 60000;
	}

	console.info('last api call was ' + mnts + ' minutes ago');
	return (mnts >= 10) ? true : false;
}

function fromInput(e) {
	e.preventDefault();
	var loc = this.$('input[type="text"]').value;
	var locRegex = /^(.+),([A-Za-z]{2})$/i;
	var testy = locRegex.test(loc);
	console.log('location regex test result is: ' + testy);
	if (testy) {
		var api = 'http://api.openweathermap.org/data/2.5/weather?appid=b956d9bf2e3b92b3dd0354995602a3e6&';
		var request = api + 'q=' + loc;
		console.info('Weather data from server.');
		getData({url: request, successHandler:setWeather});
	}
	else {
		alert('invalid input silly');
	}
}

function getWeather(location) {
	var lat = location.coords.latitude;
	var lon = location.coords.longitude;
	var api = 'http://api.openweathermap.org/data/2.5/';
	var parameters = '?appid=b956d9bf2e3b92b3dd0354995602a3e6&lat=' + lat + '&lon=' + lon; // forecast
	var mainRequest = api + 'weather' + parameters;
	var hourRequest = api + 'forecast' + parameters;
	var dayRequest = api + 'forecast/daily' + parameters;
	console.info('requesting weather data drom openweather.org');
	getData({url: mainRequest, successHandler: setWeather});
	getData({url: hourRequest, successHandler: setHourlyForecast});
	getData({url: dayRequest, successHandler: setDailyForecast});
}

function setWeather(response) {
	console.info('set weather called');
	if (typeof response !== 'undefined') {
		localStorage.setItem('weather', JSON.stringify(response.data)); // save data locally
		localStorage.setItem('lastCall', Date.now()); // save last call time locally
		localStorage.setItem('loc', response.data.id);
	}
	else {
		response = {
			data: JSON.parse(localStorage.weather)
		};
	}

	_ame.data.main = {
		temp: Math.round(response.data.main.temp - 273),
		icon: response.data.weather[0].icon,
		location: response.data.name +', '+ response.data.sys.country,
		info: response.data.weather[0].main,
		time: new Date()
	}

	_ame.el.main.update();

	console.info('main weather data is set');
}

function setHourlyForecast(response) {
	console.info('hourly forecast called');
	if (typeof response !== 'undefined') {
		localStorage.setItem('forecast', JSON.stringify(response.data)); // save data locally
		console.info('setting weather info from server');
	}
	else {
		response = {
			data: JSON.parse(localStorage.forecast)
		};
	}

	for (var i = 0; i < _ame.el.hour.time.length; i++) {
		var forecast = response.data.list[i];
		_ame.data.hour[i] = {
			temp: Math.round(forecast.main.temp - 273),
			icon: forecast.weather[0].icon,
			time: forecast.dt_txt.split(' ')[1].substr(0, 5)
		}
		_ame.el.hour.update();
	}

	console.info('hourly weather data is set');
}

function setDailyForecast(response) {
	console.info('daily forecast called');
	if (typeof response !== 'undefined') {
		localStorage.setItem('daily', JSON.stringify(response.data)); // save data locally
		console.info('setting weather info from server');
	}
	else {
		response = {
			data: JSON.parse(localStorage.daily)
		};
	}

	for (var i = 0; i < _ame.el.day.time.length; i++) {
		var daily = response.data.list[i+1];
		var date = new Date(daily.dt * 1000);
		_ame.data.day[i] = {
			temp: {
				min: Math.round(daily.temp.min - 273),
				max: Math.round(daily.temp.max - 273)
			},
			icon: daily.weather[0].icon,
			time: date.getDate() + '/' + (date.getMonth()+1)
		}
	}

	_ame.el.day.update();

	console.info('daily weather data is set');

	$mainPan.removeClass('hidden');
	$locPan.addClass('hidden');
}


(function main() {
	if (localStorage.loc) {
		console.info('using localStorage location: ' + localStorage.loc);
		if (checkDifference()) {
			var api = 'http://api.openweathermap.org/data/2.5/';
			var parameters = '?appid=b956d9bf2e3b92b3dd0354995602a3e6&id=' + localStorage.loc; // forecast
			var mainRequest = api + 'weather' + parameters;
			var hourRequest = api + 'forecast' + parameters;
			var dayRequest = api + 'forecast/daily' + parameters;
			console.info('requesting weather data drom openweather.org');
			getData({url: mainRequest, successHandler: setWeather});
			getData({url: hourRequest, successHandler: setHourlyForecast});
			getData({url: dayRequest, successHandler: setDailyForecast});
		}
		else {
			console.log('loading weather from local storage');
			setWeather();
			setHourlyForecast();
			setDailyForecast();
		}
	}
	else {
		console.info('No localStorage location saved! waiting for user input');
	}

	var $locDetect = $('aside a');
	var $locInput = $('aside form');
	$locDetect.onclick = getLocation;
	$locInput.onsubmit = fromInput;
	_ame.el.main.temp.onclick = function () {
		_ame.toggleTemp.call(_ame);
	};
}());

}());