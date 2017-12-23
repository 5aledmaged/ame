import express from 'express';
import path from 'path';

const ame = express();
const port = process.env.PORT ||5000;

ame.use(express.static(path.resolve(__dirname, 'public')))
	.get('/', (req, res) => res.render('index.html'))
	.listen(port, (err) => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('ame-app.heroku.com');
		}
	});