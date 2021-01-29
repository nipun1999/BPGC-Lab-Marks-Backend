var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const courses = sequelize.define('courses', {
        course_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        course_title: { type: DataTypes.TEXT,allowNull:false },
        course_code: { type: DataTypes.TEXT,allowNull:false},
        course_instructor: {type: DataTypes.TEXT},

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

    return courses;
};
