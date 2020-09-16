'use-strict';
const express = require('express');
const securityController = require('../controller/security.controller');
const router = express.Router();


/**
 * @api {get} /portfolio/holdings Shows all securities in a portfolio
 * @apiName Show portfolio holdings
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} securities object
 */
router.get('/holdings', async (req, res) => {
	try {
		const securities = await securityController.getAllSecuritiesForPortfolio();
		res.status(200).json({"securities": securities});
	} catch(err) {
		res.json({ message: err.message });
	}
});

/**
 * @api {get} /portfolio/show Shows all securities & trades in a portfolio
 * @apiName Show detailed portfolio
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} Custom object with securities & trades in those securities
 */
router.get('/show', async (req, res) => {
	try {
		const portfolioData = await securityController.getPortfolioData();
		res.status(200).json({"securities": portfolioData});
	} catch(err) {
		res.json({ message: err.message });
	}
});


/**
 * @api {get} /portfolio/returns Shows the returns for the portfolio
 * @apiName Show portfolio returns
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} object
 */
router.get('/returns', async (req, res) => {
	try {
		const cumulativeReturns = await securityController.getCumulativeReturns();
		res.status(200).json({"return": cumulativeReturns});
	} catch(err) {
		res.json({ message: err.message });
	}
});


module.exports = router;
