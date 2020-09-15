'use-strict';
const { Trade, Security } = require('../models/index');

/**
 * Adds a new trade for a security
 */
const addTrade = async (price, shares, type, security) => {
	let securityObj = await Security.findOne({ name: security })
		.select({ shares: 1 })
		.lean();
	if (securityObj === null) {
		securityObj = await Security.create({ name: security });
	}

	if (type === 'sell') {
		// Check if the trade is valid, return error otherwise
		if (securityObj.shares < shares) {
			throw new Error('Invalid trade');
		}
	}
	// Create a trade object
	const trade = await Trade.create({
		price,
		shares,
		tradeType: type,
		securityId: securityObj._id,
	});
	return trade;
};

module.exports = {
	addTrade,
};
