'use-strict';
// import .env variables
require('dotenv-safe').config();

const { env } = process; // this has ".env" keys & values

module.exports = {
	env: env.NODE_ENV,
	BASE_URL: env.BASE_URL,
	port: env.PORT,
	mongo: env.MONGO_URI,
	CURRENT_PRICE: env.CURRENT_PRICE,
};
