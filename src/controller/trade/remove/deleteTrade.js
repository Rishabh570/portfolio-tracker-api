'use-strict';
const { Trade } = require('../../../models/index');
const { recalculateStatsForSecurity } = require('../../security/index');
const {
	checkValidityOfTradeRemovalOrAdd,
} = require('../../../utils/validation.util');

const deleteTrade = async (tradeId) => {
	// Throws error if removing this trade affects data sanity
	await checkValidityOfTradeRemovalOrAdd(tradeId);
	const removedTrade = await Trade.findOneAndDelete({ _id: tradeId });
	await recalculateStatsForSecurity(removedTrade.securityId);
};

module.exports = {
	deleteTrade,
};
