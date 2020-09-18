'use-strict';
const mongoose = require('mongoose');

/**
 * Trade model schema
 */
const tradeSchema = new mongoose.Schema(
	{
		price: {
			type: Number,
			required: true,
		},
		shares: {
			type: Number,
			required: true,
		},
		securityId: {
			type: String,
			required: true,
		},
		tradeType: {
			type: String,
			enum: ['buy', 'sell'],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * @typedef Trade
 */
const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;
