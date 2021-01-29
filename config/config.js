var db = {
    staging: {
        DATABASE_HOST: 'database-1.cwuuty8fxdjz.us-east-2.rds.amazonaws.com',
        DATABASE_NAME: 'database-1',
        DATABASE_USERNAME: 'database-username',
        DATABASE_PASSWORD: 'dataabse-password',
        DATABASE_PORT: 5432,
        DATABASE_DIALECT: 'postgres',
        NODE_ENV: process.env.NODE_ENV || 'staging',
        SCHEMA: "public",
    },
    prod: {
        DATABASE_HOST: process.env.DATABASE_HOST || '/cloudsql/generic-services:asia-south1:services-database',
        DATABASE_NAME: process.env.DATABASE_NAME || 'services',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'services',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'services',
        DATABASE_PORT: process.env.DATABASE_PORT || 5432,
        DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'postgres',
        NODE_ENV: process.env.NODE_ENV || 'production',
        SCHEMA: "public",
    },

    rg: {
        DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
        DATABASE_NAME: process.env.DATABASE_NAME || 'database-name',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'database-username',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'database-password',
        DATABASE_PORT: process.env.DATABASE_PORT || 5432,
        DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'postgres',
        NODE_ENV: process.env.NODE_ENV || 'production',
        SCHEMA: "public",
    },


};

var cache = {
    rg: {
        host: 'localhost',
        port: 6379
    }
};

var config = {
    dialect: "postgres",
    app: {
        jwtKey: '',
        sessionKey: "",
        port: process.env.PORT || '4192',
        name: "generic Services API Platform",
        local_domain: "http://localhost:" + (process.env.PORT || '4192') + "/api/v1",
    },

    db: {
        env: db.rg, // This is where we set the environment of the db
        cache: cache.rg
    },

    apiKeys: {
        sendGrid: ""
    },
    cloud: {
        gcp: {
            service_account_path: "./config/creds/firebase-admin-sdk-service-account.json",
            project_id: "generic-services",
            storage: {
                bucket_name: "generic-services.appspot.com"
            },
            firebase: {
                server_key: "the server key"
            }
        }
    }

};

module.exports = config;

// To convert js config to json
if (require.main == module) {
    var fs = require('fs');
    var path = require('path');

    console.log("The current config is \n\n\n");

    var config_string = JSON.stringify(config, null, 4);
    console.log(config_string);
    console.log("\n\n\n");

    // Write the config string to a file here, most preferably app_config.json    
    var file_path = path.join(__dirname, 'app_config.json');
    console.log("Saving the config file at:  " + file_path);
    console.log("\n\n\n");
    
}
