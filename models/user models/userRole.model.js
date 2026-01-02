import { DataTypes } from 'sequelize';

const UserRoleModel = (sequelize) => {
    return sequelize.define('userRole', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
    }, {
        timestamps: true,
        tableName: 'user_roles'
    });
};

export default UserRoleModel;
