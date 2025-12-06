const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', budgetController.setBudget);
router.get('/', budgetController.getBudgets);

module.exports = router;
