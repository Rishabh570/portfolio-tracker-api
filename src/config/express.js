'use-strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const MongoStore = require('rate-limit-mongo');
const RateLimit = require('express-rate-limit');
const routes = require('../routes/index');
const app = express();
const { mongo } = require('../config/vars');

// Parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Set static files folder
app.use(express.static(path.join(__dirname, '../../public')));

// Enable rate limiter, prevents from DDoS attack
app.use(
	RateLimit({
		store: new MongoStore({
			uri: `${mongo}`,
			expireTimeMs: 10 * 60 * 1000, // 10 minutes
		}),
		windowMs: 10 * 60 * 1000, // 10 minutes
		max: 500, // limit each IP to 200 requests per windowMs
		headers: true,
		message: 'You have exceeded the 500 requests in 10 minutes limit!',
	})
);

// Mount API routes
app.use('/', routes);

// Error handlers
process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 err = ', err);
	console.log('Shutting down...');
	process.exit(1);
});

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 err = ', err);
	console.log('Shutting down...');
	process.exit(1);
});

// EXPORTS
module.exports = app;
