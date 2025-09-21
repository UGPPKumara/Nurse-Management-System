const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Nurse = require('./Nurse');
const Client = require('./Client');

const DailyLog = sequelize.define('DailyLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// --- FIX: Added Associations ---
// These lines are crucial for connecting the tables
DailyLog.belongsTo(Nurse, { foreignKey: 'nurseId' });
Nurse.hasMany(DailyLog, { foreignKey: 'nurseId' });

DailyLog.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasMany(DailyLog, { foreignKey: 'clientId' });
// -----------------------------

module.exports = DailyLog;