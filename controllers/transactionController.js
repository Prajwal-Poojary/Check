const { Transaction, Wallet, User } = require('../models');
const { Op } = require('sequelize');

exports.addTransaction = async (req, res) => {
    const t = await require('../config/database').transaction(); // Start a DB transaction
    try {
        const { walletId, type, amount, category, date, description } = req.body;
        const userId = req.user.id;

        // Verify wallet belongs to user
        const wallet = await Wallet.findOne({ where: { id: walletId, userId } });
        if (!wallet) {
            await t.rollback();
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // Create Transaction
        const transaction = await Transaction.create({
            walletId,
            type,
            amount,
            category,
            date,
            description
        }, { transaction: t });

        // Update Wallet Balance
        let newBalance = Number(wallet.balance);
        if (type === 'income') {
            newBalance += Number(amount);
        } else if (type === 'expense') {
            newBalance -= Number(amount);
        }

        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        // Commit DB transaction
        await t.commit();

        res.status(201).json(transaction);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error adding transaction', error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { walletId, startDate, endDate } = req.query;

        const whereClause = {};

        // Filter by wallet if provided, AND check if wallet belongs to user
        // To do this efficiently, we can include the Wallet model
        const includeWallet = {
            model: Wallet,
            where: { userId },
            attributes: [] // Don't need wallet fields in result, just filtration
        };

        if (walletId) {
            includeWallet.where.id = walletId;
        }

        // Date range filter
        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereClause.date = {
                [Op.gte]: startDate
            };
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [includeWallet],
            order: [['date', 'DESC']]
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    const t = await require('../config/database').transaction();
    try {
        const { transactionId } = req.params;
        const userId = req.user.id;

        const transaction = await Transaction.findByPk(transactionId, {
            include: [{
                model: Wallet,
                where: { userId } // Ensure user owns the wallet of this transaction
            }]
        });

        if (!transaction) {
            await t.rollback();
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const wallet = transaction.Wallet;

        // Revert balance
        let newBalance = Number(wallet.balance);
        if (transaction.type === 'income') {
            newBalance -= Number(transaction.amount);
        } else if (transaction.type === 'expense') {
            newBalance += Number(transaction.amount);
        }

        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        await transaction.destroy({ transaction: t });
        await t.commit();

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error deleting transaction', error: error.message });
    }
};
