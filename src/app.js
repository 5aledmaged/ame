import express from 'express';
import path from 'path';
import compression from 'compression';
import cors from 'cors';

const ame = express();
const port = process.env.PORT ||5000;

ame.use(cors())
	.use(compression())
	.use(express.static(path.resolve(__dirname, 'public')))
	.get('/', (req, res) => res.render('index.html'))
	.listen(port, (err) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('ame-app.heroku.com');
		}
	});