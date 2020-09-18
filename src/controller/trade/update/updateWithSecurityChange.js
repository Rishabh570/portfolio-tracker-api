'use-strict';
const { createTrade } = require('../add/createTrade');
const { deleteTrade } = require('../remove/deleteTrade');
const { Trade, Security } = require('../../../models/index');
const {
	checkValidityOfTradeRemovalOrAdd,
} = require('../../../utils/validation.util');

const updateTradeWithSecurityChange = async (
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

	// Check if the dest security exists, throw error otherwise
	const destSecurityObj = await Security.findOne({ name: security }).lean();
	if (destSecurityObj === null) {
		throw new Error('There is no security with the given name.');
	}

	// First, check for any potential errors.
	if (type && tradeObj.tradeType !== type) {
		// Trade type is modified
		if (type === 'sell') {
			// Trade type -> BUY to SELL
			// Data sanity check (on source security) because a buy trade is being removed
			await checkValidityOfTradeRemovalOrAdd(tradeId);
			// Data sanity check (on dest security) because a sell trade is being added
			await checkValidityOfTradeRemovalOrAdd(
				tradeId,
				destSecurityObj._id,
				true,
				newShares
			);
		}
	} else {
		if (tradeObj.tradeType === 'buy') {
			// Data sanity check on source security only
			// because dest security is receiving a buy trade which can't have conflicts
			await checkValidityOfTradeRemovalOrAdd(tradeId);
		} else {
			// Data sanity check on dest security only
			// because source security is dropping a sell trade which can't have conflicts
			await checkValidityOfTradeRemovalOrAdd(
				tradeId,
				destSecurityObj._id,
				true,
				newShares
			);
		}
	}

	/**
	 * Remove trade from source security,
	 * recalculates the stats for source security.
	 */
	await deleteTrade(tradeId);
	/**
	 * Add trade to dest security,
	 * recalculates the stats for dest security.
	 */
	const updatedTrade = await createTrade(
		newPrice,
		newShares,
		newType,
		security
	);
	return updatedTrade;
};

module.exports = {
	updateTradeWithSecurityChange,
};
