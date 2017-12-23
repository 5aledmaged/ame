'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ame = (0, _express2.default)();
var port = process.env.PORT || 5000;

ame.use((0, _cors2.default)());
ame.use((0, _compression2.default)());
ame.use(_bodyParser2.default.urlencoded({ extended: true }));
ame.use(_express2.default.static(_path2.default.resolve(__dirname, 'public')));

ame.get('/', function (req, res) {
	res.render('index.html');
});

ame.post('/cities', function (req, res) {
	var id = req.body.id; // country
	_fs2.default.readFile(_path2.default.join(__dirname, 'public', 'data', 'city.json'), 'utf-8', function (err, cities) {
		if (err) {
			res.status(500).send(err);
		} else {
			cities = JSON.parse(cities)[id]; // get all cities of country
			res.json(cities);
		}
	});
});

ame.listen(port, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('ame-app.heroku.com');
	}
});
