'use-strict';
const { Trade, Security } = require('../models/index');
const { CURRENT_PRICE } = require('../config/vars');

/**
 * Fetches all the securities in a portfolio
 */
const getAllSecuritiesForPortfolio = async () => {
	return await Security.find().lean();
}

/**
 * Calculates the average buy price and shares quantity
 * for securities by going through the trades
 * in the order they were made/added.
 */
const recalculateStatsForSecurity = async (securityId) => {
	const allTradesForSecurity = await Trade.find(
		{ securityId }
	)
		.select({price: 1, shares: 1, tradeType: 1})
		.lean()
		.sort({ createdAt: 1 });
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

	const securityObj = await Security.findById(securityId);
	securityObj.avgBuyPrice = avgBuyPrice;
	securityObj.shares = shares;
	await securityObj.save();
};

/**
 * Fetches all the securities and trades corresponding to it
 * in a portfolio.
 */
const getPortfolioData = async () => {
	const securities = await Security.find().select({__v: 0}).lean();
	const result = securities.map(security => {
		return new Promise((resolve, reject) => {
			Trade.find({securityId: security._id}).sort({createdAt: -1}).select({createdAt: 0, updatedAt: 0, __v: 0}).lean()
			.then(tradesForSecurity => {
				security['trades'] = tradesForSecurity;
				resolve(security);
			})
			.catch(err => reject(err));
		})
	});

	return await Promise.all(result);
}

/**
 * Calculates cumulative returns for a portfolio.
 */
const getCumulativeReturns = async () => {
	const securities = await Security.find().select({avgBuyPrice: 1, shares: 1}).lean();
	let cumulativeReturn = 0;
	securities.forEach(security => {
		cumulativeReturn += (CURRENT_PRICE - security.avgBuyPrice) * security.shares;
	});
	return cumulativeReturn;
}


module.exports = {
	getPortfolioData,
	getCumulativeReturns,
	recalculateStatsForSecurity,
	getAllSecuritiesForPortfolio,
};
