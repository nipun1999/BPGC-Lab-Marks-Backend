var config = require("../../config/config");

module.exports = (sequelize, DataTypes) => {
    const marks = sequelize.define('marks', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {type: DataTypes.TEXT,allowNull:false},
        course_code: { type: DataTypes.TEXT,allowNull:false},
        lab_id: {type: DataTypes.BIGINT,allowNull:false},
        student_id: {type: DataTypes.TEXT,allowNull:false},
        created_by: {type: DataTypes.TEXT,allowNull:false},
        marks: {type: DataTypes.DOUBLE,allowNull:false},
        max_marks: {type: DataTypes.BIGINT,allowNull:false},
        verified: {type: DataTypes.BOOLEAN,allowNull:false},
        recheck_request: {type: DataTypes.BOOLEAN},
        recheck_comments: {type: DataTypes.TEXT},
        updated_by: {type: DataTypes.TEXT},
        description: {type: DataTypes.TEXT,defaultValue:"No Description given by TA"},

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

    return marks;
};
