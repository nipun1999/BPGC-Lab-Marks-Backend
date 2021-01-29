
module.exports = (sequelize, DataTypes) => {
    const strips = sequelize.define('strips', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            // defaultValue: DataTypes.UUIDV4
        },

        type:{ type: DataTypes.TEXT},
        make:{ type: DataTypes.TEXT},
        wake:{ type: DataTypes.TEXT},
        callsign:{ type: DataTypes.TEXT},
        alt:{ type: DataTypes.INTEGER},
        speed:{ type: DataTypes.INTEGER},
        rnw:{ type: DataTypes.TEXT},
        status:{ type: DataTypes.INTEGER},

        // Controller data
        login_id:{ type: DataTypes.BIGINT},

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,

    }, {
        underscored: true
    });

    /////////
    // strips.addHook('afterCreate', 'updateCache', (user, options) => {
    //     // Time to update redis
    // });
    /////////

    return strips;
};
