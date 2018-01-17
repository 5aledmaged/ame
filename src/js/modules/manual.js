import $ from 'jquery';
import errorHandler from './error-handler';
import forecast from './forecast';

class Manual {
	constructor() {
		this.form = $('.ame-manual');
		this.label = $('.ame-manual label');
		this.input = $('input[name=location]');
		this.list = $('.ame-loc-match');
		this.loader = $('.ame-manual-loader');
		this.country = [];
		this.selectedCountry = null;
		this.city = [];

		const that = this;
		this.list.on('mouseenter', function () {
			console.log('hovering over this thing');
			that.input.blur();
		})
		.on('mouseleave', function () {
			console.log('getting out of this thing');
			that.input.focus();
		});

		this.input.on('keypress', function (e) {
			if (e.keyCode === 13) e.preventDefault();
		});
	}

	setup() {
		// set loader width to equal label + input
		console.log(this.form.outerWidth());
		this.loader.width(this.form.outerWidth());
		this.hide(); // hidden by default
		this.list.hide(); // hide the list initially
	}

	listSetup() {
		const el = this.list;
		let elWidth, elLeft;
		const elHeight = Math.floor($('html').outerHeight() - this.input.offset().top - this.input.outerHeight());
		if ($('html').hasClass('landscape')) {
			elWidth = Math.floor(this.input.outerWidth());
			elLeft = Math.floor(this.input.offset().left - this.form.offset().left - Number.parseInt(this.form.css('padding-left'), 10));
			console.log(elHeight);
		}
		else {
			elWidth = this.input.outerWidth();
			elLeft = 0;
		}
		el.css({
			width: elWidth,
			height: elHeight,
			left: elLeft
		});
		el.html('');
	}

	show() {
		this.form.show();
		this.loader.hide();
	}

	hide() {
		this.form.hide();
		this.loader.show();
	}

	loadCountry() {
		const that = this;
		$.getJSON('/data/country.json', data => {
			that.country = data;
			console.log('load country success', that.country);
			that.input.on('keyup change', that.country, function (event) {
				that.populate.call(this, event, that);
			});
			that.list.on('click', 'a', function (event) {
				that.loadCity.call(this, event, that);
			});
			that.show();
			that.listSetup();
		})
		.fail(function (err) {
			errorHandler('loading country list error' + err, true);
		});
	}

	loadCity(event, that) {
		console.log('event fireeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed!');
		that.hide();
		const el = $(this);
		const id = el.attr('data-id');
		that.selectedCountry = el.text();
		console.log('selected country: ' + that.selectedCountry);
		$.ajax({
			url: '/cities',
			method: 'POST',
			data: 'id=' + id,
			success: data => {
				that.city = data;
				console.log('success for post request');
				console.log(that.city);
				that.input.val('').attr('placeholder', 'enter city, state or region');
				that.label.text(that.selectedCountry + ':');
				that.setup();
				that.list.off('click', 'a')
					.on('click', 'a', function (event) {
						that.processInput.call(this, event, that);
					});
				that.input.off('keyup change')
					.on('keyup change', that.city, function (event) {
						that.populate.call(this, event, that);
					});
				that.show();
				that.listSetup();
				that.input.focus();
			},
			error: (jqxhr, textStatus, error) => {
				const err = textStatus + ', ' + error;
				errorHandler('load city Failed: ' + err, true);
			}
		});
	}

	filter(key, data) {
		return data.filter(place => {
			const regex = new RegExp(key, 'gi');
			return place[0].match(regex);
		});
	}

	populate(event, that) {
		const data = event.data;
		const key = $(this).val();
		if (key) {
			let match = that.filter(key, data);
			let matchHtml = $.map(match, place => {
				return `<li><a data-id="${place[1]}">${place[0]}</a>`;
			});
			if (matchHtml.length === 0) {
				const noMatch = `<li>no match found!</li>`;
				that.list.html(noMatch);
			}
			else {
				that.list.html(matchHtml);
			}
			that.list.show();
		}
		else {
			that.list.hide();
		}
	}

	processInput(event, that) {
		event.preventDefault();

		const loc = $(this).attr('data-id');
		console.log('location: ' + loc);

		forecast.get(loc, true);

		that.input.val('');
		that.list.hide();
	}
}

const manual = new Manual();

export default manual;