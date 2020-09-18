'use-strict';
const { Trade } = require('../models/index');
const { validationResult } = require('express-validator');

/**
 * Used with express validator
 */
const handleInputValidation = (req) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw new Error('Invalid details');
	}
};

/**
 * Checks if a particular trade can be removed from
 * or added to a security while maintaining data sanity.
 */
const checkValidityOfTradeRemovalOrAdd = async (
	tradeId,
	securityId = null,
	checkAfterLastTrade = false,
	newShares = 0
) => {
	if (securityId === null) {
		const tradeObj = await Trade.findById(tradeId)
			.select({ securityId: 1 })
			.lean();
		securityId = tradeObj.securityId;
	}
	// Find all the trades in the security except the trade with id being tradeId
	// All the trades are sorted on ascending order of their creation time.
	const allTradesInSecurity = await Trade.find({
		$and: [{ securityId }, { _id: { $ne: tradeId } }],
	})
		.sort({ createdAt: 1 })
		.select({ tradeType: 1, shares: 1 })
		.lean();

	let currentSharesCount = 0;
	allTradesInSecurity.forEach((trade) => {
		if (trade.tradeType === 'buy') currentSharesCount += trade.shares;
		else currentSharesCount -= trade.shares;

		if (currentSharesCount < 0) {
			// Invalid trade if quantity of shares are
			// becoming negative at any point. (by trade remove & update method)
			throw new Error('Invalid trade.');
		}
	});

	/**
	 * Checked when a new sell trade is being added to a security (by trade update method)
	 * It throws an error if the net shares count after the latest trade
	 * is less than the "newShares" count.
	 */
	if (checkAfterLastTrade && currentSharesCount < newShares) {
		throw new Error('Invalid trade.');
	}
};

/**
 * Checks if a particular trade can be updated
 * with new data while maintaining data sanity.
 */
const checkValidityOfTradeUpdate = async (tradeId, type, newShares) => {
	const tradeObj = await Trade.findById(tradeId)
		.select({ securityId: 1 })
		.lean();
	// Find all the trades in the security
	// All the trades are sorted on ascending order of their creation time.
	const allTradesInSecurity = await Trade.find({
		securityId: tradeObj.securityId,
	})
		.sort({ createdAt: 1 })
		.select({ tradeType: 1, shares: 1 })
		.lean();

	// Iterate over the trades and data sanity
	let currentSharesCount = 0;
	allTradesInSecurity.forEach((trade) => {
		if (trade._id.toString() === tradeId) {
			if (type === 'sell') currentSharesCount -= newShares;
			else currentSharesCount += newShares;
		} else {
			if (trade.tradeType === 'buy') currentSharesCount += trade.shares;
			else currentSharesCount -= trade.shares;
		}

		if (currentSharesCount < 0) {
			// Invalid trade if quantity of shares are
			// becoming negative at any point. (by trade update method)
			throw new Error('Invalid trade.');
		}
	});
};

module.exports = {
	handleInputValidation,
	checkValidityOfTradeUpdate,
	checkValidityOfTradeRemovalOrAdd,
};
