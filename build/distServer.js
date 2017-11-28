/*eslint-disable no-console */
import express from 'express';
import open from 'open';
import compression from 'compression';
import chalk from 'chalk';

console.log(chalk.bgBlue.whiteBright('starting dist server'));

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('dist'));
app.use(compression());

app.listen(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		open(`http://localhost:${port}`);
	}
});