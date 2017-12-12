/*eslint-disable no-console */
import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';

const port = process.env.PORT || 3000;
const app = express();
const compiler = webpack(config);

app.use( require('webpack-dev-middleware')(compiler, { publicPath: config.output.publicPath }) );

app.use( express.static('../src') );

app.listen(port, function(err) {
	if (err) {
		console.log(err);
	}
	else {
		open('http://localhost:' + port);
	}
});