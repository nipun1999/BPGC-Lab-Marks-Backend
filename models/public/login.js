var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const login = sequelize.define('login', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        role: { type: DataTypes.TEXT, defaultValue: "student" },
        account_type: { type: DataTypes.TEXT, defaultValue: "standard_login_account" },
        
        first_name: { type: DataTypes.TEXT },
        middle_name: { type: DataTypes.TEXT },
        last_name: { type: DataTypes.TEXT },
        student_id: {type: DataTypes.TEXT},
        email: { type: DataTypes.TEXT },
        mobile: { type: DataTypes.TEXT },
        password: { type: DataTypes.TEXT },
        salt: { type: DataTypes.TEXT },
        sex: { type: DataTypes.INTEGER },
        /**
         * 1: male
         * 2: female
         * 3: other
         */

        // login_secret: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        //     defaultValue: DataTypes.UUIDV4
        // },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE
    }, {
            underscored: true
        });

    return login;
};
