'use strict';
import '../css/styles.less';
import $ from 'jquery';
import Raven from 'raven-js';
Raven.config('https://d581b40eda8a444a928b39d898380a05@sentry.io/212857').install();
import errorHandler from './modules/error-handler';
import * as storage from './modules/storage';
import prefs from './modules/preferences';
import forecast from './modules/forecast';
import view from './modules/view';
import manual from './modules/manual';

/* main object containing app state */
let _ame = {
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
		navigator.geolocation.getCurrentPosition(forecast.get, _ame.locationError, locationOptions);
	}
	else {
		errorHandler('getLocation not supported');
	}
};

const checkDifference = function() {
	let mnts = 10;
	let lastCall = storage.load('lastCall');

	if (storage.load('forecast') && lastCall) {
		const time = Date.now();
		lastCall = Number.parseInt(lastCall, 10);
		mnts = (time - lastCall) / 60000;
	}

	console.log(`last api call was ${mnts} minutes ago`);
	return (mnts >= 10) ? true : false;
};

$(function() {
	view.orient();
	// manual.initialSetup();
	manual.setup();
	manual.loadCountry();

	if ( prefs.load() ) {
		const loc = prefs.current.location;
		if (typeof loc === 'number') { // double check prefs were loaded from localstorage
			console.log('using locally saved location: ' + loc);
			if ( checkDifference() ) {
				forecast.get(loc, true);
			}
			else {
				console.log('loading weather from localStorage');
				if ( forecast.load() ) {
					forecast.update();
					view.switch();
				}
				else { // get new data from server, because an error occured while loading data from localStorage
					forecast.get(loc, true);
				}
			}
		}
	}

	/* Event Listeners
	========================================= */
	/* core functionality */
		view.locationButton.on('click', getLocation);

	/* manual location input start */
		manual.input.on('keypress', function(e) {
			if (e.keyCode === 13) e.preventDefault();
		});
		manual.list.on('click', 'a', function(event) {
			manual.loadCity.call(this, event, manual);
		});
	/* manual location input end */

	/* options start */
	forecast.main.temp.on('click', function () { prefs.switchUnits() });
	prefs.unitElement.on('click', function() { prefs.switchUnits() });
	prefs.locationElement.on('click', function () { view.switch() });
	/* options end */

	/* ui start */
	$(window).on('resize', function () { view.orient() });
	$('.ame-pref-toggle').on('click', function () { view.togglePreferences() });
	$('.ame-contacts-toggle').on('click', function () { view.toggleContacts() });
	/* ui end */
});