const { Wallet } = require('../models');

exports.createWallet = async (req, res) => {
    try {
        const { name, balance } = req.body;
        const userId = req.user.id;

        const wallet = await Wallet.create({
            name,
            balance: balance || 0,
            userId
        });

        res.status(201).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error creating wallet', error: error.message });
    }
};

exports.getWallets = async (req, res) => {
    try {
        const userId = req.user.id;
        const wallets = await Wallet.findAll({ where: { userId } });
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wallets', error: error.message });
    }
};

exports.deleteWallet = async (req, res) => {
    try {
        const { walletId } = req.params;
        const userId = req.user.id;

        const result = await Wallet.destroy({ where: { id: walletId, userId } });

        if (result === 0) {
            return res.status(404).json({ message: 'Wallet not found or unauthorized' });
        }

        res.json({ message: 'Wallet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting wallet', error: error.message });
    }
};
