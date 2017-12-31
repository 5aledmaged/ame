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
			res.status(500).send('error loc is not specified');
			return;
		}
		const loc = JSON.parse(req.body.loc);
		const sendResponse = forecast => {
			res.json(forecast);
		};
		forecastLoader(loc, sendResponse);
	});

export default apiRouter;