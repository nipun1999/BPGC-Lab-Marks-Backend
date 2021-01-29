'use strict'

const Sequelize = require('sequelize');
var config = require("../../config/config");

var env = config.db.env;

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  schema: env.SCHEMA,
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
db.login = require('./login.js')(sequelize, Sequelize);
db.permissions = require('./permissions.js')(sequelize, Sequelize);
db.policy = require('./policy.js')(sequelize, Sequelize);
db.courses = require('./courses.js')(sequelize, Sequelize);
db.coursesMapping = require('./coursesMapping.js')(sequelize, Sequelize);
db.marks = require('./marks.js')(sequelize, Sequelize);
db.studentUsers = require('./studentUsers.js')(sequelize, Sequelize);
db.taUsers = require('./taUsers.js')(sequelize, Sequelize);
db.adminUsers = require('./adminUsers.js')(sequelize, Sequelize);
db.labs = require('./labs.js')(sequelize, Sequelize);



// db.marks.belongsTo(db.studentUsers,{foreignKey:'student_id', onDelete:"CASCADE"});
// db.marks.belongsTo(db.labs,{foreignKey:'lab_id',onDelete:"CASCADE"})
// db.labs.belongsTo(db.courses,{foreignKey:'course_id',onDelete:"CASCADE"})
// db.coursesMapping.belongsTo(db.courses,{foreignKey:'course_id',onDelete:"CASCADE"})
// db.coursesMapping.belongsTo(db.courses,{foreignKey:'user_id',onDelete:"CASCADE"})

//Relations
// db.profile.belongsTo(db.login, {onDelete: "CASCADE"});

module.exports = db;
