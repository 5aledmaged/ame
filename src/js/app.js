'use strict';
import '../css/styles.less';
import $ from 'jquery';
import Raven from 'raven-js';
Raven.config('https://d581b40eda8a444a928b39d898380a05@sentry.io/212857').install();
import * as storage from './modules/storage';
import prefs from './modules/preferences';
import forecast from './modules/forecast';
import view from './modules/view';
import manual from './modules/manual';

const checkDifference = () => {
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
				else { // get new data from server; error loading data from localStorage
					forecast.get(loc, true);
				}
			}
		}
	}

	/* ==============================================================================================
		Event Listeners
	============================================================================================== */
	/* core functionality */
		view.locationButton.on('click', forecast.geo);

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