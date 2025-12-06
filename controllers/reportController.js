const { Transaction, Wallet } = require('../models');
const { Op } = require('sequelize');

exports.getMonthlyReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentMonth = new Date().toISOString().slice(0, 7); 
        const month = req.query.month || currentMonth;

        const walletInclude = {
            model: Wallet,
            where: { userId },
            attributes: []
        };

        const totalIncome = await Transaction.sum('amount', {
            where: {
                type: 'income',
                date: { [Op.startsWith]: month }
            },
            include: [walletInclude]
        }) || 0;

        const totalExpenses = await Transaction.sum('amount', {
            where: {
                type: 'expense',
                date: { [Op.startsWith]: month }
            },
            include: [walletInclude]
        }) || 0;

        const netSavings = totalIncome - totalExpenses;

        res.json({
            month,
            totalIncome,
            totalExpenses,
            netSavings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};
