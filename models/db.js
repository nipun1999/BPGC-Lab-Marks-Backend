const Sequelize = require('sequelize');
var config = require("../config/config");

const db = {};

// The cache configuration
var Redis = require('ioredis');
db.cache = Redis;


db.Sequelize = Sequelize; // For easier querying.
// db.sequelize = sequelize; // Connections are handled in the individual db instances
db.Op = Sequelize.Op; // Very important
db.public = require("./public/db");
db.atc = require("./atc/db");
// db.atc = require("./atc/db");
 
// Define all relationships here, and not in the individual files

// Permissions
db.atc.strips.belongsTo(db.public.login, {onDelete: "CASCADE"});
/// In case of RBAC
db.public.permissions.belongsTo(db.public.login, {onDelete: 'CASCADE'});
db.public.permissions.belongsTo(db.public.login, {onDelete: 'CASCADE', as: 'created_by'});
db.public.permissions.belongsTo(db.public.policy, {onDelete: 'CASCADE'});



// db.public.kv.belongsTo(db.public.permissions)

// Hooks come here
// db.atc.strips.addHook('afterCreate', 'updateCache', async (strip, options) => {
//     // Time to update redis
//     console.log("updating redis cache");
//     var redis = new db.cache(config.db.cache);
//     console.log("The strip data is:  ");
//     console.log(JSON.stringify(strip));

//     /**
//      * Here, add this flight to the controllers list and then add this flight to the cache as well
//      * 
//      * controller key
//      * 
//      * ctrl_flight_ID : []
//      * 
//      * Flight key: flight_ID
//      */

//     var key = 'ctrl_flight_' + strip.login_id;
//     var ctrl_managed = await redis.rpush(key, strip.id);
//     console.log("The ctrl managed is");
//     console.log(ctrl_managed);
//     // Now the flight in the bay.
//     key = 'flight_' + strip.id;
//     flight_key_set = await redis.set(key, JSON.stringify(strip));
//     console.log("the flight set is");
//     console.log(flight_key_set);
// });


module.exports = db;
