import express from 'express';
import bodyParser from 'body-parser';
import forecastLoader from '../modules/forecast-loader';

const apiRouter = express.Router();

apiRouter.use( bodyParser.urlencoded({extended:true}) );

apiRouter.route('/')
	.get((req, res) => {
		res.send('good job');
	})
	.post((req, res) => {
		if (typeof req.body.loc === 'undefined' || !req.body.loc) {
			return res.status(500).send('error loc is not specified');
		}

		const forecastLoader = new RequestHandler();
		const loc = JSON.parse(req.body.loc);

		const weatherProcess = (error, response, body) => {
			if (error) console.log('err ', error);
			// console.log('res ', res.statusCode);
			const forecast = JSON.parse(body);
			res.json(forecast);
		};

		forecastLoader.get('main', loc, weatherProcess);

		//res.send(`loc is ${req.body.loc}`);
	});

export default apiRouter;