'use-strict';
const { Trade } = require('../../../models/index');
const {
	checkValidityOfTradeUpdate,
} = require('../../../utils/validation.util');
const { recalculateStatsForSecurity } = require('../../security/index');

const updateTradeWithoutSecurityChange = async (
	tradeId,
	price,
	shares,
	type,
	security
) => {
	const tradeObj = await Trade.findById(tradeId).lean();
	const newShares = shares ? shares : tradeObj.shares;
	const newPrice = price ? price : tradeObj.price;
	const newType = type ? type : tradeObj.tradeType;

	// First, check for any potential errors.
	if (type && tradeObj.tradeType !== type) {
		// Trade type is modified
		if (type === 'sell') {
			// Trade type -> BUY to SELL
			// Data sanity check
			await checkValidityOfTradeUpdate(tradeId, type, newShares);
		}
	} else {
		if (
			(tradeObj.tradeType === 'buy' &&
				shares &&
				shares < tradeObj.shares) ||
			(tradeObj.tradeType === 'sell' &&
				shares &&
				shares > tradeObj.shares)
		) {
			// Data sanity check if shares of a buy trade are decreased
			// or shares of a sell trade are increased.
			await checkValidityOfTradeUpdate(
				tradeId,
				tradeObj.tradeType,
				newShares
			);
		}
	}

	/**
	 * Update the trade,
	 * recalculate the stats for the security.
	 */
	const updatedTrade = await Trade.findByIdAndUpdate(
		tradeId,
		{
			$set: {
				price: newPrice,
				shares: newShares,
				tradeType: newType,
			},
		},
		{ new: true }
	);

	await recalculateStatsForSecurity(tradeObj.securityId);
	return updatedTrade;
};

module.exports = {
	updateTradeWithoutSecurityChange,
};
