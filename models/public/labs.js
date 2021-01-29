var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const labs = sequelize.define('labs', {
        lab_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        course_code: { type: DataTypes.TEXT,allowNull:false},
        course_id: {type: DataTypes.TEXT,allowNull:false},
        lab_title: {type: DataTypes.TEXT,allowNull:false},
        created_by: {type: DataTypes.TEXT,allowNull:false},
        lab_marks: {type: DataTypes.BIGINT,allowNull:false},
        lab_average: {type: DataTypes.DOUBLE,defaultValue:0},
        leaderboard_active: {type: DataTypes.BOOLEAN,defaultValue:false},
        editing_active: {type: DataTypes.BOOLEAN,defaultValue:false},
    
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

    return labs;
};
