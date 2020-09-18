'use-strict';
const { Trade, Security } = require('../../../models/index');
const { recalculateStatsForSecurity } = require('../../security/index');

/**
 * Adds a new trade for a security
 */
const createTrade = async (price, shares, type, security) => {
	// If there is no security with the given name, we create it
	let securityObj = await Security.findOne({ name: security }).lean();
	if (securityObj === null) {
		securityObj = await Security.create({ name: security });
	}
	const data = {
		price,
		shares,
		tradeType: type,
		securityId: securityObj._id,
	};

	if (type === 'sell') {
		// Check if the trade is valid, return error otherwise
		if (securityObj.shares < shares) {
			throw new Error(
				"You don't have enough shares to perform this trade."
			);
		}
	}
	// Create a buy trade object
	const buyTradeObj = await Trade.create(data);
	await recalculateStatsForSecurity(buyTradeObj.securityId);
	return buyTradeObj;
};

module.exports = {
	createTrade,
};
