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

// Define Associations
Nurse.hasMany(DailyLog, { foreignKey: 'nurseId' });
DailyLog.belongsTo(Nurse, { foreignKey: 'nurseId' });

Client.hasMany(DailyLog, { foreignKey: 'clientId' });
DailyLog.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = DailyLog;