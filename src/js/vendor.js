import 'jquery';
import Raven from 'raven-js';
Raven
	.config('https://d581b40eda8a444a928b39d898380a05@sentry.io/212857')
	.install();
window.Raven = Raven;