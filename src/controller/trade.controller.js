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
			throw new Error('You don\'t have enough shares to perform this trade.');
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

/**
 * Checks if a particular trade can be removed
 * while maintaining data sanity.
 */
const checkTradeRemoveValidity = async (tradeId) => {
	const tradeObj = await Trade.findById(tradeId).select({securityId: 1}).lean();
	const allTradesInSecurity = await Trade.find({
		$and: [
			{securityId: tradeObj.securityId},
			{_id: {$ne: tradeId}}
		]
	})
	.select({tradeType: 1, shares: 1})
	.sort({createdAt: 1})
	.lean();

	let currentSharesCount = 0;
	allTradesInSecurity.forEach(trade => {
		if(trade.tradeType === 'buy') currentSharesCount += trade.shares;
		else currentSharesCount -= trade.shares;

		// Removal is not possible if quantity of shares are becoming negative at any point
		if(currentSharesCount < 0) {
			throw new Error("Trade cannot be removed.");
		}
	});
}


/**
 * Delete a trade
 */
const removeTrade = async (tradeId) => {
	await Trade.findOneAndDelete({_id: tradeId});
}

module.exports = {
	addTrade,
	removeTrade,
	checkTradeRemoveValidity,
};
