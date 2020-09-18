'use-strict';
const { Security } = require('../../models/index');
const { CURRENT_PRICE } = require('../../config/vars');

/**
 * Calculates cumulative returns for a portfolio.
 */
const fetchCumulativeReturn = async () => {
	const securities = await Security.find()
		.select({ avgBuyPrice: 1, shares: 1 })
		.lean();
	let cumulativeReturn = 0;
	securities.forEach((security) => {
		cumulativeReturn +=
			(CURRENT_PRICE - security.avgBuyPrice) * security.shares;
	});
	return cumulativeReturn;
};

module.exports = {
	fetchCumulativeReturn,
};
