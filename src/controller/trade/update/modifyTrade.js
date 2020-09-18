'use-strict';
const { Trade } = require('../../../models/index');
const { updateTradeWithSecurityChange } = require('./updateWithSecurityChange');
const {
	updateTradeWithoutSecurityChange,
} = require('./updateWithoutSecurityChange');

/**
 * Update a trade
 * Change in security is taken into consideration before
 * further execution.
 */
const modifyTrade = async (tradeId, price, shares, type, security) => {
	const tradeObj = await Trade.findById(tradeId).lean();

	if (security && tradeObj.securityId !== security) {
		// Security is modified
		return await updateTradeWithSecurityChange(
			tradeId,
			price,
			shares,
			type,
			security
		);
	}
	return await updateTradeWithoutSecurityChange(
		tradeId,
		price,
		shares,
		type,
		security
	);
};

module.exports = {
	modifyTrade,
};
