'use-strict';
const { validationResult } = require('express-validator');

const handleInputValidation = (req) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw new Error('Invalid details');
	}
};

module.exports = handleInputValidation;
