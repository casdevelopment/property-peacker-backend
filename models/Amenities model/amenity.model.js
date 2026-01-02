import { DataTypes } from "sequelize";

const amenitiesModel = (sequelize) => {
    return sequelize.define("Amenity", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: {
            type: DataTypes.STRING,
            allowNull: false, unique: true,
            validate: { notEmpty: { msg: 'Amenity name is required' } },
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            validate: { notEmpty: { msg: 'Amenity name is required' } },
        },
    });
}
export default amenitiesModel;