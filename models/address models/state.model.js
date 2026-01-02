import { DataTypes } from "sequelize";

const stateModel = (sequelize) => {
    return sequelize.define("State",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false },
            country_id: { type: DataTypes.INTEGER, allowNull: false },
        });
};

export default stateModel;