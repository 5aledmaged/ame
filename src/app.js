import express from 'express';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import ReqHand from './modules/request-handler';

const requestHandler = new ReqHand();
requestHandler.get('main', {id: 361058});

const ame = express();
const port = process.env.PORT ||5000;

ame.use(cors());
ame.use(compression());
ame.use(bodyParser.urlencoded({ extended: true }));
ame.use(express.static(path.resolve(__dirname, 'public')));

ame.get('/', (req, res) => {
	res.render('index.html');
});

ame.post('/cities', (req, res) => {
	const id = req.body.id; // country
	fs.readFile(path.join(__dirname, 'public', 'data', 'city.json'), 'utf-8', function (err, cities) {
		if (err) {
			res.status(500).send(err);
		}
		else {
			cities = JSON.parse(cities)[id]; // get all cities of country
			res.json(cities);
		}
	});
});

ame.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log('ame-app.heroku.com');
	}
});