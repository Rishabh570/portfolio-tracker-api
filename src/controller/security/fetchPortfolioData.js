'use-strict';
const { Trade, Security } = require('../../models/index');

/**
 * Fetches all the securities and trades corresponding to it
 * in a portfolio.
 */
const fetchPortfolioData = async () => {
	const securities = await Security.find().lean();
	const result = securities.map((security) => {
		return new Promise((resolve, reject) => {
			Trade.find({
				securityId: security._id,
			})
				.sort({ createdAt: -1 })
				.select({
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
				})
				.lean()
				.then((tradesForSecurity) => {
					security['trades'] = tradesForSecurity;
					resolve(security);
				})
				.catch((err) => reject(err));
		});
	});

	return await Promise.all(result);
};

module.exports = {
	fetchPortfolioData,
};
