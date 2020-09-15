'use-strict';
const express = require('express');
const tradeController = require('../controller/trade.controller');
const securityController = require('../controller/security.controller');
const { validate } = require('../validations/trade.validations');
const handleInputValidation = require('../utils/validation');
const router = express.Router();

/**
 * @api {post} /trade/add Add a trade
 * @apiName Add new trade
 * @apiPermission public
 *
 * @apiParam  {String} [price] price
 * @apiParam  {Number} [shares] quantity of shares
 * @apiParam  {String} [type] trade type (buy or sell)
 * @apiParam  {String} [security] name of security
 *
 * @apiSuccess (200) {Object} trade object
 */
router.post('/add', validate('addTrade'), async (req, res) => {
	const { price, shares, type, security } = req.body;
	try {
		handleInputValidation(req);
		const tradeObject = await tradeController.addTrade(
			price,
			shares,
			type,
			security
		);
		await securityController.recalculateStatsForSecurity(
			tradeObject.securityId
		);
		res.status(200).json(tradeObject);
	} catch (err) {
		console.log('err: ', err);
		res.json({ message: err.message });
	}
});

// EXPORTS
module.exports = router;
