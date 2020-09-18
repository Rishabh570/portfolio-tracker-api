'use-strict';
const { body, param } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'addTrade': {
			return [
				body('price')
					.exists()
					.isNumeric()
					.custom((value) => {
						return value > 0;
					}),
				body('shares')
					.exists()
					.isInt()
					.custom((value) => {
						return value > 0;
					}),
				body('type')
					.exists()
					.isString()
					.trim()
					.escape()
					.isIn(['buy', 'sell']),
				body('security').exists().trim().escape().isString(),
			];
		}
		case 'removeTrade': {
			return [param('tradeId').exists().isString()];
		}
		case 'updateTrade': {
			return [
				param('tradeId').exists().isString(),
				body('price')
					.optional()
					.isNumeric()
					.custom((value) => {
						return value > 0;
					}),
				body('shares')
					.optional()
					.isNumeric()
					.custom((value) => {
						return value > 0;
					}),
				body('type')
					.optional()
					.isString()
					.trim()
					.escape()
					.isIn(['buy', 'sell']),
				body('security').optional().trim().escape().isString(),
			];
		}
	}
};
