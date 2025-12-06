const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const Budget = require('./budget');

// Associations

// User has many Wallets
User.hasMany(Wallet, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

// User has many Budgets
User.hasMany(Budget, { foreignKey: 'userId', onDelete: 'CASCADE' });
Budget.belongsTo(User, { foreignKey: 'userId' });

// Wallet has many Transactions
Wallet.hasMany(Transaction, { foreignKey: 'walletId', onDelete: 'CASCADE' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId' });

module.exports = {
    sequelize,
    User,
    Wallet,
    Transaction,
    Budget
};
