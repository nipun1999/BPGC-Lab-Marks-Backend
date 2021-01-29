'use strict'

const Sequelize = require('sequelize');
var config = require("../../config/config");

var env = config.db.env;

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  schema: 'atc',
  define: {
    underscored: true
  },
  // socketPath : env.SOCKET_PATH,
  // dialectOptions: env.DIALECT_OPTIONS
//  logging: false
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Sequelize.Op;

//Models/tables
db.strips = require('./strips.js')(sequelize, Sequelize);


//Relations. To be defined in models/db.js

module.exports = db;
