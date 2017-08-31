import express from 'express';
import path from 'path';
import open from 'open';

const port = 3000;
let app = express();

app.get(/.{0,}/, function(req, res) {
		res.sendFile(path.join(__dirname, '../src' + req.url));
});

app.listen(port, function(err) {
	if (err) {
		console.log(err);
	}
	else {
		open('http://localhost:' + port);
	}
});