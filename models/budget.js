const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Budget = sequelize.define('Budget', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    month: {
        // Storing as 'YYYY-MM' string is simple and effective for monthly budgets
        type: DataTypes.STRING,
        allowNull: false
    }
    // userId association will be added in models/index.js
});

module.exports = Budget;
