'use-strict';
const { body } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'addTrade': {
			return [
				body('price').optional().isNumeric().custom(value => {return value > 0;}),
				body('shares').exists().isNumeric().custom(value => {return value > 0;}),
				body('type')
					.exists()
					.isString()
					.trim()
					.escape()
					.isIn(['buy', 'sell']),
				body('security').exists().trim().escape().isString(),
			];
		}
		case 'deleteTrade': {
			return [
				body('tradeId').exists().isString()
			];
		}
	}
};
