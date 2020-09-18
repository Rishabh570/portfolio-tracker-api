'use-strict';
const { Trade, Security } = require('../../models/index');
const { fetchCumulativeReturn } = require('./fetchCumulativeReturn');
const { fetchPortfolioData } = require('./fetchPortfolioData');

/**
 * Fetches all the securities in a portfolio
 */
const getAllSecuritiesForPortfolio = async () => {
	return await Security.find().lean();
};

/**
 * Fetches the cumulative returns for the portfolio
 */
const getCumulativeReturn = async () => {
	return await fetchCumulativeReturn();
};

/**
 * Fetches all the securities in the portfolio
 * and the trades made in each security.
 */
const getPortfolioData = async () => {
	return await fetchPortfolioData();
};

/**
 * Calculates the average buy price and shares quantity
 * for security by going through the trades
 * in the order they were made/added.
 */
const recalculateStatsForSecurity = async (securityId) => {
	const allTradesForSecurity = await Trade.find({ securityId })
		.sort({ createdAt: 1 })
		.lean();
	let shares = 0;
	let avgBuyPrice = 0;
	allTradesForSecurity.map((trade) => {
		if (trade.tradeType === 'buy') {
			avgBuyPrice =
				(avgBuyPrice * shares + trade.price * trade.shares) /
				(shares + trade.shares);
			shares += trade.shares;
		} else {
			shares -= trade.shares;
		}
	});

	// Update the security object
	await Security.findByIdAndUpdate(
		securityId,
		{
			$set: {
				avgBuyPrice,
				shares,
			},
		},
		{ new: true }
	);
};

module.exports = {
	getPortfolioData,
	getCumulativeReturn,
	getAllSecuritiesForPortfolio,
	recalculateStatsForSecurity,
};
