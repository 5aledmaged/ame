/* eslint-disable no-console */
import webpack from 'webpack';
import config from './webpack.config.prod';
import chalk from 'chalk';

process.env.NODE_ENV = 'production'; // this assures the Babel dev config doesn't apply.

console.log(chalk.bgBlue.whiteBright('generating production bundle\n'));

webpack(config, (err, stats) => {

	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		return;
	}

	console.log(stats.toString({
		chunks: false, // Makes the build much quieter
		colors: true,
		modules: false,
		hash: false,
		children: false,
		version: false
	}));

	if (!stats.hasErrors()) {
		console.log(chalk.bgGreen.whiteBright('\napp successfully built'));
	}
	else {
		console.log(chalk.bgRed.whiteBright('build failed due to an error\n'));
		// throw new Error(`build error`);
		process.exit(1);
	}
});