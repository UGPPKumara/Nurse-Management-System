const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('NurseManagement', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;