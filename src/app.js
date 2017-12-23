import express from 'express';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';

const ame = express();
const port = process.env.PORT ||5000;

ame.use(cors());
ame.use(compression());
ame.use(bodyParser.urlencoded({ extended: true }));
ame.use(express.static(path.resolve(__dirname, 'public')));

ame.get('/', (req, res) => res.render('index.html'));

ame.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log('ame-app.heroku.com');
	}
});