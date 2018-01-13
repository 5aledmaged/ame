import rp from 'request-promise-native';

const forecastLoader = (location, callback) => {
		if (typeof location === 'undefined') {
			return console.error('location object is undefined');
		}

		const qs = {
			appid: process.env.APP_ID,
			units: 'metric'
		};

		Object.assign(qs, location);

		const options = {
			main: {
				uri: 'https://api.openweathermap.org/data/2.5/weather',
				qs
			},
			hourly: {
				uri: 'https://api.openweathermap.org/data/2.5/forecast',
				qs
			},
			daily: {
				uri: 'https://api.openweathermap.org/data/2.5/forecast/daily',
				qs
			}
		};

		const forecast = {
			main: {},
			hourly: [],
			daily: []
		};

		const processTemprature = temprature => {
			return {
				c: Math.round(temprature) + '\u00b0c',
				f: Math.round((9 / 5) * temprature + 32) + '\u00b0f'
			}
		}

		const processMainForecast = res => {
			forecast.main = {
				temp: processTemprature(res.main.temp),
				icon: res.weather[0].icon,
				location: res.name + ', ' + res.sys.country,
				info: res.weather[0].description,
				time: new Date()
			};
			forecast.id = res.id;	// city id
		};

		const processHourlyForecast = res => {
			for (let i = 0; i <= 3; i++) { /* save forecast for next 4 hours only */
				forecast.hourly[i] = {
					temp: processTemprature(res.list[i].main.temp),
					icon: res.list[i].weather[0].icon,
					time: res.list[i].dt_txt.split(' ')[1].substr(0, 5)
				};
			}
		};

		const processDailyForecast = res => {
			for (let i = 0; i <= 3; i++) { /* save forecast for next 4 days only */
				const date = new Date(res.list[i+1].dt * 1000);
				forecast.daily[i] = {
					temp: {
						min: processTemprature(res.list[i + 1].temp.min),
						max: processTemprature(res.list[i + 1].temp.max)
					},
					icon: res.list[i+1].weather[0].icon,
					time: date.getDate() + '/' + (date.getMonth() + 1)
				};
			}
		};

		Promise.all([
			rp(options.main),
			rp(options.hourly),
			rp(options.daily)
		]).then(res => {
			const mainForecast = JSON.parse(res[0]);
			const hourlyForecast = JSON.parse(res[1]);
			const dailyForecast = JSON.parse(res[2]);
			processMainForecast(mainForecast);
			processHourlyForecast(hourlyForecast);
			processDailyForecast(dailyForecast);
			if (callback && typeof callback === 'function') {
				callback(forecast);
			}
			else {
				console.error('callback is not provided');
			}
		});


};

export default forecastLoader;