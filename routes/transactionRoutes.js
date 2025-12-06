const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', transactionController.addTransaction);
router.get('/', transactionController.getTransactions);
router.delete('/:transactionId', transactionController.deleteTransaction);

module.exports = router;
