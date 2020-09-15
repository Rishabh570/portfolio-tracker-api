'use-strict';
const mongoose = require('mongoose');

/**
 * Security model schema
 */
const securitySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			index: { unique: true },
			lowercase: true,
		},
		avgBuyPrice: {
			type: Number,
			default: 0,
		},
		shares: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: false,
	}
);

/**
 * @typedef Security
 */
const Security = mongoose.model('Security', securitySchema);
module.exports = Security;
