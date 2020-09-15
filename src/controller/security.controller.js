'use-strict';
const { Trade, Security } = require('../models/index');

const recalculateStatsForSecurity = async (securityId) => {
	const allTradesForSecurity = await Trade.find(
		{ securityId },
		'price shares tradeType'
	)
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

module.exports = {
	recalculateStatsForSecurity,
};
