'use-strict';
const mongoose = require('mongoose');
const { mongo } = require('./vars');
const PROCESS_EXIT_FAIL = -1;

// Exit application on error
mongoose.connection.on('error', (err) => {
	console.error(`MongoDB connection error: ${err}`);
	process.exit(PROCESS_EXIT_FAIL);
});

/**
 * Connect to mongo db
 */
exports.connect = () => {
	mongoose.connect(mongo, {
		keepAlive: 1,
		useNewUrlParser: true,
		autoIndex: false,
		useFindAndModify: false,
	});
	return mongoose.connection;
};
