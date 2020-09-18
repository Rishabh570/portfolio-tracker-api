'use-strict';
const express = require('express');
const tradeController = require('../controller/trade/index');
const { validate } = require('../validations/trade.validations');
const { handleInputValidation } = require('../utils/validation.util');
const router = express.Router();

/**
 * @api {post} /trade/add
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
		res.status(200).json(tradeObject);
	} catch (err) {
		res.json({ message: err.message });
	}
});

/**
 * @api {post} /trade/remove/:tradeId
 * @apiName Removes a trade
 * @apiPermission public
 *
 * @apiParam  {String} [tradeId] trade ID
 *
 * @apiSuccess (200) {Object} Success message
 */
router.post('/remove/:tradeId', validate('removeTrade'), async (req, res) => {
	const { tradeId } = req.params;
	try {
		handleInputValidation(req);
		await tradeController.removeTrade(tradeId);
		res.status(200).json({
			message: 'Trade is removed from the portfolio.',
		});
	} catch (err) {
		res.json({ message: err.message });
	}
});

/**
 * @api {post} /trade/update/:tradeId
 * @apiName Updates a trade
 * @apiPermission public
 *
 * @apiParam  {String} [tradeId] trade ID
 *
 * @apiSuccess (200) {String} "OK"
 */
router.post('/update/:tradeId', validate('updateTrade'), async (req, res) => {
	const { tradeId } = req.params;
	const { price, shares, type, security } = req.body;
	try {
		handleInputValidation(req);
		if (!price && !shares && !type && !security) {
			res.status(200).json({ message: 'Nothing to update.' });
		} else {
			const updatedTrade = await tradeController.updateTrade(
				tradeId,
				price,
				shares,
				type,
				security
			);
			res.status(200).json(updatedTrade);
		}
	} catch (err) {
		res.json({ message: err.message });
	}
});

// EXPORTS
module.exports = router;
