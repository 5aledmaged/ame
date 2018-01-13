import $ from 'jquery';
import prefs from './preferences';

class View {
	constructor() {
		this.main = $('.ame-main');
		this.location = $('.ame-locator');
		this.locationButton = $('.ame-auto-loc');
		this.state = 'location';
		this.orientation = 'unknown';
	}

	switch() {
		if (this.state === 'location') {
			this.main.removeClass('hidden');
			this.location.addClass('hidden');
			this.state = 'main';
		}
		else {
			this.location.removeClass('hidden');
			this.main.addClass('hidden');
			this.state = 'location';
			prefs.updateLocation(undefined);
		}
		console.log(`switched to ${this.state} view`);
	}

	orient() {
		const bod = $('html');
		const h = $(window).height();
		const w = $('body').prop('clientWidth');
		const p = bod.hasClass('portrait');
		const l = bod.hasClass('landscape');
		if (h > w || w <= 768) {
			if (!p) bod.addClass('portrait');
			if (l) bod.removeClass('landscape');
			this.orientation = 'portrait';
		}
		else {
			if (!l) bod.addClass('landscape');
			if (p) bod.removeClass('portrait');
			this.orientation = 'landscape';
		}
	}

	togglePreferences(){
		const orient = this.orientation;
		if (orient === 'portrait') {
			$('.ame-pref-wrap').slideToggle(200);
		}
	}

	toggleContacts() {
		const orient = this.orientation;
		if (orient === 'portrait') {
			$('.ame-contacts').slideToggle(200);
		}
	}
}

const view = new View();

export default view;