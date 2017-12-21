import $ from 'jquery';

const errorHandler = function ameErrorHandler(err, show) {
	const el = $('.ame-location-error');
	console.error(err);
	show && el.text(err).removeClass('hidden');
}

export default errorHandler;