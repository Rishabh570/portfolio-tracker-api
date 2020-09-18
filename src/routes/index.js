'use-strict';
const express = require('express');
const router = express.Router();
const tradeRoutes = require('./trade.route');
const portfolioRoutes = require('./portfolio.route');

router.use('/trade', tradeRoutes);
router.use('/portfolio', portfolioRoutes);
router.get('/', (req, res) => {
	res.render('landing');
});

router.get('/*', (req, res) => {
	res.send('404 Not Found!');
});

module.exports = router;
