const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nurse = sequelize.define('Nurse', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    licenseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    hireDate: {
        type: DataTypes.DATEONLY, // Stores date as 'YYYY-MM-DD'
        allowNull: false,
    }
});

module.exports = Nurse;