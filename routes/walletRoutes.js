const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken); // Protect all wallet routes

router.post('/', walletController.createWallet);
router.get('/', walletController.getWallets);
router.delete('/:walletId', walletController.deleteWallet);

module.exports = router;
