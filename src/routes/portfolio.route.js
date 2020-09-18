'use-strict';
const express = require('express');
const {
	getPortfolioData,
	getCumulativeReturn,
	getAllSecuritiesForPortfolio,
} = require('../controller/security/index');
const router = express.Router();

/**
 * @api {get} /portfolio/holdings
 * @apiName Shows all securities in a portfolio
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} securities object
 */
router.get('/holdings', async (req, res) => {
	try {
		const securities = await getAllSecuritiesForPortfolio();
		res.status(200).json({ securities: securities });
	} catch (err) {
		res.json({ message: err.message });
	}
});

/**
 * @api {get} /portfolio/show
 * @apiName Shows all securities & trades in a portfolio
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} Custom object with securities & trades data
 */
router.get('/show', async (req, res) => {
	try {
		const portfolioData = await getPortfolioData();
		res.status(200).json({ securities: portfolioData });
	} catch (err) {
		res.json({ message: err.message });
	}
});

/**
 * @api {get} /portfolio/returns Shows the returns for the portfolio
 * @apiName Show portfolio returns
 * @apiPermission public
 *
 * @apiSuccess (200) {Object} cumulative returns for the portfolio
 */
router.get('/returns', async (req, res) => {
	try {
		const cumulativeReturns = await getCumulativeReturn();
		res.status(200).json({ return: cumulativeReturns });
	} catch (err) {
		res.json({ message: err.message });
	}
});

module.exports = router;
