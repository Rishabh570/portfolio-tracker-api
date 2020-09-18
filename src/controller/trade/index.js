'use-strict';
const { createTrade } = require('./add/createTrade');
const { modifyTrade } = require('./update/modifyTrade');
const { deleteTrade } = require('./remove/deleteTrade');

/**
 * Adds a trade
 */
const addTrade = async (price, shares, type, security) => {
	return await createTrade(price, shares, type, security);
};

/**
 * Updates a trade
 */
const updateTrade = async (tradeId, price, shares, type, security) => {
	return await modifyTrade(tradeId, price, shares, type, security);
};

/**
 * Removes a trade
 */
const removeTrade = async (tradeId) => {
	await deleteTrade(tradeId);
};

module.exports = {
	addTrade,
	removeTrade,
	updateTrade,
};
