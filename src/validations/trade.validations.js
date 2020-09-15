'use-strict';
const { body } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'addTrade': {
			return [
				body('price').exists().isNumeric(),
				body('shares').exists().isInt(),
				body('type')
					.exists()
					.isString()
					.trim()
					.escape()
					.isIn(['buy', 'sell']),
				body('security').exists().isString().trim().escape(),
			];
		}
	}
};
