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
		if(type === 'buy' && price === undefined) {
			throw new Error('Price is required for buy trade.');
		}
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
		res.json({ message: err.message });
	}
});

/**
 * @api {post} /trade/delete/:tradeId Removes/deletes a trade
 * @apiName Remove a trade
 * @apiPermission public
 *
 * @apiParam  {String} [tradeId] trade ID
 *
 * @apiSuccess (200) {String} "OK" 
 */
router.post('/delete', validate('deleteTrade'), async (req, res) => {
	const { tradeId } = req.body;
	try {
		handleInputValidation(req);
		// Throws error if removing this trade affects data sanity
		await tradeController.checkTradeRemoveValidity(tradeId);
		await tradeController.removeTrade(tradeId);
		res.status(200).json({"message": "Trade is removed from portfolio."});
	} catch(err) {
		res.json({ message: err.message });
	}
})

// EXPORTS
module.exports = router;
