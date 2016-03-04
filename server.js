var express = require('express'),
    errorHandler = require('errorhandler'),
    dateFormat = require('dateformat'),
    app = express();

var HOSTNAME = 'localhost',
    PORT = 8080,
    PUBLIC_DIR = __dirname + '/dist';

var reqCounter = 0;

app.use(function (req, res, done) {
	console.log('[%s] #%s [%s] %s',
              dateFormat(new Date, 'yyyy-mm-dd HH:mm:ss'),
              ++reqCounter,
              req.method,
              req.url
	);
	done();
});

app
	.use('/', express.static(PUBLIC_DIR))
	.use(errorHandler());

app.listen(PORT, function () {
	console.log("Simple static server showing %s listening at http://%s:%s", PUBLIC_DIR, HOSTNAME, PORT);
});
