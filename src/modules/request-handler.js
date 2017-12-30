import request from 'request';

const RequestHandler = function () {
	this.forecast = {
		main: 'weather',
		hour: 'forecast',
		day: 'forecast/daily'
	};

	this.get = function (type, location, callback) {
		if (typeof type === 'undefined') {
			console.error('forecast type is undefined');
		}
		else if (typeof location === 'undefined') {
			console.error('location object is undefined');
		}

		const options = {
			uri: `https://api.openweathermap.org/data/2.5/${this.forecast[type]}`,
			qs: {
				appid: process.env.APP_ID
			}
		};
		Object.assign(options.qs, location);

		if (callback && typeof callback === 'function') {
			request(options, callback);
		}

		// return forecast;
	};

};

export default RequestHandler;