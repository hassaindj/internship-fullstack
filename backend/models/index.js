const sequelize = require('../config/db');
const User = require('./user');
const Product = require('./product');

module.exports = { sequelize, User, Product };
