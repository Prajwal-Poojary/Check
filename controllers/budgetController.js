const { Budget, Transaction, Wallet } = require('../models');
const { Op } = require('sequelize');

exports.setBudget = async (req, res) => {
    try {
        const { category, amount, month } = req.body; // month format 'YYYY-MM'
        const userId = req.user.id;

        // Build unique constraint check or update if exists logic?
        // Requirement says "Set a budget". Usually implies create or update.
        let budget = await Budget.findOne({ where: { userId, category, month } });

        if (budget) {
            budget.amount = amount;
            await budget.save();
        } else {
            budget = await Budget.create({
                userId,
                category,
                amount,
                month
            });
        }

        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Error setting budget', error: error.message });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        // Allow querying for other months if needed, defaults to current
        const month = req.query.month || currentMonth;

        const budgets = await Budget.findAll({
            where: { userId, month }
        });

        // Calculate spending for each category
        // This part is "extra" but very helpful for the user: "Allow users to... track spending against budget"
        const result = await Promise.all(budgets.map(async (b) => {
            const budgetData = b.toJSON();

            const totalSpent = await Transaction.sum('amount', {
                where: {
                    category: b.category,
                    type: 'expense',
                    date: { [Op.startsWith]: month } // Matches YYYY-MM-DD
                },
                include: [{
                    model: Wallet,
                    where: { userId }
                }]
            });

            budgetData.spent = totalSpent || 0;
            budgetData.remaining = budgetData.amount - (totalSpent || 0);

            // Notify if approaching limit (simple flag in response)
            if (budgetData.spent >= budgetData.amount) {
                budgetData.alert = "Budget Exceeded!";
            } else if (budgetData.spent >= budgetData.amount * 0.9) {
                budgetData.alert = "Approaching Limit (90% used)";
            }

            return budgetData;
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching budgets', error: error.message });
    }
};
