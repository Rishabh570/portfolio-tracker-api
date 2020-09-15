'use-strict';
const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

// Open mongoose connection
mongoose.connect();

app.listen(port, () => {
	console.info(`--- 🌟 Started (${env}) at http://localhost:${port}`);
});
