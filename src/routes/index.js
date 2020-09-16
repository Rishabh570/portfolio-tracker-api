'use-strict';
const express = require('express');
const router = express.Router();
const tradeRoutes = require('./trade.route');
const portfolioRoutes = require('./security.route');

router.get('/', (req, res) => res.send('OK!'));
router.use('/trade', tradeRoutes);
router.use('/portfolio', portfolioRoutes);

module.exports = router;
